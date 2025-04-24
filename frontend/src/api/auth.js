import axios from './axiosInstance';

const API_URL = '/api/auth/';

export const login = async (credentials) => {
  const response = await axios.post('/api/auth/signin', credentials);
  return response.data; // não salva token aqui
};

export const register = async (userData) => {
  const response = await axios.post(`${API_URL}signup`, userData);
  return response.data;
};
