import api from "../lib/api";

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
  const response = await api.post<LoginResponse>("/api/auth/login/", data);

  localStorage.setItem("access", response.data.access);
  localStorage.setItem("refresh", response.data.refresh);

  return response.data;
}

// Refresh Token
export async function refreshToken() {
  const refresh = localStorage.getItem("refresh");
  if (!refresh) return null;

  const response = await api.post<{ access: string }>(
    "/api/auth/token/refresh/",
    { refresh }
  );

  localStorage.setItem("access", response.data.access);
  return response.data;
}

// Get Current User
export async function getCurrentUser() {
  const response = await api.get<ProfileResponse>("/api/auth/profile/");
  return response.data;
}

// Logout
export function logoutUser() {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
}
