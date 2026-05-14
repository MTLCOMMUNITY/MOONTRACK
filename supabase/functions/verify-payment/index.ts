import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS })

  const { transaction_id, tx_ref } = await req.json()

  if (!transaction_id) {
    return new Response(JSON.stringify({ ok: false, error: 'Missing transaction_id' }), {
      status: 400, headers: { ...CORS, 'Content-Type': 'application/json' },
    })
  }

  const FLW_SECRET_KEY = Deno.env.get('FLW_SECRET_KEY')

  // Verify with Flutterwave
  const verifyRes = await fetch(
    `https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`,
    { headers: { Authorization: `Bearer ${FLW_SECRET_KEY}` } }
  )
  const verifyData = await verifyRes.json()

  if (
    verifyData.status !== 'success' ||
    verifyData.data?.status !== 'successful'
  ) {
    return new Response(JSON.stringify({ ok: false, error: 'Payment not verified' }), {
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

  // Get influencer commission rate
  const { data: influencer } = await supabase
    .from('influencers')
    .select('commission_rate')
    .eq('id', link.influencer_id)
    .single()

  const commissionRate = influencer?.commission_rate ?? 10
  const amount = txData.amount
  const commission = Math.round((commissionRate / 100) * amount)

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
