import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, ArrowRight, Anchor, Sun, Thermometer } from 'lucide-react';
import { recentDisruptionsData } from '../../mock/dashboardMock';

const iconMap = {
  Anchor: Anchor,
  Sun: Sun,
  Thermometer: Thermometer
};

export default function RecentDisruptions() {
  const navigate = useNavigate();

  return (
    <div className="rounded-xl bg-white border border-slate-200 p-4 space-y-3">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4 text-rose-500" />
          <h3 className="text-sm font-bold text-[#0B192C] font-heading">
            Recent Disruptions
          </h3>
        </div>
        <button
          onClick={() => navigate('/disruptions')}
          className="inline-flex items-center space-x-1 text-xs font-bold text-sky-600 hover:text-sky-700 transition-colors cursor-pointer"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Tabular Rows Container with Thin Dividers */}
      <div className="divide-y divide-slate-100 border-t border-slate-100">
        {recentDisruptionsData.map((item) => {
          const Icon = iconMap[item.icon] || AlertTriangle;

          return (
            <div
              key={item.id}
              onClick={() => navigate('/disruptions')}
              className="py-3 px-1 flex items-center justify-between hover:bg-slate-50/80 transition-colors cursor-pointer group"
            >
              <div className="flex items-center space-x-3">
                <div className="p-1.5 rounded-lg bg-rose-50 border border-rose-100 text-rose-600">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 leading-snug">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 font-medium">
                    {item.location}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${item.badgeClass}`}>
                  {item.severity}
                </span>
                <span className="text-[11px] font-medium text-slate-400">
                  {item.timeAgo}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
