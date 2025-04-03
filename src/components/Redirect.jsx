import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Redirect() {
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleGoogleCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');

      if (!code) {
        setError('Authorization code not found.');
        return;
      }

      try {
        const AUTH_API = import.meta.env.VITE_SERVER_URL;
        const response = await axios.get(`${AUTH_API}/auth-api/public/OAuth/callback?code=${code}`);

        if (response.status === 200) {
          const { token, redirectUrl } = response.data;

          // Store the token in localStorage
          localStorage.setItem('token', token);

          // Navigate to the redirect URL or fallback to the dashboard
          navigate(redirectUrl || '/dashboard');
        }
      } catch (error) {
        console.error('Google OAuth error:', error);
        setError('Google login failed. Please try again.');
      }
    };

    handleGoogleCallback();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen">
      {error ? (
        <div className="text-red-500 text-center">
          <p>{error}</p>
        </div>
      ) : (
        <div className="text-gray-700 text-center">
          <p>Processing your login...</p>
        </div>
      )}
    </div>
  );
}

export default Redirect;