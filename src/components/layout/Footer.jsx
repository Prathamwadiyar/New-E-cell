import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Heart, ArrowUp } from 'lucide-react';
import { FaLinkedinIn, FaInstagram, FaXTwitter, FaWhatsapp } from 'react-icons/fa6';
import logoImg from '../../assets/logo.jpg';

const quickLinks = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Talent Directory', to: '/directory' },
  { label: 'Opportunities Hub', to: '/opportunities' },
  { label: 'Project Showcase', to: '/projects' },
  { label: 'Resource Exchange', to: '/resources' },
  { label: 'Team', to: '/team' },
  { label: 'Contact', to: '/contact' },
];

const resources = [
  { label: 'Talent Directory', to: '/directory' },
  { label: 'Opportunities Hub', to: '/opportunities' },
  { label: 'Project Showcase', to: '/projects' },
  { label: 'Resource Exchange', to: '/resources' },
  { label: 'Orientation Launch', to: '/directory/orientation' },
  { label: 'Student Profile', to: '/dashboard/login' },
  { label: 'Admin Portal', to: '/admin/directory' },
];

const socials = [
  { icon: FaLinkedinIn, label: 'LinkedIn',  href: 'https://www.linkedin.com/company/jcer-e-cell/posts/?feedView=all' },
  { icon: FaInstagram,  label: 'Instagram', href: 'https://www.instagram.com/jcer_ecell' },
  { icon: FaXTwitter,   label: 'X',         href: '#' },
  { icon: FaWhatsapp,   label: 'WhatsApp',  href: 'https://wa.me/919483937558' },
];

export const AnimatedWaveFooter = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative w-full overflow-hidden text-white mt-16 select-none">
      {/* Inline Scoped Animations for the parallax waves */}
      <style>{`
        @keyframes wave-move-1 {
          0% { transform: translate3d(-90px, 0, 0); }
          50% { transform: translate3d(85px, 0, 0); }
          100% { transform: translate3d(-90px, 0, 0); }
        }
        @keyframes wave-move-2 {
          0% { transform: translate3d(85px, 0, 0); }
          50% { transform: translate3d(-90px, 0, 0); }
          100% { transform: translate3d(85px, 0, 0); }
        }
        @keyframes wave-move-3 {
          0% { transform: translate3d(-70px, 0, 0); }
          50% { transform: translate3d(60px, 0, 0); }
          100% { transform: translate3d(-70px, 0, 0); }
        }
        @keyframes wave-move-4 {
          0% { transform: translate3d(50px, 0, 0); }
          50% { transform: translate3d(-60px, 0, 0); }
          100% { transform: translate3d(50px, 0, 0); }
        }

        .wave-layer-1 {
          animation: wave-move-1 12s cubic-bezier(0.55, 0.5, 0.45, 0.5) infinite;
        }
        .wave-layer-2 {
          animation: wave-move-2 16s cubic-bezier(0.55, 0.5, 0.45, 0.5) infinite;
        }
        .wave-layer-3 {
          animation: wave-move-3 20s cubic-bezier(0.55, 0.5, 0.45, 0.5) infinite;
        }
        .wave-layer-4 {
          animation: wave-move-4 25s cubic-bezier(0.55, 0.5, 0.45, 0.5) infinite;
        }
      `}</style>

      {/* Wave Crest Visual Component */}
      <div className="relative w-full leading-none pointer-events-none">
        {/* Ambient Top Glow Line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#3086f8]/40 to-transparent z-10" />

        <svg
          className="relative block w-full h-[60px] sm:h-[90px] md:h-[120px] lg:h-[150px] -mb-[1px]"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          viewBox="0 24 150 28"
          preserveAspectRatio="none"
          shapeRendering="auto"
        >
          <defs>
            <path
              id="gentle-wave-path"
              d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
            />
            {/* Gradient definition for depth accent */}
            <linearGradient id="wave-grad-1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3086f8" stopOpacity="0.25" />
              <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#3086f8" stopOpacity="0.25" />
            </linearGradient>
            <linearGradient id="wave-grad-2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#072a66" stopOpacity="0.6" />
              <stop offset="50%" stopColor="#0a3c91" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#072a66" stopOpacity="0.6" />
            </linearGradient>
          </defs>

          {/* Layer 1: Highest crest, light translucent blue */}
          <g className="wave-layer-1">
            <use href="#gentle-wave-path" x="48" y="0" fill="url(#wave-grad-1)" />
          </g>

          {/* Layer 2: Mid-high crest, deep navy tint */}
          <g className="wave-layer-2">
            <use href="#gentle-wave-path" x="48" y="3" fill="url(#wave-grad-2)" />
          </g>

          {/* Layer 3: Lower crest, rich dark navy base */}
          <g className="wave-layer-3">
            <use href="#gentle-wave-path" x="48" y="5" fill="#041434" />
          </g>

          {/* Layer 4: Foundation wave merging directly into footer background */}
          <g className="wave-layer-4">
            <use href="#gentle-wave-path" x="48" y="7" fill="#020816" />
          </g>
        </svg>
      </div>

      {/* Footer Content Area with seamless dark backdrop */}
      <div className="relative bg-[#020816] border-t border-white/[0.04]">
        {/* Subtle radial ambient background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-64 bg-gradient-to-b from-[#3086f8]/10 via-[#072a66]/15 to-transparent blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-10 pt-12 pb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-14">

            {/* Column 1 — Logo & About */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Link to="/" className="inline-block mb-5">
                <img src={logoImg} alt="E-Cell Logo" className="h-9 object-contain" />
              </Link>
              <h3 className="font-sora font-semibold text-white text-lg mb-1 tracking-tight">Ideas Into Impact</h3>
              <p className="text-white/60 text-sm leading-relaxed mb-5 italic">
                &ldquo;Empowering Students. Building Entrepreneurs.&rdquo;
              </p>
              <div className="flex gap-2.5 flex-wrap">
                {socials.map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="w-8 h-8 flex items-center justify-center rounded-xl
                      border border-white/[0.08] text-white/50
                      hover:text-white hover:border-[#3086f8]/40 hover:bg-[#3086f8]/10
                      transition-all duration-200"
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </a>
                ))}
              </div>
            </motion.div>

            {/* Column 2 — Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h4 className="font-sora font-semibold text-white text-sm mb-5 tracking-wide">Quick Links</h4>
              <ul className="space-y-3">
                {quickLinks.map(({ label, to }) => (
                  <li key={label}>
                    <Link
                      to={to}
                      className="text-white/60 text-sm hover:text-white transition-colors duration-200 flex items-center gap-2 group"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#3086f8]/40 group-hover:bg-[#38bdf8] group-hover:scale-125 transition-all duration-200 flex-shrink-0" />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Column 3 — Resources */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h4 className="font-sora font-semibold text-white text-sm mb-5 tracking-wide">Resources</h4>
              <ul className="space-y-3">
                {resources.map(({ label, to }) => (
                  <li key={label}>
                    <Link
                      to={to}
                      className="text-white/60 text-sm hover:text-white transition-colors duration-200 flex items-center gap-2 group"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#3086f8]/40 group-hover:bg-[#38bdf8] group-hover:scale-125 transition-all duration-200 flex-shrink-0" />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Column 4 — Contact */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h4 className="font-sora font-semibold text-white text-sm mb-5 tracking-wide">Get In Touch</h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-[#38bdf8] mt-0.5 flex-shrink-0" />
                  <a href="mailto:ecell.jcer@gmail.com" className="text-white/70 text-sm hover:text-white transition-colors">
                    ecell.jcer@gmail.com
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-[#38bdf8] mt-0.5 flex-shrink-0" />
                  <p className="text-white/70 text-sm">+91 94839 37558</p>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#38bdf8] mt-0.5 flex-shrink-0" />
                  <p className="text-white/70 text-sm leading-relaxed">
                    Jain College of Engineering & Research (JCER), Belagavi, Karnataka
                  </p>
                </li>
              </ul>
            </motion.div>
          </div>

          {/* Divider */}
          <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6" />

          {/* Bottom Bar with Copyright & Back to Top */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/40">
            <p>
              &copy; {new Date().getFullYear()} JCER E-Cell. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-1.5">
                Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" /> by JCER E-Cell Tech Team
              </span>
              <button
                onClick={scrollToTop}
                aria-label="Scroll to top"
                className="flex items-center gap-1.5 text-white/50 hover:text-white px-2.5 py-1 rounded-lg border border-white/10 hover:border-[#3086f8]/40 hover:bg-[#3086f8]/10 transition-all duration-200"
              >
                <span>Top</span>
                <ArrowUp className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default AnimatedWaveFooter;
