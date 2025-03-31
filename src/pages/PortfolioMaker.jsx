import { FaStar, FaCamera, FaPhoneAlt, FaEnvelope, FaLinkedin, FaMapMarkerAlt, FaTimes, FaChevronLeft, FaChevronRight, FaEdit, FaSave } from "react-icons/fa";
import { Carousel } from "@material-tailwind/react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../utils/firebase";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function PortfolioPage() {
  const [isCarouselOpen, setCarouselOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  const defaultData = {
    firstName: "",
    lastName: "",
    description: "No description available",
    profilePic: "https://via.placeholder.com/150",
    stars: 0,
    address: "Not specified",
    price: "$0",
    workImages: [],
    testimonials: [],
    phoneNumber: "Not provided",
    email: "Not provided",
    linkedin: "#"
  };

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchProviderData = async () => {
      setIsLoading(true);
      const params = new URLSearchParams(location.search);
      const name = params.get('service');

      if (!name) {
        console.error('No name query parameter found in the URL');
        setIsLoading(false);
        return;
      }
      
      try {
        const response = await axios.get(`/api/provider?service=${name}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            }
          }
        );
        
        if (response.status === 200) 
          setFormData({...defaultData, ...response.data});
        
      } catch (error) {
        console.error("Error fetching provider data:", error);
        if(error.response.status === 404){
          navigate(`/terms-and-conditions?service=${name}`);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProviderData();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="w-full mx-auto px-10 py-12 bg-gray-50 min-h-screen flex justify-center items-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent" 
               role="status" 
               aria-label="Loading">
            <span className="sr-only">Loading...</span>
          </div>
          <p className="mt-4 text-gray-600">Loading portfolio data...</p>
        </div>
      </div>
    );
  }

  const openCarousel = (index) => {
    setCurrentImageIndex(index);
    setCarouselOpen(true);
  };

  const closeCarousel = () => {
    setCarouselOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleContactInfoChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo,
        [name]: value,
      },
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const storageRef = ref(storage, `workImages/${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      setFormData((prev) => ({
        ...prev,
        workImages: [...(prev.workImages || []), downloadURL],
      }));
    }
  };

  const handleProfilePicUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const storageRef = ref(storage, `profilePics/${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      setFormData((prev) => ({
        ...prev,
        profilePic: downloadURL,
      }));
    }
  };

  const saveChanges = async () => {
    setIsEditing(false);
  
    try {
      const response = await axios.put(
        `/api/provider`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      setFormData({ ...defaultData, ...response.data });
    } catch (error) {
      console.error("Error fetching provider data:", error);
      setFormData(defaultData);
      if (error.response?.status === 403) {
        navigate("/404");
      }
    } finally {
      setIsLoading(false);
    }
  
    alert("Changes saved successfully!");
  };

  return (
    <div className="md:w-full lg:w-[60vw] mx-auto px-10 py-12 bg-gray-50 min-h-screen mt-10">
      <div className="flex justify-end mb-6">
        <button
          onClick={() => (isEditing ? saveChanges() : setIsEditing(true))}
          className="flex items-center space-x-2 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
          aria-label={isEditing ? "Save changes" : "Edit portfolio"}
        >
          {isEditing ? <FaSave /> : <FaEdit />}
          <span>{isEditing ? "Save Changes" : "Edit Portfolio"}</span>
        </button>
      </div>

      <div className="flex flex-col md:flex-row items-center md:space-x-6 mb-10">
        <div className="relative w-28 h-26 rounded-full overflow-hidden shadow-sm mb-4 md:mb-0">
          <img
            src={formData.profilePic || "https://via.placeholder.com/150"}
            alt={formData.firstName || "Profile"}
            className="w-full h-full object-cover transform hover:scale-105 transition-all"
            aria-hidden={!formData.profilePic}
          />
          {isEditing && (
            <>
              <input
                type="file"
                accept="image/*"
                onChange={handleProfilePicUpload}
                className="absolute inset-0 w-full h-full opacity-0 z-50 cursor-pointer"
                aria-label="Upload profile picture"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-100 transition-opacity">
                <FaCamera className="text-white text-2xl" aria-hidden="true" />
              </div>
            </>
          )}
        </div>
        <div className="text-gray-800 w-full md:w-[90%] text-center md:text-left">
          {isEditing ? (
            <div className="space-y-2">
              <textarea
                name="description"
                value={formData.description || ""}
                onChange={handleInputChange}
                placeholder="Add a description"
                className="text-lg text-gray-600 mt-2 p-2 border border-gray-300 rounded-lg w-full max-w-full"
                rows="3"
                aria-label="Profile description"
              />
            </div>
          ) : (
            <>
              <h1 className="text-3xl font-semibold tracking-tight">
                {formData.firstName || ""} {formData.lastName || ""}
                {!formData.firstName && !formData.lastName && "No Name Provided"}
              </h1>
              <p className="text-lg text-gray-600 mt-2">{formData.description || "No description available"}</p>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-wrap justify-between mb-8 text-gray-600 gap-4">
        <div className="flex items-center space-x-2">
          <FaStar className="text-yellow-400" aria-hidden="true" />
          <span className="font-medium">{formData.stars || 0} Rating</span>
        </div>
        <div className="flex items-center space-x-2">
          <FaMapMarkerAlt className="text-red-500" aria-hidden="true" />
          {isEditing ? (
            <input
              type="text"
              name="address"
              value={formData.address || ""}
              onChange={handleInputChange}
              placeholder="Location"
              className="w-40 p-2 border border-gray-300 rounded-lg"
              aria-label="Address"
            />
          ) : (
            <span>{formData.address || "Location not specified"}</span>
          )}
        </div>
        <div className="text-lg font-semibold">
          <span>$</span>
          {isEditing ? (
            <input
              type="text"
              name="price"
              value={formData.price || ""}
              onChange={handleInputChange}
              placeholder="Price"
              className="w-28 p-2 border border-gray-300 rounded-lg"
              aria-label="Price"
            />
          ) : (
            formData.price || "Price not set"
          )}
        </div>
      </div>

      <div className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Work Samples</h2>
        {formData.workImages && formData.workImages.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {formData.workImages.map((image, index) => (
              <div key={index} className="cursor-pointer h-40">
                <img
                  src={image}
                  alt={`work ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg shadow-md transition-transform transform hover:scale-105"
                  onClick={() => openCarousel(index)}
                  tabIndex="0"
                  role="button"
                  aria-label={`View work sample ${index + 1}`}
                  onKeyPress={(e) => e.key === 'Enter' && openCarousel(index)}
                />
              </div>
            ))}
            {isEditing && (
              <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg h-40">
                <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    aria-label="Upload work sample"
                  />
                  <div className="flex flex-col items-center">
                    <FaCamera className="text-gray-500 text-2xl mb-2" aria-hidden="true" />
                    <span className="text-gray-500">Upload Image</span>
                  </div>
                </label>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white p-8 text-center rounded-lg shadow-sm border border-gray-200">
            {isEditing ? (
              <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg h-40">
                <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    aria-label="Upload first work sample"
                  />
                  <div className="flex flex-col items-center">
                    <FaCamera className="text-gray-500 text-2xl mb-2" aria-hidden="true" />
                    <span className="text-gray-500">Upload Your First Work Sample</span>
                  </div>
                </label>
              </div>
            ) : (
              <p className="text-gray-500">No work samples available yet</p>
            )}
          </div>
        )}
      </div>

      <div className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Client Testimonials</h2>
        {formData.testimonials && formData.testimonials.length > 0 ? (
          <div className="space-y-6">
            {formData.testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="p-6 bg-white shadow-md rounded-lg hover:shadow-lg transition-all"
                aria-labelledby={`testimonial-${index}`}
              >
                <p className="text-lg italic text-gray-700">"{testimonial.feedback || 'No feedback provided'}"</p>
                <p id={`testimonial-${index}`} className="mt-4 font-semibold text-gray-800 text-sm">- {testimonial.client || 'Anonymous'}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 bg-white shadow-md rounded-lg text-center">
            <p className="text-gray-500">No testimonials available yet</p>
            {isEditing && (
              <p className="mt-2 text-sm text-blue-500">Testimonials will appear here once clients leave reviews</p>
            )}
          </div>
        )}
      </div>

      <div className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Contact Information</h2>
        <div className="space-y-4 text-gray-600 bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center space-x-4">
            <FaPhoneAlt className="text-blue-500" aria-hidden="true" />
            {isEditing ? (
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber || ""}
                onChange={handleInputChange}
                placeholder="Phone number"
                className="w-full p-2 border border-gray-300 rounded-lg"
                aria-label="Phone number"
              />
            ) : (
              <span>{formData.phoneNumber || "Phone number not provided"}</span>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <FaEnvelope className="text-green-500" aria-hidden="true" />
            <span>{formData.email || "Email not provided"}</span>
          </div>
          <div className="flex items-center space-x-4">
            <FaLinkedin className="text-blue-600" aria-hidden="true" />
            {isEditing ? (
              <input
                type="url"
                name="linkedin"
                value={(formData.contactInfo && formData.contactInfo.linkedin) || ""}
                onChange={handleContactInfoChange}
                placeholder="LinkedIn profile URL"
                className="w-full p-2 border border-gray-300 rounded-lg"
                aria-label="LinkedIn profile URL"
              />
            ) : (
              <a
                href={(formData.contactInfo && formData.contactInfo.linkedin) || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 font-medium"
                aria-label="LinkedIn profile"
              >
                {(formData.contactInfo && formData.contactInfo.linkedin) 
                  ? "LinkedIn Profile" 
                  : "No LinkedIn profile provided"}
              </a>
            )}
          </div>
        </div>
      </div>

      {isCarouselOpen && formData.workImages && formData.workImages.length > 0 && (
        <div className="fixed inset-0 flex justify-center items-center z-50 bg-black/80" role="dialog" aria-modal="true" aria-labelledby="carousel-title">
          <div className="relative w-full md:w-3/4 lg:w-2/3 bg-transparent p-4 md:p-8 rounded-xl">
            <h2 id="carousel-title" className="sr-only">Image carousel</h2>
            <Carousel className="rounded-xl h-full">
              {formData.workImages.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`work ${index + 1}`}
                  className="h-full w-full object-contain rounded-xl"
                  aria-hidden={currentImageIndex !== index}
                />
              ))}
            </Carousel>
            <button
              className="absolute top-4 right-4 md:top-8 md:right-8 w-8 h-8 bg-white/80 rounded-full text-gray-800 flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-all z-50"
              onClick={closeCarousel}
              aria-label="Close carousel"
            >
              <FaTimes aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}