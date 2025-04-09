// src/services/rsoService.ts

import axios, { AxiosResponse } from 'axios';

const baseUrl: string = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
const googleMapApiKey: string = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

// Define interfaces as needed (you can extend these)
export interface RsoGroup {
  rso_id: number;
  rso_name: string;
  admin_id: string;
  // Add more fields as required
}

export interface RsoMember {
  rso_id: number;
  user_id: string;
  // Extend with more fields as needed
}

export const getGeocodingForAddress = (address: string): Promise<AxiosResponse<any>> => {
  return axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
    params: {
      address: encodeURIComponent(address),
      key: googleMapApiKey,
    }
  });
};

export const createRso = (rsoData: any): Promise<any> => {
  return axios.post(`${baseUrl}/rso/create`, rsoData);
};

export const getRsoGroup = (user_id: string): Promise<any> => {
  return axios.get(`${baseUrl}/rso/getbyadmin/${user_id}`);
};

export const getRsoGroupBySchool = (uni_id: string): Promise<any> => {
  return axios.get(`${baseUrl}/rso/getbyschool/${uni_id}`);
};

export const getRsoMembersById = (user_id: string): Promise<any> => {
  return axios.get(`${baseUrl}/rso/getmembers/${user_id}`);
};

export const getRsoMembers = (): Promise<any> => {
  return axios.get(`${baseUrl}/rso/getallmembers/all`);
};

export const joinRsoGroup = (joinData: any): Promise<any> => {
  return axios.post(`${baseUrl}/rso/join/group`, joinData);
};

export const leaveRsoGroup = (leaveData: any): Promise<any> => {
  return axios.post(`${baseUrl}/rso/leave/group`, leaveData);
};
