"use client";
import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { PGProperty, PGFilters } from "@/types";

interface State {
  pgs: PGProperty[];
  loading: boolean;
  error: string | null;
}

export function usePGs(filters?: PGFilters) {
  const [state, setState] = useState<State>({ pgs: [], loading: true, error: null });
  const supabase = createClient();

  const fetch = useCallback(async () => {
    setState(s => ({ ...s, loading: true, error: null }));
    let query = supabase
      .from("pg_properties")
      .select("*")
      .eq("is_approved", true)
      .eq("is_available", true);

    if (filters?.area) query = query.ilike("area", `%${filters.area}%`);
    if (filters?.gender) query = query.eq("gender", filters.gender);
    if (filters?.property_type) query = query.eq("property_type", filters.property_type);
    if (filters?.budget_max) query = query.lte("price_double", filters.budget_max);
    if (filters?.search) {
      query = query.or(
        `gharpayy_name.ilike.%${filters.search}%,area.ilike.%${filters.search}%,locality.ilike.%${filters.search}%`
      );
    }

    const { data, error } = await query.order("created_at", { ascending: false });
    setState({ pgs: (data || []) as PGProperty[], loading: false, error: error?.message || null });
  }, [JSON.stringify(filters)]);

  useEffect(() => { fetch(); }, [fetch]);

  return { ...state, refetch: fetch };
}

export function usePG(id: string) {
  const [pg, setPG] = useState<PGProperty | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    if (!id) return;
    supabase.from("pg_properties").select("*").eq("id", id).single().then(({ data }) => {
      setPG(data as PGProperty | null);
      setLoading(false);
    });
  }, [id]);

  return { pg, loading };
}
