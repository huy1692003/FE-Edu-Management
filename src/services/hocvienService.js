import apiClient from "@/constants/api";

const hocvienService = {
  // Get all học viên
  getAllHocVien: async () => {
    try {
      const response = await apiClient.get('/api/HocVien');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get học viên by id
  getHocVienById: async (id) => {
    try {
      const response = await apiClient.get(`/api/HocVien/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get học viên by khóa học id
  getHocViensByKhoaHoc: async (khoahocId) => {
    try {
      const response = await apiClient.get(`/api/HocVien/khoahoc/${khoahocId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get học viên by giảng viên id
  getHocViensByGiangVien: async (giangvienId) => {
    try {
      const response = await apiClient.get(`/api/HocVien/giangvien/${giangvienId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get kết quả học tập của học viên
  getKetQuaHocTap: async (id) => {
    try {
      const response = await apiClient.get(`/api/HocVien/ketqua/${id}`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create new học viên
  createHocVien: async (hocvienData) => {
    try {
      const response = await apiClient.post('/api/HocVien', hocvienData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update học viên
  updateHocVien: async (id, hocvienData) => {
    try {
      const response = await apiClient.put(`/api/HocVien/${id}`, hocvienData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete học viên
  deleteHocVien: async (id) => {
    try {
      const response = await apiClient.delete(`/api/HocVien/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default hocvienService;
