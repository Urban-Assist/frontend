import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ServiceCards from '../components/ServicesCards';

function UserDashboard() {
  const [userRole, setUserRole] = useState('');
  
  useEffect(() => {
    // Get user role from localStorage
    const role = localStorage.getItem("role");
    setUserRole(role);
  }, []);

  // Provider Dashboard Component
  const ProviderDashboard = () => {
    return (
      <div className="w-full max-w-5xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Provider Dashboard</h1>
        
        {/* Service Enrollment Card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4">
            <h2 className="text-xl font-semibold text-white">Service Provider Portal</h2>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-lg font-semibold text-gray-800">Ready to offer your services?</p>
                <p className="text-gray-600">Enroll in our service categories and start receiving job requests.</p>
              </div>
              <Link 
                to="/provider/profile" 
                className="px-5 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Manage Services
              </Link>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
              <h3 className="text-md font-medium text-blue-800 mb-3">Services you can offer:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <ServiceCategoryItem name="Home Cleaning" description="House cleaning, deep cleaning services" />
                <ServiceCategoryItem name="Plumbing" description="Pipe repairs, installations, drainage" />
                <ServiceCategoryItem name="Electrical Work" description="Wiring, installations, repairs" />
                <ServiceCategoryItem name="Carpentry" description="Furniture assembly, repairs, installations" />
                <ServiceCategoryItem name="Home Renovation" description="Remodeling, painting, improvements" />
                <ServiceCategoryItem name="Lawn & Garden" description="Landscaping, lawn care, gardening" />
              </div>
            </div>
          </div>
        </div>

        {/* Stats & Actions Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard 
            title="Availability Setup" 
            value="Required" 
            description="Set your working hours"
            actionText="Manage Schedule"
            actionLink="/availability"
            color="bg-amber-100"
            textColor="text-amber-700"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          
          <StatCard 
            title="Profile Completion" 
            value="75%" 
            description="Complete your profile"
            actionText="Edit Profile"
            actionLink="/settings"
            color="bg-blue-100"
            textColor="text-blue-700"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            }
          />
          
          <StatCard 
            title="Active Bookings" 
            value="0" 
            description="Check your schedule"
            actionText="View Bookings"
            actionLink="/my-bookings"
            color="bg-green-100"
            textColor="text-green-700"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            }
          />
        </div>
        
        {/* Getting Started Guide */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
            <h2 className="text-xl font-semibold text-white">Getting Started Guide</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <StepItem 
                number="1" 
                title="Complete Your Profile" 
                description="Add your skills, experience, and a professional photo to gain client trust."
              />
              <StepItem 
                number="2" 
                title="Set Your Availability" 
                description="Let clients know when you're available to provide services."
              />
              <StepItem 
                number="3" 
                title="Choose Your Service Areas" 
                description="Select the neighborhoods and areas where you can offer your services."
              />
              <StepItem 
                number="4" 
                title="Set Your Pricing" 
                description="Define your rates for each service type you offer."
              />
              <StepItem 
                number="5" 
                title="Get Verified" 
                description="Complete our verification process to earn a trusted provider badge."
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Helper component for service category items
  const ServiceCategoryItem = ({ name, description }) => (
    <Link to={`/terms-and-conditions?service=${name.toLowerCase().replace(/\s+/g, '-')}`} className="flex items-center p-3 bg-white border border-blue-200 rounded-md hover:bg-blue-50 hover:border-blue-300 transition-colors">
      <div>
        <p className="font-medium text-gray-800">{name}</p>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </Link>
  );

  // Helper component for stat cards
  const StatCard = ({ title, value, description, actionText, actionLink, color, textColor, icon }) => (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-gray-500 text-sm">{title}</p>
            <p className="text-2xl font-bold mt-1 mb-1">{value}</p>
            <p className="text-gray-600 text-sm">{description}</p>
          </div>
          <div className={`p-3 rounded-full ${color}`}>
            {icon}
          </div>
        </div>
        <Link to={actionLink} className={`mt-4 inline-block px-4 py-2 rounded-lg ${color} ${textColor} text-sm font-medium`}>
          {actionText}
        </Link>
      </div>
    </div>
  );

  // Helper component for step items
  const StepItem = ({ number, title, description }) => (
    <div className="flex">
      <div className="flex-shrink-0 mr-4">
        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-bold">
          {number}
        </div>
      </div>
      <div>
        <h3 className="font-semibold text-lg text-gray-800">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col items-center p-4 sm:p-5 lg:p-12 min-h-screen mt-10">
      {userRole === 'provider' ? (
        <ProviderDashboard />
      ) : (
        <div className="flex items-start">
          <ServiceCards title="Our Premium Services"/>
        </div>
      )}
    </div>
  );
}

export default UserDashboard;