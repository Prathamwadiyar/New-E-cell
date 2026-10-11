import { motion } from 'framer-motion';
import { Coins, Users2, Cpu, Award, Network } from 'lucide-react';
import SectionBadge from '../ui/SectionBadge';
import { CursorCardsContainer, CursorCard } from '../ui/cursor-cards';

const benefitsData = [
  {
    label: 'Seed Grants & Funding',
    icon: Coins,
    desc: 'Direct access to micro-grants, hackathon sponsorship pools, and regional incubation seed funds.',
    tag: 'Financial Backing',
  },
  {
    label: 'Dream Teams & Co-Founders',
    icon: Users2,
    desc: 'Match with passionate developers, UI designers, and marketers ready to build ambitious products.',
    tag: 'Team Discovery',
  },
  {
    label: 'Hardware & Lab Access',
    icon: Cpu,
    desc: 'Borrow IoT kits, development boards, sensors, and 3D prototyping tools directly from our Resource Exchange.',
    tag: 'Campus Resources',
  },
  {
    label: 'Founder & Industry Mentors',
    icon: Network,
    desc: '1-on-1 sprint reviews and technical guidance from alumni startup founders and industry veterans.',
    tag: 'Expert Mentorship',
  },
  {
    label: 'Competitive Edge & Credentials',
    icon: Award,
    desc: 'National hackathon prep (SIH), verified student achiever recognition, and portfolio showcase.',
    tag: 'National Spotlight',
  },
];

const StatsSection = () => {
  return (
    <section className="relative py-24 bg-transparent overflow-hidden">
      {/* Background Atmosphere */}
      <div className="orb orb-blue absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] opacity-20 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10">
        <div className="text-center mb-14">
          <SectionBadge className="mb-4">Why Join Us</SectionBadge>
          <h2 className="section-heading text-4xl md:text-5xl mb-4">
            Everything You Need To Build
          </h2>
          <p className="text-ecell-gray max-w-2xl mx-auto text-base">
            From funding and teammate discovery to prototyping labs and founder mentorship—transform your campus years into an unfair entrepreneurial advantage.
          </p>
        </div>

        <CursorCardsContainer
          proximityRange={400}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5"
        >
          {benefitsData.map(({ label, icon: Icon, desc, tag }) => (
            <CursorCard
              key={label}
              illuminationRadius={220}
              illuminationColor="rgba(59, 130, 246, 0.22)"
              primaryHue="#60A5FA"
              secondaryHue="#1D4ED8"
              borderColor="rgba(255, 255, 255, 0.08)"
              className="transition-transform duration-300 hover:-translate-y-1.5"
            >
              <div className="p-6 flex flex-col items-center text-center gap-4 h-full justify-between">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-ecell-blue/10 border border-ecell-blue/20 flex items-center justify-center text-blue-400 group-hover:bg-ecell-blue/20 group-hover:text-blue-300 group-hover:shadow-glow-sm transition-all duration-300">
                    <Icon className="w-7 h-7" />
                  </div>
                  <span className="text-[11px] font-mono tracking-wider uppercase text-ecell-glow/80 px-2 py-0.5 rounded-full bg-ecell-blue/5 border border-ecell-blue/15">
                    {tag}
                  </span>
                </div>
                <div>
                  <h3 className="font-sora font-semibold text-base text-white mb-2 leading-snug">
                    {label}
                  </h3>
                  <p className="text-ecell-gray/70 font-inter text-xs leading-relaxed">
                    {desc}
                  </p>
                </div>
              </div>
            </CursorCard>
          ))}
        </CursorCardsContainer>
      </div>
    </section>
  );
};

export default StatsSection;

