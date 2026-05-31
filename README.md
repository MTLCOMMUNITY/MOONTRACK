# MoonTrack

MoonTrack is a highly secure, automated analytics, referral, and payment tracking platform built for MoonTech Life. It allows the administration to seamlessly manage influencer marketing campaigns, track conversions in real-time, and automate referral payouts via Flutterwave.

## Core Features

- **Tamper-Proof Referral Tracking:** Utilizes robust LocalStorage persistence. Once a user clicks an influencer's link, the referral code is securely locked in their browser, preventing URL tampering before or during checkout.
- **Automated Payment Flow:** Seamless integration with Flutterwave to process student checkouts and automatically calculate influencer commissions based on dynamic rates.
- **Enterprise-Grade Security:**
  - **Row Level Security (RLS)** migration and policy script included for sensitive database tables.
  - **In-Memory IP Rate-Limiting** applied to all public endpoints to prevent DDoS and spam abuse.
  - **Strict Origin-Based CORS Policies** on Edge Functions to block malicious cross-origin requests.
- **Webhook Integrity Validation:** Server-to-server transaction verification using Flutterwave Webhook Hash Signatures to guarantee payload authenticity and prevent payment spoofing.
- **Edge Functions:** Secure, scalable Deno server-side processing for payments, clicks, and influencer invitations.
- **Role-Based Dashboards:** Separate experiences and access controls for Administrators and Influencers.

## Tech Stack

- **Frontend:** React (Vite), TypeScript, Tailwind CSS, shadcn/ui
- **Routing:** TanStack Router (File-based routing)
- **Backend / Database:** Supabase (PostgreSQL, Auth, Edge Functions)
- **Payments:** Flutterwave API v3

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the root directory for the frontend:

```env
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

Create a `supabase/.env.local` file for the backend Edge Functions:

```env
FLW_SECRET_KEY=your_flutterwave_secret_key
FLW_WEBHOOK_SECRET=your_custom_webhook_hash
APP_URL=http://localhost:5173
SUPABASE_URL=your_project_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

Notes:

- Only `VITE_*` variables should be exposed to the frontend bundle.
- Server-only secrets such as `FLW_SECRET_KEY`, `FLW_WEBHOOK_SECRET`, and `SUPABASE_SERVICE_ROLE_KEY` should stay in `supabase/.env.local` for local development.
- In production, set frontend vars in your frontend host and set Edge Function secrets in Supabase.

### 3. Run Development Server

```bash
npm run dev
```

### 4. Deploying Edge Functions

Use the Supabase CLI to deploy the secure backend functions to production:

```bash
npx supabase functions deploy
```

### 5. Applying Database Security Policies

Apply the RLS migration before relying on browser-side Supabase access controls:

```bash
npx supabase db push
```
