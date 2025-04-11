import React, { useState, useEffect } from 'react';
import styles from './HomePageComponent.module.css'; //style
import Modal from '@/app/components/modal/ModalComponent';
import { useDispatch, useSelector } from 'react-redux';

import { useNavigate } from 'react-router-dom';
// Assume these services are set up with axios or fetch
import { getAllEvents } from '@/app/services/eventService';
import { getRsoMembersById } from '@/app/services/rsoService';
import { isJwtTokenExpired } from '@/app/utils/auth';

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

const HomePageComponent: React.FC = () => {
  const navigate = useNavigate();

  const [searchValue, setSearchValue] = useState('');
  const [events, setEvents] = useState([]);
  const [originalEvents, setOriginalEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [loggedInUserData, setLoggedInUserData] = useState<any>(null);
  const [myRSOGroup, setMyRSOGroup] = useState([]);

  useEffect(() => {
    if (!isJwtTokenExpired()) {
      setIsUserLoggedIn(true);
      // const user:any = {};
      const user = JSON.parse(localStorage.getItem('currentUser') as string);
      
      setLoggedInUserData(user);

      if (user?.user_id) {
        getRsoMembersById(user.user_id).then(res => {
          setMyRSOGroup(res?.rsoGroupMemberById || []);
        });
      }
    }

    getAllEvents().then(res => {
      const fetchedEvents = res?.data.events || [];
      setOriginalEvents(fetchedEvents);
      setEvents(fetchedEvents);
      setIsLoading(false);
    });
  }, []);

  const onSearch = (value:any) => {
    setSearchValue(value);
    const filtered = originalEvents.filter((event:any) =>
      event.event_name.toLowerCase().includes(value.toLowerCase())
    );
    setEvents(filtered);
  };

  const goToDetail = (id:string) => {
    navigate(`/event/${id}`);
  };

  const checkIfUserIsPartOfRsoGroup = (rsoId:string) => {
    return myRSOGroup.some((group:any) => group.rso_id === rsoId);
  };

  const formatDate = (dateStr:any) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  };

  const [isListening, setIsListening] = useState(false); // To track the listening state

  const handleTextToSpeechForKeyboard = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

      if (SpeechRecognition) {
          const recognition = new SpeechRecognition();
          recognition.interimResults = true;

          recognition.addEventListener("start", () => {
              // When listening starts
              setIsListening(true);
          });

          recognition.addEventListener("end", () => {
              // When listening stops
              setIsListening(false);
          });

          recognition.addEventListener("result", (e:any) => {
              const transcript = Array.from(e.results)
                  .map((result:any) => result[0])
                  .map((result) => result.transcript)
                  .join("");

              // Update the input field with the transcript
              setSearchValue(transcript);
              console.log(transcript);
          });

          recognition.start();
      } else {
          alert("Your browser does not support Speech Recognition.");
      }
  };

  return (
    <section className={`${styles.bodycontent} text-gray-600 body-font`}>
      {/* Search Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSearch(searchValue);
        }}
        className={`${styles.searchbarcontainer} max-w-md mx-auto`}
      >
        <label htmlFor="search-input" className="sr-only">Search</label>
        <div className="relative">
          {isListening ? (
                      <div className="absolute inset-y-0 start-0 flex items-center justify-center w-12 h-12 bg-red-100 rounded-full animate-pulse">
                        <svg
                          className="w-4 h-4 text-red-500"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 14a3 3 0 0 0 3-3V5a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 14 0h-2zM11 18h2v3h-2v-3z" />
                        </svg>
                      </div>
                  ) : (
                      <>
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3 cursor-pointer" onClick={handleTextToSpeechForKeyboard}>
                            {/* <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                            </svg> */}

                          <svg
                            className="w-4 h-4 text-gray-500 dark:text-gray-400"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                          >
                            <path d="M12 14a3 3 0 0 0 3-3V5a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 14 0h-2zM11 18h2v3h-2v-3z" />
                          </svg>
                        </div>
                      </>
                  )}
          <input
            id="search-input"
            type="search"
            value={searchValue}
            onChange={(e) => onSearch(e.target.value)}
            className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50"
            placeholder="Search Events..."
          />
          <button type="submit" className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            Search
          </button>
        </div>
      </form>

      {/* Event List */}
      <div className="container px-5 mx-auto">
        <div className="-my-8 divide-y-2 divide-gray-100">
          {isLoading ? (
            <div>
              <i className="fa fa-circle-o-notch fa-spin" style={{ fontSize: 24 }}></i> Loading Data...
            </div>
          ) : events.length === 0 ? (
            <div>No event available at this time</div>
          ) : (
            events.map((event: any) => {
              const isPublic = event.visibility_id === 1;
              const isPrivate =
                event.visibility_id === 2 &&
                isUserLoggedIn &&
                event.uni_id === loggedInUserData?.uni_Id;
              const isRSO =
                event.visibility_id === 3 &&
                isUserLoggedIn &&
                checkIfUserIsPartOfRsoGroup(event.rso_id);

              // 🔒 Restrict access to non-permitted private or RSO events
              if (!isPublic && !isPrivate && !isRSO) return null;

              return (
                <div
                  key={event.event_id}
                  className="bg-white rounded-2xl shadow-md p-6 mb-6 flex flex-wrap md:flex-nowrap transition hover:shadow-lg"
                >
                  {/* Left Column */}
                  <div className="md:w-64 md:mb-0 mb-6 flex-shrink-0 flex flex-col">
                    <span className="font-semibold text-indigo-600 text-sm mb-1">
                      <i className="fa fa-tag mr-1" aria-hidden="true"></i>
                      {event.category_name}
                    </span>
                    <span className="text-gray-500 text-sm">{formatDate(event.event_date)}</span>
                  </div>
              
                  {/* Right Column */}
                  <div className="md:flex-grow">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-2">{event.event_name}</h2>
                    <p className="text-gray-700 leading-relaxed">{event.about}</p>
              
                    <div className="mt-4 flex items-center gap-4">
                      {/* Uncomment if needed */}
                      {/* <a
                        className="text-green-500 inline-flex items-center cursor-pointer"
                        onClick={() => userComments(event.event_id)}
                      >
                        <i className="fa fa-comments mr-2"></i> Comments
                      </a> */}
              
                      <a
                        className="text-yellow-500 inline-flex items-center cursor-pointer hover:underline"
                        onClick={() => goToDetail(event.event_id)}
                      >
                        Learn More
                        <svg className="w-4 h-4 ml-2" viewBox="0 0 24 24" stroke="currentColor" fill="none">
                          <path d="M5 12h14" />
                          <path d="M12 5l7 7-7 7" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              );
              
            })
          )}
        </div>
      </div>

    </section>
  );
};

export default HomePageComponent;
