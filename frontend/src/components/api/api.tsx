// Base API URL for frontend requests.
// Set VITE_API_BASE_URL in .env.production on deploy (e.g. https://api.domain.com).
export const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';