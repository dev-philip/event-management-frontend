import React, { useEffect, useState  } from 'react';
import styles from './ProfilePageComponent.module.css'; 


import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import axios from 'axios';
import { isJwtTokenExpired } from '@/app/utils/auth';
import { useNavigate } from 'react-router-dom';
import { addLoginUserToState } from '@/app/features/user/userSlice';
import { toast } from 'react-toastify';

const defaultProfileImage = 'https://cdn-icons-png.flaticon.com/512/3237/3237472.png';

const ProfilePageComponent: React.FC = () => {

  const user = useSelector((state: RootState) => state.user);
  const [userDbDetails, setUserDbDetails] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState<string>(defaultProfileImage);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const { register, setValue, handleSubmit } = useForm();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if(isJwtTokenExpired()){ //if true => Check If user is logged In
      navigate('/login');
      return;
    }

    const storedUserData = JSON.parse(localStorage.getItem('currentUser') as string);
    
        if (storedUserData) {
          dispatch(addLoginUserToState(storedUserData));
        }

    axios.get(`${import.meta.env.VITE_API_BASE_URL}/profile/${storedUserData.user_id}`)
    // axios.get(`${import.meta.env.VITE_API_BASE_URL}/profile/11`)
      .then(res => {
        const data = res.data.user[0];
        setUserDbDetails(data);
        setValue('firstName', data.user_firstName);
        setValue('lastName', data.user_lastName);
        setValue('about', data.about);
        setValue('email', data.user_email);
        setValue('userRole', data.user_level);
        setValue('university', data.name);
        setSelectedImage(data.profile_photo ? `${import.meta.env.VITE_API_URL}/${data.profile_photo}` : defaultProfileImage);
      })
      .catch(err => console.error(err));
  }, []);

  const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = e => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data: any) => {
    if (!userDbDetails) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('user_id', userDbDetails.user_id);
    formData.append('profileAbout', data.about);
    if (selectedFile) {
      formData.append('file', selectedFile);
    }

    axios.patch(`${import.meta.env.VITE_API_BASE_URL}/profile/create/${userDbDetails.user_id}`, formData)
      .then((res) => {
        toast.success(res.data.message);
        window.location.replace("/profile"); 
      })
      .catch(err => alert('Unable to Update Profile'))
      .finally(() => setLoading(false));
  };

  if (!userDbDetails) return <p>Loading profile...</p>;

  const ola = () => {
    alert(user.user_id);
    console.log(user);
  }
  
  return (
    <>
    {/* <button onClick={ola}>Click me</button> */}
      <div className={`${styles.profilesection} container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center`}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-12">
            <div className="border-b border-gray-900/10 pb-12">
              <h2 className="text-base font-semibold leading-7 text-gray-900">Profile</h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">This information will be displayed publicly so be careful what you share.</p>

              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label className="block text-sm font-medium text-gray-900">First name</label>
                  <input {...register('firstName')} disabled className="pl-1 capitalize cursor-not-allowed block w-full rounded-md border-gray-300 shadow-sm" />
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-sm font-medium text-gray-900">Last name</label>
                  <input {...register('lastName')} disabled className="pl-1 capitalize cursor-not-allowed block w-full rounded-md border-gray-300 shadow-sm" />
                </div>

                <div className="col-span-full">
                  <label className="block text-sm font-medium text-gray-900">About</label>
                  <textarea {...register('about')} rows={3} className="pl-1 block w-full rounded-md border-gray-300 shadow-sm" />
                  <p className="mt-3 text-sm text-gray-600">Write a few sentences about yourself.</p>
                </div>

                <div className="col-span-full">
                  <label className="block text-sm font-medium text-gray-900">Profile Picture</label>
                  <div className="mt-2 flex items-center gap-x-3">
                    <img className="h-12 w-12 rounded-full object-cover" src={selectedImage} alt="Profile" />
                    <label className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 cursor-pointer">
                      Upload a Photo
                      <input type="file" onChange={onImageChange} className="sr-only" />
                    </label>
                  </div>
                </div>

                <div className="col-span-full">
                  <label className="block text-sm font-medium text-gray-900">Email address</label>
                  <input {...register('email')} disabled className="pl-1 cursor-not-allowed block w-full rounded-md border-gray-300 shadow-sm" />
                </div>

                <input type="hidden" {...register('userRole')} value="2" />

                {/* <div className="col-span-full">
                  <label className="block text-sm font-medium text-gray-900">Role</label>
                  <input {...register('userRole')} disabled className="cursor-not-allowed block w-full rounded-md border-gray-300 shadow-sm" />
                </div> */}

                <div className="col-span-full">
                  <label className="block text-sm font-medium text-gray-900">University</label>
                  <input {...register('university')} disabled className="pl-1 cursor-not-allowed block w-full rounded-md border-gray-300 shadow-sm" />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-x-6">
            <button type="submit" disabled={loading} className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500">
              {loading ? (
                <i className="fa fa-circle-o-notch fa-spin" style={{ fontSize: 24 }}></i>
              ) : (
                'Update Profile'
              )}
            </button>
          </div>
        </form>
      </div>
    </>
   
  );
};

export default ProfilePageComponent;
