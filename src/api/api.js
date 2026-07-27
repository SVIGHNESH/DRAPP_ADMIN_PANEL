import axios from "axios";
import toast from "react-hot-toast";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      toast.error("Network Error");
    } else {
      switch (error.response.status) {
        case 401:
          toast.error("Session Expired");
          break;
        case 403:
          toast.error("Access Denied");
          break;
        case 404:
          toast.error("Resource Not Found");
          break;
        case 500:
          toast.error("Server Error");
          break;
        default:
          toast.error(
            error.response.data?.message || "Something went wrong"
          );
      }
    }

    return Promise.reject(error);
  }
);

export default api;