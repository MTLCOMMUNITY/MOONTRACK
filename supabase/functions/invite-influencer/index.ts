// @ts-nocheck
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS })

  // 1. Verify the requester is an admin
  const authHeader = req.headers.get('Authorization')
  if (!authHeader) {
    return new Response(JSON.stringify({ error: 'Missing auth header' }), {
      status: 401, headers: { ...CORS, 'Content-Type': 'application/json' },
    })
  }

  const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  const token = authHeader.replace('Bearer ', '')
  const { data: { user }, error: userErr } = await supabaseAdmin.auth.getUser(token)

  if (userErr || !user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401, headers: { ...CORS, 'Content-Type': 'application/json' },
    })
  }

  // Check if they exist in the admins table
  const { data: adminRow } = await supabaseAdmin
    .from('admins')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!adminRow) {
    return new Response(JSON.stringify({ error: 'Forbidden: Admins only' }), {
      status: 403, headers: { ...CORS, 'Content-Type': 'application/json' },
    })
  }

  // 2. Parse request body
  const { email, full_name, ref_code, commission_rate } = await req.json()

  if (!email || !full_name || !ref_code) {
    return new Response(JSON.stringify({ error: 'Missing required fields' }), {
      status: 400, headers: { ...CORS, 'Content-Type': 'application/json' },
    })
  }

  // 3. Invite the user
  const { data: inviteData, error: inviteErr } = await supabaseAdmin.auth.admin.inviteUserByEmail(email)

  if (inviteErr) {
    return new Response(JSON.stringify({ error: inviteErr.message }), {
      status: 400, headers: { ...CORS, 'Content-Type': 'application/json' },
    })
  }

  // 4. Create influencer record
  const { error: rowErr } = await supabaseAdmin.from('influencers').insert({
    user_id: inviteData.user.id,
    full_name,
    email,
    ref_code,
    commission_rate: commission_rate || 10,
  })

  if (rowErr) {
    return new Response(JSON.stringify({ error: rowErr.message }), {
      status: 400, headers: { ...CORS, 'Content-Type': 'application/json' },
    })
  }

  // 5. Create referral link automatically
  const { data: inf } = await supabaseAdmin
    .from('influencers')
    .select('id')
    .eq('user_id', inviteData.user.id)
    .single()

  if (inf) {
    await supabaseAdmin.from('referral_links').insert({
      influencer_id: inf.id,
      ref_code,
      target_url: 'https://moontechlife.com/register',
      is_active: true,
    })
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200, headers: { ...CORS, 'Content-Type': 'application/json' },
  })
})
