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
    return new Response(JSON.stringify({ ok: false, error: 'Too many requests. Please try again later.' }), {
      status: 429,
      headers: { ...CORS, 'Content-Type': 'application/json' },
    })
  }

  const { transaction_id, tx_ref } = await req.json()

  if (!transaction_id) {
    return new Response(JSON.stringify({ ok: false, error: 'Missing transaction_id' }), {
      status: 400, headers: { ...CORS, 'Content-Type': 'application/json' },
    })
  }

  const FLW_SECRET_KEY = Deno.env.get('FLW_SECRET_KEY')

  // Verify with Flutterwave
  let verifyData: any
  try {
    const verifyRes = await fetch(
      `https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`,
      { headers: { Authorization: `Bearer ${FLW_SECRET_KEY}` } }
    )
    verifyData = await verifyRes.json()
  } catch (fetchErr: any) {
    console.error('Flutterwave verify fetch failed:', fetchErr)
    return new Response(JSON.stringify({ ok: false, error: 'Could not reach Flutterwave. Please try again.' }), {
      status: 502, headers: { ...CORS, 'Content-Type': 'application/json' },
    })
  }

  if (
    verifyData.status !== 'success' ||
    verifyData.data?.status !== 'successful'
  ) {
    // Log the actual status so it's visible in Supabase function logs
    console.warn('Flutterwave verify status:', verifyData.status, '| tx status:', verifyData.data?.status)
    return new Response(JSON.stringify({ ok: false, error: 'Payment not verified', flw_status: verifyData.data?.status }), {
      status: 200, headers: { ...CORS, 'Content-Type': 'application/json' },
    })
  }

  const txData = verifyData.data
  const ref_code = txData.meta?.ref_code
  const customer = txData.customer

  if (!ref_code) {
    return new Response(JSON.stringify({ ok: false, error: 'Missing ref_code in metadata' }), {
      status: 200, headers: { ...CORS, 'Content-Type': 'application/json' },
    })
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  // Check if payment already exists to prevent double-crediting
  const { data: existingPayment } = await supabase
    .from('payments')
    .select('id')
    .eq('tx_ref', tx_ref)
    .maybeSingle()

  if (existingPayment) {
    // Already processed (likely by webhook)
    const { data: settings } = await supabase
      .from('app_settings')
      .select('value')
      .eq('key', 'course_name')
      .single()

    return new Response(
      JSON.stringify({ ok: true, course_name: settings?.value }),
      { status: 200, headers: { ...CORS, 'Content-Type': 'application/json' } }
    )
  }

  // Get influencer by ref_code
  const { data: link } = await supabase
    .from('referral_links')
    .select('influencer_id')
    .eq('ref_code', ref_code)
    .single()

  if (!link) {
    return new Response(JSON.stringify({ ok: false, error: 'Referral link not found' }), {
      status: 200, headers: { ...CORS, 'Content-Type': 'application/json' },
    })
  }

  // Get influencer commission rate and active status
  const { data: influencer } = await supabase
    .from('influencers')
    .select('commission_rate, is_active')
    .eq('id', link.influencer_id)
    .single()

  const commissionRate = influencer?.commission_rate ?? 10
  const isActive = influencer?.is_active ?? true
  const amount = txData.amount
  
  // If the influencer is suspended, they get 0 commission for new referrals
  const commission = isActive ? Math.round((commissionRate / 100) * amount) : 0

  // Create conversion record
  const { data: conversion } = await supabase
    .from('conversions')
    .insert({
      influencer_id: link.influencer_id,
      ref_code,
      student_name: customer.name,
      student_email: customer.email,
      phone: customer.phone_number ?? null,
      payment_status: 'paid',
    })
    .select('id')
    .single()

  // Create payment record
  await supabase.from('payments').insert({
    influencer_id: link.influencer_id,
    conversion_id: conversion?.id ?? null,
    amount,
    commission_earned: commission,
    status: 'confirmed',
    transaction_ref: txData.flw_ref ?? tx_ref,
    tx_ref: tx_ref ?? null,
  })

  // Get course name for success page
  const { data: settings } = await supabase
    .from('app_settings')
    .select('value')
    .eq('key', 'course_name')
    .single()

  return new Response(
    JSON.stringify({ ok: true, course_name: settings?.value }),
    { status: 200, headers: { ...CORS, 'Content-Type': 'application/json' } }
  )
})
