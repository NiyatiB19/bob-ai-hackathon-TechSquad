import React, { useState, useEffect, useMemo } from 'react';
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
import { API_BASE_URL } from '../../services/apiConfig';

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

export default function SupplyChainMap() {
  const navigate = useNavigate();
  const [dbShipments, setDbShipments] = useState([]);

  useEffect(() => {
    async function loadMapShipments() {
      try {
        const res = await fetch(`${API_BASE_URL}/shipments?limit=25`);
        const json = await res.json();
        if (json.success && json.data?.shipments?.length > 0) {
          setDbShipments(json.data.shipments);
        }
      } catch (err) {
        console.warn('Map fallback to local dataset:', err.message);
      }
    }
    loadMapShipments();
  }, []);

  // Major global ports
  const ports = useMemo(() => [
    { name: 'Port of Shanghai', city: 'Shanghai', coords: LOCATION_COORDINATES['Shanghai'], code: 'CNSHA' },
    { name: 'Port of Singapore', city: 'Singapore', coords: LOCATION_COORDINATES['Singapore'], code: 'SGSIN' },
    { name: 'Port of Mumbai (JNPT)', city: 'Mumbai', coords: LOCATION_COORDINATES['Mumbai'], code: 'INBOM' },
    { name: 'Port of Rotterdam', city: 'Rotterdam', coords: LOCATION_COORDINATES['Rotterdam'], code: 'NLRTM' },
    { name: 'Port of Dubai (Jebel Ali)', city: 'Dubai', coords: LOCATION_COORDINATES['Dubai'], code: 'AEJEA' },
  ], []);

  // Standard route trade polylines
  const recommendedPolyline = [
    LOCATION_COORDINATES['Shanghai'],
    [20.0, 115.0],
    LOCATION_COORDINATES['Singapore'],
    [6.0, 95.0],
    [10.0, 80.0],
    LOCATION_COORDINATES['Mumbai']
  ];

  const disruptedPolyline = [
    LOCATION_COORDINATES['Dubai'],
    LOCATION_COORDINATES['Suez Canal'],
    [36.0, 15.0],
    [43.0, -9.0],
    LOCATION_COORDINATES['Rotterdam']
  ];

  const alternativePolyline = [
    LOCATION_COORDINATES['Shanghai'],
    [15.0, 85.0],
    LOCATION_COORDINATES['Dubai'],
    [35.0, 45.0],
    LOCATION_COORDINATES['Frankfurt']
  ];

  const defaultCenter = [22.0, 40.0];
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
              Real-time locations from DataCo Supply Chain Dataset
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
        
        {/* Floating Compact Legend Box */}
        <div className="absolute top-3 left-3 z-[1000] bg-white/95 backdrop-blur-md border border-slate-200 rounded-lg p-2.5 text-xs space-y-1.5 max-w-[210px] shadow-md">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Live Map Legend</div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-100" />
            <span className="text-[11px] font-semibold text-slate-700">DataCo Shipment (On Track)</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 ring-2 ring-amber-100" />
            <span className="text-[11px] font-semibold text-slate-700">DataCo Shipment (Delayed)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3.5 h-3.5 rounded-full bg-rose-600 text-white flex items-center justify-center text-[9px] font-bold">!</div>
            <span className="text-[11px] font-semibold text-slate-700">Disruption Zone</span>
          </div>
          <div className="flex items-center space-x-2">
            <Truck className="w-3.5 h-3.5 text-indigo-600" />
            <span className="text-[11px] font-semibold text-slate-700">Fleet Telemetry</span>
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
          {/* OpenStreetMap Base Tile Layer */}
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            maxZoom={18}
          />

          {/* Trade Corridors */}
          <Polyline
            positions={recommendedPolyline}
            pathOptions={{ color: '#10B981', weight: 4, opacity: 0.85 }}
          />
          <Polyline
            positions={disruptedPolyline}
            pathOptions={{ color: '#EF4444', weight: 3, dashArray: '6, 8', opacity: 0.8 }}
          />
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
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* DataCo Live Shipment Markers */}
          {dbShipments.map((s) => {
            const originLat = s.origin?.lat || 0;
            const originLng = s.origin?.lng || 0;
            if (!originLat || !originLng) return null;

            const isDelayed = s.status === 'delayed' || s.lateDeliveryRisk === 1;
            const color = isDelayed ? 'amber' : 'emerald';

            return (
              <Marker
                key={s.shipmentId}
                position={[originLat, originLng]}
                icon={createCustomIcon('pin', color)}
              >
                <Popup className="font-sans">
                  <div className="p-1 min-w-[190px]">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-bold text-slate-900 text-xs font-mono">{s.shipmentId}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        isDelayed ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}>
                        {s.status}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-600 space-y-1">
                      <div>Origin: <strong>{s.origin?.city}, {s.origin?.country}</strong></div>
                      <div>Destination: <strong>{s.destination?.city}, {s.destination?.country}</strong></div>
                      <div>Product: <span className="text-slate-800 font-medium">{s.cargoType}</span></div>
                      <div>Mode: <strong>{s.shippingMode}</strong></div>
                      <div>Sales: <strong>${Math.round(s.salesUSD || 0).toLocaleString()}</strong></div>
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
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}

          {/* Operational Fleet Markers */}
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
