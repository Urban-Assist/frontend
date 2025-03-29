import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const ProviderHome = () => {
  const canvasRef = useRef(null);

  // Ribbon animation effect
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    
    // Set canvas dimensions to match its display size
    const resizeCanvas = () => {
      const { width, height } = canvas.getBoundingClientRect();
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Ribbon properties
    const ribbons = [];
    const ribbonCount = 3;
    const colors = ['#4f46e5', '#3b82f6', '#8b5cf6', '#6366f1'];

    // Initialize ribbons
    for (let i = 0; i < ribbonCount; i++) {
      ribbons.push({
        points: [],
        pointCount: 12,
        width: canvas.width * 0.05,
        color: colors[i % colors.length],
        speed: 0.5 + (i * 0.2),
        offset: i * (Math.PI * 2) / ribbonCount,
        phase: 0
      });

      // Create initial points for each ribbon
      for (let j = 0; j < ribbons[i].pointCount; j++) {
        ribbons[i].points.push({
          x: 0,
          y: 0
        });
      }
    }

    // Animation function
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      ribbons.forEach(ribbon => {
        // Update ribbon phase
        ribbon.phase += 0.01 * ribbon.speed;
        
        // Calculate points
        for (let i = 0; i < ribbon.pointCount; i++) {
          const t = i / (ribbon.pointCount - 1);
          const x = canvas.width * (0.1 + 0.8 * t);
          const y = canvas.height * 0.5 + 
                   Math.sin(t * 2 * Math.PI + ribbon.phase + ribbon.offset) * 
                   canvas.height * 0.15;
          
          ribbon.points[i] = { x, y };
        }
        
        // Draw ribbon
        ctx.beginPath();
        for (let i = 0; i < ribbon.pointCount - 1; i++) {
          const p0 = ribbon.points[i];
          const p1 = ribbon.points[i + 1];
          
          if (i === 0) {
            ctx.moveTo(p0.x, p0.y);
          } else {
            // Create curved paths between points
            const xc = (p0.x + p1.x) / 2;
            const yc = (p0.y + p1.y) / 2;
            ctx.quadraticCurveTo(p0.x, p0.y, xc, yc);
          }
        }
        
        ctx.strokeStyle = ribbon.color;
        ctx.lineWidth = ribbon.width;
        ctx.lineCap = 'round';
        ctx.stroke();
      });

      animationFrameId = window.requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

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
    <div className="w-full max-w-5xl relative">
      {/* Canvas for animated ribbon */}
      <div className="absolute inset-0 -z-10 overflow-hidden opacity-20 pointer-events-none">
        <canvas ref={canvasRef} className="w-full h-full"></canvas>
      </div>
      
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Provider Dashboard</h1>
      
      {/* Service Enrollment Card */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8 relative z-10">
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
      <div className="bg-white rounded-xl shadow-md overflow-hidden relative z-10">
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
