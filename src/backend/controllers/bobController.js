/**
 * SupplyGuard AI — Module C: AI + IBM Bob
 * bobController.js
 *
 * REST API controller for IBM Bob conversational decision-support endpoints.
 */

/**
 * Express Controller: POST /api/bob/query
 */
async function handleBobQuery(req, res) {
  try {
    const { prompt, userId } = req.body || {};

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_PROMPT',
          message: 'The prompt parameter is required and cannot be empty.'
        }
      });
    }

    const { executeBobQuery } = await import('../../ai/services/bobService.js');
    const result = await executeBobQuery({ prompt, userId });

    return res.status(200).json({
      success: true,
      data: result,
      message: 'IBM Bob query processed successfully.'
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      error: {
        code: statusCode === 400 ? 'INVALID_INPUT' : 'BOB_SERVICE_ERROR',
        message: error.message || 'An error occurred processing the IBM Bob query.'
      }
    });
  }
}

module.exports = { handleBobQuery };
