import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { X, Copy, Check, QrCode, Sparkles, ExternalLink, ShieldCheck } from 'lucide-react';

const OrientationQRModal = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const registrationUrl = `${window.location.origin}/dashboard/register`;

  // Encode URL for QR code API (QR Server API for high resolution SVG/PNG)
  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encodeURIComponent(
    registrationUrl
  )}&bgcolor=ffffff&color=000000&margin=10`;

  const handleCopy = () => {
    navigator.clipboard.writeText(registrationUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
          className="relative w-full max-w-xl rounded-2xl bg-ecell-bg2 border border-white/10 overflow-hidden shadow-2xl z-10"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-black/40">
            <div className="flex items-center gap-2">
              <QrCode className="w-4 h-4 text-ecell-glow" />
              <span className="font-mono text-xs uppercase tracking-wider text-ecell-glow font-semibold">
                Orientation Launch Scan
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-6 md:p-8 space-y-6 text-center">
            
            <div>
              <h3 className="font-sora text-2xl font-bold text-white uppercase tracking-tight">
                Join The JCER Achievers Index
              </h3>
              <p className="text-xs text-ecell-gray/80 font-mono mt-1">
                Scan during orientation or register instantly from your mobile phone.
              </p>
            </div>

            {/* Sharp QR Code Frame */}
            <div className="inline-block p-4 bg-white rounded-2xl shadow-[0_0_30px_rgba(48,134,248,0.25)] border-4 border-ecell-blue/30 mx-auto">
              <img
                src={qrApiUrl}
                alt="Registration QR Code"
                className="w-52 h-52 object-contain rounded-lg"
              />
            </div>

            {/* Direct URL copy bar */}
            <div className="flex items-center gap-2 p-2 rounded-xl bg-white/[0.03] border border-white/10 max-w-md mx-auto">
              <input
                type="text"
                readOnly
                value={registrationUrl}
                className="flex-1 bg-transparent px-3 text-xs font-mono text-ecell-light truncate outline-none select-all"
              />
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 rounded-lg bg-ecell-blue hover:bg-blue-600 text-white text-xs font-mono font-medium flex items-center gap-1.5 transition-colors shrink-0"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy
                  </>
                )}
              </button>
            </div>

            {/* 3-Step Orientation Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left pt-2 border-t border-white/[0.06]">
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <span className="text-xs font-mono text-ecell-blue block mb-1">01 / Sign Up</span>
                <p className="text-xs text-ecell-gray font-light">
                  Create student profile using college USN and email.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <span className="text-xs font-mono text-ecell-glow block mb-1">02 / 3+ Wins</span>
                <p className="text-xs text-ecell-gray font-light">
                  Add 3 qualifying achievements with certificate proof.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <span className="text-xs font-mono text-emerald-400 block mb-1">03 / Verified</span>
                <p className="text-xs text-ecell-gray font-light">
                  Admin reviews proof & publishes your profile to the network.
                </p>
              </div>
            </div>

            {/* Direct Open Button */}
            <div className="pt-2">
              <Link
                to="/dashboard/register"
                onClick={onClose}
                className="inline-flex items-center gap-2 text-xs font-mono text-ecell-light hover:text-white transition-colors"
              >
                <span>Open Registration Form in Browser</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>

          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default OrientationQRModal;
