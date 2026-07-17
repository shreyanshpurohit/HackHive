import React, { useState } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { ArrowDown, Terminal, Cpu, Code, type LucideIcon } from 'lucide-react';
import StorySection from './StorySection';
import Galaxy from './Galaxy';
import TerminalText from './TerminalText';

const COMMUNITY_FEATURES: Array<{ icon: LucideIcon; title: string; desc: string }> = [
  {
    icon: Terminal,
    title: 'No spectator mode',
    desc: 'Post the unfinished build. Share the ugly first version. Progress starts before polish.',
  },
  {
    icon: Cpu,
    title: 'Debug with humans',
    desc: 'Bring the cursed error. Someone in the hive has probably fought its cousin.',
  },
  {
    icon: Code,
    title: 'Turn hours into hardware',
    desc: 'Track the work, ship a qualifying project, and unlock support through Hack Club.',
  },
];

const getIntroScrollLimit = () =>
  typeof window === 'undefined' ? 1000 : window.innerHeight * 1.5;

const HomePage: React.FC = () => {
  const { scrollY } = useScroll();

  const [scrollLimit, setScrollLimit] = useState(getIntroScrollLimit);
  const introDisplay = useTransform(scrollY, (value) =>
    value > scrollLimit + 50 ? 'none' : 'flex'
  );

  const mouseX = useMotionValue(typeof window !== 'undefined' ? window.innerWidth / 2 : 0);
  const mouseY = useMotionValue(typeof window !== 'undefined' ? window.innerHeight / 2 : 0);
  const smoothMouseX = useSpring(mouseX, { stiffness: 400, damping: 50 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 400, damping: 50 });

  const pageShiftX = useTransform(
    smoothMouseX,
    [0, typeof window !== 'undefined' ? window.innerWidth : 1000],
    [-30, 30]
  );
  const pageShiftY = useTransform(
    smoothMouseY,
    [0, typeof window !== 'undefined' ? window.innerHeight : 1000],
    [-30, 30]
  );

  React.useEffect(() => {
    const handleResize = () => setScrollLimit(getIntroScrollLimit());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const galaxyScale = useTransform(scrollY, [0, scrollLimit * 0.8], [0.75, 0.4]);
  const galaxyOpacity = useTransform(scrollY, [0, scrollLimit * 0.8], [1, 0]);

  const textScale = useTransform(scrollY, [0, scrollLimit * 0.8], [1, 25]);
  const textOpacity = useTransform(scrollY, [scrollLimit * 0.3, scrollLimit * 0.8], [1, 0]);
  const overlayOpacity = useTransform(scrollY, [scrollLimit * 0.8, scrollLimit], [1, 0]);
  const scrollPromptOpacity = useTransform(scrollY, [0, 100], [1, 0]);
  const introTaglineOpacity = useTransform(scrollY, [0, scrollLimit * 0.2], [1, 0]);

  const handleMouseMove = (e: React.MouseEvent) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  };

  return (
    <div onMouseMove={handleMouseMove}>
      {/* Intro scroll spacer */}
      <div className="absolute top-0 w-full h-[150vh] pointer-events-none" />

      {/* Galaxy overlay */}
      <motion.div
        className="fixed inset-0 z-40 flex justify-center items-center pointer-events-none overflow-hidden bg-transparent"
        style={{ opacity: overlayOpacity, display: introDisplay }}
      >
        <motion.div className="absolute inset-0 bg-[#000]" style={{ opacity: overlayOpacity }} />
        <motion.div
          className="absolute inset-0 flex items-center justify-center will-change-transform"
          style={{ scale: galaxyScale, opacity: galaxyOpacity }}
        >
          <Galaxy />
        </motion.div>
      </motion.div>

      {/* Logo intro */}
      <motion.div
        className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none overflow-hidden"
        style={{ opacity: textOpacity, display: introDisplay }}
      >
        <div
          className="absolute left-1/2 top-1/2 flex items-center justify-center -translate-x-1/2 -translate-y-1/2"
          style={{ width: 'min(70vw, 35rem)' }}
        >
          <motion.div
            className="w-full relative flex items-center justify-center rendering-pixelated"
            style={{ scale: textScale }}
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'radial-gradient(circle, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.7) 45%, transparent 65%)',
              }}
            />
            <img
              src="/hackhive.svg"
              alt="HackHive"
              className="w-full h-auto relative z-10 pointer-events-none object-contain rendering-pixelated"
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

      {/* Scroll prompt */}
      <motion.div
        className="fixed bottom-12 left-0 right-0 flex flex-col items-center justify-center z-50 pointer-events-none"
        style={{ opacity: scrollPromptOpacity }}
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-4"
        >
          <span className="font-mono text-xs tracking-widest uppercase text-white/50">
            Scroll in
          </span>
          <ArrowDown className="w-4 h-4 text-white/50" />
        </motion.div>
      </motion.div>

      {/* Main content after intro */}
      <div className="page-shift-clip">
        <motion.div
          className="relative w-full z-10 bg-transparent flex flex-col"
          style={{ marginTop: '150vh', x: pageShiftX, y: pageShiftY }}
        >
          {/* Hero header */}
          <header className="relative min-h-[70vh] flex flex-col items-center justify-center overflow-hidden px-4 md:py-32">
            <div className="z-10 text-center flex flex-col items-center w-full max-w-6xl pb-24 md:pb-20">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.2 }}
                className="flex items-center gap-3 md:gap-6 text-[10px] md:text-xs font-mono text-gray-400 tracking-[0.2em] md:tracking-[0.4em] uppercase mb-4 border border-white/10 px-6 py-3 rounded-none backdrop-blur-sm"
              >
                <span>ADARSH_PUBLIC_SCHOOL</span>
                <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-white animate-pulse rounded-none" />
                <span>VIKAS_PURI</span>
              </motion.div>

              <motion.div className="relative w-full flex justify-center items-center mt-4 border-y border-white/10 py-12 perspective-1000">
                <div className="relative w-full max-w-4xl mx-auto flex items-center justify-center">
                  <div className="absolute inset-0 bg-black/80 blur-[60px] rounded-[100%] pointer-events-none -z-10" />
                  <motion.img
                    src="/hackhive.svg"
                    alt="HackHive"
                    className="w-full object-contain relative z-10 rendering-pixelated"
                    initial={{ rotateX: 45, opacity: 0, y: 100 }}
                    animate={{ rotateX: 0, opacity: 1, y: 0 }}
                    transition={{ type: 'spring', stiffness: 50, damping: 20 }}
                    whileHover={{ scale: 1.05, rotate: 1, transition: { type: 'tween' } }}
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, delay: 0.5, ease: 'circOut' }}
                className="w-[1px] h-20 bg-white/20 mt-8 mb-8 mx-auto"
              />

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8, duration: 1 }}
                className="text-xs md:text-sm font-mono text-gray-500 max-w-xl mx-auto px-4 uppercase tracking-[0.3em] flex items-center justify-center"
              >
                <TerminalText
                  text="bring the impossible draft // leave with something real"
                  delay={1200}
                />
              </motion.p>
            </div>
          </header>

          <StorySection />

          {/* Community Section */}
          <section
            id="community"
            className="relative z-10 py-20 md:py-32 border-t border-white/10 overflow-hidden bg-[#000]"
          >
            <div className="max-w-7xl mx-auto px-4 md:px-6 relative">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16 items-start">
                <motion.div
                  className="lg:col-span-5 order-2 lg:order-1 border border-white/10 p-8 md:p-12 bg-black/50 backdrop-blur-sm"
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                >
                  <h2 className="text-2xl md:text-4xl font-sans font-light mb-6 md:mb-8 tracking-widest uppercase">
                    COME BUILD WITH US
                  </h2>
                  <div className="w-12 h-px bg-white mb-6"></div>
                  <p className="text-sm md:text-base text-gray-400 mb-8 md:mb-12 font-mono leading-relaxed">
                    HackHive is a workbench for teenage builders. Bring the half-working game, the
                    impossible PCB, the app nobody asked for, or just a blank file. We will help you
                    make the next version real.
                  </p>

                  <motion.div
                    className="space-y-6"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-100px' }}
                    variants={{
                      visible: { transition: { staggerChildren: 0.2 } },
                      hidden: {},
                    }}
                  >
                    {COMMUNITY_FEATURES.map((feature, i) => (
                      <motion.div
                        key={i}
                        className="flex items-start gap-4 border-t border-white/10 pt-6"
                        variants={{
                          hidden: { opacity: 0, x: -20, filter: 'blur(10px)' },
                          visible: {
                            opacity: 1,
                            x: 0,
                            filter: 'blur(0px)',
                            transition: { duration: 0.8, ease: 'easeOut' },
                          },
                        }}
                        whileHover={{ scale: 1.02, x: 10, backgroundColor: 'rgba(255,255,255,0.02)' }}
                      >
                        <div className="p-2 border border-white/20">
                          <feature.icon className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <h4 className="text-xs md:text-sm tracking-widest text-white uppercase font-mono mb-2">
                            {feature.title}
                          </h4>
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
                    </motion.a>
                  </motion.div>
                </motion.div>

                <div className="lg:col-span-7 relative h-[300px] md:h-full min-h-[500px] w-full order-1 lg:order-2 border border-white/10 p-2">
                  <div className="relative h-full w-full overflow-hidden group">
                    <img
                      src="/hackhive-letter.png"
                      alt="HackHive letter h with bees and a honeycomb pattern"
                      width={609}
                      height={665}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-contain bg-[#080b09] p-6 transition-transform duration-700 group-hover:scale-[1.03] md:p-10 rendering-pixelated"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 flex flex-col gap-2">
                      <div className="text-5xl md:text-8xl font-mono font-light text-white opacity-20">
                        //
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="relative z-10 py-8 md:py-12 bg-[#000] border-t border-white/10">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
              <div>
                <div className="font-sans text-xl md:text-2xl font-light tracking-[0.2em] mb-4 text-white">
                  HACKHIVE
                </div>
                <div className="flex gap-2 text-[10px] font-mono text-gray-600 uppercase tracking-widest">
                  <span>&copy; {new Date().getFullYear()} HACKHIVE_ADARSH_PUBLIC_SCHOOL</span>
                </div>
              </div>

              <div className="flex gap-6 md:gap-8 flex-wrap">
                <motion.a
                  whileHover={{ scale: 1.2, rotate: -10 }}
                  href="https://discord.gg/YJFJ4DyD6D"
                  className="text-gray-500 hover:text-white font-mono uppercase text-[10px] tracking-widest transition-colors cursor-pointer"
                  data-hover="true"
                >
                  [DSCD]
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  href="https://hack.club/join/GXVIWV"
                  className="text-gray-500 hover:text-white font-mono uppercase text-[10px] tracking-widest transition-colors cursor-pointer"
                  data-hover="true"
                >
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

export default HomePage;
