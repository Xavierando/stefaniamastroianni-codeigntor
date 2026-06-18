const API_BASE_URL = '/api';

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
  
  const headers = new Headers(options.headers || {});

  // Attach the admin auth token automatically when present. Harmless on public
  // endpoints (the backend ignores it there); required on protected ones.
  const token = typeof localStorage !== 'undefined' ? localStorage.getItem('adminToken') : null;
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

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

  // Session expired / invalid or missing token on a protected route: drop the
  // stale token and bounce back to the login screen (only when inside /admin).
  if (response.status === 401) {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('adminToken');
    }
    if (
      typeof window !== 'undefined' &&
      window.location.pathname.startsWith('/admin') &&
      !window.location.pathname.startsWith('/admin/login')
    ) {
      window.location.href = '/admin/login';
    }
    throw new Error('Sessione scaduta. Effettua di nuovo il login.');
  }

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
