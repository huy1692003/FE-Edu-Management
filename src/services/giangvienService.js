import apiClient from "@/constants/api";


const giangvienService = {
  // Get all giảng viên
  getAllGiangVien: async () => {
    try {
      const response = await apiClient.get('/api/GiangVien');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get giảng viên by id 
  getGiangVienById: async (id) => {
    try {
      const response = await apiClient.get(`/api/GiangVien/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create new giảng viên
  createGiangVien: async (giangvienData) => {
    try {
        const response = await apiClient.post('/api/GiangVien', giangvienData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update giảng viên
  updateGiangVien: async (id, giangvienData) => {
    try {
      const response = await apiClient.put(`/api/GiangVien/${id}`, giangvienData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete giảng viên
  deleteGiangVien: async (id) => {
    try {
      const response = await apiClient.delete(`/api/GiangVien/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default giangvienService;

