import axios from 'axios';

const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const registerUser = (form: any) => {
  const { firstName, lastName, email, password, userRole, userUniversity } = form;
  return axios.post(`${baseUrl}/register`, {
    firstName: firstName.toLowerCase(),
    lastName: lastName.toLowerCase(),
    email: email.toLowerCase(),
    password,
    userRole,
    userUniversity,
  }).then(res => res.data);
};

export const getRoles = () => {
  return axios.get(`${baseUrl}/user/role`).then(res => res.data);
};

export const getUniversities = () => {
  return axios.get(`${baseUrl}/university/all`).then(res => res.data);
};
