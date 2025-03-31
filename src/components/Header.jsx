import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { frontendRoutes } from "../utils/frontendRoutes";
import ServiceSelectionModal from "./ServiceSelectionModal";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [showServiceModal, setShowServiceModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    setIsLoggedIn(!!token);
    setUserRole(role || '');
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setIsLoggedIn(false);
    setUserRole('');
    navigate(frontendRoutes.LOGIN);
  };

  const navigateToSettings = () => {
    navigate(frontendRoutes.SETTING);
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
        <Link 
          to={frontendRoutes.HOME} 
          className="no-underline"
          aria-label="Urban Assist Home"
        >
          <div className="font-black text-blue-900 text-2xl flex items-center">
            Urban Assist
            <span className="w-3 h-3 rounded-full bg-purple-600 ml-2" aria-hidden="true"></span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav 
          className="hidden lg:flex items-center space-x-10"
          aria-label="Main navigation"
        >
          <Link
            to={frontendRoutes.DASHBOARD}
            className={getNavLinkClass(frontendRoutes.DASHBOARD)}
            aria-current={location.pathname === frontendRoutes.DASHBOARD ? "page" : undefined}
          >
            {userRole === 'provider' ? 'Services' : 'Book a Service'}
          </Link>
          <Link
            to={frontendRoutes.MYBOOKING}
            className={getNavLinkClass(frontendRoutes.EXAMPLE)}
            aria-current={location.pathname === frontendRoutes.MYBOOKING ? "page" : undefined}
          >
            My bookings
          </Link>
          <Link
            to="https://mail.google.com/mail/?view=cm&fs=1&to=admin@urbanassist.com" 
            target="_blank"
            rel="noopener noreferrer"
            className={getNavLinkClass(frontendRoutes.EXAMPLE)}
            aria-label="Report an issue (opens in new tab)"
          >
            Report
          </Link>
          <Link
            to="https://mail.google.com/mail/?view=cm&fs=1&to=support.canada@urbanassist.com" 
            target="_blank"
            rel="noopener noreferrer"
            className={getNavLinkClass(frontendRoutes.EXAMPLE)}
            aria-label="Contact us (opens in new tab)"
          >
            Contact us
          </Link>
          
          {isLoggedIn && userRole === 'user' && (
            <button 
              onClick={navigateToSettings}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center"
              aria-label="Profile settings"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6 text-gray-700" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
                aria-hidden="true"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
                />
              </svg>
            </button>
          )}
          
          {isLoggedIn && userRole === 'provider' && (
            <button 
              onClick={() => setShowServiceModal(true)} 
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-gray-50 rounded-xl flex items-center gap-2"
              aria-label="Add availability"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5" 
                viewBox="0 0 20 20" 
                fill="currentColor"
                aria-hidden="true"
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

          {isLoggedIn ? (
            <button 
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-gray-50 rounded-xl flex items-center gap-2"
              aria-label="Logout"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5" 
                viewBox="0 0 20 20" 
                fill="currentColor"
                aria-hidden="true"
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
              <button 
                className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-gray-50 rounded-xl flex items-center gap-2"
                aria-label="Login"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
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

        {/* Mobile menu button */}
        <button
          className="lg:hidden flex flex-col ml-4"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
        >
          <span className="w-6 h-1 rounded-full bg-purple-800 mb-1" aria-hidden="true"></span>
          <span className="w-6 h-1 rounded-full bg-purple-800 mb-1" aria-hidden="true"></span>
          <span className="w-6 h-1 rounded-full bg-purple-800 mb-1" aria-hidden="true"></span>
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div 
          id="mobile-menu"
          className="lg:hidden w-full bg-white shadow-md absolute top-16 left-0 py-4"
          role="navigation"
          aria-label="Mobile navigation"
        >
          <nav className="flex flex-col items-center space-y-4">
            <Link
              to={frontendRoutes.DASHBOARD}
              className={getNavLinkClass(frontendRoutes.DASHBOARD)}
              onClick={() => setIsOpen(false)}
              aria-current={location.pathname === frontendRoutes.DASHBOARD ? "page" : undefined}
            >
              {userRole === 'provider' ? 'Services' : 'Book a Service'}
            </Link>
            <Link
              to={frontendRoutes.HOME}
              className={getNavLinkClass(frontendRoutes.HOME)}
              onClick={() => setIsOpen(false)}
              aria-current={location.pathname === frontendRoutes.HOME ? "page" : undefined}
            >
              My bookings
            </Link>
            <Link
              to={frontendRoutes.HOME}
              className={getNavLinkClass(frontendRoutes.HOME)}
              onClick={() => setIsOpen(false)}
            >
              Favorites
            </Link>
            <Link
              to={frontendRoutes.HOME}
              className={getNavLinkClass(frontendRoutes.HOME)}
              onClick={() => setIsOpen(false)}
            >
              Contact us
            </Link>

            {isLoggedIn && userRole === 'user' && (
              <button 
                onClick={() => {
                  navigateToSettings();
                  setIsOpen(false);
                }}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors duration-200"
                aria-label="Profile settings"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
                  />
                </svg>
                <span>Profile Settings</span>
              </button>
            )}

            {isLoggedIn && userRole === 'provider' && (
              <button 
                onClick={() => {
                  setShowServiceModal(true);
                  setIsOpen(false);
                }}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-gray-50 rounded-xl flex items-center gap-2"
                aria-label="Add availability"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                  aria-hidden="true"
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

            {isLoggedIn ? (
              <button 
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-gray-50 rounded-xl flex items-center gap-2"
                aria-label="Logout"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                  aria-hidden="true"
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
                <button 
                  className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-gray-50 rounded-xl flex items-center gap-2"
                  aria-label="Login"
                  onClick={() => setIsOpen(false)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
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

      <ServiceSelectionModal 
        isOpen={showServiceModal} 
        onClose={() => setShowServiceModal(false)} 
      />
    </header>
  );
};

export default Header;