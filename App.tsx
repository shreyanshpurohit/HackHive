import React, { useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useMotionValue, useSpring, useMotionValueEvent } from 'framer-motion';
import { Terminal, Cpu, Code, Menu, X, ArrowDown, type LucideIcon } from 'lucide-react';
import Constellations from './components/Constellations';
import CustomCursor from './components/CustomCursor';
import ProjectCard from './components/ProjectCard';
import GamesSection from './components/GamesSection';
import StorySection from './components/StorySection';
import FAQSection from './components/FAQSection';
import Galaxy from './components/Galaxy';
import WanderingBee from './components/WanderingBee';
import CursorBee from './components/CursorBee';
import HiveField from './components/HiveField';
import type { Project } from './types';

import TerminalText from './components/TerminalText';

const NAV_ITEMS = ['Arcade', 'Community', 'Projects'] as const;

const PROJECTS: Project[] = [
  {
    id: 'p1',
    title: 'DumbGPT \uD83E\uDEE0\uD83E\uDD54',
    tags: ['AI', 'React'],
    image: '/dumbgpt_ui.png',
    description: 'A chatbot with maximum confidence and minimum wisdom. Proof that a deliberately ridiculous idea can still teach you serious React and AI skills.'
  },
  {
    id: 'p2',
    title: 'Direct JSON \u2194 Raw Protobuf Editor',
    tags: ['Tooling', 'Web'],
    image: '/protobuf_ui.png',
    description: 'A browser tool that cracks open raw protobuf bytes without a full project setup. Built to turn “what is even in this file?” into something you can inspect.'
  },
  {
    id: 'p3',
    title: 'Handheld game console',
    tags: ['Hardware', 'Retro'],
    image: '/blue_pcb.png',
    description: 'A tiny Linux-capable handheld, built from the PCB up. Buttons, emulators, hard constraints, and the kind of mistakes that become real hardware knowledge.'
  },
  {
    id: 'p4',
    title: 'uVision dev board',
    tags: ['Embedded', 'C++'],
    image: '/black_pcb.png',
    description: 'A low-power vision board for edge-AI experiments without the laptop. Small footprint, ambitious target, extremely real debugging sessions.'
  }
];

const COMMUNITY_FEATURES: Array<{ icon: LucideIcon; title: string; desc: string }> = [
  { icon: Terminal, title: 'No spectator mode', desc: 'Post the unfinished build. Share the ugly first version. Progress starts before polish.' },
  { icon: Cpu, title: 'Debug with humans', desc: 'Bring the cursed error. Someone in the hive has probably fought its cousin.' },
  { icon: Code, title: 'Turn hours into hardware', desc: 'Track the work, ship a qualifying project, and unlock support through Hack Club.' },
];

const getIntroScrollLimit = () => (typeof window === 'undefined' ? 1000 : window.innerHeight * 1.5);

const App: React.FC = () => {
  const { scrollY } = useScroll();

  // The intro animation should feel proportional to the current viewport height.
  const [scrollLimit, setScrollLimit] = useState(getIntroScrollLimit);
  const [showIntro, setShowIntro] = useState(true);

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > scrollLimit + 50) {
      if (showIntro) setShowIntro(false);
    } else {
      if (!showIntro) setShowIntro(true);
    }
  });

  const mouseX = useMotionValue(typeof window !== 'undefined' ? window.innerWidth / 2 : 0);
  const mouseY = useMotionValue(typeof window !== 'undefined' ? window.innerHeight / 2 : 0);
  const smoothMouseX = useSpring(mouseX, { stiffness: 400, damping: 50 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 400, damping: 50 });

  const pageShiftX = useTransform(smoothMouseX, [0, typeof window !== 'undefined' ? window.innerWidth : 1000], [-30, 30]);
  const pageShiftY = useTransform(smoothMouseY, [0, typeof window !== 'undefined' ? window.innerHeight : 1000], [-30, 30]);

  React.useEffect(() => {
    const handleResize = () => setScrollLimit(getIntroScrollLimit());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const galaxyScale = useTransform(scrollY, [0, scrollLimit * 0.8], [1, 0.5]);
  const galaxyOpacity = useTransform(scrollY, [0, scrollLimit * 0.8], [1, 0]);

  const textScale = useTransform(scrollY, [0, scrollLimit * 0.8], [0.04, 1]);
  const textOpacity = useTransform(scrollY, [scrollLimit * 0.3, scrollLimit * 0.8], [1, 0]);
  const overlayOpacity = useTransform(scrollY, [scrollLimit * 0.8, scrollLimit], [1, 0]);
  const scrollPromptOpacity = useTransform(scrollY, [0, 100], [1, 0]);
  const introTaglineOpacity = useTransform(scrollY, [0, scrollLimit * 0.2], [1, 0]);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  };

  return ( 
    <div 
      className="relative min-h-screen text-white selection:bg-white selection:text-black cursor-none bg-[#000]"
      onMouseMove={handleMouseMove}
    >
      {/* This spacer creates the scroll distance needed for the opening zoom sequence. */}
      <div className="absolute top-0 w-full h-[150vh] pointer-events-none" />

      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <Constellations />
        <HiveField />
      </div>

      {showIntro && (
        <>
          <motion.div
            className="fixed inset-0 z-40 flex justify-center items-center pointer-events-none overflow-hidden bg-transparent"
            style={{ opacity: overlayOpacity }}
          >
            <motion.div 
              className="absolute inset-0 bg-[#000]"
              style={{ opacity: overlayOpacity }}
            />

            <motion.div
              className="absolute inset-0 flex items-center justify-center will-change-transform"
              style={{
                scale: galaxyScale,
                opacity: galaxyOpacity,
                transform: 'translateZ(0)',
              }}
            >
              <Galaxy />
            </motion.div>
          </motion.div>

          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none overflow-hidden"
            style={{ opacity: textOpacity }}
          >
            <div
              className="absolute left-1/2 top-1/2 flex items-center justify-center -translate-x-1/2 -translate-y-1/2"
              style={{ width: 'min(1875vw, 1250rem)' }}
            >
              {/* Blur backdrop is outside the scaling container so it is cheap to render */}
              <div
                className="absolute inset-0 bg-black/80 rounded-[100%] pointer-events-none"
                style={{ filter: 'blur(40px)' }}
              />
              <motion.div
                className="w-full relative flex items-center justify-center will-change-transform"
                style={{ scale: textScale }}
              >
                <img
                  src="/hackhive.svg"
                  alt="HackHive"
                  className="w-full h-auto relative z-10 pointer-events-none object-contain"
                />
              </motion.div>
            </div>
            <motion.p
              className="absolute left-1/2 top-[calc(50%+min(28vw,19rem))] z-10 -translate-x-1/2 font-mono text-gray-400 tracking-[0.5em] md:tracking-[0.8em] text-[8px] md:text-xs uppercase text-center whitespace-nowrap"
              style={{ opacity: introTaglineOpacity }}
            >
              build · break · learn
              <span className="absolute inset-0 bg-black/60 blur-[10px] -z-10 rounded-full" />
            </motion.p>
          </motion.div>
        </>
      )}

      <motion.div 
        className="fixed bottom-12 left-0 right-0 flex flex-col items-center justify-center z-50 pointer-events-none"
        style={{ opacity: scrollPromptOpacity }}
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-4"
        >
          <span className="font-mono text-xs tracking-widest uppercase text-white/50">Scroll in</span>
          <ArrowDown className="w-4 h-4 text-white/50" />
        </motion.div>
      </motion.div>

      <CustomCursor />
      <WanderingBee />
      <CursorBee />
      
      <nav className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 md:px-8 py-6 mix-blend-difference pointer-events-auto">
        <img
          src="/hackhive.svg"
          alt="HackHive"
          className="h-auto w-28 md:w-36 object-contain z-50"
        />
        
        <div className="hidden md:flex gap-10 text-xs font-mono tracking-widest uppercase">
          {NAV_ITEMS.map((item) => (
            <button 
              key={item} 
              onClick={() => scrollToSection(item.toLowerCase())}
              className="hover:text-gray-400 transition-colors text-white cursor-pointer bg-transparent border-none"
              data-hover="true"
            >
              [{item}]
            </button>
          ))}
        </div>
        <a
          href="https://hack.club/join/GXVIWV"
          className="hidden md:inline-block border border-white/20 px-8 py-3 text-xs font-mono tracking-widest uppercase hover:bg-white hover:text-black transition-all duration-300 text-white cursor-pointer bg-transparent rounded-none"
          data-hover="true"
        >
          Join HackHive
        </a>

        <button 
          className="md:hidden text-white z-50 relative w-10 h-10 flex items-center justify-center cursor-pointer"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[60] bg-[#000]/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8 md:hidden pointer-events-auto border-b border-white/10"
          >
            {NAV_ITEMS.map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item.toLowerCase())}
                className="text-2xl font-mono text-white hover:text-gray-400 transition-colors uppercase bg-transparent border-none"
              >
                [{item}]
              </button>
            ))}
            <a
              href="https://hack.club/join/GXVIWV"
              className="mt-8 border border-white/20 px-10 py-4 text-xs font-mono tracking-widest uppercase bg-transparent text-white hover:bg-white hover:text-black transition-all rounded-none"
            >
              Join HackHive
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="page-shift-clip">
        <motion.div 
          className="relative w-full z-10 bg-transparent flex flex-col"
          style={{ marginTop: '150vh', x: pageShiftX, y: pageShiftY }}
        >
        <header className="relative min-h-[70vh] flex flex-col items-center justify-center overflow-hidden px-4 md:py-32">
          <div className="z-10 text-center flex flex-col items-center w-full max-w-6xl pb-24 md:pb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.2 }}
              className="flex items-center gap-3 md:gap-6 text-[10px] md:text-xs font-mono text-gray-400 tracking-[0.2em] md:tracking-[0.4em] uppercase mb-4 border border-white/10 px-6 py-3 rounded-none backdrop-blur-sm"
            >
              <span>ONLINE_NOW</span>
              <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-white animate-pulse rounded-none"/>
              <span>INDIA_WIDE</span>
            </motion.div>

            <motion.div 
               className="relative w-full flex justify-center items-center mt-4 border-y border-white/10 py-12 perspective-1000"
            >
              <div className="relative w-full max-w-4xl mx-auto flex items-center justify-center">
                <div className="absolute inset-0 bg-black/80 blur-[60px] rounded-[100%] pointer-events-none -z-10" />
                <motion.img 
                  src="/hackhive.svg"
                  alt="HackHive"
                  className="w-full object-contain relative z-10"
                  initial={{ rotateX: 45, opacity: 0, y: 100 }}
                  animate={{ rotateX: 0, opacity: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 50, damping: 20 }}
                  whileHover={{ 
                    scale: 1.05, 
                    rotate: 1, 
                    transition: { type: "tween" }
                  }}
                />
              </div>
            </motion.div>
            
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, delay: 0.5, ease: "circOut" }}
              className="w-[1px] h-20 bg-white/20 mt-8 mb-8 mx-auto"
            />

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8, duration: 1 }}
              className="text-xs md:text-sm font-mono text-gray-500 max-w-xl mx-auto px-4 uppercase tracking-[0.3em] flex items-center justify-center"
            >
              <TerminalText text="bring the impossible draft // leave with something real" delay={1200} />
            </motion.p>
          </div>
        </header>

        <StorySection />

        <GamesSection />

        <section id="projects" className="relative z-10 py-20 md:py-32 border-t border-white/10">
          <div className="max-w-[1600px] mx-auto px-4 md:px-6">
            <motion.div 
              className="flex flex-col justify-between items-start mb-16 md:mb-24 px-4 border-l-2 border-white pl-6"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h2 className="text-3xl md:text-5xl font-sans font-light uppercase tracking-widest leading-[1.1] mb-4">
                STUFF<br/>WE MADE
              </h2>
              <p className="text-gray-500 font-mono tracking-widest uppercase text-xs">
                // not concepts. not coursework. things that exist.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-white/10 border border-white/10">
              {PROJECTS.map((project, i) => (
                <motion.div 
                  key={project.id} 
                  className="bg-[#000]"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ duration: 0.8, delay: i * 0.2, ease: "easeOut" }}
                >
                  <ProjectCard project={project} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="community" className="relative z-10 py-20 md:py-32 border-t border-white/10 overflow-hidden bg-[#000]">
          <div className="max-w-7xl mx-auto px-4 md:px-6 relative">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16 items-start">
              <motion.div 
                className="lg:col-span-5 order-2 lg:order-1 border border-white/10 p-8 md:p-12 bg-black/50 backdrop-blur-sm"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <h2 className="text-2xl md:text-4xl font-sans font-light mb-6 md:mb-8 tracking-widest uppercase">
                  COME BUILD WITH US
                </h2>
                <div className="w-12 h-px bg-white mb-6"></div>
                <p className="text-sm md:text-base text-gray-400 mb-8 md:mb-12 font-mono leading-relaxed">
                  HackHive is an online workbench for teenage builders across India. Bring the half-working game, the impossible PCB, the app nobody asked for, or just a blank file. We will help you make the next version real.
                </p>
                
                <motion.div 
                  className="space-y-6"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                  variants={{
                    visible: { transition: { staggerChildren: 0.2 } },
                    hidden: {}
                  }}
                >
                  {COMMUNITY_FEATURES.map((feature, i) => (
                    <motion.div 
                      key={i} 
                      className="flex items-start gap-4 border-t border-white/10 pt-6"
                      variants={{
                        hidden: { opacity: 0, x: -20, filter: 'blur(10px)' },
                        visible: { opacity: 1, x: 0, filter: 'blur(0px)', transition: { duration: 0.8, ease: "easeOut" } }
                      }}
                      whileHover={{ scale: 1.02, x: 10, backgroundColor: "rgba(255,255,255,0.02)" }}
                    >
                      <div className="p-2 border border-white/20">
                        <feature.icon className="w-4 h-4 text-white" />
                      </div>
                      <div>
                         <h4 className="text-xs md:text-sm tracking-widest text-white uppercase font-mono mb-2">{feature.title}</h4>
                        <p className="text-xs text-gray-500 font-mono">{feature.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="mt-12"
                >
                  <motion.a
                    href="https://hack.club/join/GXVIWV"
                    className="group relative px-8 py-4 bg-white hover:bg-gray-200 text-black font-mono text-sm tracking-[0.2em] uppercase transition-all w-full sm:w-auto overflow-hidden flex items-center justify-center gap-4"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    data-hover="true"
                  >
                    <span className="relative z-10">Enter the hive</span>
                    <Terminal className="w-4 h-4 relative z-10" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent translate-x-[-100%] group-hover:animate-[sweep_1s_ease-in-out]" />
                  </motion.a>
                </motion.div>
              </motion.div>

              <div className="lg:col-span-7 relative h-[300px] md:h-full min-h-[500px] w-full order-1 lg:order-2 border border-white/10 p-2">
                <div className="relative h-full w-full overflow-hidden group">
                  <img 
                    src="/hackhive-letter.webp" 
                    alt="HackHive letter h with bees and a honeycomb pattern"
                    width={609}
                    height={665}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-contain bg-[#080b09] p-6 transition-transform duration-700 group-hover:scale-[1.03] md:p-10"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 flex flex-col gap-2">
                    <div className="text-5xl md:text-8xl font-mono font-light text-white opacity-20">
                      //
                    </div>
                    <div className="text-[10px] md:text-xs font-mono tracking-[0.3em] uppercase text-gray-400">
                      SYS_MODE: ONLINE_INDIA
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <FAQSection />

        <footer className="relative z-10 py-8 md:py-12 bg-[#000] border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
            <div>
               <div className="font-sans text-xl md:text-2xl font-light tracking-[0.2em] mb-4 text-white">HACKHIVE</div>
               <div className="flex gap-2 text-[10px] font-mono text-gray-600 uppercase tracking-widest">
                 <span>&copy; {new Date().getFullYear()} HACKHIVE_ONLINE_INDIA</span>
               </div>
            </div>
            
            <div className="flex gap-6 md:gap-8 flex-wrap">
              <motion.a whileHover={{ scale: 1.2, rotate: -10 }} href="https://discord.gg/YJFJ4DyD6D" className="text-gray-500 hover:text-white font-mono uppercase text-[10px] tracking-widest transition-colors cursor-pointer" data-hover="true">
                [DSCD]
              </motion.a>
              <motion.a whileHover={{ scale: 1.2, rotate: 10 }} href="https://hack.club/join/GXVIWV" className="text-gray-500 hover:text-white font-mono uppercase text-[10px] tracking-widest transition-colors cursor-pointer" data-hover="true">
                [HC]
              </motion.a>
            </div>
          </div>
        </footer>
        </motion.div>
      </div>
    </div>
  );
};

export default App;
