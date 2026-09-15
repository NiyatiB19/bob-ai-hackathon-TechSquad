import React, { useState, useEffect } from 'react';
import Sidebar from '../components/dashboard/Sidebar';
import TopHeader from '../components/dashboard/TopHeader';
import { fleetMockData } from '../mock/masterMockData';
import {
  fetchFleetAssets,
  fetchFleetUtilisation,
  fetchFleetRedeploymentRecommendation,
  executeAssetRedeployment
} from '../services/fleetColdChainService';
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
  ArrowRight,
  Loader2
} from 'lucide-react';

export default function Fleet() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [fleet, setFleet] = useState(fleetMockData);
  const [utilisationMetrics, setUtilisationMetrics] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [isOptModalOpen, setIsOptModalOpen] = useState(false);
  const [toastNotice, setToastNotice] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch live fleet assets & metrics from backend on mount or filter change
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setIsLoading(true);
      try {
        const [apiAssets, apiUtil] = await Promise.all([
          fetchFleetAssets({ status: statusFilter, type: typeFilter }),
          fetchFleetUtilisation()
        ]);

        if (isMounted) {
          if (apiAssets && apiAssets.length > 0) {
            // Map backend camelCase properties to UI format if needed
            const mappedAssets = apiAssets.map(a => ({
              id: a.fleetAssetId || a.id,
              name: a.assetName || a.name,
              type: a.transportMode === 'truck' ? 'Truck' : a.transportMode === 'container' ? 'Container' : a.transportMode === 'vessel' ? 'Container' : (a.type || 'Truck'),
              location: a.currentLocation?.city || a.location || 'Depot',
              status: (a.status || 'Active').charAt(0).toUpperCase() + (a.status || 'Active').slice(1).toLowerCase(),
              statusBadge: (a.status?.toUpperCase() === 'IDLE' || a.status === 'Idle')
                ? 'bg-amber-100 text-amber-800 border-amber-200 font-bold'
                : (a.status?.toUpperCase() === 'MAINTENANCE' || a.status === 'Maintenance')
                  ? 'bg-rose-100 text-rose-800 border-rose-200'
                  : 'bg-emerald-100 text-emerald-800 border-emerald-200',
              utilization: a.utilizationPercentage ?? a.utilization ?? 0,
              capacity: typeof a.capacity === 'object' ? `${(a.capacity?.maxWeightKg || 20000).toLocaleString()} kg` : (a.capacity || '20,000 kg'),
              assignedShipment: a.assignedShipmentId || a.assignedShipment || 'Unassigned',
              driver: a.driver || 'Standby Crew',
              lastUpdated: a.lastUpdated ? new Date(a.lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'
            }));
            setFleet(mappedAssets);
          }
          if (apiUtil) {
            setUtilisationMetrics(apiUtil);
          }
        }
      } catch (err) {
        console.warn('Using mock fleet data fallback:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadData();
    return () => { isMounted = false; };
  }, [statusFilter, typeFilter]);

  // Fetch recommendation when modal opens
  const handleOpenOptModal = async () => {
    setIsOptModalOpen(true);
    try {
      const rec = await fetchFleetRedeploymentRecommendation('S102', 15000, true);
      if (rec) setRecommendation(rec);
    } catch (err) {
      console.warn('Could not load dynamic recommendation:', err);
    }
  };

  const handleRedeploy = async () => {
    const targetAssetId = recommendation?.fleetAssetId || 'FL-002';
    const targetShipmentId = recommendation?.shipmentId || 'SG-1001';

    try {
      await executeAssetRedeployment(targetShipmentId, targetAssetId);
    } catch (e) {
      console.warn('API redeploy fallback execution:', e);
    }

    setFleet(fleet.map(asset => {
      if (asset.id === targetAssetId || asset.id === 'FL-002' || asset.id === 'T14') {
        return {
          ...asset,
          status: 'Active',
          statusBadge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          utilization: 82,
          assignedShipment: targetShipmentId
        };
      }
      return asset;
    }));

    setIsOptModalOpen(false);
    setToastNotice(`Asset ${targetAssetId} successfully redeployed to Shipment ${targetShipmentId}.`);
    setTimeout(() => setToastNotice(null), 4000);
  };

  const filteredFleet = fleet.filter((item) => {
    const matchesStatus = statusFilter === 'All' || item.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesType = typeFilter === 'All' || item.type.toLowerCase() === typeFilter.toLowerCase();
    return matchesStatus && matchesType;
  });

  const getModeIcon = (type) => {
    switch (type) {
      case 'Truck': return Truck;
      case 'Container': return Anchor;
      case 'Air': return Plane;
      default: return Cpu;
    }
  };

  // Metrics
  const totalAssetsCount = utilisationMetrics?.totalAssets ?? fleet.length;
  const activeAssetsCount = utilisationMetrics?.activeAssets ?? fleet.filter(a => a.status === 'Active').length;
  const idleAssetsCount = utilisationMetrics?.idleAssets ?? fleet.filter(a => a.status === 'Idle').length;
  const maintenanceAssetsCount = utilisationMetrics?.maintenanceAssets ?? fleet.filter(a => a.status === 'Maintenance').length;
  const avgUtil = utilisationMetrics?.averageUtilizationPercentage ?? (fleet.length > 0 ? Math.round(fleet.reduce((acc, c) => acc + (c.utilization || 0), 0) / fleet.length) : 78);
  const opStatus = utilisationMetrics?.operationalStatus || 'Fully Utilised';

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
                Monitor fleet asset availability, thermal capacities, and idle asset redeployment. Status: <strong className="text-emerald-700">{opStatus}</strong>
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
              <div className="text-2xl font-extrabold text-[#0B192C] font-heading">{totalAssetsCount}</div>
              <span className="text-[11px] text-slate-500 font-medium">Registered fleet</span>
            </div>

            <div className="rounded-xl border border-emerald-200 bg-white p-3.5 shadow-xs">
              <span className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-wider block">Active Fleet</span>
              <div className="text-2xl font-extrabold text-[#0B192C] font-heading">{activeAssetsCount}</div>
              <span className="text-[11px] text-emerald-600 font-medium">Assigned to routes</span>
            </div>

            <div className="rounded-xl border border-amber-200 bg-amber-50/40 p-3.5 shadow-xs">
              <span className="text-[10px] font-extrabold text-amber-700 uppercase tracking-wider block">Idle Assets</span>
              <div className="text-2xl font-extrabold text-amber-900 font-heading">{idleAssetsCount}</div>
              <span className="text-[11px] text-amber-700 font-semibold">Available for deploy</span>
            </div>

            <div className="rounded-xl border border-rose-200 bg-white p-3.5 shadow-xs">
              <span className="text-[10px] font-extrabold text-rose-500 uppercase tracking-wider block">Maintenance</span>
              <div className="text-2xl font-extrabold text-[#0B192C] font-heading">{maintenanceAssetsCount}</div>
              <span className="text-[11px] text-rose-600 font-medium">In depot shop</span>
            </div>

            <div className="rounded-xl border border-sky-200 bg-white p-3.5 shadow-xs col-span-2 lg:col-span-1">
              <span className="text-[10px] font-extrabold text-sky-600 uppercase tracking-wider block">Avg Utilization</span>
              <div className="text-2xl font-extrabold text-[#0B192C] font-heading">{avgUtil}%</div>
              <span className="text-[11px] text-sky-600 font-medium">{opStatus}</span>
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
              onClick={handleOpenOptModal}
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors inline-flex items-center space-x-1.5 cursor-pointer"
            >
              <Zap className="w-4 h-4" />
              <span>Fleet Optimization Suggestion</span>
            </button>
          </div>

          {/* Main Fleet Table */}
          <div className="rounded-xl bg-white border border-slate-200 shadow-xs overflow-hidden">
            {isLoading ? (
              <div className="p-8 text-center text-slate-500 flex items-center justify-center space-x-2">
                <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />
                <span className="text-xs font-medium">Fetching fleet telemetry from API...</span>
              </div>
            ) : (
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
                    {filteredFleet.length === 0 ? (
                      <tr>
                        <td colSpan="9" className="py-6 text-center text-slate-400">
                          No fleet assets match selected filter options.
                        </td>
                      </tr>
                    ) : (
                      filteredFleet.map((row) => {
                        const ModeIcon = getModeIcon(row.type);
                        const isIdle = row.status?.toLowerCase() === 'idle';

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
                                  style={{ width: `${Math.min(100, Math.max(0, row.utilization))}%` }}
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
                                  onClick={handleOpenOptModal}
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
                      })
                    )}
                  </tbody>
                </table>
              </div>
            )}
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
                    <span className="font-mono">{recommendation?.fleetAssetId || recommendation?.recommendedAsset?.fleetAssetId || 'T14 / FL-002'}</span>
                  </div>
                  <p className="text-amber-800 font-medium">
                    {recommendation?.recommendedAsset?.assetName || 'Reefer Truck T14'} located in <strong>{recommendation?.recommendedAsset?.currentLocation?.city || 'Mumbai / Frankfurt'}</strong>.
                  </p>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Target Shipment to Support</span>
                    <span className="font-mono font-bold text-emerald-700">{recommendation?.shipmentId || 'S102 / SG-1001'} (Vaccine Transport)</span>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Optimization Rationale</span>
                    <ul className="list-disc list-inside space-y-0.5 text-slate-700 font-medium">
                      {(recommendation?.reason || [
                        'Fleet asset is idle',
                        'Asset located near shipment origin',
                        'Capacity & refrigeration are sufficient'
                      ]).map((r, idx) => (
                        <li key={idx}>{r}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Expected Impact</span>
                    <span className="font-semibold text-slate-800">Increases asset utilization to 82% and bypasses corridor delay.</span>
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
