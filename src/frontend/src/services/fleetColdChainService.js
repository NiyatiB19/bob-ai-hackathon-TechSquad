/**
 * SupplyGuard AI — Fleet & Cold-Chain API Service
 * Module D (Member 4 - Fleet & Cold-Chain)
 */

import { API_ENDPOINTS } from './apiConfig';

/**
 * Fetches all fleet assets with optional filters.
 */
export async function fetchFleetAssets(filters = {}) {
  try {
    const params = new URLSearchParams();
    if (filters.status && filters.status !== 'All') params.append('status', filters.status);
    if (filters.type && filters.type !== 'All') params.append('transportMode', filters.type);

    const url = `${API_ENDPOINTS.FLEET}?${params.toString()}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const body = await res.json();
    return body.data?.assets || [];
  } catch (error) {
    console.warn('Backend API unavailable, returning null for fallback:', error.message);
    return null;
  }
}

/**
 * Fetches fleet utilisation metrics from backend.
 */
export async function fetchFleetUtilisation() {
  try {
    const res = await fetch(`${API_ENDPOINTS.FLEET}/utilisation`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const body = await res.json();
    return body.data;
  } catch (error) {
    console.warn('Backend API unavailable for utilisation:', error.message);
    return null;
  }
}

/**
 * Fetches redeployment recommendation for a shipment.
 */
export async function fetchFleetRedeploymentRecommendation(shipmentId, requiredCapacityKg, refrigeratedRequired) {
  try {
    const res = await fetch(API_ENDPOINTS.FLEET_RECOMMEND, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ shipmentId, requiredCapacityKg, refrigeratedRequired })
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const body = await res.json();
    return body.data;
  } catch (error) {
    console.warn('Backend API unavailable for fleet recommendation:', error.message);
    return null;
  }
}

/**
 * Executes asset redeployment via backend API.
 */
export async function executeAssetRedeployment(shipmentId, fleetAssetId) {
  try {
    const res = await fetch(`${API_ENDPOINTS.FLEET}/redeploy`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ shipmentId, fleetAssetId })
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const body = await res.json();
    return body.data;
  } catch (error) {
    console.warn('Backend API unavailable for redeploy:', error.message);
    return null;
  }
}

/**
 * Fetches cold-chain overview and active alerts.
 */
export async function fetchColdChainOverview() {
  try {
    const res = await fetch(API_ENDPOINTS.COLD_CHAIN);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const body = await res.json();
    return body.data;
  } catch (error) {
    console.warn('Backend API unavailable for cold-chain overview:', error.message);
    return null;
  }
}

/**
 * Fetches telemetry history for a specific shipment.
 */
export async function fetchShipmentTelemetry(shipmentId) {
  try {
    const res = await fetch(`${API_ENDPOINTS.COLD_CHAIN}/${shipmentId}`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const body = await res.json();
    return body.data;
  } catch (error) {
    console.warn('Backend API unavailable for shipment telemetry:', error.message);
    return null;
  }
}

/**
 * Acknowledges a cold-chain alert via backend API.
 */
export async function acknowledgeAlertApi(alertId) {
  try {
    const res = await fetch(`${API_ENDPOINTS.COLD_CHAIN}/acknowledge`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ alertId })
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const body = await res.json();
    return body.data;
  } catch (error) {
    console.warn('Backend API unavailable for alert acknowledgement:', error.message);
    return null;
  }
}
