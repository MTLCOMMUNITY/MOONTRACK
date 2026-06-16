/* eslint-disable security/detect-non-literal-fs-filename, security/detect-object-injection */
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { createClient } from '@supabase/supabase-js'

const cwd = process.cwd()
const rootEnvPath = path.join(cwd, '.env')
const backendEnvPath = path.join(cwd, 'supabase', '.env.local')

function parseEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {}

  const content = fs.readFileSync(filePath, 'utf8')
  const lines = content.split(/\r?\n/)
  const env = {}

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue

    const idx = trimmed.indexOf('=')
    if (idx === -1) continue

    const key = trimmed.slice(0, idx).trim()
    let value = trimmed.slice(idx + 1).trim()

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }

    env[key] = value
  }

  return env
}

function loadEnv() {
  const merged = {
    ...parseEnvFile(rootEnvPath),
    ...parseEnvFile(backendEnvPath),
    ...process.env,
  }

  const supabaseUrl =
    merged.SUPABASE_URL || merged.VITE_SUPABASE_URL || merged.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = merged.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      'Missing SUPABASE_URL and/or SUPABASE_SERVICE_ROLE_KEY. Set them in env or supabase/.env.local.'
    )
  }

  return { supabaseUrl, serviceRoleKey }
}

function extractReferralCodeFromTxRef(rawTxRef) {
  if (typeof rawTxRef !== 'string') return null
  const match = rawTxRef.trim().match(/^MTL-(.+)-\d+$/)
  return match?.[1]?.trim() || null
}

async function resolveReferralAttribution(supabase, rawRefCode) {
  if (typeof rawRefCode !== 'string' || !rawRefCode.trim()) return null
  const refCode = rawRefCode.trim()

  const { data: link, error: linkError } = await supabase
    .from('referral_links')
    .select('influencer_id, ref_code, is_active, influencers(id, full_name, email, commission_rate, is_active)')
    .eq('ref_code', refCode)
    .maybeSingle()

  if (linkError) {
    console.error('Referral link lookup failed for', refCode, linkError.message)
  }

  const linkInfluencer = Array.isArray(link?.influencers)
    ? link.influencers[0]
    : link?.influencers

  if (link?.influencer_id && linkInfluencer) {
    return {
      influencerId: link.influencer_id,
      refCode: link.ref_code ?? refCode,
      fullName: linkInfluencer.full_name,
      email: linkInfluencer.email,
      commissionRate: linkInfluencer.commission_rate ?? 10,
      isActive:
        typeof linkInfluencer.is_active === 'boolean'
          ? linkInfluencer.is_active
          : (link.is_active ?? true),
      source: 'referral_links',
    }
  }

  const { data: influencer, error: influencerError } = await supabase
    .from('influencers')
    .select('id, ref_code, full_name, email, commission_rate, is_active')
    .eq('ref_code', refCode)
    .maybeSingle()

  if (influencerError) {
    console.error('Influencer lookup failed for', refCode, influencerError.message)
  }

  if (!influencer?.id) return null

  return {
    influencerId: influencer.id,
    refCode: influencer.ref_code ?? refCode,
    fullName: influencer.full_name,
    email: influencer.email,
    commissionRate: influencer.commission_rate ?? 10,
    isActive: influencer.is_active ?? true,
    source: 'influencers',
  }
}

function computeCommission(amount, commissionRate, isActive) {
  if (!isActive) return 0
  return Math.round(((commissionRate ?? 10) / 100) * (amount ?? 0))
}

function getFlag(name) {
  return process.argv.includes(name)
}

function printRow(row) {
  console.log(JSON.stringify(row, null, 2))
}

async function main() {
  const apply = getFlag('--apply')
  const onlyMissingInfluencer = getFlag('--only-missing-influencer')
  const { supabaseUrl, serviceRoleKey } = loadEnv()
  const supabase = createClient(supabaseUrl, serviceRoleKey)

  let query = supabase
    .from('payments')
    .select(
      'id, tx_ref, transaction_ref, influencer_id, conversion_id, amount, commission_earned, payment_date, status'
    )
    .order('payment_date', { ascending: false })

  if (onlyMissingInfluencer) {
    query = query.is('influencer_id', null)
  }

  const { data: payments, error } = await query

  if (error) {
    throw new Error(`Failed to load payments: ${error.message}`)
  }

  const candidates = (payments ?? []).filter(
    (payment) => !payment.influencer_id || !payment.conversion_id
  )

  console.log(
    `Found ${candidates.length} payment row(s) missing influencer attribution and/or conversion linkage.`
  )

  const summary = {
    scanned: candidates.length,
    repairable: 0,
    applied: 0,
    unresolved: 0,
    missingConversionDetails: 0,
  }

  for (const payment of candidates) {
    const inferredRefCode = extractReferralCodeFromTxRef(payment.tx_ref)
    const resolved = await resolveReferralAttribution(supabase, inferredRefCode)

    if (!resolved) {
      summary.unresolved++
      printRow({
        outcome: 'unresolved',
        payment_id: payment.id,
        tx_ref: payment.tx_ref,
        transaction_ref: payment.transaction_ref,
        reason: 'Could not infer influencer from tx_ref / ref_code',
      })
      continue
    }

    const commission = computeCommission(
      payment.amount,
      resolved.commissionRate,
      resolved.isActive
    )

    summary.repairable++
    if (!payment.conversion_id) {
      summary.missingConversionDetails++
    }

    const patch = {
      influencer_id: resolved.influencerId,
      commission_earned: commission,
      status: payment.status || 'confirmed',
    }

    printRow({
      outcome: apply ? 'apply' : 'dry-run',
      payment_id: payment.id,
      tx_ref: payment.tx_ref,
      transaction_ref: payment.transaction_ref,
      inferred_ref_code: inferredRefCode,
      resolved_ref_code: resolved.refCode,
      influencer_id: resolved.influencerId,
      influencer_name: resolved.fullName,
      influencer_email: resolved.email,
      source: resolved.source,
      existing_influencer_id: payment.influencer_id,
      existing_conversion_id: payment.conversion_id,
      repaired_fields: patch,
      note: payment.conversion_id
        ? 'Payment can be fully re-attributed from DB alone.'
        : 'Influencer can be re-attributed, but payer details are not stored on payments. You will need Flutterwave/dashboard records to recreate conversion details.',
    })

    if (!apply) {
      continue
    }

    const { error: updateError } = await supabase
      .from('payments')
      .update(patch)
      .eq('id', payment.id)

    if (updateError) {
      printRow({
        outcome: 'update_failed',
        payment_id: payment.id,
        error: updateError.message,
      })
      continue
    }

    summary.applied++
  }

  console.log('\nSummary')
  printRow(summary)

  if (!apply) {
    console.log(
      '\nDry run only. Re-run with --apply to write payment attribution fixes.'
    )
  }
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
