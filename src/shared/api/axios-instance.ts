import axios from "axios";

export const BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000/api/v1/student";

// ─── Public client (no auth) ────────────────────────────────────────────────
export const publicApi = axios.create({
    baseURL: BASE_URL,
    headers: {
        Accept: "application/json",
        "Accept-Language": "ar",
        // ngrok requires this header to bypass the browser warning page
        "ngrok-skip-browser-warning": "true",
    },
});

// ─── Private client (auto-attaches Bearer token) ────────────────────────────
export const privateApi = axios.create({
    baseURL: BASE_URL,
    headers: {
        Accept: "application/json",
        "Accept-Language": "ar",
        "ngrok-skip-browser-warning": "true",
    },
});

// Request interceptor — inject token from localStorage
privateApi.interceptors.request.use(
    (config) => {
        if (typeof window !== "undefined") {
            const token = localStorage.getItem("token");
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor — handle 401 globally
privateApi.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            if (typeof window !== "undefined") {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                // redirect preserving locale prefix if present
                const locale = document.documentElement.lang || "ar";
                window.location.href = `/${locale}/auth/login`;
            }
        }
        return Promise.reject(error);
    }
);
