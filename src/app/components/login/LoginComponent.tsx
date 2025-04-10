import React, { useState } from 'react';
import styles from './LoginComponent.module.css'; 

import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';

import { saveJwtToken, getJwtTokenData } from '../../utils/auth';
import { useDispatch } from 'react-redux';
import { addLoginUserToState } from '../../features/user/userSlice';
// import { addLoginUserToState } from '@app/features/user/userSlice';
import { loginUser } from '@/app/services/loginService';


const LoginComponent: React.FC = () => {

  const { register, handleSubmit, formState: { errors } } = useForm<any>();
  const [loading, setLoading] = useState(false);
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const response = await loginUser(data.email, data.password);

      if (response.status) {
        toast.success(response.message);
        setLoginSuccess(true);

        saveJwtToken(response.token.accessToken);
        const userData = getJwtTokenData().username;
        // Object { firstName: "david", lastName: "johnson", email: "davidjohnson@gmail.com", uni_Id: 10, user_id: 11, user_level: "super admin", created_at: "2024-04-14T06:08:37.000Z", updated_at: "2024-04-14T06:08:37.000Z" }
        dispatch(addLoginUserToState(userData ));
        localStorage.setItem('currentUser', JSON.stringify(userData));

        if (userData.user_level === 'super admin' && !userData.uni_Id) {
          window.location.replace("/"); 
          // openSchoolModal(); // modal trigger if needed
        } else {
          // navigate('/test');
          window.location.replace("/"); 
        }
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error("Login failed");
    } finally {
      setLoading(false);
    }
  };

  const goToSignup = () => {
     navigate('/signup');
  }
  
  const goToReset= () => {
    navigate('/reset');
 }

 const path = window.location.pathname;
  
  return (
    <>
    
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center animate__animated animate__fadeIn">
    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 relative">

      {path !== "/" && (
        <div className="absolute top-4 right-4 text-gray-400 hover:text-black cursor-pointer">
          <i className="fa fa-home text-xl" title="Home" onClick={() => navigate('/')} />
        </div>
      )}

      <h2 className="text-2xl font-bold text-center text-purple-700 mb-6">Sign in</h2>

      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="relative">
          {errors.email?.type === 'required' && (
            <span className="absolute right-4 text-red-500 text-xs underline top-1/2 transform -translate-y-1/2">
              Email is required
            </span>
          )}
          <i className="fa fa-envelope-o absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-700" />
          <input
            type="email"
            placeholder="Email"
            {...register('email', { required: true, pattern: /^\S+@\S+$/i })}
            className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:border-gray-400 focus:outline-none"
          />
        </div>

        <div className="relative">
          {errors.password?.type === 'required' && (
            <span className="absolute right-4 text-red-500 text-xs underline top-1/2 transform -translate-y-1/2">
              Password is required
            </span>
          )}
          <i className={`fa ${loginSuccess ? 'fa-unlock' : 'fa-lock'} absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-700`} />
          <input
            type={isPasswordVisible ? 'text' : 'password'}
            placeholder="Password"
            {...register('password', { required: true })}
            className="w-full pl-10 pr-10 py-2 rounded-full border border-gray-200 focus:border-gray-400 focus:outline-none"
          />
          <span
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-700 cursor-pointer"
            onClick={() => setPasswordVisible(!isPasswordVisible)}
          >
            <i className={`fa ${isPasswordVisible ? 'fa-eye' : 'fa-eye-slash'}`} />
          </span>
        </div>

        <button
          type="submit"
          className="w-full bg-purple-600 text-white font-semibold py-2 rounded-full hover:bg-purple-700 transition-all"
          disabled={loading}
        >
          {!loading ? 'Sign in' : <i className="fa fa-circle-o-notch fa-spin text-xl" />}
        </button>
      </form>

      <div className="text-center mt-4 text-sm text-purple-300">
        <a className="cursor-pointer hover:underline" onClick={goToSignup}>Signup?</a>
      </div>

      <div className="text-center text-sm text-purple-300">
        <a className="cursor-pointer hover:underline" onClick={goToReset}>Forgot Password?</a>
      </div>
    </div>
    </div>
        
    </>
   
  );
};

export default LoginComponent;
