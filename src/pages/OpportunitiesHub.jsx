import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Compass,
  Search,
  Filter,
  Calendar,
  ExternalLink,
  Award,
  Bookmark,
  Plus,
  X,
  Sparkles,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  Trophy,
  GraduationCap,
  Code2,
  Share2,
} from 'lucide-react';
import {
  getOpportunities,
  saveOpportunity,
  getSavedOpportunityIds,
  toggleSaveOpportunity,
  OPPORTUNITY_CATEGORIES,
  OPPORTUNITY_MODES,
} from '../services/opportunitiesStorage';
import { useDirectoryAuth } from '../context/DirectoryAuthContext';
import SectionBadge from '../components/ui/SectionBadge';

const categoryIcons = {
  Hackathons: Code2,
  Internships: Briefcase,
  Competitions: Trophy,
  Scholarships: GraduationCap,
};

const OpportunitiesHub = () => {
  const { currentUser } = useDirectoryAuth();
  const [opportunities, setOpportunities] = useState([]);
  const [savedIds, setSavedIds] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedMode, setSelectedMode] = useState('All');
  const [onlySaved, setOnlySaved] = useState(false);
  const [sortBy, setSortBy] = useState('deadline'); // 'deadline' | 'newest'

  // Submit Modal
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    organizer: '',
    category: 'Hackathons',
    mode: 'Online / Remote',
    location: '',
    deadline: '',
    prizeOrStipend: '',
    eligibility: '',
    applyUrl: '',
    description: '',
    tags: '',
  });

  const loadData = async () => {
    setLoading(true);
    const data = await getOpportunities();
    setOpportunities(data);
    setSavedIds(getSavedOpportunityIds());
    setLoading(false);
  };

  useEffect(() => {
    loadData();
    document.title = 'Opportunities Hub — JCER E-Cell';
    return () => {
      document.title = 'E-Cell | Entrepreneurship Cell';
    };
  }, []);

  const handleToggleBookmark = (id) => {
    const updated = toggleSaveOpportunity(id);
    setSavedIds(updated);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitOpportunity = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitSuccess('');
    if (!formData.title || !formData.organizer || !formData.deadline || !formData.applyUrl) {
      setSubmitError('Please fill in all required fields (Title, Organizer, Deadline, Apply Link).');
      return;
    }

    setFormSubmitting(true);
    try {
      const tagList = formData.tags
        ? formData.tags.split(',').map((t) => t.trim()).filter(Boolean)
        : ['Engineering', 'JCER'];

      const newEntry = {
        ...formData,
        tags: tagList,
        location: formData.location || (formData.mode === 'Online / Remote' ? 'Remote' : 'Belagavi / Karnataka'),
        submittedBy: currentUser?.displayName || 'JCER Student Member',
      };

      await saveOpportunity(newEntry);
      setSubmitSuccess('Opportunity successfully published to the JCER Hub!');
      setTimeout(() => {
        setIsSubmitModalOpen(false);
        setSubmitSuccess('');
        setFormData({
          title: '',
          organizer: '',
          category: 'Hackathons',
          mode: 'Online / Remote',
          location: '',
          deadline: '',
          prizeOrStipend: '',
          eligibility: '',
          applyUrl: '',
          description: '',
          tags: '',
        });
      }, 1200);
      loadData();
    } catch (err) {
      setSubmitError(err.message || 'Failed to submit opportunity.');
    } finally {
      setFormSubmitting(false);
    }
  };

  // Filtered & sorted opportunities
  const filteredList = useMemo(() => {
    let result = opportunities.filter((opp) => {
      if (onlySaved && !savedIds.includes(opp.id)) return false;

      if (selectedCategory !== 'All' && opp.category !== selectedCategory) return false;

      if (selectedMode !== 'All' && opp.mode !== selectedMode) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const titleMatch = opp.title?.toLowerCase().includes(q);
        const orgMatch = opp.organizer?.toLowerCase().includes(q);
        const descMatch = opp.description?.toLowerCase().includes(q);
        const tagsMatch = opp.tags?.some((t) => t.toLowerCase().includes(q));
        if (!titleMatch && !orgMatch && !descMatch && !tagsMatch) return false;
      }
      return true;
    });

    if (sortBy === 'deadline') {
      result.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
    } else {
      result.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
    }

    return result;
  }, [opportunities, savedIds, onlySaved, selectedCategory, selectedMode, searchQuery, sortBy]);

  // Days left calculation
  const getDaysLeft = (deadlineStr) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const d = new Date(deadlineStr);
    const diff = Math.ceil((d - today) / (1000 * 60 * 60 * 24));
    if (diff < 0) return { label: 'Closed', isPast: true, urgent: false };
    if (diff === 0) return { label: 'Ends Today', isPast: false, urgent: true };
    if (diff === 1) return { label: '1 Day Left', isPast: false, urgent: true };
    if (diff <= 7) return { label: `${diff} Days Left`, isPast: false, urgent: true };
    return { label: `${diff} Days Left`, isPast: false, urgent: false };
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-transparent text-white pt-24 md:pt-32 pb-24"
    >
      {/* Background Ambient Glow */}
      <div className="fixed top-20 right-1/4 w-[500px] h-[300px] bg-ecell-blue/10 blur-[150px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        
        {/* Editorial Header */}
        <div className="mb-12 border-b border-white/10 pb-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <SectionBadge>Ecosystem Intel // Section 02</SectionBadge>
              <h1 className="font-sora text-3xl sm:text-4xl md:text-5xl font-extrabold uppercase tracking-tight text-white leading-none">
                Opportunities <span className="text-ecell-light">Hub</span>
              </h1>
              <p className="text-sm md:text-base text-ecell-gray/80 font-light leading-relaxed">
                Curated national hackathons, high-stipend engineering internships, competitive student showcases, and institutional prototype grants for JCER builders.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setOnlySaved(!onlySaved)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono transition-all border ${
                  onlySaved
                    ? 'bg-ecell-blue text-white border-ecell-blue shadow-[0_0_15px_rgba(48,134,248,0.4)]'
                    : 'bg-white/[0.03] text-white/80 border-white/10 hover:border-white/20'
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${onlySaved ? 'fill-current' : ''}`} />
                Saved ({savedIds.length})
              </button>

              <button
                type="button"
                onClick={() => setIsSubmitModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-ecell-blue hover:bg-blue-600 text-white text-xs font-mono font-medium transition-all shadow-[0_0_20px_rgba(48,134,248,0.35)]"
              >
                <Plus className="w-3.5 h-3.5" />
                Submit Opportunity
              </button>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/5 font-mono text-xs">
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
              <span className="text-white/40 block text-[10px] uppercase">Total Listings</span>
              <span className="text-xl font-bold font-sora text-white">{opportunities.length}</span>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
              <span className="text-white/40 block text-[10px] uppercase">Active Hackathons</span>
              <span className="text-xl font-bold font-sora text-cyan-400">
                {opportunities.filter((o) => o.category === 'Hackathons').length}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
              <span className="text-white/40 block text-[10px] uppercase">Grants & Fellowships</span>
              <span className="text-xl font-bold font-sora text-emerald-400">
                {opportunities.filter((o) => o.category === 'Scholarships').length}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
              <span className="text-white/40 block text-[10px] uppercase">Remote / Online</span>
              <span className="text-xl font-bold font-sora text-ecell-light">
                {opportunities.filter((o) => o.mode === 'Online / Remote').length}
              </span>
            </div>
          </div>
        </div>

        {/* Filters Toolbar */}
        <div className="p-5 rounded-2xl bg-black/60 backdrop-blur-xl border border-white/10 space-y-4 mb-8">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search opportunities by title, tech stack (e.g. AI, IoT), or organizer..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-ecell-blue transition-all"
              />
            </div>

            {/* Mode Filter */}
            <div className="flex items-center gap-2">
              <select
                value={selectedMode}
                onChange={(e) => setSelectedMode(e.target.value)}
                className="px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-ecell-blue"
              >
                {OPPORTUNITY_MODES.map((m) => (
                  <option key={m} value={m} className="bg-black text-white">
                    Mode: {m}
                  </option>
                ))}
              </select>

              {/* Sort By */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-ecell-blue"
              >
                <option value="deadline" className="bg-black text-white">
                  Sort: Deadline (Nearest)
                </option>
                <option value="newest" className="bg-black text-white">
                  Sort: Recently Added
                </option>
              </select>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {OPPORTUNITY_CATEGORIES.map((cat) => {
              const Icon = categoryIcons[cat] || Sparkles;
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-all ${
                    isSelected
                      ? 'bg-ecell-blue text-white shadow-sm'
                      : 'bg-white/[0.02] text-white/60 hover:text-white hover:bg-white/[0.05] border border-white/5'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Opportunities Feed */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-8 h-8 border-2 border-ecell-blue border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs font-mono text-white/50 uppercase tracking-widest">
              Fetching Opportunities...
            </p>
          </div>
        ) : filteredList.length === 0 ? (
          <div className="py-20 text-center p-8 rounded-3xl bg-white/[0.02] border border-white/5 space-y-3">
            <Compass className="w-10 h-10 text-white/20 mx-auto" />
            <h3 className="font-sora text-lg font-bold text-white uppercase">No Opportunities Found</h3>
            <p className="text-xs font-mono text-white/50 max-w-md mx-auto">
              No matching listings found with current filters. Try searching with different keywords or submit a new opportunity for the JCER community.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setSelectedMode('All');
                setOnlySaved(false);
              }}
              className="px-4 py-2 rounded-xl bg-white/[0.05] text-xs font-mono text-ecell-light hover:bg-white/10 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredList.map((opp) => {
              const Icon = categoryIcons[opp.category] || Sparkles;
              const { label: daysLeftLabel, urgent, isPast } = getDaysLeft(opp.deadline);
              const isSaved = savedIds.includes(opp.id);

              return (
                <motion.div
                  key={opp.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.08] hover:border-ecell-blue/40 p-6 flex flex-col justify-between transition-all duration-300 relative group shadow-sm hover:shadow-[0_4px_30px_rgba(48,134,248,0.12)]"
                >
                  <div>
                    {/* Top Meta Bar */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono font-medium bg-ecell-blue/15 text-ecell-light border border-ecell-blue/30">
                          <Icon className="w-3 h-3" />
                          {opp.category}
                        </span>

                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-mono text-white/70 bg-white/[0.03] border border-white/5">
                          <MapPin className="w-3 h-3 text-white/40" />
                          {opp.mode}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Countdown Badge */}
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                            isPast
                              ? 'bg-rose-950/50 text-rose-300 border-rose-500/30'
                              : urgent
                              ? 'bg-amber-950/50 text-amber-300 border-amber-500/30 animate-pulse'
                              : 'bg-white/[0.04] text-white/60 border-white/10'
                          }`}
                        >
                          <Clock className="w-2.5 h-2.5 inline mr-1" />
                          {daysLeftLabel}
                        </span>

                        {/* Save Button */}
                        <button
                          type="button"
                          onClick={() => handleToggleBookmark(opp.id)}
                          className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
                          title={isSaved ? 'Remove Bookmark' : 'Save Opportunity'}
                        >
                          <Bookmark
                            className={`w-4 h-4 ${
                              isSaved ? 'text-ecell-blue fill-ecell-blue' : ''
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    {/* Title & Host */}
                    <div className="mb-3">
                      <h3 className="font-sora text-lg sm:text-xl font-bold text-white group-hover:text-ecell-light transition-colors leading-snug">
                        {opp.title}
                      </h3>
                      <p className="text-xs font-mono text-white/50 mt-1">
                        Hosted by: <span className="text-white/80">{opp.organizer}</span>
                      </p>
                    </div>

                    {/* Prize / Stipend Highlight */}
                    {opp.prizeOrStipend && (
                      <div className="mb-3.5 p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/20 flex items-center gap-2 text-xs font-mono text-emerald-300">
                        <Award className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span className="font-medium">{opp.prizeOrStipend}</span>
                      </div>
                    )}

                    {/* Description */}
                    <p className="text-xs text-ecell-gray/80 leading-relaxed font-light mb-4 line-clamp-3">
                      {opp.description}
                    </p>

                    {/* Eligibility */}
                    {opp.eligibility && (
                      <div className="mb-4 text-[11px] font-mono text-white/60 border-l-2 border-ecell-blue/40 pl-2.5 leading-relaxed">
                        <span className="text-white/40 uppercase block text-[10px]">Eligibility</span>
                        {opp.eligibility}
                      </div>
                    )}

                    {/* Tags */}
                    {opp.tags && opp.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-5">
                        {opp.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 rounded text-[10px] font-mono text-white/60 bg-white/[0.02] border border-white/5"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Footer Action */}
                  <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono">
                    <span className="text-white/40 text-[11px]">
                      Deadline: <span className="text-white/80">{opp.deadline}</span>
                    </span>

                    <a
                      href={opp.applyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-ecell-blue/20 hover:bg-ecell-blue text-ecell-light hover:text-white border border-ecell-blue/40 hover:border-ecell-blue transition-all font-medium text-xs shadow-sm"
                    >
                      <span>Apply / Details</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

      </div>

      {/* Submission Modal */}
      <AnimatePresence>
        {isSubmitModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl bg-zinc-950 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative my-8"
            >
              <button
                type="button"
                onClick={() => setIsSubmitModalOpen(false)}
                className="absolute top-6 right-6 p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-6">
                <SectionBadge className="mb-2">Community Submission</SectionBadge>
                <h2 className="font-sora text-2xl font-bold uppercase text-white">
                  Submit an Opportunity
                </h2>
                <p className="text-xs font-mono text-ecell-gray/70 mt-1">
                  Share a national hackathon, verified internship, or grant opportunity with JCER peers.
                </p>
              </div>

              {submitError && (
                <div className="mb-4 p-3 rounded-xl bg-rose-950/50 border border-rose-500/30 flex items-center gap-2 text-xs font-mono text-rose-300">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{submitError}</span>
                </div>
              )}

              {submitSuccess && (
                <div className="mb-4 p-3 rounded-xl bg-emerald-950/50 border border-emerald-500/30 flex items-center gap-2 text-xs font-mono text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>{submitSuccess}</span>
                </div>
              )}

              <form onSubmit={handleSubmitOpportunity} className="space-y-4 font-mono text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-white/60 block mb-1 uppercase text-[10px]">Title *</label>
                    <input
                      type="text"
                      name="title"
                      required
                      value={formData.title}
                      onChange={handleFormChange}
                      placeholder="e.g. Smart India Hackathon 2026"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white focus:outline-none focus:border-ecell-blue"
                    />
                  </div>

                  <div>
                    <label className="text-white/60 block mb-1 uppercase text-[10px]">Organizer / Host *</label>
                    <input
                      type="text"
                      name="organizer"
                      required
                      value={formData.organizer}
                      onChange={handleFormChange}
                      placeholder="e.g. AICTE / Ministry of Education"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white focus:outline-none focus:border-ecell-blue"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-white/60 block mb-1 uppercase text-[10px]">Category *</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleFormChange}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white focus:outline-none focus:border-ecell-blue"
                    >
                      <option value="Hackathons" className="bg-black">Hackathons</option>
                      <option value="Internships" className="bg-black">Internships</option>
                      <option value="Competitions" className="bg-black">Competitions</option>
                      <option value="Scholarships" className="bg-black">Scholarships</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-white/60 block mb-1 uppercase text-[10px]">Mode *</label>
                    <select
                      name="mode"
                      value={formData.mode}
                      onChange={handleFormChange}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white focus:outline-none focus:border-ecell-blue"
                    >
                      <option value="Online / Remote" className="bg-black">Online / Remote</option>
                      <option value="In-Person" className="bg-black">In-Person</option>
                      <option value="Hybrid" className="bg-black">Hybrid</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-white/60 block mb-1 uppercase text-[10px]">Deadline *</label>
                    <input
                      type="date"
                      name="deadline"
                      required
                      value={formData.deadline}
                      onChange={handleFormChange}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white focus:outline-none focus:border-ecell-blue"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-white/60 block mb-1 uppercase text-[10px]">Prize Pool / Stipend</label>
                    <input
                      type="text"
                      name="prizeOrStipend"
                      value={formData.prizeOrStipend}
                      onChange={handleFormChange}
                      placeholder="e.g. ₹1,00,000 Cash Prize or ₹25k/month"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white focus:outline-none focus:border-ecell-blue"
                    />
                  </div>

                  <div>
                    <label className="text-white/60 block mb-1 uppercase text-[10px]">Official URL / Link *</label>
                    <input
                      type="url"
                      name="applyUrl"
                      required
                      value={formData.applyUrl}
                      onChange={handleFormChange}
                      placeholder="https://..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white focus:outline-none focus:border-ecell-blue"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-white/60 block mb-1 uppercase text-[10px]">Eligibility Criteria</label>
                  <input
                    type="text"
                    name="eligibility"
                    value={formData.eligibility}
                    onChange={handleFormChange}
                    placeholder="e.g. Open to 2nd to 4th year CSE / ECE students"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white focus:outline-none focus:border-ecell-blue"
                  />
                </div>

                <div>
                  <label className="text-white/60 block mb-1 uppercase text-[10px]">Tech Tags (Comma-Separated)</label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleFormChange}
                    placeholder="e.g. React, Python, IoT, Web3"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white focus:outline-none focus:border-ecell-blue"
                  />
                </div>

                <div>
                  <label className="text-white/60 block mb-1 uppercase text-[10px]">Brief Description *</label>
                  <textarea
                    name="description"
                    rows="3"
                    required
                    value={formData.description}
                    onChange={handleFormChange}
                    placeholder="Outline competition structure, key rounds, problem statements..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white focus:outline-none focus:border-ecell-blue"
                  />
                </div>

                <div className="pt-3 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsSubmitModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-white/70 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={formSubmitting}
                    className="px-6 py-2.5 rounded-xl bg-ecell-blue hover:bg-blue-600 text-white font-semibold transition-all shadow-[0_0_20px_rgba(48,134,248,0.35)] disabled:opacity-50"
                  >
                    {formSubmitting ? 'Submitting...' : 'Publish to Hub'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default OpportunitiesHub;
