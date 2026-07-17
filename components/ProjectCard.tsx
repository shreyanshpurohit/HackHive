import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { Project } from '../types';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div style={{ perspective: 1000 }} className="relative w-full h-[350px] md:h-[450px]">
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="w-full h-full border border-white/10 rounded-none overflow-hidden cursor-pointer group bg-[#000]"
      >
        <motion.div
          style={{ transform: "translateZ(50px)" }}
          className="absolute inset-x-4 top-4 bottom-24 rounded-none overflow-hidden pointer-events-none border border-white/10"
        >
          <img 
            src={project.image} 
            alt={project.title} 
            className="w-full h-full object-cover grayscale opacity-60 transition-all duration-700 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105" 
          />
          <div className="absolute inset-0 z-10 pointer-events-none transform-gpu mix-blend-overlay">
             <div className="absolute top-0 -left-[100%] w-[50%] h-full bg-gradient-to-r from-transparent via-white to-transparent skew-x-[-20deg] group-hover:animate-[sweep_1.5s_ease-in-out_infinite]" />
          </div>
        </motion.div>

        <motion.div style={{ transform: "translateZ(80px)" }} className="absolute bottom-6 left-6 right-6">
          <div className="flex gap-2 mb-3 overflow-x-auto no-scrollbar mask-gradient">
            {project.tags.map(tag => (
              <span key={tag} className="text-[10px] md:text-xs font-mono px-2 py-1 text-gray-400 border border-white/20 rounded-none backdrop-blur-sm whitespace-nowrap bg-[#000]">
                {tag}
              </span>
            ))}
          </div>
          <div className="flex items-center justify-between">
            <h3 className="text-xl md:text-2xl font-light font-sans uppercase text-white truncate pr-4">
              {project.title}
            </h3>
            <div className="p-2 border border-white/20 group-hover:bg-white group-hover:text-black transition-all shrink-0 rounded-none">
              <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5" />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ProjectCard;
