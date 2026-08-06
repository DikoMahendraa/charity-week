import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

// ─── Axios instance ───────────────────────────────────────────────────────────
// Base URL is read from .env.local (NEXT_PUBLIC_API_URL).
// When the API is ready, set that variable and remove the fallback.

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api",
  timeout: 15_000,
  headers: { "Content-Type": "application/json" },
});

// ─── Request interceptor ──────────────────────────────────────────────────────
// Attaches the Bearer token stored by the auth Zustand store.
// The import is lazy (inside the interceptor) to avoid circular deps
// and because localStorage is unavailable during SSR.

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (typeof window !== "undefined") {
    const raw = localStorage.getItem("iruk-auth");
    const token: string | null = raw ? (JSON.parse(raw)?.state?.token ?? null) : null;
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Response interceptor ─────────────────────────────────────────────────────
// • 401 → clear auth and redirect to /login
// • Any other error → bubble up so TanStack Query can handle it

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("iruk-auth");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// ─── Typed GET / POST / PUT / PATCH / DELETE helpers ─────────────────────────

export const api = {
  get:    <T>(url: string, params?: object) =>
    apiClient.get<T>(url, { params }).then((r) => r.data),

  post:   <T>(url: string, data?: object) =>
    apiClient.post<T>(url, data).then((r) => r.data),

  put:    <T>(url: string, data?: object) =>
    apiClient.put<T>(url, data).then((r) => r.data),

  patch:  <T>(url: string, data?: object) =>
    apiClient.patch<T>(url, data).then((r) => r.data),

  delete: <T>(url: string) =>
    apiClient.delete<T>(url).then((r) => r.data),
};
