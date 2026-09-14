import React from 'react';
import { Package, AlertTriangle, Route, Truck, Snowflake } from 'lucide-react';
import { kpiMetricsData } from '../../mock/dashboardMock';

const iconMap = {
  Package: Package,
  AlertTriangle: AlertTriangle,
  Route: Route,
  Truck: Truck,
  Snowflake: Snowflake
};

export default function KpiCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
      {kpiMetricsData.map((card) => {
        const Icon = iconMap[card.icon] || Package;
        const isUp = card.trend.includes('↑');
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
            {/* Header: Icon & Title */}
            <div className="flex items-center space-x-2.5 mb-2">
              <div className={`p-1.5 rounded-lg ${card.iconBg} flex items-center justify-center`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-700 font-heading truncate">
                {card.title}
              </span>
            </div>

            {/* Value & Trend */}
            <div className="flex items-baseline justify-between">
              <div className="text-2xl sm:text-[28px] font-extrabold text-[#0B192C] font-heading tracking-tight">
                {card.value}
              </div>

              <div className="text-xs font-bold">
                <span className={isUp ? 'text-emerald-600' : 'text-rose-600'}>
                  {card.trend}
                </span>
              </div>
            </div>

            {/* Comparison */}
            <div className="text-[11px] font-medium text-slate-400 mt-1">
              {card.comparison}
            </div>

          </div>
        );
      })}
    </div>
  );
}
