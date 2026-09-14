import React from 'react';

export default function ShipmentsTabs({
  activeTab,
  setActiveTab,
  filteredCount,
  pageSize,
  setPageSize
}) {
  const tabs = [
    { id: 'All', label: 'All Shipments' },
    { id: 'In Transit', label: 'In Transit' },
    { id: 'Delayed', label: 'Delayed' },
    { id: 'At Port', label: 'At Port' },
    { id: 'Delivered', label: 'Delivered' }
  ];

  return (
    <div className="border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-1 pb-0">
      
      {/* Filter Tabs */}
      <div className="flex items-center space-x-6 overflow-x-auto w-full sm:w-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 text-xs font-bold transition-all relative whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'text-emerald-700'
                  : 'text-slate-500 hover:text-slate-800 font-medium'
              }`}
            >
              <span>{tab.label}</span>
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Right Details */}
      <div className="flex items-center space-x-3 text-xs text-slate-500 font-medium pb-2 sm:pb-0">
        <span>{filteredCount} shipments</span>
        <span className="text-slate-300">•</span>
        <div className="flex items-center space-x-1.5">
          <span>Rows:</span>
          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="bg-white border border-slate-200 rounded px-1.5 py-0.5 text-xs text-slate-700 font-semibold focus:outline-none cursor-pointer"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </div>
      </div>

    </div>
  );
}
