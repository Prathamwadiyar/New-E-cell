import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Code2,
  Search,
  Filter,
  Users,
  Globe,
  Plus,
  Heart,
  UserPlus,
  Send,
  X,
  Sparkles,
  Layers,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  TrendingUp,
  Inbox,
  Check,
} from 'lucide-react';
import { FaGithub } from 'react-icons/fa6';
import {
  getProjects,
  saveProject,
  requestCollaboration,
  getCollaborationRequests,
  updateCollaborationRequestStatus,
  getLikedProjectIds,
  toggleLikeProject,
  PROJECT_STAGES,
} from '../services/projectsStorage';
import { useDirectoryAuth } from '../context/DirectoryAuthContext';
import SectionBadge from '../components/ui/SectionBadge';

const stageColors = {
  Idea: 'bg-zinc-800 text-zinc-300 border-zinc-700',
  Prototype: 'bg-amber-950/50 text-amber-300 border-amber-500/30',
  'In Development': 'bg-cyan-950/50 text-cyan-300 border-cyan-500/30',
  'Beta Testing': 'bg-violet-950/50 text-violet-300 border-violet-500/30',
  Production: 'bg-emerald-950/50 text-emerald-300 border-emerald-500/30',
};

const ProjectShowcase = () => {
  const { currentUser, studentProfile } = useDirectoryAuth();
  const [projects, setProjects] = useState([]);
  const [likedIds, setLikedIds] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStage, setSelectedStage] = useState('All');
  const [onlyRecruiting, setOnlyRecruiting] = useState(false);

  // Submit Project Modal
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [projectSubmitting, setProjectSubmitting] = useState(false);
  const [projectSuccess, setProjectSuccess] = useState('');
  const [projectError, setProjectError] = useState('');
  const [projectForm, setProjectForm] = useState({
    title: '',
    tagline: '',
    description: '',
    department: 'Computer Science & Engineering',
    progressStage: 'In Development',
    progressPercent: 60,
    techStack: '',
    githubUrl: '',
    demoUrl: '',
    openRoles: '',
    lookingForTeammates: true,
  });

  // Collaboration Request Modal
  const [activeProjectForCollab, setActiveProjectForCollab] = useState(null);
  const [collabSubmitting, setCollabSubmitting] = useState(false);
  const [collabSuccess, setCollabSuccess] = useState('');
  const [collabError, setCollabError] = useState('');
  const [collabForm, setCollabForm] = useState({
    applicantName: '',
    applicantEmail: '',
    applicantUsn: '',
    role: '',
    skills: '',
    message: '',
  });

  // Collab Inbox / Applications Modal
  const [isInboxModalOpen, setIsInboxModalOpen] = useState(false);
  const [collabRequests, setCollabRequests] = useState([]);
  const [inboxLoading, setInboxLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const data = await getProjects();
    setProjects(data);
    setLikedIds(getLikedProjectIds());
    setLoading(false);
  };

  useEffect(() => {
    loadData();
    document.title = 'Project Showcase & Collaborations — JCER E-Cell';
    return () => {
      document.title = 'E-Cell | Entrepreneurship Cell';
    };
  }, []);

  // Autofill collab form when user is authenticated
  useEffect(() => {
    if (currentUser || studentProfile) {
      setCollabForm((prev) => ({
        ...prev,
        applicantName: studentProfile?.fullName || currentUser?.displayName || '',
        applicantEmail: studentProfile?.email || currentUser?.email || '',
        applicantUsn: studentProfile?.usn || '',
        skills: studentProfile?.skills?.join(', ') || '',
      }));
    }
  }, [currentUser, studentProfile]);

  const handleLike = async (projectId) => {
    const res = await toggleLikeProject(projectId);
    setLikedIds(getLikedProjectIds());
    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, likesCount: res.count } : p))
    );
  };

  const handleOpenCollabModal = (project) => {
    setActiveProjectForCollab(project);
    setCollabSuccess('');
    setCollabError('');
    if (project.openRoles && project.openRoles.length > 0) {
      setCollabForm((prev) => ({ ...prev, role: project.openRoles[0] }));
    }
  };

  const handleSubmitCollabRequest = async (e) => {
    e.preventDefault();
    setCollabError('');
    setCollabSuccess('');
    if (!collabForm.applicantName || !collabForm.applicantEmail || !collabForm.role || !collabForm.message) {
      setCollabError('Please fill in your name, email, role, and message.');
      return;
    }

    setCollabSubmitting(true);
    try {
      await requestCollaboration({
        projectId: activeProjectForCollab.id,
        projectTitle: activeProjectForCollab.title,
        projectOwnerEmail: activeProjectForCollab.ownerEmail,
        ...collabForm,
      });
      setCollabSuccess('Collaboration application transmitted to project lead!');
      setTimeout(() => {
        setActiveProjectForCollab(null);
        setCollabSuccess('');
      }, 1400);
    } catch (err) {
      setCollabError(err.message || 'Failed to submit request.');
    } finally {
      setCollabSubmitting(false);
    }
  };

  const handleOpenInbox = async () => {
    setIsInboxModalOpen(true);
    setInboxLoading(true);
    const reqs = await getCollaborationRequests();
    setCollabRequests(reqs);
    setInboxLoading(false);
  };

  const handleUpdateStatus = async (reqId, status) => {
    await updateCollaborationRequestStatus(reqId, status);
    const reqs = await getCollaborationRequests();
    setCollabRequests(reqs);
  };

  const handleSubmitProject = async (e) => {
    e.preventDefault();
    setProjectError('');
    setProjectSuccess('');
    if (!projectForm.title || !projectForm.tagline || !projectForm.description) {
      setProjectError('Please complete all core project fields.');
      return;
    }

    setProjectSubmitting(true);
    try {
      const techList = projectForm.techStack
        ? projectForm.techStack.split(',').map((t) => t.trim()).filter(Boolean)
        : ['React', 'Engineering'];

      const rolesList = projectForm.openRoles
        ? projectForm.openRoles.split(',').map((r) => r.trim()).filter(Boolean)
        : [];

      const newProj = {
        ...projectForm,
        techStack: techList,
        openRoles: rolesList,
        ownerName: studentProfile?.fullName || currentUser?.displayName || 'JCER Student Innovator',
        ownerEmail: studentProfile?.email || currentUser?.email || 'student@jcer.edu.in',
        ownerRole: studentProfile?.primaryRole || 'Project Lead',
        teamMembers: [
          {
            name: studentProfile?.fullName || currentUser?.displayName || 'Student Lead',
            role: 'Lead Developer & Architect',
          },
        ],
      };

      await saveProject(newProj);
      setProjectSuccess('Project published to JCER Showcase!');
      setTimeout(() => {
        setIsSubmitModalOpen(false);
        setProjectSuccess('');
      }, 1200);
      loadData();
    } catch (err) {
      setProjectError(err.message || 'Failed to publish project.');
    } finally {
      setProjectSubmitting(false);
    }
  };

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      if (onlyRecruiting && !p.lookingForTeammates) return false;
      if (selectedStage !== 'All' && p.progressStage !== selectedStage) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const tMatch = p.title?.toLowerCase().includes(q);
        const tagMatch = p.tagline?.toLowerCase().includes(q);
        const stackMatch = p.techStack?.some((t) => t.toLowerCase().includes(q));
        const memberMatch = p.teamMembers?.some((m) => m.name?.toLowerCase().includes(q));
        const deptMatch = p.department?.toLowerCase().includes(q);
        if (!tMatch && !tagMatch && !stackMatch && !memberMatch && !deptMatch) return false;
      }
      return true;
    });
  }, [projects, onlyRecruiting, selectedStage, searchQuery]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-transparent text-white pt-24 md:pt-32 pb-24"
    >
      <div className="fixed top-28 left-1/3 w-[550px] h-[320px] bg-ecell-blue/10 blur-[150px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        
        {/* Editorial Header */}
        <div className="mb-12 border-b border-white/10 pb-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <SectionBadge>Engineering Portfolios // Section 03</SectionBadge>
              <h1 className="font-sora text-3xl sm:text-4xl md:text-5xl font-extrabold uppercase tracking-tight text-white leading-none">
                Project Showcase & <span className="text-ecell-light">Collaborations</span>
              </h1>
              <p className="text-sm md:text-base text-ecell-gray/80 font-light leading-relaxed">
                Explore real technical projects, IoT hardware prototypes, and AI systems built by JCER engineers. Discover student teams actively recruiting talent.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={handleOpenInbox}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] text-white/80 hover:text-white text-xs font-mono border border-white/10 transition-all"
              >
                <Inbox className="w-3.5 h-3.5" />
                Collab Requests
              </button>

              <button
                type="button"
                onClick={() => setIsSubmitModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-ecell-blue hover:bg-blue-600 text-white text-xs font-mono font-medium transition-all shadow-[0_0_20px_rgba(48,134,248,0.35)]"
              >
                <Plus className="w-3.5 h-3.5" />
                Showcase Project
              </button>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/5 font-mono text-xs">
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
              <span className="text-white/40 block text-[10px] uppercase">Active Portfolios</span>
              <span className="text-xl font-bold font-sora text-white">{projects.length}</span>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
              <span className="text-white/40 block text-[10px] uppercase">Recruiting Teams</span>
              <span className="text-xl font-bold font-sora text-emerald-400">
                {projects.filter((p) => p.lookingForTeammates).length}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
              <span className="text-white/40 block text-[10px] uppercase">Production Ready</span>
              <span className="text-xl font-bold font-sora text-cyan-400">
                {projects.filter((p) => p.progressStage === 'Production').length}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
              <span className="text-white/40 block text-[10px] uppercase">Open Roles Listed</span>
              <span className="text-xl font-bold font-sora text-ecell-light">
                {projects.reduce((acc, p) => acc + (p.openRoles?.length || 0), 0)}
              </span>
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
                placeholder="Search projects by title, stack (e.g. ESP32, PyTorch), lead name, or department..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-ecell-blue transition-all"
              />
            </div>

            <button
              type="button"
              onClick={() => setOnlyRecruiting(!onlyRecruiting)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono border transition-all ${
                onlyRecruiting
                  ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40 shadow-sm'
                  : 'bg-white/[0.03] text-white/70 border-white/10 hover:border-white/20'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              Recruiting Teammates
            </button>
          </div>

          {/* Stage Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {PROJECT_STAGES.map((stg) => {
              const isSelected = selectedStage === stg;
              return (
                <button
                  key={stg}
                  onClick={() => setSelectedStage(stg)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-all ${
                    isSelected
                      ? 'bg-ecell-blue text-white shadow-sm'
                      : 'bg-white/[0.02] text-white/60 hover:text-white hover:bg-white/[0.05] border border-white/5'
                  }`}
                >
                  {stg}
                </button>
              );
            })}
          </div>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-8 h-8 border-2 border-ecell-blue border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs font-mono text-white/50 uppercase tracking-widest">
              Loading Projects...
            </p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="py-20 text-center p-8 rounded-3xl bg-white/[0.02] border border-white/5 space-y-3">
            <Layers className="w-10 h-10 text-white/20 mx-auto" />
            <h3 className="font-sora text-lg font-bold text-white uppercase">No Projects Match</h3>
            <p className="text-xs font-mono text-white/50 max-w-md mx-auto">
              No matching projects found with current filters. Reset filters or showcase your own engineering project.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredProjects.map((project) => {
              const isLiked = likedIds.includes(project.id);
              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.08] hover:border-ecell-blue/40 p-6 flex flex-col justify-between transition-all duration-300 relative group"
                >
                  <div>
                    {/* Top Row: Stage & Upvotes */}
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <span
                        className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-semibold uppercase tracking-wider border ${
                          stageColors[project.progressStage] || 'bg-white/10 text-white'
                        }`}
                      >
                        {project.progressStage}
                      </span>

                      <div className="flex items-center gap-2">
                        {project.lookingForTeammates && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-mono font-medium bg-emerald-950/60 text-emerald-300 border border-emerald-500/30">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            Open for Collab
                          </span>
                        )}

                        <button
                          type="button"
                          onClick={() => handleLike(project.id)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono transition-all border ${
                            isLiked
                              ? 'bg-rose-950/60 text-rose-300 border-rose-500/40'
                              : 'bg-white/[0.03] text-white/60 hover:text-white border-white/5'
                          }`}
                        >
                          <Heart
                            className={`w-3.5 h-3.5 ${
                              isLiked ? 'text-rose-400 fill-rose-400' : ''
                            }`}
                          />
                          <span>{project.likesCount || 0}</span>
                        </button>
                      </div>
                    </div>

                    {/* Title & Tagline */}
                    <div className="mb-3">
                      <h3 className="font-sora text-xl font-bold text-white group-hover:text-ecell-light transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-xs font-mono text-ecell-gray/80 mt-1 line-clamp-1">
                        {project.tagline}
                      </p>
                      <span className="text-[11px] font-mono text-white/40 block mt-0.5">
                        {project.department}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-[10px] font-mono text-white/50 mb-1">
                        <span>Milestone Progress</span>
                        <span>{project.progressPercent}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-ecell-blue to-cyan-400 rounded-full"
                          style={{ width: `${project.progressPercent}%` }}
                        />
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-ecell-gray/80 font-light leading-relaxed mb-4 line-clamp-3">
                      {project.description}
                    </p>

                    {/* Tech Stack */}
                    {project.techStack && project.techStack.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {project.techStack.map((tech) => (
                          <span
                            key={tech}
                            className="px-2 py-0.5 rounded text-[10px] font-mono text-ecell-light bg-ecell-blue/10 border border-ecell-blue/20"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Open Roles Required */}
                    {project.openRoles && project.openRoles.length > 0 && (
                      <div className="mb-5 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-white/40 block mb-1.5">
                          Seeking Collaborators For:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {project.openRoles.map((role) => (
                            <span
                              key={role}
                              className="px-2 py-0.5 rounded text-[10px] font-mono text-emerald-300 bg-emerald-950/40 border border-emerald-500/20"
                            >
                              + {role}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Team Members */}
                    <div className="mb-5">
                      <span className="text-[10px] font-mono uppercase text-white/40 block mb-1">
                        Core Team
                      </span>
                      <div className="flex flex-wrap gap-2 text-xs font-mono text-white/70">
                        {project.teamMembers?.map((m, idx) => (
                          <span key={idx} className="bg-white/[0.03] px-2 py-1 rounded-lg border border-white/5">
                            {m.name} <span className="text-white/40">({m.role})</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom Actions */}
                  <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.1] text-white/70 hover:text-white border border-white/10 transition-colors"
                          title="View GitHub Repository"
                        >
                          <FaGithub className="w-4 h-4" />
                        </a>
                      )}
                      {project.demoUrl && (
                        <a
                          href={project.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.1] text-white/70 hover:text-white border border-white/10 transition-colors"
                          title="Live Demo"
                        >
                          <Globe className="w-4 h-4" />
                        </a>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleOpenCollabModal(project)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-ecell-blue text-white text-xs font-mono font-medium hover:bg-blue-600 transition-all shadow-[0_0_15px_rgba(48,134,248,0.3)]"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      Request to Join
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

      </div>

      {/* Collaboration Request Modal */}
      <AnimatePresence>
        {activeProjectForCollab && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-zinc-950 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative my-8"
            >
              <button
                type="button"
                onClick={() => setActiveProjectForCollab(null)}
                className="absolute top-6 right-6 p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-6">
                <SectionBadge className="mb-2">Teaming Invite</SectionBadge>
                <h2 className="font-sora text-xl font-bold uppercase text-white">
                  Join {activeProjectForCollab.title}
                </h2>
                <p className="text-xs font-mono text-ecell-gray/70 mt-1">
                  Send your collaboration profile and pitch to {activeProjectForCollab.ownerName}.
                </p>
              </div>

              {collabError && (
                <div className="mb-4 p-3 rounded-xl bg-rose-950/50 border border-rose-500/30 flex items-center gap-2 text-xs font-mono text-rose-300">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{collabError}</span>
                </div>
              )}

              {collabSuccess && (
                <div className="mb-4 p-3 rounded-xl bg-emerald-950/50 border border-emerald-500/30 flex items-center gap-2 text-xs font-mono text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>{collabSuccess}</span>
                </div>
              )}

              <form onSubmit={handleSubmitCollabRequest} className="space-y-4 font-mono text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-white/60 block mb-1 uppercase text-[10px]">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={collabForm.applicantName}
                      onChange={(e) => setCollabForm({ ...collabForm, applicantName: e.target.value })}
                      placeholder="Rahul Sharma"
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-white focus:outline-none focus:border-ecell-blue"
                    />
                  </div>

                  <div>
                    <label className="text-white/60 block mb-1 uppercase text-[10px]">College Email *</label>
                    <input
                      type="email"
                      required
                      value={collabForm.applicantEmail}
                      onChange={(e) => setCollabForm({ ...collabForm, applicantEmail: e.target.value })}
                      placeholder="student@jcer.edu.in"
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-white focus:outline-none focus:border-ecell-blue"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-white/60 block mb-1 uppercase text-[10px]">USN</label>
                    <input
                      type="text"
                      value={collabForm.applicantUsn}
                      onChange={(e) => setCollabForm({ ...collabForm, applicantUsn: e.target.value })}
                      placeholder="2JC22CS..."
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-white focus:outline-none focus:border-ecell-blue"
                    />
                  </div>

                  <div>
                    <label className="text-white/60 block mb-1 uppercase text-[10px]">Role Desired *</label>
                    <input
                      type="text"
                      required
                      value={collabForm.role}
                      onChange={(e) => setCollabForm({ ...collabForm, role: e.target.value })}
                      placeholder="e.g. Backend Developer"
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-white focus:outline-none focus:border-ecell-blue"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-white/60 block mb-1 uppercase text-[10px]">Skills / Links</label>
                  <input
                    type="text"
                    value={collabForm.skills}
                    onChange={(e) => setCollabForm({ ...collabForm, skills: e.target.value })}
                    placeholder="e.g. React, Node.js, github.com/..."
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-white focus:outline-none focus:border-ecell-blue"
                  />
                </div>

                <div>
                  <label className="text-white/60 block mb-1 uppercase text-[10px]">Message / Contribution *</label>
                  <textarea
                    rows="3"
                    required
                    value={collabForm.message}
                    onChange={(e) => setCollabForm({ ...collabForm, message: e.target.value })}
                    placeholder="Describe how you can contribute to this project..."
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-white focus:outline-none focus:border-ecell-blue"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveProjectForCollab(null)}
                    className="px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-white/70"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={collabSubmitting}
                    className="px-5 py-2 rounded-xl bg-ecell-blue hover:bg-blue-600 text-white font-semibold transition-all shadow-[0_0_15px_rgba(48,134,248,0.3)] disabled:opacity-50"
                  >
                    {collabSubmitting ? 'Transmitting...' : 'Send Request'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Collaboration Requests Inbox Modal */}
      <AnimatePresence>
        {isInboxModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-3xl bg-zinc-950 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative my-8"
            >
              <button
                type="button"
                onClick={() => setIsInboxModalOpen(false)}
                className="absolute top-6 right-6 p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-6">
                <SectionBadge className="mb-2">Teaming Portal</SectionBadge>
                <h2 className="font-sora text-2xl font-bold uppercase text-white">
                  Collaboration Requests
                </h2>
                <p className="text-xs font-mono text-ecell-gray/70 mt-1">
                  Review applicant profiles requesting to join student engineering teams.
                </p>
              </div>

              {inboxLoading ? (
                <div className="py-12 text-center text-xs font-mono text-white/50">
                  Loading inquiries...
                </div>
              ) : collabRequests.length === 0 ? (
                <div className="py-12 text-center text-xs font-mono text-white/40 p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                  No collaboration requests submitted yet.
                </div>
              ) : (
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                  {collabRequests.map((req) => (
                    <div
                      key={req.id}
                      className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3 font-mono text-xs"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="text-[10px] text-white/40 block">
                            Target Project: <span className="text-ecell-light font-semibold">{req.projectTitle}</span>
                          </span>
                          <h4 className="font-sora text-base font-bold text-white mt-0.5">
                            {req.applicantName} <span className="text-white/50 text-xs font-mono font-normal">({req.role})</span>
                          </h4>
                          <span className="text-white/50 text-[11px]">{req.applicantEmail} • {req.applicantUsn || 'USN not given'}</span>
                        </div>

                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                            req.status === 'accepted'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                              : req.status === 'declined'
                              ? 'bg-rose-950 text-rose-300 border border-rose-500/30'
                              : 'bg-amber-950 text-amber-300 border border-amber-500/30'
                          }`}
                        >
                          {req.status}
                        </span>
                      </div>

                      <p className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-white/80 leading-relaxed font-light text-[11px]">
                        "{req.message}"
                      </p>

                      {req.skills && (
                        <div className="text-[11px] text-white/60">
                          <span className="text-white/40">Skills: </span>{req.skills}
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[10px] text-white/40">
                        <span>Submitted: {new Date(req.submittedAt).toLocaleDateString()}</span>
                        <div className="flex gap-2">
                          {req.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleUpdateStatus(req.id, 'accepted')}
                                className="px-3 py-1 rounded-lg bg-emerald-950/80 hover:bg-emerald-800 text-emerald-300 border border-emerald-500/30 transition-colors"
                              >
                                Accept & Invite
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(req.id, 'declined')}
                                className="px-3 py-1 rounded-lg bg-rose-950/80 hover:bg-rose-800 text-rose-300 border border-rose-500/30 transition-colors"
                              >
                                Decline
                              </button>
                            </>
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

      {/* Submit New Project Modal */}
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
                <SectionBadge className="mb-2">Project Portfolio</SectionBadge>
                <h2 className="font-sora text-2xl font-bold uppercase text-white">
                  Showcase Your Project
                </h2>
                <p className="text-xs font-mono text-ecell-gray/70 mt-1">
                  List your engineering project on the JCER index and invite student collaborators.
                </p>
              </div>

              {projectError && (
                <div className="mb-4 p-3 rounded-xl bg-rose-950/50 border border-rose-500/30 flex items-center gap-2 text-xs font-mono text-rose-300">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{projectError}</span>
                </div>
              )}

              {projectSuccess && (
                <div className="mb-4 p-3 rounded-xl bg-emerald-950/50 border border-emerald-500/30 flex items-center gap-2 text-xs font-mono text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>{projectSuccess}</span>
                </div>
              )}

              <form onSubmit={handleSubmitProject} className="space-y-4 font-mono text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-white/60 block mb-1 uppercase text-[10px]">Project Title *</label>
                    <input
                      type="text"
                      required
                      value={projectForm.title}
                      onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                      placeholder="e.g. AgriSense Mesh"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white focus:outline-none focus:border-ecell-blue"
                    />
                  </div>

                  <div>
                    <label className="text-white/60 block mb-1 uppercase text-[10px]">Department</label>
                    <select
                      value={projectForm.department}
                      onChange={(e) => setProjectForm({ ...projectForm, department: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white focus:outline-none focus:border-ecell-blue"
                    >
                      <option value="Computer Science & Engineering" className="bg-black">Computer Science & Engineering</option>
                      <option value="Information Science & Engineering" className="bg-black">Information Science & Engineering</option>
                      <option value="Electronics & Communication" className="bg-black">Electronics & Communication</option>
                      <option value="Mechanical Engineering" className="bg-black">Mechanical Engineering</option>
                      <option value="Artificial Intelligence & Data Science" className="bg-black">Artificial Intelligence & Data Science</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-white/60 block mb-1 uppercase text-[10px]">One-Line Tagline *</label>
                  <input
                    type="text"
                    required
                    value={projectForm.tagline}
                    onChange={(e) => setProjectForm({ ...projectForm, tagline: e.target.value })}
                    placeholder="e.g. Ultra-low-power LoRa environmental telemetry for sugarcane farmers"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white focus:outline-none focus:border-ecell-blue"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-white/60 block mb-1 uppercase text-[10px]">Current Stage</label>
                    <select
                      value={projectForm.progressStage}
                      onChange={(e) => setProjectForm({ ...projectForm, progressStage: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white focus:outline-none focus:border-ecell-blue"
                    >
                      <option value="Idea" className="bg-black">Idea</option>
                      <option value="Prototype" className="bg-black">Prototype</option>
                      <option value="In Development" className="bg-black">In Development</option>
                      <option value="Beta Testing" className="bg-black">Beta Testing</option>
                      <option value="Production" className="bg-black">Production</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-white/60 block mb-1 uppercase text-[10px]">Progress Percent ({projectForm.progressPercent}%)</label>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      step="5"
                      value={projectForm.progressPercent}
                      onChange={(e) => setProjectForm({ ...projectForm, progressPercent: e.target.value })}
                      className="w-full mt-2 accent-ecell-blue"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-white/60 block mb-1 uppercase text-[10px]">GitHub URL</label>
                    <input
                      type="url"
                      value={projectForm.githubUrl}
                      onChange={(e) => setProjectForm({ ...projectForm, githubUrl: e.target.value })}
                      placeholder="https://github.com/..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white focus:outline-none focus:border-ecell-blue"
                    />
                  </div>

                  <div>
                    <label className="text-white/60 block mb-1 uppercase text-[10px]">Live Demo URL</label>
                    <input
                      type="url"
                      value={projectForm.demoUrl}
                      onChange={(e) => setProjectForm({ ...projectForm, demoUrl: e.target.value })}
                      placeholder="https://..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white focus:outline-none focus:border-ecell-blue"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-white/60 block mb-1 uppercase text-[10px]">Tech Stack (Comma-Separated)</label>
                  <input
                    type="text"
                    value={projectForm.techStack}
                    onChange={(e) => setProjectForm({ ...projectForm, techStack: e.target.value })}
                    placeholder="e.g. React, ESP32, Python, LoRa, Docker"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white focus:outline-none focus:border-ecell-blue"
                  />
                </div>

                <div>
                  <label className="text-white/60 block mb-1 uppercase text-[10px]">Open Roles Needed (Comma-Separated)</label>
                  <input
                    type="text"
                    value={projectForm.openRoles}
                    onChange={(e) => setProjectForm({ ...projectForm, openRoles: e.target.value })}
                    placeholder="e.g. UI/UX Designer, Mobile App Developer, Embedded C++"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white focus:outline-none focus:border-ecell-blue"
                  />
                </div>

                <div>
                  <label className="text-white/60 block mb-1 uppercase text-[10px]">Project Description *</label>
                  <textarea
                    rows="3"
                    required
                    value={projectForm.description}
                    onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                    placeholder="Problem statement solved, architecture, and current testing milestones..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white focus:outline-none focus:border-ecell-blue"
                  />
                </div>

                <div className="pt-3 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsSubmitModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-white/70"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={projectSubmitting}
                    className="px-6 py-2.5 rounded-xl bg-ecell-blue hover:bg-blue-600 text-white font-semibold transition-all shadow-[0_0_20px_rgba(48,134,248,0.35)] disabled:opacity-50"
                  >
                    {projectSubmitting ? 'Publishing...' : 'Publish Project'}
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

export default ProjectShowcase;
