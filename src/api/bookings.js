import api from "./api"

export const getBookings = () => api.get("/bookings")

export const getBooking = (id) => api.get(`/bookings/${id}`)

export const createBooking = (data) => api.post("/bookings", data)

export const confirmBooking = (id, data) =>
  api.patch(`/bookings/${id}/confirm`, data)

export const updateBookingStatus = (id, status) =>
  api.patch(`/bookings/${id}/status`, { status })

export const addBookingNote = (id, message) =>
  api.post(`/bookings/${id}/notes`, { message })
