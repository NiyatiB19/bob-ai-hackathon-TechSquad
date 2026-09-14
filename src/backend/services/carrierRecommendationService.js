const { carriers } = require('../mock/sampleData');

function recommendCarrier({ shipmentId, currentCarrier, carriers: carrierOptions = carriers }) {
  if (!shipmentId) {
    throw new Error('shipmentId is required');
  }

  const ranked = [...carrierOptions]
    .filter((carrier) => carrier.available !== false)
    .sort((a, b) => {
      const riskOrder = { LOW: 0, MEDIUM: 1, HIGH: 2 };
      const riskDiff = (riskOrder[a.risk] || 99) - (riskOrder[b.risk] || 99);
      return riskDiff !== 0 ? riskDiff : (a.delayHours || 0) - (b.delayHours || 0);
    });

  if (ranked.length === 0) {
    return {
      shipmentId,
      currentCarrier,
      recommendedCarrier: null,
      alternatives: [],
      reason: 'No available alternative carrier currently meets the route and risk requirements.',
    };
  }

  const recommended = ranked[0];

  return {
    shipmentId,
    currentCarrier,
    recommendedCarrier: recommended,
    alternatives: ranked.slice(1),
    reason: `Best available carrier choice (${recommended.name}) with ${recommended.risk} risk and ${recommended.delayHours || 0} hours delay.`,
  };
}

module.exports = { recommendCarrier };
