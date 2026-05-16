import api from "./axios";

export const getMyServices = async () => {
  const { data } = await api.get("/services/my");
  return data;
};

export const getAllServices = async (page = 1, limit = 10) => {
  const { data } = await api.get(`/services?page=${page}&limit=${limit}`);
  return data;
};

export const createService = async (serviceData) => {
  const { data } = await api.post("/services", serviceData);
  return data;
};

export const updateService = async (serviceId, serviceData) => {
  const { data } = await api.put(`/services/${serviceId}`, serviceData);
  return data;
};

export const deleteService = async (serviceId) => {
  const { data } = await api.delete(`/services/${serviceId}`);
  return data;
};

export const addUserNote = async (serviceId, note) => {
  const { data } = await api.put(`/services/${serviceId}/note`, { note });
  return data;
};

export const getServicesByPublicId = async (publicId) => {
  const { data } = await api.get(`/services/user/${publicId}`);
  return data;
};
