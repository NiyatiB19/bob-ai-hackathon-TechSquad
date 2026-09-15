/**
 * SupplyGuard AI — Mongoose Shipment Model
 * Primary schema for DataCo Supply Chain Dataset records & operational shipments.
 */

const mongoose = require('mongoose');

const LocationSchema = new mongoose.Schema({
  city: { type: String, default: 'Unknown' },
  state: { type: String, default: '' },
  country: { type: String, default: 'Unknown' },
  lat: { type: Number, default: 0 },
  lng: { type: Number, default: 0 }
}, { _id: false });

const ShipmentSchema = new mongoose.Schema({
  shipmentId: { type: String, required: true, unique: true, index: true },
  trackingNumber: { type: String, index: true },
  orderId: { type: String, index: true },
  orderItemId: { type: String, index: true },
  
  origin: { type: LocationSchema, required: true },
  destination: { type: LocationSchema, required: true },
  currentLocation: { type: LocationSchema },
  
  cargoType: { type: String, default: 'General Freight' },
  categoryName: { type: String, default: 'General' },
  customerSegment: { type: String, default: 'Consumer' },
  
  quantity: { type: Number, default: 1 },
  salesUSD: { type: Number, default: 0 },
  profitUSD: { type: Number, default: 0 },
  benefitPerOrderUSD: { type: Number, default: 0 },
  
  priority: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'medium' },
  status: { type: String, enum: ['in-transit', 'delivered', 'delayed', 'cancelled', 'planned'], default: 'in-transit', index: true },
  
  deliveryStatusDataCo: { type: String, default: 'Shipping on time' },
  orderStatus: { type: String, default: 'COMPLETE' },
  lateDeliveryRisk: { type: Number, default: 0, index: true },
  
  daysForShippingReal: { type: Number, default: 0 },
  daysForShippingScheduled: { type: Number, default: 0 },
  shippingMode: { type: String, default: 'Standard Class' },
  
  estimatedDeparture: { type: Date },
  estimatedArrival: { type: Date },
  shippingDate: { type: Date },
  
  carrier: { type: String, default: 'DataCo Logistics' },
  temperatureSensitive: { type: Boolean, default: false },
  dataSource: { type: String, default: 'DataCo Supply Chain Dataset' }
}, {
  collection: 'shipments',
  timestamps: true
});

// Text index for rapid global search across IDs, products, cities, countries
ShipmentSchema.index({
  shipmentId: 'text',
  orderId: 'text',
  cargoType: 'text',
  categoryName: 'text',
  'origin.city': 'text',
  'origin.country': 'text',
  'destination.city': 'text',
  'destination.country': 'text'
});

const ShipmentModel = mongoose.models.Shipment || mongoose.model('Shipment', ShipmentSchema);

module.exports = ShipmentModel;
