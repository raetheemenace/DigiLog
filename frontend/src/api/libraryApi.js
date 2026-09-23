import api from './axios';

// Equipment endpoints
export const getEquipments = (params = {}) => api.get('/equipments', { params });
export const addEquipment = (data) => api.post('/equipments', data);

// Borrow records endpoints
export const getBorrowRecords = (params = {}) => api.get('/borrow-records', { params });
export const borrowItem = (data) => api.post('/borrow-records', data);
export const returnItem = (id) => api.patch(`/borrow-records/${id}/return`);
