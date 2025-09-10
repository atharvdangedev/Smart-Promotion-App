import { api } from "../utils/api";

export const fetchStats = async (user)=>{
    try {
        
        const endpoint = user === 'agent' ? 'agent/agent-dashboard-stats' : 'vendor/vendor-dashboard-stats';
        const response = await api.get(endpoint);
        // console.log(response.data.data);
        return response.data;
    } catch (error) {
        console.log('Error fetching dashboard stats', error);
        throw error;
    }
}