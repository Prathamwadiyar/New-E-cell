import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Share2,
  Check,
  Award,
  Sparkles,
  ExternalLink,
  Mail,
} from 'lucide-react';
import { FaLinkedinIn, FaGithub, FaXTwitter, FaInstagram, FaGlobe } from 'react-icons/fa6';
import { useDirectoryAuth } from '../../context/DirectoryAuthContext';

const ProfileHeader = ({ profile }) => {
  const { currentUser } = useDirectoryAuth();
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${profile.fullName} | JCER Achiever Profile`,
          text: `Check out ${profile.fullName}'s verified achievements on JCER E-Cell Directory`,
          url,
        });
        return;
      } catch (err) {}
    }

    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const socialLinks = profile.socialLinks || {};

  return (
    <header className="relative pt-28 pb-12 md:pt-36 md:pb-16 border-b border-white/[0.08]">
      
      {/* Ambient background glow */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-ecell-blue/10 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        
        {/* Navigation Bar: Back & Share */}
        <div className="flex items-center justify-between mb-10">
          <Link
            to="/directory"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-ecell-gray hover:text-white transition-colors py-2"
          >
            <ArrowLeft className="w-4 h-4 text-ecell-blue" />
            Back to Achievers Directory
          </Link>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-mono uppercase tracking-wider text-white border border-white/10 transition-all"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-ecell-glow" />
                <span>Share Profile</span>
              </>
            )}
          </button>
        </div>

        {/* Profile Grid: Portrait + Big Typography */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Portrait Column */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-4"
          >
            <div className="relative rounded-2xl overflow-hidden border border-white/15 shadow-2xl bg-black/40 aspect-[4/5] max-w-sm mx-auto lg:max-w-none">
              <img
                src={
                  profile.avatarUrl ||
                  `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80`
                }
                alt={profile.fullName}
                className="w-full h-full object-cover object-center filter grayscale contrast-105"
              />

              {/* Status pill on image */}
              <div className="absolute top-4 left-4 z-10">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-black/75 backdrop-blur-md border border-white/15 text-white">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Verified JCER Achiever
                </span>
              </div>

              {/* Bottom Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
              
              <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between text-xs font-mono text-white/80">
                <span>{profile.academicYear}</span>
                <span className="text-ecell-glow">{profile.achievements?.length || 0} Documented Honors</span>
              </div>
            </div>
          </motion.div>

          {/* Details & Typography Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-8 space-y-6"
          >
            
            {/* Department and USN track */}
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs font-mono uppercase tracking-wider text-ecell-light">
                {profile.department}
              </span>
              {profile.usn && (
                <span className="px-3 py-1 rounded-lg bg-white/[0.02] border border-white/[0.04] text-xs font-mono tracking-wider text-white/50">
                  USN: {profile.usn}
                </span>
              )}
              {profile.collaborationStatus && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono text-emerald-300 bg-emerald-950/60 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  {profile.collaborationStatus}
                </span>
              )}
            </div>

            {/* Student Name */}
            <div>
              <h1 className="font-sora text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight uppercase">
                {profile.fullName}
              </h1>
              <p className="text-base sm:text-lg font-mono text-ecell-glow mt-2 tracking-wide">
                {profile.primaryRole || 'Student Innovator'}
              </p>
            </div>

            {/* Editorial Bio */}
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
              <p className="text-ecell-gray text-base leading-relaxed font-light">
                {profile.bio ||
                  'Active contributor to student technological innovation, competitive problem-solving, and entrepreneurship initiatives at JCER.'}
              </p>
            </div>

            {/* Skills Radar Tags */}
            {profile.skills && profile.skills.length > 0 && (
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-ecell-gray/50 block mb-2.5">
                  Core Competencies & Stack
                </span>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 rounded-lg bg-white/[0.03] text-xs font-mono text-white/90 border border-white/[0.06]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Social / Contact Links - Unlocked only when logged in */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              {currentUser ? (
                <>
                  {socialLinks.linkedin && (
                    <a
                      href={socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-ecell-blue hover:text-white text-xs font-medium text-white/80 border border-white/10 transition-colors"
                    >
                      <FaLinkedinIn className="w-3.5 h-3.5" />
                      LinkedIn
                    </a>
                  )}

                  {socialLinks.github && (
                    <a
                      href={socialLinks.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/20 text-xs font-medium text-white/80 border border-white/10 transition-colors"
                    >
                      <FaGithub className="w-3.5 h-3.5" />
                      GitHub
                    </a>
                  )}

                  {socialLinks.portfolio && (
                    <a
                      href={socialLinks.portfolio}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-ecell-blue text-xs font-medium text-white/80 border border-white/10 transition-colors"
                    >
                      <FaGlobe className="w-3.5 h-3.5" />
                      Portfolio
                    </a>
                  )}

                  {socialLinks.twitter && (
                    <a
                      href={socialLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/20 text-xs font-medium text-white/80 border border-white/10 transition-colors"
                    >
                      <FaXTwitter className="w-3.5 h-3.5" />
                      X / Twitter
                    </a>
                  )}

                  {socialLinks.instagram && (
                    <a
                      href={socialLinks.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/20 text-xs font-medium text-white/80 border border-white/10 transition-colors"
                    >
                      <FaInstagram className="w-3.5 h-3.5" />
                      Instagram
                    </a>
                  )}

                  {profile.collegeEmail && (
                    <a
                      href={`mailto:${profile.collegeEmail}`}
                      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-ecell-blue text-xs font-medium text-white/80 border border-white/10 transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      Direct Email
                    </a>
                  )}
                </>
              ) : (
                <div className="flex items-center gap-2 text-xs font-mono text-ecell-gray/60 bg-white/[0.02] border border-white/[0.06] px-3.5 py-2 rounded-xl">
                  <span>🔒 Direct contact and social links protected.</span>
                  <Link to="/dashboard/login" className="text-ecell-glow hover:underline font-semibold ml-1">
                    Sign in to connect
                  </Link>
                </div>
              )}
            </div>


          </motion.div>

        </div>

      </div>
    </header>
  );
};

export default ProfileHeader;
