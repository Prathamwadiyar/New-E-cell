import { CheckCircle2, Clock, AlertCircle, Sparkles, ShieldCheck } from 'lucide-react';
import { MIN_QUALIFYING_ACHIEVEMENTS } from '../../services/directoryTypes';

const EligibilityMeter = ({ achievements = [], status = 'draft', rejectionReason = '' }) => {
  const validCount = achievements.filter(
    (a) => a.title?.trim() && a.event?.trim() && a.level && a.category
  ).length;

  const percentage = Math.min(Math.round((validCount / MIN_QUALIFYING_ACHIEVEMENTS) * 100), 100);
  const isEligible = validCount >= MIN_QUALIFYING_ACHIEVEMENTS;

  return (
    <div className="rounded-2xl bg-white/[0.02] border border-white/[0.08] p-6 space-y-4">
      
      {/* Status Alert Banner */}
      {status === 'approved' && (
        <div className="p-3.5 rounded-xl bg-emerald-950/50 border border-emerald-500/30 flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <p className="text-xs font-mono font-semibold text-emerald-300 uppercase tracking-wider">
              Profile Approved & Live on Public Directory
            </p>
            <p className="text-xs text-white/70 font-light mt-0.5">
              Your credentials have been verified by the JCER review board. Any future material updates will trigger a quick reverification.
            </p>
          </div>
        </div>
      )}

      {status === 'pending_review' && (
        <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/30 flex items-center gap-3">
          <Clock className="w-5 h-5 text-amber-400 shrink-0 animate-spin-slow" />
          <div>
            <p className="text-xs font-mono font-semibold text-amber-300 uppercase tracking-wider">
              Pending Admin Verification
            </p>
            <p className="text-xs text-white/70 font-light mt-0.5">
              Your profile is currently in the review queue. The JCER E-Cell team is verifying your certificates and evidence documents.
            </p>
          </div>
        </div>
      )}

      {status === 'rejected' && (
        <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/30 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-mono font-semibold text-rose-300 uppercase tracking-wider">
              Verification Feedback / Changes Requested
            </p>
            <p className="text-xs text-rose-200/90 font-light mt-1">
              {rejectionReason || 'Please provide clearer certificate links or correct details for your submitted achievements.'}
            </p>
          </div>
        </div>
      )}

      {/* Progress Counter */}
      <div>
        <div className="flex items-center justify-between text-xs font-mono mb-2">
          <span className="text-ecell-gray/70 uppercase tracking-wider">
            Directory Listing Eligibility
          </span>
          <span className={`font-semibold ${isEligible ? 'text-emerald-400' : 'text-ecell-light'}`}>
            {validCount} of {MIN_QUALIFYING_ACHIEVEMENTS} Qualifying Honors ({percentage}%)
          </span>
        </div>

        {/* Progress Track */}
        <div className="w-full h-2 rounded-full bg-white/[0.05] overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${
              isEligible ? 'bg-emerald-400' : 'bg-ecell-blue'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Explanatory helper */}
      <div className="text-xs text-ecell-gray/60 leading-relaxed font-light">
        {isEligible ? (
          <span className="text-emerald-300/90 flex items-center gap-1.5 font-mono">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Eligibility criteria met! You can now submit your profile for admin verification.
          </span>
        ) : (
          <span>
            To qualify for the public JCER Talent Directory, you must document at least{' '}
            <strong className="text-white">3 qualifying achievements</strong> (Hackathons, technical competitions, paper publications, sports, or cultural awards) with supporting proof.
          </span>
        )}
      </div>

    </div>
  );
};

export default EligibilityMeter;
