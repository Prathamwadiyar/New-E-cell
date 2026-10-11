import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Lock,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  AlertTriangle,
  LogOut,
  UserCheck,
  Award,
  Layers,
  ArrowUpRight,
} from 'lucide-react';
import { useDirectoryAuth } from '../../context/DirectoryAuthContext';
import {
  getAllProfilesAdmin,
  updateProfileStatus,
} from '../../services/directoryStorage';
import AdminReviewModal from '../../components/directory/AdminReviewModal';

const AdminDashboard = () => {
  const { isAdmin, logout } = useDirectoryAuth();

  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter state
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' | 'approved' | 'rejected' | 'all'
  const [searchQuery, setSearchQuery] = useState('');

  // Selected profile for review modal
  const [selectedProfile, setSelectedProfile] = useState(null);

  const fetchProfiles = async () => {
    setLoading(true);
    const data = await getAllProfilesAdmin();
    setProfiles(data);
    setLoading(false);
  };

  useEffect(() => {
    if (isAdmin) {
      fetchProfiles();
    }
  }, [isAdmin]);

  // Resolve the updated_at of the profile version currently shown to the admin
  // (from the loaded list, or the open review modal). Passed verbatim to the
  // RPC for optimistic concurrency — never reformatted through Date.
  const resolveReviewedUpdatedAt = (profileId) => {
    const p = profiles.find((x) => x.id === profileId) || selectedProfile;
    return p?.updatedAt;
  };

  // Profile status actions. On failure — including a stale-version concurrency
  // conflict — surface a clear error and refresh the list so the admin reviews
  // the latest version. A failed review is never treated as successful.
  const handleApprove = async (profileId) => {
    try {
      await updateProfileStatus(profileId, 'approved', '', resolveReviewedUpdatedAt(profileId));
      fetchProfiles();
    } catch (err) {
      alert(err.message || 'Failed to approve profile.');
      fetchProfiles();
    }
  };

  const handleReject = async (profileId, reason) => {
    try {
      await updateProfileStatus(profileId, 'rejected', reason, resolveReviewedUpdatedAt(profileId));
      fetchProfiles();
    } catch (err) {
      alert(err.message || 'Failed to reject profile.');
      fetchProfiles();
    }
  };

  const handleSuspend = async (profileId) => {
    try {
      await updateProfileStatus(
        profileId,
        'rejected',
        'Profile suspended by administrator.',
        resolveReviewedUpdatedAt(profileId)
      );
      fetchProfiles();
    } catch (err) {
      alert(err.message || 'Failed to suspend profile.');
      fetchProfiles();
    }
  };

  // Metrics
  const stats = useMemo(() => {
    const total = profiles.length;
    const pending = profiles.filter((p) => p.status === 'pending_review').length;
    const approved = profiles.filter((p) => p.status === 'approved').length;
    const totalHonors = profiles.reduce((sum, p) => sum + (p.achievements?.length || 0), 0);
    return { total, pending, approved, totalHonors };
  }, [profiles]);

  // Filtered List
  const filteredProfiles = useMemo(() => {
    return profiles.filter((p) => {
      // Tab filter
      if (activeTab === 'pending' && p.status !== 'pending_review') return false;
      if (activeTab === 'approved' && p.status !== 'approved') return false;
      if (activeTab === 'rejected' && p.status !== 'rejected') return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const nameMatch = p.fullName?.toLowerCase().includes(q);
        const usnMatch = p.usn?.toLowerCase().includes(q);
        const deptMatch = p.department?.toLowerCase().includes(q);
        if (!nameMatch && !usnMatch && !deptMatch) return false;
      }

      return true;
    });
  }, [profiles, activeTab, searchQuery]);

  // ACCESS GUARD — admin access is enforced by the database (user_roles), not
  // a frontend passcode. Non-admins see a denial screen with a sign-in link.
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-transparent text-white pt-28 pb-20 md:pt-36 flex items-center justify-center px-6">
        <div className="w-full max-w-md p-8 rounded-3xl bg-ecell-bg2 border border-white/10 shadow-2xl text-center space-y-6">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
            <ShieldCheck className="w-6 h-6" />
          </div>

          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-rose-400 font-semibold block mb-1">
              Restricted
            </span>
            <h1 className="font-sora text-2xl font-bold uppercase text-white">
              Administrator Access Required
            </h1>
            <p className="text-xs text-ecell-gray/70 font-mono mt-1 leading-relaxed">
              This area is limited to authorized JCER administrators. Sign in with an
              authorized administrator account to review student profiles.
            </p>
          </div>

          <Link
            to="/dashboard/login"
            className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-ecell-blue hover:bg-blue-600 text-white font-semibold text-xs font-mono uppercase tracking-wider transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  // ADMIN DASHBOARD MAIN
  return (
    <div className="min-h-screen bg-transparent text-white pt-28 pb-24 md:pt-36">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08] mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs uppercase tracking-widest text-yellow-400 font-semibold">
                JCER Verification & Review Board
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-ping" />
            </div>
            <h1 className="font-sora text-2xl sm:text-4xl font-extrabold uppercase tracking-tight text-white mt-1">
              Directory Administration
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/directory"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-mono text-white/80 border border-white/10 transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              View Public Directory
            </Link>

            <button
              onClick={logout}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-xs font-mono text-rose-300 border border-rose-500/30 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        </div>

        {/* Live Metrics Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
            <p className="text-xs font-mono uppercase tracking-wider text-ecell-gray/60 mb-1">
              Pending Reviews
            </p>
            <div className="font-sora text-3xl font-bold text-amber-400 flex items-baseline gap-1.5">
              {stats.pending}
              <span className="text-xs font-normal text-white/50">Submissions</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
            <p className="text-xs font-mono uppercase tracking-wider text-ecell-gray/60 mb-1">
              Approved Achievers
            </p>
            <div className="font-sora text-3xl font-bold text-emerald-400 flex items-baseline gap-1.5">
              {stats.approved}
              <span className="text-xs font-normal text-white/50">Live</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
            <p className="text-xs font-mono uppercase tracking-wider text-ecell-gray/60 mb-1">
              Total Registrations
            </p>
            <div className="font-sora text-3xl font-bold text-white flex items-baseline gap-1.5">
              {stats.total}
              <span className="text-xs font-normal text-white/50">Students</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
            <p className="text-xs font-mono uppercase tracking-wider text-ecell-gray/60 mb-1">
              Documented Honors
            </p>
            <div className="font-sora text-3xl font-bold text-ecell-glow flex items-baseline gap-1.5">
              {stats.totalHonors}
              <span className="text-xs font-normal text-white/50">Awards</span>
            </div>
          </div>
        </div>

        {/* Tab Selection & Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
          
          {/* Tabs */}
          <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
            {[
              { id: 'pending', label: 'Pending Review', count: stats.pending, alert: stats.pending > 0 },
              { id: 'approved', label: 'Approved & Live', count: stats.approved },
              { id: 'rejected', label: 'Rejected / Changes Req.' },
              { id: 'all', label: 'All Registrations', count: stats.total },
            ].map(({ id, label, count, alert }) => {
              const isActive = activeTab === id;
              return (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono transition-all ${
                    isActive
                      ? 'bg-ecell-blue text-white font-semibold shadow-[0_0_15px_rgba(48,134,248,0.3)]'
                      : 'text-ecell-gray/70 hover:text-white hover:bg-white/[0.03]'
                  }`}
                >
                  <span>{label}</span>
                  {count !== undefined && (
                    <span className={`px-1.5 py-0.2 rounded text-[10px] ${
                      alert ? 'bg-amber-400 text-black font-bold' : isActive ? 'bg-black/30' : 'bg-white/10'
                    }`}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[260px]">
            <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by name, USN, dept..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-ecell-blue"
            />
          </div>

        </div>

        {/* Submissions Table / Cards */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-8 h-8 border-2 border-ecell-blue border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs font-mono text-ecell-gray/60 uppercase">Loading Records...</p>
          </div>
        ) : filteredProfiles.length > 0 ? (
          <div className="space-y-3">
            {filteredProfiles.map((p) => {
              const achCount = p.achievements?.length || 0;
              const isEligible = achCount >= 3;

              return (
                <div
                  key={p.id}
                  className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-white/15 flex flex-col lg:flex-row lg:items-center justify-between gap-4 transition-all"
                >
                  {/* Left: Info */}
                  <div className="flex items-start sm:items-center gap-4">
                    <img
                      src={
                        p.avatarUrl ||
                        `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80`
                      }
                      alt={p.fullName}
                      className="w-14 h-14 rounded-xl object-cover border border-white/10 shrink-0"
                    />

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-sora text-base font-bold text-white">
                          {p.fullName}
                        </h3>
                        {p.usn && (
                          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white/[0.05] text-white/70">
                            {p.usn}
                          </span>
                        )}
                        <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded ${
                          p.status === 'approved'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/20'
                            : p.status === 'pending_review'
                            ? 'bg-amber-950 text-amber-400 border border-amber-500/20'
                            : 'bg-rose-950 text-rose-400 border border-rose-500/20'
                        }`}>
                          {p.status.replace('_', ' ')}
                        </span>
                      </div>

                      <p className="text-xs font-mono text-ecell-gray/70">
                        {p.department} • {p.academicYear}
                      </p>

                      <div className="flex items-center gap-2 text-xs font-mono text-ecell-light">
                        <Award className="w-3.5 h-3.5 text-ecell-blue" />
                        <span>{achCount} Achievements</span>
                        {!isEligible && (
                          <span className="text-amber-400 text-[10px]">
                            (Under 3 criteria)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex flex-wrap items-center gap-2 pt-2 lg:pt-0 border-t lg:border-t-0 border-white/5">
                    <button
                      onClick={() => setSelectedProfile(p)}
                      className="px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/10 text-xs font-mono text-white border border-white/10 transition-colors flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5 text-ecell-glow" />
                      Inspect & Review
                    </button>

                    {p.status === 'pending_review' && (
                      <button
                        onClick={() => handleApprove(p.id)}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-semibold transition-colors flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Quick Approve
                      </button>
                    )}

                    {p.status === 'approved' && (
                      <Link
                        to={`/directory/${p.slug || p.id}`}
                        target="_blank"
                        className="px-3 py-2 rounded-xl bg-transparent hover:bg-white/[0.05] text-xs font-mono text-ecell-light hover:text-white transition-colors flex items-center gap-1"
                      >
                        Live Link <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-20 text-center rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-2">
            <ShieldCheck className="w-10 h-10 text-white/20 mx-auto" />
            <h3 className="font-sora text-sm font-bold text-white">
              No submissions found in this category
            </h3>
            <p className="text-xs font-mono text-ecell-gray/60">
              Check other tabs or loosen your search filter.
            </p>
          </div>
        )}

      </div>

      {/* Review Modal */}
      <AdminReviewModal
        isOpen={Boolean(selectedProfile)}
        onClose={() => setSelectedProfile(null)}
        profile={selectedProfile}
        onApprove={handleApprove}
        onReject={handleReject}
        onSuspend={handleSuspend}
      />

    </div>
  );
};

export default AdminDashboard;
