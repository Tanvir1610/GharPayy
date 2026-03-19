export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          phone: string | null;
          role: "tenant" | "owner" | "admin";
          avatar_url: string | null;
          preferred_area: string | null;
          budget_max: number | null;
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string;
          phone?: string | null;
          role?: "tenant" | "owner" | "admin";
          avatar_url?: string | null;
          preferred_area?: string | null;
          budget_max?: number | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      pg_properties: {
        Row: {
          id: string;
          gharpayy_name: string;
          area: string;
          locality: string;
          nearby_landmarks: string;
          location_message: string | null;
          pricing_message: string | null;
          google_maps_url: string | null;
          gender: "Boys" | "Girls" | "Co-live";
          target_audience: "Students" | "Working Professionals" | "Both";
          property_type: "Premium" | "Mid" | "Budget";
          room_types: string[];
          furnishing_details: string;
          walking_distance_mins: string;
          accessibility: string;
          noise_level: "Low" | "Medium" | "High";
          surrounding_vibe: string;
          food_type: string;
          common_area_features: string[];
          amenities: string[];
          safety_features: string[];
          meals_per_day: number;
          food_timings: string;
          utilities_included: string;
          cleaning_frequency: string;
          usp: string;
          house_rules: string;
          security_deposit: string;
          minimum_stay: string;
          price_triple: number | null;
          price_double: number | null;
          price_single: number | null;
          manager_name: string | null;
          manager_contact: string | null;
          owner_name: string | null;
          owner_contact: string | null;
          group_name: string | null;
          actual_name: string | null;
          brochure_url: string | null;
          photos_urls: string[];
          videos_urls: string[];
          is_available: boolean;
          is_approved: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["pg_properties"]["Row"], "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["pg_properties"]["Insert"]>;
      };
      bookings: {
        Row: {
          id: string;
          pg_id: string;
          user_id: string;
          room_type: string;
          move_in_date: string;
          payment_method: "UPI" | "Card" | "Cash" | "Bank Transfer";
          monthly_rent: number;
          security_deposit: number;
          status: "Pending" | "Confirmed" | "Cancelled" | "Completed";
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["bookings"]["Row"], "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["bookings"]["Insert"]>;
      };
      visit_schedules: {
        Row: {
          id: string;
          pg_id: string;
          user_id: string;
          visit_date: string;
          visit_time: string;
          status: "Scheduled" | "Completed" | "Cancelled";
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["visit_schedules"]["Row"], "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["visit_schedules"]["Insert"]>;
      };
      leads: {
        Row: {
          id: string;
          name: string;
          phone: string;
          email: string | null;
          preferred_area: string;
          budget_min: number;
          budget_max: number;
          preferred_gender: string;
          preferred_room_type: string;
          move_in_date: string;
          notes: string | null;
          status: "New" | "Contacted" | "Visited" | "Converted" | "Lost";
          match_score: number | null;
          matched_pg_ids: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["leads"]["Row"], "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["leads"]["Insert"]>;
      };
      saved_pgs: {
        Row: {
          id: string;
          user_id: string;
          pg_id: string;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["saved_pgs"]["Row"], "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: never;
      };
      reviews: {
        Row: {
          id: string;
          pg_id: string;
          user_id: string;
          rating: number;
          comment: string;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["reviews"]["Row"], "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["reviews"]["Insert"]>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
