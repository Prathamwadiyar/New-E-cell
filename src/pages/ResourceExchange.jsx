import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Cpu,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Clock,
  MapPin,
  Calendar,
  X,
  Plus,
  Layers,
  Sparkles,
  ShieldCheck,
  RotateCcw,
  BookOpen,
  Wrench,
  Printer,
  Projector,
  User,
  ArrowRight,
  ClipboardList,
} from 'lucide-react';
import {
  getResources,
  saveResource,
  getBorrowRequests,
  createBorrowRequest,
  updateBorrowRequestStatus,
  RESOURCE_CATEGORIES,
} from '../services/resourceExchangeStorage';
import { useDirectoryAuth } from '../context/DirectoryAuthContext';
import SectionBadge from '../components/ui/SectionBadge';

const categoryIcons = {
  'Hardware & Microcontrollers': Cpu,
  'Lab Instrumentation & Tools': Wrench,
  'Rapid Prototyping & 3D Printing': Printer,
  'Event & Media Tech': Projector,
  'Startup Books & Seed Library': BookOpen,
};

const ResourceExchange = () => {
  const { currentUser, studentProfile, isAdmin } = useDirectoryAuth();
  const [resources, setResources] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  // Borrow Modal
  const [activeBorrowResource, setActiveBorrowResource] = useState(null);
  const [borrowSubmitting, setBorrowSubmitting] = useState(false);
  const [borrowSuccess, setBorrowSuccess] = useState('');
  const [borrowError, setBorrowError] = useState('');
  const [borrowForm, setBorrowForm] = useState({
    studentName: '',
    studentEmail: '',
    studentUsn: '',
    department: 'Computer Science & Engineering',
    phone: '',
    purpose: '',
    durationDays: 7,
    requestedDate: new Date().toISOString().split('T')[0],
    agreedToTerms: false,
  });

  // Tracking Modal
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
  const [trackingTab, setTrackingTab] = useState('all'); // 'all' | 'active' | 'pending' | 'returned'

  // Add Resource Modal
  const [isAddResourceOpen, setIsAddResourceOpen] = useState(false);
  const [newResForm, setNewResForm] = useState({
    name: '',
    category: 'Hardware & Microcontrollers',
    labLocation: '',
    specs: '',
    totalQty: 2,
    availableQty: 2,
    condition: 'Excellent',
    maxDurationDays: 14,
    imageUrl: '',
    managedBy: '',
  });

  const loadData = async () => {
    setLoading(true);
    const [resList, reqList] = await Promise.all([getResources(), getBorrowRequests()]);
    setResources(resList);
    setRequests(reqList);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
    document.title = 'Campus Resource Exchange — JCER E-Cell';
    return () => {
      document.title = 'E-Cell | Entrepreneurship Cell';
    };
  }, []);

  // Autofill student data
  useEffect(() => {
    if (currentUser || studentProfile) {
      setBorrowForm((prev) => ({
        ...prev,
        studentName: studentProfile?.fullName || currentUser?.displayName || '',
        studentEmail: studentProfile?.email || currentUser?.email || '',
        studentUsn: studentProfile?.usn || '',
        department: studentProfile?.department || prev.department,
      }));
    }
  }, [currentUser, studentProfile]);

  const handleOpenBorrowModal = (resource) => {
    setActiveBorrowResource(resource);
    setBorrowSuccess('');
    setBorrowError('');
    setBorrowForm((prev) => ({
      ...prev,
      durationDays: Math.min(prev.durationDays, resource.maxDurationDays),
      agreedToTerms: false,
    }));
  };

  const handleBorrowSubmit = async (e) => {
    e.preventDefault();
    setBorrowError('');
    setBorrowSuccess('');

    if (!borrowForm.studentName || !borrowForm.studentEmail || !borrowForm.studentUsn || !borrowForm.purpose) {
      setBorrowError('Please fill in all borrower contact details and project purpose.');
      return;
    }
    if (!borrowForm.agreedToTerms) {
      setBorrowError('Please accept the JCER Laboratory Equipment Terms.');
      return;
    }

    setBorrowSubmitting(true);
    try {
      const returnDate = new Date();
      returnDate.setDate(returnDate.getDate() + Number(borrowForm.durationDays));

      await createBorrowRequest({
        resourceId: activeBorrowResource.id,
        resourceName: activeBorrowResource.name,
        returnDueDate: returnDate.toISOString().split('T')[0],
        ...borrowForm,
      });

      setBorrowSuccess('Borrow request submitted! Check the Tracking Portal for approval.');
      setTimeout(() => {
        setActiveBorrowResource(null);
        setBorrowSuccess('');
      }, 1500);
      loadData();
    } catch (err) {
      setBorrowError(err.message || 'Failed to submit borrow request.');
    } finally {
      setBorrowSubmitting(false);
    }
  };

  const handleUpdateStatus = async (reqId, status, note = '') => {
    await updateBorrowRequestStatus(reqId, status, note);
    loadData();
  };

  const handleAddResourceSubmit = async (e) => {
    e.preventDefault();
    if (!newResForm.name || !newResForm.labLocation || !newResForm.specs) return;
    await saveResource(newResForm);
    setIsAddResourceOpen(false);
    setNewResForm({
      name: '',
      category: 'Hardware & Microcontrollers',
      labLocation: '',
      specs: '',
      totalQty: 2,
      availableQty: 2,
      condition: 'Excellent',
      maxDurationDays: 14,
      imageUrl: '',
      managedBy: '',
    });
    loadData();
  };

  // Filtered resources
  const filteredResources = useMemo(() => {
    return resources.filter((res) => {
      if (onlyAvailable && res.availableQty <= 0) return false;
      if (selectedCategory !== 'All' && res.category !== selectedCategory) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const nMatch = res.name?.toLowerCase().includes(q);
        const lMatch = res.labLocation?.toLowerCase().includes(q);
        const sMatch = res.specs?.toLowerCase().includes(q);
        const tMatch = res.tags?.some((t) => t.toLowerCase().includes(q));
        if (!nMatch && !lMatch && !sMatch && !tMatch) return false;
      }
      return true;
    });
  }, [resources, onlyAvailable, selectedCategory, searchQuery]);

  const activeBorrowCount = requests.filter((r) => r.status === 'Active / In Use').length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-transparent text-white pt-24 md:pt-32 pb-24"
    >
      <div className="fixed top-24 right-1/3 w-[520px] h-[340px] bg-ecell-blue/10 blur-[150px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        
        {/* Editorial Header */}
        <div className="mb-12 border-b border-white/10 pb-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <SectionBadge>Lab Assets & Hardware // Section 04</SectionBadge>
              <h1 className="font-sora text-3xl sm:text-4xl md:text-5xl font-extrabold uppercase tracking-tight text-white leading-none">
                Campus Resource <span className="text-ecell-light">Exchange</span>
              </h1>
              <p className="text-sm md:text-base text-ecell-gray/80 font-light leading-relaxed">
                Hardware development kits, digital storage oscilloscopes, SMD rework stations, 3D printer slots, and incubation library assets available for JCER student teams and hackathons.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setIsTrackingModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] text-white text-xs font-mono border border-white/10 transition-all shadow-sm"
              >
                <ClipboardList className="w-3.5 h-3.5 text-ecell-light" />
                <span>Track Requests</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-ecell-blue text-white">
                  {requests.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setIsAddResourceOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-ecell-blue hover:bg-blue-600 text-white text-xs font-mono font-medium transition-all shadow-[0_0_20px_rgba(48,134,248,0.35)]"
              >
                <Plus className="w-3.5 h-3.5" />
                List Equipment
              </button>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/5 font-mono text-xs">
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
              <span className="text-white/40 block text-[10px] uppercase">Cataloged Assets</span>
              <span className="text-xl font-bold font-sora text-white">{resources.length} Units</span>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
              <span className="text-white/40 block text-[10px] uppercase">Ready to Borrow</span>
              <span className="text-xl font-bold font-sora text-emerald-400">
                {resources.reduce((sum, r) => sum + r.availableQty, 0)} Units
              </span>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
              <span className="text-white/40 block text-[10px] uppercase">Currently Checked Out</span>
              <span className="text-xl font-bold font-sora text-amber-400">
                {activeBorrowCount} In Use
              </span>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
              <span className="text-white/40 block text-[10px] uppercase">Partner Labs</span>
              <span className="text-xl font-bold font-sora text-ecell-light">5 Campus Labs</span>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="p-5 rounded-2xl bg-black/60 backdrop-blur-xl border border-white/10 space-y-4 mb-8">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search equipment by name, lab room (e.g. Room 302), or specs..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-ecell-blue transition-all"
              />
            </div>

            <button
              type="button"
              onClick={() => setOnlyAvailable(!onlyAvailable)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono border transition-all ${
                onlyAvailable
                  ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40 shadow-sm'
                  : 'bg-white/[0.03] text-white/70 border-white/10 hover:border-white/20'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              In-Stock Only
            </button>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {RESOURCE_CATEGORIES.map((cat) => {
              const Icon = categoryIcons[cat] || Layers;
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

        {/* Resources Grid */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-8 h-8 border-2 border-ecell-blue border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs font-mono text-white/50 uppercase tracking-widest">
              Cataloging Equipment...
            </p>
          </div>
        ) : filteredResources.length === 0 ? (
          <div className="py-20 text-center p-8 rounded-3xl bg-white/[0.02] border border-white/5 space-y-3">
            <Cpu className="w-10 h-10 text-white/20 mx-auto" />
            <h3 className="font-sora text-lg font-bold text-white uppercase">No Equipment Available</h3>
            <p className="text-xs font-mono text-white/50 max-w-md mx-auto">
              No matching assets found with current filters. Reset filters or submit equipment request to the E-Cell lab coordinator.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((res) => {
              const Icon = categoryIcons[res.category] || Cpu;
              const isAvailable = res.availableQty > 0;

              return (
                <motion.div
                  key={res.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.08] hover:border-ecell-blue/40 p-6 flex flex-col justify-between transition-all duration-300 relative group shadow-sm hover:shadow-[0_4px_30px_rgba(48,134,248,0.12)]"
                >
                  <div>
                    {/* Top Status & Category */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-mono font-medium bg-ecell-blue/15 text-ecell-light border border-ecell-blue/30">
                        <Icon className="w-3 h-3" />
                        {res.category.split(' ')[0]}
                      </span>

                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-mono border ${
                          isAvailable
                            ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30'
                            : 'bg-rose-950/60 text-rose-300 border-rose-500/30'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isAvailable ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'
                          }`}
                        />
                        {isAvailable ? `${res.availableQty} of ${res.totalQty} Free` : 'All Borrowed'}
                      </span>
                    </div>

                    {/* Title & Location */}
                    <div className="mb-3">
                      <h3 className="font-sora text-lg font-bold text-white group-hover:text-ecell-light transition-colors leading-snug">
                        {res.name}
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs font-mono text-white/50 mt-1.5">
                        <MapPin className="w-3.5 h-3.5 text-ecell-blue shrink-0" />
                        <span>{res.labLocation}</span>
                      </div>
                    </div>

                    {/* Specifications */}
                    <p className="text-xs text-ecell-gray/80 font-light leading-relaxed mb-4 line-clamp-3">
                      {res.specs}
                    </p>

                    {/* Metadata Badges */}
                    <div className="space-y-1.5 mb-5 font-mono text-[11px] text-white/60">
                      <div className="flex justify-between p-2 rounded-lg bg-white/[0.02] border border-white/5">
                        <span className="text-white/40">Max Borrow Duration</span>
                        <span className="text-white">{res.maxDurationDays} Days</span>
                      </div>
                      <div className="flex justify-between p-2 rounded-lg bg-white/[0.02] border border-white/5">
                        <span className="text-white/40">Condition</span>
                        <span className="text-emerald-400">{res.condition}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Action */}
                  <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
                    <span className="text-[10px] font-mono text-white/40 truncate max-w-[140px]">
                      {res.managedBy || 'JCER E-Cell'}
                    </span>

                    <button
                      type="button"
                      disabled={!isAvailable}
                      onClick={() => handleOpenBorrowModal(res)}
                      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-mono font-medium transition-all ${
                        isAvailable
                          ? 'bg-ecell-blue hover:bg-blue-600 text-white shadow-[0_0_15px_rgba(48,134,248,0.3)]'
                          : 'bg-white/5 text-white/30 cursor-not-allowed'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {isAvailable ? 'Request to Borrow' : 'Unavailable'}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

      </div>

      {/* Borrow Request Modal */}
      <AnimatePresence>
        {activeBorrowResource && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-xl bg-zinc-950 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative my-8"
            >
              <button
                type="button"
                onClick={() => setActiveBorrowResource(null)}
                className="absolute top-6 right-6 p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-6">
                <SectionBadge className="mb-2">Lab Borrow Slip</SectionBadge>
                <h2 className="font-sora text-xl font-bold uppercase text-white">
                  Borrow {activeBorrowResource.name}
                </h2>
                <p className="text-xs font-mono text-ecell-gray/70 mt-1">
                  Available at {activeBorrowResource.labLocation} • Max loan: {activeBorrowResource.maxDurationDays} days.
                </p>
              </div>

              {borrowError && (
                <div className="mb-4 p-3 rounded-xl bg-rose-950/50 border border-rose-500/30 flex items-center gap-2 text-xs font-mono text-rose-300">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{borrowError}</span>
                </div>
              )}

              {borrowSuccess && (
                <div className="mb-4 p-3 rounded-xl bg-emerald-950/50 border border-emerald-500/30 flex items-center gap-2 text-xs font-mono text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>{borrowSuccess}</span>
                </div>
              )}

              <form onSubmit={handleBorrowSubmit} className="space-y-4 font-mono text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-white/60 block mb-1 uppercase text-[10px]">Student Name *</label>
                    <input
                      type="text"
                      required
                      value={borrowForm.studentName}
                      onChange={(e) => setBorrowForm({ ...borrowForm, studentName: e.target.value })}
                      placeholder="Rahul Sharma"
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-white focus:outline-none focus:border-ecell-blue"
                    />
                  </div>

                  <div>
                    <label className="text-white/60 block mb-1 uppercase text-[10px]">College Email *</label>
                    <input
                      type="email"
                      required
                      value={borrowForm.studentEmail}
                      onChange={(e) => setBorrowForm({ ...borrowForm, studentEmail: e.target.value })}
                      placeholder="student@jcer.edu.in"
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-white focus:outline-none focus:border-ecell-blue"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-white/60 block mb-1 uppercase text-[10px]">USN *</label>
                    <input
                      type="text"
                      required
                      value={borrowForm.studentUsn}
                      onChange={(e) => setBorrowForm({ ...borrowForm, studentUsn: e.target.value })}
                      placeholder="2JC22CS045"
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-white focus:outline-none focus:border-ecell-blue"
                    />
                  </div>

                  <div>
                    <label className="text-white/60 block mb-1 uppercase text-[10px]">Contact Phone</label>
                    <input
                      type="tel"
                      value={borrowForm.phone}
                      onChange={(e) => setBorrowForm({ ...borrowForm, phone: e.target.value })}
                      placeholder="+91 94812 ..."
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-white focus:outline-none focus:border-ecell-blue"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-white/60 block mb-1 uppercase text-[10px]">Borrow Duration (Days)</label>
                    <input
                      type="number"
                      min="1"
                      max={activeBorrowResource.maxDurationDays}
                      value={borrowForm.durationDays}
                      onChange={(e) => setBorrowForm({ ...borrowForm, durationDays: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-white focus:outline-none focus:border-ecell-blue"
                    />
                  </div>

                  <div>
                    <label className="text-white/60 block mb-1 uppercase text-[10px]">Pickup Date</label>
                    <input
                      type="date"
                      value={borrowForm.requestedDate}
                      onChange={(e) => setBorrowForm({ ...borrowForm, requestedDate: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-white focus:outline-none focus:border-ecell-blue"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-white/60 block mb-1 uppercase text-[10px]">Project Purpose / Justification *</label>
                  <textarea
                    rows="3"
                    required
                    value={borrowForm.purpose}
                    onChange={(e) => setBorrowForm({ ...borrowForm, purpose: e.target.value })}
                    placeholder="Describe how this hardware will be deployed in your project or hackathon prototype..."
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-white focus:outline-none focus:border-ecell-blue"
                  />
                </div>

                <div className="flex items-start gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={borrowForm.agreedToTerms}
                    onChange={(e) => setBorrowForm({ ...borrowForm, agreedToTerms: e.target.checked })}
                    className="mt-1 accent-ecell-blue"
                  />
                  <label htmlFor="terms" className="text-[11px] text-white/70 leading-snug">
                    I agree to exercise professional care, adhere to the return due date, and return all cables and peripherals to {activeBorrowResource.labLocation}.
                  </label>
                </div>

                <div className="pt-3 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveBorrowResource(null)}
                    className="px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-white/70"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={borrowSubmitting}
                    className="px-5 py-2 rounded-xl bg-ecell-blue hover:bg-blue-600 text-white font-semibold transition-all shadow-[0_0_15px_rgba(48,134,248,0.3)] disabled:opacity-50"
                  >
                    {borrowSubmitting ? 'Submitting Slip...' : 'Submit Request'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Tracking & Approval Portal Modal */}
      <AnimatePresence>
        {isTrackingModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-4xl bg-zinc-950 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative my-8"
            >
              <button
                type="button"
                onClick={() => setIsTrackingModalOpen(false)}
                className="absolute top-6 right-6 p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-6">
                <SectionBadge className="mb-2">Custody & Return Log</SectionBadge>
                <h2 className="font-sora text-2xl font-bold uppercase text-white">
                  Resource Request Tracking & Desk
                </h2>
                <p className="text-xs font-mono text-ecell-gray/70 mt-1">
                  Live custody tracking, approval status, and return confirmations across JCER labs.
                </p>
              </div>

              {/* Status Tabs */}
              <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-3 font-mono text-xs">
                {['all', 'Pending Approval', 'Approved / Ready for Pickup', 'Active / In Use', 'Returned'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setTrackingTab(st)}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      trackingTab === st
                        ? 'bg-ecell-blue text-white shadow-sm'
                        : 'text-white/60 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {st === 'all' ? 'All Requests' : st}
                  </button>
                ))}
              </div>

              {requests.length === 0 ? (
                <div className="py-12 text-center text-xs font-mono text-white/40">
                  No borrow requests recorded in system.
                </div>
              ) : (
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                  {requests
                    .filter((r) => trackingTab === 'all' || r.status === trackingTab)
                    .map((req) => (
                      <div
                        key={req.id}
                        className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3 font-mono text-xs"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                          <div>
                            <span className="text-[10px] text-white/40 block">
                              Request ID: {req.id}
                            </span>
                            <h4 className="font-sora text-base font-bold text-white mt-0.5">
                              {req.resourceName}
                            </h4>
                            <span className="text-ecell-light text-[11px]">
                              Borrower: {req.studentName} ({req.studentUsn}) • {req.department}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2.5 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wider ${
                                req.status === 'Active / In Use'
                                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/30'
                                  : req.status === 'Approved / Ready for Pickup'
                                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                                  : req.status === 'Returned'
                                  ? 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                                  : 'bg-amber-950 text-amber-300 border border-amber-500/30'
                              }`}
                            >
                              {req.status}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5 text-[11px] text-white/70">
                          <div>
                            <span className="text-white/40 block text-[10px]">Purpose</span>
                            {req.purpose}
                          </div>
                          <div>
                            <span className="text-white/40 block text-[10px]">Timeline</span>
                            Pickup: {req.requestedDate} • Due Date: <span className="text-white font-semibold">{req.returnDueDate}</span>
                          </div>
                        </div>

                        {req.notes && (
                          <div className="text-[10px] text-white/50 italic">
                            Lab Desk Notes: {req.notes}
                          </div>
                        )}

                        {/* Lab Manager Actions */}
                        <div className="pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-3 text-[11px]">
                          <span className="text-white/40 text-[10px]">
                            Contact: {req.studentEmail} {req.phone ? `• ${req.phone}` : ''}
                          </span>

                          <div className="flex items-center gap-2">
                            {req.status === 'Pending Approval' && (
                              <>
                                <button
                                  onClick={() => handleUpdateStatus(req.id, 'Approved / Ready for Pickup', 'Approved for collection at designated lab bay.')}
                                  className="px-3 py-1 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-900 transition-colors"
                                >
                                  Approve for Pickup
                                </button>
                                <button
                                  onClick={() => handleUpdateStatus(req.id, 'Rejected', 'Requested duration or allocation conflicting with scheduled class.')}
                                  className="px-3 py-1 rounded-lg bg-rose-950 text-rose-300 border border-rose-500/30 hover:bg-rose-900 transition-colors"
                                >
                                  Reject
                                </button>
                              </>
                            )}

                            {req.status === 'Approved / Ready for Pickup' && (
                              <button
                                onClick={() => handleUpdateStatus(req.id, 'Active / In Use', 'Handed over in working condition with safety briefing.')}
                                className="px-3 py-1 rounded-lg bg-cyan-950 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-900 transition-colors"
                              >
                                Hand Over / Mark Active
                              </button>
                            )}

                            {req.status === 'Active / In Use' && (
                              <button
                                onClick={() => handleUpdateStatus(req.id, 'Returned', 'Returned and verified complete by lab technician.')}
                                className="px-3 py-1 rounded-lg bg-violet-950 text-violet-300 border border-violet-500/30 hover:bg-violet-900 transition-colors"
                              >
                                Confirm Returned to Lab
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Resource Modal */}
      <AnimatePresence>
        {isAddResourceOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-xl bg-zinc-950 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative my-8"
            >
              <button
                type="button"
                onClick={() => setIsAddResourceOpen(false)}
                className="absolute top-6 right-6 p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-6">
                <SectionBadge className="mb-2">Equipment Index</SectionBadge>
                <h2 className="font-sora text-xl font-bold uppercase text-white">
                  List Lab Asset or Hardware
                </h2>
                <p className="text-xs font-mono text-ecell-gray/70 mt-1">
                  Make departmental equipment available for student innovation and hackathons.
                </p>
              </div>

              <form onSubmit={handleAddResourceSubmit} className="space-y-4 font-mono text-xs">
                <div>
                  <label className="text-white/60 block mb-1 uppercase text-[10px]">Equipment Name *</label>
                  <input
                    type="text"
                    required
                    value={newResForm.name}
                    onChange={(e) => setNewResForm({ ...newResForm, name: e.target.value })}
                    placeholder="e.g. Raspberry Pi 4 Model B (8GB)"
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-white focus:outline-none focus:border-ecell-blue"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-white/60 block mb-1 uppercase text-[10px]">Category</label>
                    <select
                      value={newResForm.category}
                      onChange={(e) => setNewResForm({ ...newResForm, category: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-white focus:outline-none focus:border-ecell-blue"
                    >
                      {RESOURCE_CATEGORIES.filter((c) => c !== 'All').map((c) => (
                        <option key={c} value={c} className="bg-black">
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-white/60 block mb-1 uppercase text-[10px]">Lab Location *</label>
                    <input
                      type="text"
                      required
                      value={newResForm.labLocation}
                      onChange={(e) => setNewResForm({ ...newResForm, labLocation: e.target.value })}
                      placeholder="e.g. IoT Lab, Room 302"
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-white focus:outline-none focus:border-ecell-blue"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-white/60 block mb-1 uppercase text-[10px]">Total Quantity</label>
                    <input
                      type="number"
                      min="1"
                      value={newResForm.totalQty}
                      onChange={(e) => setNewResForm({ ...newResForm, totalQty: e.target.value, availableQty: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-white focus:outline-none focus:border-ecell-blue"
                    />
                  </div>

                  <div>
                    <label className="text-white/60 block mb-1 uppercase text-[10px]">Max Loan Duration (Days)</label>
                    <input
                      type="number"
                      min="1"
                      value={newResForm.maxDurationDays}
                      onChange={(e) => setNewResForm({ ...newResForm, maxDurationDays: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-white focus:outline-none focus:border-ecell-blue"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-white/60 block mb-1 uppercase text-[10px]">Specifications / Accessories Included *</label>
                  <textarea
                    rows="3"
                    required
                    value={newResForm.specs}
                    onChange={(e) => setNewResForm({ ...newResForm, specs: e.target.value })}
                    placeholder="List power supply, sensor accessories, probes, or manual..."
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-white focus:outline-none focus:border-ecell-blue"
                  />
                </div>

                <div className="pt-3 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsAddResourceOpen(false)}
                    className="px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-white/70"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-ecell-blue hover:bg-blue-600 text-white font-semibold transition-all shadow-[0_0_15px_rgba(48,134,248,0.3)]"
                  >
                    Save Equipment
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

export default ResourceExchange;
