import axios from "axios";

/**
 * Axios instance configured for API requests
 * - Base URL points to backend API
 * - withCredentials ensures cookies (e.g. auth tokens) are sent with requests
 */
const API = axios.create({
  baseURL: `https://recipe-backend-p66d.onrender.com/api/v1`,
  withCredentials: true,
});

/**
 * Response interceptor to handle:
 * - Automatically refreshing access tokens on 401 errors
 * - Retrying the original request after a successful token refresh
 */
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refresh-token")
    ) {
      originalRequest._retry = true;
      try {
        await API.post("/auth/refresh-token");
        return API(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token failed", refreshError);
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

export default API;
