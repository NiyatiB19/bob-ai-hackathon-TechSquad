import React from 'react';
import { Package, Truck, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { shipmentsMetricsMock } from '../../mock/shipmentsMock';

export default function ShipmentsMetrics({ totalCount }) {
  const metrics = [
    {
      id: 'met_total',
      label: 'TOTAL SHIPMENTS',
      value: totalCount || shipmentsMetricsMock.totalShipments,
      subtext: '↑ 12% vs last week',
      subtextColor: 'text-emerald-600',
      icon: Package,
      iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-100'
    },
    {
      id: 'met_transit',
      label: 'IN TRANSIT',
      value: shipmentsMetricsMock.inTransit,
      subtext: 'Currently moving',
      subtextColor: 'text-sky-600',
      icon: Truck,
      iconBg: 'bg-sky-50 text-sky-600 border-sky-100'
    },
    {
      id: 'met_delayed',
      label: 'DELAYED',
      value: shipmentsMetricsMock.delayed,
      subtext: 'Needs attention',
      subtextColor: 'text-rose-600 font-semibold',
      icon: AlertTriangle,
      iconBg: 'bg-rose-50 text-rose-600 border-rose-100'
    },
    {
      id: 'met_delivered',
      label: 'DELIVERED',
      value: shipmentsMetricsMock.delivered,
      subtext: 'Completed today',
      subtextColor: 'text-slate-500',
      icon: CheckCircle2,
      iconBg: 'bg-slate-100 text-slate-700 border-slate-200'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
      {metrics.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.id}
            className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-xs flex items-center justify-between"
          >
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                {item.label}
              </span>
              <div className="text-2xl font-extrabold text-[#0B192C] font-heading tracking-tight">
                {item.value}
              </div>
              <span className={`text-[11px] font-medium block ${item.subtextColor}`}>
                {item.subtext}
              </span>
            </div>

            <div className={`p-2.5 rounded-lg border ${item.iconBg}`}>
              <Icon className="w-4 h-4" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
