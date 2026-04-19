const API_BASE = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/api` 
  : '/api';

async function fetchAPI(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const contentType = response.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');
    const data = isJson ? await response.json() : null;

    if (!response.ok) {
      const message = data?.message || `API request failed (${response.status})`;
      throw new Error(message);
    }

    return data ?? { ok: true };
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
}

const TOKEN_KEY = 'rb_auth_token';

export const authToken = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

export const api = {
  getListings: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchAPI(`/listings${query ? `?${query}` : ''}`);
  },

  getListingById: (id) => fetchAPI(`/listings/${id}`),

  createListing: (data) => fetchAPI('/listings', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  updateListing: (id, data) => fetchAPI(`/listings/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  claimListing: (id, userId) => fetchAPI(`/listings/${id}/claim`, {
    method: 'POST',
    body: JSON.stringify({ userId }),
  }),

  deleteListing: (id) => fetchAPI(`/listings/${id}`, {
    method: 'DELETE',
  }),

  getUsers: () => fetchAPI('/users'),

  getUserById: (id) => fetchAPI(`/users/${id}`),

  createUser: (data) => fetchAPI('/users', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  getActivities: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchAPI(`/activities${query ? `?${query}` : ''}`);
  },

  createActivity: (data) => fetchAPI('/activities', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  getCurrentUser: () => fetchAPI('/users/'),

  healthCheck: () => fetchAPI('/health'),

  authRequestNonce: (walletAddress) => fetchAPI('/auth/nonce', {
    method: 'POST',
    body: JSON.stringify({ walletAddress }),
  }),

  authVerifySignature: ({ walletAddress, nonce, signature }) => fetchAPI('/auth/verify', {
    method: 'POST',
    body: JSON.stringify({ walletAddress, nonce, signature }),
  }),

  authMe: (token) => fetchAPI('/auth/me', {
    headers: {
      Authorization: `Bearer ${token || authToken.get()}`,
    },
  }),

  authGoogle: (credential) => fetchAPI('/auth/google', {
    method: 'POST',
    body: JSON.stringify({ credential }),
  }),

  authTotpGenerate: (token) => fetchAPI('/auth/totp/generate', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token || authToken.get()}`,
    },
  }),

  authTotpVerify: (tokenAuth, code) => fetchAPI('/auth/totp/verify', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${tokenAuth || authToken.get()}`,
    },
    body: JSON.stringify({ token: code }),
  }),

  getWalletBalance: (token) => fetchAPI('/wallet/balance', {
    headers: {
      Authorization: `Bearer ${token || authToken.get()}`,
    },
  }),

  addWalletFunds: (token, amount) => fetchAPI('/wallet/add', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token || authToken.get()}`,
    },
    body: JSON.stringify({ amount }),
  }),

  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    
    const url = `${API_BASE}/upload`;
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Upload failed');
    }
    return data;
  },
};

export default api;
