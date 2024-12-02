import apiClient from "@/constants/api";

const taikhoanService = {
  // Get all tài khoản
  getAllTaiKhoan: async () => {
    try {
      const response = await apiClient.get('/api/TaiKhoan');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get tài khoản by id
  getTaiKhoanById: async (id) => {
    try {
      const response = await apiClient.get(`/api/TaiKhoan/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Login
  login: async (loginData) => {
    try {
      const response = await apiClient.post('/api/TaiKhoan/login', loginData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create new tài khoản
  createTaiKhoan: async (taikhoanData) => {
    try {
      const response = await apiClient.post('/api/TaiKhoan', taikhoanData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update tài khoản
  updateTaiKhoan: async (id, taikhoanData) => {
    try {
      const response = await apiClient.put(`/api/TaiKhoan/${id}`, taikhoanData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete tài khoản
  deleteTaiKhoan: async (id) => {
    try {
      const response = await apiClient.delete(`/api/TaiKhoan/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default taikhoanService;
