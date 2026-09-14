const SHIPMENT_STATUS = ['planned', 'in-transit', 'delivered', 'delayed', 'at-risk', 'disrupted'];
const DISRUPTION_STATUS = ['active', 'monitoring', 'cleared'];
const DISRUPTION_TYPES = ['weather', 'port-strike', 'port-closure', 'road-closure', 'geopolitical', 'natural-disaster', 'carrier-disruption', 'other'];
const PRIORITY_LEVELS = ['low', 'medium', 'high', 'critical'];
const SEVERITY_LEVELS = ['low', 'medium', 'high', 'critical'];
const RISK_LEVELS = ['LOW', 'MEDIUM', 'HIGH'];

const SEVERITY_WEIGHT = {
  low: 15,
  medium: 30,
  high: 50,
  critical: 70,
};

const PRIORITY_WEIGHT = {
  low: 5,
  medium: 12,
  high: 20,
  critical: 28,
};

module.exports = {
  SHIPMENT_STATUS,
  DISRUPTION_STATUS,
  DISRUPTION_TYPES,
  PRIORITY_LEVELS,
  SEVERITY_LEVELS,
  RISK_LEVELS,
  SEVERITY_WEIGHT,
  PRIORITY_WEIGHT,
};
