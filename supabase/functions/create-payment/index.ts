import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS })

  const { ref_code, name, email, phone, amount, course_name } = await req.json()

  if (!ref_code || !name || !email || !phone || !amount) {
    return new Response(JSON.stringify({ error: 'Missing required fields' }), {
      status: 400, headers: { ...CORS, 'Content-Type': 'application/json' },
    })
  }

  const FLW_SECRET_KEY = Deno.env.get('FLW_SECRET_KEY')
  const APP_URL = Deno.env.get('APP_URL') ?? 'https://moontrack.vercel.app'

  // Unique tx ref so we can identify this payment on callback
  const tx_ref = `MTL-${ref_code}-${Date.now()}`

  const payload = {
    tx_ref,
    amount: parseInt(amount),
    currency: 'NGN',
    redirect_url: `${APP_URL}/ref/callback`,
    customer: { email, name, phonenumber: phone },
    customizations: {
      title: 'MoonTech Life',
      description: course_name ?? 'MoonTech Life Program',
      logo: `${APP_URL}/moon-logo.png`,
    },
    meta: { ref_code },
  }

  const flwRes = await fetch('https://api.flutterwave.com/v3/payments', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${FLW_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  const flwData = await flwRes.json()

  if (flwData.status !== 'success') {
    console.error('Flutterwave error:', JSON.stringify(flwData))
    return new Response(JSON.stringify({ error: 'Payment initiation failed' }), {
      status: 500, headers: { ...CORS, 'Content-Type': 'application/json' },
    })
  }

  return new Response(JSON.stringify({ payment_link: flwData.data.link }), {
    status: 200, headers: { ...CORS, 'Content-Type': 'application/json' },
  })
})
