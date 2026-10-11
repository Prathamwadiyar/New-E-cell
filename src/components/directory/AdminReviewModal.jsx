import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  FileText,
  ExternalLink,
  Award,
  AlertTriangle,
} from 'lucide-react';
import EvidenceModal from './EvidenceModal';

const AdminReviewModal = ({ isOpen, onClose, profile, onApprove, onReject, onSuspend }) => {
  const [rejectionFeedback, setRejectionFeedback] = useState('');
  const [showFeedbackInput, setShowFeedbackInput] = useState(false);
  const [inspectEvidence, setInspectEvidence] = useState(null);

  if (!isOpen || !profile) return null;

  const handleApproveClick = () => {
    onApprove(profile.id);
    onClose();
  };

  const handleRejectClick = () => {
    if (!showFeedbackInput) {
      setShowFeedbackInput(true);
      return;
    }
    onReject(profile.id, rejectionFeedback || 'Incomplete achievement proof or unverified details.');
    onClose();
  };

  const handleSuspendClick = () => {
    if (confirm('Are you sure you want to suspend/unpublish this profile from the public directory?')) {
      onSuspend(profile.id);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md">
        
        {/* Backdrop click */}
        <div className="absolute inset-0" onClick={onClose} />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl bg-ecell-bg2 border border-white/10 overflow-hidden shadow-2xl z-10"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-black/50 shrink-0">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-yellow-400" />
              <span className="font-mono text-xs uppercase tracking-wider text-yellow-300 font-semibold">
                JCER Verification Board — Profile Review
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Body */}
          <div className="p-6 md:p-8 space-y-6 overflow-y-auto">
            
            {/* Student Overview Header */}
            <div className="flex flex-col sm:flex-row items-start gap-5 p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
              <img
                src={
                  profile.avatarUrl ||
                  `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80`
                }
                alt={profile.fullName}
                className="w-20 h-20 rounded-xl object-cover border border-white/10"
              />
              <div className="flex-1 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-sora text-xl font-bold text-white">
                    {profile.fullName}
                  </h3>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/[0.05] text-ecell-light">
                    USN: {profile.usn || 'Not provided'}
                  </span>
                  <span className={`text-xs font-mono px-2 py-0.5 rounded ${
                    profile.status === 'approved'
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                      : profile.status === 'pending_review'
                      ? 'bg-amber-950 text-amber-400 border border-amber-500/30'
                      : 'bg-rose-950 text-rose-400 border border-rose-500/30'
                  }`}>
                    Status: {profile.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-xs font-mono text-ecell-gray">
                  {profile.department} • {profile.academicYear}
                </p>
                <p className="text-xs font-mono text-white/60">
                  Email: {profile.collegeEmail || profile.email}
                </p>
              </div>
            </div>

            {/* Achievements List */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-sora text-sm font-semibold text-white uppercase tracking-wider">
                  Submitted Achievements ({profile.achievements?.length || 0})
                </h4>
                <span className="text-xs font-mono text-ecell-light">
                  Required: 3+ qualifying honors
                </span>
              </div>

              <div className="space-y-3">
                {profile.achievements?.map((ach, idx) => (
                  <div
                    key={ach.id || idx}
                    className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] space-y-2"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-xs font-mono text-ecell-blue block">
                          #{idx + 1} • {ach.level} Level • {ach.category}
                        </span>
                        <h5 className="font-sora text-sm font-bold text-white">
                          {ach.title}
                        </h5>
                        <p className="text-xs font-mono text-ecell-gray/70">
                          {ach.event} (Organized by {ach.organizer}) • {ach.date}
                        </p>
                      </div>

                      <button
                        onClick={() => setInspectEvidence(ach)}
                        className="px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-ecell-blue text-xs font-mono text-white border border-white/10 transition-colors flex items-center gap-1.5 shrink-0"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        View Proof
                      </button>
                    </div>

                    <p className="text-xs text-ecell-gray font-light">
                      {ach.description}
                    </p>

                    {ach.position && (
                      <span className="inline-block text-[11px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/20">
                        Result: {ach.position}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Feedback box if rejecting */}
            {showFeedbackInput && (
              <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-500/30 space-y-2">
                <label className="text-xs font-mono uppercase tracking-wider text-rose-300 block">
                  Reason for Requesting Changes / Rejection
                </label>
                <textarea
                  rows={3}
                  value={rejectionFeedback}
                  onChange={(e) => setRejectionFeedback(e.target.value)}
                  placeholder="Explain what documents need correction (e.g. 'Please re-upload certificate for SIH with clear seal, update USN')..."
                  className="w-full p-3 rounded-lg bg-black/60 border border-rose-500/30 text-white text-xs font-mono focus:outline-none focus:border-rose-400"
                />
              </div>
            )}

          </div>

          {/* Footer Actions */}
          <div className="p-4 md:p-6 border-t border-white/10 bg-black/60 flex flex-wrap items-center justify-between gap-3 shrink-0">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-mono text-white transition-colors"
            >
              Cancel
            </button>

            <div className="flex flex-wrap items-center gap-2.5">
              {profile.status === 'approved' ? (
                <button
                  onClick={handleSuspendClick}
                  className="px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-mono transition-colors flex items-center gap-1.5"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Suspend / Unpublish
                </button>
              ) : (
                <>
                  <button
                    onClick={handleRejectClick}
                    className="px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs font-mono transition-colors flex items-center gap-1.5"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    {showFeedbackInput ? 'Confirm Rejection' : 'Request Changes'}
                  </button>

                  <button
                    onClick={handleApproveClick}
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs font-mono transition-colors flex items-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Approve & Publish to Directory
                  </button>
                </>
              )}
            </div>
          </div>

        </motion.div>
      </div>

      <EvidenceModal
        isOpen={Boolean(inspectEvidence)}
        onClose={() => setInspectEvidence(null)}
        achievement={inspectEvidence}
      />
    </AnimatePresence>
  );
};

export default AdminReviewModal;
