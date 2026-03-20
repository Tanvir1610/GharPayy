#!/bin/bash
set -e

# Provide placeholder values for ALL env vars needed at build time.
# Railway injects real values at RUNTIME via the Variables dashboard.
# These placeholders only prevent build-time "variable not found" errors.

export CLERK_SECRET_KEY="${CLERK_SECRET_KEY:-sk_test_placeholder_build_only_not_real}"
export NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="${NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:-pk_test_placeholder_build_only_not_real}"
export NEXT_PUBLIC_CLERK_SIGN_IN_URL="${NEXT_PUBLIC_CLERK_SIGN_IN_URL:-/login}"
export NEXT_PUBLIC_CLERK_SIGN_UP_URL="${NEXT_PUBLIC_CLERK_SIGN_UP_URL:-/register}"
export NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="${NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL:-/dashboard}"
export NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="${NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL:-/dashboard}"
export NEXT_PUBLIC_SUPABASE_URL="${NEXT_PUBLIC_SUPABASE_URL:-https://placeholder.supabase.co}"
export NEXT_PUBLIC_SUPABASE_ANON_KEY="${NEXT_PUBLIC_SUPABASE_ANON_KEY:-placeholder_anon_key}"
export ADMIN_EMAIL="${ADMIN_EMAIL:-admin@gharpayy.com}"
export ADMIN_PASSWORD="${ADMIN_PASSWORD:-gharpayy@admin2024}"
export ADMIN_SESSION_SECRET="${ADMIN_SESSION_SECRET:-gharpayy-admin-secret-2024}"
export SUPABASE_SERVICE_ROLE_KEY="${SUPABASE_SERVICE_ROLE_KEY:-placeholder_service_role_key}"

# Remove stale tsbuildinfo that conflicts with Railway build cache mount
rm -rf tsconfig.tsbuildinfo

echo "→ Building Next.js app..."
npx next build
echo "→ Build complete."
