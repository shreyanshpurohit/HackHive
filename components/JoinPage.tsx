import { motion } from 'framer-motion';
import { ArrowLeft, ArrowUpRight, Check, FileText, MessageCircle, PartyPopper } from 'lucide-react';
import Constellations from './Constellations';
import CustomCursor from './CustomCursor';
import HiveField from './HiveField';

const STEPS = [
  {
    number: '01',
    icon: FileText,
    label: 'REGISTER',
    title: 'Fill out the Hack Club form',
    description: 'Start with the official Hack Club registration form. Add your details, submit it, and your first step is done.',
    action: 'Open registration form',
    href: 'https://hack.club/join/GXVIWV',
  },
  {
    number: '02',
    icon: MessageCircle,
    label: 'CONNECT',
    title: 'Join the Discord server',
    description: 'Come meet the hive. Say hello, share what you want to build, ask questions, and find people to create with.',
    action: 'Join our Discord',
    href: 'https://discord.gg/YJFJ4DyD6D',
  },
  {
    number: '03',
    icon: PartyPopper,
    label: 'ENJOY',
    title: 'You are in. Start making.',
    description: 'Pick an idea, open a blank file, break something interesting, and share the progress. Welcome to HackHive.',
    action: 'Explore member builds',
    href: '/#projects',
  },
] as const;

const JoinPage = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white selection:bg-white selection:text-black cursor-none">
      <div className="fixed inset-0 z-0 pointer-events-none opacity-70">
        <Constellations />
        <HiveField />
      </div>

      <CustomCursor />

      <nav className="relative z-20 flex items-center justify-between px-6 py-6 md:px-10">
        <a href="/" data-hover="true" aria-label="HackHive home">
          <img src="/hackhive.svg" alt="HackHive" className="h-auto w-28 object-contain md:w-36" />
        </a>
        <a
          href="/"
          data-hover="true"
          className="flex items-center gap-2 border border-white/15 px-4 py-3 font-mono text-[10px] uppercase tracking-[0.2em] text-white/70 transition hover:border-white/40 hover:text-white md:px-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back home
        </a>
      </nav>

      <main className="relative z-10 mx-auto max-w-7xl px-6 pb-24 pt-16 md:px-10 md:pb-32 md:pt-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-16 max-w-4xl md:mb-24"
        >
          <p className="mb-6 font-mono text-xs uppercase tracking-[0.35em] text-gray-500">
            // JOIN_SEQUENCE
          </p>
          <h1 className="text-5xl font-light uppercase leading-[0.9] tracking-wider md:text-8xl lg:text-9xl">
            Three steps.<br />One hive.
          </h1>
          <p className="mt-8 max-w-2xl font-mono text-sm leading-relaxed text-gray-400 md:text-base">
            No experience check. No complicated onboarding. Register, join the conversation, and start building with teenagers across India.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 border border-white/10 bg-white/10 lg:grid-cols-3 lg:gap-px">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            const isExternal = step.href.startsWith('http');

            return (
              <motion.article
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 + index * 0.15 }}
                className="group flex min-h-[430px] flex-col bg-black p-7 transition-colors hover:bg-[#070707] md:p-10"
              >
                <div className="mb-14 flex items-start justify-between">
                  <span className="font-mono text-5xl font-light text-white/15 transition-colors group-hover:text-white/30 md:text-6xl">
                    {step.number}
                  </span>
                  <div className="border border-white/15 p-3 text-white/60 transition group-hover:border-white/40 group-hover:text-white">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>

                <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.3em] text-gray-500">
                  {step.label}
                </p>
                <h2 className="mb-5 text-2xl font-light uppercase tracking-widest md:text-3xl">
                  {step.title}
                </h2>
                <p className="mb-10 font-mono text-sm leading-relaxed text-gray-500">
                  {step.description}
                </p>

                <a
                  href={step.href}
                  target={isExternal ? '_blank' : undefined}
                  rel={isExternal ? 'noopener noreferrer' : undefined}
                  data-hover="true"
                  className="mt-auto flex w-full items-center justify-between border border-white/20 px-5 py-4 font-mono text-[10px] uppercase tracking-[0.18em] transition hover:bg-white hover:text-black"
                >
                  {step.action}
                  {index === 2 ? <Check className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                </a>
              </motion.article>
            );
          })}
        </div>

        <p className="mt-8 text-center font-mono text-[10px] uppercase tracking-[0.25em] text-gray-600">
          Build · Break · Learn · Repeat
        </p>
      </main>
    </div>
  );
};

export default JoinPage;
