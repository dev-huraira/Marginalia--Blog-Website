const API_BASE = '/api';

const getHeaders = () => {
  const token = localStorage.getItem('marginalia_token');
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }
  return data;
};

export const api = {
  auth: {
    login: async (email, password) => {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ email, password }),
      });
      return handleResponse(res);
    },
    register: async (name, email, password) => {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ name, email, password }),
      });
      return handleResponse(res);
    },
    getMe: async () => {
      const res = await fetch(`${API_BASE}/auth/me`, {
        method: 'GET',
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
  },
  posts: {
    getAll: async () => {
      const res = await fetch(`${API_BASE}/posts`, {
        method: 'GET',
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
    getMyPosts: async () => {
      const res = await fetch(`${API_BASE}/posts/my-posts`, {
        method: 'GET',
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
    getById: async (id) => {
      const res = await fetch(`${API_BASE}/posts/${id}`, {
        method: 'GET',
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
    create: async (postData) => {
      const res = await fetch(`${API_BASE}/posts`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(postData),
      });
      return handleResponse(res);
    },
    update: async (id, postData) => {
      const res = await fetch(`${API_BASE}/posts/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(postData),
      });
      return handleResponse(res);
    },
    delete: async (id) => {
      const res = await fetch(`${API_BASE}/posts/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
  },
};
