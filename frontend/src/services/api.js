/**
 * API Service - Handles all backend communication
 * Base URL: http://localhost:5000/api (or your backend URL)
 */

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Helper to get auth token from localStorage
const getAuthToken = () => {
  try {
    const user = JSON.parse(localStorage.getItem('tdms_user'))
    return user?.token || null
  } catch {
    return null
  }
}

// Helper to make API calls
const apiCall = async (endpoint, options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  const token = getAuthToken()
  if (token) headers.Authorization = `Bearer ${token}`

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    })

    const data = await response.json()

    if (!response.ok) {
      throw {
        status: response.status,
        message: data.message || 'An error occurred',
        errors: data.errors || {},
      }
    }

    return data
  } catch (error) {
    if (error instanceof TypeError) {
      throw { status: 0, message: 'Network error - Backend not reachable' }
    }
    throw error
  }
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

  logout: () => {
    localStorage.removeItem('tdms_user')
    return Promise.resolve()
  },
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
