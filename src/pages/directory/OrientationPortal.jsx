import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  QrCode,
  Copy,
  Check,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Award,
  Users,
  Compass,
} from 'lucide-react';

const OrientationPortal = () => {
  const [copied, setCopied] = useState(false);
  const registerUrl = `${window.location.origin}/dashboard/register`;

  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=380x380&data=${encodeURIComponent(
    registerUrl
  )}&bgcolor=ffffff&color=000000&margin=10`;

  const handleCopy = () => {
    navigator.clipboard.writeText(registerUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-transparent text-white pt-28 pb-24 md:pt-36"
    >
      <div className="max-w-6xl mx-auto px-6 lg:px-10">
        
        {/* Eyebrow */}
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-ecell-blue/10 border border-ecell-blue/30 text-xs font-mono text-ecell-glow uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-ecell-blue" />
            Orientation 2026 • Live Onboarding Portal
          </div>
          <h1 className="font-sora text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-white">
            Scan & Register <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-ecell-glow to-ecell-blue">
              Your Competitive Journey
            </span>
          </h1>
          <p className="text-ecell-gray text-base leading-relaxed font-light">
            Welcome to JCER E-Cell. If you have represented the college or won in hackathons, robotics, ideathons, sports, or technical paper contests, claim your profile in the official Achievers Directory.
          </p>
        </div>

        {/* QR Code Presentation Box */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center p-8 md:p-12 rounded-3xl bg-white/[0.02] border border-white/10 mb-16 shadow-2xl">
          
          {/* Left: High-Contrast QR Code */}
          <div className="md:col-span-5 flex flex-col items-center justify-center text-center space-y-4">
            <div className="p-4 bg-white rounded-2xl shadow-[0_0_40px_rgba(48,134,248,0.3)] border-4 border-ecell-blue/40 inline-block">
              <img
                src={qrApiUrl}
                alt="Registration QR Code"
                className="w-64 h-64 sm:w-72 sm:h-72 object-contain rounded-lg"
              />
            </div>
            <p className="text-xs font-mono text-ecell-light">
              Point your smartphone camera to launch the onboarding flow
            </p>
          </div>

          {/* Right: Steps & Direct Link */}
          <div className="md:col-span-7 space-y-6">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-ecell-light block mb-1">
                Fast-Track Orientation Steps
              </span>
              <h2 className="font-sora text-2xl font-bold text-white uppercase">
                How Verification Works
              </h2>
            </div>

            <div className="space-y-4">
              <div className="flex gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <div className="w-8 h-8 rounded-lg bg-ecell-blue/20 text-ecell-glow font-mono font-bold text-xs flex items-center justify-center shrink-0">
                  01
                </div>
                <div>
                  <h3 className="font-sora text-sm font-bold text-white">
                    Register with College Email & USN
                  </h3>
                  <p className="text-xs text-ecell-gray/80 mt-0.5 font-light">
                    Create your account to establish your verified student identity.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <div className="w-8 h-8 rounded-lg bg-ecell-blue/20 text-ecell-glow font-mono font-bold text-xs flex items-center justify-center shrink-0">
                  02
                </div>
                <div>
                  <h3 className="font-sora text-sm font-bold text-white">
                    Submit 3+ Qualifying Achievements
                  </h3>
                  <p className="text-xs text-ecell-gray/80 mt-0.5 font-light">
                    Upload certificate links and event details (Hackathons, Fests, Sports, Cultural).
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <div className="w-8 h-8 rounded-lg bg-emerald-950 text-emerald-400 font-mono font-bold text-xs flex items-center justify-center shrink-0 border border-emerald-500/20">
                  03
                </div>
                <div>
                  <h3 className="font-sora text-sm font-bold text-white">
                    Admin Approval & Public Listing
                  </h3>
                  <p className="text-xs text-ecell-gray/80 mt-0.5 font-light">
                    The JCER board verifies your proofs and your profile goes live on the talent network.
                  </p>
                </div>
              </div>
            </div>

            {/* Direct URL copy box */}
            <div className="p-4 rounded-xl bg-black/60 border border-white/10 space-y-3">
              <span className="text-xs font-mono uppercase text-ecell-gray/60 block">
                Direct Registration Link
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={registerUrl}
                  className="flex-1 bg-white/[0.03] px-3 py-2 rounded-lg text-xs font-mono text-ecell-light truncate outline-none select-all border border-white/5"
                />
                <button
                  onClick={handleCopy}
                  className="px-4 py-2 rounded-lg bg-ecell-blue hover:bg-blue-600 text-white text-xs font-mono font-medium flex items-center gap-1.5 transition-colors shrink-0"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Copy Link
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Button */}
            <div className="pt-2">
              <Link
                to="/dashboard/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-ecell-blue text-white font-semibold text-xs font-mono uppercase tracking-wider hover:bg-blue-600 transition-all shadow-[0_0_20px_rgba(48,134,248,0.35)]"
              >
                <span>Launch Onboarding Form</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          </div>

        </div>

        {/* Orientation FAQs */}
        <div className="space-y-6">
          <div className="text-center max-w-xl mx-auto">
            <h2 className="font-sora text-2xl font-bold text-white uppercase tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-xs font-mono text-ecell-gray/70 mt-1">
              Everything you need to know about getting listed
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-2">
              <h3 className="font-sora text-sm font-bold text-white">
                Can 1st Year (Freshers) students register?
              </h3>
              <p className="text-xs text-ecell-gray leading-relaxed font-light">
                Absolutely! If you achieved national/state honors in school or intercollegiate competitions, or if you win competitions during your 1st year, your profile will be featured.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-2">
              <h3 className="font-sora text-sm font-bold text-white">
                What if I currently have only 1 or 2 achievements?
              </h3>
              <p className="text-xs text-ecell-gray leading-relaxed font-light">
                You can register right now and save your profile as a draft! As soon as you log your 3rd qualifying achievement with proof, the submission button will unlock automatically.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-2">
              <h3 className="font-sora text-sm font-bold text-white">
                How do hackathon teams use the directory?
              </h3>
              <p className="text-xs text-ecell-gray leading-relaxed font-light">
                The directory features a filter for students marked "Open for Hackathons". Students can filter by specialization (AI/ML, Web Dev, UI/UX, Hardware) and recruit verified peers.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-2">
              <h3 className="font-sora text-sm font-bold text-white">
                What happens after I submit?
              </h3>
              <p className="text-xs text-ecell-gray leading-relaxed font-light">
                The JCER E-Cell Faculty & Student Verification Board reviews your certificate links. Once approved, your profile receives a unique URL (e.g., /directory/your-name).
              </p>
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
};

export default OrientationPortal;
