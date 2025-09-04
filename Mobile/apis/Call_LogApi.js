import { api } from '../utils/api';

export const fetchCall_log = async (user,filters) => {
  try {
    const endpoint = user === 'agent' ? 'agent/call-logs' : 'vendor/call-logs';
    const response = await api.get(endpoint , {
    params: {
      search: filters.search || undefined,
      type: filters.type || undefined,
      start_date: filters.startDate || undefined,
      end_date: filters.endDate || undefined,
    },
  });
    return response.data.call_logs;
  } catch (error) {
    console.error('Error fetching call_logs:', error);
    throw error;
  }
};

export const fetchLog = async (Id, user) => {
  try {
    const endpoint =
      user === 'agent' ? `agent/call-logs/${Id}` : `vendor/call-logs/${Id}`;
    const response = await api.get(endpoint);
    console.log(response);
    return response.data.call_logs;
  } catch (error) {
    console.error('Error fetching call_log:', error);
    throw error;
  }
};
