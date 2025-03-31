import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { frontendRoutes } from "../utils/frontendRoutes";

// Icons for different services (matching those in ServicesCards.jsx)
import { FaTools, FaBroom, FaWrench, FaBolt, FaRecycle, FaHeart } from "react-icons/fa";

// Service icons mapping (consistent with ServicesCards.jsx)
const serviceIcons = {
  "Restoration": FaRecycle,
  "House Cleaning": FaBroom,
  "Plumbing": FaWrench,
  "Electrician": FaBolt,
  "Repairs": FaTools,
  "Mental Well-being": FaHeart,
  "default": FaTools,
};

const ServiceSelectionModal = ({ isOpen, onClose }) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isClosing, setIsClosing] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        setLoading(true);
        const serviceURL = import.meta.env.VITE_SERVER_URL;
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get(`/admin/getServices`, config);
        const servicesData = response.data.message || [];
        
        setServices(servicesData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching services:", err);
        setError("Failed to load services. Please try again.");
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchServices();
      setIsClosing(false); // Reset closing state when opening
      setSelectedService(null); // Reset selected service
    }
  }, [isOpen, navigate]);

  const handleSelectService = (serviceName) => {
    setSelectedService(serviceName);
    setIsClosing(true);
    
    // Delay navigation to allow animation to complete
    setTimeout(() => {
      onClose();
      navigate(`${frontendRoutes.ADD_AVAIBILITY}?service=${encodeURIComponent(serviceName.toLowerCase())}`);
    }, 400); // Match this with animation duration
  };

  // Animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0, transition: { duration: 0.3 } }
  };

  const modalVariants = {
    hidden: { y: 50, opacity: 0, scale: 0.8 },
    visible: { 
      y: 0, 
      opacity: 1, 
      scale: 1, 
      transition: { type: "spring", damping: 25, stiffness: 500 } 
    },
    exit: { 
      y: 0, 
      opacity: 0, 
      scale: 0, 
      transition: { duration: 0.4, ease: "easeInOut" } 
    },
    selected: {
      scale: 0,
      opacity: 0,
      transition: { duration: 0.4, ease: "easeInOut" }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom) => ({
      opacity: 1,
      y: 0,
      transition: { delay: custom * 0.05 }
    }),
    selected: (isSelected) => ({
      scale: isSelected ? 1.05 : 0.95,
      opacity: isSelected ? 1 : 0.5,
      transition: { duration: 0.2 }
    })
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={!isClosing ? onClose : undefined}
        >
          <motion.div
            className="w-full max-w-md max-h-[80vh] bg-white rounded-xl shadow-2xl overflow-hidden"
            variants={modalVariants}
            initial="hidden"
            animate={isClosing ? "selected" : "visible"}
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
              <h2 className="text-xl font-bold">Select a Service</h2>
              <p className="text-indigo-100 text-sm">
                Choose which service you want to add availability for
              </p>
            </div>
            
            <div className="p-5 overflow-y-auto max-h-[60vh]">
              {loading ? (
                <div className="py-10 flex flex-col items-center justify-center">
                  <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-3"></div>
                  <p className="text-gray-500">Loading services...</p>
                </div>
              ) : error ? (
                <div className="bg-red-50 p-4 rounded-lg text-center">
                  <p className="text-red-600 mb-2">{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              ) : services.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">No services available</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {services.map((service, index) => {
                    const Icon = serviceIcons[service.serviceName] || serviceIcons.default;
                    const isSelected = selectedService === service.serviceName;
                    
                    return (
                      <motion.button
                        key={index}
                        className={`flex items-center p-4 rounded-lg border ${
                          isSelected 
                            ? "border-indigo-500 bg-indigo-50" 
                            : "border-gray-100 hover:bg-indigo-50"
                        } transition-all group`}
                        onClick={() => handleSelectService(service.serviceName)}
                        variants={itemVariants}
                        custom={isSelected ? true : index}
                        initial="hidden"
                        animate={isClosing ? "selected" : "visible"}
                        whileHover={!isClosing ? { x: 5 } : {}}
                        disabled={isClosing}
                      >
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-4 group-hover:bg-indigo-200 transition-colors">
                          <Icon className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div className="flex-1 text-left">
                          <h3 className="font-medium text-gray-800">
                            {service.serviceName}
                          </h3>
                          <p className="text-sm text-gray-500 line-clamp-1">
                            {service.description}
                          </p>
                        </div>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-gray-400 group-hover:text-indigo-500 transition-colors"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </motion.button>
                    );
                  })}
                </div>
              )}
            </div>
            
            {!isClosing && (
              <div className="p-4 border-t border-gray-100 flex justify-end">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  disabled={isClosing}
                >
                  Cancel
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ServiceSelectionModal;
