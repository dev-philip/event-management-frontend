import React, { useEffect, useState, useRef } from 'react';
import styles from './CreateEventPageComponent.module.css'; 

import { RootState } from '@/app/store';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { isJwtTokenExpired } from '@/app/utils/auth';
import { addLoginUserToState } from '@/app/features/user/userSlice';


const CreateEventPageComponent: React.FC = () => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || ''; // Example: http://localhost:3000
  const mapAPI = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''; // Example: http://localhost:3000
  const user = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const [categories, setCategories] = useState<any[]>([]);
  const [visibilities, setVisibilities] = useState<any[]>([]);
  const [eventTimes, setEventTimes] = useState<any[]>([]);
  const [rsoGroups, setRsoGroups] = useState<any[]>([]);

  const [showRsoSelect, setShowRsoSelect] = useState(false);
  const [formData, setFormData] = useState({
    eventName: '',
    eventAbout: '',
    eventDescription: '',
    eventLocationName: '',
    eventAddress: '',
    eventCity: '',
    eventState: '',
    eventZipCode: '',
    additionalInfo: '',
    eventCategory: '',
    eventVisibility: '',
    rso_id: '',
    eventDateWithPicker: '',
    eventStartTime: '',
    eventEndTime: '',
    eventEmail: '',
    eventContactName: '',
    eventContactPhone: ''
  });

  const autocompleteRef = useRef<HTMLInputElement | null>(null);
  const autocompleteInstance = useRef<google.maps.places.Autocomplete | null>(null);

  useEffect(() => {

    if(isJwtTokenExpired()){ //if true => Check If user is logged In
      navigate('/login');
      return;
    }

    const storedUserData = JSON.parse(localStorage.getItem('currentUser') as string);

    if (storedUserData) {
      dispatch(addLoginUserToState(storedUserData));

      fetchDropdownData();
      initGoogleAutocomplete();
    }
  }, []);

  const fetchDropdownData = async () => {
    try {
      const [catRes, visRes, timeRes, rsoRes] = await Promise.all([
        axios.get(`${baseUrl}/event/category`),
        axios.get(`${baseUrl}/event/visibility`),
        axios.get(`${baseUrl}/event/event-time`),
        axios.get(`/api/rso/getbyadmin/${user.user_id}`)
        // axios.get(`${baseUrl}/rso/getbyadmin/11`)
      ]);

      setCategories(catRes.data.eventCategory);
      setVisibilities(visRes.data.visibilityResponse);
      setEventTimes(timeRes.data.eventTimeResponse);
      setRsoGroups(rsoRes.data.rsoGroupByAdmin);
    } catch (err) {
      console.error(err);
      toast.error('Error loading dropdown data');
    }
  };

  const initGoogleAutocomplete = () => {
    if (!autocompleteRef.current) return;
    autocompleteInstance.current = new google.maps.places.Autocomplete(autocompleteRef.current);
    autocompleteInstance.current.addListener('place_changed', () => {
      const place:any = autocompleteInstance.current?.getPlace();
      const components = place?.address_components || [];

      setFormData(prev => ({
        ...prev,
        eventAddress: place?.formatted_address.split(',')[0] || '',
        eventCity: components.find((c:any) => c.types.includes('locality'))?.long_name || '',
        eventState: components.find((c:any) => c.types.includes('administrative_area_level_1'))?.long_name || '',
        eventZipCode: components.find((c:any) => c.types.includes('postal_code'))?.long_name || ''
      }));
    });
  };

 function parseTimeString(timeString: string) {
    // Split time string into parts
    var parts = timeString.split(":");
    var hour = parseInt(parts[0]);
    var minute = parseInt(parts[1].substr(0, 2));
    var period = parts[1].substr(2).toUpperCase();

    // Adjust hour for PM
    if (period === "PM" && hour !== 12) {
        hour += 12;
    }

    // Create and return Date object
    return new Date(2024, 3, 14, hour, minute, 0); // Month is 0-indexed (April is 3)
}

  const compareTimes = (start: string, end: string) => {
    var date1 = parseTimeString(start);
    var date2 = parseTimeString(end);

    // Compare the Date objects
    if (date1 < date2) {
        return true
    } else if (date1 > date2) {
        return false
    } else {
        return false
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const {
      eventStartTime,
      eventEndTime,
      eventEmail,
      eventContactPhone,
      eventVisibility,
      rso_id
    } = formData;

    if (compareTimes(eventStartTime, eventEndTime) == false) {
      toast.error('Start time must be before end time');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(eventEmail)) {
      toast.error('Invalid email');
      return;
    }

    if (!/^\d{10}$/.test(eventContactPhone)) {
      toast.error('Contact phone must be 10 digits');
      return;
    }

    try {
      setLoading(true);

      const geoRes = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(`${formData.eventAddress}, ${formData.eventCity}, ${formData.eventState}, ${formData.eventZipCode}`)}&key=${mapAPI}`);
      const geo = geoRes.data.results[0]?.geometry.location;

      const payload = {
        ...formData,
        eventDateWithPicker: new Date(formData.eventDateWithPicker).toISOString().split('T')[0],
        lat: geo.lat,
        Lng: geo.lng,
        geocode: geoRes.data.results[0],
        admin_id: user.user_id
      };

      // const length = Object.keys(formData).length;
      // console.log(length);
      // console.log(payload);
      // return;

      const res = await axios.post(`${baseUrl}/event/create`, payload);

      toast.success(res.data.message);
      setFormData({
        eventName: '', eventAbout: '', eventDescription: '', eventLocationName: '',
        eventAddress: '', eventCity: '', eventState: '', eventZipCode: '', additionalInfo: '', eventCategory: '',
        eventVisibility: '', rso_id: '', eventDateWithPicker: '', eventStartTime: '',
        eventEndTime: '', eventEmail: '', eventContactName: '', eventContactPhone: ''
      });
      navigate('/');
    } catch (err) {
      console.error(err);
      toast.error('Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  const ola = () => {
    alert(user.user_id);
    console.log(user);
  }
  
  
  return (
    <>
    {/* <button onClick={ola}>Click me</button> */}
    <div className={`${styles.createeventbody} container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center`}>
      <form onSubmit={handleSubmit} className="space-y-12 w-full">
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-gray-900">Create an Event</h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            This information will be displayed publicly so be careful what you share.
          </p>
  
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2">
            <input
              placeholder="Event Name"
              value={formData.eventName}
              onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
              className="pl-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
              required
            />
            <input
              placeholder="Location Name"
              value={formData.eventLocationName}
              onChange={(e) => setFormData({ ...formData, eventLocationName: e.target.value })}
              className="pl-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
              required
            />
            <input
              ref={autocompleteRef}
              placeholder="Street Address"
              className="pl-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
              required
            />
            <input
              placeholder="City"
              value={formData.eventCity}
              onChange={(e) => setFormData({ ...formData, eventCity: e.target.value })}
              className="pl-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
              required
            />
            <input
              placeholder="State"
              value={formData.eventState}
              onChange={(e) => setFormData({ ...formData, eventState: e.target.value })}
              className="pl-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
              required
            />
            <input
              placeholder="Zip"
              value={formData.eventZipCode}
              onChange={(e) => setFormData({ ...formData, eventZipCode: e.target.value })}
              className="pl-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
              required
            />
            <textarea
              placeholder="About Event"
              value={formData.eventAbout}
              onChange={(e) => setFormData({ ...formData, eventAbout: e.target.value })}
              className="pl-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
              required
            />
            <textarea
              placeholder="Detailed Description"
              value={formData.eventDescription}
              onChange={(e) => setFormData({ ...formData, eventDescription: e.target.value })}
              className="pl-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
              required
            />
          </div>
        </div>
  
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-gray-900">Event Info</h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">Timing and visibility information.</p>
  
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="date"
              value={formData.eventDateWithPicker}
              onChange={(e) => setFormData({ ...formData, eventDateWithPicker: e.target.value })}
              className="pl-3 input block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-gray-300 focus:ring-indigo-600 sm:text-sm"
              required
            />
            <select
              value={formData.eventCategory}
              onChange={(e) => setFormData({ ...formData, eventCategory: e.target.value })}
              className="pl-3 input block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-gray-300 focus:ring-indigo-600 sm:text-sm"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.category_id} value={cat.category_id}>{cat.name}</option>
              ))}
            </select>
            <select
              value={formData.eventVisibility}
              onChange={(e) => {
                const val = e.target.value;
                setFormData({ ...formData, eventVisibility: val });
                setShowRsoSelect(val === '3');
              }}
              className="pl-3 input block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-gray-300 focus:ring-indigo-600 sm:text-sm"
            >
              <option value="">Select Visibility</option>
              {visibilities.map((vis) => (
                <option key={vis.visibility_id} value={vis.visibility_id}>{vis.name}</option>
              ))}
            </select>
  
            {showRsoSelect && (
              <select
                value={formData.rso_id}
                onChange={(e) => setFormData({ ...formData, rso_id: e.target.value })}
                className="pl-3 input block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 sm:text-sm"
              >
                <option value="">Select RSO Group</option>
                {rsoGroups.map((rso) => (
                  <option key={rso.rso_id} value={rso.rso_id}>{rso.name}</option>
                ))}
              </select>
            )}

            <select
              value={formData.eventStartTime}
              onChange={(e) => setFormData({ ...formData, eventStartTime: e.target.value })}
              className="pl-3 input block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-gray-300 focus:ring-indigo-600 sm:text-sm"
            >
              <option value="">Select Start Time</option>
              {eventTimes.map((cat) => (
                <option key={cat.schedule_id} value={cat.event_time}>{cat.event_time}</option>
              ))}
            </select>


            <select
              value={formData.eventEndTime}
              onChange={(e) => setFormData({ ...formData, eventEndTime: e.target.value })}
              className="pl-3 input block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-gray-300 focus:ring-indigo-600 sm:text-sm"
            >
              <option value="">Select End Time</option>
              {eventTimes.map((cat) => (
                <option key={cat.schedule_id} value={cat.event_time}>{cat.event_time}</option>
              ))}
            </select>

            {/* <input
              placeholder="Start Time (e.g. 09:00 AM)"
              value={formData.eventStartTime}
              onChange={(e) => setFormData({ ...formData, eventStartTime: e.target.value })}
              className="pl-3 input block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 sm:text-sm"
              required
            /> */}

            {/* <input
              placeholder="End Time (e.g. 11:00 AM)"
              value={formData.eventEndTime}
              onChange={(e) => setFormData({ ...formData, eventEndTime: e.target.value })}
              className="pl-3 input block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 sm:text-sm"
              required
            /> */}

          </div>
        </div>
  
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-gray-900">Contact Information</h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">Let attendees know who to contact.</p>
  
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              placeholder="Contact Email"
              value={formData.eventEmail}
              onChange={(e) => setFormData({ ...formData, eventEmail: e.target.value })}
              className="pl-3 input block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-gray-300 focus:ring-indigo-600 sm:text-sm"
              required
            />
            <input
              placeholder="Contact Name"
              value={formData.eventContactName}
              onChange={(e) => setFormData({ ...formData, eventContactName: e.target.value })}
              className="pl-3 input block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-gray-300 focus:ring-indigo-600 sm:text-sm"
              required
            />
            <input
              placeholder="Contact Phone"
              value={formData.eventContactPhone}
              onChange={(e) => setFormData({ ...formData, eventContactPhone: e.target.value })}
              className="pl-3 input block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-gray-300 focus:ring-indigo-600 sm:text-sm"
              required
            />
          </div>
        </div>
  
        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button
            type="submit"
            disabled={loading}
            className="pl-3 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
          >
            {loading ? (
              <i className="fa fa-circle-o-notch fa-spin" style={{ fontSize: 20 }}></i>
            ) : (
              'Create Event'
            )}
          </button>
        </div>
      </form>
    </div>
    </>
    
  );
  
};

export default CreateEventPageComponent;


