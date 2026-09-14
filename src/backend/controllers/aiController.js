/**
 * SupplyGuard AI — Module C: AI + IBM Bob
 * aiController.js
 *
 * REST API controller for AI decision support endpoints.
 */

import { analyzeShipment } from '../../ai/services/aiRecommendationService.js';

/**
 * Express Controller: POST /api/ai/analyze
 */
export async function analyzeShipmentHandler(req, res) {
  try {
    const { shipmentId, shipment } = req.body || {};

    const result = await analyzeShipment({ shipmentId, shipment });

    return res.status(200).json({
      success: true,
      data: result,
      message: 'AI analysis completed successfully.'
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      error: {
        code: statusCode === 400 ? 'INVALID_INPUT' : 'INTERNAL_AI_ERROR',
        message: error.message || 'An error occurred during AI analysis.'
      }
    });
  }
}
