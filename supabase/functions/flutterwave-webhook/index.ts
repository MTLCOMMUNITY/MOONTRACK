// @ts-ignore
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

declare const Deno: any;

const rateLimit = new Map<string, { count: number; timestamp: number }>()

function logSafeRef(value: unknown) {
  return typeof value === 'string' ? value.replace(/[\r\n]/g, '').slice(0, 128) : value
}

Deno.serve(async (req: Request) => {
  console.log('--- FLUTTERWAVE WEBHOOK RECEIVED ---')
  
  // Flutterwave signature verification
  const secretHash = Deno.env.get('FLW_WEBHOOK_SECRET')
  const signature = req.headers.get('verif-hash')

  console.log('verif-hash header present:', signature ? 'YES' : 'NO')
  console.log('FLW_WEBHOOK_SECRET set in Supabase:', secretHash ? 'YES' : 'NO')

  if (!signature || signature !== secretHash) {
    console.error('Signature mismatch or missing. Unauthorized.')
    return new Response('Unauthorized', { status: 401 })
  }

  // Rate Limiting (60 requests per minute per IP)
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

  if (userRecord.count > 60) {
    return new Response('Too many requests', { status: 429 })
  }

  const payload = await req.json()

  // Only process successful payments
  if (payload.event !== 'charge.completed' || payload.data.status !== 'successful') {
    console.log(`Ignoring event: ${payload.event}, status: ${payload.data?.status}`)
    return new Response('Ignored', { status: 200 })
  }

  const transaction_id = payload.data.id
  const tx_ref = payload.data.tx_ref
  console.log('Webhook event:', payload.event, '| tx_ref:', tx_ref, '| transaction_id:', transaction_id)

  if (!transaction_id || (typeof transaction_id !== 'string' && typeof transaction_id !== 'number')) {
    console.error('Missing or invalid transaction_id in webhook payload')
    return new Response('Invalid transaction ID', { status: 400 })
  }

  const cleanTxId = String(transaction_id).trim()
  if (!/^\d+$/.test(cleanTxId)) {
    console.error('Invalid transaction_id format in webhook payload:', cleanTxId)
    return new Response('Invalid transaction ID format', { status: 400 })
  }

  const FLW_SECRET_KEY = Deno.env.get('FLW_SECRET_KEY')

  // Verify with Flutterwave to prevent spoofing
  try {
    const verifyRes = await fetch(
      `https://api.flutterwave.com/v3/transactions/${cleanTxId}/verify`,
      { headers: { Authorization: `Bearer ${FLW_SECRET_KEY}` } }
    )
    const verifyData = await verifyRes.json()
    console.log('Verify API status:', verifyData.status, '| tx status:', verifyData.data?.status)

    if (
      verifyData.status !== 'success' ||
      verifyData.data?.status !== 'successful'
    ) {
      console.error('Payment verification failed with Flutterwave API')
      return new Response('Payment not verified', { status: 400 })
    }

    const txData = verifyData.data
    const verifiedTxRef = typeof txData.tx_ref === 'string' ? txData.tx_ref.trim() : ''
    const ref_code = txData.meta?.ref_code
    const customer = txData.customer

    if (!verifiedTxRef) {
      console.error('Missing tx_ref in verified Flutterwave response')
      return new Response('Invalid payment reference', { status: 400 })
    }

    if (tx_ref && tx_ref !== verifiedTxRef) {
      console.error('Webhook tx_ref mismatch:', logSafeRef(tx_ref), '| verified:', logSafeRef(verifiedTxRef))
      return new Response('Payment reference mismatch', { status: 400 })
    }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  const amount = txData.amount
  const currency = txData.currency

  // Check if amount matches the expected course fee
  try {
    const { data: settingsData } = await supabase
      .from('app_settings')
      .select('key, value')
    
    let expectedFee = 50000
    if (settingsData) {
      const dbFee = settingsData.find((s: any) => s.key === 'course_fee')?.value
      if (dbFee) expectedFee = parseInt(dbFee, 10)
    }

    if (amount < expectedFee) {
      console.error(`Fraud attempt or partial payment! Paid ${amount} but expected at least ${expectedFee}`)
      return new Response('Invalid payment amount', { status: 400 })
    }

    if (currency !== 'NGN') {
      console.error('Invalid payment currency:', currency)
      return new Response('Invalid payment currency', { status: 400 })
    }
  } catch (err) {
    console.error('Error validating amount against settings:', err)
  }

  // Check if payment already exists to prevent double-crediting
  const { data: existingPayment } = await supabase
    .from('payments')
    .select('id')
    .eq('tx_ref', verifiedTxRef)
    .maybeSingle()

  if (existingPayment) {
    console.log('Payment already processed for tx_ref:', logSafeRef(verifiedTxRef))
    return new Response('Payment already processed', { status: 200 })
  }
  let influencer_id: string | null = null
  let commission = 0

  if (!ref_code) {
    // Direct/organic sale — no referral code. Record the payment with no influencer
    // so it still appears in the admin payments dashboard.
    console.warn('No ref_code in metadata — recording as organic/direct sale (tx_ref:', tx_ref, ')')
  } else {
    // Get influencer by ref_code
    const { data: link, error: linkError } = await supabase
      .from('referral_links')
      .select('influencer_id')
      .eq('ref_code', ref_code)
      .single()

    if (linkError || !link) {
      console.error('Referral link not found for ref_code:', ref_code, '| error:', linkError)
      // Still record the payment but without influencer attribution
    } else {
      influencer_id = link.influencer_id

      // Get influencer commission rate and active status
      const { data: influencer } = await supabase
        .from('influencers')
        .select('commission_rate, is_active')
        .eq('id', influencer_id)
        .single()

      const commissionRate = influencer?.commission_rate ?? 10
      const isActive = influencer?.is_active ?? true
      commission = isActive ? Math.round((commissionRate / 100) * amount) : 0
    }
  }

  // Create conversion record (only when we have an influencer to credit)
  let conversion_id: string | null = null
  if (influencer_id) {
    const { data: conversion, error: convError } = await supabase
      .from('conversions')
      .insert({
        influencer_id,
        ref_code,
        student_name: txData.meta?.student_name || customer.name,
        student_email: txData.meta?.student_email || customer.email,
        phone: txData.meta?.student_phone || customer.phone_number || null,
        payment_status: 'paid',
      })
      .select('id')
      .single()

    if (convError) {
      console.error('Error inserting conversion:', convError)
    } else {
      console.log('Conversion created successfully:', conversion?.id)
      conversion_id = conversion?.id ?? null
    }
  }

  // Create payment record (always — even for organic/direct sales)
  const { error: payError } = await supabase.from('payments').insert({
    influencer_id: influencer_id ?? null,
    conversion_id,
    amount,
    commission_earned: commission,
    status: 'confirmed',
    transaction_ref: txData.flw_ref ?? tx_ref,
    tx_ref: verifiedTxRef,
  })

  if (payError) {
    console.error('Error inserting payment:', payError)
  } else {
    console.log('Payment record created successfully for tx_ref:', logSafeRef(verifiedTxRef), '| influencer_id:', influencer_id ?? 'none (organic)')
  }

  console.log('--- WEBHOOK PROCESSED SUCCESSFULLY ---')
  return new Response('Webhook processed successfully', { status: 200 })
} catch (e: any) {
  console.error('UNEXPECTED EXCEPTION IN WEBHOOK:', e)
  return new Response('Internal Server Error', { status: 500 })
}
})
