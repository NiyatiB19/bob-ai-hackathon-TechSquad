import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Globe,
  ArrowUpRight,
  Plus,
  Minus,
  Navigation,
  Anchor,
  Truck,
  AlertTriangle,
  MapPin
} from 'lucide-react';

export default function SupplyChainMap() {
  const navigate = useNavigate();

  return (
    <div className="rounded-xl bg-white border border-slate-200 p-4 space-y-3">
      
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
              Real-time location of shipments, disruptions and route status
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

      {/* Map Visual Container */}
      <div className="relative w-full h-80 sm:h-96 rounded-lg overflow-hidden bg-[#D3E8F5] border border-sky-200/80">
        
        {/* Cartographic Vector World Map SVG */}
        <svg
          className="absolute inset-0 w-full h-full object-cover opacity-75 pointer-events-none"
          viewBox="0 0 1000 500"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* North America */}
          <path d="M 120 100 Q 180 80 260 120 T 200 240 Q 140 220 100 160 Z" fill="#B4D9EE" stroke="#8DC2E3" strokeWidth="1" />
          {/* South America */}
          <path d="M 240 260 Q 280 270 300 340 T 250 420 Q 210 380 220 300 Z" fill="#B4D9EE" stroke="#8DC2E3" strokeWidth="1" />
          {/* Europe */}
          <path d="M 450 90 Q 520 80 560 140 T 480 200 Q 440 160 450 90 Z" fill="#B4D9EE" stroke="#8DC2E3" strokeWidth="1" />
          {/* Africa */}
          <path d="M 460 210 Q 540 220 560 320 T 490 400 Q 440 330 450 240 Z" fill="#B4D9EE" stroke="#8DC2E3" strokeWidth="1" />
          {/* Asia */}
          <path d="M 580 90 Q 750 60 840 160 T 720 280 Q 620 220 580 90 Z" fill="#B4D9EE" stroke="#8DC2E3" strokeWidth="1" />
          {/* Australia */}
          <path d="M 780 320 Q 860 310 880 380 T 800 420 Q 760 380 780 320 Z" fill="#B4D9EE" stroke="#8DC2E3" strokeWidth="1" />

          {/* Thin Dotted Route Curve */}
          <path
            d="M 490 130 Q 530 170 580 210 T 700 290 Q 730 230 740 180"
            fill="none"
            stroke="#0284C7"
            strokeWidth="1.8"
            strokeDasharray="5 5"
          />
          
          <path
            d="M 490 130 Q 470 180 380 200 T 220 180"
            fill="none"
            stroke="#10B981"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
        </svg>

        {/* Floating Compact Legend Box (Top-Left) */}
        <div className="absolute top-2.5 left-2.5 z-20 bg-white/90 backdrop-blur-xs border border-slate-200 rounded-lg p-2.5 text-xs space-y-1 max-w-[200px] shadow-xs">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-[11px] font-semibold text-slate-700">Shipment (On Track)</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="text-[11px] font-semibold text-slate-700">Shipment (Delayed)</span>
          </div>
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-3 h-3 text-rose-500" />
            <span className="text-[11px] font-semibold text-slate-700">Disruption</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3.5 border-t-2 border-dashed border-sky-600" />
            <span className="text-[11px] font-semibold text-slate-700">Recommended Route</span>
          </div>
          <div className="flex items-center space-x-2">
            <Truck className="w-3 h-3 text-indigo-600" />
            <span className="text-[11px] font-semibold text-slate-700">Fleet Location</span>
          </div>
          <div className="flex items-center space-x-2">
            <Anchor className="w-3 h-3 text-sky-700" />
            <span className="text-[11px] font-semibold text-slate-700">Port</span>
          </div>
        </div>

        {/* Map Marker Pins */}

        {/* 1. Rotterdam Pin (On Track - Green) */}
        <div className="absolute top-[26%] left-[49%] -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center group/pin cursor-pointer">
          <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center border border-white shadow-xs">
            <MapPin className="w-3 h-3" />
          </div>
        </div>

        {/* 2. Disruption Warning Pin (Red Alert - Suez Area) */}
        <div className="absolute top-[28%] left-[56%] -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center group/pin cursor-pointer">
          <div className="w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center border border-white shadow-xs">
            <AlertTriangle className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* 3. Delayed Shipment Pin (Orange Pin - Dubai Area) */}
        <div className="absolute top-[42%] left-[60%] -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center group/pin cursor-pointer">
          <div className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center border border-white shadow-xs">
            <MapPin className="w-3 h-3" />
          </div>
        </div>

        {/* 4. Fleet Location Truck Pin (Indian Ocean) */}
        <div className="absolute top-[46%] left-[68%] -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center group/pin cursor-pointer">
          <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center border border-white shadow-xs">
            <Truck className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* 5. Singapore Port Pin (Green Anchor) */}
        <div className="absolute top-[58%] left-[72%] -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center group/pin cursor-pointer">
          <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center border border-white shadow-xs">
            <Anchor className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* 6. Shanghai Pin (Green Pin) */}
        <div className="absolute top-[36%] left-[78%] -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center group/pin cursor-pointer">
          <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center border border-white shadow-xs">
            <MapPin className="w-3 h-3" />
          </div>
        </div>

        {/* Bottom-Right Compact Map Controls */}
        <div className="absolute bottom-2.5 right-2.5 z-20 flex flex-col bg-white border border-slate-200 rounded-lg p-0.5 shadow-xs">
          <button aria-label="Zoom in" className="p-1 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded transition-colors cursor-pointer">
            <Plus className="w-3.5 h-3.5" />
          </button>
          <button aria-label="Zoom out" className="p-1 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded transition-colors cursor-pointer">
            <Minus className="w-3.5 h-3.5" />
          </button>
          <div className="h-px bg-slate-200 my-0.5" />
          <button aria-label="Center map" className="p-1 text-sky-600 hover:bg-sky-50 rounded transition-colors cursor-pointer">
            <Navigation className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

    </div>
  );
}
