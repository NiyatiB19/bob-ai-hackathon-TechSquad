import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Zap,
  Package,
  AlertTriangle,
  Route,
  Truck,
  Snowflake,
  Brain
} from 'lucide-react';
import { quickActionsData } from '../../mock/dashboardMock';

const iconMap = {
  Package: Package,
  AlertTriangle: AlertTriangle,
  Route: Route,
  Truck: Truck,
  Snowflake: Snowflake,
  Brain: Brain
};

export default function QuickActions() {
  const navigate = useNavigate();

  return (
    <div className="rounded-xl bg-white border border-slate-200 p-4 space-y-3">
      {/* Header */}
      <div className="flex items-center space-x-2">
        <Zap className="w-4 h-4 text-amber-500" />
        <h3 className="text-sm font-bold text-[#0B192C] font-heading">
          Quick Actions
        </h3>
      </div>

      {/* Grid of 6 compact buttons */}
      <div className="grid grid-cols-2 gap-2.5">
        {quickActionsData.map((item) => {
          const Icon = iconMap[item.icon] || Zap;

          return (
            <button
              key={item.id}
              onClick={() => navigate(item.route)}
              className="flex items-center space-x-2 p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100/90 border border-slate-200/80 transition-colors text-left group cursor-pointer"
            >
              <div className={`p-1.5 rounded-md ${item.color}`}>
                <Icon className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-semibold text-slate-700 group-hover:text-slate-900 truncate">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
