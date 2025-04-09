import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import headerLogo from '@/app/assets/images/img.png';
import Modal from '@/app/components/modal/ModalComponent';
import LoginComponent from '@/app/components/login/LoginComponent';
import SignupComponent from '@/app/components/signup/SignupComponent';
import { logout } from '@/app/utils/auth';

interface UserProfile {
  about: string | null;
  name: string;
  profile_photo: string | null;
  user_email: string;
  user_firstName: string;
  user_id: number;
  user_lastName: string;
  user_level: string;
  created_at?: string;
}

const HeaderComponent: React.FC = () => {
  
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [modalContent, setModalContent] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [userDbDetails, setUserDbDetails] = useState<UserProfile[]>([]);
  const [profileImagePathToDisplay, setProfileImagePathToDisplay] = useState('');
  const [joinDate, setJoinDate] = useState('');

  const baseUrl = import.meta.env.VITE_API_BASE_URL|| ''; // Example: http://localhost:3000
  const homeUrl = import.meta.env.VITE_API_URL|| ''; // Example: http://localhost:3000

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setIsLoggedIn(!!userData.email);
      setJoinDate(moment(userData.created_at).format('MMMM DD, YYYY'));

      getUserProfileOnPageLoad(userData.user_id);
    }
  }, []);

  const getUserProfileOnPageLoad = async (userId: number) => {
    try {
      const response = await axios.get(`${baseUrl}/profile/${userId}`);
      setUserDbDetails(response.data.user);
      if (response.data.user[0]?.profile_photo) {
        setProfileImagePathToDisplay(`${homeUrl}/${response.data.user[0].profile_photo}`);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const goToProfile = () => navigate('/profile');
  const goToEvent = () => navigate('/create-event');

  const logOutAUser = () => {
    logout();
    localStorage.removeItem('currentUser');
    setUser(null);
    setIsLoggedIn(false);
    window.location.replace("/"); 
  };



  const goToLogin = () => {
    // navigate('/login');
    setModalContent(true);
    setModalOpen(true);
  } 

  const goToSignup = () => {
    // navigate('/signup');
    setModalContent(false);
    setModalOpen(true);
  }

  //For modal
    const [isModalOpen, setModalOpen] = useState(false);

  return (
    <>
     <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>

          {modalContent ? <LoginComponent /> : <SignupComponent />}
          {/* <LoginComponent /> */}
          {/* <SignupComponent /> */}
      </Modal>

      <header className="bg-indigo-600 text-white shadow-md sticky top-0 z-50">
          <div className="container mx-auto flex flex-wrap p-4 md:p-5 flex-col md:flex-row items-center justify-between">
            
            {/* Logo + Title */}
            <a className="flex title-font font-semibold items-center text-white cursor-pointer" onClick={() => navigate('/')}>
              <img src={headerLogo} className="w-10 h-10" alt="KnightUnify Logo" />
              <span className="ml-3 text-2xl font-bold tracking-wide">KnightUnify</span>
            </a>

            {/* Nav Links */}
            <nav className="flex flex-wrap items-center text-sm md:text-base mt-4 md:mt-0">
              {isLoggedIn && (
                <>
                  <a onClick={goToProfile} className="mr-5 hover:text-gray-300 cursor-pointer transition">Profile</a>
                  <a onClick={goToEvent} className="mr-5 hover:text-gray-300 cursor-pointer transition">Create Event</a>
                </>
              )}
            </nav>

            {/* Auth / User Avatar */}
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              {!isLoggedIn ? (
                <>
                  <button
                    onClick={goToLogin}
                    className="bg-white text-indigo-600 hover:bg-gray-100 font-semibold py-1.5 px-4 rounded transition"
                  >
                    Log In
                  </button>
                  <button
                    onClick={goToSignup}
                    className="bg-white text-indigo-600 hover:bg-gray-100 font-semibold py-1.5 px-4 rounded transition"
                  >
                    Sign Up
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-white rounded-full">
                    {!userDbDetails[0]?.profile_photo ? (
                      <span className="font-medium text-indigo-600 uppercase">
                        {user?.firstName?.[0]}
                        {user?.lastName?.[0]}
                      </span>
                    ) : (
                      <img className="h-10 w-10 rounded-full object-cover" src={profileImagePathToDisplay} alt="User Profile" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-white capitalize">
                      {user?.firstName} {user?.lastName}
                    </div>
                    <div className="text-sm text-gray-200">Joined in {joinDate}</div>
                  </div>
                  <div
                    className="cursor-pointer text-red-300 hover:text-red-100 transition"
                    title="Logout"
                    onClick={logOutAUser}
                  >
                    <i className="fa fa-sign-out" aria-hidden="true"></i>
                  </div>
                </div>
              )}
            </div>
          </div>
      </header>

    </>
  
  );
};

export default HeaderComponent;
