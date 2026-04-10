import { describe, it, expect } from "vitest";
import { distanceKm, toRadians } from "@/lib/geo";

describe("toRadians", () => {
  it("converts 180 degrees to PI", () => {
    expect(toRadians(180)).toBeCloseTo(Math.PI);
  });
  it("converts 0 to 0", () => {
    expect(toRadians(0)).toBe(0);
  });
  it("converts 90 to PI/2", () => {
    expect(toRadians(90)).toBeCloseTo(Math.PI / 2);
  });
});

describe("distanceKm — SA suburb pairs", () => {
  // Soweto (approx) to Alexandra (approx) — ~30 km apart
  it("calculates Soweto to Alexandra distance roughly", () => {
    const d = distanceKm(-26.2678, 27.8585, -26.1035, 28.0913);
    expect(d).toBeGreaterThan(15);
    expect(d).toBeLessThan(40);
  });

  // Same point — should be 0
  it("returns 0 for identical coordinates", () => {
    const d = distanceKm(-26.2041, 28.0473, -26.2041, 28.0473);
    expect(d).toBeCloseTo(0);
  });

  // Khayelitsha to Cape Town CBD — ~25 km
  it("calculates Khayelitsha to Cape Town CBD distance", () => {
    const d = distanceKm(-34.035, 18.684, -33.9249, 18.4232);
    expect(d).toBeGreaterThan(15);
    expect(d).toBeLessThan(35);
  });

  // Result is always non-negative
  it("always returns non-negative distance", () => {
    const d = distanceKm(-26.0, 28.0, -27.0, 29.0);
    expect(d).toBeGreaterThanOrEqual(0);
  });
});
