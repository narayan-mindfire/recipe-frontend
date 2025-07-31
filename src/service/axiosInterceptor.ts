import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1",
  withCredentials: true,
});

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
        console.log("trying to refresh token............");
        await API.post("/auth/refresh-token");
        return API(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token failed", refreshError);
      }
    }
    return Promise.reject(error);
  },
);

export default API;
