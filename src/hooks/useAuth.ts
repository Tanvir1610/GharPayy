"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { UserProfile } from "@/types";
import type { User } from "@supabase/supabase-js";

interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
}

export function useAuth(): AuthState {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    loading: true,
  });

  useEffect(() => {
    const supabase = createClient();

    const fetchProfile = async (userId: string): Promise<UserProfile | null> => {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();
      return data as UserProfile | null;
    };

    supabase.auth.getUser().then(async ({ data }) => {
      if (data.user) {
        const profile = await fetchProfile(data.user.id);
        setState({ user: data.user, profile, loading: false });
      } else {
        setState({ user: null, profile: null, loading: false });
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session && session.user) {
          const profile = await fetchProfile(session.user.id);
          setState({ user: session.user, profile, loading: false });
        } else {
          setState({ user: null, profile: null, loading: false });
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return state;
}
