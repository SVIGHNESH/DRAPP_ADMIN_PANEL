import api from "./api"

// The backend only exposes list (active services only) and create.
// There is no update or delete endpoint for services.
export const getServices = () => api.get("/services")

export const createService = (data) => api.post("/services", data)
