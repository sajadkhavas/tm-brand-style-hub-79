export const API_BASE_URL = import.meta.env.VITE_API_URL || '';

const withBase = (path: string) => `${API_BASE_URL}${path}`;

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(withBase(path), {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error('API request failed');
  }

  return response.json() as Promise<T>;
}

export const apiClient = {
  get: <T>(path: string) => request<T>(path, { method: 'GET' as HttpMethod }),
  post: <T>(path: string, body?: unknown) => request<T>(path, { method: 'POST' as HttpMethod, body: JSON.stringify(body) }),
  put: <T>(path: string, body?: unknown) => request<T>(path, { method: 'PUT' as HttpMethod, body: JSON.stringify(body) }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' as HttpMethod }),
};
