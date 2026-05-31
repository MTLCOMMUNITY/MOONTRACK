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
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'no-referrer',
  }

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS })
  }

  // Rate Limiting (10 requests per minute per IP)
  const clientIp = req.headers.get('x-forwarded-for') || 'unknown'
  const now = Date.now()
  const userRecord = rateLimit.get(clientIp) || { count: 0, timestamp: now }

  if (now - userRecord.timestamp > 60000) {
    userRecord.count = 1
    userRecord.timestamp = now
  } else {
    userRecord.count++
  }
  rateLimit.set(clientIp, userRecord)

  if (userRecord.count > 10) {
    return new Response(JSON.stringify({ error: 'Too many requests' }), {
      status: 429,
      headers: { ...CORS, 'Content-Type': 'application/json' },
    })
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: CORS })
  }

  let ref_code: string | undefined

  try {
    const body = await req.json()
    ref_code = body?.ref_code
  } catch {
    return new Response('Invalid JSON', { status: 400, headers: CORS })
  }

  if (!ref_code || typeof ref_code !== 'string' || ref_code.trim() === '') {
    return new Response(
      JSON.stringify({ error: 'ref_code is required' }),
      { status: 400, headers: { ...CORS, 'Content-Type': 'application/json' } }
    )
  }

  // Sanitise — only allow alphanumeric, underscore, hyphen
  if (!/^[a-zA-Z0-9_-]{1,64}$/.test(ref_code)) {
    return new Response(
      JSON.stringify({ error: 'Invalid ref_code format' }),
      { status: 400, headers: { ...CORS, 'Content-Type': 'application/json' } }
    )
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  const { error } = await supabase.rpc('increment_click_count', {
    p_ref_code: ref_code.trim(),
  })

  if (error) {
    console.error('increment_click_count error:', error.message)
    return new Response(
      JSON.stringify({ error: 'Failed to track click' }),
      { status: 500, headers: { ...CORS, 'Content-Type': 'application/json' } }
    )
  }

  return new Response(
    JSON.stringify({ ok: true }),
    { status: 200, headers: { ...CORS, 'Content-Type': 'application/json' } }
  )
})
