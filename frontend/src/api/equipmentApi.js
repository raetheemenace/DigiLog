import axios from './axios';

export const getEquipments = async (status = '') => {
  const response = await axios.get('/equipments', { params: { status } });
  return response.data;
};

export const createEquipment = async (data) => {
  const response = await axios.post('/equipments', data);
  return response.data;
};
