import apiClient from '@/constants/api';

export const baihocService = {
  // Get all bai hoc
  getAll: async () => {
    const response = await apiClient.get('/api/BaiHoc');
    return response.data;
  },

  // Get bai hoc by id
  getById: async (id) => {
    const response = await apiClient.get(`/api/BaiHoc/${id}`);
    return response.data;
  },

  // Get bai hoc by khoa hoc id
  getByKhoaHocId: async (khoaHocId) => {
    const response = await apiClient.get(`/api/BaiHoc/khoahoc/${khoaHocId}`);
    return response.data;
  },

  // Create new bai hoc
  create: async (baihoc) => {
    const response = await apiClient.post('/api/BaiHoc', baihoc);
    return response.data;
  },

  // Update bai hoc
  update: async (id, baihoc) => {
    const response = await apiClient.put(`/api/BaiHoc/${id}`, baihoc);
    return response.data;
  },

  // Delete bai hoc
  delete: async (id) => {
    const response = await apiClient.delete(`/api/BaiHoc/${id}`);
    return response.data;
  }
};

export default baihocService;
