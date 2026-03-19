/**
 * FIND_PG_DATA_GG — Supplementary area data from the Google Sheets PDF
 * Maps Gharpayy's sales areas to their WhatsApp form links.
 * BTM Layout, Silk Board, Koramangala, Bellandur, Nagawara, Whitefield etc.
 * 
 * This data is referenced by the seed script and smartMatch engine
 * to improve area-based lead routing.
 */

export const AREA_FORM_MAP: Record<string, string> = {
  "BTM Layout":     "https://forms.gle/rz4TVciKX25eb51CA",
  "Koramangala":    "https://forms.gle/rz4TVciKX25eb51CA",
  "Bellandur":      "https://forms.gle/rz4TVciKX25eb51CA",
  "Mahadevapura":   "https://forms.gle/rz4TVciKX25eb51CA",
  "Marathahalli":   "https://forms.gle/rz4TVciKX25eb51CA",
  "Electronic City":"https://forms.gle/rz4TVciKX25eb51CA",
  "Whitefield":     "https://forms.gle/rz4TVciKX25eb51CA",
  "HSR Layout":     "https://forms.gle/rz4TVciKX25eb51CA",
  "Jayanagar":      "https://forms.gle/rz4TVciKX25eb51CA",
  "Nagawara":       "https://forms.gle/rz4TVciKX25eb51CA",
  "MG Road":        "https://forms.gle/rz4TVciKX25eb51CA",
};

/**
 * IQ sheet column mapping — used to understand which PG data fields
 * correspond to which columns in the Gharpayy master spreadsheet.
 */
export const IQ_COLUMNS = [
  "Gharpayy's Name of PG",
  "Area",
  "Locality",
  "Nearby Landmarks",
  "Location (WhatsApp message)",
  "Price/Monthly (Do not Disclose Without Interest Shown)",
  "Manager Name",
  "Manager Contact",
  "Owner Name",
  "Owner Number",
  "Group Name",
  "Actual Name of PG",
  "Google Maps Link",
  "Gender (Boys/Girls/Co-live)",
  "Target Audience (Students / Working Professionals / Both)",
  "Property Type (Premium / Mid / Budget)",
  "Room Type",
  "Furnishing Details",
  "Walking Distance to Landmarks (Mins)",
  "Accessibility",
  "Noise Level",
  "Surrounding Vibe",
  "Food Type (Veg / Non-Veg / Both / Self-Cook Option)",
  "Common Area Features",
  "Amenities",
  "Safety Features",
  "Meals Included",
  "Food Timings/Details",
  "E Bill / Utilities Included",
  "Cleaning Frequency",
  "USP of Property",
  "House Rules",
  "Lows (Don't Disclose)",
  "Security Deposit info",
  "Minimum Stay",
  "Drive Folder (Brochure) (Only PDF)",
  "Drive Folder (Photos) (Only Images)",
  "Drive Folder (Videos) (Only Videos)",
] as const;

export type IQColumn = typeof IQ_COLUMNS[number];
