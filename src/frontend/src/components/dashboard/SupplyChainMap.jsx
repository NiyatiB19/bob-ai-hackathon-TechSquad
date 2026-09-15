import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import {
  Globe,
  ArrowUpRight,
  AlertTriangle,
  Truck,
  Anchor,
  Navigation,
  MapPin,
  RotateCcw
} from 'lucide-react';
import { LOCATION_COORDINATES, createCustomIcon, getCoordinates } from '../../utils/mapCoordinates';
import { disruptionsMockData, fleetMockData } from '../../mock/masterMockData';
import { shipmentsInitialData } from '../../mock/shipmentsMock';

// Helper component to auto-fit map bounds
function MapBoundsFitter({ bounds }) {
  const map = useMap();
  React.useEffect(() => {
    if (bounds && bounds.length > 0) {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 5 });
    }
  }, [map, bounds]);
  return null;
}

// Reset view controller
function ResetViewController({ center, zoom }) {
  const map = useMap();
  const handleReset = () => {
    map.setView(center, zoom);
  };
  return (
    <button
      onClick={handleReset}
      aria-label="Fit map route"
      title="Reset route view"
      className="p-1.5 text-sky-600 hover:bg-sky-50 rounded transition-colors cursor-pointer"
    >
      <RotateCcw className="w-3.5 h-3.5" />
    </button>
  );
}

export default function SupplyChainMap() {
  const navigate = useNavigate();

  // Define ports of interest
  const ports = useMemo(() => [
    { name: 'Port of Shanghai', city: 'Shanghai', coords: LOCATION_COORDINATES['Shanghai'], code: 'CNSHA' },
    { name: 'Port of Singapore', city: 'Singapore', coords: LOCATION_COORDINATES['Singapore'], code: 'SGSIN' },
    { name: 'Port of Mumbai (JNPT)', city: 'Mumbai', coords: LOCATION_COORDINATES['Mumbai'], code: 'INBOM' },
    { name: 'Port of Rotterdam', city: 'Rotterdam', coords: LOCATION_COORDINATES['Rotterdam'], code: 'NLRTM' },
    { name: 'Port of Dubai (Jebel Ali)', city: 'Dubai', coords: LOCATION_COORDINATES['Dubai'], code: 'AEJEA' },
  ], []);

  // Define realistic route polylines
  // 1. Recommended Route: Shanghai -> Singapore -> Mumbai (Green)
  const recommendedPolyline = [
    LOCATION_COORDINATES['Shanghai'],
    [20.0, 115.0], // South China Sea
    LOCATION_COORDINATES['Singapore'],
    [6.0, 95.0],   // Malacca Outlet
    [10.0, 80.0],  // Bay of Bengal
    LOCATION_COORDINATES['Mumbai']
  ];

  // 2. Disrupted Corridor Route: Dubai -> Red Sea / Suez -> Rotterdam (Red dashed)
  const disruptedPolyline = [
    LOCATION_COORDINATES['Dubai'],
    LOCATION_COORDINATES['Suez Canal'],
    [36.0, 15.0],  // Mediterranean
    [43.0, -9.0],  // Atlantic approach
    LOCATION_COORDINATES['Rotterdam']
  ];

  // 3. Alternative Route: Shanghai -> Dubai -> Frankfurt (Blue dashed)
  const alternativePolyline = [
    LOCATION_COORDINATES['Shanghai'],
    [15.0, 85.0],
    LOCATION_COORDINATES['Dubai'],
    [35.0, 45.0],
    LOCATION_COORDINATES['Frankfurt']
  ];

  // Calculate default bounds containing all key nodes
  const allBounds = useMemo(() => [
    LOCATION_COORDINATES['Shanghai'],
    LOCATION_COORDINATES['Singapore'],
    LOCATION_COORDINATES['Mumbai'],
    LOCATION_COORDINATES['Rotterdam'],
    LOCATION_COORDINATES['Dubai'],
    LOCATION_COORDINATES['Frankfurt']
  ], []);

  const defaultCenter = [22.0, 78.0];
  const defaultZoom = 3;

  return (
    <div className="rounded-xl bg-white border border-slate-200 p-4 space-y-3 shadow-xs">
      
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-sky-100 text-sky-700 border border-sky-200">
            <Globe className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#0B192C] font-heading tracking-tight">
              Live Supply Chain Map
            </h3>
            <p className="text-[11px] text-slate-400 font-normal">
              Real-time location of shipments, disruptions, fleet assets and trade corridors
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate('/routes')}
          className="inline-flex items-center space-x-1 text-xs font-bold text-sky-600 hover:text-sky-700 transition-colors cursor-pointer"
        >
          <span>View Full Map</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Real Interactive Map Visual Container */}
      <div className="relative w-full h-[450px] sm:h-[480px] rounded-lg overflow-hidden border border-slate-200 shadow-inner z-0">
        
        {/* Floating Compact Legend Box (Top-Left) */}
        <div className="absolute top-3 left-3 z-[1000] bg-white/95 backdrop-blur-md border border-slate-200 rounded-lg p-2.5 text-xs space-y-1.5 max-w-[210px] shadow-md">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Live Map Legend</div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-100" />
            <span className="text-[11px] font-semibold text-slate-700">Shipment (On Track)</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 ring-2 ring-amber-100" />
            <span className="text-[11px] font-semibold text-slate-700">Shipment (Delayed)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3.5 h-3.5 rounded-full bg-rose-600 text-white flex items-center justify-center text-[9px] font-bold">!</div>
            <span className="text-[11px] font-semibold text-slate-700">Disruption Zone</span>
          </div>
          <div className="flex items-center space-x-2">
            <Truck className="w-3.5 h-3.5 text-indigo-600" />
            <span className="text-[11px] font-semibold text-slate-700">Fleet Asset</span>
          </div>
          <div className="flex items-center space-x-2">
            <Anchor className="w-3.5 h-3.5 text-sky-700" />
            <span className="text-[11px] font-semibold text-slate-700">Major Seaport</span>
          </div>
          <div className="pt-1 border-t border-slate-100 space-y-1">
            <div className="flex items-center space-x-2">
              <span className="w-4 border-t-2 border-emerald-500" />
              <span className="text-[10px] font-medium text-slate-600">Recommended Route</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-4 border-t-2 border-dashed border-rose-500" />
              <span className="text-[10px] font-medium text-slate-600">Disrupted Route</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-4 border-t-2 border-dashed border-indigo-500" />
              <span className="text-[10px] font-medium text-slate-600">Alternative Route</span>
            </div>
          </div>
        </div>

        {/* Leaflet MapContainer */}
        <MapContainer
          center={defaultCenter}
          zoom={defaultZoom}
          scrollWheelZoom={true}
          className="w-full h-full z-0 font-sans"
          attributionControl={true}
        >
          <MapBoundsFitter bounds={allBounds} />

          {/* OpenStreetMap Base Tile Layer */}
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            maxZoom={18}
          />

          {/* 1. Recommended Route (Green Solid Polyline) */}
          <Polyline
            positions={recommendedPolyline}
            pathOptions={{ color: '#10B981', weight: 4, opacity: 0.85 }}
          />

          {/* 2. Disrupted Route (Red Dashed Polyline) */}
          <Polyline
            positions={disruptedPolyline}
            pathOptions={{ color: '#EF4444', weight: 3, dashArray: '6, 8', opacity: 0.8 }}
          />

          {/* 3. Alternative Route (Blue Dashed Polyline) */}
          <Polyline
            positions={alternativePolyline}
            pathOptions={{ color: '#6366F1', weight: 3, dashArray: '5, 5', opacity: 0.75 }}
          />

          {/* Port Markers */}
          {ports.map((port) => (
            <Marker
              key={port.code}
              position={port.coords}
              icon={createCustomIcon('port', 'sky')}
            >
              <Popup className="font-sans">
                <div className="p-1 min-w-[160px]">
                  <div className="flex items-center space-x-1.5 text-sky-800 font-bold text-xs mb-1">
                    <Anchor className="w-3.5 h-3.5" />
                    <span>{port.name}</span>
                  </div>
                  <div className="text-[11px] text-slate-600 space-y-0.5">
                    <div>City: <strong>{port.city}</strong></div>
                    <div>Port Code: <span className="font-mono bg-slate-100 px-1 py-0.5 rounded text-[10px] font-bold">{port.code}</span></div>
                    <div className="text-emerald-600 font-semibold text-[10px] mt-1">Status: Operational</div>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Shipment Markers */}
          {shipmentsInitialData.map((shipment) => {
            const coords = getCoordinates(shipment.origin) || getCoordinates(shipment.currentLocation);
            if (!coords) return null;
            const isDelayed = shipment.status === 'Delayed';
            const color = isDelayed ? 'amber' : 'emerald';

            return (
              <Marker
                key={shipment.id}
                position={coords}
                icon={createCustomIcon('pin', color)}
              >
                <Popup className="font-sans">
                  <div className="p-1 min-w-[180px]">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-bold text-slate-900 text-xs">{shipment.id}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        isDelayed ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}>
                        {shipment.status}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-600 space-y-1">
                      <div>Origin: <strong>{shipment.origin}</strong></div>
                      <div>Destination: <strong>{shipment.destination}</strong></div>
                      <div>Cargo: <span className="text-slate-800">{shipment.cargoType}</span></div>
                      <div>ETA: <strong>{shipment.eta}</strong></div>
                      <div>Carrier: <strong>{shipment.carrier}</strong></div>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}

          {/* Disruption Markers */}
          {disruptionsMockData.map((disruption) => {
            const coords = getCoordinates(disruption.location);
            if (!coords) return null;

            return (
              <Marker
                key={disruption.id}
                position={coords}
                icon={createCustomIcon('disruption', 'rose')}
              >
                <Popup className="font-sans">
                  <div className="p-1 min-w-[200px]">
                    <div className="flex items-center space-x-1.5 text-rose-700 font-bold text-xs mb-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>{disruption.title}</span>
                    </div>
                    <div className="text-[11px] text-slate-600 space-y-1">
                      <div>Severity: <span className="font-bold text-rose-600">{disruption.severity}</span></div>
                      <div>Location: <strong>{disruption.location}</strong></div>
                      <div className="text-slate-700 italic text-[10px] bg-rose-50 p-1.5 rounded border border-rose-100 mt-1">
                        "{disruption.description}"
                      </div>
                      <div className="text-[10px] text-slate-500 mt-1">
                        Impacted: <strong>{disruption.affectedShipments.join(', ')}</strong>
                      </div>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}

          {/* Fleet Markers */}
          {fleetMockData.map((fleet) => {
            const coords = getCoordinates(fleet.location);
            if (!coords) return null;

            return (
              <Marker
                key={fleet.id}
                position={coords}
                icon={createCustomIcon('fleet', 'indigo')}
              >
                <Popup className="font-sans">
                  <div className="p-1 min-w-[170px]">
                    <div className="flex items-center space-x-1.5 text-indigo-700 font-bold text-xs mb-1">
                      <Truck className="w-3.5 h-3.5" />
                      <span>{fleet.id} - {fleet.type}</span>
                    </div>
                    <div className="text-[11px] text-slate-600 space-y-1">
                      <div>Asset Name: <strong>{fleet.name}</strong></div>
                      <div>Location: <strong>{fleet.location}</strong></div>
                      <div>Status: <span className="font-semibold text-indigo-900">{fleet.status}</span></div>
                      <div>Utilization: <strong>{fleet.utilization}%</strong></div>
                      <div>Driver/Crew: <strong>{fleet.driver}</strong></div>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}

        </MapContainer>

      </div>

    </div>
  );
}
