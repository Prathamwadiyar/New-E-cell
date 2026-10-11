import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, QrCode, UserCheck, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { useDirectoryAuth } from '../../context/DirectoryAuthContext';

const DirectoryHero = ({ totalAchievers = 0, totalAchievements = 0, onOpenQR }) => {
  const { currentUser, isAdmin } = useDirectoryAuth();

  return (
    <section className="relative pt-28 pb-16 md:pt-36 md:pb-20 overflow-hidden border-b border-white/[0.06]">
      {/* Background ambient lighting - strictly using JCER colors */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-ecell-blue/10 blur-[130px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        
        {/* Top Eyebrow Identifier */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap items-center gap-3 mb-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-mono tracking-wider text-ecell-light uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-ecell-blue animate-pulse" />
            JCER Student Achievers Directory
          </div>
          <span className="text-white/20 text-xs hidden sm:inline">•</span>
          <span className="text-ecell-gray/60 text-xs font-mono tracking-widest uppercase hidden sm:inline">
            Internal Talent & Hackathon Network
          </span>
        </motion.div>

        {/* Editorial Big Typography Headline */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end mb-12">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-8"
          >
            <h1 className="font-sora text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.05] uppercase">
              The People <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-ecell-glow to-ecell-blue">
                Behind What’s Next.
              </span>
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-4 flex flex-col justify-end"
          >
            <p className="text-ecell-gray text-base md:text-lg leading-relaxed font-light mb-6">
              A curated index of builders, thinkers, creators, and competitors shaping the JCER innovation ecosystem. Discover verified talent, assemble competition squads, and celebrate campus excellence.
            </p>

            {/* Quick action bar */}
            <div className="flex flex-wrap gap-3">
              {currentUser ? (
                <Link
                  to="/dashboard/profile"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-ecell-blue text-white text-sm font-semibold hover:bg-blue-600 transition-all shadow-[0_0_20px_rgba(48,134,248,0.35)]"
                >
                  <UserCheck className="w-4 h-4" />
                  My Achiever Profile
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-70" />
                </Link>
              ) : (
                <Link
                  to="/dashboard/register"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-ecell-blue text-white text-sm font-semibold hover:bg-blue-600 transition-all shadow-[0_0_20px_rgba(48,134,248,0.35)]"
                >
                  <Sparkles className="w-4 h-4" />
                  Register as Achiever
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-70" />
                </Link>
              )}

              <button
                onClick={onOpenQR}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-white text-sm font-medium border border-white/[0.08] transition-all"
                title="Orientation Session QR Launch"
              >
                <QrCode className="w-4 h-4 text-ecell-glow" />
                Orientation QR
              </button>

              {isAdmin && (
                <Link
                  to="/admin/directory"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-300 text-sm font-medium border border-yellow-500/30 transition-all"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Admin Review
                </Link>
              )}
            </div>
          </motion.div>
        </div>

        {/* Live Metrics Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 border-t border-white/[0.06]"
        >
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
            <p className="text-xs font-mono uppercase tracking-wider text-ecell-gray/60 mb-1">
              Verified Achievers
            </p>
            <div className="font-sora text-2xl md:text-3xl font-bold text-white flex items-baseline gap-1">
              {totalAchievers}
              <span className="text-xs font-normal text-ecell-blue">Students</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
            <p className="text-xs font-mono uppercase tracking-wider text-ecell-gray/60 mb-1">
              Documented Honors
            </p>
            <div className="font-sora text-2xl md:text-3xl font-bold text-ecell-glow flex items-baseline gap-1">
              {totalAchievements}
              <span className="text-xs font-normal text-white/50">Wins & Awards</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
            <p className="text-xs font-mono uppercase tracking-wider text-ecell-gray/60 mb-1">
              Submission Criteria
            </p>
            <div className="font-sora text-2xl md:text-3xl font-bold text-white flex items-baseline gap-1">
              3+
              <span className="text-xs font-normal text-white/50">Verified Wins</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
            <p className="text-xs font-mono uppercase tracking-wider text-ecell-gray/60 mb-1">
              Institutional Status
            </p>
            <div className="font-sora text-lg md:text-xl font-bold text-emerald-400 flex items-center gap-2 pt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Verified Index
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default DirectoryHero;
