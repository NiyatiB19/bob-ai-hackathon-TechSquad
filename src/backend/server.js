/**
 * SupplyGuard AI — Centralized REST API Server
 * Zero-dependency native HTTP server supporting Module C endpoints.
 */

import http from 'http';
import { analyzeShipment } from '../ai/services/aiRecommendationService.js';
import { executeBobQuery } from '../ai/services/bobService.js';

const PORT = process.env.PORT || 5000;

function sendJsonResponse(res, statusCode, body) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': process.env.CORS_ORIGIN || '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(JSON.stringify(body));
}

export function createServer() {
  return http.createServer(async (req, res) => {
    // Handle CORS preflight OPTIONS request
    if (req.method === 'OPTIONS') {
      res.writeHead(204, {
        'Access-Control-Allow-Origin': process.env.CORS_ORIGIN || '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      });
      return res.end();
    }

    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);

    // Health check endpoint
    if (req.method === 'GET' && url.pathname === '/api/health') {
      return sendJsonResponse(res, 200, {
        success: true,
        message: 'SupplyGuard AI API Service Operational.'
      });
    }

    // Parse JSON request body for POST requests
    if (req.method === 'POST') {
      let bodyStr = '';
      req.on('data', (chunk) => {
        bodyStr += chunk.toString();
      });

      req.on('end', async () => {
        let body = {};
        if (bodyStr.trim()) {
          try {
            body = JSON.parse(bodyStr);
          } catch {
            return sendJsonResponse(res, 400, {
              success: false,
              error: {
                code: 'INVALID_JSON',
                message: 'Malformed JSON payload.'
              }
            });
          }
        }

        // Endpoint 1: POST /api/ai/analyze
        if (url.pathname === '/api/ai/analyze') {
          try {
            const result = await analyzeShipment({
              shipmentId: body.shipmentId,
              shipment: body.shipment
            });
            return sendJsonResponse(res, 200, {
              success: true,
              data: result,
              message: 'AI analysis completed successfully.'
            });
          } catch (error) {
            const statusCode = error.statusCode || 500;
            return sendJsonResponse(res, statusCode, {
              success: false,
              error: {
                code: statusCode === 400 ? 'INVALID_INPUT' : 'INTERNAL_AI_ERROR',
                message: error.message || 'An error occurred during AI analysis.'
              }
            });
          }
        }

        // Endpoint 2: POST /api/bob/query
        if (url.pathname === '/api/bob/query') {
          try {
            if (!body.prompt || typeof body.prompt !== 'string' || body.prompt.trim().length === 0) {
              return sendJsonResponse(res, 400, {
                success: false,
                error: {
                  code: 'MISSING_PROMPT',
                  message: 'The prompt parameter is required and cannot be empty.'
                }
              });
            }

            const result = await executeBobQuery({
              prompt: body.prompt,
              userId: body.userId
            });
            return sendJsonResponse(res, 200, {
              success: true,
              data: result,
              message: 'IBM Bob query processed successfully.'
            });
          } catch (error) {
            const statusCode = error.statusCode || 500;
            return sendJsonResponse(res, statusCode, {
              success: false,
              error: {
                code: statusCode === 400 ? 'INVALID_INPUT' : 'BOB_SERVICE_ERROR',
                message: error.message || 'An error occurred processing the IBM Bob query.'
              }
            });
          }
        }

        // Route Not Found
        return sendJsonResponse(res, 404, {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: `Endpoint ${url.pathname} not found.`
          }
        });
      });

      return;
    }

    return sendJsonResponse(res, 404, {
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: `Endpoint ${url.pathname} not found.`
      }
    });
  });
}

const server = createServer();

if (process.env.NODE_ENV !== 'test' && import.meta.url === `file:///${process.argv[1]?.replace(/\\/g, '/')}`) {
  server.listen(PORT, () => {
    console.log(`[SupplyGuard AI] Backend API server listening on port ${PORT}`);
  });
}

export default server;
