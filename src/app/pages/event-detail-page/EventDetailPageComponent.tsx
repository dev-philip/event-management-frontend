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

const EventDetailPageComponent: React.FC = () => {

  
  const { id } = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [center, setCenter] = useState({ lat: 0, lng: 0 });

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY
  });

  useEffect(() => {
    if (id) {
      axios.get(`${API_BASE_URL}/event/${id}`).then((res) => {
        const fetchedEvent = res.data.event[0];
        setEvent(fetchedEvent);
        setCenter({
          lat: parseFloat(fetchedEvent.latitude),
          lng: parseFloat(fetchedEvent.longitude)
        });
        setLoading(false);
      }).catch(console.error);
    }
  }, [id]);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  };

  const formatPhoneNumber = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length === 10
      ? `+1 (${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
      : phone;
  };

  if (loading || !event) {
    return (
      <div className="text-center mt-10">
        <i className="fa fa-circle-o-notch fa-spin" style={{ fontSize: 24 }} /> Loading Data...
      </div>
    );
  }

  return (
    <section className={`${styles.eventbody} text-gray-600 body-font`}>
      <div className="container mx-auto flex mt-2 items-center justify-center flex-col">
        <div className="text-center lg:w-2/3 w-full">
          <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900">{event.event_name}</h1>
          <div className="flex mt-6 justify-center">
            <div className="w-16 h-1 rounded-full bg-indigo-500 inline-flex"></div>
          </div>
          <p className="mt-5 mb-8 leading-relaxed">{event.description}</p>
        </div>

        {/* INFO SECTIONS */}
        <div className="container px-3 py-10 mx-auto">
          <div className="flex flex-wrap -mx-4 space-y-6 sm:space-y-0">
            <InfoCard icon="fa-user" title="Contact Information">
              <p>{event.location_name}</p>
              <p>{event.contact_email}</p>
              <p>{formatPhoneNumber(event.contact_phone)}</p>
            </InfoCard>

            <InfoCard icon="fa-clock-o" title="Event Time">
              <p>{formatDate(event.event_date)}</p>
              <p>Start at {event.start_time} - {event.end_time}</p>
              <p>Category - {event.category_name}</p>
            </InfoCard>

            <InfoCard icon="fa-map-marker" title="Address">
              <p>{event.street_address}, {event.city}, {event.state}, {event.zip_code}</p>
            </InfoCard>
          </div>
        </div>

        {/* GOOGLE MAP */}
        {isLoaded && (
          <div className={`${styles.googlemapbody} w-full h-[380px] mt-6`}>
            <GoogleMap
              center={center}
              zoom={17}
              mapContainerStyle={{ width: '100%', height: '100%' }}
              options={{ disableDefaultUI: true }}
            />
          </div>
        )}
      </div>
    </section>
  );
}

function InfoCard({ icon, title, children }: { icon: string, title: string, children: React.ReactNode }) {
  return (
    <div className="p-4 md:w-1/3 flex flex-col text-center items-center">
      <div className="w-20 h-20 inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 mb-5">
        <i className={`fa ${icon} fa-2x`} />
      </div>
      <div className="flex-grow">
        <h2 className="text-gray-900 text-lg title-font font-medium mb-3"><b>{title}</b></h2>
        <div className="leading-relaxed text-base space-y-1">{children}</div>
      </div>
    </div>
  );
}
export default EventDetailPageComponent;
