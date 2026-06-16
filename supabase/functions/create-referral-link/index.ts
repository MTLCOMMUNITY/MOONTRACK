// @ts-nocheck
// @ts-ignore
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import {
  isValidReferralCode,
  normalizeReferralCode,
} from '../_shared/referral-code.ts'

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

  const { influencer_id, ref_code, target_url } = await req.json()
  const normalizedRefCode =
    typeof ref_code === 'string' ? normalizeReferralCode(ref_code) : ''

  if (!influencer_id || !normalizedRefCode) {
    return new Response(JSON.stringify({ error: 'Missing required fields' }), {
      status: 400,
      headers: { ...CORS, 'Content-Type': 'application/json' },
    })
  }

  if (!isValidReferralCode(normalizedRefCode)) {
    return new Response(
      JSON.stringify({
        error:
          'Referral code must be 1-64 characters and contain only letters, numbers, hyphens, or underscores.',
      }),
      {
        status: 400,
        headers: { ...CORS, 'Content-Type': 'application/json' },
      }
    )
  }

  const { data, error } = await supabaseAdmin.rpc('admin_create_referral_link', {
    p_influencer_id: influencer_id,
    p_ref_code: normalizedRefCode,
    p_target_url: target_url ?? 'https://moontechlife.com/register',
  })

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...CORS, 'Content-Type': 'application/json' },
    })
  }

  return new Response(JSON.stringify({ ok: true, link: data }), {
    status: 200,
    headers: { ...CORS, 'Content-Type': 'application/json' },
  })
})
