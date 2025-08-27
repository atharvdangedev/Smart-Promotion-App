import { api } from '../utils/api';

export const fetchPlans = async () => {
  try {
    const endpoint = 'all-plans';
    const response = await api.get(endpoint);
    return response.data.plans;
  } catch (error) {
    console.log('Error fetching plans:', error);
    throw error;
  }
};
