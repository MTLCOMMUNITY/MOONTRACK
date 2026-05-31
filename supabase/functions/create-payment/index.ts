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
  }
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS })

  // Rate Limiting (5 requests per minute per IP)
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

  if (userRecord.count > 5) {
    return new Response(JSON.stringify({ error: 'Too many requests. Please try again later.' }), {
      status: 429,
      headers: { ...CORS, 'Content-Type': 'application/json' },
    })
  }

  const { ref_code, name, email, phone } = await req.json()

  if (!ref_code || !name || !email || !phone) {
    return new Response(JSON.stringify({ error: 'Missing required fields' }), {
      status: 400, headers: { ...CORS, 'Content-Type': 'application/json' },
    })
  }

  const FLW_SECRET_KEY = Deno.env.get('FLW_SECRET_KEY')
  const APP_URL = Deno.env.get('APP_URL') ?? 'https://moontrack.moontechlife.com'

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  let expectedFee = 50000;
  let finalCourseName = 'MoonTech Life Program';

  try {
    const { data: settingsData } = await supabase
      .from('app_settings')
      .select('key, value')
    
    if (settingsData) {
      const dbFee = settingsData.find((s: any) => s.key === 'course_fee')?.value
      if (dbFee) expectedFee = parseInt(dbFee, 10)
      
      const dbName = settingsData.find((s: any) => s.key === 'course_name')?.value
      if (dbName) finalCourseName = dbName
    }
  } catch (err) {
    console.error('Error fetching app settings:', err)
  }


  // Unique tx ref so we can identify this payment on callback
  const tx_ref = `MTL-${ref_code}-${Date.now()}`

  const payload = {
    tx_ref,
    amount: expectedFee,
    currency: 'NGN',
    redirect_url: `${APP_URL}/ref/callback`,
    customer: { email, name, phonenumber: phone },
    customizations: {
      title: 'MoonTech Life',
      description: finalCourseName,
      logo: `${APP_URL}/moon-logo.png`,
    },
    meta: { 
      ref_code,
      student_email: email,
      student_name: name,
      student_phone: phone
    },
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
