import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Constellations from './Constellations';
import CustomCursor from './CustomCursor';
import WanderingBee from './WanderingBee';
import CursorBee from './CursorBee';
import HiveField from './HiveField';
import { Outlet } from 'react-router-dom';

const NAV_LINKS = [
  { label: 'Arcade', path: '/arcade' },
  { label: 'Projects', path: '/projects' },
  { label: 'About', path: '/about' },
  { label: 'Announcements', path: '/announcements' },
  { label: 'FAQ', path: '/faq' },
] as const;

const Layout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinkClass = (path: string) =>
    `hover:text-gray-400 transition-colors cursor-pointer bg-transparent border-none font-mono text-xs tracking-widest uppercase no-underline ${
      location.pathname === path ? 'text-gray-400' : 'text-white'
    }`;

  return (
    <div className="relative min-h-screen text-white selection:bg-white selection:text-black cursor-none bg-[#000]">
      {/* Fixed background layers */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <Constellations />
        <HiveField />
      </div>

      <CustomCursor />
      <WanderingBee />
      <CursorBee />

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 md:px-8 py-6 mix-blend-difference pointer-events-auto">
        <Link to="/" className="cursor-pointer" data-hover="true">
          <img
            src="/hackhive.svg"
            alt="HackHive"
            className="h-auto w-28 md:w-36 object-contain"
          />
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex gap-10 text-xs font-mono tracking-widest uppercase">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={navLinkClass(link.path)}
              data-hover="true"
            >
              [{link.label}]
            </Link>
          ))}
        </div>

        <a
          href="https://hack.club/join/GXVIWV"
          className="hidden md:inline-block border border-white/20 px-8 py-3 text-xs font-mono tracking-widest uppercase hover:bg-white hover:text-black transition-all duration-300 text-white cursor-pointer bg-transparent rounded-none no-underline"
          data-hover="true"
        >
          Join HackHive
        </a>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-white z-50 relative w-10 h-10 flex items-center justify-center cursor-pointer"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[60] bg-[#000]/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8 md:hidden pointer-events-auto border-b border-white/10"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="text-2xl font-mono text-white hover:text-gray-400 transition-colors uppercase no-underline"
              >
                [{link.label}]
              </Link>
            ))}
            <a
              href="https://hack.club/join/GXVIWV"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-8 border border-white/20 px-10 py-4 text-xs font-mono tracking-widest uppercase bg-transparent text-white hover:bg-white hover:text-black transition-all rounded-none no-underline"
            >
              Join HackHive
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Outlet />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Layout;
