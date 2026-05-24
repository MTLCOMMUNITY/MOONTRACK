// @ts-nocheck
// @ts-ignore
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

declare const Deno: any;

Deno.serve(async (req: Request) => {
  const CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  }
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
  const { influencer_id, is_active } = await req.json()

  if (!influencer_id || typeof is_active !== 'boolean') {
    return new Response(JSON.stringify({ error: 'Missing required fields: influencer_id, is_active' }), {
      status: 400, headers: { ...CORS, 'Content-Type': 'application/json' },
    })
  }

  // 3. Update the influencer's status
  const { error: updateErr } = await supabaseAdmin
    .from('influencers')
    .update({ is_active })
    .eq('id', influencer_id)

  if (updateErr) {
    return new Response(JSON.stringify({ error: updateErr.message }), {
      status: 400, headers: { ...CORS, 'Content-Type': 'application/json' },
    })
  }

  // 4. Also update their referral links to match the new status
  await supabaseAdmin
    .from('referral_links')
    .update({ is_active })
    .eq('influencer_id', influencer_id)

  return new Response(JSON.stringify({ ok: true }), {
    status: 200, headers: { ...CORS, 'Content-Type': 'application/json' },
  })
})
