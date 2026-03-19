-- ============================================================
-- GHARPAYY PG RESERVATION SYSTEM - SUPABASE SCHEMA
-- Run this in Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── PROFILES (extends auth.users) ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email         TEXT NOT NULL,
  full_name     TEXT NOT NULL DEFAULT '',
  phone         TEXT,
  role          TEXT NOT NULL DEFAULT 'tenant' CHECK (role IN ('tenant','owner','admin')),
  avatar_url    TEXT,
  preferred_area TEXT,
  budget_max    INTEGER,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'tenant')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ─── PG PROPERTIES ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.pg_properties (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  gharpayy_name         TEXT NOT NULL,
  area                  TEXT NOT NULL,
  locality              TEXT NOT NULL DEFAULT '',
  nearby_landmarks      TEXT NOT NULL DEFAULT '',
  location_message      TEXT,
  pricing_message       TEXT,
  google_maps_url       TEXT,
  gender                TEXT NOT NULL DEFAULT 'Co-live' CHECK (gender IN ('Boys','Girls','Co-live')),
  target_audience       TEXT NOT NULL DEFAULT 'Both' CHECK (target_audience IN ('Students','Working Professionals','Both')),
  property_type         TEXT NOT NULL DEFAULT 'Mid' CHECK (property_type IN ('Premium','Mid','Budget')),
  room_types            TEXT[] NOT NULL DEFAULT '{}',
  furnishing_details    TEXT NOT NULL DEFAULT '',
  walking_distance_mins TEXT NOT NULL DEFAULT '',
  accessibility         TEXT NOT NULL DEFAULT 'Bus',
  noise_level           TEXT NOT NULL DEFAULT 'Medium' CHECK (noise_level IN ('Low','Medium','High')),
  surrounding_vibe      TEXT NOT NULL DEFAULT '',
  food_type             TEXT NOT NULL DEFAULT 'Both',
  common_area_features  TEXT[] NOT NULL DEFAULT '{}',
  amenities             TEXT[] NOT NULL DEFAULT '{}',
  safety_features       TEXT[] NOT NULL DEFAULT '{}',
  meals_per_day         INTEGER NOT NULL DEFAULT 3,
  food_timings          TEXT NOT NULL DEFAULT '',
  utilities_included    TEXT NOT NULL DEFAULT 'All Inclusive',
  cleaning_frequency    TEXT NOT NULL DEFAULT 'Every Alternate Day',
  usp                   TEXT NOT NULL DEFAULT '',
  house_rules           TEXT NOT NULL DEFAULT '',
  security_deposit      TEXT NOT NULL DEFAULT 'One Month Rent',
  minimum_stay          TEXT NOT NULL DEFAULT '3 Months',
  price_triple          INTEGER,
  price_double          INTEGER,
  price_single          INTEGER,
  manager_name          TEXT,
  manager_contact       TEXT,
  owner_name            TEXT,
  owner_contact         TEXT,
  group_name            TEXT,
  actual_name           TEXT,
  brochure_url          TEXT,
  photos_urls           TEXT[] NOT NULL DEFAULT '{}',
  videos_urls           TEXT[] NOT NULL DEFAULT '{}',
  is_available          BOOLEAN NOT NULL DEFAULT true,
  is_approved           BOOLEAN NOT NULL DEFAULT true,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.pg_properties ENABLE ROW LEVEL SECURITY;

-- Anyone can read approved/available properties
CREATE POLICY "Public can view approved PGs" ON public.pg_properties
  FOR SELECT USING (is_approved = true AND is_available = true);

-- Admins full access
CREATE POLICY "Admins full access to PGs" ON public.pg_properties
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ─── BOOKINGS ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.bookings (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pg_id            UUID NOT NULL REFERENCES public.pg_properties(id) ON DELETE CASCADE,
  user_id          UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  room_type        TEXT NOT NULL,
  move_in_date     DATE NOT NULL,
  payment_method   TEXT NOT NULL DEFAULT 'UPI' CHECK (payment_method IN ('UPI','Card','Cash','Bank Transfer')),
  monthly_rent     INTEGER NOT NULL,
  security_deposit INTEGER NOT NULL DEFAULT 0,
  status           TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending','Confirmed','Cancelled','Completed')),
  notes            TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own bookings" ON public.bookings
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users create bookings" ON public.bookings
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins view all bookings" ON public.bookings
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ─── VISIT SCHEDULES ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.visit_schedules (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pg_id       UUID NOT NULL REFERENCES public.pg_properties(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  visit_date  DATE NOT NULL,
  visit_time  TEXT NOT NULL,
  status      TEXT NOT NULL DEFAULT 'Scheduled' CHECK (status IN ('Scheduled','Completed','Cancelled')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.visit_schedules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own visits" ON public.visit_schedules
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users create visits" ON public.visit_schedules
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins view all visits" ON public.visit_schedules
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ─── LEADS ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.leads (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name              TEXT NOT NULL,
  phone             TEXT NOT NULL,
  email             TEXT,
  preferred_area    TEXT NOT NULL,
  budget_min        INTEGER NOT NULL DEFAULT 0,
  budget_max        INTEGER NOT NULL,
  preferred_gender  TEXT NOT NULL DEFAULT 'Co-live',
  preferred_room_type TEXT NOT NULL DEFAULT 'Double Sharing',
  move_in_date      DATE NOT NULL,
  notes             TEXT,
  status            TEXT NOT NULL DEFAULT 'New' CHECK (status IN ('New','Contacted','Visited','Converted','Lost')),
  match_score       INTEGER,
  matched_pg_ids    UUID[] NOT NULL DEFAULT '{}',
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage leads" ON public.leads
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );
CREATE POLICY "Public create leads" ON public.leads
  FOR INSERT WITH CHECK (true);

-- ─── SAVED PGS ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.saved_pgs (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  pg_id      UUID NOT NULL REFERENCES public.pg_properties(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, pg_id)
);

ALTER TABLE public.saved_pgs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage saved pgs" ON public.saved_pgs
  FOR ALL USING (auth.uid() = user_id);

-- ─── REVIEWS ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.reviews (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pg_id      UUID NOT NULL REFERENCES public.pg_properties(id) ON DELETE CASCADE,
  user_id    UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  rating     INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment    TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(pg_id, user_id)
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public view reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Users create reviews" ON public.reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ─── UPDATED_AT TRIGGER ─────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER pg_properties_updated_at BEFORE UPDATE ON public.pg_properties
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER bookings_updated_at BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER leads_updated_at BEFORE UPDATE ON public.leads
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
