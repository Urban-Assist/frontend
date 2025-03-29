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

  // Enhanced corner ribbon animation with more randomness and better aesthetics
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

    // Define multiple spawn areas (not just corners)
    const spawnAreas = [
      // Corners
      { x: 0, y: 0 }, // Top-left
      { x: canvas.width, y: 0 }, // Top-right
      { x: 0, y: canvas.height }, // Bottom-left
      { x: canvas.width, y: canvas.height }, // Bottom-right
      // Edges
      { x: canvas.width/2, y: 0 }, // Top middle
      { x: canvas.width, y: canvas.height/2 }, // Right middle
      { x: canvas.width/2, y: canvas.height }, // Bottom middle
      { x: 0, y: canvas.height/2 }, // Left middle
    ];
    
    // Ribbon properties - more ribbons, shorter and more varied
    const ribbons = [];
    const ribbonCount = 8; // Increased count
    
    // Color arrays for gradient effects - extended palette
    const colorPairs = [
      { start: '#4f46e5', end: '#818cf8' }, // Indigo
      { start: '#3b82f6', end: '#93c5fd' }, // Blue
      { start: '#10b981', end: '#6ee7b7' }, // Green
      { start: '#8b5cf6', end: '#c4b5fd' }, // Purple
      { start: '#14b8a6', end: '#5eead4' }, // Teal
      { start: '#f59e0b', end: '#fcd34d' }, // Amber
      { start: '#ec4899', end: '#f9a8d4' }, // Pink
      { start: '#06b6d4', end: '#67e8f9' }  // Cyan
    ];

    // Initialize ribbons
    for (let i = 0; i < ribbonCount; i++) {
      // Get random spawn area
      const spawnIndex = Math.floor(Math.random() * spawnAreas.length);
      const spawn = spawnAreas[spawnIndex];
      
      // Calculate direction based on position
      // For corners and edges, move away from the edge
      let dirX = 0, dirY = 0;
      
      if (spawn.x === 0) dirX = 1;
      else if (spawn.x === canvas.width) dirX = -1;
      else dirX = Math.random() > 0.5 ? 1 : -1;
      
      if (spawn.y === 0) dirY = 1;
      else if (spawn.y === canvas.height) dirY = -1;
      else dirY = Math.random() > 0.5 ? 1 : -1;
      
      ribbons.push({
        points: [],
        pointCount: 6 + Math.floor(Math.random() * 3), // 6-8 points for shorter ribbons with variation
        width: (canvas.width * 0.015) + (Math.random() * 0.01 * canvas.width), // 1.5-2.5% screen width
        spawnX: spawn.x,
        spawnY: spawn.y,
        dirX: dirX,
        dirY: dirY,
        color: colorPairs[i % colorPairs.length],
        speed: 0.15 + (Math.random() * 0.25), // More varied speeds
        length: 0.12 + (Math.random() * 0.08), // Shorter: 12-20% of screen
        offset: Math.random() * Math.PI * 2,
        phase: Math.random() * Math.PI * 2, // Random starting phase
        twist: 2 + Math.random() * 3 // Amount of twist in the ribbon
      });

      // Create initial points for each ribbon
      for (let j = 0; j < ribbons[i].pointCount; j++) {
        ribbons[i].points.push({
          x: spawn.x,
          y: spawn.y
        });
      }
    }

    // Animation function
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      ribbons.forEach(ribbon => {
        // Update ribbon phase
        ribbon.phase += 0.008 * ribbon.speed;
        
        // Calculate points - starting from spawn and moving outward
        for (let i = 0; i < ribbon.pointCount; i++) {
          const t = i / (ribbon.pointCount - 1);
          
          // Base position extending from spawn point
          const baseX = ribbon.spawnX + (ribbon.dirX * t * canvas.width * ribbon.length);
          const baseY = ribbon.spawnY + (ribbon.dirY * t * canvas.height * ribbon.length);
          
          // Add wave movement with more complex pattern
          const waveAmplitude = canvas.height * 0.03 * (1-Math.pow(t, 1.5)); // Amplitude decreases more rapidly
          const waveX = Math.sin(t * ribbon.twist + ribbon.phase) * waveAmplitude;
          const waveY = Math.cos(t * ribbon.twist + ribbon.phase + ribbon.offset) * waveAmplitude;
          
          ribbon.points[i] = { 
            x: baseX + waveX * Math.abs(ribbon.dirY), // Cross-axis movement
            y: baseY + waveY * Math.abs(ribbon.dirX)
          };
        }
        
        // Create gradient for this ribbon with improved opacity
        const firstPoint = ribbon.points[0];
        const lastPoint = ribbon.points[ribbon.pointCount - 1];
        const gradient = ctx.createLinearGradient(
          firstPoint.x, firstPoint.y, 
          lastPoint.x, lastPoint.y
        );
        gradient.addColorStop(0, ribbon.color.start + "A0"); // 63% opacity
        gradient.addColorStop(1, ribbon.color.end + "60"); // 38% opacity
        
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
        
        // Shadow for depth
        ctx.shadowColor = ribbon.color.start;
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = ribbon.width;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
        
        // Reset shadow for next ribbon
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
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
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
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