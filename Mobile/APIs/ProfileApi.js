
import { api } from "../utils/api";

export const profileApi = {
    fetchProfile: (role, userId) => api.get(`${role}/${userId}`),

    updateProfile: (role, userId, formData) =>
        api.post(`${role}/${userId}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        }),
};
