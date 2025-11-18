import api from "../lib/api";

// In-memory fallback for environments without localStorage (tests, SSR)
const memoryStore: { access?: string | null; refresh?: string | null } = {};

function setStorageItem(key: 'access' | 'refresh', value: string) {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.setItem(key, value);
      return;
    } catch (err) {
      // fall through to memory store
    }
  }
  memoryStore[key] = value;
}

function getStorageItem(key: 'access' | 'refresh') {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      return window.localStorage.getItem(key);
    } catch (err) {
      // fall back
    }
  }
  return memoryStore[key] ?? null;
}

function removeStorageItem(key: 'access' | 'refresh') {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.removeItem(key);
      return;
    } catch (err) {
      // fall through
    }
  }
  delete memoryStore[key];
}

// Types ----------------------------------------------------
export interface RegisterResponse {
  id: number;
  username: string;
  email: string;
  role: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
}

export interface ProfileResponse {
  id: number;
  username: string;
  email: string;
  role: string;
}

// -----------------------------------------------------------

// Register User
export async function registerUser(data: {
  username: string;
  email: string;
  password: string;
  role?: string;
}) {
  const response = await api.post<RegisterResponse>("/api/auth/register/", data);
  return response.data;
}

// Login User
export async function loginUser(data: { email: string; password: string }) {
  try {
    const response = await api.post<LoginResponse>("/api/auth/login/", data);

    setStorageItem('access', response.data.access);
    setStorageItem('refresh', response.data.refresh);

    return response.data;
  } catch (err: any) {
    // Normalize error message
    const message = err?.response?.data?.detail || err?.message || 'Login failed';
    throw new Error(message);
  }
}

// Refresh Token
export async function refreshToken() {
  const refresh = getStorageItem('refresh');
  if (!refresh) return null;

  try {
    const response = await api.post<{ access: string }>(
      "/api/auth/token/refresh/",
      { refresh }
    );

    setStorageItem('access', response.data.access);
    return response.data;
  } catch (err) {
    // refresh failed, clear tokens
    removeStorageItem('access');
    removeStorageItem('refresh');
    return null;
  }
}

// Get Current User
export async function getCurrentUser() {
  try {
    const response = await api.get<ProfileResponse>("/api/auth/profile/");
    return response.data;
  } catch (err: any) {
    const message = err?.response?.data?.detail || err?.message || 'Failed to fetch profile';
    throw new Error(message);
  }
}

// Logout
export function logoutUser() {
  removeStorageItem('access');
  removeStorageItem('refresh');
}
