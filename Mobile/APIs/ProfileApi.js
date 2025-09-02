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
    const response = await api.post(`${role}/${userId}`, formData);
    return response.data;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};

export const saveRecentMessage = async (role, payload) => {
  try {
    const response = await api.post(`${role}/contacts/save-messages`, payload);
    return response.data;
  } catch (error) {
    console.error('Error saving recent message:', error);
    throw error;
  }
};
