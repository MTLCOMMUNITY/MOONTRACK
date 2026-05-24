// @ts-ignore
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

declare const Deno: any;

Deno.serve(async (req: Request) => {
  // Flutterwave signature verification
  const secretHash = Deno.env.get('FLW_WEBHOOK_SECRET')
  const signature = req.headers.get('verif-hash')

  if (!signature || signature !== secretHash) {
    return new Response('Unauthorized', { status: 401 })
  }

  const payload = await req.json()

  // Only process successful payments
  if (payload.event !== 'charge.completed' || payload.data.status !== 'successful') {
    return new Response('Ignored', { status: 200 })
  }

  const transaction_id = payload.data.id
  const tx_ref = payload.data.tx_ref

  const FLW_SECRET_KEY = Deno.env.get('FLW_SECRET_KEY')

  // Verify with Flutterwave to prevent spoofing
  const verifyRes = await fetch(
    `https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`,
    { headers: { Authorization: `Bearer ${FLW_SECRET_KEY}` } }
  )
  const verifyData = await verifyRes.json()

  if (
    verifyData.status !== 'success' ||
    verifyData.data?.status !== 'successful'
  ) {
    return new Response('Payment not verified', { status: 400 })
  }

  const txData = verifyData.data
  const ref_code = txData.meta?.ref_code
  const customer = txData.customer

  if (!ref_code) {
    return new Response('Missing ref_code in metadata', { status: 200 })
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
    return new Response('Payment already processed', { status: 200 })
  }

  // Get influencer by ref_code
  const { data: link } = await supabase
    .from('referral_links')
    .select('influencer_id')
    .eq('ref_code', ref_code)
    .single()

  if (!link) {
    return new Response('Referral link not found', { status: 200 })
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

  return new Response('Webhook processed successfully', { status: 200 })
})
