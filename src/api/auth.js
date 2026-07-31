import api from "./api"

export const login = (credentials) =>
  api.post("/auth/login", credentials)

export const register = (data) =>
  api.post("/auth/register", data)

export const forgotPassword = (email) =>
  api.post("/auth/forgot-password", { email })

export const resetPassword = (token, newPassword) =>
  api.post("/auth/reset-password", { token, new_password: newPassword })

export const getMe = () =>
  api.get("/users/me")

// Only name and phone are editable; email is the login and role is set
// server-side, so neither is accepted here.
export const updateMe = (data) =>
  api.patch("/users/me", data)
