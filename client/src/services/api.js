import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3002/api', // Changed to 3002 to avoid conflicts
});

export const getVehicles = () => api.get('/vehicles');
export const createVehicle = (data) => api.post('/vehicles', data);
export const getVehicleDetails = (id) => api.get(`/vehicles/${id}`);

export default api;
