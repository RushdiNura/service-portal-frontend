import api from "./axios";

export const getStats = async () => {
  const { data } = await api.get("/admin/stats");
  return data;
};

export const getUsers = async (page = 1, limit = 10) => {
  const { data } = await api.get(`/admin/users?page=${page}&limit=${limit}`);
  return data;
};

export const createUser = async (userData) => {
  const { data } = await api.post("/admin/users", userData);
  return data;
};

export const deleteUser = async (userId) => {
  const { data } = await api.delete(`/admin/users/${userId}`);
  return data;
};

export const searchUsers = async (query) => {
  const { data } = await api.get(`/admin/users/search?query=${query}`);
  return data;
};
