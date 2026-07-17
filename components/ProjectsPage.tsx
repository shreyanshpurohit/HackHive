import React from 'react';
import { motion } from 'framer-motion';
import ProjectCard from './ProjectCard';
import type { Project } from '../types';

const PROJECTS: Project[] = [
  {
    id: 'p1',
    title: 'DumbGPT 🫠🥔',
    tags: ['AI', 'React'],
    image: '/dumbgpt_ui.png',
    description: 'A chatbot with maximum confidence and minimum wisdom. Proof that a deliberately ridiculous idea can still teach you serious React and AI skills.',
  },
  {
    id: 'p2',
    title: 'Direct JSON ↔ Raw Protobuf Editor',
    tags: ['Tooling', 'Web'],
    image: '/protobuf_ui.png',
    description: 'A browser tool that cracks open raw protobuf bytes without a full project setup. Built to turn "what is even in this file?" into something you can inspect.',
  },
  {
    id: 'p3',
    title: 'Handheld game console',
    tags: ['Hardware', 'Retro'],
    image: '/blue_pcb.png',
    description: 'A tiny Linux-capable handheld, built from the PCB up. Buttons, emulators, hard constraints, and the kind of mistakes that become real hardware knowledge.',
  },
  {
    id: 'p4',
    title: 'uVision dev board',
    tags: ['Embedded', 'C++'],
    image: '/black_pcb.png',
    description: 'A low-power vision board for edge-AI experiments without the laptop. Small footprint, ambitious target, extremely real debugging sessions.',
  },
];

const ProjectsPage: React.FC = () => {
  return (
    <div className="relative min-h-screen bg-[#000] text-white pt-28 pb-24">
      <div className="relative z-10 max-w-[1600px] mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16 md:mb-24"
        >
          <div className="flex items-center gap-4 mb-10">
            <div className="h-px w-12 bg-white/30" />
            <span className="font-mono text-gray-500 text-xs tracking-[0.3em] uppercase">
              ARCHIVE // SHIPPED_WORK
            </span>
          </div>
          <h1 className="text-5xl md:text-8xl font-sans font-light tracking-widest uppercase leading-none mb-4">
            STUFF<br />
            <span className="text-white/30">WE_MADE</span>
          </h1>
          <p className="text-gray-500 font-mono tracking-widest uppercase text-xs">
            // not concepts. not coursework. things that exist.
          </p>
          <div className="w-full h-px bg-white/10 mt-8" />
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-white/10 border border-white/10">
          {PROJECTS.map((project, i) => (
            <motion.div
              key={project.id}
              className="bg-[#000]"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.8, delay: i * 0.15, ease: 'easeOut' }}
            >
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;
