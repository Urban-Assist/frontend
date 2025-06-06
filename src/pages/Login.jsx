import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import { frontendRoutes } from '../utils/frontendRoutes';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
const googleAuthUrl=  "https://accounts.google.com/o/oauth2/auth/oauthchooseaccount?client_id=2431049737-jqqkl0607p9b98qaqgsoc1rug4e3nvpv.apps.googleusercontent.com&redirect_uri=http%3A%2F%2Fadvancedweb-vm4.research.cs.dal.ca%2Fgoogle-auth&response_type=code&scope=email%20profile%20openid%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email&access_type=offline&prompt=consent&service=lso&o2v=1&ddm=1&flowName=GeneralOAuthFlow"
  // const googleAuthUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${import.meta.env.VITE_GOOGLE_CLIENT_ID}&redirect_uri=${import.meta.env.VITE_GOOGLE_REDIRECT_URI}&response_type=code&scope=email profile openid https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email&access_type=offline&prompt=consent`;
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

//  const handleGoogleCallback = async (code) => {
//     try {
//       const AUTH_API = import.meta.env.VITE_SERVER_URL;
//       const response = await axios.get(`${AUTH_API}/auth-api/public/OAuth/callback?code=${code}`);
//       if (response.status === 200) {
//         const { token } = response.data;
//         localStorage.setItem('token', token);
//         navigate('/dashboard'); // Explicitly navigate to the dashboard
//       }
//     } catch (error) {
//       console.error('Google OAuth error:', error);
//       setError('Google login failed. Please try again.');
//     }
//   };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`/auth-api/public/authenticate`, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        const token = response.data;
        localStorage.setItem('token', token);
        const decoded = token ? jwtDecode(token) : null;
        const role = decoded?.roles[0];
        localStorage.setItem('role', role);
        
        if (role === "admin") {
          navigate(frontendRoutes.ADMIN);
        } else {
          navigate(frontendRoutes.DASHBOARD);
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.response?.data || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="flex items-center h-screen justify-center bg-gradient-to-br from-purple-100 to-yellow-100">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-96 max-w-md transition-all duration-500 ease-in-out">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Welcome Back</h1>
          <p className="text-gray-500 text-sm mt-1">Sign in to your account</p>
        </div>

        {error && (
          <div 
            className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 rounded mb-4 text-sm"
            role="alert"
            aria-live="assertive"
          >
            {error}
          </div>
        )}

        <div className="mb-6">
          <a
            href={googleAuthUrl}
            className="w-full flex items-center justify-center py-2.5 bg-white border border-gray-300 text-gray-800 rounded-lg hover:bg-gray-50 transition-colors font-medium shadow-sm"
            aria-label="Sign in with Google"
          >
            <img
              src="https://fonts.gstatic.com/s/i/productlogos/googleg/v6/16px.svg"
              alt=""
              className="w-5 h-5 mr-2"
              aria-hidden="true"
            />
            Sign in with Google
          </a>
        </div>

        <div className="relative my-6" aria-hidden="true">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">or with email</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" aria-label="Login form">
          <div>
            <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
              placeholder="you@example.com"
              required
              onChange={handleChange}
              autoComplete="email"
              aria-required="true"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
              placeholder="••••••••"
              required
              onChange={handleChange}
              autoComplete="current-password"
              aria-required="true"
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>
            <a
              href="/forgot-password"
              className="text-sm text-purple-600 hover:text-purple-800 font-medium transition-colors"
              aria-label="Forgot password?"
            >
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 mt-4 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-lg hover:opacity-95 transition-opacity font-medium"
            aria-label="Sign in"
          >
            Sign In
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-gray-600 text-sm">
            Don't have an account?{' '}
            <a 
              href="/register" 
              className="text-purple-600 hover:text-purple-800 font-medium transition-colors"
              aria-label="Sign up"
            >
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;