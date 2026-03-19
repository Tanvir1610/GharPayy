"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import type { PGProperty, PGFilters } from "@/types";

interface State {
  pgs: PGProperty[];
  loading: boolean;
  error: string | null;
}

export function usePGs(filters?: PGFilters) {
  const [state, setState] = useState<State>({ pgs: [], loading: true, error: null });
  const filtersKey = JSON.stringify(filters ?? {});
  const filtersKeyRef = useRef(filtersKey);
  filtersKeyRef.current = filtersKey;

  const fetchPGs = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    const supabase = createClient();
    const f: PGFilters = JSON.parse(filtersKeyRef.current);

    let query = supabase
      .from("pg_properties")
      .select("*")
      .eq("is_approved", true)
      .eq("is_available", true);

    if (f.area) query = query.ilike("area", `%${f.area}%`);
    if (f.gender) query = query.eq("gender", f.gender);
    if (f.property_type) query = query.eq("property_type", f.property_type);
    if (f.budget_max) query = query.lte("price_double", f.budget_max);
    if (f.search) {
      query = query.or(
        `gharpayy_name.ilike.%${f.search}%,area.ilike.%${f.search}%,locality.ilike.%${f.search}%`
      );
    }

    const { data, error } = await query.order("created_at", { ascending: false });
    setState({
      pgs: (data || []) as PGProperty[],
      loading: false,
      error: error?.message || null,
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchPGs();
  }, [fetchPGs, filtersKey]);

  return { ...state, refetch: fetchPGs };
}

export function usePG(id: string) {
  const [pg, setPG] = useState<PGProperty | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const supabase = createClient();
    supabase
      .from("pg_properties")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data }) => {
        setPG(data as PGProperty | null);
        setLoading(false);
      });
  }, [id]);

  return { pg, loading };
}
