import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS })
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
