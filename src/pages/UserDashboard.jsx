import { useState, useEffect, useRef } from 'react';
import ServiceCards from '../components/ServicesCards';
import ProviderHome from '../components/ProviderHome';

function UserDashboard() {
  const [userRole, setUserRole] = useState('');
  const canvasRef = useRef(null);
  
  // Get user role from localStorage
  useEffect(() => {
    const role = localStorage.getItem("role");
    setUserRole(role);
  }, []);

  // Improved corner ribbon animation effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
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

    // Define corner positions for ribbons
    const corners = [
      { x: 0, y: 0 }, // Top-left
      { x: canvas.width, y: 0 }, // Top-right
      { x: 0, y: canvas.height }, // Bottom-left
      { x: canvas.width, y: canvas.height } // Bottom-right
    ];
    
    // Ribbon properties - now more subtle and shorter
    const ribbons = [];
    const ribbonCount = 5; // More but smaller ribbons
    
    // Color arrays for gradient effects
    const colorPairs = [
      { start: '#4f46e5', end: '#818cf8' }, // Indigo
      { start: '#3b82f6', end: '#93c5fd' }, // Blue
      { start: '#10b981', end: '#6ee7b7' }, // Green
      { start: '#8b5cf6', end: '#c4b5fd' }, // Purple
      { start: '#14b8a6', end: '#5eead4' }, // Teal
    ];

    // Initialize ribbons
    for (let i = 0; i < ribbonCount; i++) {
      // Assign each ribbon to a corner
      const cornerIndex = i % corners.length;
      const corner = corners[cornerIndex];
      
      // Direction vector away from corner
      const dirX = cornerIndex % 2 === 0 ? 1 : -1; // If corner is left, go right
      const dirY = cornerIndex < 2 ? 1 : -1; // If corner is top, go down
      
      ribbons.push({
        points: [],
        pointCount: 8, // Fewer points for shorter ribbons
        width: canvas.width * 0.025, // Thinner ribbons
        cornerX: corner.x,
        cornerY: corner.y,
        dirX: dirX,
        dirY: dirY,
        color: colorPairs[i % colorPairs.length],
        speed: 0.2 + (Math.random() * 0.2),
        length: 0.2 + (Math.random() * 0.1), // Controls how far from corner
        offset: i * (Math.PI / 2),
        phase: i * 0.7
      });

      // Create initial points for each ribbon
      for (let j = 0; j < ribbons[i].pointCount; j++) {
        ribbons[i].points.push({
          x: corner.x,
          y: corner.y
        });
      }
    }

    // Animation function
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      ribbons.forEach(ribbon => {
        // Update ribbon phase
        ribbon.phase += 0.007 * ribbon.speed;
        
        // Calculate points - now starting from corners and moving outward
        for (let i = 0; i < ribbon.pointCount; i++) {
          const t = i / (ribbon.pointCount - 1);
          
          // Base position extending from corner
          const baseX = ribbon.cornerX + (ribbon.dirX * t * canvas.width * ribbon.length);
          const baseY = ribbon.cornerY + (ribbon.dirY * t * canvas.height * ribbon.length);
          
          // Add wave movement
          const waveAmplitude = canvas.height * 0.04; // Smaller waves
          const waveX = Math.sin(t * 3 + ribbon.phase) * waveAmplitude * (1-t); // Waves get smaller at end
          const waveY = Math.cos(t * 2 + ribbon.phase + ribbon.offset) * waveAmplitude * (1-t);
          
          ribbon.points[i] = { 
            x: baseX + waveX * ribbon.dirY, // Cross-axis movement
            y: baseY + waveY * ribbon.dirX
          };
        }
        
        // Create gradient for this ribbon
        const firstPoint = ribbon.points[0];
        const lastPoint = ribbon.points[ribbon.pointCount - 1];
        const gradient = ctx.createLinearGradient(
          firstPoint.x, firstPoint.y, 
          lastPoint.x, lastPoint.y
        );
        gradient.addColorStop(0, ribbon.color.start + "80"); // 50% opacity
        gradient.addColorStop(1, ribbon.color.end + "40"); // 25% opacity
        
        // Draw ribbon with gradient
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
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = ribbon.width;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
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

  return (
    <div className="flex flex-col items-center p-4 sm:p-5 lg:p-12 min-h-screen mt-10 relative">
      {/* Canvas for animated corner ribbons background */}
      <div className="absolute inset-0 -z-10 overflow-hidden opacity-10 pointer-events-none">
        <canvas ref={canvasRef} className="w-full h-full"></canvas>
      </div>
      
      {userRole === 'provider' ? (
        <ProviderHome />
      ) : (
        <div className="flex items-start relative z-10">
          <ServiceCards title="Our Premium Services"/>
        </div>
      )}
    </div>
  );
}

export default UserDashboard;