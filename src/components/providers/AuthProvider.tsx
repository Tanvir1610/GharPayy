"use client";
// Auth is now handled by Clerk — this file is kept for any legacy imports
// Use useUser() from @clerk/nextjs directly in components instead

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export const useAuthContext = () => ({ user: null, profile: null, loading: false, signOut: async () => {} });
