import { useState } from 'react'
import './App.css'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer} from 'react-toastify';
import TestPageComponent from '@/app/pages/test-page/TestPageComponent';
import HomePageComponent from '@/app/pages/home-page/HomePageComponent';
import UnknownPageComponent from '@/app/pages/404-page/UnknownPageComponent';

import EventDetailPageComponent from '@/app/pages/event-detail-page/EventDetailPageComponent';


import Layout from '@/app/Layout';

import HeaderComponent from '@/app/components/header/HeaderComponent';
import FooterComponent from '@/app/components/footer/FooterComponent';
import ResetPageComponent from '@/app/pages/reset-password-page/ResetPageComponent';



import ProfilePageComponent from '@/app/pages/profile-page/ProfilePageComponent';



function App() {

  return (
    <>
      <Router>
        <Routes>
          {/* Layout Route wraps pages that should include Header */}
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePageComponent />} />
            <Route path="home" element={<HomePageComponent />} />
            <Route path="test" element={<TestPageComponent />} />
            <Route path="profile" element={<ProfilePageComponent />} />
         
            <Route path="event/:id" element={<EventDetailPageComponent />} />
            <Route path="*" element={<UnknownPageComponent />} /> {/* catch-all */}
          </Route>

          {/* Standalone routes without the layout/header */}
         
         
          <Route path="/reset" element={<ResetPageComponent />} />
        </Routes>
      </Router>

      <ToastContainer />
    </>
  )
}

export default App
