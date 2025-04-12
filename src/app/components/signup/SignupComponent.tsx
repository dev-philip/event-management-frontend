import React, { useState, useEffect } from 'react';
import styles from './SignupComponent.module.css'; 

import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { registerUser, getRoles, getUniversities } from '@/app/services/signupService';

type FormValues = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  userRole: string;
  userUniversity: string;
};

const SignupComponent: React.FC = () => {
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormValues>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [roles, setRoles] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [showUniversity, setShowUniversity] = useState(true);

  const selectedRole = watch('userRole');

  useEffect(() => {
    getRoles().then(res => setRoles(res.roles));
    getUniversities().then(res => setUniversities(res.getAllUniResponse));
  }, []);

  useEffect(() => {
    setShowUniversity(selectedRole !== '1'); // assuming '1' is super admin
  }, [selectedRole]);

  const onSubmit = async (data: FormValues) => {
    if (!data.userRole) {
      toast.error('Role is required');
      return;
    }
    if (showUniversity && !data.userUniversity) {
      toast.error('University is required');
      return;
    }

    setLoading(true);
    try {
      const res = await registerUser(data);

      console.log(res);
      if (res.status) {
        toast.success(res.message + ". You can sign in now" );
        navigate('/login');
        // window.location.replace("/");
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      console.error(err);
      toast.error('Error during registration');
    } finally {
      setLoading(false);
    }
  };

  
    const goToLogin = () => {
        navigate('/login');
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

      <h2 className="text-2xl font-bold text-center text-purple-700 mb-6">Sign Up</h2>

      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        {/* first name */}
        <div className="relative">
          {errors.firstName?.type === 'required' && (
            <span className="absolute right-4 text-red-500 text-xs underline top-1/2 transform -translate-y-1/2">
              First Name is required
            </span>
          )}
          <i className="fa fa-user-o absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-700" />
          <input
            placeholder="First Name"
            {...register('firstName', { required: true})}
            className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:border-gray-400 focus:outline-none"
          />
          {/* Last name */}
        </div>
        <div className="relative">
          {errors.lastName?.type === 'required' && (
            <span className="absolute right-4 text-red-500 text-xs underline top-1/2 transform -translate-y-1/2">
              Last Name is required
            </span>
          )}
          <i className="fa fa-user-o absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-700" />
          <input
            placeholder="Last Name"
            {...register('lastName', { required: true})}
            className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:border-gray-400 focus:outline-none"
          />
        </div>
        {/* Email */}
        <div className="relative">
          {errors.email?.type === 'required' && (
            <span className="absolute right-4 text-red-500 text-xs underline top-1/2 transform -translate-y-1/2">
              Email is required
            </span>
          )}
          <i className="fa fa-envelope-o absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-700" />
          <input
            type="name"
            placeholder="Email"
            {...register('email', { required: true, pattern: /^\S+@\S+$/i })}
            className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:border-gray-400 focus:outline-none"
          />
        </div>
        {/* Password */}
        <div className="relative">
          {errors.password?.type === 'required' && (
            <span className="absolute right-4 text-red-500 text-xs underline top-1/2 transform -translate-y-1/2">
              Password is required
            </span>
          )}
          <i className={`fa fa-lock absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-700`} />
          <input
            type={isPasswordVisible ? 'text' : 'password'}
            placeholder="Password"
            {...register('password', { required: true })}
            className="w-full pl-10 pr-10 py-2 rounded-full border border-gray-200 focus:border-gray-400 focus:outline-none"
          />
          <span
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-700 cursor-pointer"
            onClick={() => setIsPasswordVisible(!isPasswordVisible)}
          >
            <i className={`fa ${isPasswordVisible ? 'fa-eye' : 'fa-eye-slash'}`} />
          </span>
        </div>

        <input type="hidden" {...register('userRole')} value="2" />

        {/* Universities */}

        <div className="relative">
          <select className={`${styles.un} cursor-pointer`} {...register('userUniversity')}>
            <option value="">Select University</option>
            {universities.map((uni: any) => (
              <option key={uni.uni_id} value={uni.uni_id}>{uni.name}</option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-purple-600 text-white font-semibold py-2 rounded-full hover:bg-purple-700 transition-all"
          disabled={loading}
        >
          {!loading ? 'Sign up' : <i className="fa fa-circle-o-notch fa-spin text-xl" />}
        </button>
      </form>

      <p className={styles.signup}><a className="cursor-pointer" onClick={goToLogin}>Log In?</a></p>
      <p className={styles.forgot}><a className="cursor-pointer" onClick={goToReset}>Forgot Password?</a></p>

      </div>
      </div>

    </>
  );
};

export default SignupComponent;
