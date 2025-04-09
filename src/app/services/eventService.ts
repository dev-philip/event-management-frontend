// src/services/eventService.ts

import axios, { AxiosResponse } from 'axios';

const baseUrl: string = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
const googleMapApiKey: string = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

// Types (you can adjust these based on your backend response)
export interface Event {
  event_id: string;
  event_name: string;
  event_date: string;
  category_name: string;
  about: string;
  visibility_id: number;
  uni_id?: string;
  rso_id?: number;
  // ...add more fields as needed
}

export const getGeocodingForAddress = (address: string): Promise<AxiosResponse<any>> => {
  return axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
    params: {
      address: encodeURIComponent(address),
      key: googleMapApiKey,
    }
  });
};

export const getAllEventCategory = (): Promise<any> => {
  return axios.get(`${baseUrl}/event/category`);
};

export const getAllVisibility = (): Promise<any> => {
  return axios.get(`${baseUrl}/event/visibility`);
};

export const getAllEventTime = (): Promise<any> => {
  return axios.get(`${baseUrl}/event/event-time`);
};

export const getAllEvents = (): Promise<any> => {
  return axios.get(`${baseUrl}/events`);
};

export const getEventById = (eventId: string): Promise<any> => {
  return axios.get(`${baseUrl}/event/${eventId}`);
};

export const createEvent = (eventData: Partial<Event>): Promise<any> => {
  return axios.post(`${baseUrl}/event/create`, eventData);
};
