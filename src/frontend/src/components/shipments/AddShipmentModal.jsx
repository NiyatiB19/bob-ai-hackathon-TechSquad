import React, { useState } from 'react';
import { X, Plus, Package } from 'lucide-react';

export default function AddShipmentModal({ isOpen, onClose, onAddShipment }) {
  if (!isOpen) return null;

  const [id, setId] = useState(`SG-${Math.floor(1009 + Math.random() * 9000)}`);
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [carrier, setCarrier] = useState('Global Logistics');
  const [transportMode, setTransportMode] = useState('Ocean');
  const [eta, setEta] = useState('May 15, 2025');
  const [temperature, setTemperature] = useState('2°C');
  const [cargoType, setCargoType] = useState('General Freight');
  const [containerNo, setContainerNo] = useState(`CONT-${Math.floor(10000 + Math.random() * 89999)}`);
  const [region, setRegion] = useState('Asia');

  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!origin.trim()) errs.origin = 'Origin location is required';
    if (!destination.trim()) errs.destination = 'Destination location is required';
    if (!carrier.trim()) errs.carrier = 'Carrier name is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const newShipment = {
      id,
      origin,
      destination,
      carrier,
      transportMode,
      status: 'On Track',
      statusBadge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      eta,
      temperature,
      lastUpdated: 'Just now',
      region,
      containerNo,
      weight: '14,200 kg',
      cargoType,
      currentLocation: `${origin} Freight Hub`,
      progress: 5
    };

    onAddShipment(newShipment);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700 border border-emerald-200">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 font-heading">
                Create New Shipment
              </h3>
              <p className="text-xs text-slate-500 font-normal">
                Register new shipment routing & sensor telemetry
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          
          {/* Shipment ID & Container Number */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-slate-700 uppercase">
                Shipment ID
              </label>
              <input
                type="text"
                value={id}
                onChange={(e) => setId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono font-bold focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-slate-700 uppercase">
                Container Number
              </label>
              <input
                type="text"
                value={containerNo}
                onChange={(e) => setContainerNo(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 font-mono font-medium focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Origin & Destination */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-slate-700 uppercase">
                Origin City
              </label>
              <input
                type="text"
                required
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                placeholder="e.g. Shanghai"
                className={`w-full px-3 py-2 bg-white border ${errors.origin ? 'border-rose-400' : 'border-slate-200'} rounded-lg text-slate-900 font-medium focus:outline-none focus:border-emerald-500`}
              />
              {errors.origin && <p className="text-[10px] text-rose-500 font-medium">{errors.origin}</p>}
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-slate-700 uppercase">
                Destination City
              </label>
              <input
                type="text"
                required
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="e.g. Mumbai"
                className={`w-full px-3 py-2 bg-white border ${errors.destination ? 'border-rose-400' : 'border-slate-200'} rounded-lg text-slate-900 font-medium focus:outline-none focus:border-emerald-500`}
              />
              {errors.destination && <p className="text-[10px] text-rose-500 font-medium">{errors.destination}</p>}
            </div>
          </div>

          {/* Carrier & Transport Mode */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-slate-700 uppercase">
                Carrier Name
              </label>
              <input
                type="text"
                required
                value={carrier}
                onChange={(e) => setCarrier(e.target.value)}
                placeholder="e.g. Global Logistics"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 font-medium focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-slate-700 uppercase">
                Transport Mode
              </label>
              <select
                value={transportMode}
                onChange={(e) => setTransportMode(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 font-medium focus:outline-none focus:border-emerald-500"
              >
                <option value="Ocean">Ocean Freight</option>
                <option value="Air">Air Express</option>
                <option value="Truck">Road Truck</option>
              </select>
            </div>
          </div>

          {/* ETA & Temperature */}
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-slate-700 uppercase">
                ETA Date
              </label>
              <input
                type="text"
                value={eta}
                onChange={(e) => setEta(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 font-medium focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-slate-700 uppercase">
                Target Temp
              </label>
              <input
                type="text"
                value={temperature}
                onChange={(e) => setTemperature(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 font-medium focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-slate-700 uppercase">
                Region
              </label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 font-medium focus:outline-none focus:border-emerald-500"
              >
                <option value="Asia">Asia</option>
                <option value="Europe">Europe</option>
                <option value="North America">North America</option>
                <option value="Middle East">Middle East</option>
              </select>
            </div>
          </div>

          {/* Cargo Type */}
          <div className="space-y-1">
            <label className="block text-[11px] font-bold text-slate-700 uppercase">
              Cargo Classification / Product
            </label>
            <input
              type="text"
              value={cargoType}
              onChange={(e) => setCargoType(e.target.value)}
              placeholder="e.g. Cold Chain Vaccines / Electronics"
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 font-medium focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Form Actions */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
            >
              Create Shipment
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
