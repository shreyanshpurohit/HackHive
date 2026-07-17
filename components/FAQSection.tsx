import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

type FAQItem = {
  question: string;
  answer: string;
};

const FAQ_DATA: FAQItem[] = [
  {
    question: "WHAT IS HACKHIVE?",
    answer: "HackHive is a community for teenagers who make things. Software, hardware, games, art, strange prototypes: if you can build it, break it, and learn from it, it belongs here."
  },
  {
    question: "HOW DOES HACKATIME WORK?",
    answer: "Hackatime records coding time from your editor and gives your project a trail of real effort. Some Hack Club programs use that work, alongside a qualifying shipped project, to award credits, hardware, grants, and other support."
  },
  {
    question: "IS AI CODE GENERATION ALLOWED?",
    answer: "Yes. Use it as a power tool, not an autopilot. You should understand what ships, make the decisions, fix the failures, and be able to explain the build without hiding behind a prompt."
  },
  {
    question: "DO I NEED TO BE AN EXPERT?",
    answer: "No. Experts are just beginners with a longer failure history. Show up with your first HTML file, a broken Arduino sketch, or a folder called final-final-v3. We start from wherever you are."
  },
  {
    question: "HOW MUCH DOES IT COST?",
    answer: "Nothing. HackHive and Hack Club are free for teenagers. Your entry fee is curiosity; your receipt is whatever you make."
  }
];

const FAQSection = () => {
  // Keep the first answer open so the section does not feel empty on arrival.
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="relative z-10 py-24 md:py-48 bg-[#000] border-t border-white/10 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-16 md:mb-24">
          <div className="h-px w-12 bg-white/30" />
          <span className="font-mono text-gray-500 text-xs md:text-sm tracking-[0.3em] uppercase">NOTES // THINGS PEOPLE ASK</span>
        </div>

        <h2 className="text-3xl md:text-6xl lg:text-7xl font-sans font-light tracking-widest uppercase leading-none text-white mb-16 md:mb-24">
          QUESTIONS_<span className="text-white/30">WE_GET</span>
        </h2>

        <div className="space-y-4">
          {FAQ_DATA.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="border border-white/10 overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full text-left px-6 py-6 md:px-8 md:py-8 flex items-center justify-between bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
                  data-hover="true"
                >
                  <span className="font-mono text-sm md:text-base tracking-widest text-white/90">
                    [ {String(index + 1).padStart(2, '0')} ] {faq.question}
                  </span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-white/50"
                  >
                    {isOpen ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                  </motion.div>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-6 md:px-8 md:pb-8 pt-2 font-sans font-light text-gray-400 text-sm md:text-base leading-relaxed border-t border-white/5">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
