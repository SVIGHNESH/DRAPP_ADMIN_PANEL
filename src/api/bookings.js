import api from "./api"

// Bookings in "pending_payment" (abandoned/unfinished checkouts, and any
// admin-created booking before it is confirmed) are excluded unless asked for.
export const getBookings = (includePending = false) =>
  api.get("/bookings", { params: includePending ? { include_pending: true } : {} })

export const getBooking = (id) => api.get(`/bookings/${id}`)

export const createBooking = (data) => api.post("/bookings", data)

export const confirmBooking = (id, data) =>
  api.patch(`/bookings/${id}/confirm`, data)

export const updateBookingStatus = (id, status) =>
  api.patch(`/bookings/${id}/status`, { status })

export const addBookingNote = (id, message) =>
  api.post(`/bookings/${id}/notes`, { message })
