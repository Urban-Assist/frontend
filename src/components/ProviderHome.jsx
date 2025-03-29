import React from 'react';
import { Link } from 'react-router-dom';

const ProviderHome = () => {
  // Service category items component
  const ServiceCategoryItem = ({ name, description }) => (
    <Link to={`/terms-and-conditions?service=${name.toLowerCase().replace(/\s+/g, '-')}`} className="flex items-center p-3 bg-white border border-blue-200 rounded-md hover:bg-blue-50 hover:border-blue-300 transition-colors">
      <div>
        <p className="font-medium text-gray-800">{name}</p>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </Link>
  );

  // Step item component
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
    <div className="w-full max-w-5xl relative z-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Provider Dashboard</h1>
      
      {/* Service Enrollment Card */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4">
          <h2 className="text-xl font-semibold text-white">Service Provider Portal</h2>
        </div>
        <div className="p-6">
          <div className="mb-6">
            <p className="text-lg font-semibold text-gray-800">Ready to offer your services?</p>
            <p className="text-gray-600">Enroll in our service categories and start receiving job requests.</p>
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

export default ProviderHome;
