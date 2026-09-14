import React from 'react';
import {
  X,
  MapPin,
  Truck,
  Anchor,
  Plane,
  Snowflake,
  Clock,
  ShieldCheck,
  Globe,
  ExternalLink,
  Navigation
} from 'lucide-react';

export default function ShipmentDetailDrawer({ shipment, onClose }) {
  if (!shipment) return null;

  const modeIcons = {
    Ocean: Anchor,
    Air: Plane,
    Truck: Truck
  };
  const ModeIcon = modeIcons[shipment.transportMode] || Truck;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-40"
        onClick={onClose}
      />

      {/* Drawer Container */}
      <div className="fixed top-0 right-0 bottom-0 w-full sm:w-[460px] bg-white z-50 shadow-2xl border-l border-slate-200 flex flex-col justify-between animate-slideLeft">
        
        {/* Top Header */}
        <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-bold font-mono text-[#0B192C]">
                {shipment.id}
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${shipment.statusBadge}`}>
                {shipment.status}
              </span>
            </div>
            <h3 className="text-base font-extrabold text-slate-900 font-heading">
              {shipment.origin} → {shipment.destination}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
            aria-label="Close detail panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 text-xs text-slate-700">
          
          {/* Shipment Progress Stepper */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
              Shipment Progress ({shipment.progress || 65}%)
            </span>

            <div className="relative flex items-center justify-between">
              {/* Progress Line */}
              <div className="absolute top-1/2 left-2 right-2 h-1 bg-slate-200 -translate-y-1/2 z-0" />
              <div
                className="absolute top-1/2 left-2 h-1 bg-emerald-500 -translate-y-1/2 z-0 transition-all duration-500"
                style={{ width: `${shipment.progress || 65}%` }}
              />

              {/* Origin Marker */}
              <div className="relative z-10 w-4 h-4 rounded-full bg-emerald-600 border-2 border-white flex items-center justify-center shadow-xs">
                <span className="w-1.5 h-1.5 bg-white rounded-full" />
              </div>

              {/* Current Position Marker */}
              <div
                className="relative z-10 w-6 h-6 rounded-full bg-sky-600 border-2 border-white text-white flex items-center justify-center shadow-md animate-pulse"
                style={{ position: 'absolute', left: `calc(${shipment.progress || 65}% - 12px)` }}
              >
                <ModeIcon className="w-3 h-3" />
              </div>

              {/* Destination Marker */}
              <div className="relative z-10 w-4 h-4 rounded-full bg-slate-300 border-2 border-white" />
            </div>

            <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 pt-1">
              <span>{shipment.origin}</span>
              <span className="text-sky-600 font-semibold">{shipment.status}</span>
              <span>{shipment.destination}</span>
            </div>
          </div>

          {/* Micro Route Visualization SVG */}
          <div className="relative w-full h-36 rounded-xl overflow-hidden bg-[#D8EBF7] border border-sky-200">
            <svg className="w-full h-full object-cover opacity-70" viewBox="0 0 400 150">
              <path d="M 50 120 Q 150 40 250 80 T 350 30" fill="none" stroke="#0284C7" strokeWidth="2" strokeDasharray="5 5" />
              <circle cx="50" cy="120" r="5" fill="#10B981" />
              <circle cx="230" cy="72" r="7" fill="#0284C7" />
              <circle cx="350" cy="30" r="5" fill="#64748B" />
            </svg>
            <div className="absolute bottom-2 left-2.5 bg-white/90 backdrop-blur-xs px-2 py-1 rounded text-[10px] font-bold text-slate-700 border border-slate-200">
              {shipment.currentLocation}
            </div>
          </div>

          {/* Specifications Grid */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] border-b border-slate-200 pb-1.5">
              Shipment Specifications
            </h4>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/70 space-y-0.5">
                <span className="text-slate-400 text-[10px] block font-medium">Container Number</span>
                <span className="font-bold font-mono text-slate-800">{shipment.containerNo || 'CONT-84721'}</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/70 space-y-0.5">
                <span className="text-slate-400 text-[10px] block font-medium">Cargo Weight</span>
                <span className="font-bold text-slate-800">{shipment.weight || '12,450 kg'}</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/70 space-y-0.5">
                <span className="text-slate-400 text-[10px] block font-medium">Carrier</span>
                <span className="font-bold text-slate-800 truncate block">{shipment.carrier}</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/70 space-y-0.5">
                <span className="text-slate-400 text-[10px] block font-medium">Transport Mode</span>
                <span className="font-bold text-slate-800">{shipment.transportMode}</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/70 space-y-0.5">
                <span className="text-slate-400 text-[10px] block font-medium">Telemetry Temp</span>
                <div className="flex items-center space-x-1 font-bold text-sky-700">
                  <Snowflake className="w-3.5 h-3.5 text-sky-500" />
                  <span>{shipment.temperature}</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/70 space-y-0.5">
                <span className="text-slate-400 text-[10px] block font-medium">Expected ETA</span>
                <span className="font-bold text-slate-800">{shipment.eta}</span>
              </div>
            </div>
          </div>

          {/* Cargo Type Banner */}
          <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 font-medium flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Cargo Type: <strong>{shipment.cargoType || 'Standard Freight'}</strong></span>
          </div>

        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center space-x-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 px-3 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
          >
            Close
          </button>

          <button
            onClick={onClose}
            className="flex-1 py-2.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Track Live</span>
          </button>
        </div>

      </div>
    </>
  );
}
