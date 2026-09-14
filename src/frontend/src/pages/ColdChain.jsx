import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/dashboard/Sidebar';
import TopHeader from '../components/dashboard/TopHeader';
import { coldChainMockData, temperatureHistoryChartData } from '../mock/masterMockData';
import {
  Snowflake,
  AlertTriangle,
  CheckCircle2,
  Thermometer,
  Activity,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  X
} from 'lucide-react';

export default function ColdChain() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const [coldData, setColdData] = useState(coldChainMockData);
  const [selectedShipment, setSelectedShipment] = useState(coldChainMockData[2]); // Default SG-1008
  const [alertAcknowledged, setAlertAcknowledged] = useState(false);

  const handleAcknowledgeAlert = () => {
    setAlertAcknowledged(true);
    setColdData(coldData.map(item => {
      if (item.id === 'SG-1008') {
        return {
          ...item,
          status: 'Alert Acknowledged',
          statusBadge: 'bg-emerald-100 text-emerald-800 border-emerald-200'
        };
      }
      return item;
    }));
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
              Cold Chain Telemetry & Excursion Monitoring
            </h1>
            <p className="text-xs text-slate-500 font-normal">
              IoT thermal sensor readings, safe threshold logging, and automated excursion alerts.
            </p>
          </div>

          {/* Critical Alert Banner (if SG-1008 excursion active) */}
          {!alertAcknowledged && (
            <div className="rounded-xl bg-gradient-to-r from-rose-500 via-rose-600 to-pink-600 text-white p-4 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-pulse-glow">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-white/20 text-white">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm font-heading">
                    Critical Temperature Excursion Detected — Shipment SG-1008
                  </h3>
                  <p className="text-xs text-rose-100 font-medium">
                    Container #CONT-12345 reading <strong>14.2°C</strong> (Allowed Range: 2.0°C – 8.0°C). Duration: 45 mins.
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2.5">
                <button
                  onClick={() => navigate('/shipments')}
                  className="px-3.5 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white font-bold text-xs transition-colors cursor-pointer"
                >
                  View Shipment
                </button>
                <button
                  onClick={handleAcknowledgeAlert}
                  className="px-3.5 py-1.5 rounded-lg bg-white text-rose-700 font-bold text-xs hover:bg-rose-50 shadow-xs transition-colors cursor-pointer"
                >
                  Acknowledge Alert
                </button>
              </div>
            </div>
          )}

          {/* Top Metrics Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
            <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-xs">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Monitored Cargo</span>
              <div className="text-2xl font-extrabold text-[#0B192C] font-heading">16</div>
              <span className="text-[11px] text-slate-500 font-medium">Active IoT Sensors</span>
            </div>

            <div className="rounded-xl border border-emerald-200 bg-white p-3.5 shadow-xs">
              <span className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-wider block">Healthy Range</span>
              <div className="text-2xl font-extrabold text-[#0B192C] font-heading">14</div>
              <span className="text-[11px] text-emerald-600 font-medium">2°C – 8°C Compliant</span>
            </div>

            <div className="rounded-xl border border-amber-200 bg-white p-3.5 shadow-xs">
              <span className="text-[10px] font-extrabold text-amber-700 uppercase tracking-wider block">Warning Level</span>
              <div className="text-2xl font-extrabold text-[#0B192C] font-heading">1</div>
              <span className="text-[11px] text-amber-700 font-medium">10.8°C Rising</span>
            </div>

            <div className="rounded-xl border border-rose-200 bg-rose-50/40 p-3.5 shadow-xs">
              <span className="text-[10px] font-extrabold text-rose-500 uppercase tracking-wider block">Critical Excursions</span>
              <div className="text-2xl font-extrabold text-rose-700 font-heading">1</div>
              <span className="text-[11px] text-rose-600 font-semibold">14.2°C Exceeded</span>
            </div>

            <div className="rounded-xl border border-sky-200 bg-white p-3.5 shadow-xs col-span-2 lg:col-span-1">
              <span className="text-[10px] font-extrabold text-sky-600 uppercase tracking-wider block">Overall Health</span>
              <div className="text-2xl font-extrabold text-[#0B192C] font-heading">96%</div>
              <span className="text-[11px] text-emerald-600 font-medium">0 Loss Incidents</span>
            </div>
          </div>

          {/* Main Grid: Telemetry Table + Temperature History Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            
            {/* Left Column: Monitored Shipments Table */}
            <div className="lg:col-span-7 rounded-xl bg-white border border-slate-200 shadow-xs overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Snowflake className="w-4 h-4 text-sky-600" />
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Active Cold Chain Telemetry
                  </h3>
                </div>
                <span className="text-[11px] font-semibold text-slate-400">Live 30s Telemetry Poll</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                      <th className="py-2.5 px-3">Shipment</th>
                      <th className="py-2.5 px-3">Current Temp</th>
                      <th className="py-2.5 px-3">Required Range</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3">Last Reading</th>
                      <th className="py-2.5 px-3">Trend</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {coldData.map((row) => {
                      const isSelected = selectedShipment.id === row.id;

                      return (
                        <tr
                          key={row.id}
                          onClick={() => setSelectedShipment(row)}
                          className={`cursor-pointer transition-colors ${
                            isSelected ? 'bg-sky-50/80 font-bold' : 'hover:bg-slate-50/80'
                          }`}
                        >
                          <td className="py-3 px-3 font-mono font-bold text-slate-900">
                            {row.id}
                            <span className="block text-[10px] text-slate-400 font-normal">{row.containerNo}</span>
                          </td>
                          <td className="py-3 px-3 font-extrabold text-sm text-slate-900">
                            <div className="inline-flex items-center space-x-1">
                              <Snowflake className="w-3.5 h-3.5 text-sky-500" />
                              <span>{row.currentTemp}°C</span>
                            </div>
                          </td>
                          <td className="py-3 px-3 text-slate-600">{row.targetMin}°C – {row.targetMax}°C</td>
                          <td className="py-3 px-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${row.statusBadge}`}>
                              {row.status}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-slate-400 text-[11px]">{row.lastReading}</td>
                          <td className="py-3 px-3 text-slate-600">{row.trend}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right Column: Selected Shipment Temperature Chart & Detail */}
            <div className="lg:col-span-5 rounded-xl bg-white border border-slate-200 p-4 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">{selectedShipment.id}</span>
                  <h3 className="text-sm font-bold text-slate-900 font-heading">
                    Telemetry History ({selectedShipment.containerNo})
                  </h3>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${selectedShipment.statusBadge}`}>
                  {selectedShipment.status}
                </span>
              </div>

              {/* Temperature History SVG Line Chart */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
                  <span>Temperature (°C) Timeline</span>
                  <span className="text-emerald-600">Safe Range: 2.0°C – 8.0°C</span>
                </div>

                <div className="relative w-full h-48 rounded-lg bg-slate-50 border border-slate-200 p-3 flex flex-col justify-between">
                  <svg className="w-full h-full" viewBox="0 0 400 150">
                    {/* Grid lines */}
                    <line x1="0" y1="30" x2="400" y2="30" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="4 4" />
                    <line x1="0" y1="100" x2="400" y2="100" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="4 4" />

                    {/* Max Threshold Line (8°C = Y: 60) */}
                    <line x1="0" y1="60" x2="400" y2="60" stroke="#EF4444" strokeWidth="1.5" strokeDasharray="6 4" />
                    <text x="350" y="55" fill="#EF4444" fontSize="9" fontWeight="bold">Max 8°C</text>

                    {/* Min Threshold Line (2°C = Y: 120) */}
                    <line x1="0" y1="120" x2="400" y2="120" stroke="#0284C7" strokeWidth="1.5" strokeDasharray="6 4" />
                    <text x="350" y="115" fill="#0284C7" fontSize="9" fontWeight="bold">Min 2°C</text>

                    {/* Actual Temp Trend Line Spiking */}
                    <path
                      d="M 10 100 L 70 95 L 130 90 L 190 75 L 250 45 L 310 25 L 380 10"
                      fill="none"
                      stroke="#E11D48"
                      strokeWidth="2.5"
                    />

                    {/* Data Points */}
                    <circle cx="250" cy="45" r="4" fill="#E11D48" />
                    <circle cx="310" cy="25" r="4" fill="#E11D48" />
                    <circle cx="380" cy="10" r="5" fill="#E11D48" />
                  </svg>
                </div>
              </div>

              {/* Telemetry Breakdown Details */}
              <div className="grid grid-cols-2 gap-2.5 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Current Temperature</span>
                  <span className="text-base font-extrabold text-slate-900">{selectedShipment.currentTemp}°C</span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Target Safe Zone</span>
                  <span className="text-base font-extrabold text-emerald-700">{selectedShipment.targetMin}°C – {selectedShipment.targetMax}°C</span>
                </div>
              </div>

              {/* Action */}
              <div className="pt-2">
                <button
                  onClick={() => navigate('/shipments')}
                  className="w-full py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <span>Inspect Cargo Manifest & Sensor ID</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>

        </main>
      </div>
    </div>
  );
}
