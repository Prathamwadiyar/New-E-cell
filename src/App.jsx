import { useState, useCallback, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import SocialBar from './components/layout/SocialBar';
import SplashScreen from './components/SplashScreen';
import Home from './pages/Home';
import About from './pages/About';
import Gallery from './pages/Gallery';
import Team from './pages/Team';
import Contact from './pages/Contact';
import Blog from './pages/Blog';

// Directory & Network Pages
import DirectoryLanding from './pages/directory/DirectoryLanding';
import StudentProfile from './pages/directory/StudentProfile';
import OrientationPortal from './pages/directory/OrientationPortal';
import StudentAuth from './pages/directory/StudentAuth';
import ProfileEditor from './pages/directory/ProfileEditor';
import AdminDashboard from './pages/directory/AdminDashboard';
import OpportunitiesHub from './pages/OpportunitiesHub';
import ProjectShowcase from './pages/ProjectShowcase';
import ResourceExchange from './pages/ResourceExchange';
import { DirectoryAuthProvider } from './context/DirectoryAuthContext';

const AnimatedRoutes = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Existing Routes - 100% Preserved */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/team" element={<Team />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/blog" element={<Blog />} />

        {/* Directory & Innovation Features */}
        <Route path="/directory" element={<DirectoryLanding />} />
        <Route path="/directory/orientation" element={<OrientationPortal />} />
        <Route path="/directory/:username" element={<StudentProfile />} />
        <Route path="/opportunities" element={<OpportunitiesHub />} />
        <Route path="/projects" element={<ProjectShowcase />} />
        <Route path="/resources" element={<ResourceExchange />} />
        <Route path="/dashboard/login" element={<StudentAuth initialMode="login" />} />
        <Route path="/dashboard/register" element={<StudentAuth initialMode="register" />} />
        <Route path="/dashboard/profile" element={<ProfileEditor />} />
        <Route path="/admin/directory" element={<AdminDashboard />} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => {
  const [splashDone, setSplashDone] = useState(false);
  const handleSplashDone = useCallback(() => setSplashDone(true), []);

  return (
    <DirectoryAuthProvider>
      <BrowserRouter>
        {/* Splash – shows on initial load, unmounts cleanly */}
        {!splashDone && <SplashScreen onDone={handleSplashDone} />}

        <div className="min-h-screen flex flex-col relative bg-transparent">
          {/* Fixed Ambient Dark Blue Background Gradient */}
          <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse 130% 75% at 50% 100%, #072a66 0%, #031333 45%, #000000 85%)',
              }}
            />
          </div>

          <Header />
          <SocialBar />
          <main className="flex-1 relative z-10">
            <AnimatedRoutes />
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </DirectoryAuthProvider>
  );
};

export default App;

