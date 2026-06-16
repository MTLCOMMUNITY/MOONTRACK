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

function bucketBy(items, keyFn) {
  const map = new Map()
  for (const item of items) {
    const key = keyFn(item)
    if (!map.has(key)) map.set(key, [])
    map.get(key).push(item)
  }
  return map
}

function pushFinding(findings, severity, type, payload) {
  findings.push({ severity, type, ...payload })
}

async function listAllAuthUsers(supabase) {
  const users = []
  let page = 1
  const perPage = 1000

  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({
      page,
      perPage,
    })

    if (error) {
      throw new Error(`Failed to list auth users: ${error.message}`)
    }

    users.push(...(data?.users ?? []))

    if (!data?.users?.length || data.users.length < perPage) break
    page += 1
  }

  return users
}

async function main() {
  const syncProfileRefCodes = process.argv.includes('--sync-profile-ref-codes')
  const { supabaseUrl, serviceRoleKey } = loadEnv()
  const supabase = createClient(supabaseUrl, serviceRoleKey)

  const [
    { data: influencers, error: influencersError },
    { data: referralLinks, error: linksError },
    { data: conversions, error: conversionsError },
    { data: payments, error: paymentsError },
  ] = await Promise.all([
    supabase
      .from('influencers')
      .select(
        'id, user_id, full_name, email, ref_code, commission_rate, is_active, created_at'
      ),
    supabase
      .from('referral_links')
      .select('id, influencer_id, ref_code, target_url, click_count, is_active'),
    supabase
      .from('conversions')
      .select(
        'id, influencer_id, ref_code, student_name, student_email, registered_at, payment_status'
      ),
    supabase
      .from('payments')
      .select(
        'id, influencer_id, conversion_id, amount, commission_earned, payment_date, status, transaction_ref, tx_ref'
      ),
  ])

  if (influencersError) throw new Error(`Failed to load influencers: ${influencersError.message}`)
  if (linksError) throw new Error(`Failed to load referral links: ${linksError.message}`)
  if (conversionsError) throw new Error(`Failed to load conversions: ${conversionsError.message}`)
  if (paymentsError) throw new Error(`Failed to load payments: ${paymentsError.message}`)

  const authUsers = await listAllAuthUsers(supabase)

  const influencerById = new Map((influencers ?? []).map((row) => [row.id, row]))
  const conversionById = new Map((conversions ?? []).map((row) => [row.id, row]))
  const authUserById = new Map(authUsers.map((row) => [row.id, row]))

  const linkBuckets = bucketBy(referralLinks ?? [], (row) => row.ref_code ?? '')
  const influencerRefBuckets = bucketBy(
    (influencers ?? []).filter((row) => row.ref_code),
    (row) => row.ref_code
  )

  const resolvedInfluencerByRefCode = new Map()
  for (const link of referralLinks ?? []) {
    if (!link.ref_code || !link.influencer_id) continue
    if (!resolvedInfluencerByRefCode.has(link.ref_code)) {
      resolvedInfluencerByRefCode.set(link.ref_code, link.influencer_id)
    }
  }
  for (const influencer of influencers ?? []) {
    if (!influencer.ref_code) continue
    if (!resolvedInfluencerByRefCode.has(influencer.ref_code)) {
      resolvedInfluencerByRefCode.set(influencer.ref_code, influencer.id)
    }
  }

  const findings = []
  const profileRefCodeFixes = []

  for (const [refCode, rows] of influencerRefBuckets.entries()) {
    if (refCode && rows.length > 1) {
      pushFinding(findings, 'high', 'duplicate_influencer_ref_code', {
        ref_code: refCode,
        influencer_ids: rows.map((row) => row.id),
        names: rows.map((row) => row.full_name),
      })
    }
  }

  for (const [refCode, rows] of linkBuckets.entries()) {
    if (refCode && rows.length > 1) {
      pushFinding(findings, 'high', 'duplicate_referral_link_ref_code', {
        ref_code: refCode,
        link_ids: rows.map((row) => row.id),
        influencer_ids: rows.map((row) => row.influencer_id),
      })
    }
  }

  const influencerLinkBuckets = bucketBy(
    referralLinks ?? [],
    (row) => row.influencer_id ?? ''
  )

  for (const [influencerId, rows] of influencerLinkBuckets.entries()) {
    if (influencerId && rows.length > 1) {
      pushFinding(findings, 'high', 'multiple_referral_links_for_influencer', {
        influencer_id: influencerId,
        influencer_name: influencerById.get(influencerId)?.full_name ?? null,
        link_ids: rows.map((row) => row.id),
        ref_codes: rows.map((row) => row.ref_code),
      })
    }
  }

  for (const influencer of influencers ?? []) {
    if (influencer.ref_code && /\s/.test(influencer.ref_code)) {
      pushFinding(findings, 'medium', 'influencer_ref_code_contains_spaces', {
        influencer_id: influencer.id,
        influencer_name: influencer.full_name,
        ref_code: influencer.ref_code,
      })
    }
  }

  for (const link of referralLinks ?? []) {
    if (link.ref_code && /\s/.test(link.ref_code)) {
      pushFinding(findings, 'medium', 'referral_link_ref_code_contains_spaces', {
        link_id: link.id,
        influencer_id: link.influencer_id,
        ref_code: link.ref_code,
      })
    }
  }

  for (const influencer of influencers ?? []) {
    const authUser = influencer.user_id ? authUserById.get(influencer.user_id) : null
    const acceptedInvite = Boolean(
      authUser?.confirmed_at || authUser?.email_confirmed_at || authUser?.last_sign_in_at
    )
    const ownedLinks = (referralLinks ?? []).filter(
      (row) => row.influencer_id === influencer.id
    )
    const paymentCount = (payments ?? []).filter(
      (row) => row.influencer_id === influencer.id
    ).length
    const conversionCount = (conversions ?? []).filter(
      (row) => row.influencer_id === influencer.id
    ).length

    if (!authUser) {
      pushFinding(findings, paymentCount > 0 ? 'high' : 'medium', 'missing_auth_user', {
        influencer_id: influencer.id,
        influencer_name: influencer.full_name,
        email: influencer.email,
        user_id: influencer.user_id,
        payment_count: paymentCount,
        conversion_count: conversionCount,
      })
    } else if (!acceptedInvite) {
      pushFinding(findings, paymentCount > 0 ? 'medium' : 'low', 'auth_user_not_activated', {
        influencer_id: influencer.id,
        influencer_name: influencer.full_name,
        email: influencer.email,
        user_id: influencer.user_id,
        payment_count: paymentCount,
      })
    }

    if (ownedLinks.length === 0 && (paymentCount > 0 || conversionCount > 0)) {
      pushFinding(findings, 'medium', 'influencer_has_activity_but_no_referral_links', {
        influencer_id: influencer.id,
        influencer_name: influencer.full_name,
        payment_count: paymentCount,
        conversion_count: conversionCount,
      })
    }

    if (
      influencer.ref_code &&
      ownedLinks.length > 0 &&
      !ownedLinks.some((row) => row.ref_code === influencer.ref_code)
    ) {
      const distinctLinkRefCodes = [...new Set(ownedLinks.map((row) => row.ref_code))]
      if (distinctLinkRefCodes.length === 1) {
        profileRefCodeFixes.push({
          influencer_id: influencer.id,
          influencer_name: influencer.full_name,
          from_ref_code: influencer.ref_code,
          to_ref_code: distinctLinkRefCodes[0],
        })
      }

      pushFinding(findings, 'medium', 'profile_ref_code_not_backed_by_referral_link', {
        influencer_id: influencer.id,
        influencer_name: influencer.full_name,
        influencer_ref_code: influencer.ref_code,
        link_ref_codes: ownedLinks.map((row) => row.ref_code),
      })
    }
  }

  for (const payment of payments ?? []) {
    if (!payment.influencer_id || !payment.conversion_id) {
      pushFinding(findings, 'high', 'payment_missing_foreign_keys', {
        payment_id: payment.id,
        influencer_id: payment.influencer_id,
        conversion_id: payment.conversion_id,
        tx_ref: payment.tx_ref,
        transaction_ref: payment.transaction_ref,
        amount: payment.amount,
        status: payment.status,
      })
      continue
    }

    const conversion = conversionById.get(payment.conversion_id)
    if (!conversion) {
      pushFinding(findings, 'high', 'payment_points_to_missing_conversion', {
        payment_id: payment.id,
        conversion_id: payment.conversion_id,
        influencer_id: payment.influencer_id,
        tx_ref: payment.tx_ref,
      })
      continue
    }

    if (conversion.influencer_id !== payment.influencer_id) {
      pushFinding(findings, 'high', 'payment_conversion_influencer_mismatch', {
        payment_id: payment.id,
        conversion_id: conversion.id,
        payment_influencer_id: payment.influencer_id,
        conversion_influencer_id: conversion.influencer_id,
        student_name: conversion.student_name,
        student_email: conversion.student_email,
      })
    }

    const inferredRefCode =
      conversion.ref_code || extractReferralCodeFromTxRef(payment.tx_ref)
    const resolvedInfluencerId = inferredRefCode
      ? resolvedInfluencerByRefCode.get(inferredRefCode)
      : null

    if (inferredRefCode && resolvedInfluencerId && resolvedInfluencerId !== payment.influencer_id) {
      pushFinding(findings, 'high', 'payment_ref_code_resolves_to_different_influencer', {
        payment_id: payment.id,
        tx_ref: payment.tx_ref,
        conversion_id: conversion.id,
        ref_code: inferredRefCode,
        payment_influencer_id: payment.influencer_id,
        resolved_influencer_id: resolvedInfluencerId,
        payment_influencer_name: influencerById.get(payment.influencer_id)?.full_name ?? null,
        resolved_influencer_name: influencerById.get(resolvedInfluencerId)?.full_name ?? null,
      })
    }
  }

  const paymentByConversionId = new Map(
    (payments ?? [])
      .filter((row) => row.conversion_id)
      .map((row) => [row.conversion_id, row])
  )

  for (const conversion of conversions ?? []) {
    const resolvedInfluencerId = conversion.ref_code
      ? resolvedInfluencerByRefCode.get(conversion.ref_code)
      : null
    const payment = paymentByConversionId.get(conversion.id)

    if (!payment && conversion.payment_status === 'paid') {
      pushFinding(findings, 'medium', 'paid_conversion_without_payment', {
        conversion_id: conversion.id,
        influencer_id: conversion.influencer_id,
        ref_code: conversion.ref_code,
        student_name: conversion.student_name,
        student_email: conversion.student_email,
      })
    }

    if (
      conversion.ref_code &&
      resolvedInfluencerId &&
      resolvedInfluencerId !== conversion.influencer_id
    ) {
      pushFinding(findings, 'high', 'conversion_ref_code_resolves_to_different_influencer', {
        conversion_id: conversion.id,
        ref_code: conversion.ref_code,
        conversion_influencer_id: conversion.influencer_id,
        resolved_influencer_id: resolvedInfluencerId,
        conversion_influencer_name:
          influencerById.get(conversion.influencer_id)?.full_name ?? null,
        resolved_influencer_name:
          influencerById.get(resolvedInfluencerId)?.full_name ?? null,
        student_name: conversion.student_name,
        student_email: conversion.student_email,
      })
    }

    if (conversion.ref_code && !resolvedInfluencerId) {
      pushFinding(findings, 'medium', 'conversion_ref_code_not_resolvable', {
        conversion_id: conversion.id,
        ref_code: conversion.ref_code,
        influencer_id: conversion.influencer_id,
        student_name: conversion.student_name,
        student_email: conversion.student_email,
      })
    }
  }

  const summary = {
    influencers: (influencers ?? []).length,
    auth_users: authUsers.length,
    referral_links: (referralLinks ?? []).length,
    conversions: (conversions ?? []).length,
    payments: (payments ?? []).length,
    findings: findings.length,
    by_severity: {
      high: findings.filter((row) => row.severity === 'high').length,
      medium: findings.filter((row) => row.severity === 'medium').length,
      low: findings.filter((row) => row.severity === 'low').length,
    },
    profile_ref_code_fix_candidates: profileRefCodeFixes.length,
  }

  console.log('Summary')
  console.log(JSON.stringify(summary, null, 2))

  if (syncProfileRefCodes) {
    let synced = 0
    const skipped = []

    for (const fix of profileRefCodeFixes) {
      const { error } = await supabase
        .from('influencers')
        .update({ ref_code: fix.to_ref_code })
        .eq('id', fix.influencer_id)

      if (error) {
        skipped.push({
          ...fix,
          error: error.message,
        })
        continue
      }

      synced += 1
    }

    console.log('\nProfile ref_code sync')
    console.log(
      JSON.stringify(
        {
          requested: profileRefCodeFixes.length,
          synced,
          skipped,
        },
        null,
        2
      )
    )
  }

  const grouped = bucketBy(findings, (row) => row.type)
  for (const [type, rows] of grouped.entries()) {
    console.log(`\n${type} (${rows.length})`)
    console.log(JSON.stringify(rows.slice(0, 20), null, 2))
  }

  const leaderboard = (influencers ?? [])
    .map((influencer) => {
      const influencerPayments = (payments ?? []).filter(
        (row) => row.influencer_id === influencer.id
      )
      const influencerConversions = (conversions ?? []).filter(
        (row) => row.influencer_id === influencer.id
      )
      const confirmedCommission = influencerPayments
        .filter((row) => row.status === 'confirmed')
        .reduce((sum, row) => sum + (row.commission_earned ?? 0), 0)

      return {
        influencer_id: influencer.id,
        influencer_name: influencer.full_name,
        email: influencer.email,
        user_id: influencer.user_id,
        auth_user_exists: authUserById.has(influencer.user_id),
        referral_codes: (referralLinks ?? [])
          .filter((row) => row.influencer_id === influencer.id)
          .map((row) => row.ref_code),
        payments: influencerPayments.length,
        conversions: influencerConversions.length,
        confirmed_commission: confirmedCommission,
      }
    })
    .sort((a, b) => b.confirmed_commission - a.confirmed_commission)

  console.log('\nInfluencer leaderboard snapshot')
  console.log(JSON.stringify(leaderboard.slice(0, 20), null, 2))
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
