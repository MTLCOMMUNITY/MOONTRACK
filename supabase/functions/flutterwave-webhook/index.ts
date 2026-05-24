// @ts-ignore
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

declare const Deno: any;

Deno.serve(async (req: Request) => {
  console.log('--- NEW WEBHOOK RECEIVED ---')
  
  // Flutterwave signature verification
  const secretHash = Deno.env.get('FLW_WEBHOOK_SECRET')
  const signature = req.headers.get('verif-hash')

  console.log('verif-hash header:', signature)
  console.log('FLW_WEBHOOK_SECRET set in Supabase:', secretHash ? 'YES' : 'NO')

  if (!signature || signature !== secretHash) {
    console.error('Signature mismatch or missing. Unauthorized.')
    return new Response('Unauthorized', { status: 401 })
  }

  const payload = await req.json()
  console.log('Webhook Payload:', JSON.stringify(payload, null, 2))

  // Only process successful payments
  if (payload.event !== 'charge.completed' || payload.data.status !== 'successful') {
    console.log(`Ignoring event: ${payload.event}, status: ${payload.data?.status}`)
    return new Response('Ignored', { status: 200 })
  }

  const transaction_id = payload.data.id
  const tx_ref = payload.data.tx_ref

  const FLW_SECRET_KEY = Deno.env.get('FLW_SECRET_KEY')

  // Verify with Flutterwave to prevent spoofing
  try {
    const verifyRes = await fetch(
      `https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`,
      { headers: { Authorization: `Bearer ${FLW_SECRET_KEY}` } }
    )
    const verifyData = await verifyRes.json()
    console.log('Verify API Response:', JSON.stringify(verifyData, null, 2))

    if (
      verifyData.status !== 'success' ||
      verifyData.data?.status !== 'successful'
    ) {
      console.error('Payment verification failed with Flutterwave API')
      return new Response('Payment not verified', { status: 400 })
    }

    const txData = verifyData.data
    const ref_code = txData.meta?.ref_code
    const customer = txData.customer

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
    console.log('Payment already processed for tx_ref:', tx_ref)
    return new Response('Payment already processed', { status: 200 })
  }

  const amount = txData.amount
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
        student_name: customer.name,
        student_email: customer.email,
        phone: customer.phone_number ?? null,
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
    tx_ref: tx_ref ?? null,
  })

  if (payError) {
    console.error('Error inserting payment:', payError)
  } else {
    console.log('Payment record created successfully for tx_ref:', tx_ref, '| influencer_id:', influencer_id ?? 'none (organic)')
  }

  console.log('--- WEBHOOK PROCESSED SUCCESSFULLY ---')
  return new Response('Webhook processed successfully', { status: 200 })
} catch (e: any) {
  console.error('UNEXPECTED EXCEPTION IN WEBHOOK:', e)
  return new Response('Internal Server Error', { status: 500 })
}
})
