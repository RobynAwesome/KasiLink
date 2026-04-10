import { describe, it, expect } from "vitest";
import { SUBURB_COORDS, SUBURBS, inferCity, coordsForSuburb } from "@/lib/suburbs";

describe("SUBURB_COORDS", () => {
  it("has GeoJSON order [longitude, latitude]", () => {
    // Soweto: lng ~27.8, lat ~-26.2 — longitude is LESS than 90 (not lat)
    const [lng, lat] = SUBURB_COORDS["Soweto"];
    expect(Math.abs(lng)).toBeLessThan(180);
    expect(Math.abs(lat)).toBeLessThan(90);
    // SA is in the southern hemisphere → lat negative
    expect(lat).toBeLessThan(0);
  });

  it("includes Cape Town and Johannesburg suburbs", () => {
    expect(SUBURB_COORDS["Khayelitsha"]).toBeDefined();
    expect(SUBURB_COORDS["Soweto"]).toBeDefined();
  });
});

describe("SUBURBS", () => {
  it("matches keys of SUBURB_COORDS", () => {
    expect(SUBURBS).toEqual(Object.keys(SUBURB_COORDS));
  });

  it("has at least 15 entries", () => {
    expect(SUBURBS.length).toBeGreaterThanOrEqual(15);
  });
});

describe("inferCity", () => {
  it("returns Cape Town for Khayelitsha", () =>
    expect(inferCity("Khayelitsha")).toBe("Cape Town"));
  it("returns Cape Town for Bellville", () =>
    expect(inferCity("Bellville")).toBe("Cape Town"));
  it("returns Cape Town for Cape Town CBD", () =>
    expect(inferCity("Cape Town CBD")).toBe("Cape Town"));
  it("returns Johannesburg for Soweto", () =>
    expect(inferCity("Soweto")).toBe("Johannesburg"));
  it("returns Johannesburg for unknown suburb", () =>
    expect(inferCity("Unknownville")).toBe("Johannesburg"));
  it("returns Johannesburg for Alexandra", () =>
    expect(inferCity("Alexandra")).toBe("Johannesburg"));
});

describe("coordsForSuburb", () => {
  it("returns correct coords for known suburb", () => {
    const coords = coordsForSuburb("Tembisa");
    expect(coords).toEqual(SUBURB_COORDS["Tembisa"]);
  });

  it("falls back to Joburg CBD for unknown suburb", () => {
    const coords = coordsForSuburb("Unknownville");
    expect(coords).toEqual([28.0473, -26.2041]);
  });
});
