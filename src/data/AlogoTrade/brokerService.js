

// const STORAGE_KEY = 'connectedBrokers';

// export const getConnectedBrokers = () => {
//   const data = localStorage.getItem(STORAGE_KEY);
//   return data ? JSON.parse(data) : [];
// };

// export const saveBroker = (broker) => {
//   const currentList = getConnectedBrokers();
//   // Check if broker already exists, remove it to avoid duplicates (optional logic)
//   const newList = currentList.filter(b => b.clientId !== broker.clientId); 
//   const updatedList = [...newList, broker];
//   localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
// };

// // ✅ NEW FUNCTION: ब्रोकर का स्टेटस अपडेट करने के लिए
// export const updateBrokerStatus = (brokerId, isTerminalOn) => {
//     const currentList = getConnectedBrokers();
//     const updatedList = currentList.map(broker => {
//         if (broker.id === brokerId) {
//             return { 
//                 ...broker, 
//                 terminalOn: isTerminalOn,
//                 status: isTerminalOn ? 'Connected' : 'Not Connected' // Logic: Terminal ON = Connected
//             };
//         }
//         return broker;
//     });
//     localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
//     return updatedList;
// };


import axios from 'axios';

// Backend URL (Make sure ye port wahi ho jo backend me chal raha hai - 5500)
const API_URL = 'http://localhost:5500/api/brokers';

// 1. Get All Brokers (Backend se list laao)
export const getConnectedBrokers = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching brokers:', error);
    return [];
  }
};

// 2. Save Broker (Backend me save karo)
export const saveBroker = async (brokerData) => {
  try {
    const response = await axios.post(`${API_URL}/add`, brokerData);
    return response.data;
  } catch (error) {
    console.error('Error saving broker:', error.response?.data?.message || error.message);
    throw error; // UI ko error dikhane ke liye throw karo
  }
};

// 3. Update Status (Example: Terminal ON/OFF logic)
// Note: Iske liye hume Backend me ek update route banana padega baad me.
// Abhi ke liye hum sirf frontend logic update kar rahe hain.

// export const updateBrokerStatus = async (brokerId, status) => {
//   // TODO: Future me iska API route banayenge (/api/brokers/update/:id)
//   console.log(`Updating status for ${brokerId} to ${status}`);
// };

// ✅ Update Broker Status (Connect/Disconnect)
export const updateBrokerStatus = async (id, status) => {
    try {
        // API call to backend
        await axios.put(`${API_URL}/${id}/status`, { status });
        
        // Return fresh list to update UI
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error updating status:', error);
        throw error;
    }
};


// ✅ FIXED: Delete API Call
export const deleteBroker = async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
};

// ✅ FIXED: Square Off API Call
export const squareOffBroker = async (id) => {
    const response = await axios.post(`${API_URL}/square-off/${id}`);
    return response.data;
};


// ✅ NEW: Trading Engine Status Update
export const updateEngineStatus = async (id, engineOn) => {
    try {
        await axios.put(`${API_URL}/${id}/engine`, { engineOn });
        
        // Update hone ke baad list wapas mangwa lo UI refresh karne ke liye
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error updating engine status:', error);
        throw error;
    }
};


// ✅ NEW: Fetch Algo Trade Logs
export const getAlgoLogs = async () => {
    try {
        // Dhyan dein: Port 5500 ya jo bhi aapka backend port ho
        const response = await axios.get('http://localhost:5500/api/algo-logs');
        return response.data;
    } catch (error) {
        console.error('Error fetching algo logs:', error);
        return []; // Error aane par khali array return karega
    }
};
