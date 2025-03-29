import ServiceCards from '../components/ServicesCards';
import { useEffect, useState } from 'react';

function UserDashboard() {
  const [userRole, setUserRole] = useState('');
  
  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role) {
      setUserRole(role);
    }
  }, []);

  return (
    <div className="flex flex-col items-center p-4 sm:p-5 lg:p-12 min-h-screen mt-10">
      <div className="flex items-start">
        <ServiceCards 
          title={userRole === 'provider' ? 'Services You can Provide' : 'Our Premium Services'}
        />
      </div>
    </div>
  );
}

export default UserDashboard;