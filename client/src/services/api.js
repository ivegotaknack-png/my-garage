import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3002/api', // Changed to 3002 to avoid conflicts
});

export const getVehicles = () => api.get('/vehicles');
export const createVehicle = (data) => api.post('/vehicles', data);
export const getVehicleDetails = (id) => api.get(`/vehicles/${id}`);
export const deleteVehicle = (id) => api.delete(`/vehicles/${id}`);

export const createMaintenance = (data) => api.post('/maintenance', data);
export const getMaintenanceDetail = (id) => api.get(`/maintenance/${id}`);
export const updateMaintenance = (id, data) => api.put(`/maintenance/${id}`, data);
export const deleteMaintenance = (id) => api.delete(`/maintenance/${id}`);

export const createReminder = (data) => api.post('/reminders', data);
export const getReminderDetail = (id) => api.get(`/reminders/${id}`);
export const updateReminder = (id, data) => api.put(`/reminders/${id}`, data);
export const getReminders = () => api.get('/reminders');
export const deleteReminder = (id) => api.delete(`/reminders/${id}`);

export default api;
