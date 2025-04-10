import React, { useState, useEffect } from 'react';
import styles from './EventDetailPageComponent.module.css'; 

import { useParams } from 'react-router-dom';
import axios from 'axios';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

type Event = {
  event_id: string;
  event_name: string;
  description: string;
  event_date: string;
  start_time: string;
  end_time: string;
  category_name: string;
  contact_email: string;
  contact_phone: string;
  location_name: string;
  street_address: string;
  city: string;
  state: string;
  zip_code: string;
  latitude: string;
  longitude: string;
};



const EventDetailsPage: React.FC = () => {
  const { id } = useParams();
  const [eventData, setEventData] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mapCenter, setMapCenter] = useState({ lat: 0, lng: 0 });

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  useEffect(() => {
    if (id) {
      axios
        .get(`${API_BASE_URL}/event/${id}`)
        .then((response) => {
          const fetchedEvent = response.data.event[0];
          setEventData(fetchedEvent);
          setMapCenter({
            lat: parseFloat(fetchedEvent.latitude),
            lng: parseFloat(fetchedEvent.longitude),
          });
          setIsLoading(false);
        })
        .catch(console.error);
    }
  }, [id]);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  const formatPhoneNumber = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length === 10
      ? `+1 (${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
      : phone;
  };

  if (isLoading || !eventData) {
    return (
      <div className="text-center mt-10 text-lg text-gray-700">
        <i className="fa fa-circle-o-notch fa-spin text-2xl" /> Loading event details...
      </div>
    );
  }

  return (
    <section className="text-gray-700 body-font">
      <div className="container mx-auto flex mt-4 items-center justify-center flex-col px-4">
        <div className="text-center lg:w-2/3 w-full">
          <h1 className="text-4xl font-bold mb-4 text-gray-900">{eventData.event_name}</h1>
          <div className="flex justify-center mb-6">
            <div className="w-16 h-1 bg-indigo-500 rounded-full"></div>
          </div>
          <p className="leading-relaxed text-lg mb-8">{eventData.description}</p>
        </div>

        {/* Info Cards */}
        <div className="w-full py-10">
          <div className="flex flex-wrap gap-y-10 gap-x-4 justify-center">
            <InfoCard icon="fa-user" title="Contact Information">
              <p>{eventData.location_name}</p>
              <p>{eventData.contact_email}</p>
              <p>{formatPhoneNumber(eventData.contact_phone)}</p>
            </InfoCard>

            <InfoCard icon="fa-clock-o" title="Event Time">
              <p>{formatDate(eventData.event_date)}</p>
              <p>
                {eventData.start_time} - {eventData.end_time}
              </p>
              <p>Category: {eventData.category_name}</p>
            </InfoCard>

            <InfoCard icon="fa-map-marker" title="Address">
              <p>
                {eventData.street_address}, {eventData.city}, {eventData.state}{' '}
                {eventData.zip_code}
              </p>
            </InfoCard>
          </div>
        </div>

        {/* Google Map */}
        {isLoaded && (
          <div className="w-full h-[380px] mt-6 rounded-lg overflow-hidden shadow-lg">
            <GoogleMap
              center={mapCenter}
              zoom={17}
              mapContainerStyle={{ width: '100%', height: '100%' }}
              options={{ disableDefaultUI: true }}
            />
          </div>
        )}
      </div>
    </section>
  );
};

const InfoCard = ({
  icon,
  title,
  children,
}: {
  icon: string;
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="md:w-1/3 w-full px-4 text-center">
      <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
        <i className={`fa ${icon} fa-2x`} />
      </div>
      <h2 className="text-xl font-semibold mb-2 text-gray-800">{title}</h2>
      <div className="text-base space-y-1 text-gray-600">{children}</div>
    </div>
  );
};

export default EventDetailPageComponent;
