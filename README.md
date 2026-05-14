# MoonTrack

MoonTrack is an automated analytics, referral, and payment tracking platform built for MoonTech Life. It allows the administration to seamlessly manage influencer marketing campaigns, track conversions in real-time, and automate referral payouts via Flutterwave.

## Features

*   **Role-Based Dashboards:** Separate experiences for Administrators (Control Panel) and Influencers.
*   **Automated Payment Flow:** Seamless integration with Flutterwave to process student payments and automatically calculate influencer commissions.
*   **Edge Functions:** Secure server-side processing for payments, clicks, and user invitations.
*   **Real-time Analytics:** Interactive charts for earnings, conversions, and clicks.
*   **Referral Tracking:** Auto-generated unique links for influencers with dynamic click tracking.

## Tech Stack

*   **Frontend:** React (Vite), TypeScript, Tailwind CSS, shadcn/ui
*   **Routing:** TanStack Router
*   **Backend / Database:** Supabase (PostgreSQL, Auth, Edge Functions)
*   **Payments:** Flutterwave API

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create a `.env.local` file with your Supabase credentials:
```env
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### 3. Run Development Server
```bash
npm run dev
```

### 4. Supabase CLI (Optional)
To deploy Edge functions or run the database locally:
```bash
npx supabase start
npx supabase functions deploy
```
