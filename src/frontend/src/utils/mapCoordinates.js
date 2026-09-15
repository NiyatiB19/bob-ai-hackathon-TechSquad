import L from 'leaflet';

/**
 * SupplyGuard AI Centralized Map Coordinates Registry
 * 
 * Maps known locations (cities, ports, transit zones) to real geographic [lat, lng].
 */
export const LOCATION_COORDINATES = {
  'Shanghai': [31.2304, 121.4737],
  'Shanghai, China': [31.2304, 121.4737],
  'Singapore': [1.3521, 103.8198],
  'Port of Singapore': [1.3521, 103.8198],
  'Singapore Terminal 4': [1.3521, 103.8198],
  'Mumbai': [19.0760, 72.8777],
  'Mumbai Depot': [18.9800, 72.8300],
  'Mumbai-Pune Corridor': [18.8000, 73.3000],
  'Mumbai, India': [19.0760, 72.8777],
  'Rotterdam': [51.9244, 4.4777],
  'Rotterdam, Netherlands': [51.9244, 4.4777],
  'Dubai': [25.2048, 55.2708],
  'Dubai, UAE': [25.2048, 55.2708],
  'Frankfurt': [50.1109, 8.6821],
  'Frankfurt Airport': [50.0379, 8.5622],
  'Frankfurt Hub (Delayed)': [50.1109, 8.6821],
  'Pune': [18.5204, 73.8567],
  'Pune Logistics Hub': [18.5204, 73.8567],
  'Arabian Sea Corridor': [16.5000, 68.0000],
  'Arabian Sea (18.9°N, 71.8°E)': [18.9000, 71.8000],
  'Malacca Strait': [3.0000, 100.5000],
  'Suez Canal': [29.9000, 32.5500],
  'Suez Area': [29.9000, 32.5500],
  'Mid-Pacific Transit Zone': [15.0000, 160.0000],
  'Los Angeles': [34.0522, -118.2437],
  'Chicago': [41.8781, -87.6298],
  'Sydney': [ -33.8688, 151.2093]
};

/**
 * Safely resolves location string or object to [lat, lng] array.
 * Returns null if location is unknown.
 */
export function getCoordinates(locationName) {
  if (!locationName) return null;
  if (Array.isArray(locationName) && locationName.length === 2) return locationName;
  if (typeof locationName === 'string') {
    const trimmed = locationName.trim();
    if (LOCATION_COORDINATES[trimmed]) return LOCATION_COORDINATES[trimmed];
    
    // Fuzzy matching for cities
    for (const [key, coords] of Object.entries(LOCATION_COORDINATES)) {
      if (trimmed.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(trimmed.toLowerCase())) {
        return coords;
      }
    }
  }
  return null;
}

/**
 * Creates custom Leaflet HTML DivIcon pins matching SupplyGuard design system.
 */
export function createCustomIcon(type, color = 'emerald') {
  let bgColor = 'bg-emerald-500';
  let iconSvg = '';

  if (color === 'emerald') bgColor = 'bg-emerald-500';
  else if (color === 'amber') bgColor = 'bg-amber-500';
  else if (color === 'rose' || color === 'red') bgColor = 'bg-rose-600';
  else if (color === 'indigo' || color === 'blue') bgColor = 'bg-indigo-600';
  else if (color === 'sky') bgColor = 'bg-sky-600';

  if (type === 'disruption') {
    iconSvg = `<svg class="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`;
  } else if (type === 'fleet' || type === 'truck') {
    iconSvg = `<svg class="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/></svg>`;
  } else if (type === 'port' || type === 'anchor') {
    iconSvg = `<svg class="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="5" r="3"/><line x1="12" y1="22" x2="12" y2="8"/><path d="M5 12H2a10 10 0 0 0 20 0h-3"/></svg>`;
  } else {
    // Default MapPin
    iconSvg = `<svg class="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`;
  }

  const html = `<div class="w-7 h-7 rounded-full ${bgColor} shadow-md border-2 border-white flex items-center justify-center transition-transform transform hover:scale-110">
    ${iconSvg}
  </div>`;

  return L.divIcon({
    html: html,
    className: 'custom-leaflet-marker',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14]
  });
}
