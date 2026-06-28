export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

const buildQuery = (params) => {
  if (!params) return '';
  const query = new URLSearchParams(params).toString();
  return query ? `?${query}` : '';
};

const apiFetch = async (url, options = {}) => {
  const { token, method = 'GET', body, params } = options;

  const fullUrl = url + buildQuery(params);

  const res = await fetch(fullUrl, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new ApiError(data?.message || 'API Error', res.status);
  }

  return data;
};

export default apiFetch;