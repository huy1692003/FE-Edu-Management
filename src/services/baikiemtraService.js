import apiClient from '@/constants/api';

export const baikiemtraService = {
  getAll: async () => {
    const response = await apiClient.get('/api/baikiemtra');
    return response.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(`/api/baikiemtra/${id}`);
    return response.data;
  },

  getByGiangVienId: async (id) => {
    const response = await apiClient.get(`/api/baikiemtra/giangvien/${id}`);
    return response.data;
  },

  getByMaBKT: async (maBKT) => {
    const response = await apiClient.get(`/api/baikiemtra/search/${maBKT}`);
    return response.data;
  },

  create: async (baikiemtra) => {
    const response = await apiClient.post('/api/baikiemtra', baikiemtra);
    return response.data;
  },

  update: async (id, baikiemtra) => {
    const response = await apiClient.put(`/api/baikiemtra/${id}`, baikiemtra);
    return response.data;
  },

  delete: async (id) => {
    const response = await apiClient.delete(`/api/baikiemtra/${id}`);
    return response.data;
  }
};

export default baikiemtraService;
