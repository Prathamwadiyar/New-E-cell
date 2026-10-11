import { Users, Mail, Sparkles, CheckCircle2 } from 'lucide-react';
import { FaLinkedinIn } from 'react-icons/fa6';

const ProfileCollaboration = ({ profile }) => {
  const preferredRoles = profile.preferredRoles || [];
  const contactEmail = profile.collegeEmail || profile.email;
  const linkedin = profile.socialLinks?.linkedin;

  return (
    <section className="py-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-ecell-light block mb-1">
            Section 04 // Networking & Teaming
          </span>
          <h2 className="font-sora text-2xl md:text-3xl font-extrabold text-white tracking-tight uppercase">
            Teaming & Hackathon Synergy
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Collaboration Roles */}
        <div className="md:col-span-7 p-6 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-ecell-light">
            <Users className="w-4 h-4 text-ecell-blue" />
            Preferred Competition & Project Roles
          </div>

          {preferredRoles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {preferredRoles.map((role) => (
                <div
                  key={role}
                  className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] flex items-center gap-2.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-xs font-mono text-white/90">{role}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs font-mono text-ecell-gray/60">
              Open to collaborative multidisciplinary roles across hackathons.
            </p>
          )}

          <div className="pt-3 border-t border-white/[0.04] text-xs text-ecell-gray/70 leading-relaxed font-light">
            Looking to recruit for upcoming state or national hackathons? Reach out directly with the competition details and proposed problem statement.
          </div>
        </div>

        {/* Teaming Action Card */}
        <div className="md:col-span-5 p-6 rounded-2xl bg-gradient-to-br from-ecell-blue/15 to-transparent border border-ecell-blue/30 space-y-5 flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium text-emerald-300 bg-emerald-950/80 border border-emerald-500/30 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {profile.collaborationStatus || 'Open for Hackathons'}
            </div>
            <h3 className="font-sora text-xl font-bold text-white">
              Connect with {profile.fullName.split(' ')[0]}
            </h3>
            <p className="text-xs text-ecell-gray/80 mt-1.5 leading-relaxed font-light">
              Send an invite to collaborate on upcoming hackathons, innovation challenges, or research publications.
            </p>
          </div>

          <div className="space-y-2.5">
            {contactEmail && (
              <a
                href={`mailto:${contactEmail}?subject=Hackathon%20Collaboration%20via%20JCER%20E-Cell&body=Hi%20${encodeURIComponent(profile.fullName)},%0D%0A%0D%0AI%20saw%20your%20profile%20on%20the%20JCER%20E-Cell%20Talent%20Directory%20and%20would%20love%20to%20collaborate%20on...`}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-ecell-blue text-white text-xs font-semibold hover:bg-blue-600 transition-colors shadow-[0_0_20px_rgba(48,134,248,0.3)]"
              >
                <Mail className="w-4 h-4" />
                Invite via Official College Email
              </a>
            )}

            {linkedin && (
              <a
                href={linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-white text-xs font-medium border border-white/10 transition-colors"
              >
                <FaLinkedinIn className="w-3.5 h-3.5 text-ecell-light" />
                Connect on LinkedIn
              </a>
            )}
          </div>
        </div>

      </div>
    </section>
  );
};

export default ProfileCollaboration;
