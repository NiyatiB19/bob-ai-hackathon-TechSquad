/**
 * SupplyGuard AI — Authentication Service
 * Module A (Member 1 - Frontend)
 * 
 * Provides clean auth abstraction with backend REST endpoint support
 * and fallback mock authentication for offline frontend development.
 */

import { API_BASE_URL } from './apiConfig';

const TOKEN_KEY = 'supplyguard_auth_token';
const USER_KEY = 'supplyguard_user';

export const authService = {
  /**
   * Log in user using email and password.
   * Falls back to mock demo auth if backend API is unreachable.
   */
  async login({ email, password, rememberMe }) {
    try {
      // Attempt backend authentication
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        const data = await response.json();
        this.saveSession(data.token, data.user, rememberMe);
        return { success: true, user: data.user, isMock: false };
      }
    } catch (err) {
      console.warn('[SupplyGuard Auth] Backend API unavailable. Operating in Mock/Demo mode.', err);
    }

    // Fallback Mock Authentication for Frontend Demo
    if (email && password && password.length >= 6) {
      const mockUser = {
        id: 'usr_demo_9921',
        name: 'Supply Chain Operator',
        email: email,
        role: 'Logistics Manager',
        avatar: '/assets/supplyguard-logo.png'
      };
      const mockToken = 'mock_jwt_token_' + Date.now();

      this.saveSession(mockToken, mockUser, rememberMe);
      return { success: true, user: mockUser, isMock: true };
    }

    throw new Error('Invalid credentials. Password must be at least 6 characters.');
  },

  /**
   * Register new user account.
   * Falls back to mock registration if backend API is unreachable.
   */
  async register({ name, email, organization, password }) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, organization, password })
      });

      if (response.ok) {
        const data = await response.json();
        return { success: true, user: data.user, isMock: false };
      }
    } catch (err) {
      console.warn('[SupplyGuard Auth] Backend API unavailable. Operating in Mock Registration mode.', err);
    }

    // Fallback Mock Registration for Frontend Demo
    if (name && email && password && password.length >= 6) {
      const mockUser = {
        id: 'usr_registered_' + Date.now(),
        name,
        email,
        organization: organization || 'N/A'
      };
      return { success: true, user: mockUser, isMock: true };
    }

    throw new Error('Registration failed. Please verify your details.');
  },

  saveSession(token, user, rememberMe) {
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem(TOKEN_KEY, token);
    storage.setItem(USER_KEY, JSON.stringify(user));
  },

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
  },

  getCurrentUser() {
    const user = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  },

  getToken() {
    return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
  },

  isAuthenticated() {
    return !!this.getToken();
  }
};
