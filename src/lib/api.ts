import axios from "axios";

const api = axios.create({
  baseURL: (import.meta as any).env.VITE_API_URL,
});

// Attach Authorization token if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  config.headers = config.headers ?? {};

  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  return config;
});

export default api;
