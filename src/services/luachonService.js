import apiClient from '@/constants/api';

export const luachonService = {
  // Get all lua chon
  getAll: async () => {
    const response = await apiClient.get('/api/luachon');
    return response.data;
  },

  // Get lua chon by id
  getById: async (id) => {
    const response = await apiClient.get(`/api/luachon/${id}`);
    return response.data;
  },

  // Get lua chon by cau hoi id
  getByCauHoiId: async (id) => {
    const response = await apiClient.get(`/api/luachon/cauhoi/${id}`);
    return response.data;
  },

  // Create new lua chon
  create: async (luachon) => {
    const response = await apiClient.post('/api/luachon', luachon);
    return response.data;
  },

  // Update lua chon
  update: async (id, luachon) => {
    const response = await apiClient.put(`/api/luachon/${id}`, luachon);
    return response.data;
  },

  // Delete lua chon
  delete: async (id) => {
    const response = await apiClient.delete(`/api/luachon/${id}`);
    return response.data;
  }
};

export default luachonService;
