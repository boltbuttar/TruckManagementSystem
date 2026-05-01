/**
 * API Service - Handles all backend communication
 *
 * Delegates to the centralised client in src/api/client.js so that the base
 * URL and auth-header injection are defined in a single place.
 */

import { apiRequest, getToken } from '../api/client.js'

// Re-export so any code that imported getAuthToken from here still works.
export { getToken as getAuthToken }

// Helper to make API calls — kept for internal use by the named exports below.
const apiCall = async (endpoint, options = {}) => {
  return apiRequest(`/api${endpoint}`, options)
}

// ═════════════════════════════════════════════════════════════════════
// AUTH ENDPOINTS
// ═════════════════════════════════════════════════════════════════════

export const auth = {
  register: (formData) =>
    apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify(formData),
    }),

  login: (email, password, role = 'driver') =>
    apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, role }),
    }),

  adminLogin: (email, password) =>
    apiCall('/auth/admin-login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  logout: () =>
    apiCall('/auth/logout', { method: 'POST' }).catch(() => {
      // Swallow errors — the token is cleared client-side regardless.
    }),
}

// ═════════════════════════════════════════════════════════════════════
// DRIVER ENDPOINTS
// ═════════════════════════════════════════════════════════════════════

export const drivers = {
  getAll: (filters = {}) => {
    const query = new URLSearchParams(filters).toString()
    return apiCall(`/drivers${query ? '?' + query : ''}`)
  },

  getById: (id) =>
    apiCall(`/drivers/${id}`),

  create: (formData) =>
    apiCall('/drivers', {
      method: 'POST',
      body: JSON.stringify(formData),
    }),

  update: (id, formData) =>
    apiCall(`/drivers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(formData),
    }),

  delete: (id) =>
    apiCall(`/drivers/${id}`, {
      method: 'DELETE',
    }),

  getAvailable: () =>
    apiCall('/drivers/available'),

  updateAvailability: (id, available) =>
    apiCall(`/drivers/${id}/availability`, {
      method: 'PATCH',
      body: JSON.stringify({ available }),
    }),
}

// ═════════════════════════════════════════════════════════════════════
// LOAD ENDPOINTS
// ═════════════════════════════════════════════════════════════════════

export const loads = {
  getAll: (filters = {}) => {
    const query = new URLSearchParams(filters).toString()
    return apiCall(`/loads${query ? '?' + query : ''}`)
  },

  getById: (id) =>
    apiCall(`/loads/${id}`),

  create: (formData) =>
    apiCall('/loads', {
      method: 'POST',
      body: JSON.stringify(formData),
    }),

  update: (id, formData) =>
    apiCall(`/loads/${id}`, {
      method: 'PUT',
      body: JSON.stringify(formData),
    }),

  delete: (id) =>
    apiCall(`/loads/${id}`, {
      method: 'DELETE',
    }),

  assignDriver: (id, driverId) =>
    apiCall(`/loads/${id}/assign`, {
      method: 'POST',
      body: JSON.stringify({ driverId }),
    }),

  updateStatus: (id, status) =>
    apiCall(`/loads/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  getByDriver: (driverId) =>
    apiCall(`/loads/driver/${driverId}`),
}

// ═════════════════════════════════════════════════════════════════════
// QUOTE ENDPOINTS
// ═════════════════════════════════════════════════════════════════════

export const quotes = {
  calculate: (formData) =>
    apiCall('/quotes/calculate', {
      method: 'POST',
      body: JSON.stringify(formData),
    }),

  submit: (formData) =>
    apiCall('/quotes', {
      method: 'POST',
      body: JSON.stringify(formData),
    }),

  getAll: (filters = {}) => {
    const query = new URLSearchParams(filters).toString()
    return apiCall(`/quotes${query ? '?' + query : ''}`)
  },

  getById: (id) =>
    apiCall(`/quotes/${id}`),

  respond: (id, status, response = '') =>
    apiCall(`/quotes/${id}/respond`, {
      method: 'POST',
      body: JSON.stringify({ status, response }),
    }),
}

// ═════════════════════════════════════════════════════════════════════
// REQUEST ENDPOINTS
// ═════════════════════════════════════════════════════════════════════

export const requests = {
  getAll: (filters = {}) => {
    const query = new URLSearchParams(filters).toString()
    return apiCall(`/requests${query ? '?' + query : ''}`)
  },

  getById: (id) =>
    apiCall(`/requests/${id}`),

  updateStatus: (id, status) =>
    apiCall(`/requests/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  sendQuote: (id, amount) =>
    apiCall(`/requests/${id}/quote`, {
      method: 'POST',
      body: JSON.stringify({ amount }),
    }),
}

// ═════════════════════════════════════════════════════════════════════
// DISPATCH ENDPOINTS
// ═════════════════════════════════════════════════════════════════════

export const dispatch = {
  getAll: () =>
    apiCall('/dispatch'),

  getById: (id) =>
    apiCall(`/dispatch/${id}`),

  updateStep: (id, step) =>
    apiCall(`/dispatch/${id}/step`, {
      method: 'PATCH',
      body: JSON.stringify({ step }),
    }),

  getStatusHistory: (id) =>
    apiCall(`/dispatch/${id}/history`),
}

// ═════════════════════════════════════════════════════════════════════
// ANALYTICS ENDPOINTS
// ═════════════════════════════════════════════════════════════════════

export const analytics = {
  getDashboard: () =>
    apiCall('/analytics/dashboard'),

  getDriverStats: (driverId) =>
    apiCall(`/analytics/drivers/${driverId}`),

  getLoadStats: () =>
    apiCall('/analytics/loads'),

  getRevenueData: () =>
    apiCall('/analytics/revenue'),
}
