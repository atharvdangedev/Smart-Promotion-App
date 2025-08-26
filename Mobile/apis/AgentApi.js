import { api } from '../utils/api';

export const fetchAgents = async () => {
  try {
    const endpoint = 'vendor/all-agents/1';
    const response = await api.get(endpoint);
    return response.data.agents;
  } catch (error) {
    console.error('Error fetching agents:', error);
    throw error;
  }
};

// https://swp.smarttesting.in/api/update-user-status/142

export const toggleStatus = async id => {
  try {
    const response = await api.put(`update-user-status/${id}`, {});
    // console.log(response);
    return response.data;
  } catch (error) {
    console.error(`Error toggling status for template with id ${id}:`, error);
    throw error;
  }
};
