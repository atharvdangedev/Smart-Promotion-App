import { api } from '../utils/api';

export const fetchProfile = async (role, userId) => {
  try {
    const response = await api.get(`${role}/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
};

export const updateProfile = async (role, userId, formData) => {
  try {
    const response = await api.post(`${role}/${userId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};
