import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getApprovedProfiles } from '../../services/directoryStorage';
import DirectoryHero from '../../components/directory/DirectoryHero';
import DirectoryFilters from '../../components/directory/DirectoryFilters';
import StudentCard from '../../components/directory/StudentCard';
import OrientationQRModal from '../../components/directory/OrientationQRModal';
import { Sparkles, ArrowRight, UserPlus, SearchX } from 'lucide-react';

const DirectoryLanding = () => {
  const [profiles, setProfiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      const data = await getApprovedProfiles();
      setProfiles(data);
      setIsLoading(false);
    };
    load();
  }, []);

  // Filter profiles
  const filteredProfiles = useMemo(() => {
    return profiles.filter((profile) => {
      // Search query (name, skills, role, achievements)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const nameMatch = profile.fullName?.toLowerCase().includes(query);
        const roleMatch = profile.primaryRole?.toLowerCase().includes(query);
        const skillsMatch = profile.skills?.some((s) => s.toLowerCase().includes(query));
        const achMatch = profile.achievements?.some(
          (a) =>
            a.title?.toLowerCase().includes(query) ||
            a.event?.toLowerCase().includes(query) ||
            a.description?.toLowerCase().includes(query)
        );

        if (!nameMatch && !roleMatch && !skillsMatch && !achMatch) {
          return false;
        }
      }

      // Department filter
      if (selectedDepartment !== 'All') {
        if (profile.department !== selectedDepartment) return false;
      }

      // Academic year filter
      if (selectedYear !== 'All') {
        if (profile.academicYear !== selectedYear) return false;
      }

      // Category filter (checks if student has at least one achievement in this category)
      if (selectedCategory !== 'All') {
        const hasCategory = profile.achievements?.some((a) => a.category === selectedCategory);
        if (!hasCategory) return false;
      }

      // Availability filter
      if (onlyAvailable) {
        if (profile.collaborationStatus !== 'Open for Hackathons') return false;
      }

      return true;
    });
  }, [profiles, searchQuery, selectedDepartment, selectedYear, selectedCategory, onlyAvailable]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedDepartment('All');
    setSelectedYear('All');
    setSelectedCategory('All');
    setOnlyAvailable(false);
  };

  const totalAchievements = useMemo(() => {
    return profiles.reduce((sum, p) => sum + (p.achievements?.length || 0), 0);
  }, [profiles]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-transparent text-white"
    >
      {/* Editorial Hero */}
      <DirectoryHero
        totalAchievers={profiles.length}
        totalAchievements={totalAchievements}
        onOpenQR={() => setIsQRModalOpen(true)}
      />

      {/* Main Directory Body */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 pb-24">
        
        {/* Filters Bar */}
        <DirectoryFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedDepartment={selectedDepartment}
          setSelectedDepartment={setSelectedDepartment}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          onlyAvailable={onlyAvailable}
          setOnlyAvailable={setOnlyAvailable}
          onReset={handleResetFilters}
        />

        {/* Results Counter & Meta */}
        <div className="flex items-center justify-between py-4 border-b border-white/[0.06] mb-8">
          <div className="text-xs font-mono text-ecell-gray uppercase tracking-wider">
            Showing <span className="text-white font-bold">{filteredProfiles.length}</span> of{' '}
            <span className="text-ecell-light">{profiles.length}</span> Published Achievers
          </div>

          <Link
            to="/directory/orientation"
            className="text-xs font-mono text-ecell-light hover:text-white flex items-center gap-1 transition-colors"
          >
            Orientation Guide <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="py-24 text-center space-y-4">
            <div className="w-10 h-10 border-2 border-ecell-blue border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-mono text-ecell-gray/60 uppercase tracking-widest">
              Loading Verified Talent Index...
            </p>
          </div>
        ) : filteredProfiles.length > 0 ? (
          /* Student Card Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredProfiles.map((student, idx) => (
              <StudentCard key={student.id || student.slug} student={student} index={idx} />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="py-20 text-center rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-4 max-w-xl mx-auto my-8">
            <SearchX className="w-12 h-12 text-white/20 mx-auto" />
            <div>
              <h3 className="font-sora text-lg font-bold text-white">
                No matching student profiles found
              </h3>
              <p className="text-xs text-ecell-gray/70 font-mono mt-1">
                Try loosening your filters or search for another skill, department, or competition name.
              </p>
            </div>
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-mono text-white transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        )}

        {/* Orientation Call-to-Action Card */}
        <div className="mt-20 p-8 md:p-12 rounded-3xl bg-gradient-to-r from-ecell-blue/20 via-black to-black border border-ecell-blue/30 relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-blue-radial pointer-events-none" />
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/10 text-xs font-mono text-ecell-glow uppercase">
              <Sparkles className="w-3.5 h-3.5 text-ecell-blue" />
              Orientation Session 2026
            </div>
            <h2 className="font-sora text-2xl sm:text-4xl font-extrabold text-white tracking-tight uppercase">
              Have you won competitions? Get listed.
            </h2>
            <p className="text-ecell-gray text-sm md:text-base leading-relaxed font-light">
              Students with at least 3 qualifying achievements in hackathons, robotics, sports, entrepreneurship, or cultural events can apply for verified inclusion in the official JCER Directory.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <Link
                to="/dashboard/register"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-ecell-blue hover:bg-blue-600 text-white font-semibold text-xs font-mono uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(48,134,248,0.4)]"
              >
                <UserPlus className="w-4 h-4" />
                Submit Your Portfolio
              </Link>
              <button
                onClick={() => setIsQRModalOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-white text-xs font-mono uppercase tracking-wider border border-white/10 transition-colors"
              >
                Scan Mobile QR
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Orientation QR Modal */}
      <OrientationQRModal
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
      />

    </motion.div>
  );
};

export default DirectoryLanding;
