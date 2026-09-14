import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/dashboard/Sidebar';
import TopHeader from '../components/dashboard/TopHeader';
import { disruptionsMockData } from '../mock/masterMockData';
import {
  AlertTriangle,
  Anchor,
  Sun,
  Thermometer,
  Truck,
  MapPin,
  Clock,
  ShieldAlert,
  ArrowRight,
  Filter,
  CheckCircle2,
  Package
} from 'lucide-react';

export default function Disruptions() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const [disruptions, setDisruptions] = useState(disruptionsMockData);
  const [selectedDisruption, setSelectedDisruption] = useState(disruptionsMockData[0]);

  // Filters
  const [typeFilter, setTypeFilter] = useState('All');
  const [severityFilter, setSeverityFilter] = useState('All');

  const filteredDisruptions = disruptions.filter((item) => {
    const matchesType = typeFilter === 'All' || item.type === typeFilter;
    const matchesSeverity = severityFilter === 'All' || item.severity === severityFilter;
    return matchesType && matchesSeverity;
  });

  const getIcon = (type) => {
    switch (type) {
      case 'Port': return Anchor;
      case 'Weather': return Sun;
      case 'Cold Chain': return Thermometer;
      case 'Road': return Truck;
      default: return AlertTriangle;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/70 font-sans overflow-x-hidden">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <div className="lg:pl-[240px] flex flex-col min-h-screen">
        <TopHeader setMobileOpen={setMobileOpen} />

        <main className="flex-1 p-4 sm:p-5 lg:p-6 space-y-4 max-w-[1550px] w-full mx-auto animate-fadeIn">
          
          {/* Header */}
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#0B192C] font-heading tracking-tight">
              Disruptions Intelligence
            </h1>
            <p className="text-xs text-slate-500 font-normal">
              Continuous monitoring of environmental, labor, and infrastructure events affecting shipments.
            </p>
          </div>

          {/* Top Metrics Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
            <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Active Disruptions</span>
                <div className="text-2xl font-extrabold text-[#0B192C] font-heading">3</div>
                <span className="text-[11px] text-amber-600 font-medium">Monitoring active corridors</span>
              </div>
              <div className="p-2.5 rounded-lg bg-amber-50 text-amber-600 border border-amber-100">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>

            <div className="rounded-xl border border-rose-200 bg-rose-50/40 p-3.5 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold text-rose-500 uppercase tracking-wider block">Critical Severity</span>
                <div className="text-2xl font-extrabold text-rose-700 font-heading">1</div>
                <span className="text-[11px] text-rose-600 font-semibold">Immediate Action Required</span>
              </div>
              <div className="p-2.5 rounded-lg bg-rose-100 text-rose-700 border border-rose-200">
                <ShieldAlert className="w-4 h-4" />
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">High Risk</span>
                <div className="text-2xl font-extrabold text-[#0B192C] font-heading">2</div>
                <span className="text-[11px] text-slate-500 font-medium">Reroute recommended</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
                <Anchor className="w-4 h-4" />
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Affected Shipments</span>
                <div className="text-2xl font-extrabold text-[#0B192C] font-heading">7</div>
                <span className="text-[11px] text-sky-600 font-medium">Mapped to routes</span>
              </div>
              <div className="p-2.5 rounded-lg bg-sky-50 text-sky-600 border border-sky-100">
                <Package className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-bold text-slate-700">Category:</span>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none"
              >
                <option value="All">All Categories</option>
                <option value="Port">Port Strike & Congestion</option>
                <option value="Weather">Weather & Storm</option>
                <option value="Cold Chain">Cold Chain Thermal</option>
                <option value="Road">Road Closures</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-slate-700">Severity:</span>
              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none"
              >
                <option value="All">All Severities</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          {/* Main Two-Column Split Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            
            {/* Left Column: Disruption Cards List */}
            <div className="lg:col-span-5 space-y-2.5">
              {filteredDisruptions.map((item) => {
                const Icon = getIcon(item.type);
                const isSelected = selectedDisruption?.id === item.id;

                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedDisruption(item)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white border-emerald-500 ring-2 ring-emerald-500/20 shadow-md'
                        : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-lg ${isSelected ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="text-xs font-bold text-slate-900 font-heading">
                            {item.title}
                          </h3>
                          <p className="text-[11px] text-slate-500 font-medium">
                            {item.location}
                          </p>
                        </div>
                      </div>

                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${item.badgeClass}`}>
                        {item.severity}
                      </span>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                      <span>Affected: {item.affectedArea}</span>
                      <span>{item.timeAgo}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Column: Selected Disruption Details Panel */}
            {selectedDisruption && (
              <div className="lg:col-span-7 rounded-xl bg-white border border-slate-200 p-5 shadow-xs space-y-5">
                <div className="flex items-start justify-between border-b border-slate-200 pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-slate-400 uppercase font-mono">{selectedDisruption.id}</span>
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold border ${selectedDisruption.badgeClass}`}>
                        {selectedDisruption.severity} Severity
                      </span>
                    </div>
                    <h2 className="text-lg font-extrabold text-slate-900 font-heading">
                      {selectedDisruption.title}
                    </h2>
                    <p className="text-xs font-medium text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-rose-500" />
                      <span>{selectedDisruption.location} — {selectedDisruption.affectedArea}</span>
                    </p>
                  </div>
                </div>

                {/* Event Metadata */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Category</span>
                    <span className="font-bold text-slate-800">{selectedDisruption.type} Event</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Start Time</span>
                    <span className="font-semibold text-slate-800">{new Date(selectedDisruption.startTime).toLocaleDateString()}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 col-span-2 sm:col-span-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Expected Resolution</span>
                    <span className="font-semibold text-slate-800">{new Date(selectedDisruption.expectedEnd).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Situation Analysis</h4>
                  <p className="text-xs text-slate-600 leading-relaxed p-3 rounded-lg bg-slate-50 border border-slate-200/60">
                    {selectedDisruption.description}
                  </p>
                </div>

                {/* Affected Shipments */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Affected Active Shipments</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedDisruption.affectedShipments.map((shpId) => (
                      <span key={shpId} className="px-3 py-1 rounded-md bg-rose-50 border border-rose-200 text-rose-800 font-mono font-bold text-xs">
                        {shpId}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Recommended AI Action Banner */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 space-y-3">
                  <div className="flex items-center space-x-2 text-emerald-800 font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>IBM Bob Recommended Operational Action</span>
                  </div>
                  <p className="text-xs text-slate-700 font-medium leading-relaxed">
                    {selectedDisruption.recommendedAction}
                  </p>

                  <div className="pt-1 flex items-center space-x-3">
                    <button
                      onClick={() => navigate('/shipments')}
                      className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors inline-flex items-center space-x-1.5 cursor-pointer"
                    >
                      <span>View Affected Shipments</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => navigate('/routes')}
                      className="px-4 py-2 rounded-lg bg-white border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      Compare Bypass Routes
                    </button>
                  </div>
                </div>

              </div>
            )}

          </div>

        </main>
      </div>
    </div>
  );
}
