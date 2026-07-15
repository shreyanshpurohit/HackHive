import React, { useEffect, useRef } from 'react';

const pickTarget = () => ({
  x: 80 + Math.random() * Math.max(window.innerWidth - 160, 1),
  y: 80 + Math.random() * Math.max(window.innerHeight - 160, 1),
});

const WanderingBee = () => {
  const beeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const bee = beeRef.current;
    if (!bee) return;

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let vx = (Math.random() - 0.5) * 0.5;
    let vy = (Math.random() - 0.5) * 0.5;
    let currentAngle = 0;

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    
    let animationFrame: number;

    const animate = () => {
      const dx = targetX - x;
      const dy = targetY - y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 100 || Math.random() < 0.005) {
        const target = pickTarget();
        targetX = target.x;
        targetY = target.y;
      }

      const acceleration = 0.15;
      vx += (dx / Math.max(dist, 1)) * acceleration;
      vy += (dy / Math.max(dist, 1)) * acceleration;

      // A small wobble keeps the path from looking like a straight-line screensaver.
      const time = Date.now() * 0.002;
      vx += Math.cos(time) * 0.2;
      vy += Math.sin(time * 0.8) * 0.2;

      const speed = Math.sqrt(vx * vx + vy * vy);
      const maxSpeed = 0.5;
      if (speed > maxSpeed) {
        vx = (vx / speed) * maxSpeed;
        vy = (vy / speed) * maxSpeed;
      }
      
      x += vx;
      y += vy;

      if (speed > 0.1) {
        const targetAngle = Math.atan2(vy, vx);
        let angleDiff = targetAngle - currentAngle;
        angleDiff = Math.atan2(Math.sin(angleDiff), Math.cos(angleDiff));
        currentAngle += angleDiff * 0.1;
      }

      // Updating the transform directly avoids a React render on every animation frame.
      bee.style.transform = `translate(${x}px, ${y}px) rotate(${currentAngle}rad)`;

      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return (
    <div
      ref={beeRef}
      className="fixed top-0 left-0 z-[-1] pointer-events-none will-change-transform opacity-[0.15]"
      style={{
        width: 32,
        height: 32,
        marginLeft: -16,
        marginTop: -16,
      }}
    >
      <svg 
         viewBox="0 0 24 24" 
         className="w-full h-full drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]" 
      >
        <path
          d="M 13 9 C 10 2 14 -2 21 2 C 20 8 17 11 13 9 Z"
          fill="rgba(255,255,255,0.9)"
          className="wandering-bee-wing wandering-bee-wing-left"
        />
        <path
          d="M 15 9 C 16 2 22 1 24 7 C 22 12 18 13 15 9 Z"
          fill="rgba(255,255,255,0.82)"
          className="wandering-bee-wing wandering-bee-wing-right"
        />
        
        <path d="M 6 12 L 9 7 L 17 7 L 20 12 L 17 17 L 9 17 Z" fill="#FACC15" />
        <path d="M 2 12 L 6 12" stroke="#FACC15" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M 11 7 L 11 17 M 14 7 L 14 17" stroke="#000" strokeWidth="1.5" />
        <circle cx="17.5" cy="12" r="1.5" fill="#000" />
      </svg>
    </div>
  );
};

export default WanderingBee;
