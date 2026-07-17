import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Megaphone, Clock, Tag, ChevronRight } from 'lucide-react';

type AnnouncementCategory = 'ALL' | 'EVENT' | 'PROJECT' | 'COMMUNITY' | 'GRANT';

interface Announcement {
  id: string;
  date: string;
  category: Exclude<AnnouncementCategory, 'ALL'>;
  title: string;
  summary: string;
  body: string;
  link?: { label: string; href: string };
  isNew?: boolean;
}

const ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-000',
    date: '2026-07-17',
    category: 'EVENT',
    title: 'ONLINE WORKSHOP — SUNDAY 20 JULY',
    summary: 'A hands-on online session where we walk through getting everything set up — tools, editors, Hackatime, and your first project.',
    body: `We are running an online workshop this Sunday, 20 July.

We will walk through the full setup from scratch: installing the right tools, configuring your editor, getting Hackatime tracking your work, and creating your first project repository.

No prior experience needed. If you have been putting off getting started because you did not know where to begin, this is the session for you.

The meeting link will be dropped in Discord 30 minutes before we go live. Join the server now so you do not miss it.`,
    link: { label: 'Join Discord for the link', href: 'https://discord.gg/YJFJ4DyD6D' },
    isNew: true,
  },
];

const CATEGORY_COLORS: Record<Exclude<AnnouncementCategory, 'ALL'>, string> = {
  EVENT: 'text-yellow-400 border-yellow-400/30 bg-yellow-400/5',
  PROJECT: 'text-blue-400 border-blue-400/30 bg-blue-400/5',
  COMMUNITY: 'text-green-400 border-green-400/30 bg-green-400/5',
  GRANT: 'text-purple-400 border-purple-400/30 bg-purple-400/5',
};

const CATEGORIES: AnnouncementCategory[] = ['ALL', 'EVENT', 'PROJECT', 'COMMUNITY', 'GRANT'];

const AnnouncementsPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<AnnouncementCategory>('ALL');
  const [expandedId, setExpandedId] = useState<string | null>(ANNOUNCEMENTS[0].id);

  const filtered = ANNOUNCEMENTS.filter(
    (a) => activeCategory === 'ALL' || a.category === activeCategory
  );

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();
  };

  return (
    <div className="relative min-h-screen bg-[#000] text-white pt-28 pb-24">
      {/* Subtle grid background */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8 md:mb-10"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px w-12 bg-white/30" />
            <span className="font-mono text-gray-500 text-xs tracking-[0.3em] uppercase">
              BROADCAST_LOG // WHAT'S HAPPENING
            </span>
          </div>
          <div className="flex items-start gap-6 mb-6">
            <Megaphone className="w-8 h-8 md:w-12 md:h-12 text-white/20 mt-2 shrink-0" />
            <h1 className="text-4xl md:text-7xl lg:text-8xl font-sans font-light tracking-widest uppercase leading-none">
              ANNOUNCE<span className="text-white/30">MENTS_</span>
            </h1>
          </div>
          <div className="w-full h-px bg-white/10 mt-6" />
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex gap-2 flex-wrap mb-12"
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              data-hover="true"
              className={`font-mono text-[10px] tracking-[0.25em] uppercase px-4 py-2 border transition-all duration-200 ${
                activeCategory === cat
                  ? 'bg-white text-black border-white'
                  : 'text-gray-500 border-white/10 hover:border-white/30 hover:text-white bg-transparent'
              }`}
            >
              [{cat}]
            </button>
          ))}
        </motion.div>

        {/* Announcements List */}
        <motion.div layout className="space-y-px">
          <AnimatePresence mode="popLayout">
            {filtered.length === 0 && (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-20 text-center font-mono text-gray-600 text-sm tracking-widest uppercase"
              >
                // NO_POSTS_IN_CATEGORY
              </motion.div>
            )}

            {filtered.map((ann, i) => {
              const isOpen = expandedId === ann.id;
              return (
                <motion.div
                  key={ann.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="border border-white/10 overflow-hidden"
                >
                  {/* Header row */}
                  <button
                    onClick={() => setExpandedId(isOpen ? null : ann.id)}
                    data-hover="true"
                    className="w-full text-left px-6 py-6 md:px-8 md:py-7 bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
                  >
                    <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-6">
                      {/* Date + Category */}
                      <div className="flex items-center gap-3 shrink-0">
                        <div className="flex items-center gap-1.5 text-gray-600 font-mono text-[10px] tracking-widest">
                          <Clock className="w-3 h-3" />
                          {formatDate(ann.date)}
                        </div>
                        <div
                          className={`flex items-center gap-1 border px-2.5 py-0.5 font-mono text-[9px] tracking-[0.2em] uppercase ${CATEGORY_COLORS[ann.category]}`}
                        >
                          <Tag className="w-2.5 h-2.5" />
                          {ann.category}
                        </div>
                        {ann.isNew && (
                          <span className="font-mono text-[8px] tracking-[0.2em] uppercase bg-white text-black px-2 py-0.5 animate-pulse">
                            NEW
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <div className="flex-1 flex items-center justify-between gap-4">
                        <span className="font-mono text-sm md:text-base text-white/90 tracking-wider">
                          {ann.title}
                        </span>
                        <motion.div
                          animate={{ rotate: isOpen ? 90 : 0 }}
                          transition={{ duration: 0.25 }}
                          className="text-white/30 shrink-0"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </motion.div>
                      </div>
                    </div>

                    {/* Summary (visible when closed) */}
                    {!isOpen && (
                      <p className="mt-3 font-sans font-light text-gray-600 text-sm leading-relaxed">
                        {ann.summary}
                      </p>
                    )}
                  </button>

                  {/* Expanded body */}
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-8 md:px-8 md:pb-10 pt-4 border-t border-white/5">
                          {/* Divider line */}
                          <div className="flex items-center gap-4 mb-6">
                            <div className="h-px flex-1 bg-white/5" />
                            <span className="font-mono text-gray-700 text-[9px] tracking-[0.3em] uppercase">
                              FULL_POST
                            </span>
                            <div className="h-px flex-1 bg-white/5" />
                          </div>

                          {/* Body text */}
                          <div className="space-y-4 mb-8">
                            {ann.body.split('\n\n').map((para, pi) => (
                              <p
                                key={pi}
                                className="font-sans font-light text-gray-400 text-sm md:text-base leading-relaxed"
                              >
                                {para}
                              </p>
                            ))}
                          </div>

                          {/* Link */}
                          {ann.link && (
                            <motion.a
                              href={ann.link.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-3 border border-white/20 px-6 py-3 font-mono text-xs tracking-widest uppercase text-white hover:bg-white hover:text-black transition-all"
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.97 }}
                              data-hover="true"
                            >
                              {ann.link.label} <ArrowUpRight className="w-3.5 h-3.5" />
                            </motion.a>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Footer note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-16 md:mt-24 pt-8 border-t border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
        >
          <p className="font-mono text-gray-700 text-xs tracking-widest uppercase">
            // UPDATES POSTED TO DISCORD FIRST
          </p>
          <motion.a
            href="https://discord.gg/YJFJ4DyD6D"
            className="inline-flex items-center gap-2 font-mono text-xs tracking-widest uppercase text-gray-500 hover:text-white transition-colors"
            whileHover={{ x: 4 }}
            data-hover="true"
          >
            Join Discord <ArrowUpRight className="w-3 h-3" />
          </motion.a>
        </motion.div>
      </div>
    </div>
  );
};

export default AnnouncementsPage;
