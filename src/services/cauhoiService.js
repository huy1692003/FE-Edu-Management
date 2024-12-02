import apiClient from '@/constants/api';

export const cauhoiService = {
  // Get all cau hoi
  getAll: async () => {
    const response = await apiClient.get('/api/cauhoi');
    return response.data;
  },

  // Get cau hoi by id 
  getById: async (id) => {
    const response = await apiClient.get(`/api/cauhoi/${id}`);
    return response.data;
  },

  // Get cau hoi by bai kiem tra id
  getByBaiKiemTraId: async (id) => {
    const response = await apiClient.get(`/api/cauhoi/baikiemtra/${id}`);
    return response.data;
  },

  // Create new cau hoi
  create: async (cauhoi) => {
    const response = await apiClient.post('/api/cauhoi', cauhoi);
    return response.data;
  },

  // Update cau hoi
  update: async (id, cauhoi) => {
    const response = await apiClient.put(`/api/cauhoi/${id}`, cauhoi);
    return response.data;
  },

  // Delete cau hoi
  delete: async (id) => {
    const response = await apiClient.delete(`/api/cauhoi/${id}`);
    return response.data;
  }
};

export default cauhoiService;
