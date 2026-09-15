import React, { useState } from 'react';
import Sidebar from '../components/dashboard/Sidebar';
import TopHeader from '../components/dashboard/TopHeader';
import RouteMapVisualization from '../components/routes/RouteMapVisualization';
import { routesMockData } from '../mock/masterMockData';
import {
  Route as RouteIcon,
  Search,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Zap,
  MapPin,
  Clock,
  DollarSign,
  TrendingDown,
  Navigation
} from 'lucide-react';

export default function Routes() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [origin, setOrigin] = useState('Shanghai');
  const [destination, setDestination] = useState('Mumbai');
  const [selectedRoute, setSelectedRoute] = useState(routesMockData.currentScenario.recommendedRoute);
  const [notice, setNotice] = useState(null);

  const scenario = routesMockData.currentScenario;

  const handleApplyRoute = (route) => {
    setNotice(`Applied ${route.name} to active shipment manifest.`);
    setTimeout(() => setNotice(null), 4000);
  };

  return (
    <div className="min-h-screen bg-slate-100/70 font-sans overflow-x-hidden">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <div className="lg:pl-[240px] flex flex-col min-h-screen">
        <TopHeader setMobileOpen={setMobileOpen} />

        <main className="flex-1 p-4 sm:p-5 lg:p-6 space-y-4 max-w-[1550px] w-full mx-auto animate-fadeIn">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#0B192C] font-heading tracking-tight">
                Route Recommendations & Bypass Optimization
              </h1>
              <p className="text-xs text-slate-500 font-normal">
                Compare trade corridors, evaluate risk scores, and bypass congested bottleneck zones.
              </p>
            </div>

            {notice && (
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center space-x-2 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{notice}</span>
              </div>
            )}
          </div>

          {/* Route Search Toolbar */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-7 gap-3 items-end">
            <div className="lg:col-span-2 space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Origin</label>
              <input
                type="text"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="lg:col-span-2 space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Destination</label>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="lg:col-span-2 space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Transport Mode</label>
              <select className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none">
                <option>Multimodal (Ocean + Air + Road)</option>
                <option>Direct Ocean Vessel</option>
                <option>Air Freight Express</option>
                <option>Overland Freight Rail</option>
              </select>
            </div>

            <button className="w-full py-2 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center space-x-1.5 cursor-pointer">
              <Search className="w-4 h-4" />
              <span>Find Routes</span>
            </button>
          </div>

          {/* Primary Recommended Route Card */}
          <div className="rounded-xl bg-gradient-to-r from-emerald-50 via-teal-50/60 to-white border border-emerald-200 p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-emerald-200/80 pb-3">
              <div className="flex items-center space-x-2.5">
                <span className="px-2.5 py-0.5 rounded bg-emerald-600 text-white font-bold text-[10px] tracking-wider uppercase">
                  RECOMMENDED BYPASS ROUTE
                </span>
                <h3 className="text-base font-extrabold text-slate-900 font-heading">
                  {scenario.recommendedRoute.name}
                </h3>
              </div>
              <div className="flex items-center space-x-2 text-xs text-emerald-800 font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Risk Score: {scenario.recommendedRoute.riskScore} (Low Risk)</span>
              </div>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-white border border-emerald-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Distance</span>
                <span className="text-base font-extrabold text-slate-900">{scenario.recommendedRoute.distanceKm.toLocaleString()} km</span>
              </div>

              <div className="p-3 rounded-lg bg-white border border-emerald-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Transit Time</span>
                <span className="text-base font-extrabold text-slate-900">{scenario.recommendedRoute.durationText}</span>
              </div>

              <div className="p-3 rounded-lg bg-white border border-emerald-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Est. Cost</span>
                <span className="text-base font-extrabold text-slate-900">${scenario.recommendedRoute.costUsd.toLocaleString()}</span>
              </div>

              <div className="p-3 rounded-lg bg-white border border-emerald-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Carrier</span>
                <span className="text-sm font-bold text-slate-800 truncate block">{scenario.recommendedRoute.carrier}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <p className="text-xs text-slate-600 font-medium">
                {scenario.recommendedRoute.disruptionNote}
              </p>
              <button
                onClick={() => handleApplyRoute(scenario.recommendedRoute)}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center space-x-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Use Recommended Route</span>
              </button>
            </div>
          </div>

          {/* Real Interactive Leaflet Route Path Visualization */}
          <RouteMapVisualization origin={origin} destination={destination} />

          {/* Route Comparison Data Table */}
          <div className="rounded-xl bg-white border border-slate-200 shadow-xs overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-200 bg-slate-50 font-bold text-xs text-slate-800 uppercase tracking-wider">
              All Available Corridor Options
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                    <th className="py-3 px-4">Route Name</th>
                    <th className="py-3 px-4">Distance</th>
                    <th className="py-3 px-4">Duration</th>
                    <th className="py-3 px-4">Est. Cost</th>
                    <th className="py-3 px-4">Risk Score</th>
                    <th className="py-3 px-4">Carrier</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {/* Primary Route */}
                  <tr className="bg-rose-50/30 hover:bg-rose-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {scenario.primaryRoute.name}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">{scenario.primaryRoute.distanceKm.toLocaleString()} km</td>
                    <td className="py-3.5 px-4 text-slate-700">{scenario.primaryRoute.durationText}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">${scenario.primaryRoute.costUsd.toLocaleString()}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700 border border-rose-200">
                        {scenario.primaryRoute.riskScore} (High)
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">{scenario.primaryRoute.carrier}</td>
                    <td className="py-3.5 px-4 text-right">
                      <button disabled className="px-3 py-1 rounded bg-slate-200 text-slate-400 font-bold text-[11px] cursor-not-allowed">
                        Disrupted
                      </button>
                    </td>
                  </tr>

                  {/* Recommended Route */}
                  <tr className="bg-emerald-50/40 hover:bg-emerald-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center space-x-2">
                      <span>{scenario.recommendedRoute.name}</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-600 text-white font-extrabold text-[9px]">BEST CHOICE</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">{scenario.recommendedRoute.distanceKm.toLocaleString()} km</td>
                    <td className="py-3.5 px-4 font-bold text-emerald-700">{scenario.recommendedRoute.durationText}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">${scenario.recommendedRoute.costUsd.toLocaleString()}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        {scenario.recommendedRoute.riskScore} (Low)
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">{scenario.recommendedRoute.carrier}</td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleApplyRoute(scenario.recommendedRoute)}
                        className="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] cursor-pointer"
                      >
                        Select
                      </button>
                    </td>
                  </tr>

                  {/* Alternatives */}
                  {scenario.alternativeRoutes.map((alt) => (
                    <tr key={alt.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-800">{alt.name}</td>
                      <td className="py-3.5 px-4 text-slate-700">{alt.distanceKm.toLocaleString()} km</td>
                      <td className="py-3.5 px-4 text-slate-700">{alt.durationText}</td>
                      <td className="py-3.5 px-4 text-slate-900">${alt.costUsd.toLocaleString()}</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-100 text-sky-800 border border-sky-200">
                          {alt.riskScore} ({alt.riskLevel})
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">{alt.carrier}</td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleApplyRoute(alt)}
                          className="px-3 py-1 rounded border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-[11px] cursor-pointer"
                        >
                          Select
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
