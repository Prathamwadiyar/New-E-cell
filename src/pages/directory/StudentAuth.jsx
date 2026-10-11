import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthComponent } from '../../components/ui/sign-up';
import { useDirectoryAuth } from '../../context/DirectoryAuthContext';

// CustomLogo adhering to requested pattern and JCER palette
const CustomLogo = () => (
  <div className="bg-ecell-blue text-white rounded-xl p-2.5 shadow-[0_0_20px_rgba(48,134,248,0.4)] inline-block">
    <svg
      className="h-6 w-6"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
    </svg>
  </div>
);

const StudentAuth = ({ initialMode = 'login' }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login, register, loginWithGoogle } = useDirectoryAuth();

  const isRegisterInitial = initialMode === 'register' || location.pathname.includes('register');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEmailSubmit = async (formData, isSignUp) => {
    setError('');
    setLoading(true);
    try {
      if (isSignUp) {
        const res = await register(formData);
        if (res.success) {
          navigate('/dashboard/profile');
        } else {
          setError(res.error || 'Failed to create account.');
        }
      } else {
        const res = await login(formData.email, formData.password);
        if (res.success) {
          navigate('/dashboard/profile');
        } else {
          setError('Invalid email or password.');
        }
      }
    } catch (err) {
      setError(err.message || 'Authentication error.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSubmit = async () => {
    setError('');
    setLoading(true);
    try {
      const res = await loginWithGoogle();
      if (res.success) {
        navigate('/dashboard/profile');
      } else if (res.error) {
        setError(res.error);
      }
    } catch (err) {
      setError(err.message || 'Google sign in failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (demoEmail) => {
    setError('');
    setLoading(true);
    try {
      const res = await login(demoEmail, 'password123');
      if (res.success) {
        navigate('/dashboard/profile');
      }
    } catch (err) {
      setError(err.message || 'Demo login error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-white pt-28 pb-20 md:pt-36 flex items-center justify-center px-4 sm:px-6">
      {/* Background ambient lighting */}
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-ecell-blue/10 blur-[140px] pointer-events-none -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full"
      >
        <AuthComponent
          logo={<CustomLogo />}
          brandName="JCER E-Cell"
          initialTab={isRegisterInitial ? 'signup' : 'signin'}
          onEmailSubmit={handleEmailSubmit}
          onGoogleSubmit={handleGoogleSubmit}
          onDemoLogin={handleDemoLogin}
          loading={loading}
          error={error}
        />
      </motion.div>
    </div>
  );
};

export default StudentAuth;
