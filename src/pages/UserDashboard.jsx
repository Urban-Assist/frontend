import { useState, useEffect } from 'react';
import ServiceCards from '../components/ServicesCards';
import ProviderHome from '../components/ProviderHome';

function UserDashboard() {
  const [userRole, setUserRole] = useState('');
  
  useEffect(() => {
    // Get user role from localStorage
    const role = localStorage.getItem("role");
    setUserRole(role);
  }, []);

  return (
    <div className="flex flex-col items-center p-4 sm:p-5 lg:p-12 min-h-screen mt-10">
      {userRole === 'provider' ? (
        <ProviderHome />
      ) : (
        <div className="flex items-start">
          <ServiceCards title="Our Premium Services"/>
        </div>
      )}
    </div>
  );
}

export default UserDashboard;