import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/dashboard/Sidebar';
import TopHeader from '../components/dashboard/TopHeader';
import { ArrowLeft, Construction, ShieldAlert, Truck, Route, Cpu, Snowflake, Brain, FileText } from 'lucide-react';

export function ModulePlaceholder({ title, description, icon: Icon, moduleName }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-100/70 font-sans overflow-x-hidden">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <div className="lg:pl-[260px] flex flex-col min-h-screen">
        <TopHeader setMobileOpen={setMobileOpen} />

        <main className="flex-1 p-6 lg:p-12 flex flex-col items-center justify-center max-w-4xl mx-auto w-full text-center">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-6 max-w-lg w-full">
            <div className="w-16 h-16 rounded-2xl bg-sky-50 text-sky-600 border border-sky-100 flex items-center justify-center mx-auto shadow-xs">
              <Icon className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-semibold text-xs border border-emerald-200">
                {moduleName || 'SupplyGuard Module'}
              </span>
              <h2 className="text-2xl font-extrabold font-heading text-slate-900 tracking-tight">
                {title}
              </h2>
              <p className="text-sm text-slate-500 font-normal leading-relaxed">
                {description}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 flex items-center justify-center space-x-2">
              <Construction className="w-4 h-4 text-amber-500 flex-shrink-0" />
              <span>Frontend Route Active — Connected to Operator Dashboard</span>
            </div>

            <button
              onClick={() => navigate('/dashboard')}
              className="inline-flex items-center justify-center space-x-2 w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}

export function ShipmentsPage() {
  return (
    <ModulePlaceholder
      title="Shipments Management"
      description="Active shipment tracking, corridor monitoring, and ETA predictions."
      icon={Truck}
      moduleName="Member 2 Module Boundary"
    />
  );
}

export function DisruptionsPage() {
  return (
    <ModulePlaceholder
      title="Disruptions Center"
      description="Real-time environmental, labor, and port disruption severity classification."
      icon={ShieldAlert}
      moduleName="Member 2 Module Boundary"
    />
  );
}

export function RoutesPage() {
  return (
    <ModulePlaceholder
      title="Route Optimization"
      description="Intelligent route recommendations and bottleneck bypass corridors."
      icon={Route}
      moduleName="Member 2 & 3 Boundary"
    />
  );
}

export function FleetPage() {
  return (
    <ModulePlaceholder
      title="Fleet Utilization"
      description="Idle truck, container vessel, and transport asset redeployment optimization."
      icon={Cpu}
      moduleName="Member 4 Module Boundary"
    />
  );
}

export function ColdChainPage() {
  return (
    <ModulePlaceholder
      title="Cold Chain Telemetry"
      description="IoT sensor thermal logging and real-time excursion detection."
      icon={Snowflake}
      moduleName="Member 4 Module Boundary"
    />
  );
}

export function AiAssistantPage() {
  return (
    <ModulePlaceholder
      title="IBM Bob AI Assistant"
      description="Conversational AI operational decision-support interface."
      icon={Brain}
      moduleName="Member 3 Module Boundary"
    />
  );
}

export function ReportsPage() {
  return (
    <ModulePlaceholder
      title="Analytics & Reports"
      description="Historical logistics reliability performance and carbon footprint metrics."
      icon={FileText}
      moduleName="SupplyGuard Analytics"
    />
  );
}
