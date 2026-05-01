/**
 * API Client — centralised HTTP layer for all backend communication.
 *
 * Base URL is read from the VITE_API_URL environment variable, which must be
 * set to the backend origin (e.g. https://truckmanagementsystem-production.up.railway.app).
 * Falls back to localhost for local development when the variable is absent.
 */

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

// ---------------------------------------------------------------------------
// Token helpers
// ---------------------------------------------------------------------------

/** Read the JWT stored by AuthContext. */
export const getToken = () => {
  try {
    const stored = localStorage.getItem('tdms_user')
    return stored ? JSON.parse(stored)?.token ?? null : null
  } catch {
    return null
  }
}

// ---------------------------------------------------------------------------
// Core fetch wrapper
// ---------------------------------------------------------------------------

/**
 * Make an authenticated JSON request to the backend.
 *
 * @param {string} path      - Path relative to BASE_URL, e.g. "/api/auth/login"
 * @param {RequestInit} opts - Standard fetch options (method, body, headers…)
 * @returns {Promise<any>}   - Parsed JSON response body
 * @throws {{ status: number, message: string, errors?: object }}
 */
export const apiRequest = async (path, opts = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...opts.headers,
  }

  const token = getToken()
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  let response
  try {
    response = await fetch(`${BASE_URL}${path}`, { ...opts, headers })
  } catch {
    throw { status: 0, message: 'Network error — backend not reachable' }
  }

  // Handle responses with no body (e.g. 204 No Content)
  const contentType = response.headers.get('content-type') || ''
  const data = contentType.includes('application/json')
    ? await response.json()
    : { message: response.statusText }

  if (!response.ok) {
    throw {
      status: response.status,
      message: data.message || 'An unexpected error occurred',
      errors: data.errors || {},
    }
  }

  return data
}

// ---------------------------------------------------------------------------
// Convenience method shortcuts
// ---------------------------------------------------------------------------

export const get = (path, opts = {}) =>
  apiRequest(path, { ...opts, method: 'GET' })

export const post = (path, body, opts = {}) =>
  apiRequest(path, { ...opts, method: 'POST', body: JSON.stringify(body) })

export const put = (path, body, opts = {}) =>
  apiRequest(path, { ...opts, method: 'PUT', body: JSON.stringify(body) })

export const patch = (path, body, opts = {}) =>
  apiRequest(path, { ...opts, method: 'PATCH', body: JSON.stringify(body) })

export const del = (path, opts = {}) =>
  apiRequest(path, { ...opts, method: 'DELETE' })

export default { get, post, put, patch, del, apiRequest, getToken, BASE_URL }
