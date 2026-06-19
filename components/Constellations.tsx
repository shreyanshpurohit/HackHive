import React, { useEffect, useRef } from 'react';

const Constellations = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = Math.max(window.innerHeight, 2000); // Allow it to span tall if needed, we'll set fixed to window for background
    
    // Resize handler
    const setSize = () => {
      width = window.innerWidth;
      height = window.innerHeight; // Keep it viewport sized and sticky
      canvas.width = width;
      canvas.height = height;
    };
    
    setSize();
    window.addEventListener('resize', setSize);

    // Particle system
    const particles: Particle[] = [];
    const particleCount = Math.floor(width * height / 1400); // Responsive particle count

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

        // Bounce off walls
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Mouse interaction
        if (mouseX !== -1000) {
          const dx = mouseX - this.x;
          const dy = mouseY - this.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const forceDirectionX = dx / distance;
          const forceDirectionY = dy / distance;
          
          // Repel radius
          const maxDistance = 150;
          let force = (maxDistance - distance) / maxDistance;
          
          if (force < 0) force = 0;
          
          // Push particles away
          if (distance < maxDistance) {
            this.x -= forceDirectionX * force * 5;
            this.y -= forceDirectionY * force * 5;
          }
          
          // Slowly return to base speed
          if (this.x !== this.baseX) {
             const dx2 = this.x - this.baseX;
             this.x -= dx2/100;
          }
          if (this.y !== this.baseY) {
             const dy2 = this.y - this.baseY;
             this.y -= dy2/100;
          }
        }
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }

    // Init particles
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    let mouseX = -1000;
    let mouseY = -1000;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    
    // Track scroll to offset particles
    let scrollY = window.scrollY;
    let targetScrollY = window.scrollY;
    
    const handleScroll = () => {
      targetScrollY = window.scrollY;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    let animationFrameId: number;

    const animate = () => {
      // Smooth scroll interpolation
      scrollY += (targetScrollY - scrollY) * 0.1;
      
      ctx.clearRect(0, 0, width, height);

      // Draw lines between close particles
      for (let i = 0; i < particles.length; i++) {
          particles[i].update(mouseX, mouseY);
          
          // Apply parallax based on particle size (closer = bigger = faster)
          const parallaxFactor = particles[i].size * 0.2;
          const py = particles[i].y - (scrollY * parallaxFactor);
          // Loop particles when they scroll off screen
          const wrappedY = ((py % height) + height) % height;
          
          // Draw individual particle
          ctx.beginPath();
          ctx.arc(particles[i].x, wrappedY, particles[i].size, 0, Math.PI * 2);
          ctx.fillStyle = particles[i].color;
          ctx.fill();
          
          for (let j = i; j < particles.length; j++) {
              const py2 = particles[j].y - (scrollY * (particles[j].size * 0.2));
              const wrappedY2 = ((py2 % height) + height) % height;

              // Check distance with wrapped coordinates
              let dx = particles[i].x - particles[j].x;
              let dy = wrappedY - wrappedY2;
              
              const distance = Math.sqrt(dx * dx + dy * dy);
              
              if (distance < 80) {
                  ctx.beginPath();
                  ctx.strokeStyle = `rgba(255, 255, 255, ${0.15 - distance/80 * 0.15})`;
                  ctx.lineWidth = 0.5;
                  ctx.moveTo(particles[i].x, wrappedY);
                  ctx.lineTo(particles[j].x, wrappedY2);
                  ctx.stroke();
              }
          }
          
          // Draw lines to mouse (no scroll wrapping needed for mouse, just local coords)
          // Since mouse is in screen space, we use wrappedY
          const dxMouse = mouseX - particles[i].x;
          const dyMouse = mouseY - wrappedY;
          const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
          
          if (distMouse < 150) {
              ctx.beginPath();
              ctx.strokeStyle = `rgba(100, 200, 255, ${0.3 - distMouse/150 * 0.3})`;
              ctx.lineWidth = 1;
              ctx.moveTo(particles[i].x, wrappedY);
              ctx.lineTo(mouseX, mouseY);
              ctx.stroke();
          }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', setSize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
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
