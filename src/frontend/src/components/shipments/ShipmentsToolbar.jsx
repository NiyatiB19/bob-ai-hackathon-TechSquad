import React from 'react';
import { Search, Filter, Plus, RotateCcw } from 'lucide-react';

export default function ShipmentsToolbar({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  transportFilter,
  setTransportFilter,
  regionFilter,
  setRegionFilter,
  onOpenAddModal,
  onResetFilters
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
      
      {/* Left Search Input */}
      <div className="relative flex-1 max-w-md">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search shipment ID, origin, destination, carrier..."
          className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
        />
      </div>

      {/* Right Filters & Add Button */}
      <div className="flex flex-wrap items-center gap-2.5">
        
        {/* Status Filter */}
        <div className="flex items-center space-x-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-transparent text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="On Track">On Track</option>
            <option value="In Transit">In Transit</option>
            <option value="Delayed">Delayed</option>
            <option value="At Port">At Port</option>
            <option value="Delivered">Delivered</option>
          </select>
        </div>

        {/* Transport Mode Filter */}
        <select
          value={transportFilter}
          onChange={(e) => setTransportFilter(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer"
        >
          <option value="All">All Modes</option>
          <option value="Ocean">Ocean</option>
          <option value="Air">Air</option>
          <option value="Truck">Truck</option>
        </select>

        {/* Region Filter */}
        <select
          value={regionFilter}
          onChange={(e) => setRegionFilter(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer hidden sm:block"
        >
          <option value="All">All Regions</option>
          <option value="Asia">Asia</option>
          <option value="Europe">Europe</option>
          <option value="North America">North America</option>
          <option value="Middle East">Middle East</option>
        </select>

        {/* Reset Button */}
        {(searchTerm || statusFilter !== 'All' || transportFilter !== 'All' || regionFilter !== 'All') && (
          <button
            onClick={onResetFilters}
            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors text-xs font-medium cursor-pointer"
            title="Reset Filters"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Primary Add Shipment Button */}
        <button
          onClick={onOpenAddModal}
          className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Shipment</span>
        </button>

      </div>

    </div>
  );
}
