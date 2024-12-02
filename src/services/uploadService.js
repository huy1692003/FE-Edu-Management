import apiClient from "@/constants/api";

const uploadService = {
  // Upload file
  uploadFile: async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await apiClient.post('/api/Upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default uploadService;
