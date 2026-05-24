-- =========================================================================
-- MoonTrack - RLS Security Enforcer Script
-- Run this in your Supabase SQL Editor to lock down your database.
-- =========================================================================

-- 1. Enable RLS on all sensitive tables
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversions ENABLE ROW LEVEL SECURITY;
ALTER TABLE influencers ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

-- 2. Drop any overly permissive PUBLIC policies (if they exist)
-- DROP POLICY IF EXISTS "Public access" ON payments;
-- DROP POLICY IF EXISTS "Public access" ON conversions;

-- 3. Create safe, restricted policies for the 'anon' (unauthenticated frontend) role
-- The frontend only needs to read active referral links
CREATE POLICY "Allow public read of active referral links" 
ON referral_links FOR SELECT USING (is_active = true);

-- The frontend needs to read app settings (e.g., course_fee)
CREATE POLICY "Allow public read of app settings" 
ON app_settings FOR SELECT USING (true);

-- 4. Admins can see everything (Assuming an 'admins' table links to auth.users)
-- (Run these if your frontend admin dashboard broke after enabling RLS)
CREATE POLICY "Admins can view payments" 
ON payments FOR SELECT 
TO authenticated 
USING (EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid()));

CREATE POLICY "Admins can view conversions" 
ON conversions FOR SELECT 
TO authenticated 
USING (EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid()));

CREATE POLICY "Admins can view influencers" 
ON influencers FOR SELECT 
TO authenticated 
USING (EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid()));

-- Note: Edge Functions using SUPABASE_SERVICE_ROLE_KEY bypass RLS automatically.
-- They will continue to work perfectly for creating payments and tracking clicks.
