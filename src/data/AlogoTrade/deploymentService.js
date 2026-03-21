import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://techwalatrader-algobackend.onrender.com';

// Active Deployments lane ke liye
export const fetchActiveDeployments = async () => {
    try {
        const response = await axios.get(`${API_URL}/api/deployments/active`);
        if (response.data.success) {
            return response.data.data;
        }
        return [];
    } catch (error) {
        console.error("Error fetching active deployments:", error);
        return [];
    }
};

// Strategy ko Stop karne ke liye (Future use)
export const stopDeployment = async (deploymentId) => {
    try {
        const response = await axios.post(`${API_URL}/api/deployments/stop/${deploymentId}`);
        return response.data;
    } catch (error) {
        console.error("Error stopping deployment:", error);
        throw error;
    }
};