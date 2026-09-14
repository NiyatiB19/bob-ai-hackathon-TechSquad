import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, ArrowRight, Snowflake, ChevronRight } from 'lucide-react';
import { shipmentOverviewData } from '../../mock/dashboardMock';

export default function ShipmentOverview() {
  const navigate = useNavigate();

  return (
    <div className="rounded-xl bg-white border border-slate-200 p-4 space-y-3">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700 border border-emerald-200">
            <Package className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#0B192C] font-heading">
              Shipment Overview
            </h3>
            <p className="text-[11px] text-slate-400 font-normal">
              Latest shipment status across all regions
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate('/shipments')}
          className="inline-flex items-center space-x-1 text-xs font-bold text-sky-600 hover:text-sky-700 transition-colors cursor-pointer"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto border-t border-slate-200">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
              <th className="py-2.5 px-3">Shipment ID</th>
              <th className="py-2.5 px-3">Origin → Destination</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3">ETA</th>
              <th className="py-2.5 px-3">Temperature</th>
              <th className="py-2.5 px-1 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
            {shipmentOverviewData.map((row) => (
              <tr
                key={row.id}
                onClick={() => navigate('/shipments')}
                className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
              >
                <td className="py-3 px-3 font-bold text-slate-900 font-mono">
                  {row.id}
                </td>
                <td className="py-3 px-3 font-medium text-slate-800">
                  {row.route}
                </td>
                <td className="py-3 px-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${row.statusBadge}`}>
                    {row.status}
                  </span>
                </td>
                <td className="py-3 px-3 text-slate-600">
                  {row.eta}
                </td>
                <td className="py-3 px-3 font-medium text-slate-700">
                  <div className="inline-flex items-center space-x-1">
                    <Snowflake className="w-3.5 h-3.5 text-sky-500" />
                    <span>{row.temp}</span>
                  </div>
                </td>
                <td className="py-3 px-1 text-right text-slate-300 group-hover:text-slate-600 transition-colors">
                  <ChevronRight className="w-4 h-4 ml-auto" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
