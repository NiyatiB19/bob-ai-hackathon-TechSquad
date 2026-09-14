import React, { useState } from 'react';
import Sidebar from '../components/dashboard/Sidebar';
import TopHeader from '../components/dashboard/TopHeader';
import KpiCards from '../components/dashboard/KpiCards';
import SupplyChainMap from '../components/dashboard/SupplyChainMap';
import RecentDisruptions from '../components/dashboard/RecentDisruptions';
import AiAssistantCard from '../components/dashboard/AiAssistantCard';
import QuickActions from '../components/dashboard/QuickActions';
import ShipmentOverview from '../components/dashboard/ShipmentOverview';

export default function Dashboard() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100/70 font-sans overflow-x-hidden">
      
      {/* Fixed Sidebar (240px width) */}
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* Main Content Area */}
      <div className="lg:pl-[240px] flex flex-col min-h-screen">
        
        {/* Sticky Top Header */}
        <TopHeader setMobileOpen={setMobileOpen} />

        {/* Main Content Body */}
        <main className="flex-1 p-4 sm:p-5 lg:p-6 space-y-4 max-w-[1550px] w-full mx-auto">
          
          {/* 1. Top 5 KPI Cards */}
          <section>
            <KpiCards />
          </section>

          {/* 2. Two-Column Dashboard Grid */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5 items-start">
            
            {/* LEFT COLUMN: Map & Shipment Overview (~60% width) */}
            <div className="lg:col-span-7 space-y-4">
              <SupplyChainMap />
              <ShipmentOverview />
            </div>

            {/* RIGHT COLUMN: Disruptions, IBM Bob Card & Quick Actions (~40% width) */}
            <div className="lg:col-span-5 space-y-4">
              <RecentDisruptions />
              <AiAssistantCard />
              <QuickActions />
            </div>

          </section>

        </main>

        {/* Footer */}
        <footer className="px-6 py-3 text-center text-xs text-slate-400 border-t border-slate-200 bg-white">
          © {new Date().getFullYear()} SupplyGuard AI. All rights reserved. • IBM Bob AI Decision Assistant Module
        </footer>

      </div>

    </div>
  );
}
