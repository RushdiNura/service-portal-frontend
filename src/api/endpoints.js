import client from "./client";

// Auth
export const login = (email, password) =>
  client.post("/auth/login", { email, password });

export const register = (payload) => client.post("/auth/register", payload);

// Admin — user management
export const getUsers = (params) => client.get("/admin/users", { params });
export const searchUsers = (query) =>
  client.get("/admin/users/search", { params: { query } });
export const createUser = (payload) => client.post("/admin/users", payload);
export const deleteUser = (id) => client.delete(`/admin/users/${id}`);
export const getAdminStats = () => client.get("/admin/stats");

// Services
export const getAllServices = (params) =>
  client.get("/services", { params });
export const getMyServices = () => client.get("/services/my");
export const createService = (payload) => client.post("/services", payload);
export const updateService = (id, payload) =>
  client.put(`/services/${id}`, payload);
export const deleteService = (id) => client.delete(`/services/${id}`);
export const addUserNote = (id, note) =>
  client.put(`/services/${id}/note`, { note });
export const getServicesByUserPublicId = (publicId) =>
  client.get(`/services/user/${publicId}`);

// Super Admin
export const createAdmin = (payload) =>
  client.post("/super-admin/create-admin", payload);
export const getSystemStats = () => client.get("/super-admin/stats");
export const getAllUsersWithDeleted = () =>
  client.get("/super-admin/all-users");
