import axios from 'axios';

const appConfig = require('@esign-web/config');

export const axiosInstance = axios.create({
  baseURL: process.env.NX_SERVER_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

const token = localStorage.getItem('token');

if (token) {
  axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export const baseApi = axiosInstance;

export const handleUserLogout = () => {
  localStorage.removeItem('token');
  delete axiosInstance.defaults.headers.common['Authorization'];
  window.location.href = '/login';
};

export const handleSaveToken = (token: string) => {
  return (axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`);
};
