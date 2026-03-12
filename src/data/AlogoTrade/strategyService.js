import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/api/strategies`;

// 1. Create New Strategy
export const createStrategy = async (strategyData) => {
  try {
    const response = await axios.post(`${API_URL}/add`, strategyData);
    return response.data;
  } catch (error) {
    console.error('Error creating strategy:', error);
    throw error;
  }
};

// 2. Get All Strategies
export const getStrategies = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching strategies:', error);
    return [];
  }
};

// // 3. Update Strategy
export const updateStrategy = async (id, updateData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, updateData);
    return response.data;
  } catch (error) {
    console.error('Error updating strategy:', error);
    throw error;
  }
};

// 4. Toggle Active Status
export const toggleStrategyStatus = async (id) => {
  try {
    const response = await axios.put(`${API_URL}/toggle/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error toggling strategy:', error);
    throw error;
  }
}

// ✅ NEW FUNCTION: Delete Strategy
export const deleteStrategy = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting strategy:', error);
    throw error;
  }
};