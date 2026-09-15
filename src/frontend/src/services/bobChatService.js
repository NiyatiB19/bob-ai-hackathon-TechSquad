/**
 * SupplyGuard AI — IBM Bob Chat API Service
 * Module C (AI + IBM Bob)
 */

import { API_ENDPOINTS } from './apiConfig';

/**
 * Sends a user query to the IBM Bob backend decision-support API.
 *
 * @param {string} prompt - User conversational query
 * @param {string} [userId='usr_dispatcher'] - Optional user ID
 * @returns {Promise<Object>} Response object containing natural text and structuredContext
 */
export async function sendBobQuery(prompt, userId = 'usr_dispatcher') {
  if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
    throw new Error('Prompt is required.');
  }

  try {
    const res = await fetch(API_ENDPOINTS.BOB_QUERY, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: prompt.trim(), userId })
    });

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      throw new Error(errBody.error?.message || `Backend returned status ${res.status}`);
    }

    const body = await res.json();
    return body.data;
  } catch (error) {
    console.warn('Backend IBM Bob API query failed, using local grounded decision-support fallback:', error.message);
    throw error;
  }
}
