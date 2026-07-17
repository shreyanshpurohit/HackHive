import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

// ─── Team data ────────────────────────────────────────────────────────────────

interface TeamMember {
  name: string;
  handle: string;
  role: string;
  roleTag: string;
  bio: string;
}

const PRESIDENT: TeamMember = {
  name: 'Satvik Hardat',
  handle: '@SATVIK',
  role: 'PRESIDENT',
  roleTag: '● PRESIDENT',
  bio: 'Sets the chapter\'s direction, runs the showcase demos, and ships the hardest builds in the room — including ThinTensor, our Rust + PyTorch LLM runtime.',
};

const COUNCIL: TeamMember[] = [
  {
    name: 'Shreyansh Purohit',
    handle: '@shreyansh',
    role: 'VICE_PRESIDENT',
    roleTag: 'VP',
    bio: 'Builds things that break. Fixes the things that break. Builds them again.',
  },
  {
    name: 'Chirayu Singhal',
    handle: '@chirayu',
    role: 'VICE_PRESIDENT',
    roleTag: 'VP',
    bio: 'Embedded systems. Sometimes they do what he wants.',
  },
  {
    name: 'Arpitaa Nuna',
    handle: '@arpitaa',
    role: 'SECRETARY',
    roleTag: 'SEC',
    bio: 'Keeps the hive from collapsing into chaos. Mostly succeeds.',
  },
  {
    name: 'Harman Vij',
    handle: '@harmon',
    role: 'SECRETARY',
    roleTag: 'SEC',
    bio: 'Ships games that should not work. They do.',
  },
  {
    name: 'Vedansh',
    handle: '@vedansh',
    role: 'TREASURER',
    roleTag: 'TREAS',
    bio: 'Manages resources, tracks budgets, and makes sure the builds get funded.',
  },
];

const STATS = [
  { value: '25+', label: 'Active Builders' },
  { value: '12+', label: 'Projects Shipped' },
  { value: '2026', label: 'Founded' },
  { value: '100%', label: 'Free to Join' },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

const AboutPage: React.FC = () => {
  return (
    <div className="relative min-h-screen bg-[#000] text-white pt-28 pb-24">
      <div className="relative z-10 max-w-5xl mx-auto px-6">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-20 md:mb-28"
        >
          <div className="flex items-center gap-4 mb-10">
            <div className="h-px w-12 bg-white/30" />
            <span className="font-mono text-gray-500 text-xs tracking-[0.3em] uppercase">
              FIELD_NOTES // WHO WE ARE
            </span>
          </div>
          <h1 className="text-5xl md:text-8xl font-sans font-light tracking-widest uppercase leading-none mb-4">
            ABOUT
            <br />
            <span className="text-white/30">THE_HIVE</span>
          </h1>
          <p className="font-mono text-gray-600 text-xs tracking-widest uppercase mt-4">
            // one leader, five co-leaders, zero gatekeeping.
          </p>
          <div className="w-full h-px bg-white/10 mt-8" />
        </motion.div>

        {/* ── Mission ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-start mb-24 md:mb-36"
        >
          <div className="md:col-span-4">
            <span className="font-mono text-gray-500 text-xs tracking-widest uppercase">
              [ 01_MISSION ]
            </span>
          </div>
          <div className="md:col-span-8 text-xl md:text-3xl font-sans font-light leading-relaxed text-gray-300">
            HackHive is a community for teenage builders at Adarsh Public School, Vikas Puri. We
            exist because most schools give you a textbook — we give you a workbench.
          </div>
        </motion.div>

        {/* ── Stats ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10 border border-white/10 mb-24 md:mb-36"
        >
          {STATS.map((stat, i) => (
            <motion.div
              key={i}
              className="bg-[#000] p-8 md:p-10 flex flex-col gap-3 hover:bg-white/[0.03] transition-colors"
              whileHover={{ scale: 1.02 }}
            >
              <div className="text-3xl md:text-5xl font-sans font-light text-white tracking-wider">
                {stat.value}
              </div>
              <div className="font-mono text-gray-600 text-[10px] tracking-[0.25em] uppercase">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Team ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-24 md:mb-36"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px w-12 bg-white/30" />
            <span className="font-mono text-gray-500 text-xs tracking-[0.3em] uppercase">
              02_THE_TEAM
            </span>
          </div>
          <p className="font-sans font-light text-gray-500 text-sm mb-12 max-w-2xl">
            The crew keeping the Adarsh Public School chapter running — workshops, hackathons,
            demos, and discord.
          </p>

          {/* President */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative border border-white/10 p-6 md:p-8 mb-6 bg-white/[0.02] hover:bg-white/[0.04] transition-colors group overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-px bg-white/30" />
            <div className="flex flex-col md:flex-row items-start gap-6 md:gap-8">
              <div className="shrink-0">
                <div className="border border-white/20 px-3 py-1.5 font-mono text-[10px] tracking-[0.3em] uppercase text-white mb-3">
                  {PRESIDENT.roleTag}
                </div>
                <span className="font-mono text-gray-600 text-[10px] tracking-widest">
                  {PRESIDENT.handle}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-2xl md:text-4xl font-sans font-light text-white tracking-widest uppercase mb-4">
                  {PRESIDENT.name}
                </h3>
                <p className="font-mono text-sm text-gray-500 leading-relaxed max-w-xl">
                  {PRESIDENT.bio}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Council label */}
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-gray-600 text-[10px] tracking-[0.25em] uppercase">
              // COUNCIL
            </span>
            <span className="font-mono text-gray-700 text-[10px] tracking-[0.2em] uppercase">
              05 · RUNNING_THE_ROOM
            </span>
          </div>

          {/* Council grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-white/10 border border-white/10">
            {COUNCIL.map((member, i) => (
              <motion.div
                key={i}
                className={`bg-[#000] p-6 md:p-8 hover:bg-white/[0.03] transition-colors relative overflow-hidden group${i === COUNCIL.length - 1 ? ' sm:col-span-2' : ''}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                whileHover={{ x: 4 }}
              >
                <div className="absolute top-0 left-0 right-0 h-px bg-white/10 group-hover:bg-white/20 transition-colors" />
                <div className="flex items-start justify-between mb-4">
                  <div className="border border-white/20 px-2.5 py-1 font-mono text-[9px] tracking-[0.25em] uppercase text-white/70">
                    {member.roleTag}
                  </div>
                </div>
                <h4 className="font-mono text-sm tracking-widest text-white uppercase mb-1">
                  {member.name}
                </h4>
                <div className="font-mono text-gray-700 text-[9px] tracking-[0.2em] uppercase mb-4">
                  {member.role}
                </div>
                <p className="font-sans font-light text-gray-500 text-sm leading-relaxed mb-4">
                  {member.bio}
                </p>
                <span className="font-mono text-gray-600 text-[10px] tracking-widest">
                  {member.handle}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── What We Do ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-start mb-24 md:mb-36"
        >
          <div className="md:col-span-4">
            <span className="font-mono text-gray-500 text-xs tracking-widest uppercase">
              [ 03_WHAT_WE_DO ]
            </span>
          </div>
          <div className="md:col-span-8 space-y-6">
            {[
              {
                label: 'BUILD',
                text: 'Hardware, software, games, whatever. If you can make it and break it, it belongs here.',
              },
              {
                label: 'SHIP',
                text: 'Finished work through Hack Club programs. Real projects that exist — not prototypes that live in a folder called "final_v2".',
              },
              {
                label: 'EARN',
                text: 'Qualifying work tracked with Hackatime unlocks API credits, hardware, grants, and more through Hack Club.',
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                className="flex items-start gap-6 border-t border-white/10 pt-6"
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
              >
                <div className="font-mono text-[10px] tracking-[0.3em] text-white/40 pt-1 min-w-[4rem]">
                  {String(i + 1).padStart(2, '0')}.
                </div>
                <div>
                  <div className="font-mono text-xs tracking-widest text-white uppercase mb-2">
                    {item.label}
                  </div>
                  <p className="font-mono text-sm text-gray-500 leading-relaxed">{item.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="border border-white/20 p-8 md:p-16 relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-white/5 transform scale-y-0 group-hover:scale-y-100 origin-bottom transition-transform duration-700" />
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div>
              <h2 className="text-2xl md:text-4xl font-sans font-light text-white tracking-widest uppercase mb-3">
                READY TO BUILD?
              </h2>
              <p className="font-mono text-sm text-gray-500 max-w-md">
                Zero application. Zero cost. Just show up with something — even if it's broken.
              </p>
            </div>
            <motion.a
              href="https://hack.club/join/GXVIWV"
              className="flex items-center gap-3 px-8 py-4 bg-white text-black font-mono tracking-widest uppercase text-xs hover:bg-gray-200 transition-colors whitespace-nowrap"
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.97 }}
              data-hover="true"
            >
              Enter the hive <ArrowUpRight className="w-4 h-4" />
            </motion.a>
          </div>
        </motion.div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p className="font-mono text-gray-700 text-xs tracking-widest uppercase">
            © {new Date().getFullYear()} HACKHIVE_ADARSH_PUBLIC_SCHOOL
          </p>
          <motion.a
            href="https://discord.gg/YJFJ4DyD6D"
            className="inline-flex items-center gap-2 font-mono text-xs tracking-widest uppercase text-gray-500 hover:text-white transition-colors"
            whileHover={{ x: 4 }}
            data-hover="true"
          >
            Join Discord <ArrowUpRight className="w-3 h-3" />
          </motion.a>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
