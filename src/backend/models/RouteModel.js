/**
 * SupplyGuard AI — Mongoose Route Model
 * Primary schema for deterministic origin-destination routes derived from DataCo dataset.
 */

const mongoose = require('mongoose');

const LocationSchema = new mongoose.Schema({
  city: { type: String, default: 'Unknown' },
  country: { type: String, default: 'Unknown' },
  lat: { type: Number, default: 0 },
  lng: { type: Number, default: 0 }
}, { _id: false });

const RouteSchema = new mongoose.Schema({
  routeId: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  origin: { type: LocationSchema, required: true },
  destination: { type: LocationSchema, required: true },
  distanceKm: { type: Number, default: 1000 },
  estimatedDurationHours: { type: Number, default: 48 },
  shipmentCount: { type: Number, default: 1 },
  lateCount: { type: Number, default: 0 },
  status: { type: String, enum: ['available', 'disrupted', 'congested'], default: 'available' },
  risk: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], default: 'LOW' },
  transportMode: { type: String, default: 'sea' },
  dataSource: { type: String, default: 'DataCo Supply Chain Dataset' }
}, {
  collection: 'routes',
  timestamps: true
});

const RouteModel = mongoose.models.Route || mongoose.model('Route', RouteSchema);

module.exports = RouteModel;
