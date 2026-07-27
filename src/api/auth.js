import api from "./api";

export const login = (credentials) =>
  api.post("/login", credentials);

export const logout = () => {
  localStorage.removeItem("token");
};