// @ts-nocheck
// @ts-ignore
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

declare const Deno: any;

const rateLimit = new Map<string, { count: number; timestamp: number }>();

Deno.serve(async (req: Request) => {
  const origin = req.headers.get('origin') ?? ''
  const appUrl = Deno.env.get('APP_URL') ?? 'https://moontrack.moontechlife.com'
  const corsOrigin = origin.startsWith('http://localhost:') ? origin : appUrl

  const CORS = {
    'Access-Control-Allow-Origin': corsOrigin,
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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
    return new Response(JSON.stringify({ error: 'Too many requests. Please try again later.' }), {
      status: 429,
      headers: { ...CORS, 'Content-Type': 'application/json' },
    })
  }

  // 1. Verify the requester is an admin
  const authHeader = req.headers.get('Authorization')
  if (!authHeader) {
    return new Response(JSON.stringify({ error: 'Missing auth header' }), {
      status: 401, headers: { ...CORS, 'Content-Type': 'application/json' },
    })
  }

  const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  const token = authHeader.replace('Bearer ', '')
  const { data: { user }, error: userErr } = await supabaseAdmin.auth.getUser(token)

  if (userErr || !user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401, headers: { ...CORS, 'Content-Type': 'application/json' },
    })
  }

  // Check if they exist in the admins table
  const { data: adminRow } = await supabaseAdmin
    .from('admins')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!adminRow) {
    return new Response(JSON.stringify({ error: 'Forbidden: Admins only' }), {
      status: 403, headers: { ...CORS, 'Content-Type': 'application/json' },
    })
  }

  // 2. Fetch all influencers
  const { data: influencers, error: infErr } = await supabaseAdmin
    .from('influencers')
    .select('id, user_id, full_name, email, ref_code, commission_rate, is_active, created_at, bank_name, account_number, account_name')
    .order('created_at', { ascending: false })

  if (infErr) {
    return new Response(JSON.stringify({ error: infErr.message }), {
      status: 400, headers: { ...CORS, 'Content-Type': 'application/json' },
    })
  }

  // 3. Fetch all auth users to check confirmed_at status
  // Note: listUsers() returns up to 50 users per page. We will fetch a large page for now.
  const { data: authUsers, error: authErr } = await supabaseAdmin.auth.admin.listUsers({
    perPage: 1000
  })

  if (authErr) {
    return new Response(JSON.stringify({ error: authErr.message }), {
      status: 400, headers: { ...CORS, 'Content-Type': 'application/json' },
    })
  }

  // 4. Merge data to determine if invite is accepted
  const enrichedInfluencers = influencers.map((inf) => {
    const authUser = authUsers.users.find((u) => u.id === inf.user_id)
    // Safely check if confirmed_at exists and is a string (not null/undefined)
    const isConfirmed = !!authUser?.confirmed_at || !!authUser?.email_confirmed_at || !!authUser?.last_sign_in_at
    const invite_accepted = authUser ? isConfirmed : false

    return {
      ...inf,
      invite_accepted
    }
  })

  return new Response(JSON.stringify(enrichedInfluencers), {
    status: 200, headers: { ...CORS, 'Content-Type': 'application/json' },
  })
})
