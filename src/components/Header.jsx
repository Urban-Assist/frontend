import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { frontendRoutes } from "../utils/frontendRoutes";
import ServiceSelectionModal from "./ServiceSelectionModal";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false); // State for mobile menu toggle
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status
  const [userRole, setUserRole] = useState(''); // State to track user role
  const [showServiceModal, setShowServiceModal] = useState(false); // State for service selection modal
  const navigate = useNavigate();

  // Check if user is logged in on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    setIsLoggedIn(!!token);
    setUserRole(role || '');
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear token from localStorage
    localStorage.removeItem('role'); // Clear role from localStorage
    setIsLoggedIn(false); // Update login state
    setUserRole(''); // Reset user role
    navigate(frontendRoutes.LOGIN); // Navigate to login page
  };

  const getNavLinkClass = (path) => {
    const isActive = location.pathname === path;
    return `${
      isActive
        ? "border-indigo-500 text-gray-900 font-semibold "
        : "border-transparent text-gray-900 hover:text-gray-900 hover:border-indigo-500 hover:font-bold "
    } inline-flex items-center px-3 pt-1 border-b-2 text-lg font-medium transition-colors duration-200 `;
  };

  return (
    <header className="h-16 sm:h-20 flex items-center bg-[rgb(252,250,250)] font-montserrat shadow-sm fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto px-4 sm:px-12 flex items-center justify-between">
        {/* Logo */}
        <Link to={frontendRoutes.HOME} className="no-underline">
          <div className="font-black text-blue-900 text-2xl flex items-center">
            Urban Assist
            <span className="w-3 h-3 rounded-full bg-purple-600 ml-2"></span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-10">
          <Link
            to={frontendRoutes.DASHBOARD}
            className={getNavLinkClass(frontendRoutes.DASHBOARD)}
          >
            {userRole === 'provider' ? 'Services' : 'Book a Service'}
          </Link>
          <Link
            to={frontendRoutes.MYBOOKING}
            className={getNavLinkClass(frontendRoutes.EXAMPLE)}
          >
            My bookings
          </Link>
          <Link
            to={frontendRoutes.HOME}
            className={getNavLinkClass(frontendRoutes.EXAMPLE)}
          >
            Report
          </Link>
          <Link
            to={frontendRoutes.HOME}
            className={getNavLinkClass(frontendRoutes.EXAMPLE)}
          >
            Contact us
          </Link>
          
          {/* Add Availability Button for Providers */}
          {isLoggedIn && userRole === 'provider' && (
            <button 
              onClick={() => setShowServiceModal(true)} 
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-gray-50 rounded-xl flex items-center gap-2"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path 
                  fillRule="evenodd" 
                  d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" 
                  clipRule="evenodd"
                />
              </svg>
              <span>Add Availability</span>
            </button>
          )}

          {/* Login/Logout Button */}
          {isLoggedIn ? (
            <button 
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-gray-50 rounded-xl flex items-center gap-2"
            >
              {/* Logout Icon */}
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path 
                  fillRule="evenodd" 
                  d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" 
                  clipRule="evenodd"
                />
              </svg>
              <span>Logout</span>
            </button>
          ) : (
            <Link to={frontendRoutes.LOGIN}>
              <button className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-gray-50 rounded-xl flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Login</span>
              </button>
            </Link>
          )}
        </nav>

        <button
          className="lg:hidden flex flex-col ml-4"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="w-6 h-1 rounded-full bg-purple-800 mb-1"></span>
          <span className="w-6 h-1 rounded-full bg-purple-800 mb-1"></span>
          <span className="w-6 h-1 rounded-full bg-purple-800 mb-1"></span>
        </button>
      </div>

      {isOpen && (
        <div className="lg:hidden w-full bg-white shadow-md absolute top-16 left-0 py-4">
          <nav className="flex flex-col items-center space-y-4">
            <Link
              to={frontendRoutes.DASHBOARD}
              className={getNavLinkClass(frontendRoutes.DASHBOARD)}
            >
              {userRole === 'provider' ? 'Services' : 'Book a Service'}
            </Link>
            <Link
              to={frontendRoutes.HOME}
              className={getNavLinkClass(frontendRoutes.HOME)}
            >
              My bookings
            </Link>
            <Link
              to={frontendRoutes.HOME}
              className={getNavLinkClass(frontendRoutes.HOME)}
            >
              Favorites
            </Link>
            <Link
              to={frontendRoutes.HOME}
              className={getNavLinkClass(frontendRoutes.HOME)}
            >
              Contact us
            </Link>

            {/* Add Availability Button for Mobile */}
            {isLoggedIn && userRole === 'provider' && (
              <button 
                onClick={() => setShowServiceModal(true)}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-gray-50 rounded-xl flex items-center gap-2"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" 
                    clipRule="evenodd"
                  />
                </svg>
                <span>Add Availability</span>
              </button>
            )}

            {/* Mobile Login/Logout Button */}
            {isLoggedIn ? (
              <button 
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-gray-50 rounded-xl flex items-center gap-2"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" 
                    clipRule="evenodd"
                  />
                </svg>
                <span>Logout</span>
              </button>
            ) : (
              <Link to={frontendRoutes.LOGIN}>
                <button className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-gray-50 rounded-xl flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Login</span>
                </button>
              </Link>
            )}
          </nav>
        </div>
      )}

      {/* Service Selection Modal */}
      <ServiceSelectionModal 
        isOpen={showServiceModal} 
        onClose={() => setShowServiceModal(false)} 
      />
    </header>
  );
};

export default Header;