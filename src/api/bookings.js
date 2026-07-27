import api from "./api";

export const getBookings = () => api.get("/bookings");

export const getBooking = (id) => api.get(`/bookings/${id}`);

export const updateBooking = (id, data) =>
  api.put(`/bookings/${id}`, data);

export const deleteBooking = (id) =>
  api.delete(`/bookings/${id}`);