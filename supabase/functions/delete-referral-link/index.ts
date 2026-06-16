// @ts-nocheck
// @ts-ignore
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

declare const Deno: any;

const rateLimit = new Map<string, { count: number; timestamp: number }>()

Deno.serve(async (req: Request) => {
  const origin = req.headers.get('origin') ?? ''
  const appUrl = Deno.env.get('APP_URL') ?? 'https://moontrack.moontechlife.com'
  const allowedOrigins = ['http://localhost:5173', 'http://localhost:3000', appUrl]
  const corsOrigin = allowedOrigins.includes(origin) ? origin : appUrl

  const CORS = {
    'Access-Control-Allow-Origin': corsOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  }
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS })
  }

  const clientIp = req.headers.get('x-forwarded-for') || 'unknown'
  const now = Date.now()

  for (const [ip, record] of rateLimit.entries()) {
    if (now - record.timestamp > 60000) rateLimit.delete(ip)
  }

  const userRecord = rateLimit.get(clientIp) || { count: 0, timestamp: now }
  if (now - userRecord.timestamp > 60000) {
    userRecord.count = 1
    userRecord.timestamp = now
  } else {
    userRecord.count++
  }
  rateLimit.set(clientIp, userRecord)

  if (userRecord.count > 10) {
    return new Response(
      JSON.stringify({ error: 'Too many requests. Please try again later.' }),
      { status: 429, headers: { ...CORS, 'Content-Type': 'application/json' } }
    )
  }

  const authHeader = req.headers.get('Authorization')
  if (!authHeader) {
    return new Response(JSON.stringify({ error: 'Missing auth header' }), {
      status: 401,
      headers: { ...CORS, 'Content-Type': 'application/json' },
    })
  }

  const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  const token = authHeader.replace('Bearer ', '')
  const {
    data: { user },
    error: userErr,
  } = await supabaseAdmin.auth.getUser(token)

  if (userErr || !user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { ...CORS, 'Content-Type': 'application/json' },
    })
  }

  const { data: adminRow } = await supabaseAdmin
    .from('admins')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!adminRow) {
    return new Response(JSON.stringify({ error: 'Forbidden: Admins only' }), {
      status: 403,
      headers: { ...CORS, 'Content-Type': 'application/json' },
    })
  }

  const { link_id } = await req.json()
  if (!link_id) {
    return new Response(JSON.stringify({ error: 'Missing link_id' }), {
      status: 400,
      headers: { ...CORS, 'Content-Type': 'application/json' },
    })
  }

  const { data, error } = await supabaseAdmin.rpc('admin_delete_referral_link', {
    p_link_id: link_id,
  })

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...CORS, 'Content-Type': 'application/json' },
    })
  }

  return new Response(JSON.stringify({ ok: true, result: data }), {
    status: 200,
    headers: { ...CORS, 'Content-Type': 'application/json' },
  })
})
