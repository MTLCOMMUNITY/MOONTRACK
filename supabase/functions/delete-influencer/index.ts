// @ts-nocheck
// @ts-ignore
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

declare const Deno: any;

Deno.serve(async (req: Request) => {
  const origin = req.headers.get('origin') ?? ''
  const appUrl = Deno.env.get('APP_URL') ?? 'https://moontrack.vercel.app'
  const allowedOrigins = ['http://localhost:5173', 'http://localhost:3000', appUrl]
  const corsOrigin = allowedOrigins.includes(origin) ? origin : appUrl

  const CORS = {
    'Access-Control-Allow-Origin': corsOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
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
  const { influencer_id } = await req.json()

  if (!influencer_id) {
    return new Response(JSON.stringify({ error: 'Missing required field: influencer_id' }), {
      status: 400, headers: { ...CORS, 'Content-Type': 'application/json' },
    })
  }

  // 3. Get the user_id of the influencer
  const { data: influencer, error: infErr } = await supabaseAdmin
    .from('influencers')
    .select('user_id')
    .eq('id', influencer_id)
    .single()

  if (infErr || !influencer) {
    return new Response(JSON.stringify({ error: 'Influencer not found' }), {
      status: 404, headers: { ...CORS, 'Content-Type': 'application/json' },
    })
  }

  // 4. Delete their referral links (if no cascade)
  await supabaseAdmin
    .from('referral_links')
    .delete()
    .eq('influencer_id', influencer_id)

  // 5. Delete the influencer record (if payments/conversions exist without CASCADE, this might fail, protecting data)
  const { error: delInfErr } = await supabaseAdmin
    .from('influencers')
    .delete()
    .eq('id', influencer_id)

  if (delInfErr) {
    return new Response(JSON.stringify({ error: 'Cannot delete: ' + delInfErr.message }), {
      status: 400, headers: { ...CORS, 'Content-Type': 'application/json' },
    })
  }

  // 6. Delete their auth user account
  const { error: delAuthErr } = await supabaseAdmin.auth.admin.deleteUser(influencer.user_id)

  if (delAuthErr) {
    return new Response(JSON.stringify({ error: 'Partially deleted, but failed to remove auth account: ' + delAuthErr.message }), {
      status: 500, headers: { ...CORS, 'Content-Type': 'application/json' },
    })
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200, headers: { ...CORS, 'Content-Type': 'application/json' },
  })
})
