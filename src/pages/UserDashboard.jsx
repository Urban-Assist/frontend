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
    <div className="min-h-screen">
      <div className='mt-10'/>
      <ServiceCards 
        title={userRole === 'provider' ? 'Services You can Provide' : 'Our Premium Services'}
      />
    </div>
  );
}

export default UserDashboard;