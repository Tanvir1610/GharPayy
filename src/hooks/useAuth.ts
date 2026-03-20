"use client";
// Auth is now handled by Clerk
// Use useUser() from @clerk/nextjs directly instead of this hook
export function useAuth() {
  return { user: null, profile: null, loading: false };
}
