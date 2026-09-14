import React, { useState } from 'react';
import Sidebar from '../components/dashboard/Sidebar';
import TopHeader from '../components/dashboard/TopHeader';
import ShipmentsToolbar from '../components/shipments/ShipmentsToolbar';
import ShipmentsMetrics from '../components/shipments/ShipmentsMetrics';
import ShipmentsTabs from '../components/shipments/ShipmentsTabs';
import ShipmentsTable from '../components/shipments/ShipmentsTable';
import ShipmentDetailDrawer from '../components/shipments/ShipmentDetailDrawer';
import AddShipmentModal from '../components/shipments/AddShipmentModal';
import { shipmentsInitialData } from '../mock/shipmentsMock';
import { Check } from 'lucide-react';

export default function Shipments() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [shipments, setShipments] = useState(shipmentsInitialData);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [transportFilter, setTransportFilter] = useState('All');
  const [regionFilter, setRegionFilter] = useState('All');
  const [activeTab, setActiveTab] = useState('All');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Selected Shipment for Detail Drawer
  const [selectedShipment, setSelectedShipment] = useState(null);

  // Add Shipment Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Filter Logic
  const filteredShipments = shipments.filter((item) => {
    // Search match
    const query = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !query ||
      item.id.toLowerCase().includes(query) ||
      item.origin.toLowerCase().includes(query) ||
      item.destination.toLowerCase().includes(query) ||
      item.carrier.toLowerCase().includes(query);

    // Status Filter (Dropdown or Tab)
    const effectiveStatus = activeTab !== 'All' ? activeTab : statusFilter;
    const matchesStatus = effectiveStatus === 'All' || item.status === effectiveStatus;

    // Transport Mode Match
    const matchesMode = transportFilter === 'All' || item.transportMode === transportFilter;

    // Region Match
    const matchesRegion = regionFilter === 'All' || item.region === regionFilter;

    return matchesSearch && matchesStatus && matchesMode && matchesRegion;
  });

  const handleResetFilters = () => {
    setSearchTerm('');
    setStatusFilter('All');
    setTransportFilter('All');
    setRegionFilter('All');
    setActiveTab('All');
    setCurrentPage(1);
  };

  const handleAddShipment = (newShipment) => {
    setShipments([newShipment, ...shipments]);
    setToastMessage(`Shipment ${newShipment.id} successfully created.`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="min-h-screen bg-slate-100/70 font-sans overflow-x-hidden">
      
      {/* Sidebar (240px width) */}
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* Main Content Area */}
      <div className="lg:pl-[240px] flex flex-col min-h-screen">
        
        {/* Sticky Top Header */}
        <TopHeader setMobileOpen={setMobileOpen} />

        {/* Page Content Container */}
        <main className="flex-1 p-4 sm:p-5 lg:p-6 space-y-4 max-w-[1550px] w-full mx-auto animate-fadeIn">
          
          {/* Page Heading & Toast Notification */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#0B192C] font-heading tracking-tight">
                Shipments Management
              </h1>
              <p className="text-xs text-slate-500 font-normal">
                Track and manage all shipments across your global supply chain.
              </p>
            </div>

            {toastMessage && (
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center space-x-2 animate-fadeIn">
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{toastMessage}</span>
              </div>
            )}
          </div>

          {/* 1. Summary Metrics */}
          <ShipmentsMetrics totalCount={shipments.length} />

          {/* 2. Toolbar (Search & Filters) */}
          <ShipmentsToolbar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            transportFilter={transportFilter}
            setTransportFilter={setTransportFilter}
            regionFilter={regionFilter}
            setRegionFilter={setRegionFilter}
            onOpenAddModal={() => setIsAddModalOpen(true)}
            onResetFilters={handleResetFilters}
          />

          {/* 3. Filter Tabs Bar */}
          <ShipmentsTabs
            activeTab={activeTab}
            setActiveTab={(tab) => { setActiveTab(tab); setCurrentPage(1); }}
            filteredCount={filteredShipments.length}
            pageSize={pageSize}
            setPageSize={(size) => { setPageSize(size); setCurrentPage(1); }}
          />

          {/* 4. Main Shipment Data Table */}
          <ShipmentsTable
            shipments={filteredShipments}
            onSelectShipment={(shipment) => setSelectedShipment(shipment)}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            pageSize={pageSize}
            totalItems={filteredShipments.length}
          />

        </main>

        {/* Footer */}
        <footer className="px-6 py-3 text-center text-xs text-slate-400 border-t border-slate-200 bg-white">
          © {new Date().getFullYear()} SupplyGuard AI. All rights reserved. • Shipments Operations Module
        </footer>

      </div>

      {/* Right-Side Detail Drawer */}
      <ShipmentDetailDrawer
        shipment={selectedShipment}
        onClose={() => setSelectedShipment(null)}
      />

      {/* Add Shipment Modal Dialog */}
      <AddShipmentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddShipment={handleAddShipment}
      />

    </div>
  );
}
