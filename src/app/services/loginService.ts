import axios from 'axios';

const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const loginUser = (email: string, password: string) => {
  return axios.post(`${baseUrl}/login`, { email, password }).then(res => res.data);
};
