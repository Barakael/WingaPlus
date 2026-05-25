// Base API URL for frontend requests.
// In production fallback to same-origin so requests go to /api/* on the main domain.
export const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';