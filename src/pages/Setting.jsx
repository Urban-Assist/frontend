import React, { useEffect, useState } from "react";
import { Camera } from "lucide-react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../utils/firebase";

const Setting = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [profilePicUrl, setProfilePicUrl] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [province, setProvince] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const API_URL = `/api/profile`;
        const response = await fetch(API_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setUser(data);
        setFirstName(data.firstName || "");
        setLastName(data.lastName || "");
        setEmail(data.email || "");
        setPhoneNumber(data.phoneNumber || "");
        setProfilePicUrl(data.profilePicUrl || "https://images.pexels.com/photos/1597118/pexels-photo-1597118.jpeg");
        if (data.address) {
          setAddress(data.address.address || "");
          setCity(data.address.city || "");
          setPincode(data.address.pincode || "");
          setProvince(data.address.province || "");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [file]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const uploadImage = async () => {
    if (!file) return null;
    
    try {
      setUploading(true);
      const fileName = `profile-images/${email}-${Date.now()}`;
      const storageRef = ref(storage, fileName);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      setProfilePicUrl(downloadURL);
      return downloadURL;
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      let imageUrl = profilePicUrl;
      if (file) {
        const uploadedUrl = await uploadImage();
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        }
      }

      const updatedData = {
        firstName,
        lastName,
        email,
        phoneNumber,
        profilePicUrl: imageUrl,
        address: {
          address,
          city,
          pincode,
          province
        }
      };

      await fetch(`/api/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });

      const successMsg = document.getElementById("success-message");
      successMsg.classList.remove("opacity-0");
      successMsg.classList.add("opacity-100");
      
      setTimeout(() => {
        successMsg.classList.remove("opacity-100");
        successMsg.classList.add("opacity-0");
      }, 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-indigo-600 border-indigo-200 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div 
            id="success-message" 
            className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mx-8 mt-6 opacity-0 transition-opacity duration-300 ease-in-out"
            role="alert"
            aria-live="polite"
          >
            <p className="font-medium">Success! Your profile has been updated.</p>
          </div>

          <div className="p-8">
            <div className="mb-10">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Your Photo</h2>
              <div className="flex items-center">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 shadow-md">
                    {uploading ? (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <div className="w-10 h-10 border-4 border-t-indigo-600 border-indigo-200 rounded-full animate-spin"></div>
                      </div>
                    ) : (
                      <img
                        alt="Profile"
                        className="object-cover w-full h-full"
                        src={preview || profilePicUrl}
                        aria-hidden={uploading}
                      />
                    )}
                  </div>
                  <input
                    accept="image/*"
                    className="sr-only"
                    id="photo"
                    type="file"
                    onChange={handleFileChange}
                    aria-label="Upload profile picture"
                  />
                  <label
                    htmlFor="photo"
                    className="absolute -bottom-2 -right-2 bg-indigo-600 text-white p-2 rounded-full cursor-pointer shadow-md hover:bg-indigo-700 transition duration-200"
                    aria-label="Change profile picture"
                  >
                    <Camera size={16} aria-hidden="true" />
                  </label>
                </div>
                <div className="ml-6">
                  <h3 className="text-gray-700 font-medium">Profile Picture</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {file ? file.name : "Upload a clear photo of yourself"}
                  </p>
                  {file && (
                    <p className="text-xs text-indigo-600 mt-1">
                      Image will be uploaded when you save changes
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 mb-8" aria-hidden="true"></div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Personal Information</h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    id="firstName"
                    className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Your first name"
                  />
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Your last name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    id="email"
                    className="w-full px-4 py-3 rounded-md border border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed"
                    value={email}
                    disabled
                    aria-disabled="true"
                  />
                  <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
                </div>

                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    id="phoneNumber"
                    className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Your phone number"
                    inputMode="tel"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 mb-8" aria-hidden="true"></div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Address Information</h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                    Street Address
                  </label>
                  <input
                    id="address"
                    className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Your street address"
                  />
                </div>

                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    id="city"
                    className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Your city"
                  />
                </div>

                <div>
                  <label htmlFor="province" className="block text-sm font-medium text-gray-700 mb-2">
                    Province/State
                  </label>
                  <input
                    id="province"
                    className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    placeholder="Your province or state"
                  />
                </div>

                <div>
                  <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-2">
                    Postal Code
                  </label>
                  <input
                    id="pincode"
                    className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="Your postal code"
                    inputMode="numeric"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSubmit}
                disabled={uploading}
                className={`px-6 py-3 bg-indigo-600 text-white font-medium rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-200 ${uploading ? 'opacity-70 cursor-not-allowed' : ''}`}
                aria-disabled={uploading}
              >
                {uploading ? 'Uploading...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Setting;