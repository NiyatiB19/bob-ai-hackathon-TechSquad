import React, { useMemo, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Navigation, AlertTriangle, ShieldCheck, MapPin, Anchor } from 'lucide-react';
import { LOCATION_COORDINATES, createCustomIcon, getCoordinates } from '../../utils/mapCoordinates';
import { disruptionsMockData } from '../../mock/masterMockData';

// Component to handle auto-fitting bounds when origin/destination change
function AutoFitRouteBounds({ originCoords, destCoords, waypoints }) {
  const map = useMap();

  useEffect(() => {
    if (originCoords && destCoords) {
      const allPoints = [originCoords, destCoords, ...(waypoints || [])];
      const bounds = L.latLngBounds(allPoints);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 6 });
    }
  }, [map, originCoords, destCoords, waypoints]);

  return null;
}

export default function RouteMapVisualization({ origin = 'Shanghai', destination = 'Mumbai' }) {
  const originCoords = useMemo(() => getCoordinates(origin) || LOCATION_COORDINATES['Shanghai'], [origin]);
  const destCoords = useMemo(() => getCoordinates(destination) || LOCATION_COORDINATES['Mumbai'], [destination]);

  // Recommended Bypass Corridor (Green Solid Polyline: Air-Land Multimodal bypass)
  const recommendedRoute = useMemo(() => [
    originCoords,
    [22.5, 114.0], // Hong Kong Air Corridor
    [13.7, 100.5], // Bangkok Transit Waypoint
    [13.0, 85.0],  // Bay of Bengal Air Corridor
    destCoords
  ], [originCoords, destCoords]);

  // Primary Sea Corridor (Red Dashed Polyline: Affected by Singapore strike)
  const primaryDisruptedRoute = useMemo(() => [
    originCoords,
    [15.0, 115.0], // South China Sea
    LOCATION_COORDINATES['Singapore'], // Disruption Zone at Singapore
    [5.0, 95.0],   // Malacca Outlet
    [10.0, 78.0],  // Southern Tip Sri Lanka
    destCoords
  ], [originCoords, destCoords]);

  // Alternative Overland Rail Corridor (Blue Line)
  const alternativeRoute = useMemo(() => [
    originCoords,
    [30.6, 104.0], // Chengdu Hub
    [26.0, 88.0],  // Eastern Himalayas Rail Link
    [23.0, 77.0],  // Central India Hub
    destCoords
  ], [originCoords, destCoords]);

  // Singapore Disruption Pin
  const SingaporeDisruption = disruptionsMockData.find(d => d.id === 'dis_3001') || {
    title: 'Port Congestion & Strike',
    severity: 'High',
    location: 'Port of Singapore',
    description: '48+ hour berth delays across Straits'
  };

  return (
    <div className="rounded-xl bg-white border border-slate-200 p-4 shadow-xs space-y-3">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-sky-100 text-sky-700 border border-sky-200">
            <Navigation className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#0B192C] font-heading">
              Route Path Visualization ({origin} → {destination})
            </h3>
            <p className="text-[11px] text-slate-400 font-normal">
              Real geographic trade corridor, disruption zones and recommended bypass path
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Recommended Bypass Active</span>
          </span>
        </div>
      </div>

      {/* Leaflet Map Box */}
      <div className="relative w-full h-[420px] sm:h-[450px] rounded-lg overflow-hidden border border-slate-200 shadow-inner z-0">
        
        {/* Floating Legend */}
        <div className="absolute top-3 left-3 z-[1000] bg-white/95 backdrop-blur-md border border-slate-200 rounded-lg p-2.5 text-xs space-y-1.5 max-w-[220px] shadow-md">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Route Legend</div>
          <div className="flex items-center space-x-2">
            <span className="w-4 border-t-3 border-emerald-500" />
            <span className="text-[11px] font-extrabold text-emerald-700">Recommended Bypass Route</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-4 border-t-2 border-dashed border-rose-500" />
            <span className="text-[11px] font-semibold text-rose-700">Disrupted Primary Route</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-4 border-t-2 border-dashed border-indigo-500" />
            <span className="text-[11px] font-semibold text-indigo-700">Alternative Rail Corridor</span>
          </div>
          <div className="pt-1.5 border-t border-slate-100 flex items-center space-x-2">
            <div className="w-3.5 h-3.5 rounded-full bg-rose-600 text-white flex items-center justify-center text-[9px] font-bold">!</div>
            <span className="text-[11px] font-semibold text-slate-700">Bottleneck / Disruption</span>
          </div>
        </div>

        {/* Map Container */}
        <MapContainer
          center={[18.0, 95.0]}
          zoom={4}
          scrollWheelZoom={true}
          className="w-full h-full z-0 font-sans"
        >
          <AutoFitRouteBounds
            originCoords={originCoords}
            destCoords={destCoords}
            waypoints={[LOCATION_COORDINATES['Singapore'], [13.7, 100.5]]}
          />

          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            maxZoom={18}
          />

          {/* 1. Recommended Bypass Route (Green Solid Polyline) */}
          <Polyline
            positions={recommendedRoute}
            pathOptions={{ color: '#10B981', weight: 4.5, opacity: 0.9 }}
          />

          {/* 2. Disrupted Primary Route (Red Dashed Polyline) */}
          <Polyline
            positions={primaryDisruptedRoute}
            pathOptions={{ color: '#EF4444', weight: 3, dashArray: '6, 8', opacity: 0.75 }}
          />

          {/* 3. Alternative Route (Indigo Dashed Polyline) */}
          <Polyline
            positions={alternativeRoute}
            pathOptions={{ color: '#6366F1', weight: 3, dashArray: '5, 5', opacity: 0.7 }}
          />

          {/* Origin Marker */}
          <Marker position={originCoords} icon={createCustomIcon('pin', 'emerald')}>
            <Popup className="font-sans">
              <div className="p-1 min-w-[140px]">
                <div className="font-bold text-emerald-800 text-xs">{origin} (Origin Port)</div>
                <div className="text-[11px] text-slate-600">Departure Cargo Hub</div>
              </div>
            </Popup>
          </Marker>

          {/* Destination Marker */}
          <Marker position={destCoords} icon={createCustomIcon('pin', 'indigo')}>
            <Popup className="font-sans">
              <div className="p-1 min-w-[140px]">
                <div className="font-bold text-indigo-800 text-xs">{destination} (Destination Port)</div>
                <div className="text-[11px] text-slate-600">Final Delivery Terminal</div>
              </div>
            </Popup>
          </Marker>

          {/* Singapore Port Disruption Marker */}
          <Marker position={LOCATION_COORDINATES['Singapore']} icon={createCustomIcon('disruption', 'rose')}>
            <Popup className="font-sans">
              <div className="p-1 min-w-[190px]">
                <div className="flex items-center space-x-1.5 text-rose-700 font-bold text-xs mb-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>{SingaporeDisruption.title}</span>
                </div>
                <div className="text-[11px] text-slate-600 space-y-1">
                  <div>Location: <strong>{SingaporeDisruption.location}</strong></div>
                  <div>Severity: <span className="font-bold text-rose-600">{SingaporeDisruption.severity}</span></div>
                  <div className="text-[10px] bg-rose-50 p-1.5 rounded border border-rose-100 text-rose-800">
                    Straits bottleneck causing +48h delay on primary maritime route.
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>

          {/* Intermediate Waypoint: Bangkok Multimodal Hub */}
          <Marker position={[13.7, 100.5]} icon={createCustomIcon('port', 'emerald')}>
            <Popup className="font-sans">
              <div className="p-1 min-w-[150px]">
                <div className="font-bold text-emerald-700 text-xs">Bangkok Air-Land Transfer</div>
                <div className="text-[11px] text-slate-600">B12 Multimodal Bypass Waypoint</div>
              </div>
            </Popup>
          </Marker>

        </MapContainer>
      </div>

    </div>
  );
}
