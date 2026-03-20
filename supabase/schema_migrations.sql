-- Run these in Supabase SQL Editor to add onboarding fields
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS onboarded BOOLEAN DEFAULT FALSE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS company_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS whatsapp TEXT;

-- Set existing users as onboarded so they don't get redirected
UPDATE public.profiles SET onboarded = TRUE WHERE onboarded IS NULL OR onboarded = FALSE;
