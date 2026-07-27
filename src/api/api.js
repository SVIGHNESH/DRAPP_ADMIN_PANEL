import axios from "axios"

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      return Promise.reject(error)
    }

    const status = error.response.status
    const data = error.response.data

    if (status === 401) {
      localStorage.removeItem("token")
      window.dispatchEvent(new CustomEvent("auth:session-expired"))
    } else if (status === 403) {
      if (data && typeof data.detail === "string" && data.detail === "Not authenticated") {
        localStorage.removeItem("token")
        window.dispatchEvent(new CustomEvent("auth:session-expired"))
      }
    }

    return Promise.reject(error)
  }
)

export default api
