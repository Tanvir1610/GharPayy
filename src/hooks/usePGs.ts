"use client";
import { useEffect, useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import type { PGProperty, PGFilters } from "@/types";

interface State {
  pgs: PGProperty[];
  loading: boolean;
  error: string | null;
}

export function usePGs(filters?: PGFilters) {
  const [state, setState] = useState<State>({
    pgs: [],
    loading: true,
    error: null,
  });

  const filtersRef = useRef(filters);
  filtersRef.current = filters;

  // Extract primitive values for the dependency array
  const depArea = filters ? filters.area : undefined;
  const depGender = filters ? filters.gender : undefined;
  const depType = filters ? filters.property_type : undefined;
  const depBudget = filters ? filters.budget_max : undefined;
  const depSearch = filters ? filters.search : undefined;

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      const supabase = createClient();
      const f = filtersRef.current;

      let query = supabase
        .from("pg_properties")
        .select("*")
        .eq("is_approved", true)
        .eq("is_available", true);

      if (f && f.area) {
        query = query.ilike("area", "%" + f.area + "%");
      }
      if (f && f.gender) {
        query = query.eq("gender", f.gender);
      }
      if (f && f.property_type) {
        query = query.eq("property_type", f.property_type);
      }
      if (f && f.budget_max && f.budget_max > 0) {
        query = query.lte("price_double", f.budget_max);
      }
      if (f && f.search) {
        query = query.or(
          "gharpayy_name.ilike.%" +
            f.search +
            "%,area.ilike.%" +
            f.search +
            "%,locality.ilike.%" +
            f.search +
            "%"
        );
      }

      const { data, error } = await query.order("created_at", {
        ascending: false,
      });

      if (!cancelled) {
        setState({
          pgs: (data || []) as PGProperty[],
          loading: false,
          error: error ? error.message : null,
        });
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [depArea, depGender, depType, depBudget, depSearch]);

  return state;
}

export function usePG(id: string) {
  const [pg, setPG] = useState<PGProperty | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
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
