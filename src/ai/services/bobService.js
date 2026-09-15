/**
 * SupplyGuard AI — Module C: AI + IBM Bob
 * bobService.js
 *
 * Service wrapper executing conversational decision-support queries for POST /api/bob/query.
 */

import { processBobQuery } from '../bob/bobAdapter.js';
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
 * @returns {Object} Response payload with natural language text and structured context
 */
export async function executeBobQuery({ prompt, userId, customContext } = {}) {
  if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
    const error = new Error('Prompt string is required.');
    error.statusCode = 400;
    throw error;
  }

  const defaultStore = await loadOperationalStore();
  const dataContext = customContext || defaultStore;
  const result = processBobQuery({ prompt, dataContext });

  return {
    response: result.response,
    structuredContext: result.structuredContext,
    userId: userId || 'usr_dispatcher',
    timestamp: new Date().toISOString()
  };
}
