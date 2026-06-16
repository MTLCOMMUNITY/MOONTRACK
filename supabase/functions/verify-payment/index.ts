// @ts-ignore
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import {
  extractReferralCodeFromTxRef,
  resolveReferralAttribution,
} from '../_shared/referral-attribution.ts'

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

  // Clean up expired entries to avoid memory leak
  for (const [ip, record] of rateLimit.entries()) {
    if (now - record.timestamp > 60000) {
      rateLimit.delete(ip)
    }
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
    return new Response(JSON.stringify({ ok: false, error: 'Too many requests. Please try again later.' }), {
      status: 429,
      headers: { ...CORS, 'Content-Type': 'application/json' },
    })
  }

  const { transaction_id, tx_ref } = await req.json()

  if (!transaction_id || (typeof transaction_id !== 'string' && typeof transaction_id !== 'number')) {
    return new Response(JSON.stringify({ ok: false, error: 'Missing or invalid transaction_id' }), {
      status: 400, headers: { ...CORS, 'Content-Type': 'application/json' },
    })
  }

  const cleanTxId = String(transaction_id).trim()
  if (!/^\d+$/.test(cleanTxId)) {
    return new Response(JSON.stringify({ ok: false, error: 'Invalid transaction_id format' }), {
      status: 400, headers: { ...CORS, 'Content-Type': 'application/json' },
    })
  }

  const FLW_SECRET_KEY = Deno.env.get('FLW_SECRET_KEY')

  // Verify with Flutterwave
  let verifyData: any
  try {
    const verifyRes = await fetch(
      `https://api.flutterwave.com/v3/transactions/${cleanTxId}/verify`,
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
  const verifiedTxRef = typeof txData.tx_ref === 'string' ? txData.tx_ref.trim() : ''
  const customer = txData.customer
  const amount = txData.amount
  const currency = txData.currency

  if (!verifiedTxRef) {
    return new Response(JSON.stringify({ ok: false, error: 'Missing tx_ref in verified payment' }), {
      status: 200, headers: { ...CORS, 'Content-Type': 'application/json' },
    })
  }

  const ref_code =
    txData.meta?.ref_code ?? extractReferralCodeFromTxRef(verifiedTxRef)

  if (tx_ref && tx_ref !== verifiedTxRef) {
    return new Response(JSON.stringify({ ok: false, error: 'Transaction reference mismatch' }), {
      status: 200, headers: { ...CORS, 'Content-Type': 'application/json' },
    })
  }

  if (!ref_code) {
    return new Response(JSON.stringify({ ok: false, error: 'Missing ref_code in metadata' }), {
      status: 200, headers: { ...CORS, 'Content-Type': 'application/json' },
    })
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  let expectedFee = 50000
  let courseName = 'MoonTech Life Program'

  try {
    const { data: settingsData } = await supabase
      .from('app_settings')
      .select('key, value')

    if (settingsData) {
      const dbFee = settingsData.find((s: any) => s.key === 'course_fee')?.value
      if (dbFee) expectedFee = parseInt(dbFee, 10)

      const dbName = settingsData.find((s: any) => s.key === 'course_name')?.value
      if (dbName) courseName = dbName
    }
  } catch (settingsErr) {
    console.error('Error loading app settings during verification:', settingsErr)
  }

  if (currency !== 'NGN') {
    return new Response(JSON.stringify({ ok: false, error: 'Invalid payment currency' }), {
      status: 200, headers: { ...CORS, 'Content-Type': 'application/json' },
    })
  }

  if (typeof amount !== 'number' || amount < expectedFee) {
    return new Response(JSON.stringify({ ok: false, error: 'Invalid payment amount' }), {
      status: 200, headers: { ...CORS, 'Content-Type': 'application/json' },
    })
  }

  // Check if payment already exists to prevent double-crediting
  const { data: existingPayment } = await supabase
    .from('payments')
    .select('id, influencer_id, conversion_id')
    .eq('tx_ref', verifiedTxRef)
    .maybeSingle()

  const resolvedReferral = await resolveReferralAttribution(supabase, ref_code)

  if (!resolvedReferral) {
    if (existingPayment) {
      return new Response(
        JSON.stringify({ ok: true, course_name: courseName }),
        {
          status: 200,
          headers: { ...CORS, 'Content-Type': 'application/json' },
        }
      )
    }

    return new Response(
      JSON.stringify({ ok: false, error: 'Referral link not found' }),
      {
        status: 200,
        headers: { ...CORS, 'Content-Type': 'application/json' },
      }
    )
  }

  // Get influencer commission rate and active status
  const { data: influencer } = await supabase
    .from('influencers')
    .select('commission_rate, is_active')
    .eq('id', resolvedReferral.influencerId)
    .single()

  const commissionRate = influencer?.commission_rate ?? 10
  const isActive = influencer?.is_active ?? true
  
  // If the influencer is suspended, they get 0 commission for new referrals
  const commission = isActive ? Math.round((commissionRate / 100) * amount) : 0

  if (existingPayment?.influencer_id && existingPayment?.conversion_id) {
    return new Response(
      JSON.stringify({ ok: true, course_name: courseName }),
      { status: 200, headers: { ...CORS, 'Content-Type': 'application/json' } }
    )
  }

  // Create conversion record
  const { data: conversion } = await supabase
    .from('conversions')
    .insert({
      influencer_id: resolvedReferral.influencerId,
      ref_code: resolvedReferral.refCode,
      student_name: txData.meta?.student_name || customer.name,
      student_email: txData.meta?.student_email || customer.email,
      phone: txData.meta?.student_phone || customer.phone_number || null,
      payment_status: 'paid',
    })
    .select('id')
    .single()

  if (existingPayment) {
    await supabase
      .from('payments')
      .update({
        influencer_id: resolvedReferral.influencerId,
        conversion_id: conversion?.id ?? existingPayment.conversion_id ?? null,
        amount,
        commission_earned: commission,
        status: 'confirmed',
        transaction_ref: txData.flw_ref ?? verifiedTxRef,
      })
      .eq('id', existingPayment.id)
  } else {
    await supabase.from('payments').insert({
      influencer_id: resolvedReferral.influencerId,
      conversion_id: conversion?.id ?? null,
      amount,
      commission_earned: commission,
      status: 'confirmed',
      transaction_ref: txData.flw_ref ?? verifiedTxRef,
      tx_ref: verifiedTxRef,
    })
  }

  return new Response(
    JSON.stringify({ ok: true, course_name: courseName }),
    { status: 200, headers: { ...CORS, 'Content-Type': 'application/json' } }
  )
})
