import axios from 'axios';
import Constants from 'expo-constants';

export const API_URL = Constants.expoConfig.extra.API_URL;

const ApiService = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const setAuthToken = (token) => {
  if (token) {
    ApiService.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete ApiService.defaults.headers.common['Authorization'];
  }
};

export default ApiService;
