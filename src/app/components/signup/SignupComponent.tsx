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
        toast.success(res.message + ". You can signin now" );
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
    <div id="myModal" className={`modal animate__animated animate__fadeIn ${styles.modal}`}>
      <div className={`${styles.main} ${styles['auth-signup']}`}>

       {path !== "/" && (
            <div className={styles['modal-menubar']}>
              <span className={styles.homeIcon} onClick={() => navigate('/')}>
                <i className="fa fa-home" aria-hidden="true"></i>
              </span>
              <span className={styles.backIcon} onClick={() => navigate(-1)}>
                <i className="fa fa-arrow-left" aria-hidden="true"></i>
              </span>
            </div>
        )}
      

        <p className={styles.sign}>Sign Up</p>
        <form className={styles.form1} onSubmit={handleSubmit(onSubmit)}>

          {/* First Name */}
          <div className={styles['input-container']}>
            <span className={styles['input-icon']}>
              {errors.firstName && <span className={styles['input-error']}>Firstname is required</span>}
              <i className="fa fa-user-o" />
            </span>
            <input
              className={styles.un}
              placeholder="First Name"
              {...register('firstName', { required: true })}
            />
          </div>

          {/* Last Name */}
          <div className={styles['input-container']}>
            <span className={styles['input-icon']}>
              {errors.lastName && <span className={styles['input-error']}>Lastname is required</span>}
              <i className="fa fa-user-o" />
            </span>
            <input
              className={styles.un}
              placeholder="Last Name"
              {...register('lastName', { required: true })}
            />
          </div>

          {/* Email */}
          <div className={styles['input-container']}>
            <span className={styles['input-icon']}>
              {errors.email?.type === 'required' && <span className={styles['input-error']}>Email is required</span>}
              {errors.email?.type === 'pattern' && <span className={styles['input-error']}>Invalid email</span>}
              <i className="fa fa-envelope-o" />
            </span>
            <input
              className={styles.un}
              type="email"
              placeholder="Email"
              {...register('email', { required: true, pattern: /^\S+@\S+$/i })}
            />
          </div>

          {/* Password */}
          <div className={styles['input-container']}>
            <span className={styles['input-icon']}>
              {errors.password && <span className={styles['input-error']}>Password is required</span>}
              <i className="fa fa-lock" />
            </span>
            <input
              className={styles.pass}
              type={isPasswordVisible ? 'text' : 'password'}
              placeholder="Password"
              {...register('password', { required: true })}
            />
            <span className={styles['eye-password']} onClick={() => setIsPasswordVisible(!isPasswordVisible)}>
              <i className={`fa ${isPasswordVisible ? 'fa-eye' : 'fa-eye-slash'}`} />
            </span>
          </div>

          {/* Role */}
          <input type="hidden" {...register('userRole')} value="2" />

          {/* <div className={styles['input-container']}>
            <span className={styles['input-icon']}>
              <i className="fa fa-shield" />
            </span>
            <select className={`${styles.un} cursor-pointer`} {...register('userRole')}>
              <option value="">Select Role</option>
              {roles.map((role: any) => (
                <option key={role.role_id} value={role.role_id}>{role.role_name}</option>
              ))}
            </select>
          </div> */}

          {/* University */}
          {showUniversity && (
            <div className={styles['input-container']}>
              <span className={styles['input-icon']}>
                <i className="fa fa-graduation-cap" />
              </span>
              <select className={`${styles.un} cursor-pointer`} {...register('userUniversity')}>
                <option value="">Select University</option>
                {universities.map((uni: any) => (
                  <option key={uni.uni_id} value={uni.uni_id}>{uni.name}</option>
                ))}
              </select>
            </div>
          )}

          <button type="submit" className={styles.submit} disabled={loading}>
            {!loading ? 'Sign Up' : <i className="fa fa-circle-o-notch fa-spin" style={{ fontSize: 24 }} />}
          </button>
        </form>

        <p className={styles.signup}><a className="cursor-pointer" onClick={goToLogin}>Log In?</a></p>
        <p className={styles.forgot}><a className="cursor-pointer" onClick={goToReset}>Forgot Password?</a></p>
      </div>
    </div>
  );
};

export default SignupComponent;
