/**
 * SA suburb → GeoJSON coordinate map and city inference.
 * Used by gig creation forms and the seed script.
 * GeoJSON order: [longitude, latitude]
 */

export const SUBURB_COORDS: Record<string, [number, number]> = {
  "Khayelitsha":      [18.6840, -34.0350],
  "Mitchells Plain":  [18.6181, -34.0534],
  "Gugulethu":        [18.5784, -33.9898],
  "Langa":            [18.5324, -33.9583],
  "Nyanga":           [18.5937, -34.0095],
  "Philippi":         [18.6000, -34.0000],
  "Delft":            [18.6400, -33.9800],
  "Mfuleni":          [18.7100, -34.0100],
  "Crossroads":       [18.5700, -33.9900],
  "Soweto":           [27.8585, -26.2678],
  "Alexandra":        [28.0913, -26.1035],
  "Tembisa":          [28.2267, -25.9975],
  "Diepsloot":        [28.0167, -25.9333],
  "Cape Town CBD":    [18.4232, -33.9249],
  "Bellville":        [18.6333, -33.9000],
  "Johannesburg CBD": [28.0473, -26.2041],
  "Orange Farm":      [27.9833, -26.4833],
};

export const SUBURBS = Object.keys(SUBURB_COORDS);

const CAPE_TOWN_SUBURBS = new Set([
  "Khayelitsha", "Mitchells Plain", "Gugulethu", "Langa", "Nyanga",
  "Philippi", "Delft", "Mfuleni", "Crossroads", "Bellville", "Cape Town CBD",
]);

/**
 * Infer city from suburb name.
 * Defaults to "Johannesburg" for unrecognised suburbs.
 */
export function inferCity(suburb: string): string {
  if (CAPE_TOWN_SUBURBS.has(suburb) || suburb.toLowerCase().includes("cape town")) {
    return "Cape Town";
  }
  return "Johannesburg";
}

/** Return coords for a suburb, falling back to Johannesburg CBD. */
export function coordsForSuburb(suburb: string): [number, number] {
  return SUBURB_COORDS[suburb] ?? [28.0473, -26.2041];
}
