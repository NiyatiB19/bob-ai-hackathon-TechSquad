import React from 'react';
import {
  Eye,
  MoreVertical,
  Anchor,
  Plane,
  Truck,
  Snowflake,
  ChevronLeft,
  ChevronRight,
  PackageX
} from 'lucide-react';

export default function ShipmentsTable({
  shipments,
  onSelectShipment,
  currentPage,
  setCurrentPage,
  pageSize,
  totalItems
}) {
  const modeIcons = {
    Ocean: Anchor,
    Air: Plane,
    Truck: Truck
  };

  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedShipments = shipments.slice(startIndex, startIndex + pageSize);

  return (
    <div className="rounded-xl bg-white border border-slate-200 shadow-xs overflow-hidden flex flex-col justify-between">
      
      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
              <th className="py-3 px-4">Shipment ID</th>
              <th className="py-3 px-4">Origin → Destination</th>
              <th className="py-3 px-4">Carrier</th>
              <th className="py-3 px-4">Mode</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">ETA</th>
              <th className="py-3 px-4">Temperature</th>
              <th className="py-3 px-4">Last Updated</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
            {paginatedShipments.length > 0 ? (
              paginatedShipments.map((row) => {
                const ModeIcon = modeIcons[row.transportMode] || Truck;

                return (
                  <tr
                    key={row.id}
                    onClick={() => onSelectShipment(row)}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                  >
                    {/* Shipment ID */}
                    <td className="py-3.5 px-4 font-bold text-[#0B192C] font-mono">
                      {row.id}
                    </td>

                    {/* Route */}
                    <td className="py-3.5 px-4 font-medium text-slate-800">
                      {row.origin} → {row.destination}
                    </td>

                    {/* Carrier */}
                    <td className="py-3.5 px-4 text-slate-600 font-normal truncate max-w-[140px]">
                      {row.carrier}
                    </td>

                    {/* Mode */}
                    <td className="py-3.5 px-4">
                      <div className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px]">
                        <ModeIcon className="w-3 h-3 text-slate-500" />
                        <span>{row.transportMode}</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold border ${row.statusBadge}`}>
                        {row.status}
                      </span>
                    </td>

                    {/* ETA */}
                    <td className="py-3.5 px-4 text-slate-700 font-medium whitespace-nowrap">
                      {row.eta}
                    </td>

                    {/* Temp */}
                    <td className="py-3.5 px-4 text-slate-700 font-medium">
                      <div className="inline-flex items-center space-x-1">
                        <Snowflake className="w-3.5 h-3.5 text-sky-500" />
                        <span>{row.temperature}</span>
                      </div>
                    </td>

                    {/* Last Updated */}
                    <td className="py-3.5 px-4 text-slate-400 text-[11px] whitespace-nowrap">
                      {row.lastUpdated}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center space-x-1">
                        <button
                          onClick={(e) => { e.stopPropagation(); onSelectShipment(row); }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-sky-600 hover:bg-sky-50 transition-colors cursor-pointer"
                          title="View Shipment Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                          title="More options"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={9} className="py-12 text-center text-slate-400 space-y-2">
                  <PackageX className="w-8 h-8 mx-auto text-slate-300" />
                  <p className="font-semibold text-slate-700 text-sm">No shipments found</p>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Try adjusting your search criteria or clearing active filters.
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer Bar */}
      <div className="px-4 py-3 border-t border-slate-200 bg-slate-50/60 flex items-center justify-between text-xs text-slate-500 font-medium">
        <div>
          Showing <span className="font-bold text-slate-800">{totalItems > 0 ? startIndex + 1 : 0}</span>–<span className="font-bold text-slate-800">{Math.min(startIndex + pageSize, totalItems)}</span> of <span className="font-bold text-slate-800">{totalItems}</span> shipments
        </div>

        <div className="flex items-center space-x-1.5">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => setCurrentPage(pageNum)}
              className={`px-3 py-1 rounded-lg border text-xs font-bold transition-colors cursor-pointer ${
                currentPage === pageNum
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {pageNum}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
}
