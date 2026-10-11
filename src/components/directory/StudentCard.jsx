import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Award, ArrowUpRight, Sparkles, CheckCircle2, Lock } from 'lucide-react';
import { useDirectoryAuth } from '../../context/DirectoryAuthContext';

const StudentCard = ({ student, index }) => {
  const { currentUser } = useDirectoryAuth();
  const indexFormatted = String(index + 1).padStart(2, '0');
  const highlightedAchievement = student.achievements?.[0];
  const totalVerifiedWins = student.achievements?.length || 0;

  // Department short tag
  const deptShort = student.department?.replace('Engineering', 'Eng.').replace('Department of', '');

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.05, 0.3) }}
      className="group relative flex flex-col justify-between rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.07] hover:border-ecell-blue/40 transition-all duration-500 overflow-hidden"
    >
      {/* Top Media & Identification */}
      <div className="relative">
        
        {/* Photo Container */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-black/40">
          <img
            src={
              student.avatarUrl ||
              `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80`
            }
            alt={student.fullName}
            className="w-full h-full object-cover object-center filter grayscale contrast-110 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
            loading="lazy"
          />

          {/* Vignette & Gradient scrim */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-90 group-hover:opacity-70 transition-opacity duration-500" />

          {/* Top Metadata Badges */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
            <span className="font-mono text-xs font-semibold tracking-wider text-white/70 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/10">
              #{indexFormatted}
            </span>

            {student.collaborationStatus === 'Open for Hackathons' && (
              <span className="inline-flex items-center gap-1.5 text-[11px] font-mono tracking-tight font-medium text-emerald-300 bg-emerald-950/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Hackathon Ready
              </span>
            )}
          </div>

          {/* Bottom Photo Overlay: Academic Track */}
          <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between">
            <span className="text-xs font-mono text-ecell-light tracking-wide bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded border border-white/5">
              {student.academicYear}
            </span>

            <span className="inline-flex items-center gap-1 text-xs font-mono text-white/90 bg-ecell-blue/80 backdrop-blur-sm px-2 py-0.5 rounded">
              <Award className="w-3 h-3 text-white" />
              {totalVerifiedWins} Honors
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 md:p-6 space-y-4">
          
          {/* Student Name & Basic Info (Always visible) */}
          <div>
            <div className="flex items-center gap-1.5 text-xs font-mono text-ecell-gray/70 mb-1">
              <span>{deptShort}</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-ecell-blue" />
            </div>
            <h3 className="font-sora text-xl font-bold text-white tracking-tight group-hover:text-ecell-glow transition-colors">
              {student.fullName}
            </h3>
            <p className="text-xs text-ecell-light/90 font-mono tracking-wide mt-0.5 line-clamp-1">
              {student.primaryRole || 'Student Achiever'}
            </p>
          </div>

          {/* Detailed Content: Only visible when logged in */}
          {currentUser ? (
            <>
              {/* Highlighted Honor Snippet */}
              {highlightedAchievement && (
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] group-hover:border-ecell-blue/20 transition-colors">
                  <div className="flex items-start gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-ecell-blue shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-white/90 truncate">
                        {highlightedAchievement.title}
                      </p>
                      <p className="text-[11px] text-ecell-gray/60 font-mono truncate">
                        {highlightedAchievement.event} • {highlightedAchievement.level} Level
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Skills Tags */}
              {student.skills && student.skills.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {student.skills.slice(0, 3).map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-0.5 rounded-md bg-white/[0.03] text-[11px] font-mono text-ecell-gray/70 border border-white/[0.04]"
                    >
                      {skill}
                    </span>
                  ))}
                  {student.skills.length > 3 && (
                    <span className="px-1.5 py-0.5 text-[10px] font-mono text-white/40 self-center">
                      +{student.skills.length - 3} more
                    </span>
                  )}
                </div>
              )}
            </>
          ) : (
            /* Unauthenticated Teaser state: Basic details shown, full details locked */
            <div className="p-3 rounded-xl bg-white/[0.02] border border-dashed border-white/10 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs font-mono text-ecell-gray/70">
                <Lock className="w-3.5 h-3.5 text-ecell-blue shrink-0" />
                <span className="truncate">Sign in to unlock full honors & skills</span>
              </div>
              <Link
                to="/dashboard/login"
                className="text-[11px] font-mono text-ecell-glow hover:underline shrink-0 font-medium"
              >
                Sign In
              </Link>
            </div>
          )}

        </div>
      </div>

      {/* Card Footer Link */}
      <div className="px-5 pb-5 md:px-6 md:pb-6 pt-2 border-t border-white/[0.04] flex items-center justify-between">
        <span className="text-xs font-mono text-ecell-gray/50 group-hover:text-white transition-colors">
          {currentUser ? 'View Complete Credentials' : 'View Basic Overview'}
        </span>
        <Link
          to={`/directory/${student.slug || student.id}`}
          className="w-8 h-8 rounded-full bg-white/[0.04] group-hover:bg-ecell-blue flex items-center justify-center text-white/70 group-hover:text-white transition-all transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shadow-sm"
          aria-label={`View profile for ${student.fullName}`}
        >
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>

    </motion.article>
  );
};


export default StudentCard;
