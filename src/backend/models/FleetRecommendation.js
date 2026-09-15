/**
 * SupplyGuard AI — FleetRecommendation Model
 * Module D (Member 4 - Fleet & Cold-Chain)
 */

class FleetRecommendation {
  constructor({
    recommendationId,
    shipmentId,
    fleetAssetId,
    recommendation = 'REDEPLOY',
    priority = 'HIGH', // LOW, MEDIUM, HIGH, CRITICAL
    reason = [],
    recommendedAsset = null,
    confidence = 0.92,
    createdAt = new Date().toISOString()
  }) {
    this.recommendationId = recommendationId;
    this.shipmentId = shipmentId;
    this.fleetAssetId = fleetAssetId;
    this.recommendation = recommendation;
    this.priority = priority;
    this.reason = Array.isArray(reason) ? reason : [reason];
    this.recommendedAsset = recommendedAsset;
    this.confidence = confidence;
    this.createdAt = createdAt;
  }
}

module.exports = FleetRecommendation;
