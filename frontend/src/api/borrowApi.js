import axios from './axios';

export const getBorrowRecords = async (status = 'all') => {
  const response = await axios.get('/borrow-records', { params: { status } });
  return response.data;
};

export const createBorrowRecord = async (data) => {
  const response = await axios.post('/borrow-records', data);
  return response.data;
};

export const returnEquipment = async (id) => {
  const response = await axios.patch(`/borrow-records/${id}/return`);
  return response.data;
};
