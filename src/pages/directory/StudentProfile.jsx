import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getProfileBySlug } from '../../services/directoryStorage';
import ProfileHeader from '../../components/directory/ProfileHeader';
import AchievementTimeline from '../../components/directory/AchievementTimeline';
import ProfileGallery from '../../components/directory/ProfileGallery';
import ProfileCollaboration from '../../components/directory/ProfileCollaboration';
import { UserX, ArrowLeft, ShieldAlert, Lock, Sparkles, ArrowRight } from 'lucide-react';
import { useDirectoryAuth } from '../../context/DirectoryAuthContext';
import { FaGoogle } from 'react-icons/fa6';

const StudentProfile = () => {
  const { username } = useParams();
  const { currentUser, loginWithGoogle } = useDirectoryAuth();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [googleLoading, setGoogleLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      const data = await getProfileBySlug(username);
      setProfile(data);
      setIsLoading(false);

      if (data) {
        document.title = `${data.fullName} — JCER Achiever Profile`;
      }
    };
    load();

    return () => {
      document.title = 'E-Cell | Entrepreneurship Cell';
    };
  }, [username]);

  const handleGoogleQuickLogin = async () => {
    setGoogleLoading(true);
    await loginWithGoogle();
    setGoogleLoading(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center py-32 text-white">
        <div className="space-y-4">
          <div className="w-10 h-10 border-2 border-ecell-blue border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-mono text-ecell-gray/70 uppercase tracking-widest">
            Loading Achiever Profile...
          </p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 py-32 text-white">
        <div className="max-w-md w-full text-center p-8 rounded-3xl bg-white/[0.02] border border-white/[0.08] space-y-4">
          <UserX className="w-12 h-12 text-white/30 mx-auto" />
          <h2 className="font-sora text-2xl font-bold text-white uppercase">
            Profile Not Found
          </h2>
          <p className="text-xs text-ecell-gray/70 font-mono leading-relaxed">
            The requested student achiever profile "@{username}" either does not exist or has not yet been approved by the JCER verification team.
          </p>
          <div className="pt-2">
            <Link
              to="/directory"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-ecell-blue text-white text-xs font-mono uppercase tracking-wider font-semibold hover:bg-blue-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Return to Directory
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-transparent text-white"
    >
      {/* Editorial Profile Header - Shows basic details */}
      <ProfileHeader profile={profile} />

      {/* Profile Body Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 pb-24">
        {currentUser ? (
          <>
            {/* Achievements Timeline */}
            <AchievementTimeline achievements={profile.achievements} />

            {/* Media Gallery */}
            <ProfileGallery gallery={profile.gallery} />

            {/* Hackathon Teaming & Collaboration Preferences */}
            <ProfileCollaboration profile={profile} />
          </>
        ) : (
          /* Locked Content Box for Unauthenticated Visitors */
          <div className="mt-12 p-8 md:p-14 rounded-3xl bg-black/60 border border-white/10 text-center max-w-3xl mx-auto space-y-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-ecell-blue to-transparent" />
            
            <div className="w-16 h-16 rounded-2xl bg-ecell-blue/10 border border-ecell-blue/30 text-ecell-glow flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(48,134,248,0.3)]">
              <Lock className="w-7 h-7 text-ecell-blue" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono uppercase tracking-widest text-ecell-light font-semibold">
                Protected Achiever Details
              </span>
              <h3 className="font-sora text-2xl sm:text-3xl font-extrabold uppercase text-white">
                Sign In to View Full Honors & Evidence
              </h3>
              <p className="text-sm text-ecell-gray/80 max-w-lg mx-auto font-light leading-relaxed">
                To protect student achievement credentials, certificate evidence, contact records, and hackathon teaming status, please sign in with your student account.
              </p>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                disabled={googleLoading}
                onClick={handleGoogleQuickLogin}
                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-white text-black font-mono text-xs font-bold uppercase tracking-wider hover:bg-white/90 transition-all shadow-md"
              >
                <FaGoogle className="w-4 h-4 text-rose-500" />
                <span>Continue with Google</span>
              </button>

              <Link
                to="/dashboard/login"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-ecell-blue hover:bg-blue-600 text-white font-mono text-xs font-semibold uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(48,134,248,0.3)]"
              >
                <span>Email Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};


export default StudentProfile;
