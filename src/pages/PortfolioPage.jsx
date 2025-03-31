import { useParams, useLocation } from "react-router-dom";
import { FaStar, FaPhoneAlt, FaEnvelope, FaLinkedin, FaMapMarkerAlt, FaBriefcase, FaQuoteRight, FaArrowLeft, FaArrowRight, FaTimes } from "react-icons/fa";
import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function PortfolioPage() {
  const { Id } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const service = queryParams.get('service');
  const [provider, setProvider] = useState(null);
  const [providerID, setProviderID] = useState(null);
  const [isCarouselOpen, setCarouselOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");
  const server = import.meta.env.VITE_SERVER_URL;
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchProvider = async () => {
      try {
        setLoading(true);
      
        const response = await axios.get(`/api/provider/profile/${Id}?service=${service}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 200) {
          setProvider(response.data); 
           
          if (response.data?.email) {
            await fetchProvidersUserID(response.data.email);
          }
        } else {
          throw new Error("Failed to fetch provider data");
        }
      } catch (error) {
        console.error("Error fetching provider:", error);
        setError("Unable to load provider information. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    const fetchProvidersUserID = async (email) => {
      try {
        const user = await axios.post(
          `/api/profile/getUserInfo`,
          { email: email },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        setProviderID(user.data.id);
        
        if (user.data.id) {
          await fetchReviews(user.data.id);
        }
      } catch (error) {
        console.error("Error fetching provider ID:", error);
      }
    };

    const fetchReviews = async (id) => {
      try {
        const response = await axios.get(`/reviews/getReviews/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 200) {
          setReviews(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching provider reviews:", error);
      }
    };

    fetchProvider();
  }, [Id, service, token, server]);

  const openCarousel = (index) => {
    setCurrentImageIndex(index);
    setCarouselOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeCarousel = () => {
    setCarouselOpen(false);
    document.body.style.overflow = 'auto';
  };

  const nextImage = () => {
    if (provider.workImages && provider.workImages.length > 0) {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === provider.workImages.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  const prevImage = () => {
    if (provider.workImages && provider.workImages.length > 0) {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === 0 ? provider.workImages.length - 1 : prevIndex - 1
      );
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isCarouselOpen) return;
      
      if (e.key === 'ArrowRight') {
        nextImage();
      } else if (e.key === 'ArrowLeft') {
        prevImage();
      } else if (e.key === 'Escape') {
        closeCarousel();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCarouselOpen, provider]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500" aria-label="Loading"></div>
      </div>
    );
  }

  if (error || !provider) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Provider Not Found</h2>
          <p className="text-gray-600 mb-6">{error || "We couldn't find the provider you're looking for."}</p>
          <Link 
            to="/" 
            className="inline-block px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-all"
            aria-label="Return to home page"
          >
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  const formatPrice = (price) => {
    if (!price) return "Price unavailable";
    return typeof price === 'string' ? price : `$${price.toFixed(2)}`;
  };

  return (
    <div className="bg-gray-100 min-h-screen py-12" role="main">
      <div className="max-w-5xl mx-auto bg-white rounded-xl overflow-hidden shadow-lg">
        {/* Hero Section */}
        <div className="relative h-64 bg-gradient-to-r from-cyan-100 via-pink-100 to-yellow-100">
          <div className="absolute -bottom-16 left-12">
            <div className="h-32 w-32 rounded-full border-4 border-white overflow-hidden bg-white shadow-xl">
              {provider.profilePic ? (
                <img
                  src={provider.profilePic}
                  alt={`Profile picture of ${provider.firstName} ${provider.lastName}`}
                  className="w-full h-full object-cover"
                  aria-labelledby="provider-name"
                />
              ) : (
                <div 
                  className="h-full w-full flex items-center justify-center bg-gray-200 text-gray-500 text-2xl font-bold"
                  aria-hidden="true"
                >
                  {provider.firstName?.[0]}{provider.lastName?.[0]}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Profile Info */}
        <div className="pt-20 px-12 pb-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-end">
            <div className="mb-6 md:mb-0">
              <h1 id="provider-name" className="text-3xl font-bold text-gray-800">
                {provider.firstName || ''} {provider.lastName || ''}
              </h1>
              <div className="flex items-center mt-2 text-gray-600">
                <FaBriefcase className="mr-2 text-indigo-500" aria-hidden="true" />
                <span>{service || "Service Provider"}</span>
              </div>
            </div>
            <div className="flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0 md:space-x-4">
              <div className="flex items-center px-4 py-2 bg-gray-100 rounded-full">
                <FaStar className="text-yellow-500 mr-2" aria-hidden="true" />
                <span className="font-semibold">{provider.stars || "New"}</span>
              </div>
              <div className="px-4 py-2 bg-indigo-100 text-indigo-700 font-semibold rounded-full">
                {formatPrice(provider.price)}
              </div>
            </div>
          </div>

          {/* Description */}
          <section aria-labelledby="about-heading" className="mt-8 p-6 bg-gray-100 rounded-lg border border-gray-100">
            <h2 id="about-heading" className="text-xl font-semibold text-gray-800 mb-3">About</h2>
            <p className="text-gray-600 leading-relaxed">
              {provider.description || "No description provided."}
            </p>
          </section>

          {/* Location */}
          {provider.address && (
            <div className="mt-6 flex items-start">
              <FaMapMarkerAlt className="text-red-500 mt-1 mr-3 flex-shrink-0" aria-hidden="true" />
              <span className="text-gray-600">{provider.address}</span>
            </div>
          )}
        </div>

        {/* Content Sections */}
        <div className="border-t border-gray-200">
          <div className="px-12 py-8">
            {/* Work Samples */}
            <section aria-labelledby="work-samples-heading" className="mb-12">
              <h2 id="work-samples-heading" className="text-2xl font-bold text-gray-800 mb-6">
                Work Samples
              </h2>
              
              {provider.workImages && provider.workImages.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" role="list">
                  {provider.workImages.map((image, index) => (
                    <div 
                      key={index} 
                      className="cursor-pointer group relative rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
                      onClick={() => openCarousel(index)}
                      role="listitem"
                      tabIndex="0"
                      aria-label={`View work sample ${index + 1}`}
                      onKeyDown={(e) => e.key === 'Enter' && openCarousel(index)}
                    >
                      <img
                        src={image}
                        alt={`Work sample ${index + 1}`}
                        className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 bg-gray-100 rounded-lg">
                  <p className="text-gray-500">No work samples available</p>
                </div>
              )}
            </section>

            {/* Testimonials */}
            <section aria-labelledby="testimonials-heading" className="mb-12">
              <h2 id="testimonials-heading" className="text-2xl font-bold text-gray-800 mb-6">
                Client Testimonials
              </h2>
              
              {reviews && reviews.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-6" role="list">
                  {reviews.map((review, index) => (
                    <article 
                      key={review.id || index} 
                      className="bg-white rounded-xl p-6 relative shadow-md hover:shadow-xl transition-all border border-gray-100 overflow-hidden group"
                      role="listitem"
                    >
                      <div className="absolute top-4 right-4 text-indigo-100" aria-hidden="true">
                        <FaQuoteRight size={36} />
                      </div>
                      
                      <div 
                        className="flex text-yellow-500 mb-3" 
                        aria-label={`Rating: ${review.rating || 0} out of 5 stars`}
                      >
                        {[...Array(5)].map((_, i) => (
                          <FaStar 
                            key={i} 
                            className={i < (review.rating || 0) ? "text-yellow-500" : "text-gray-300"} 
                            aria-hidden="true"
                          />
                        ))}
                      </div>
                      
                      <blockquote className="text-gray-700 mb-4 relative z-10">
                        "{review.review || "Great service!"}"
                      </blockquote>
                      
                      <div className="flex items-center mt-4 pt-4 border-t border-gray-100">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-indigo-100 mr-3 flex-shrink-0">
                          {review.userDetails?.profilePicUrl ? (
                            <img 
                              src={review.userDetails.profilePicUrl} 
                              alt={`${review.userDetails.firstName || 'User'} profile`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div 
                              className="w-full h-full flex items-center justify-center bg-indigo-100 text-indigo-500 font-semibold"
                              aria-hidden="true"
                            >
                              {review.userDetails?.firstName?.[0] || 'A'}
                            </div>
                          )}
                        </div>
                        <div className="flex-grow">
                          <div className="font-medium text-gray-800">
                            {review.userDetails ? 
                              `${review.userDetails.firstName || ''} ${review.userDetails.lastName || ''}`.trim() || 
                              "Anonymous Client" : 
                              "Anonymous Client"}
                          </div>
                          <div className="text-sm text-gray-500">
                            {review.serviceType || service || "Client"}
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-100">
                  <FaQuoteRight className="mx-auto text-gray-300 mb-3" size={32} aria-hidden="true" />
                  <p className="text-gray-500">No reviews available yet</p>
                </div>
              )}
            </section>

            {/* Contact Information */}
            <section aria-labelledby="contact-heading" className="mb-12">
              <h2 id="contact-heading" className="text-2xl font-bold text-gray-800 mb-6">
                Contact Information
              </h2>
              <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
                <div className="grid md:grid-cols-2 gap-6">
                  {provider.phoneNumber && (
                    <div className="flex items-center p-4 bg-white rounded-lg shadow-sm">
                      <div className="bg-blue-100 p-3 rounded-full mr-4">
                        <FaPhoneAlt className="text-blue-600" aria-hidden="true" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="font-medium">{provider.phoneNumber}</p>
                      </div>
                    </div>
                  )}
                  
                  {provider.email && (
                    <div className="flex items-center p-4 bg-white rounded-lg shadow-sm">
                      <div className="bg-green-100 p-3 rounded-full mr-4">
                        <FaEnvelope className="text-green-600" aria-hidden="true" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{provider.email}</p>
                      </div>
                    </div>
                  )}
                  
                  {provider.linkedin && (
                    <div className="flex items-center p-4 bg-white rounded-lg shadow-sm">
                      <div className="bg-blue-100 p-3 rounded-full mr-4">
                        <FaLinkedin className="text-blue-700" aria-hidden="true" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">LinkedIn</p>
                        <a 
                          href={provider.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-blue-600 hover:text-blue-800"
                          aria-label={`View ${provider.firstName}'s LinkedIn profile (opens in new tab)`}
                        >
                          View Profile
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* Call to Action */}
            <div className="text-center mt-12">
              <Link
                to={`/booking/${provider.id}?service=${service}`}
                className="inline-block py-3 px-8 text-lg font-medium text-white bg-indigo-600 rounded-lg shadow-lg hover:bg-indigo-700 transform hover:-translate-y-1 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                aria-label={`Book an appointment with ${provider.firstName}`}
              >
                Book Now
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Image Carousel Modal */}
      {isCarouselOpen && provider.workImages && provider.workImages.length > 0 && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
          role="dialog"
          aria-modal="true"
          aria-labelledby="carousel-heading"
        >
          <div className="relative w-full max-w-6xl p-4">
            <button
              className="absolute top-4 right-4 z-10 bg-white/80 rounded-full w-10 h-10 flex items-center justify-center shadow-lg hover:bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onClick={closeCarousel}
              aria-label="Close image carousel"
            >
              <FaTimes className="text-gray-800" aria-hidden="true" />
            </button>
            
            <h2 id="carousel-heading" className="sr-only">Image carousel showing work samples</h2>
            
            <div className="flex items-center justify-center h-[80vh] relative">
              <img
                src={provider.workImages[currentImageIndex]}
                alt={`Work sample ${currentImageIndex + 1} of ${provider.workImages.length}`}
                className="max-h-full max-w-full object-contain"
              />
              
              <button
                className="absolute left-4 p-2 bg-white/80 rounded-full shadow-lg hover:bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
                onClick={prevImage}
                aria-label="Previous image"
              >
                <FaArrowLeft className="text-gray-800 text-xl" aria-hidden="true" />
              </button>
              
              <button
                className="absolute right-4 p-2 bg-white/80 rounded-full shadow-lg hover:bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
                onClick={nextImage}
                aria-label="Next image"
              >
                <FaArrowRight className="text-gray-800 text-xl" aria-hidden="true" />
              </button>
            </div>
            
            <div className="flex justify-center mt-4 space-x-2 overflow-x-auto py-2" role="tablist" aria-label="Image thumbnails">
              {provider.workImages.map((image, index) => (
                <button
                  key={index}
                  className={`w-16 h-16 cursor-pointer rounded-md overflow-hidden transition-all ${
                    currentImageIndex === index ? 'ring-2 ring-indigo-500' : 'opacity-70 hover:opacity-100'
                  }`}
                  onClick={() => setCurrentImageIndex(index)}
                  role="tab"
                  aria-selected={currentImageIndex === index}
                  aria-label={`Image ${index + 1}`}
                  tabIndex={currentImageIndex === index ? 0 : -1}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setCurrentImageIndex(index);
                    }
                  }}
                >
                  <img
                    src={image}
                    alt={`Thumbnail for image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
            
            <div className="text-center text-white mt-2" aria-live="polite">
              Image {currentImageIndex + 1} of {provider.workImages.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}