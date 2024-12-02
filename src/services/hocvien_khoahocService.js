import apiClient from "@/constants/api";

export const hocvien_khoahocService = {
    getAll: async () => {
        const response = await apiClient.get('/api/HocVien_KhoaHoc');
        return response.data;
    },

    getById: async (id) => {
        const response = await apiClient.get(`/api/HocVien_KhoaHoc/${id}`);
        return response.data;
    },

    getByHocVienId: async (hocvienId) => {
        const response = await apiClient.get(`/api/HocVien_KhoaHoc/hocvien/${hocvienId}`);
        return response.data;
    },

    create: async (data) => {
        const response = await apiClient.post('/api/HocVien_KhoaHoc', data);
        return response.data;
    },

    update: async (id, data) => {
        const response = await apiClient.put(`/api/HocVien_KhoaHoc/${id}`, data);
        return response.data;
    },

    delete: async (id) => {
        const response = await apiClient.delete(`/api/HocVien_KhoaHoc/${id}`);
        return response.data;
    }
}
