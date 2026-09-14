/**
 * SupplyGuard AI — Centralized Frontend API Configuration
 * Module A (Member 1)
 */

export const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const API_ENDPOINTS = {
  SHIPMENTS: `${API_BASE_URL}/shipments`,
  DISRUPTIONS: `${API_BASE_URL}/disruptions`,
  ROUTES: `${API_BASE_URL}/routes`,
  ROUTE_RECOMMEND: `${API_BASE_URL}/routes/recommend`,
  FLEET: `${API_BASE_URL}/fleet`,
  FLEET_RECOMMEND: `${API_BASE_URL}/fleet/recommend`,
  COLD_CHAIN: `${API_BASE_URL}/cold-chain`,
  AI_ANALYZE: `${API_BASE_URL}/ai/analyze`,
  BOB_QUERY: `${API_BASE_URL}/bob/query`,
};
