//
// PUBLIC_INTERFACE
// Simple API client for the Insurance Management frontend.
// Resolves base URL from REACT_APP_API_BASE or REACT_APP_BACKEND_URL and falls back to https://<host>:3001/api
//

/**
 * Resolve API base URL:
 * - Prefer REACT_APP_API_BASE
 * - Fallback to REACT_APP_BACKEND_URL
 * - Default to https://<host>:3001/api
 */
const resolveBaseUrl = () => {
  const fromEnv =
    process.env.REACT_APP_API_BASE ||
    process.env.REACT_APP_BACKEND_URL ||
    '';

  if (fromEnv) {
    // Ensure no trailing slash
    return fromEnv.replace(/\/+$/, '');
  }

  const loc = typeof window !== 'undefined' ? window.location : { hostname: 'localhost' };
  return `https://${loc.hostname}:3001/api`;
};

const BASE_URL = resolveBaseUrl();

// PUBLIC_INTERFACE
export async function apiRequest(path, { method = 'GET', body, headers = {}, query } = {}) {
  /**
   * Perform a JSON API request with standardized error handling.
   * - path: string path like '/customers'
   * - method: HTTP method
   * - body: object for JSON body (auto-stringified)
   * - headers: additional headers
   * - query: object for query params
   */
  const url = new URL(`${BASE_URL}${path}`);
  if (query && typeof query === 'object') {
    Object.entries(query).forEach(([k, v]) => {
      if (v !== undefined && v !== null) url.searchParams.append(k, String(v));
    });
  }

  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...headers,
    },
  };

  if (body !== undefined) {
    options.body = typeof body === 'string' ? body : JSON.stringify(body);
  }

  let res;
  try {
    res = await fetch(url.toString(), options);
  } catch (err) {
    const error = new Error('Network error when calling API');
    error.cause = err;
    throw error;
  }

  const contentType = res.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const payload = isJson ? await res.json().catch(() => ({})) : await res.text();

  if (!res.ok) {
    const error = new Error(
      (payload && payload.detail) ||
        (payload && payload.message) ||
        `API error: ${res.status}`
    );
    error.status = res.status;
    error.payload = payload;
    throw error;
  }
  return payload;
}

// PUBLIC_INTERFACE
export function getHealthPath() {
  /**
   * Returns the healthcheck path to call, defaults to '/api/health' if not set.
   */
  return process.env.REACT_APP_HEALTHCHECK_PATH || '/api/health';
}

// Convenience typed clients

// PUBLIC_INTERFACE
export const CustomersAPI = {
  list: (params) => apiRequest('/customers/', { query: params }),
  retrieve: (id) => apiRequest(`/customers/${id}/`),
  create: (data) => apiRequest('/customers/', { method: 'POST', body: data }),
  update: (id, data) => apiRequest(`/customers/${id}/`, { method: 'PUT', body: data }),
  patch: (id, data) => apiRequest(`/customers/${id}/`, { method: 'PATCH', body: data }),
  delete: (id) => apiRequest(`/customers/${id}/`, { method: 'DELETE' }),
};

// PUBLIC_INTERFACE
export const PoliciesAPI = {
  list: (params) => apiRequest('/policies/', { query: params }),
  retrieve: (id) => apiRequest(`/policies/${id}/`),
  create: (data) => apiRequest('/policies/', { method: 'POST', body: data }),
  update: (id, data) => apiRequest(`/policies/${id}/`, { method: 'PUT', body: data }),
  patch: (id, data) => apiRequest(`/policies/${id}/`, { method: 'PATCH', body: data }),
  delete: (id) => apiRequest(`/policies/${id}/`, { method: 'DELETE' }),
};

// PUBLIC_INTERFACE
export const ClaimsAPI = {
  list: (params) => apiRequest('/claims/', { query: params }),
  retrieve: (id) => apiRequest(`/claims/${id}/`),
  create: (data) => apiRequest('/claims/', { method: 'POST', body: data }),
  update: (id, data) => apiRequest(`/claims/${id}/`, { method: 'PUT', body: data }),
  patch: (id, data) => apiRequest(`/claims/${id}/`, { method: 'PATCH', body: data }),
  delete: (id) => apiRequest(`/claims/${id}/`, { method: 'DELETE' }),
};
