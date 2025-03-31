import React from 'react';
import { Link } from 'react-router-dom';

const ProviderHome = () => {
  // Service category items component
  const ServiceCategoryItem = ({ name, description }) => (
    <Link 
      to={`/terms-and-conditions?service=${name.toLowerCase().replace(/\s+/g, '-')}`} 
      className="flex items-center p-3.5 bg-white rounded-lg hover:bg-blue-50 border border-gray-100 hover:border-blue-200 transition-all shadow-sm hover:shadow"
      aria-label={`Register for ${name} services`}
    >
      <div>
        <p className="font-medium text-gray-800">{name}</p>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </Link>
  );

  // Step item component
  const StepItem = ({ number, title, description }) => (
    <div className="flex" role="listitem">
      <div className="flex-shrink-0 mr-4">
        <div 
          className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold shadow-sm"
          aria-hidden="true"
        >
          {number}
        </div>
      </div>
      <div>
        <h3 className="font-medium text-gray-800">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-6xl mx-auto relative z-10 px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Welcome to Your Provider Dashboard</h1>
      
      {/* Main Content Area */}
      <div className="flex flex-col lg:flex-row gap-6 mx-auto">
        {/* Service Enrollment Card */}
        <section 
          className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-md border border-gray-100 overflow-hidden w-full lg:w-1/2 transition-all"
          aria-labelledby="service-enrollment-heading"
        >
          <div className="px-6 pt-6 pb-4">
            <h2 id="service-enrollment-heading" className="text-xl font-bold text-blue-800 mb-1">Offer Your Services</h2>
            <p className="text-gray-600 mb-4">Select services you'd like to provide to clients in your area.</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" role="list">
              <ServiceCategoryItem name="Home Cleaning" description="House cleaning, deep cleaning services" />
              <ServiceCategoryItem name="Plumbing" description="Pipe repairs, installations, drainage" />
              <ServiceCategoryItem name="Electrical Work" description="Wiring, installations, repairs" />
              <ServiceCategoryItem name="Carpentry" description="Furniture assembly, repairs, installations" />
              <ServiceCategoryItem name="Home Renovation" description="Remodeling, painting, improvements" />
              <ServiceCategoryItem name="Lawn & Garden" description="Landscaping, lawn care, gardening" />
            </div>
            
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mt-6 shadow-inner" role="note">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg mr-3" aria-hidden="true">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-sm text-blue-700">
                  Click on any service to start the registration process for that category
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Getting Started Guide */}
        <section 
          className="bg-gradient-to-br from-white to-indigo-50 rounded-2xl shadow-md border border-gray-100 overflow-hidden w-full lg:w-1/2 transition-all"
          aria-labelledby="getting-started-heading"
        >
          <div className="px-6 pt-6 pb-4">
            <h2 id="getting-started-heading" className="text-xl font-bold text-indigo-800 mb-1">Getting Started Guide</h2>
            <p className="text-gray-600 mb-4">Follow these steps to set up your provider profile and start receiving bookings.</p>
            
            <div className="space-y-5 pl-1" role="list">
              <StepItem 
                number="1" 
                title="Complete Your Profile" 
                description="Add your skills, experience, and professional photo to build client trust."
              />
              <StepItem 
                number="2" 
                title="Set Your Availability" 
                description="Define when you're available to provide services to clients."
              />
              <StepItem 
                number="3" 
                title="Choose Service Areas" 
                description="Select neighborhoods where you can offer your services."
              />
              <StepItem 
                number="4" 
                title="Set Your Pricing" 
                description="Define competitive rates for each service type you offer."
              />
              <StepItem 
                number="5" 
                title="Get Verified" 
                description="Complete our verification process to earn a trusted provider badge."
              />
            </div>
            
            <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 mt-6 shadow-inner" role="note">
              <div className="flex items-center">
                <div className="p-2 bg-indigo-100 rounded-lg mr-3" aria-hidden="true">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-sm text-indigo-700">
                  Complete all steps to maximize your visibility to potential clients
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProviderHome;