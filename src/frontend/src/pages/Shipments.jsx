import React, { useState, useEffect } from 'react';
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
import { API_BASE_URL } from '../services/apiConfig';

export default function Shipments() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [shipments, setShipments] = useState([]);
  const [totalCount, setTotalCount] = useState(0);

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

  useEffect(() => {
    async function fetchShipments() {
      try {
        const queryParams = new URLSearchParams({
          page: currentPage.toString(),
          limit: pageSize.toString()
        });

        if (searchTerm) queryParams.set('q', searchTerm);

        const effectiveStatus = activeTab !== 'All' ? activeTab : statusFilter;
        if (effectiveStatus !== 'All') queryParams.set('status', effectiveStatus);
        if (transportFilter !== 'All') queryParams.set('shippingMode', transportFilter);

        const res = await fetch(`${API_BASE_URL}/shipments?${queryParams.toString()}`);
        const json = await res.json();

        if (json.success && json.data) {
          const rawItems = json.data.shipments || [];
          setTotalCount(json.data.totalCount || rawItems.length);

          const mapped = rawItems.map((item) => {
            let badgeClass = 'bg-emerald-50 text-emerald-700 border-emerald-200';
            if (item.status === 'delayed') badgeClass = 'bg-amber-50 text-amber-700 border-amber-200';
            if (item.status === 'cancelled') badgeClass = 'bg-rose-50 text-rose-700 border-rose-200';
            if (item.status === 'in-transit') badgeClass = 'bg-sky-50 text-sky-700 border-sky-200';

            const originStr = item.origin?.city ? `${item.origin.city}, ${item.origin.country}` : 'Origin';
            const destStr = item.destination?.city ? `${item.destination.city}, ${item.destination.country}` : 'Destination';

            return {
              id: item.shipmentId || item.id,
              origin: originStr,
              destination: destStr,
              carrier: item.carrier || 'DataCo Express',
              transportMode: item.shippingMode ? (item.shippingMode.includes('Air') ? 'Air' : item.shippingMode.includes('Same') ? 'Truck' : 'Ocean') : 'Ocean',
              status: item.status ? item.status.toUpperCase() : 'IN-TRANSIT',
              statusBadge: badgeClass,
              eta: item.estimatedArrival ? new Date(item.estimatedArrival).toLocaleDateString() : 'N/A',
              temperature: item.temperatureSensitive ? '2°C - 8°C (Monitored)' : 'Standard Ambient',
              lastUpdated: item.updatedAt ? new Date(item.updatedAt).toLocaleTimeString() : 'Just now',
              raw: item
            };
          });

          setShipments(mapped);
        }
      } catch (err) {
        console.warn('Using local shipments mock fallback:', err.message);
        setShipments(shipmentsInitialData);
        setTotalCount(shipmentsInitialData.length);
      }
    }

    fetchShipments();
  }, [currentPage, pageSize, searchTerm, statusFilter, activeTab, transportFilter]);

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
                Real-time tracking of DataCo Supply Chain Dataset shipments in MongoDB.
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
          <ShipmentsMetrics totalCount={totalCount} />

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
            filteredCount={totalCount}
            pageSize={pageSize}
            setPageSize={(size) => { setPageSize(size); setCurrentPage(1); }}
          />

          {/* 4. Main Shipment Data Table */}
          <ShipmentsTable
            shipments={shipments}
            onSelectShipment={(shipment) => setSelectedShipment(shipment.raw || shipment)}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            pageSize={pageSize}
            totalItems={totalCount}
          />
        </main>

        {/* Footer */}
        <footer className="px-6 py-3 text-center text-xs text-slate-400 border-t border-slate-200 bg-white">
          © {new Date().getFullYear()} SupplyGuard AI. All rights reserved. • DataCo Supply Chain Dataset
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
