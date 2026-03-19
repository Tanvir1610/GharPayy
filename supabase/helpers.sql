-- ============================================================
-- GHARPAYY — Additional SQL helpers (run after schema.sql)
-- ============================================================

-- Allow admins to update bookings
CREATE POLICY "Admins update bookings" ON public.bookings
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Allow admins to delete bookings
CREATE POLICY "Admins delete bookings" ON public.bookings
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Allow admins to view all visit schedules
CREATE POLICY "Admins view all visit schedules" ON public.visit_schedules
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Allow admins to update pg_properties
CREATE POLICY "Admins update PGs" ON public.pg_properties
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Allow admins to insert pg_properties
CREATE POLICY "Admins insert PGs" ON public.pg_properties
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Allow admins to view all profiles
CREATE POLICY "Admins full profiles access" ON public.profiles
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles p2 WHERE p2.id = auth.uid() AND p2.role = 'admin')
  );

-- Allow admins to update leads
CREATE POLICY "Admins update leads" ON public.leads
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ── Useful views ────────────────────────────────────────────────────────────

-- Booking summary view
CREATE OR REPLACE VIEW public.booking_summary AS
SELECT
  b.id,
  b.status,
  b.room_type,
  b.move_in_date,
  b.monthly_rent,
  b.created_at,
  p.full_name AS tenant_name,
  p.email AS tenant_email,
  p.phone AS tenant_phone,
  pg.gharpayy_name AS pg_name,
  pg.area AS pg_area,
  pg.locality AS pg_locality,
  pg.google_maps_url
FROM public.bookings b
JOIN public.profiles p ON p.id = b.user_id
JOIN public.pg_properties pg ON pg.id = b.pg_id;

-- PG stats view
CREATE OR REPLACE VIEW public.pg_stats AS
SELECT
  pg.id,
  pg.gharpayy_name,
  pg.area,
  pg.gender,
  pg.property_type,
  pg.price_double,
  COUNT(DISTINCT b.id) AS total_bookings,
  COUNT(DISTINCT b.id) FILTER (WHERE b.status = 'Confirmed') AS confirmed_bookings,
  COUNT(DISTINCT s.id) AS saved_count,
  AVG(r.rating) AS avg_rating,
  COUNT(DISTINCT r.id) AS review_count
FROM public.pg_properties pg
LEFT JOIN public.bookings b ON b.pg_id = pg.id
LEFT JOIN public.saved_pgs s ON s.pg_id = pg.id
LEFT JOIN public.reviews r ON r.pg_id = pg.id
GROUP BY pg.id;

-- ── Seed admin user helper ──────────────────────────────────────────────────
-- After signing up, run this with your email to make yourself admin:
-- UPDATE public.profiles SET role = 'admin' WHERE email = 'your@email.com';

-- ── Quick data check ────────────────────────────────────────────────────────
-- SELECT area, COUNT(*) as count FROM pg_properties GROUP BY area ORDER BY count DESC;
-- SELECT gender, COUNT(*) as count FROM pg_properties GROUP BY gender;
-- SELECT property_type, COUNT(*) as count FROM pg_properties GROUP BY property_type;
