import React, { useState } from 'react';
import styles from './ResetComponent.module.css'; 

import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';

import { saveJwtToken, getJwtTokenData } from '../../utils/auth';
import { useDispatch } from 'react-redux';
// import { addLoginUserToState } from '../../store/user/userSlice';
import { loginUser } from '@/app/services/loginService';


const ResetComponent: React.FC = () => {

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
        // dispatch(addLoginUserToState({ user: userData }));
        localStorage.setItem('currentUser', JSON.stringify(userData));

        if (userData.user_level === 'super admin' && !userData.uni_Id) {
          navigate('/dashboard');
          // openSchoolModal(); // modal trigger if needed
        } else {
          navigate('/dashboard');
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
  
  return (
    <>
      <div id="myModal" className={`${styles.modal} animate__animated animate__fadeIn`}>
          <div className={`${styles.main} ${styles['auth-signin']}`}>
            {/* <div className={styles['modal-menubar']}>
              <span className={styles.homeIcon} title="Home" onClick={() => navigate('/')}>
                <i className="fa fa-home" aria-hidden="true"></i>
              </span>
            </div> */}

            <p className={styles.sign}>Reset Password</p>

            <form className={styles.form1} onSubmit={handleSubmit(onSubmit)}>
              <div className={styles['input-container']}>
                <span className={styles['input-icon']}>
                  {errors.email?.type === 'required' && (
                    <span className={styles['input-error']}>Email is required</span>
                  )}
                  <i className="fa fa-envelope-o" aria-hidden="true"></i>
                </span>
                <input
                  type="email"
                  placeholder="Email"
                  {...register('email', { required: true, pattern: /^\S+@\S+$/i })}
                  className={styles.un}
                />
              </div>

              <div className={styles['input-container']}>
                <span className={styles['input-icon']}>
                  {errors.password?.type === 'required' && (
                    <span className={styles['input-error']}>Password is required</span>
                  )}
                  <i className={`fa ${loginSuccess ? 'fa-unlock' : 'fa-lock'}`} />
                </span>
                <input
                  type={isPasswordVisible ? 'text' : 'password'}
                  placeholder="Password"
                  {...register('password', { required: true })}
                  className={styles.pass}
                />
                <span className={styles['eye-password']} onClick={() => setPasswordVisible(!isPasswordVisible)}>
                  <i className={`fa ${isPasswordVisible ? 'fa-eye' : 'fa-eye-slash'}`} />
                </span>
              </div>

              <button type="submit" className={styles.submit} disabled={loading}>
                {!loading ? 'Sign in' : <i className="fa fa-circle-o-notch fa-spin" style={{ fontSize: 24 }} />}
              </button>
            </form>

            <p className={styles.signup}><a href="/signup">Signup?</a></p>
            <p className={styles.forgot}><a href="/resetpassword">Forgot Password?</a></p>
          </div>
      </div>
        
    </>
   
  );
};

export default ResetComponent;
