import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, ShieldCheck, Award } from 'lucide-react';

const EvidenceModal = ({ isOpen, onClose, achievement }) => {
  if (!isOpen || !achievement) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md">
        
        {/* Backdrop click */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-3xl rounded-2xl bg-ecell-bg2 border border-white/10 overflow-hidden shadow-2xl z-10"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-black/40">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="font-mono text-xs uppercase tracking-wider text-emerald-400">
                Verified Document Proof
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-ecell-light mb-1">
                <span>{achievement.event}</span>
                <span>•</span>
                <span>{achievement.level} Level</span>
                <span>•</span>
                <span>{achievement.date}</span>
              </div>
              <h3 className="font-sora text-xl font-bold text-white">
                {achievement.title}
              </h3>
              <p className="text-xs text-ecell-gray/70 font-mono mt-0.5">
                Organized by {achievement.organizer}
              </p>
            </div>

            {/* Evidence Image / Certificate */}
            {achievement.evidenceUrl ? (
              <div className="relative rounded-xl overflow-hidden border border-white/10 bg-black/60">
                <img
                  src={achievement.evidenceUrl}
                  alt={achievement.title}
                  className="w-full max-h-[460px] object-contain mx-auto"
                />
              </div>
            ) : (
              <div className="p-8 rounded-xl bg-white/[0.02] border border-dashed border-white/10 text-center">
                <Award className="w-10 h-10 text-white/30 mx-auto mb-2" />
                <p className="text-sm text-ecell-gray/70">
                  Physical Certificate verified by JCER Faculty Coordinator.
                </p>
              </div>
            )}

            {/* Description Narrative */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
              <h4 className="text-xs font-mono uppercase tracking-wider text-ecell-gray/60 mb-1">
                Official Submission Record
              </h4>
              <p className="text-sm text-ecell-gray leading-relaxed">
                {achievement.description}
              </p>
            </div>

            {/* External link */}
            {achievement.verificationLink && (
              <div className="pt-2 flex justify-end">
                <a
                  href={achievement.verificationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-ecell-blue text-white text-xs font-semibold hover:bg-blue-600 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  View Official External Portal
                </a>
              </div>
            )}
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default EvidenceModal;
