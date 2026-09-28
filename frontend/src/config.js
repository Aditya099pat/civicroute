/**
 * Central runtime configuration for the CivicRoute frontend.
 * The API base URL is read from Vite env (VITE_API_URL) so the same build can
 * point at localhost during development or a deployed backend in production.
 */
export const API_BASE_URL = (
  import.meta.env.VITE_API_URL || 'http://localhost:5000'
).replace(/\/$/, '');

/** Full URL for an /api/* path. */
export const apiUrl = (path = '') => `${API_BASE_URL}/api/${String(path).replace(/^\/+/, '')}`;
