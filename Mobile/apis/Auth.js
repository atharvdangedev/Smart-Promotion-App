import { api } from '../utils/api';

export const changePassword = async (data, token) => {
  try {
    const response = await api.post(`change-password`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response;
  } catch (error) {
    throw error;
  }
};
