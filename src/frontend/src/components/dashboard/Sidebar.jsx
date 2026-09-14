import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Truck,
  AlertTriangle,
  Route as RouteIcon,
  Cpu,
  Snowflake,
  Brain,
  FileText,
  X
} from 'lucide-react';

export default function Sidebar({ mobileOpen, setMobileOpen }) {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Shipments', path: '/shipments', icon: Truck },
    { name: 'Disruptions', path: '/disruptions', icon: AlertTriangle },
    { name: 'Routes', path: '/routes', icon: RouteIcon },
    { name: 'Fleet', path: '/fleet', icon: Cpu },
    { name: 'Cold Chain', path: '/cold-chain', icon: Snowflake },
    { name: 'AI Assistant (IBM Bob)', path: '/ai-assistant', icon: Brain },
    { name: 'Reports', path: '/reports', icon: FileText }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container: Fixed 240px width on desktop */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-[240px] bg-[#061826] text-slate-100 flex flex-col justify-between p-4 border-r border-slate-800/80 transition-transform duration-200 select-none ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Background Visual Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-bottom opacity-10 pointer-events-none mix-blend-overlay"
          style={{ backgroundImage: `url('/assets/supply-bg.jpg')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#061826] via-[#091F33] to-[#061826] pointer-events-none" />

        {/* Top Section */}
        <div className="relative z-10 space-y-5">
          
          {/* Brand Header */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center space-x-2.5">
              <img
                src="/assets/supplyguard-logo.png"
                alt="SupplyGuard AI Logo"
                className="h-9 w-auto object-contain"
              />
              <div>
                <h1 className="font-heading font-extrabold text-base tracking-tight text-white flex items-center">
                  SupplyGuard <span className="text-emerald-400 ml-1">AI</span>
                </h1>
                <p className="text-[9px] text-slate-400 font-medium leading-none mt-0.5">
                  Smarter Supply Chains. A Safer Tomorrow.
                </p>
              </div>
            </div>
            {/* Mobile Close Button */}
            <button
              onClick={() => setMobileOpen(false)}
              className="lg:hidden text-slate-400 hover:text-white p-1"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || (item.path === '/dashboard' && location.pathname === '/');

              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors group ${
                    isActive
                      ? 'bg-emerald-600/90 text-white font-semibold shadow-xs border border-emerald-400/30'
                      : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-emerald-400'
                    }`}
                  />
                  <span className="truncate">{item.name}</span>
                </NavLink>
              );
            })}
          </nav>

        </div>

        {/* Bottom System Status Badge */}
        <div className="relative z-10 p-3 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-center space-x-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <div>
              <p className="text-xs font-bold text-white leading-tight">System Online</p>
              <p className="text-[10px] text-slate-400 font-normal">All services operational</p>
            </div>
          </div>
        </div>

      </aside>
    </>
  );
}
