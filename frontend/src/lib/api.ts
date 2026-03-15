const API_BASE_URL = import.meta.env.DEV ? 'http://localhost:8081/api' : '/api';

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
  
  const headers = new Headers(options.headers || {});
  
  // If not FormData, default to JSON
  if (!(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
    if (options.body && typeof options.body !== 'string') {
      options.body = JSON.stringify(options.body);
    }
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'API Error');
    }
    return data;
  }

  if (!response.ok) {
    throw new Error('API Error');
  }

  return response.text();
};
