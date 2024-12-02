import apiClient from "@/constants/api";

export const khoahocService = {
    getAll: async () => {
        const response = await apiClient.get('/api/khoahoc');
        return response.data;
    },

    getById: async (id) => {
        const response = await apiClient.get(`/api/khoahoc/${id}`);
        return response.data;
    },

    getByUserId: async (userId) => {
        const response = await apiClient.get(`/api/khoahoc/user/${userId}`);
        return response.data;
    },

    create: async (data) => {
        const response = await apiClient.post('/api/khoahoc', data);
        return response.data;
    },

    update: async (id, data) => {
        const response = await apiClient.put(`/api/khoahoc/${id}`, data);
        return response.data;
    },

    delete: async (id) => {
        const response = await apiClient.delete(`/api/khoahoc/${id}`);
        return response.data;
    }
}