// ─── PG / Property Types ────────────────────────────────────────────────────

export type Gender = "Boys" | "Girls" | "Co-live";
export type Audience = "Students" | "Working Professionals" | "Both";
export type PropertyType = "Premium" | "Mid" | "Budget";
export type NoiseLevel = "Low" | "Medium" | "High";

export interface PGProperty {
  id: string;
  gharpayy_name: string;          // "FORUM PRO BOYS"
  area: string;                    // "Koramangala"
  locality: string;
  nearby_landmarks: string;
  location_message: string;        // the WhatsApp pitch
  pricing_message: string;         // detailed pricing text
  google_maps_url: string | null;
  gender: Gender;
  target_audience: Audience;
  property_type: PropertyType;
  room_types: string[];            // ["Single Sharing","Double Sharing","Triple Sharing"]
  furnishing_details: string;
  walking_distance_mins: string;
  accessibility: string;           // "Bus", "Metro, Bus"
  noise_level: NoiseLevel;
  surrounding_vibe: string;
  food_type: string;               // "Veg" | "Non-Veg" | "Both" | "Self-Cook"
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
  // pricing (extracted from pricing_message)
  price_triple: number | null;
  price_double: number | null;
  price_single: number | null;
  // manager
  manager_name: string | null;
  manager_contact: string | null;
  owner_name: string | null;
  owner_contact: string | null;
  group_name: string | null;
  actual_name: string | null;
  // media
  brochure_url: string | null;
  photos_urls: string[];
  videos_urls: string[];
  // status
  is_available: boolean;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
}

// ─── Booking ────────────────────────────────────────────────────────────────

export type BookingStatus = "Pending" | "Confirmed" | "Cancelled" | "Completed";
export type PaymentMethod = "UPI" | "Card" | "Cash" | "Bank Transfer";

export interface Booking {
  id: string;
  pg_id: string;
  user_id: string;
  room_type: string;
  move_in_date: string;
  payment_method: PaymentMethod;
  monthly_rent: number;
  security_deposit: number;
  status: BookingStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
  // joined
  pg?: PGProperty;
  user?: UserProfile;
}

// ─── Visit Scheduling ────────────────────────────────────────────────────────

export interface VisitSchedule {
  id: string;
  pg_id: string;
  user_id: string;
  visit_date: string;
  visit_time: string;
  status: "Scheduled" | "Completed" | "Cancelled";
  created_at: string;
  pg?: PGProperty;
  user?: UserProfile;
}

// ─── Lead / Requirement ──────────────────────────────────────────────────────

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  preferred_area: string;
  budget_min: number;
  budget_max: number;
  preferred_gender: Gender;
  preferred_room_type: string;
  move_in_date: string;
  notes: string | null;
  status: "New" | "Contacted" | "Visited" | "Converted" | "Lost";
  match_score: number | null;
  matched_pg_ids: string[];
  created_at: string;
  updated_at: string;
}

// ─── User / Auth ─────────────────────────────────────────────────────────────

export type UserRole = "tenant" | "owner" | "admin";

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
  role: UserRole;
  avatar_url: string | null;
  preferred_area: string | null;
  budget_max: number | null;
  created_at: string;
}

// ─── Saved PGs ───────────────────────────────────────────────────────────────

export interface SavedPG {
  id: string;
  user_id: string;
  pg_id: string;
  created_at: string;
  pg?: PGProperty;
}

// ─── Review ──────────────────────────────────────────────────────────────────

export interface Review {
  id: string;
  pg_id: string;
  user_id: string;
  rating: number;
  comment: string;
  created_at: string;
  user?: UserProfile;
}

// ─── Filters ─────────────────────────────────────────────────────────────────

export interface PGFilters {
  area?: string;
  gender?: Gender | "";
  property_type?: PropertyType | "";
  room_type?: string;
  budget_min?: number;
  budget_max?: number;
  amenities?: string[];
  food_type?: string;
  audience?: Audience | "";
  search?: string;
}
