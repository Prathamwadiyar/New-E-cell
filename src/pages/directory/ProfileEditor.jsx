import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Save,
  Send,
  Eye,
  Plus,
  Trash2,
  Edit2,
  Award,
  Sparkles,
  User,
  Image as ImageIcon,
  Link as LinkIcon,
  CheckCircle2,
  AlertCircle,
  LogOut,
  FileText,
  Clock,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { useDirectoryAuth } from '../../context/DirectoryAuthContext';
import { saveProfile, submitMyProfile, withdrawMyProfile } from '../../services/directoryStorage';
import {
  DEPARTMENTS,
  ACADEMIC_YEARS,
  ACHIEVEMENT_CATEGORIES,
  COMPETITION_LEVELS,
  COLLABORATION_STATUSES,
  PREFERRED_ROLES,
  MIN_QUALIFYING_ACHIEVEMENTS,
  isEligibleForSubmission,
  slugify,
} from '../../services/directoryTypes';
import EligibilityMeter from '../../components/directory/EligibilityMeter';

const ProfileEditor = () => {
  const navigate = useNavigate();
  const { currentUser, studentProfile, setStudentProfile, logout, refreshProfile } = useDirectoryAuth();

  const [activeTab, setActiveTab] = useState('achievements'); // 'achievements' | 'bio' | 'skills' | 'gallery' | 'links'
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Editing state for profile
  const [profile, setProfile] = useState(null);

  // Achievement Modal state
  const [isAchievementModalOpen, setIsAchievementModalOpen] = useState(false);
  const [editingAchievementIndex, setEditingAchievementIndex] = useState(-1);
  const [achievementForm, setAchievementForm] = useState({
    title: '',
    event: '',
    organizer: '',
    category: 'Hackathons',
    level: 'National',
    date: '',
    position: '',
    description: '',
    evidenceUrl: '',
    verificationLink: '',
  });

  // Gallery item form state
  const [galleryInput, setGalleryInput] = useState({ url: '', caption: '', category: 'Event' });

  // Load profile into state
  useEffect(() => {
    if (studentProfile) {
      setProfile(JSON.parse(JSON.stringify(studentProfile)));
    } else if (currentUser) {
      refreshProfile().then((p) => {
        if (p) setProfile(JSON.parse(JSON.stringify(p)));
      });
    }
  }, [studentProfile, currentUser, refreshProfile]);

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 py-32 text-white">
        <div className="max-w-md w-full text-center p-8 rounded-3xl bg-white/[0.02] border border-white/[0.08] space-y-4">
          <User className="w-12 h-12 text-white/30 mx-auto" />
          <h2 className="font-sora text-2xl font-bold text-white uppercase">
            Authentication Required
          </h2>
          <p className="text-xs text-ecell-gray/70 font-mono leading-relaxed">
            Please log in with your student credentials to manage your verified achiever profile.
          </p>
          <div className="pt-2">
            <Link
              to="/dashboard/login"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-ecell-blue text-white text-xs font-mono uppercase tracking-wider font-semibold hover:bg-blue-600 transition-colors"
            >
              Sign In to Continue
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center py-32 text-white">
        <div className="w-8 h-8 border-2 border-ecell-blue border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Handle Basic Field Changes
  const handleFieldChange = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleSocialChange = (key, value) => {
    setProfile((prev) => ({
      ...prev,
      socialLinks: { ...(prev.socialLinks || {}), [key]: value },
    }));
  };

  // Role toggle
  const handleRoleToggle = (role) => {
    setProfile((prev) => {
      const current = prev.preferredRoles || [];
      const updated = current.includes(role)
        ? current.filter((r) => r !== role)
        : [...current, role];
      return { ...prev, preferredRoles: updated };
    });
  };

  // Add/Edit Achievement
  const handleOpenAchievementModal = (index = -1) => {
    if (index >= 0) {
      setEditingAchievementIndex(index);
      setAchievementForm({ ...profile.achievements[index] });
    } else {
      setEditingAchievementIndex(-1);
      setAchievementForm({
        id: 'ach-' + Date.now(),
        title: '',
        event: '',
        organizer: '',
        category: 'Hackathons',
        level: 'National',
        date: '',
        position: '',
        description: '',
        evidenceUrl: '',
        verificationLink: '',
        isVerified: false,
      });
    }
    setIsAchievementModalOpen(true);
  };

  const handleSaveAchievement = (e) => {
    e.preventDefault();
    if (!achievementForm.title || !achievementForm.event) {
      alert('Please fill out the achievement title and competition event.');
      return;
    }

    const currentAch = [...(profile.achievements || [])];
    if (editingAchievementIndex >= 0) {
      currentAch[editingAchievementIndex] = achievementForm;
    } else {
      currentAch.push(achievementForm);
    }

    setProfile((prev) => ({ ...prev, achievements: currentAch }));
    setIsAchievementModalOpen(false);
  };

  const handleDeleteAchievement = (idx) => {
    if (confirm('Are you sure you want to remove this achievement?')) {
      const updated = profile.achievements.filter((_, i) => i !== idx);
      setProfile((prev) => ({ ...prev, achievements: updated }));
    }
  };

  // Add Gallery item
  const handleAddGalleryItem = (e) => {
    e.preventDefault();
    if (!galleryInput.url) return;
    const currentGal = [...(profile.gallery || [])];
    currentGal.push({
      id: 'g-' + Date.now(),
      ...galleryInput,
    });
    setProfile((prev) => ({ ...prev, gallery: currentGal }));
    setGalleryInput({ url: '', caption: '', category: 'Event' });
  };

  const handleDeleteGalleryItem = (idx) => {
    const updated = profile.gallery.filter((_, i) => i !== idx);
    setProfile((prev) => ({ ...prev, gallery: updated }));
  };

  // Save as Draft
  const handleSaveDraft = async () => {
    setSaving(true);
    setSuccessMessage('');
    setErrorMessage('');
    try {
      const updated = await saveProfile(profile);
      setStudentProfile(updated);
      setSuccessMessage('Draft saved successfully!');
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err) {
      setErrorMessage('Failed to save profile changes.');
    } finally {
      setSaving(false);
    }
  };

  // Submit for Admin Verification
  const handleSubmitForReview = async () => {
    const achievements = profile.achievements || [];
    if (!isEligibleForSubmission(achievements)) {
      setErrorMessage(
        `Eligibility criteria not met. You must add at least ${MIN_QUALIFYING_ACHIEVEMENTS} qualifying achievements before submitting.`
      );
      return;
    }

    setSaving(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      // Persist latest content edits. saveProfile() returns the row AFTER the
      // UPDATE, so saved.status reflects any guard-trigger transition: if the
      // profile was 'approved' and public content changed, the DB guard already
      // moved it to 'pending_review'. In that case it is already under review —
      // do NOT call submitMyProfile() again (it only allows draft|rejected).
      const saved = await saveProfile(profile);
      setProfile(saved);
      setStudentProfile(saved);
      if (saved.status === 'pending_review') {
        setSuccessMessage(
          'Your edited profile has been sent for review. It will reappear in the public directory once an administrator re-approves it.'
        );
      } else {
        const updated = await submitMyProfile();
        setProfile(updated);
        setStudentProfile(updated);
        setSuccessMessage('Your profile has been submitted for admin verification! Our team will review your proofs.');
      }
      setTimeout(() => setSuccessMessage(''), 6000);
    } catch (err) {
      setErrorMessage(err.message || 'Error submitting profile.');
    } finally {
      setSaving(false);
    }
  };

  // Withdraw an approved profile from the public directory (approved -> draft).
  const handleWithdraw = async () => {
    if (!confirm('Withdraw your approved profile from the public directory? It will return to draft.')) {
      return;
    }
    setSaving(true);
    setSuccessMessage('');
    setErrorMessage('');
    try {
      const updated = await withdrawMyProfile();
      setProfile(updated);
      setStudentProfile(updated);
      setSuccessMessage('Your profile has been withdrawn and is no longer public.');
      setTimeout(() => setSuccessMessage(''), 6000);
    } catch (err) {
      setErrorMessage(err.message || 'Error withdrawing profile.');
    } finally {
      setSaving(false);
    }
  };

  const eligible = isEligibleForSubmission(profile.achievements || []);

  return (
    <div className="min-h-screen bg-transparent text-white pt-28 pb-32 md:pt-36">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10">
        
        {/* Top Bar: Title & User status */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08] mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs uppercase tracking-widest text-ecell-light">
                Authenticated Student Dashboard
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            </div>
            <h1 className="font-sora text-2xl sm:text-4xl font-extrabold uppercase tracking-tight text-white mt-1">
              Profile & Honors Editor
            </h1>
          </div>

          {/* Quick Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to={`/directory/${profile.slug || profile.id}`}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-mono text-white border border-white/10 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Eye className="w-3.5 h-3.5 text-ecell-glow" />
              Preview Profile
            </Link>

            {profile.status === 'approved' && (
              <button
                onClick={handleWithdraw}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-xs font-mono text-amber-300 border border-amber-500/30 transition-colors"
              >
                <AlertCircle className="w-3.5 h-3.5" />
                Withdraw from Directory
              </button>
            )}

            <button
              onClick={logout}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/[0.02] hover:bg-rose-950/40 text-xs font-mono text-rose-300 border border-white/5 hover:border-rose-500/30 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        </div>

        {/* Eligibility & Status Meter */}
        <div className="mb-8">
          <EligibilityMeter
            achievements={profile.achievements}
            status={profile.status}
            rejectionReason={profile.rejectionReason}
          />
        </div>

        {/* Alerts */}
        {successMessage && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 flex items-center gap-3 text-xs font-mono text-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-rose-950/60 border border-rose-500/40 flex items-center gap-3 text-xs font-mono text-rose-300">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Editor Tabs Navigation */}
        <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] mb-8">
          {[
            { id: 'achievements', label: '1. Achievements & Proofs', icon: Award, count: profile.achievements?.length },
            { id: 'bio', label: '2. Identity & Bio', icon: User },
            { id: 'skills', label: '3. Skills & Teaming', icon: Sparkles },
            { id: 'gallery', label: '4. Gallery Showcase', icon: ImageIcon, count: profile.gallery?.length },
            { id: 'links', label: '5. Social Credentials', icon: LinkIcon },
          ].map(({ id, label, icon: Icon, count }) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono transition-all ${
                  isActive
                    ? 'bg-ecell-blue text-white font-semibold shadow-[0_0_15px_rgba(48,134,248,0.3)]'
                    : 'text-ecell-gray/70 hover:text-white hover:bg-white/[0.03]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{label}</span>
                {count !== undefined && (
                  <span className={`px-1.5 py-0.2 rounded text-[10px] ${isActive ? 'bg-black/30' : 'bg-white/10'}`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* TAB 1: ACHIEVEMENTS MANAGER */}
        {activeTab === 'achievements' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-sora text-xl font-bold text-white uppercase">
                  Qualifying Achievements Record
                </h2>
                <p className="text-xs font-mono text-ecell-gray/70 mt-0.5">
                  Minimum {MIN_QUALIFYING_ACHIEVEMENTS} honors required. Attach certificates or verifiable proof links.
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleOpenAchievementModal(-1)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-ecell-blue hover:bg-blue-600 text-white text-xs font-mono uppercase tracking-wider font-semibold transition-all shadow-[0_0_15px_rgba(48,134,248,0.3)]"
              >
                <Plus className="w-4 h-4" />
                Add Achievement
              </button>
            </div>

            {/* List */}
            {profile.achievements && profile.achievements.length > 0 ? (
              <div className="space-y-3">
                {profile.achievements.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-white/15 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs font-mono text-ecell-light">
                        <span>#{String(idx + 1).padStart(2, '0')}</span>
                        <span>•</span>
                        <span className="text-ecell-glow font-semibold">{item.level} Level</span>
                        <span>•</span>
                        <span>{item.category}</span>
                        <span>•</span>
                        <span>{item.date}</span>
                      </div>
                      <h3 className="font-sora text-base font-bold text-white">
                        {item.title}
                      </h3>
                      <p className="text-xs text-ecell-gray/70 font-mono">
                        {item.event} (Organized by {item.organizer})
                      </p>
                      {item.position && (
                        <span className="inline-block text-[11px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/20">
                          Result: {item.position}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleOpenAchievementModal(idx)}
                        className="p-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] text-white/80 hover:text-white transition-colors"
                        title="Edit Achievement"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteAchievement(idx)}
                        className="p-2 rounded-xl bg-white/[0.03] hover:bg-rose-950/40 text-white/50 hover:text-rose-400 transition-colors"
                        title="Remove Achievement"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-16 text-center rounded-2xl bg-white/[0.02] border border-dashed border-white/10 space-y-3">
                <Award className="w-10 h-10 text-white/20 mx-auto" />
                <p className="text-sm font-mono text-white/60">
                  No achievements added yet.
                </p>
                <button
                  type="button"
                  onClick={() => handleOpenAchievementModal(-1)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-ecell-blue text-xs font-mono text-white transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Your 1st Achievement
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: IDENTITY & BIO */}
        {activeTab === 'bio' && (
          <div className="p-6 md:p-8 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-6">
            <h2 className="font-sora text-xl font-bold text-white uppercase">
              Student Identity & Biography
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-mono uppercase tracking-wider text-ecell-gray/80 block mb-1.5">
                  Full Legal Name
                </label>
                <input
                  type="text"
                  value={profile.fullName || ''}
                  onChange={(e) => handleFieldChange('fullName', e.target.value)}
                  className="w-full px-3.5 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-white text-sm focus:outline-none focus:border-ecell-blue"
                />
              </div>

              <div>
                <label className="text-xs font-mono uppercase tracking-wider text-ecell-gray/80 block mb-1.5">
                  USN / College Registration ID
                </label>
                <input
                  type="text"
                  value={profile.usn || ''}
                  onChange={(e) => handleFieldChange('usn', e.target.value)}
                  placeholder="2JC22CS000"
                  className="w-full px-3.5 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-white text-sm focus:outline-none focus:border-ecell-blue"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-mono uppercase tracking-wider text-ecell-gray/80 block mb-1.5">
                  Engineering Department
                </label>
                <select
                  value={profile.department || DEPARTMENTS[0]}
                  onChange={(e) => handleFieldChange('department', e.target.value)}
                  className="w-full px-3.5 py-3 rounded-xl bg-ecell-bg2 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-ecell-blue"
                >
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept} className="bg-black text-white">
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-mono uppercase tracking-wider text-ecell-gray/80 block mb-1.5">
                  Academic Year
                </label>
                <select
                  value={profile.academicYear || ACADEMIC_YEARS[0]}
                  onChange={(e) => handleFieldChange('academicYear', e.target.value)}
                  className="w-full px-3.5 py-3 rounded-xl bg-ecell-bg2 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-ecell-blue"
                >
                  {ACADEMIC_YEARS.map((yr) => (
                    <option key={yr} value={yr} className="bg-black text-white">
                      {yr}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-ecell-gray/80 block mb-1.5">
                Primary Specialty / Tagline
              </label>
              <input
                type="text"
                value={profile.primaryRole || ''}
                onChange={(e) => handleFieldChange('primaryRole', e.target.value)}
                placeholder="e.g. Full-Stack Architect & AI Researcher"
                className="w-full px-3.5 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-white text-sm focus:outline-none focus:border-ecell-blue"
              />
            </div>

            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-ecell-gray/80 block mb-1.5">
                Portrait Photograph URL
              </label>
              <input
                type="url"
                value={profile.avatarUrl || ''}
                onChange={(e) => handleFieldChange('avatarUrl', e.target.value)}
                placeholder="https://images.unsplash.com/... or direct image link"
                className="w-full px-3.5 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-white text-sm focus:outline-none focus:border-ecell-blue"
              />
            </div>

            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-ecell-gray/80 block mb-1.5">
                Personal Biography & Vision
              </label>
              <textarea
                rows={4}
                value={profile.bio || ''}
                onChange={(e) => handleFieldChange('bio', e.target.value)}
                placeholder="Describe your competitive focus, major projects, research ambitions, and what drives you as an engineer..."
                className="w-full px-3.5 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-white text-sm focus:outline-none focus:border-ecell-blue font-inter"
              />
            </div>
          </div>
        )}

        {/* TAB 3: SKILLS & TEAMING */}
        {activeTab === 'skills' && (
          <div className="p-6 md:p-8 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-6">
            <h2 className="font-sora text-xl font-bold text-white uppercase">
              Skills & Hackathon Teaming
            </h2>

            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-ecell-gray/80 block mb-1.5">
                Technical & Core Skills (comma separated)
              </label>
              <input
                type="text"
                value={(profile.skills || []).join(', ')}
                onChange={(e) => {
                  const arr = e.target.value
                    .split(',')
                    .map((s) => s.trim())
                    .filter(Boolean);
                  handleFieldChange('skills', arr);
                }}
                placeholder="React, PyTorch, Node.js, ROS, SolidWorks"
                className="w-full px-3.5 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-white text-sm focus:outline-none focus:border-ecell-blue font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-ecell-gray/80 block mb-1.5">
                Collaboration Availability
              </label>
              <select
                value={profile.collaborationStatus || COLLABORATION_STATUSES[0]}
                onChange={(e) => handleFieldChange('collaborationStatus', e.target.value)}
                className="w-full px-3.5 py-3 rounded-xl bg-ecell-bg2 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-ecell-blue"
              >
                {COLLABORATION_STATUSES.map((st) => (
                  <option key={st} value={st} className="bg-black text-white">
                    {st}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-ecell-gray/80 block mb-2">
                Preferred Competition & Hackathon Roles
              </label>
              <div className="flex flex-wrap gap-2">
                {PREFERRED_ROLES.map((role) => {
                  const selected = (profile.preferredRoles || []).includes(role);
                  return (
                    <button
                      type="button"
                      key={role}
                      onClick={() => handleRoleToggle(role)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                        selected
                          ? 'bg-ecell-blue text-white border border-ecell-blue'
                          : 'bg-white/[0.02] text-white/60 border border-white/10 hover:text-white'
                      }`}
                    >
                      {role}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: GALLERY */}
        {activeTab === 'gallery' && (
          <div className="p-6 md:p-8 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-6">
            <h2 className="font-sora text-xl font-bold text-white uppercase">
              Competition & Project Gallery
            </h2>

            {/* Add media form */}
            <form onSubmit={handleAddGalleryItem} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-3">
              <span className="text-xs font-mono uppercase text-ecell-light block">
                Add Photo / Screenshot to Gallery
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <input
                  type="url"
                  required
                  placeholder="Image URL (https://...)"
                  value={galleryInput.url}
                  onChange={(e) => setGalleryInput({ ...galleryInput, url: e.target.value })}
                  className="sm:col-span-7 px-3 py-2 rounded-lg bg-black/50 border border-white/10 text-white text-xs font-mono focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Caption / Event name"
                  value={galleryInput.caption}
                  onChange={(e) => setGalleryInput({ ...galleryInput, caption: e.target.value })}
                  className="sm:col-span-3 px-3 py-2 rounded-lg bg-black/50 border border-white/10 text-white text-xs font-mono focus:outline-none"
                />
                <button
                  type="submit"
                  className="sm:col-span-2 px-3 py-2 rounded-lg bg-ecell-blue hover:bg-blue-600 text-white text-xs font-mono uppercase font-semibold transition-colors"
                >
                  Add Media
                </button>
              </div>
            </form>

            {/* List */}
            {profile.gallery && profile.gallery.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {profile.gallery.map((item, idx) => (
                  <div key={item.id || idx} className="relative aspect-[4/3] rounded-xl overflow-hidden border border-white/10 group">
                    <img src={item.url} alt={item.caption} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleDeleteGalleryItem(idx)}
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/70 text-rose-400 hover:bg-rose-900 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    {item.caption && (
                      <div className="absolute bottom-0 inset-x-0 p-2 bg-black/80 text-[11px] font-mono text-white/90 truncate">
                        {item.caption}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs font-mono text-white/40 text-center py-6">
                No gallery images added yet.
              </p>
            )}
          </div>
        )}

        {/* TAB 5: SOCIAL LINKS */}
        {activeTab === 'links' && (
          <div className="p-6 md:p-8 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-4">
            <h2 className="font-sora text-xl font-bold text-white uppercase">
              Professional & Social Links
            </h2>

            {['linkedin', 'github', 'portfolio', 'twitter', 'instagram'].map((key) => (
              <div key={key}>
                <label className="text-xs font-mono uppercase tracking-wider text-ecell-gray/80 block mb-1">
                  {key} URL
                </label>
                <input
                  type="url"
                  value={profile.socialLinks?.[key] || ''}
                  onChange={(e) => handleSocialChange(key, e.target.value)}
                  placeholder={`https://${key}.com/...`}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-ecell-blue"
                />
              </div>
            ))}
          </div>
        )}

        {/* STICKY BOTTOM ACTION BAR */}
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-black/90 backdrop-blur-2xl border-t border-white/10 p-4">
          <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4">
            
            <div className="flex items-center gap-3">
              <span className={`w-2.5 h-2.5 rounded-full ${eligible ? 'bg-emerald-400' : 'bg-amber-400'}`} />
              <span className="text-xs font-mono text-white">
                {eligible ? 'Ready for Verification Submission' : 'Draft Mode (Add 3+ achievements)'}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleSaveDraft}
                disabled={saving}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/10 text-white text-xs font-mono uppercase tracking-wider font-medium border border-white/10 transition-colors"
              >
                <Save className="w-3.5 h-3.5" />
                {saving ? 'Saving...' : 'Save Draft'}
              </button>

              <button
                type="button"
                onClick={handleSubmitForReview}
                disabled={saving || !eligible}
                className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider font-semibold transition-all ${
                  eligible
                    ? 'bg-ecell-blue hover:bg-blue-600 text-white shadow-[0_0_20px_rgba(48,134,248,0.4)]'
                    : 'bg-white/10 text-white/30 cursor-not-allowed'
                }`}
              >
                <Send className="w-3.5 h-3.5" />
                Submit for Verification
              </button>
            </div>

          </div>
        </div>

      </div>

      {/* ACHIEVEMENT ADD / EDIT MODAL */}
      <AnimatePresence>
        {isAchievementModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md">
            <div className="absolute inset-0" onClick={() => setIsAchievementModalOpen(false)} />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl bg-ecell-bg2 border border-white/10 overflow-hidden shadow-2xl z-10"
            >
              <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-black/50">
                <span className="font-mono text-xs uppercase tracking-wider text-ecell-glow font-bold">
                  {editingAchievementIndex >= 0 ? 'Edit Achievement Record' : 'Log New Qualifying Achievement'}
                </span>
                <button
                  onClick={() => setIsAchievementModalOpen(false)}
                  className="text-white/50 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveAchievement} className="p-6 space-y-4 overflow-y-auto">
                <div>
                  <label className="text-xs font-mono uppercase tracking-wider text-ecell-gray/80 block mb-1">
                    Achievement Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={achievementForm.title}
                    onChange={(e) => setAchievementForm({ ...achievementForm, title: e.target.value })}
                    placeholder="e.g. 1st Place & ₹50,000 Cash Prize — Smart India Hackathon"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-ecell-blue"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-mono uppercase tracking-wider text-ecell-gray/80 block mb-1">
                      Event / Competition Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={achievementForm.event}
                      onChange={(e) => setAchievementForm({ ...achievementForm, event: e.target.value })}
                      placeholder="e.g. Smart India Hackathon 2024"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-ecell-blue"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono uppercase tracking-wider text-ecell-gray/80 block mb-1">
                      Organizing Institution *
                    </label>
                    <input
                      type="text"
                      required
                      value={achievementForm.organizer}
                      onChange={(e) => setAchievementForm({ ...achievementForm, organizer: e.target.value })}
                      placeholder="e.g. Ministry of Education & AICTE"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-ecell-blue"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-mono uppercase tracking-wider text-ecell-gray/80 block mb-1">
                      Category
                    </label>
                    <select
                      value={achievementForm.category}
                      onChange={(e) => setAchievementForm({ ...achievementForm, category: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-ecell-bg2 border border-white/10 text-white text-xs font-mono focus:outline-none"
                    >
                      {ACHIEVEMENT_CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-mono uppercase tracking-wider text-ecell-gray/80 block mb-1">
                      Level
                    </label>
                    <select
                      value={achievementForm.level}
                      onChange={(e) => setAchievementForm({ ...achievementForm, level: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-ecell-bg2 border border-white/10 text-white text-xs font-mono focus:outline-none"
                    >
                      {COMPETITION_LEVELS.map((lvl) => (
                        <option key={lvl} value={lvl}>
                          {lvl}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-mono uppercase tracking-wider text-ecell-gray/80 block mb-1">
                      Date / Month
                    </label>
                    <input
                      type="text"
                      value={achievementForm.date}
                      onChange={(e) => setAchievementForm({ ...achievementForm, date: e.target.value })}
                      placeholder="e.g. December 2024"
                      className="w-full px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white text-xs font-mono focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-mono uppercase tracking-wider text-ecell-gray/80 block mb-1">
                    Position / Result
                  </label>
                  <input
                    type="text"
                    value={achievementForm.position}
                    onChange={(e) => setAchievementForm({ ...achievementForm, position: e.target.value })}
                    placeholder="e.g. 1st Place Winner / Gold Medalist / Grand Finalist"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white text-xs font-mono focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono uppercase tracking-wider text-ecell-gray/80 block mb-1">
                    Description & Contribution Narrative
                  </label>
                  <textarea
                    rows={3}
                    value={achievementForm.description}
                    onChange={(e) => setAchievementForm({ ...achievementForm, description: e.target.value })}
                    placeholder="Explain what problem your project solved or your performance in the competition..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white text-xs font-mono focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono uppercase tracking-wider text-ecell-gray/80 block mb-1">
                    Certificate / Evidence Document URL
                  </label>
                  <input
                    type="url"
                    value={achievementForm.evidenceUrl}
                    onChange={(e) => setAchievementForm({ ...achievementForm, evidenceUrl: e.target.value })}
                    placeholder="https://... (Certificate image or drive link)"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white text-xs font-mono focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono uppercase tracking-wider text-ecell-gray/80 block mb-1">
                    External Verification / Project Link
                  </label>
                  <input
                    type="url"
                    value={achievementForm.verificationLink}
                    onChange={(e) => setAchievementForm({ ...achievementForm, verificationLink: e.target.value })}
                    placeholder="https://... (GitHub repo, news article, or official results page)"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white text-xs font-mono focus:outline-none"
                  />
                </div>

                <div className="pt-3 flex justify-end gap-2 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setIsAchievementModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-white/[0.05] text-xs font-mono text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-ecell-blue hover:bg-blue-600 text-white text-xs font-mono uppercase font-semibold transition-colors"
                  >
                    Save Achievement
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default ProfileEditor;
