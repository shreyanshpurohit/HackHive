import React, { useEffect, useState, useRef } from 'react';
import { motion, useSpring, useMotionValue, AnimatePresence } from 'framer-motion';

type CursorParticle = {
  id: number;
  x: number;
  y: number;
  driftX: number;
  driftY: number;
  rotate: number;
  color: string;
};

const TRAIL_LIFETIME_MS = 800;
const TRAIL_SPAWN_INTERVAL_MS = 80;
const MAX_TRAIL_PARTICLES = 6;

const CustomCursor: React.FC = () => {
  const [enabled, setEnabled] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [particles, setParticles] = useState<CursorParticle[]>([]);
  const particleIdCounter = useRef(0);
  const hoveringRef = useRef(false);
  
  // Start off-screen so the custom cursor does not flash at the top-left before the first mouse move.
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  
  const springConfig = { damping: 20, stiffness: 350, mass: 0.1 }; 
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const isCoarse = window.matchMedia('(pointer: coarse)').matches;
    if (!isCoarse) {
      setEnabled(true);
    }
  }, []);

  useEffect(() => {
    let lastTime = 0;
    
    const updateMousePosition = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      const target = e.target as HTMLElement;
      const clickable =
        target.closest('button') ||
        target.closest('a') ||
        target.closest('.cursor-pointer') ||
        target.closest('[data-hover="true"]');
      const nextHovering = !!clickable;
      if (hoveringRef.current !== nextHovering) {
        hoveringRef.current = nextHovering;
        setIsHovering(nextHovering);
      }

      const now = performance.now();
      if (now - lastTime > TRAIL_SPAWN_INTERVAL_MS) {
        lastTime = now;
        const color = `hsl(${Math.random() * 360}, 100%, 70%)`;
        setParticles(prev => [
          ...prev.slice(-(MAX_TRAIL_PARTICLES - 1)),
          { 
            id: particleIdCounter.current++, 
            x: e.clientX, 
            y: e.clientY,
            driftX: (Math.random() - 0.5) * 100,
            driftY: (Math.random() - 0.5) * 100,
            rotate: Math.random() * 360,
            color
          }
        ]);
        setTimeout(() => {
          setParticles(prev => prev.slice(1));
        }, TRAIL_LIFETIME_MS);
      }
    };

    window.addEventListener('mousemove', updateMousePosition, { passive: true });
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, [mouseX, mouseY]);

  if (!enabled) return null;

  return (
    <>
      <AnimatePresence>
        {particles.map(p => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0.8, scale: 1, x: p.x - 5, y: p.y - 5 }}
            animate={{ 
              opacity: 0, 
              scale: 0, 
              x: p.x + p.driftX,
              y: p.y + p.driftY,
              rotate: p.rotate
            }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="fixed top-0 left-0 z-[9998] pointer-events-none rounded-full mix-blend-screen"
            style={{ 
              width: 10, 
              height: 10,
              backgroundColor: p.color,
              boxShadow: `0 0 10px ${p.color}, 0 0 20px ${p.color}`
            }}
          />
        ))}
      </AnimatePresence>
      <motion.div
        className="fixed top-0 left-0 z-[9999] pointer-events-none mix-blend-difference flex items-center justify-center will-change-transform"
        style={{ x, y, translateX: '-50%', translateY: '-50%' }}
      >
        <motion.div
          className="relative border border-white flex items-center justify-center overflow-hidden"
          style={{ width: 40, height: 40 }}
          animate={{
            scale: isHovering ? 2 : 1, 
            rotate: isHovering ? 180 : 0,
            borderRadius: isHovering ? "50%" : "0%",
            backgroundColor: isHovering ? "rgba(255,255,255,1)" : "rgba(255,255,255,0.2)"
          }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
        >
          <motion.span 
            className="z-10 font-mono uppercase tracking-[0.2em] text-[8px] overflow-hidden whitespace-nowrap"
            style={{ 
              rotate: isHovering ? -180 : 0,
              color: isHovering ? "black" : "white"
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovering ? 1 : 0 }}
            transition={{ duration: 0.2 }}
          >
            [ACT]
          </motion.span>
        </motion.div>
      </motion.div>
    </>
  );
};

export default CustomCursor;
