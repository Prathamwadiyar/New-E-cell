import { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User } from 'lucide-react';
import logoImg from '../../assets/logo.png';
import { useDirectoryAuth } from '../../context/DirectoryAuthContext';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About Us' },
  { to: '/directory', label: 'Directory' },
  { to: '/opportunities', label: 'Opportunities' },
  { to: '/projects', label: 'Projects' },
  { to: '/resources', label: 'Resources' },
  { to: '/team', label: 'Meet Our Team' },
  { to: '/blog', label: 'Blogs' },
  { to: '/contact', label: 'Contact' },
];

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { currentUser } = useDirectoryAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  return (
    <>
      {/* ── HEADER WRAPPER ─────────────────────────────────────────── */}
      <div className={`fixed top-0 left-0 right-0 z-50 flex justify-center transition-all duration-500 ${scrolled ? 'pt-3' : 'pt-0'}`}>

        <motion.header
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className={`transition-all duration-700 ${
            scrolled
              ? 'w-auto mx-auto px-5 lg:px-6 py-2 rounded-2xl bg-black/85 backdrop-blur-2xl border border-white/[0.08] shadow-[0_4px_32px_rgba(0,0,0,0.6)]'
              : 'w-full px-6 lg:px-10 py-2 bg-transparent border-b border-transparent'
          }`}
          style={{ maxWidth: scrolled ? '1180px' : '100%' }}
        >
          <div className={`flex items-center justify-between transition-all duration-700 w-full ${scrolled ? 'h-13 px-2 gap-4 lg:gap-6' : 'h-16 md:h-24 px-0 gap-4'}`}>

            {/* Left: Logo */}
            <Link to="/" className="flex-shrink-0 z-10 mr-1 md:mr-2">
              <img
                src={logoImg}
                alt="E-Cell Logo"
                className={`object-contain transition-all duration-500 ${scrolled ? 'h-9 md:h-10' : 'h-14 md:h-20 lg:h-24'}`}
              />
            </Link>

            {/* Center: Desktop Nav */}
            <nav className={`hidden md:flex flex-1 items-center justify-center transition-all duration-700 ${scrolled ? 'gap-3 lg:gap-5' : 'gap-4 lg:gap-6'}`}>
              {navLinks.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) =>
                    `nav-link text-xs font-medium tracking-wide whitespace-nowrap ${scrolled ? 'text-[12px]' : ''} ${isActive ? 'active' : ''}`
                  }
                >
                  {label}
                </NavLink>
              ))}
            </nav>

            {/* Right: Auth Action Button (Desktop) */}
            <div className="hidden md:flex items-center gap-3">
              <Link
                to={currentUser ? '/dashboard/profile' : '/dashboard/login'}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-medium tracking-wider text-white bg-white/[0.04] hover:bg-ecell-blue border border-white/10 hover:border-ecell-blue transition-all duration-200 shadow-sm"
              >
                <User className="w-3 h-3 text-ecell-light" />
                {currentUser ? 'My Profile' : 'Sign In'}
              </Link>
            </div>
            
            {/* Hamburger (mobile) */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg text-white border border-white/10 hover:border-ecell-blue/50 hover:bg-ecell-blue/10 transition-all duration-200"
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait" initial={false}>
                {menuOpen ? (
                  <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.18 }}>
                    <X className="w-4 h-4" />
                  </motion.div>
                ) : (
                  <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.18 }}>
                    <Menu className="w-4 h-4" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </motion.header>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="fixed top-16 left-4 right-4 z-40 rounded-2xl bg-black/90 backdrop-blur-2xl border border-white/[0.08] overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.7)]"
          >
            <div className="flex flex-col px-5 py-4 gap-1">
              {navLinks.map(({ to, label }, i) => (
                <motion.div
                  key={to}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <NavLink
                    to={to}
                    end={to === '/'}
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) =>
                      `block py-2.5 px-3 rounded-xl text-sm font-inter transition-all duration-200
                      ${isActive
                        ? 'text-ecell-glow bg-ecell-blue/10 border border-ecell-blue/20'
                        : 'text-ecell-gray hover:text-white hover:bg-white/[0.04]'
                      }`
                    }
                  >
                    {label}
                  </NavLink>
                </motion.div>
              ))}

              <div className="pt-2 border-t border-white/10 mt-1">
                <Link
                  to="/dashboard/login"
                  onClick={() => setMenuOpen(false)}
                  className="block text-center py-2.5 px-3 rounded-xl text-xs font-mono font-medium text-white bg-ecell-blue hover:bg-blue-600 transition-colors shadow-sm"
                >
                  Sign In / Register
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
