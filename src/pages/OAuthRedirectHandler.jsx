// src/OAuthRedirectHandler.js
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";

const OAuthRedirectHandler = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');

    if (token) {
      
      localStorage.setItem('token', token);
      
      const decoded = token ? jwtDecode(token) : null;
      const role = decoded?.roles[0];
      console.log(role)
      localStorage.setItem('role', role);
      navigate('/dashboard');
    } else {
      
      console.error('No token found in the URL');
      navigate('/login'); 
    }
  }, [location, navigate]);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
};

export default OAuthRedirectHandler;