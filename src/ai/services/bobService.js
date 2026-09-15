/**
 * SupplyGuard AI — Module C: AI + IBM Bob
 * bobService.js
 *
 * Service wrapper executing conversational decision-support queries for POST /api/bob/query and POST /api/bob/ask.
 * Supports both REAL IBM BOB Inference mode (via Bob Shell 2.0.3) and LOCAL GROUNDED FALLBACK mode.
 */

import { processBobQuery } from '../bob/bobAdapter.js';
import { callRealIbmBobApi } from '../bob/bobClient.js';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const mockDataPath = join(__dirname, '../mock/mockData.json');
const mockData = JSON.parse(readFileSync(mockDataPath, 'utf8'));

/**
 * Attempts to load backend operational data store if available.
 */
async function loadOperationalStore() {
  try {
    const backendSampleData = await import('../../backend/mock/sampleData.js');
    return {
      shipments: backendSampleData.shipments || mockData.shipments,
      disruptions: backendSampleData.disruptions || mockData.disruptions,
      routes: backendSampleData.routes || mockData.routes,
      fleetAssets: backendSampleData.fleetAssets || mockData.fleet || [],
      temperatureReadings: backendSampleData.temperatureReadings || mockData.temperatureReadings || [],
      coldChainAlerts: backendSampleData.coldChainAlerts || mockData.aiRecommendations || []
    };
  } catch (err) {
    return mockData;
  }
}

/**
 * Handles conversational queries from dispatchers via IBM Bob interface.
 *
 * @param {Object} params
 * @param {string} params.prompt - User query prompt
 * @param {string} [params.userId] - Optional user identifier
 * @param {Object} [params.customContext] - Optional custom data context
 * @returns {Promise<Object>} Response payload with natural language text, structured context, and mode indicator
 */
export async function executeBobQuery({ prompt, userId, customContext } = {}) {
  if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
    const error = new Error('Prompt string is required.');
    error.statusCode = 400;
    throw error;
  }

  const defaultStore = await loadOperationalStore();
  const dataContext = customContext || defaultStore;

  // Compute structured operational context from deterministic engines for action buttons
  const localResult = processBobQuery({ prompt, dataContext });

  const apiKey = process.env.BOB_API_KEY;

  // Check if BOB_API_KEY is configured in backend environment
  if (apiKey && apiKey.trim().length > 0) {
    try {
      const realResult = await callRealIbmBobApi({ prompt, dataContext });

      if (realResult.success && realResult.response) {
        return {
          response: realResult.response,
          structuredContext: localResult.structuredContext,
          mode: 'REAL_IBM_BOB',
          isRealIbmBob: true,
          executableUsed: realResult.executableUsed,
          userId: userId || 'usr_dispatcher',
          timestamp: new Date().toISOString()
        };
      } else {
        console.warn(`[IBM Bob Service] Real IBM Bob execution failed (${realResult.error}). Using LOCAL_GROUNDED_FALLBACK.`);
        return {
          response: localResult.response,
          structuredContext: localResult.structuredContext,
          mode: 'LOCAL_GROUNDED_FALLBACK',
          isRealIbmBob: false,
          fallbackReason: realResult.error || 'Real IBM Bob process execution failed',
          userId: userId || 'usr_dispatcher',
          timestamp: new Date().toISOString()
        };
      }
    } catch (err) {
      console.warn(`[IBM Bob Service] Exception during Real IBM Bob execution: ${err.message}. Using LOCAL_GROUNDED_FALLBACK.`);
    }
  }

  // Fallback when BOB_API_KEY is not configured or execution fails
  return {
    response: localResult.response,
    structuredContext: localResult.structuredContext,
    mode: 'LOCAL_GROUNDED_FALLBACK',
    isRealIbmBob: false,
    userId: userId || 'usr_dispatcher',
    timestamp: new Date().toISOString()
  };
}
