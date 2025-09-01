import { api } from "../utils/api";

export const fetchCall_log = async user => {
  try {
    const endpoint = user === 'agent' ? 'agent/call-logs' : 'vendor/call-logs';
    const response = await api.get(endpoint);
    return response.data.call_logs;
  } catch (error) {
    console.error('Error fetching call_logs:', error);
    throw error;
  }
};

export const fetchLog = async (Id, user) =>{
  try {
    console.log(Id, user);
    const endpoint = user === 'agent' ? `agent/call-logs/${Id}` : `vendor/call-logs/${Id}`;
    const response = await api.get(endpoint);
    return response.data.call_logs;
  } catch (error) {
    console.error('Error fetching call_log:', error);
    throw error;
  }
}