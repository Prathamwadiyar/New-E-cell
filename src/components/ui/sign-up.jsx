import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  Lock,
  User,
  ArrowRight,
  Sparkles,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { FaGoogle } from 'react-icons/fa6';

export const AuthComponent = ({
  logo,
  brandName = 'JCER E-Cell',
  onEmailSubmit,
  onGoogleSubmit,
  loading = false,
  error = '',
  initialTab = 'signin',
  onDemoLogin,
}) => {
  const [tab, setTab] = useState(initialTab); // 'signin' | 'signup'
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    usn: '',
    department: 'Computer Science & Engineering',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onEmailSubmit) {
      onEmailSubmit(formData, tab === 'signup');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 sm:p-8 rounded-3xl bg-black/85 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.6)] relative overflow-hidden">
      {/* Subtle top brand accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-ecell-blue to-transparent" />

      {/* Brand Header */}
      <div className="flex flex-col items-center text-center mb-6">
        {logo && <div className="mb-3">{logo}</div>}
        <h2 className="font-sora text-2xl font-extrabold uppercase tracking-tight text-white">
          {tab === 'signin' ? `Sign In to ${brandName}` : `Join ${brandName}`}
        </h2>
        <p className="text-xs text-ecell-gray/70 font-mono mt-1">
          {tab === 'signin'
            ? 'Unlock verified student credentials, portfolios & collaboration'
            : 'Register your student profile for the JCER Achievers Index'}
        </p>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex rounded-xl bg-white/[0.03] p-1 border border-white/5 mb-6">
        <button
          type="button"
          onClick={() => setTab('signin')}
          className={`flex-1 py-2 rounded-lg text-xs font-mono font-medium transition-all ${
            tab === 'signin'
              ? 'bg-ecell-blue text-white shadow-[0_0_15px_rgba(48,134,248,0.35)]'
              : 'text-white/60 hover:text-white'
          }`}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => setTab('signup')}
          className={`flex-1 py-2 rounded-lg text-xs font-mono font-medium transition-all ${
            tab === 'signup'
              ? 'bg-ecell-blue text-white shadow-[0_0_15px_rgba(48,134,248,0.35)]'
              : 'text-white/60 hover:text-white'
          }`}
        >
          Sign Up
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-5 p-3 rounded-xl bg-rose-950/50 border border-rose-500/30 flex items-center gap-2 text-xs font-mono text-rose-300">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Google Sign-in Button */}
      {onGoogleSubmit && (
        <div className="mb-5">
          <button
            type="button"
            disabled={loading}
            onClick={onGoogleSubmit}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-white text-xs font-mono font-medium border border-white/10 hover:border-ecell-blue/50 transition-all shadow-sm active:scale-[0.99] disabled:opacity-50"
          >
            <FaGoogle className="w-4 h-4 text-rose-400" />
            <span>Continue with Google</span>
          </button>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-[11px] font-mono text-white/40 uppercase">or with email</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>
        </div>
      )}

      {/* Email / Password Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {tab === 'signup' && (
          <div>
            <label className="text-[11px] font-mono uppercase tracking-wider text-ecell-gray/80 block mb-1">
              Full Name *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Rahul Sharma"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-ecell-blue"
              />
            </div>
          </div>
        )}

        <div>
          <label className="text-[11px] font-mono uppercase tracking-wider text-ecell-gray/80 block mb-1">
            College / Personal Email *
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="student@jcer.edu.in"
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-ecell-blue"
            />
          </div>
        </div>

        <div>
          <label className="text-[11px] font-mono uppercase tracking-wider text-ecell-gray/80 block mb-1">
            Password *
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-ecell-blue"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-ecell-blue hover:bg-blue-600 text-white font-mono text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(48,134,248,0.35)] disabled:opacity-50 mt-2"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              {tab === 'signin' ? 'Sign In to Profile' : 'Create Student Account'}
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Demo Credentials Fast-Track */}
      {onDemoLogin && (
        <div className="mt-5 pt-4 border-t border-white/10 text-center">
          <span className="text-[11px] font-mono text-white/40 block mb-2">
            Need a quick demo test?
          </span>
          <div className="flex justify-center gap-2">
            <button
              type="button"
              onClick={() => onDemoLogin('rohan.deshmukh@jcer.edu.in')}
              className="px-2.5 py-1 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] text-[11px] font-mono text-ecell-light border border-white/5 transition-colors"
            >
              Demo: Rohan
            </button>
            <button
              type="button"
              onClick={() => onDemoLogin('ananya.kulkarni@jcer.edu.in')}
              className="px-2.5 py-1 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] text-[11px] font-mono text-ecell-light border border-white/5 transition-colors"
            >
              Demo: Ananya
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthComponent;
