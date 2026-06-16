// @ts-ignore
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

declare const Deno: any;

function escapeHtml(value: unknown) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

Deno.serve(async (req: Request) => {
  try {
    // 1. Verify it's a POST request from the Database Webhook
    if (req.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405 })
    }

    // Authentication verification for database webhook
    const authHeader = req.headers.get('Authorization')
    const webhookSecret = Deno.env.get('DB_WEBHOOK_SECRET')
    if (webhookSecret && authHeader !== `Bearer ${webhookSecret}`) {
      console.warn('Unauthorized attempt to invoke send-emails webhook')
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const payload = await req.json()

    // 2. We only care about newly inserted rows into the payments table
    if (payload.type !== 'INSERT' || payload.table !== 'payments') {
      return new Response('Ignored - not a payment insert', { status: 200 })
    }

    const payment = payload.record

    if (!payment.influencer_id || !payment.conversion_id) {
      return new Response('Missing related IDs', { status: 200 })
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // 3. Fetch Influencer Data (for the commission email)
    const { data: influencer } = await supabase
      .from('influencers')
      .select('email, full_name')
      .eq('id', payment.influencer_id)
      .single()

    // 4. Fetch Student Data (for the welcome receipt email)
    const { data: conversion } = await supabase
      .from('conversions')
      .select('student_name, student_email, ref_code')
      .eq('id', payment.conversion_id)
      .single()

    if (!influencer || !conversion) {
      return new Response('Failed to find influencer or student', { status: 400 })
    }

    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not configured!')
      return new Response('RESEND_API_KEY not configured', { status: 500 })
    }

    // ==========================================
    // EMAIL 1: Welcome Email to the Student
    // ==========================================
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'MoonTech Life <noreply@moontechlife.com>',
        to: conversion.student_email,
        subject: 'Welcome to MoonTech Life! 🚀',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #2563eb;">Welcome, ${escapeHtml(conversion.student_name)}!</h1>
            <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0;">Payment Receipt</h3>
              <ul style="list-style: none; padding: 0; margin: 0;">
                <li style="margin-bottom: 8px;"><strong>Amount Paid:</strong> ₦${payment.amount}</li>
ccv
            <p>If you have any questions in the meantime, feel free to reply directly to this email.</p>
            <br/>
            <p>Best,<br/>The MoonTech Life Team</p>
          </div>
        `
      })
    })

    // ==========================================
    // EMAIL 2: Commission Alert to Influencer
    // ==========================================
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'MoonTrack <noreply@moontechlife.com>',
        to: influencer.email,
        subject: 'Cha-ching! New Commission Earned 💰',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #16a34a;">Congrats, ${escapeHtml(influencer.full_name)}! 💸</h1>
            <p>Someone just purchased a course using your referral link!</p>
            
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 10px 0; color: #6b7280;">Student Name</td>
                <td style="padding: 10px 0; font-weight: bold; text-align: right;">${escapeHtml(conversion.student_name)}</td>
              </tr>
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 10px 0; color: #6b7280;">Referral Code Used</td>
                <td style="padding: 10px 0; font-weight: bold; text-align: right;">${escapeHtml(conversion.ref_code)}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #6b7280;">Commission Earned</td>
                <td style="padding: 10px 0; font-weight: bold; color: #16a34a; font-size: 1.2em; text-align: right;">₦${payment.commission_earned}</td>
              </tr>
            </table>
            
            <p>Log in to your MoonTrack dashboard to see your updated balance.</p>
            <p>Keep up the great work!</p>
            <br/>
            <p>The MoonTrack System</p>
          </div>
        `
      })
    })

    return new Response(JSON.stringify({ ok: true, message: 'Emails sent successfully' }), { status: 200, headers: { 'Content-Type': 'application/json' } })

  } catch (error: any) {
    console.error('Email sending error:', error)
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } })
  }
})
