import apiClient from "@/constants/api";

export const tiendohoctapService = {
    getAll: async () => {
        const response = await apiClient.get('/api/tiendohoctap');
        return response.data;
    },

    getById: async (id) => {
        const response = await apiClient.get(`/api/tiendohoctap/${id}`);
        return response.data;
    },

    getByKhoaHocAndHocVien: async (khoaHocId, hocVienId) => {
        const response = await apiClient.get(`/api/tiendohoctap/khoahoc/${khoaHocId}/hocvien/${hocVienId}`);
        return response.data;
    },

    create: async (data) => {
        const response = await apiClient.post('/api/tiendohoctap', data);
        return response.data;
    },

    update: async (id, data) => {
        const response = await apiClient.put(`/api/tiendohoctap/${id}`, data);
        return response.data;
    },

    updateTrangThai: async (id, trangThai) => {
        const response = await apiClient.put(`/api/tiendohoctap/${id}/status`, JSON.stringify(trangThai), {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    }
};

export default tiendohoctapService;
