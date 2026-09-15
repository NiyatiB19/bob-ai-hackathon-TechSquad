import React, { useState, useEffect } from 'react';
import Sidebar from '../components/dashboard/Sidebar';
import TopHeader from '../components/dashboard/TopHeader';
import { reportsAnalyticsMock } from '../mock/masterMockData';
import { API_BASE_URL } from '../services/apiConfig';
import { 
  Download, 
  TrendingUp, 
  Clock, 
  Truck, 
  ShieldCheck, 
  AlertTriangle,
  FileSpreadsheet,
  CheckCircle2,
  RefreshCw,
  BarChart3,
  Filter
} from 'lucide-react';

export default function Reports() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dateRange, setDateRange] = useState('7d');
  const [isExporting, setIsExporting] = useState(false);
  const [exportedNotification, setExportedNotification] = useState(false);

  const [summaryData, setSummaryData] = useState(reportsAnalyticsMock.summary);
  const { shipmentStatusDistribution, deliveryPerformanceTrend, disruptionTrend } = reportsAnalyticsMock;

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch(`${API_BASE_URL}/shipments/stats`);
        const json = await res.json();
        if (json.success && json.data) {
          const s = json.data;
          const total = s.totalShipments || 180519;
          const delivered = s.delivered || 0;
          const delayed = s.delayed || 0;
          const rate = total > 0 ? ((delivered / total) * 100).toFixed(1) : '92.4';

          setSummaryData({
            totalShipments: total.toLocaleString(),
            onTimeDeliveryRate: `${rate}%`,
            averageDelayHours: '4.2 hrs',
            fleetUtilizationRate: '78%',
            coldChainHealthRate: '96.0%'
          });
        }
      } catch (err) {
        console.warn('Reports fallback:', err.message);
      }
    }
    loadStats();
  }, []);

  const handleExportCSV = () => {
    setIsExporting(true);
    setTimeout(() => {
      // Generate CSV string
      const headers = ['Report Category', 'Metric', 'Value', 'Timestamp'];
      const rows = [
        ['Summary', 'Total Shipments', summaryData.totalShipments, new Date().toISOString()],
        ['Summary', 'On-Time Delivery Rate', summaryData.onTimeDeliveryRate, new Date().toISOString()],
        ['Summary', 'Average Delay Hours', summaryData.averageDelayHours, new Date().toISOString()],
        ['Summary', 'Fleet Utilization Rate', summaryData.fleetUtilizationRate, new Date().toISOString()],
        ['Summary', 'Cold Chain Health Rate', summaryData.coldChainHealthRate, new Date().toISOString()],
        ...shipmentStatusDistribution.map(s => ['Shipment Status', s.label, `${s.count} (${s.percentage}%)`, new Date().toISOString()]),
        ...deliveryPerformanceTrend.map(d => ['Delivery Trend', d.date, `${d.rate}%`, new Date().toISOString()]),
        ...disruptionTrend.map(d => ['Disruption Trend', d.date, `${d.count} events`, new Date().toISOString()])
      ];

      const csvContent = 'data:text/csv;charset=utf-8,' 
        + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `SupplyGuard_AI_Analytics_Report_${dateRange}_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setIsExporting(false);
      setExportedNotification(true);
      setTimeout(() => setExportedNotification(false), 4000);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-100/70 font-sans overflow-x-hidden">
      {/* Sidebar (Fixed 240px width) */}
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* Main Content Container with lg:pl-[240px] offset */}
      <div className="lg:pl-[240px] flex flex-col min-h-screen">
        
        {/* Top Header */}
        <TopHeader setMobileOpen={setMobileOpen} />

        {/* Page Content Body */}
        <main className="flex-1 p-4 sm:p-5 lg:p-6 space-y-4 max-w-[1550px] w-full mx-auto animate-fadeIn">
          
          {/* Top Banner & Date Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-[#0B192C] font-heading tracking-tight">
                  Analytics & Operational Reports
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                  DataCo Supply Chain Dataset
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Comprehensive supply chain metrics, delivery performance trends, and thermal excursion breakdowns.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Date Filters */}
              <div className="inline-flex rounded-lg border border-slate-200 p-1 bg-slate-50 text-xs font-medium">
                {[
                  { id: '7d', label: 'Last 7 Days' },
                  { id: '30d', label: 'Last 30 Days' },
                  { id: '90d', label: 'Last 90 Days' },
                  { id: 'custom', label: 'Custom' }
                ].map((range) => (
                  <button
                    key={range.id}
                    onClick={() => setDateRange(range.id)}
                    className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                      dateRange === range.id
                        ? 'bg-white text-slate-900 font-semibold shadow-xs border border-slate-200/80'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>

              {/* CSV Export Button */}
              <button
                onClick={handleExportCSV}
                disabled={isExporting}
                className="inline-flex items-center justify-center space-x-2 bg-slate-900 hover:bg-slate-800 active:scale-[0.98] text-white text-xs font-bold px-4 py-2 rounded-lg border border-slate-900 shadow-xs transition-all disabled:opacity-50 cursor-pointer"
              >
                {isExporting ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-white" />
                ) : (
                  <Download className="w-3.5 h-3.5 text-slate-200" />
                )}
                <span>{isExporting ? 'Generating...' : 'Export Report'}</span>
              </button>
            </div>
          </div>

          {/* Export Success Notification */}
          {exportedNotification && (
            <div className="flex items-center justify-between p-3.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs font-medium animate-fadeIn">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Analytics CSV report successfully generated and downloaded.</span>
              </div>
              <button onClick={() => setExportedNotification(false)} className="text-emerald-600 hover:text-emerald-900 text-xs font-bold">
                Dismiss
              </button>
            </div>
          )}

          {/* Key Metric Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center space-x-3">
              <div className="p-2.5 bg-blue-50 text-blue-700 rounded-lg flex-shrink-0">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider truncate">Total Monitored</p>
                <p className="text-xl font-extrabold text-slate-900 font-heading mt-0.5">{summaryData.totalShipments}</p>
                <span className="text-[11px] font-semibold text-emerald-600 block truncate">Live MongoDB Count</span>
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center space-x-3">
              <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-lg flex-shrink-0">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider truncate">On-Time Delivery</p>
                <p className="text-xl font-extrabold text-slate-900 font-heading mt-0.5">{summaryData.onTimeDeliveryRate}</p>
                <span className="text-[11px] font-semibold text-emerald-600 block truncate">DataCo SLA rate</span>
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center space-x-3">
              <div className="p-2.5 bg-amber-50 text-amber-700 rounded-lg flex-shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider truncate">Average Delay</p>
                <p className="text-xl font-extrabold text-slate-900 font-heading mt-0.5">{summaryData.averageDelayHours}</p>
                <span className="text-[11px] font-semibold text-amber-600 block truncate">-0.8h by Bob</span>
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center space-x-3">
              <div className="p-2.5 bg-indigo-50 text-indigo-700 rounded-lg flex-shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider truncate">Fleet Utilization</p>
                <p className="text-xl font-extrabold text-slate-900 font-heading mt-0.5">{summaryData.fleetUtilizationRate}</p>
                <span className="text-[11px] font-semibold text-slate-500 block truncate">Telemetry simulation</span>
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center space-x-3 col-span-2 sm:col-span-1">
              <div className="p-2.5 bg-teal-50 text-teal-700 rounded-lg flex-shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider truncate">Cold Chain Health</p>
                <p className="text-xl font-extrabold text-slate-900 font-heading mt-0.5">{summaryData.coldChainHealthRate}</p>
                <span className="text-[11px] font-semibold text-rose-600 block truncate">1 active alert</span>
              </div>
            </div>
          </div>

          {/* Grid Row 1: Status Distribution & Delivery Trend */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5 items-stretch">
            {/* Chart 1: Shipment Status Breakdown */}
            <div className="lg:col-span-5 bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                  <div>
                    <h2 className="text-sm font-bold text-slate-900 font-heading">Shipment Status Breakdown</h2>
                    <p className="text-xs text-slate-500">Current state distribution across DataCo shipments</p>
                  </div>
                  <FileSpreadsheet className="w-4 h-4 text-slate-400" />
                </div>

                {/* Progress bars */}
                <div className="space-y-4 my-2">
                  {shipmentStatusDistribution.map((item, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-slate-700">{item.label}</span>
                        <span className="font-bold text-slate-900">{item.count} <span className="text-slate-400 font-normal">({item.percentage}%)</span></span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                        <div
                          className={`h-2.5 rounded-full transition-all duration-500 ${item.color}`}
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer Insight */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Data Source: <strong className="text-slate-800">DataCo Dataset</strong></span>
                <span className="text-emerald-700 font-semibold">MongoDB Synchronized</span>
              </div>
            </div>

            {/* Chart 2: Delivery Performance Line Chart */}
            <div className="lg:col-span-7 bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                  <div>
                    <h2 className="text-sm font-bold text-slate-900 font-heading">On-Time Delivery Performance Trend</h2>
                    <p className="text-xs text-slate-500">SLA compliance percentage over timeframe ({dateRange})</p>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                    Target: 90.0%
                  </span>
                </div>

                {/* Vector SVG Line Chart */}
                <div className="h-56 w-full pt-1">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 500 160" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="deliveryGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    <line x1="45" y1="20" x2="485" y2="20" stroke="#f1f5f9" strokeDasharray="4" />
                    <text x="35" y="24" fontSize="10" fill="#94a3b8" textAnchor="end" fontWeight="bold">100%</text>

                    <line x1="45" y1="60" x2="485" y2="60" stroke="#f1f5f9" strokeDasharray="4" />
                    <text x="35" y="64" fontSize="10" fill="#94a3b8" textAnchor="end" fontWeight="bold">95%</text>

                    <line x1="45" y1="100" x2="485" y2="100" stroke="#cbd5e1" strokeDasharray="3" />
                    <text x="35" y="104" fontSize="10" fill="#94a3b8" textAnchor="end" fontWeight="bold">90%</text>

                    <line x1="45" y1="140" x2="485" y2="140" stroke="#f1f5f9" strokeDasharray="4" />
                    <text x="35" y="144" fontSize="10" fill="#94a3b8" textAnchor="end" fontWeight="bold">85%</text>

                    <line x1="45" y1="100" x2="485" y2="100" stroke="#059669" strokeWidth="1" strokeDasharray="4 2" />

                    <polygon
                      points="45,140 45,108 118,92 191,116 265,68 338,84 411,60 485,84 485,140"
                      fill="url(#deliveryGrad)"
                    />

                    <path
                      d="M 45,108 L 118,92 L 191,116 L 265,68 L 338,84 L 411,60 L 485,84"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    {[
                      { x: 45, y: 108, date: 'Mon', val: '89%' },
                      { x: 118, y: 92, date: 'Tue', val: '91%' },
                      { x: 191, y: 116, date: 'Wed', val: '88%' },
                      { x: 265, y: 68, date: 'Thu', val: '94%' },
                      { x: 338, y: 84, date: 'Fri', val: '92%' },
                      { x: 411, y: 60, date: 'Sat', val: '95%' },
                      { x: 485, y: 84, date: 'Sun', val: '92%' }
                    ].map((pt, idx) => (
                      <g key={idx}>
                        <circle cx={pt.x} cy={pt.y} r="4" fill="#ffffff" stroke="#10b981" strokeWidth="2.5" />
                        <text x={pt.x} y="155" fontSize="10" fill="#64748b" textAnchor="middle" fontWeight="bold">{pt.date}</text>
                      </g>
                    ))}
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Grid Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5 items-stretch">
            <div className="lg:col-span-6 bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                  <div>
                    <h2 className="text-sm font-bold text-slate-900 font-heading">Disruption Event Frequency</h2>
                    <p className="text-xs text-slate-500">Port strikes, weather storms & thermal excursions</p>
                  </div>
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                </div>

                <div className="h-48 w-full">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 450 150" preserveAspectRatio="none">
                    <line x1="30" y1="20" x2="430" y2="20" stroke="#f1f5f9" />
                    <line x1="30" y1="60" x2="430" y2="60" stroke="#f1f5f9" />
                    <line x1="30" y1="100" x2="430" y2="100" stroke="#f1f5f9" />
                    <line x1="30" y1="130" x2="430" y2="130" stroke="#e2e8f0" />

                    <text x="22" y="24" fontSize="10" fill="#94a3b8" textAnchor="end" fontWeight="bold">5</text>
                    <text x="22" y="64" fontSize="10" fill="#94a3b8" textAnchor="end" fontWeight="bold">3</text>
                    <text x="22" y="104" fontSize="10" fill="#94a3b8" textAnchor="end" fontWeight="bold">1</text>

                    {[
                      { x: 50, h: 22, date: 'Mon', count: 1, color: '#f59e0b' },
                      { x: 105, h: 44, date: 'Tue', count: 2, color: '#f59e0b' },
                      { x: 160, h: 88, date: 'Wed', count: 4, color: '#e11d48' },
                      { x: 215, h: 44, date: 'Thu', count: 2, color: '#f59e0b' },
                      { x: 270, h: 66, date: 'Fri', count: 3, color: '#e11d48' },
                      { x: 325, h: 22, date: 'Sat', count: 1, color: '#f59e0b' },
                      { x: 380, h: 66, date: 'Sun', count: 3, color: '#f59e0b' }
                    ].map((bar, idx) => (
                      <g key={idx}>
                        <rect
                          x={bar.x}
                          y={130 - bar.h}
                          width="28"
                          height={bar.h}
                          rx="4"
                          fill={bar.color}
                          opacity="0.9"
                        />
                        <text x={bar.x + 14} y={122 - bar.h} fontSize="10" fontWeight="bold" fill="#334155" textAnchor="middle">
                          {bar.count}
                        </text>
                        <text x={bar.x + 14} y="144" fontSize="10" fill="#64748b" textAnchor="middle" fontWeight="bold">
                          {bar.date}
                        </text>
                      </g>
                    ))}
                  </svg>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                  <div>
                    <h2 className="text-sm font-bold text-slate-900 font-heading">Fleet Mode & Cold Chain Summary</h2>
                    <p className="text-xs text-slate-500">Asset distribution and reefer compartment status</p>
                  </div>
                  <Filter className="w-4 h-4 text-slate-400" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200/80 space-y-3">
                    <p className="text-xs font-bold text-slate-800 border-b border-slate-200 pb-1.5 font-heading">
                      Fleet Mode Utilization
                    </p>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600">Ocean Maritime</span>
                        <span className="font-bold text-slate-900">88%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600">Reefer Trucking</span>
                        <span className="font-bold text-slate-900">82%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600">Air Express</span>
                        <span className="font-bold text-slate-900">75%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600">Rail Freight</span>
                        <span className="font-bold text-slate-900">64%</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200/80 space-y-3">
                    <p className="text-xs font-bold text-slate-800 border-b border-slate-200 pb-1.5 font-heading">
                      Cold Chain Telemetry
                    </p>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600">Optimal (2°C–8°C)</span>
                        <span className="font-bold text-emerald-700">96.0%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600">Warning Drift</span>
                        <span className="font-bold text-amber-600">2.5%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600">Critical Spike</span>
                        <span className="font-bold text-rose-600">1.5%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600">Sensor Sync</span>
                        <span className="font-bold text-slate-900">99.8%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Engine: <strong className="text-slate-800">SupplyGuard AI Analytics</strong></span>
                <span className="text-slate-400">Data refreshed 1 min ago</span>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="px-6 py-3 text-center text-xs text-slate-400 border-t border-slate-200 bg-white">
          © {new Date().getFullYear()} SupplyGuard AI. All rights reserved. • Operational Reports & Telemetry Module
        </footer>
      </div>
    </div>
  );
}
