// features/auth/authAPI.ts
import axios from 'axios';

export const loginAPI = (credentials: { email: string; password: string }) => {
  return axios.post('/api/login', credentials);
};
