import type { PGProperty, Lead } from "@/types";

interface MatchScore {
  pg: PGProperty;
  score: number;
  breakdown: {
    location: number;
    budget: number;
    roomType: number;
    gender: number;
  };
}

/**
 * Scores PGs against a lead requirement.
 * Weights: Location 40pts, Budget 30pts, RoomType 20pts, Gender 10pts
 */
export function smartMatch(lead: Lead, pgs: PGProperty[]): MatchScore[] {
  return pgs
    .map(pg => {
      let location = 0;
      let budget = 0;
      let roomType = 0;
      let gender = 0;

      // Location (40 pts)
      if (pg.area.toLowerCase().includes(lead.preferred_area.toLowerCase())) {
        location = 40;
      } else if (pg.locality?.toLowerCase().includes(lead.preferred_area.toLowerCase())) {
        location = 25;
      }

      // Budget (30 pts) - based on double sharing price
      const price = pg.price_double || pg.price_triple || pg.price_single || 99999;
      if (price <= lead.budget_max) {
        const ratio = price / lead.budget_max;
        if (ratio <= 0.8) budget = 30;
        else if (ratio <= 0.95) budget = 20;
        else budget = 10;
      }

      // Room type (20 pts)
      if (pg.room_types.some(rt => rt.toLowerCase().includes(lead.preferred_room_type.toLowerCase()))) {
        roomType = 20;
      }

      // Gender (10 pts)
      if (pg.gender === lead.preferred_gender || pg.gender === "Co-live") {
        gender = pg.gender === lead.preferred_gender ? 10 : 5;
      }

      const score = location + budget + roomType + gender;
      return { pg, score, breakdown: { location, budget, roomType, gender } };
    })
    .filter(m => m.score > 0)
    .sort((a, b) => b.score - a.score);
}

/** Returns the top N matches as a percentage score (0-100) */
export function getTopMatches(lead: Lead, pgs: PGProperty[], limit = 5): MatchScore[] {
  return smartMatch(lead, pgs).slice(0, limit).map(m => ({
    ...m,
    score: Math.round((m.score / 100) * 100),
  }));
}
