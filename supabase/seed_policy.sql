-- Run this in Supabase SQL Editor BEFORE running the seed script
-- It allows the service role to insert PG data

-- Allow service role to insert/update/delete PGs (for seeding)
CREATE POLICY "Service role full access" ON public.pg_properties
  FOR ALL USING (true) WITH CHECK (true);
