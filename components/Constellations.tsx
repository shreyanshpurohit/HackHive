import React, { useEffect, useRef } from 'react';

const POINTER_OFFSCREEN = -1000;
const PARTICLE_DENSITY = 2300;
const LINK_DISTANCE = 80;
const MOUSE_LINK_DISTANCE = 150;

const Constellations = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    
    const setSize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    
    setSize();
    window.addEventListener('resize', setSize);

    const particles: Particle[] = [];
    const particleCount = Math.floor(width * height / PARTICLE_DENSITY);

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      baseX: number;
      baseY: number;
      size: number;
      color: string;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.baseX = this.x;
        this.baseY = this.y;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 2 + 0.5;
        this.color = `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.1})`;
      }

      update(mouseX: number, mouseY: number) {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        if (mouseX !== POINTER_OFFSCREEN) {
          const dx = mouseX - this.x;
          const dy = mouseY - this.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 1) return;

          const forceDirectionX = dx / distance;
          const forceDirectionY = dy / distance;
          const maxDistance = 150;
          const force = Math.max(0, (maxDistance - distance) / maxDistance);
          
          if (distance < maxDistance) {
            this.x -= forceDirectionX * force * 5;
            this.y -= forceDirectionY * force * 5;
          }
          
          if (this.x !== this.baseX) {
            const dx2 = this.x - this.baseX;
            this.x -= dx2 / 100;
          }
          if (this.y !== this.baseY) {
            const dy2 = this.y - this.baseY;
            this.y -= dy2 / 100;
          }
        }
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    let mouseX = POINTER_OFFSCREEN;
    let mouseY = POINTER_OFFSCREEN;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    
    let scrollY = window.scrollY;
    let targetScrollY = window.scrollY;
    
    const handleScroll = () => {
      targetScrollY = window.scrollY;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    let animationFrameId: number;
    let isPageVisible = !document.hidden;

    const handleVisibilityChange = () => {
      isPageVisible = !document.hidden;
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    const animate = () => {
      if (!isPageVisible) {
        animationFrameId = requestAnimationFrame(animate);
        return;
      }

      // Smooth the scroll value so the constellation layer drifts instead of snapping.
      scrollY += (targetScrollY - scrollY) * 0.1;
      
      context.clearRect(0, 0, width, height);

      const buckets = new Map<string, Array<{ index: number; x: number; y: number; particle: Particle }>>();
      const frameParticles = particles.map((particle, index) => {
        particle.update(mouseX, mouseY);
          
        const parallaxFactor = particle.size * 0.2;
        const py = particle.y - (scrollY * parallaxFactor);
        const wrappedY = ((py % height) + height) % height;
        const frameParticle = { index, x: particle.x, y: wrappedY, particle };
        const bucketKey = `${Math.floor(frameParticle.x / LINK_DISTANCE)}:${Math.floor(frameParticle.y / LINK_DISTANCE)}`;
        const bucket = buckets.get(bucketKey);

        if (bucket) {
          bucket.push(frameParticle);
        } else {
          buckets.set(bucketKey, [frameParticle]);
        }

        return frameParticle;
      });

      for (const frameParticle of frameParticles) {
        const { index, x, y, particle } = frameParticle;
          
        context.beginPath();
        context.arc(x, y, particle.size, 0, Math.PI * 2);
        context.fillStyle = particle.color;
        context.fill();

        const cellX = Math.floor(x / LINK_DISTANCE);
        const cellY = Math.floor(y / LINK_DISTANCE);

        for (let offsetX = -1; offsetX <= 1; offsetX++) {
          for (let offsetY = -1; offsetY <= 1; offsetY++) {
            const neighbors = buckets.get(`${cellX + offsetX}:${cellY + offsetY}`);
            if (!neighbors) continue;

            for (const neighbor of neighbors) {
              if (neighbor.index <= index) continue;

              const dx = x - neighbor.x;
              const dy = y - neighbor.y;
              const distanceSquared = dx * dx + dy * dy;
              
              if (distanceSquared < LINK_DISTANCE * LINK_DISTANCE) {
                const distance = Math.sqrt(distanceSquared);
                context.beginPath();
                context.strokeStyle = `rgba(255, 255, 255, ${0.15 - distance / LINK_DISTANCE * 0.15})`;
                context.lineWidth = 0.5;
                context.moveTo(x, y);
                context.lineTo(neighbor.x, neighbor.y);
                context.stroke();
              }
            }
          }
        }
          
        const dxMouse = mouseX - x;
        const dyMouse = mouseY - y;
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
          
        if (distMouse < MOUSE_LINK_DISTANCE) {
          context.beginPath();
          context.strokeStyle = `rgba(100, 200, 255, ${0.3 - distMouse / MOUSE_LINK_DISTANCE * 0.3})`;
          context.lineWidth = 1;
          context.moveTo(x, y);
          context.lineTo(mouseX, mouseY);
          context.stroke();
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', setSize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.8 }}
    />
  );
};
export default Constellations;
