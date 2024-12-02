import apiClient from '@/constants/api';

export const ketquakiemtraService = {
  getAll: async () => {
    const response = await apiClient.get('/api/ketquakiemtra');
    return response.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(`/api/ketquakiemtra/${id}`);
    return response.data;
  },

  create: async (ketquakiemtra) => {
    const response = await apiClient.post('/api/ketquakiemtra', ketquakiemtra);
    return response.data;
  },

  delete: async (id) => {
    const response = await apiClient.delete(`/api/ketquakiemtra/${id}`);
    return response.data;
  }
};

export default ketquakiemtraService;
