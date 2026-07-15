import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const ORBITS = [
  { radius: 100, duration: 20, planetSize: 12, delay: 0 },
  { radius: 160, duration: 30, planetSize: 14, delay: 2 },
  { radius: 240, duration: 40, planetSize: 16, delay: 4 },
  { radius: 340, duration: 55, planetSize: 12, delay: 6 },
  { radius: 460, duration: 70, planetSize: 18, delay: 1 },
];

const HIVE_HEX_RADIUS = 15;

type HexCell = {
  x: number;
  y: number;
  id: string;
};

const Galaxy: React.FC = () => {
  const { scrollY } = useScroll();
  const scrollLimit = 500;

  // The intro galaxy spins up as the user scrolls into the main page.
  const scrollRotation = useTransform(scrollY, [0, scrollLimit], [0, 720]);
  const sunScale = useTransform(scrollY, [0, scrollLimit * 0.8], [1, 0.2]);
  const sunOpacity = useTransform(scrollY, [0, scrollLimit * 0.8], [1, 0]);

  const dustParticles = React.useMemo(() => {
    return Array.from({ length: 20 }).map((_, i) => ({
      id: `dust-${i}`,
      size: Math.random() * 3 + 1,
      left: (Math.random() - 0.5) * 800,
      top: (Math.random() - 0.5) * 800,
      pulseDuration: 2 + Math.random() * 3,
    }));
  }, []);

  const hexagons = React.useMemo(() => {
    const hexes: HexCell[] = [];
    const width = Math.sqrt(3) * HIVE_HEX_RADIUS;
    const height = 2 * HIVE_HEX_RADIUS;
    const qRange = [-2, -1, 0, 1, 2];
    const rRange = [-2, -1, 0, 1, 2];

    for (const q of qRange) {
      for (const r of rRange) {
        const s = -q - r;
        if (Math.abs(s) <= 2) {
          const x = width * (q + r / 2);
          const y = height * (3 / 4 * r);
          hexes.push({ x, y, id: `${q}-${r}` });
        }
      }
    }
    return hexes;
  }, []);
  
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <motion.div
        className="relative flex items-center justify-center"
        style={{ rotate: scrollRotation }}
      >
        <motion.div
          className="absolute flex items-center justify-center mix-blend-screen"
          style={{ 
            width: 140, 
            height: 140, 
            scale: sunScale, 
            opacity: sunOpacity,
          }}
        >
          {/* Hardware-accelerated radial-gradient glow */}
          <div 
            className="absolute inset-0 rounded-full pointer-events-none transform-gpu"
            style={{
              background: 'radial-gradient(circle, rgba(255, 200, 0, 0.4) 0%, rgba(255, 255, 255, 0.2) 40%, transparent 70%)',
              filter: 'blur(15px)',
            }}
          />
          <svg viewBox="-80 -80 160 160" className="w-full h-full relative z-10" style={{ color: "rgba(255, 220, 100, 0.9)" }}>
            {hexagons.map(hex => (
              <polygon
                key={hex.id}
                points="13,-7.5 0,-15 -13,-7.5 -13,7.5 0,15 13,7.5"
                fill="currentColor"
                stroke="rgba(0,0,0,0.8)"
                strokeWidth="2"
                transform={`translate(${hex.x}, ${hex.y}) scale(0.95)`}
              />
            ))}
          </svg>
        </motion.div>
  
        {ORBITS.map((orbit, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border border-white/5"
            style={{ width: orbit.radius * 2, height: orbit.radius * 2 }}
            animate={{ rotate: 360 }}
            transition={{
              duration: orbit.duration,
              repeat: Infinity,
              ease: "linear",
              delay: orbit.delay
            }}
          >
            <div
              className="absolute flex items-center justify-center"
              style={{
                width: orbit.planetSize * 2,
                height: orbit.planetSize * 2,
                top: '50%',
                left: -orbit.planetSize,
                transform: 'translateY(-50%)',
              }}
            >
              {/* Hardware-accelerated glow for planets */}
              <div 
                className="absolute inset-0 rounded-full bg-white/20 blur-[4px] pointer-events-none transform-gpu"
              />
              <svg 
                viewBox="0 0 100 100" 
                className="w-full h-full text-yellow-300 relative z-10" 
              >
                <path d="M42 38 C38 13 58 1 77 13 C75 33 60 45 42 38 Z" fill="rgba(255,255,255,0.72)" />
                <path d="M52 39 C56 13 80 5 94 24 C86 42 68 48 52 39 Z" fill="rgba(255,255,255,0.64)" />
                <path d="M50 37 C59 27 70 19 88 20" stroke="rgba(180,230,255,0.35)" strokeWidth="2" fill="none" />
                <ellipse cx="40" cy="50" rx="30" ry="20" fill="currentColor" />
                <path d="M25 33 Q30 50 25 67 L35 69 Q40 50 35 31 Z" fill="#222" />
                <path d="M45 31 Q50 50 45 69 L55 67 Q60 50 55 33 Z" fill="#222" />
                <path d="M10 50 L0 48 L0 52 Z" fill="#222" />
                <circle cx="60" cy="42" r="3" fill="#222" />
              </svg>
            </div>
          </motion.div>
        ))}
          
        {dustParticles.map((dust) => (
          <div
            key={dust.id}
            className="absolute rounded-full bg-white/40"
            style={{
              width: dust.size,
              height: dust.size,
              left: dust.left,
              top: dust.top,
              animation: `dust-pulse ${dust.pulseDuration}s infinite ease-in-out`,
            }}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default Galaxy;
