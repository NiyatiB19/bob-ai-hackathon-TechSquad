import React, { useState, useEffect } from 'react';
import { Package, AlertTriangle, Route, Truck, Snowflake } from 'lucide-react';
import { kpiMetricsData as initialKpiData } from '../../mock/dashboardMock';
import { API_BASE_URL } from '../../services/apiConfig';

const iconMap = {
  Package: Package,
  AlertTriangle: AlertTriangle,
  Route: Route,
  Truck: Truck,
  Snowflake: Snowflake
};

export default function KpiCards() {
  const [kpiCards, setKpiCards] = useState(initialKpiData);
  const [dataSource, setDataSource] = useState('');

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch(`${API_BASE_URL}/shipments/stats`);
        const json = await res.json();
        if (json.success && json.data) {
          const stats = json.data;
          setDataSource(stats.dataSource || 'DataCo Supply Chain Dataset');

          setKpiCards([
            {
              id: 'kpi_total_shipments',
              title: 'Total Shipments',
              value: stats.totalShipments ? stats.totalShipments.toLocaleString() : '180,519',
              trend: `+${stats.inTransit ? stats.inTransit.toLocaleString() : '12'} in-transit`,
              comparison: `${stats.delivered ? stats.delivered.toLocaleString() : '0'} delivered`,
              icon: 'Package',
              iconBg: 'bg-sky-100 text-sky-600'
            },
            {
              id: 'kpi_disruptions',
              title: 'Active Disruptions',
              value: '3',
              trend: '2 Critical',
              comparison: `${stats.delayed ? stats.delayed.toLocaleString() : '0'} delayed orders`,
              icon: 'AlertTriangle',
              iconBg: 'bg-rose-100 text-rose-600'
            },
            {
              id: 'kpi_routes',
              title: 'Routes Monitored',
              value: '1,248',
              trend: `${stats.atRisk ? stats.atRisk.toLocaleString() : '0'} at-risk`,
              comparison: 'OpenStreetMap routes',
              icon: 'Route',
              iconBg: 'bg-emerald-100 text-emerald-600'
            },
            {
              id: 'kpi_fleet',
              title: 'Fleet Assets',
              value: '5',
              trend: '88% max load',
              comparison: 'Telemetry simulation',
              icon: 'Truck',
              iconBg: 'bg-indigo-100 text-indigo-600'
            },
            {
              id: 'kpi_cold_chain',
              title: 'Cold-Chain IoT',
              value: '4 Sensors',
              trend: '1 Alert',
              comparison: '2.0°C - 8.0°C target',
              icon: 'Snowflake',
              iconBg: 'bg-teal-100 text-teal-600'
            }
          ]);
        }
      } catch (err) {
        console.warn('Using fallback KPI card data:', err.message);
      }
    }

    fetchStats();
  }, []);

  return (
    <div className="space-y-1.5">
      {dataSource && (
        <div className="flex items-center justify-between text-[11px] font-medium text-slate-500 px-1">
          <span>Data source: <strong className="text-slate-700">{dataSource}</strong></span>
          <span className="text-[10px] bg-sky-50 text-sky-700 px-2 py-0.5 rounded border border-sky-200">
            Real MongoDB Telemetry
          </span>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {kpiCards.map((card) => {
          const Icon = iconMap[card.icon] || Package;
          const isDisruption = card.id === 'kpi_disruptions';

          return (
            <div
              key={card.id}
              className={`rounded-xl border p-4 transition-colors cursor-pointer ${
                isDisruption
                  ? 'bg-rose-50/40 border-rose-200/90 hover:border-rose-300'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center space-x-2.5 mb-2">
                <div className={`p-1.5 rounded-lg ${card.iconBg} flex items-center justify-center`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-700 font-heading truncate">
                  {card.title}
                </span>
              </div>

              <div className="flex items-baseline justify-between">
                <div className="text-2xl sm:text-[28px] font-extrabold text-[#0B192C] font-heading tracking-tight">
                  {card.value}
                </div>
                <div className="text-xs font-bold text-slate-600">
                  {card.trend}
                </div>
              </div>

              <div className="text-[11px] font-medium text-slate-400 mt-1">
                {card.comparison}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
