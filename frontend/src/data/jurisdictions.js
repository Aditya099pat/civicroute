/**
 * Supported cities / municipal bodies. Mumbai has verified seed pipelines;
 * other cities are resolved live by the AI (and flagged as AI-generated).
 */
export const CITIES = [
  { id: 'mumbai', label: 'Mumbai', body: 'MCGM', state: 'Maharashtra', seeded: true },
  { id: 'pune', label: 'Pune', body: 'PMC', state: 'Maharashtra', seeded: false },
  { id: 'nagpur', label: 'Nagpur', body: 'NMC', state: 'Maharashtra', seeded: false },
  { id: 'delhi', label: 'Delhi', body: 'MCD', state: 'Delhi (NCT)', seeded: false },
  { id: 'bengaluru', label: 'Bengaluru', body: 'BBMP', state: 'Karnataka', seeded: false },
  { id: 'hyderabad', label: 'Hyderabad', body: 'GHMC', state: 'Telangana', seeded: false },
];

export const MUMBAI_WARDS = [
  { id: 'k_west', label: 'Ward K-West (Andheri W / Juhu)' },
  { id: 'g_south', label: 'Ward G-South (Worli / Lower Parel)' },
  { id: 'd_ward', label: 'Ward D (Malabar Hill / Grant Rd)' },
  { id: 'h_east', label: 'Ward H-East (Bandra E / Santacruz E)' },
];

export function getCity(cityId) {
  return CITIES.find((c) => c.id === cityId) || CITIES[0];
}

/** Build the `location` string sent to the AI resolver. */
export function resolveLocation(cityId, wardId) {
  const city = getCity(cityId);
  if (city.id === 'mumbai') {
    const ward = MUMBAI_WARDS.find((w) => w.id === wardId);
    return ward
      ? `${city.label} (${city.body} ${ward.label})`
      : `${city.label}, ${city.state} (${city.body})`;
  }
  return `${city.label}, ${city.state} (${city.body})`;
}
