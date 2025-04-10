import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';

import styles from './LoginPageComponent.module.css';
import LoginComponent from '@/app/components/login/LoginComponent';
// import { loginUser } from 'src/app/features/auth/authSlice';
// import { loginUser } from '@/features/auth/authSlice';


const LoginPageComponent: React.FC = () => {
  

  return (
    <>
       <LoginComponent />
       
    </>
 
  );
};

export default LoginPageComponent;
