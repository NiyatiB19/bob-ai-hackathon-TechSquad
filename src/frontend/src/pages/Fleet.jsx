import React, { useState } from 'react';
import Sidebar from '../components/dashboard/Sidebar';
import TopHeader from '../components/dashboard/TopHeader';
import { fleetMockData } from '../mock/masterMockData';
import {
  Cpu,
  Truck,
  Anchor,
  Plane,
  CheckCircle2,
  AlertTriangle,
  Zap,
  X,
  Filter,
  ArrowRight
} from 'lucide-react';

export default function Fleet() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [fleet, setFleet] = useState(fleetMockData);
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [isOptModalOpen, setIsOptModalOpen] = useState(false);
  const [toastNotice, setToastNotice] = useState(null);

  const filteredFleet = fleet.filter((item) => {
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    const matchesType = typeFilter === 'All' || item.type === typeFilter;
    return matchesStatus && matchesType;
  });

  const handleRedeploy = () => {
    setFleet(fleet.map(asset => {
      if (asset.id === 'FL-002') {
        return {
          ...asset,
          status: 'Active',
          statusBadge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          utilization: 82,
          assignedShipment: 'SG-1001'
        };
      }
      return asset;
    }));
    setIsOptModalOpen(false);
    setToastNotice('Asset FL-002 successfully redeployed to Shipment SG-1001.');
    setTimeout(() => setToastNotice(null), 4000);
  };

  const getModeIcon = (type) => {
    switch (type) {
      case 'Truck': return Truck;
      case 'Container': return Anchor;
      case 'Air': return Plane;
      default: return Cpu;
    }
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
                Fleet Assets & Utilization
              </h1>
              <p className="text-xs text-slate-500 font-normal">
                Monitor fleet asset availability, thermal capacities, and idle asset redeployment.
              </p>
            </div>

            {toastNotice && (
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center space-x-2 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{toastNotice}</span>
              </div>
            )}
          </div>

          {/* Top Metrics Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
            <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-xs">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Total Assets</span>
              <div className="text-2xl font-extrabold text-[#0B192C] font-heading">24</div>
              <span className="text-[11px] text-slate-500 font-medium">Registered fleet</span>
            </div>

            <div className="rounded-xl border border-emerald-200 bg-white p-3.5 shadow-xs">
              <span className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-wider block">Active Fleet</span>
              <div className="text-2xl font-extrabold text-[#0B192C] font-heading">18</div>
              <span className="text-[11px] text-emerald-600 font-medium">Assigned to routes</span>
            </div>

            <div className="rounded-xl border border-amber-200 bg-amber-50/40 p-3.5 shadow-xs">
              <span className="text-[10px] font-extrabold text-amber-700 uppercase tracking-wider block">Idle Assets</span>
              <div className="text-2xl font-extrabold text-amber-900 font-heading">4</div>
              <span className="text-[11px] text-amber-700 font-semibold">Available for deploy</span>
            </div>

            <div className="rounded-xl border border-rose-200 bg-white p-3.5 shadow-xs">
              <span className="text-[10px] font-extrabold text-rose-500 uppercase tracking-wider block">Maintenance</span>
              <div className="text-2xl font-extrabold text-[#0B192C] font-heading">2</div>
              <span className="text-[11px] text-rose-600 font-medium">In depot shop</span>
            </div>

            <div className="rounded-xl border border-sky-200 bg-white p-3.5 shadow-xs col-span-2 lg:col-span-1">
              <span className="text-[10px] font-extrabold text-sky-600 uppercase tracking-wider block">Avg Utilization</span>
              <div className="text-2xl font-extrabold text-[#0B192C] font-heading">78%</div>
              <span className="text-[11px] text-sky-600 font-medium">+4.5% vs target</span>
            </div>
          </div>

          {/* Toolbar & Filters */}
          <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-bold text-slate-700">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none"
                >
                  <option value="All">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Idle">Idle</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-slate-700">Type:</span>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none"
                >
                  <option value="All">All Asset Types</option>
                  <option value="Truck">Reefer Truck</option>
                  <option value="Container">Shipping Container</option>
                  <option value="Air">Air Pallet</option>
                </select>
              </div>
            </div>

            <button
              onClick={() => setIsOptModalOpen(true)}
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors inline-flex items-center space-x-1.5 cursor-pointer"
            >
              <Zap className="w-4 h-4" />
              <span>Fleet Optimization Suggestion</span>
            </button>
          </div>

          {/* Main Fleet Table */}
          <div className="rounded-xl bg-white border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                    <th className="py-3 px-4">Asset ID</th>
                    <th className="py-3 px-4">Asset Name</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Current Location</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Utilization</th>
                    <th className="py-3 px-4">Capacity</th>
                    <th className="py-3 px-4">Assigned Shipment</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredFleet.map((row) => {
                    const ModeIcon = getModeIcon(row.type);
                    const isIdle = row.status === 'Idle';

                    return (
                      <tr
                        key={row.id}
                        className={`hover:bg-slate-50/80 transition-colors ${isIdle ? 'bg-amber-50/20' : ''}`}
                      >
                        <td className="py-3.5 px-4 font-bold font-mono text-[#0B192C]">
                          {row.id}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-slate-800">
                          {row.name}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="inline-flex items-center space-x-1 text-slate-700">
                            <ModeIcon className="w-3.5 h-3.5 text-slate-500" />
                            <span>{row.type}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600">{row.location}</td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold border ${row.statusBadge}`}>
                            {row.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="w-24 bg-slate-200 rounded-full h-2 overflow-hidden flex items-center">
                            <div
                              className={`h-full rounded-full ${row.utilization > 0 ? 'bg-emerald-500' : 'bg-slate-300'}`}
                              style={{ width: `${row.utilization}%` }}
                            />
                          </div>
                          <span className="text-[10px] font-semibold text-slate-500 mt-0.5 block">{row.utilization}%</span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600">{row.capacity}</td>
                        <td className="py-3.5 px-4 font-mono font-semibold text-slate-800">
                          {row.assignedShipment}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          {isIdle ? (
                            <button
                              onClick={() => setIsOptModalOpen(true)}
                              className="px-2.5 py-1 rounded bg-amber-500 hover:bg-amber-600 text-white font-bold text-[10px] cursor-pointer"
                            >
                              Deploy Asset
                            </button>
                          ) : (
                            <span className="text-slate-400 text-[11px]">Assigned</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Fleet Optimization Modal */}
          {isOptModalOpen && (
            <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
              <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-md p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center space-x-2">
                    <Zap className="w-5 h-5 text-amber-500" />
                    <h3 className="text-base font-extrabold text-slate-900 font-heading">
                      Fleet Optimization Suggestion
                    </h3>
                  </div>
                  <button onClick={() => setIsOptModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 space-y-2 text-xs">
                  <div className="flex justify-between font-bold text-amber-900">
                    <span>Idle Asset Detected:</span>
                    <span className="font-mono">FL-002 (Reefer Truck 02)</span>
                  </div>
                  <p className="text-amber-800 font-medium">
                    Located in <strong>Pune Hub</strong> with 15,000 kg refrigerated capacity.
                  </p>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Suggested Route Deployment</span>
                    <span className="font-extrabold text-slate-900">Mumbai → Pune Corridor</span>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Target Shipment to Support</span>
                    <span className="font-mono font-bold text-emerald-700">SG-1001 (Vaccine Transport)</span>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Expected Impact</span>
                    <span className="font-semibold text-slate-800">Increases asset utilization to 82% and bypasses Singapore port delay.</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center space-x-3">
                  <button
                    onClick={() => setIsOptModalOpen(false)}
                    className="flex-1 py-2 rounded-lg border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleRedeploy}
                    className="flex-1 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs"
                  >
                    Redeploy Asset Now
                  </button>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
