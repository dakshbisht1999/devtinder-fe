// src/components/GoogleLoginBtn.jsx
import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import axiosInstance from '../utils/axios';
import { markAuthenticatedSession } from '../utils/authSession';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import getGreeting from '../utils/getGreeting';
import { handleApiError } from '../utils/errorHandler';
import { addUser } from '../utils/userSlice';
import { useNavigate } from 'react-router-dom';

const GoogleLoginBtn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse) => {
    // credentialResponse.credential contains the Google ID Token (JWT)
    const token = credentialResponse.credential;

    try {
      const res = await axiosInstance.post(
        "/auth/google", 
        { token }
      );
      
      if (res.data.success) {
        // console.log('Login successful:', res.data.data);
        markAuthenticatedSession();
        dispatch(addUser(res.data.data));
        toast.success(`${getGreeting()}, ${res.data.data?.firstName || "welcome back"}!`);
        navigate("/feed")
      } else {
        console.error('Login failed:', res.data.message);
      }
    } catch (err) {
      console.error('Error sending token to backend:', err);
      handleApiError(err)
    }
  };

  const handleError = () => {
    console.log('Google Sign-In Failed');
  };

  return (
    <div className="flex items-center justify-center">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
        ux_mode="popup" // Forces a popup window on top of your app
        useOneTap // Optional: Shows the sleek top-right prompt if user is logged into Google
      />
    </div>
  );
};

export default GoogleLoginBtn;