const PROJECTS_STORAGE_KEY = 'jcer_showcase_projects_v1';
const COLLAB_REQUESTS_KEY = 'jcer_project_collab_requests_v1';
const LIKES_STORAGE_KEY = 'jcer_project_likes_v1';

export const PROJECT_STAGES = [
  'All',
  'Idea',
  'Prototype',
  'In Development',
  'Beta Testing',
  'Production',
];

export const INITIAL_PROJECTS = [
  {
    id: 'proj-agrisense-mesh',
    title: 'AgriSense Mesh',
    tagline: 'Ultra-low-power LoRa environmental telemetry for sugarcane farmers',
    description:
      'A decentralized wireless sensor network engineered for rural Belagavi agricultural zones. Measures soil moisture, ambient humidity, and nitrogen levels every 30 minutes, forwarding metrics via sub-GHz LoRa mesh up to 12 km without cellular dependency.',
    department: 'Electronics & Communication',
    progressStage: 'Beta Testing',
    progressPercent: 85,
    techStack: ['ESP32', 'LoRaWAN', 'FreeRTOS', 'FastAPI', 'React', 'C++'],
    githubUrl: 'https://github.com/jcer-ecell/agrisense-mesh',
    demoUrl: 'https://agrisense.jcer.edu.in',
    ownerName: 'Rohan Deshmukh',
    ownerEmail: 'rohan.deshmukh@jcer.edu.in',
    ownerRole: 'Hardware & IoT Innovator',
    teamMembers: [
      { name: 'Rohan Deshmukh', role: 'Hardware & Embedded Firmware' },
      { name: 'Kavya Patil', role: 'Cloud Dashboard & Ingestion' },
    ],
    openRoles: ['Mobile App Dev (React Native)', 'Data Pipeline Engineer'],
    lookingForTeammates: true,
    submittedAt: '2026-02-10T11:00:00.000Z',
    likesCount: 38,
  },
  {
    id: 'proj-kannadamed-ai',
    title: 'KannadaMed AI',
    tagline: 'Bilingual medical consultation diagnostic assistant for rural Karnataka PHCs',
    description:
      'Fine-tuned transformer models running on edge devices that convert colloquial North Karnataka Kannada patient complaints into standardized medical clinical summaries and ICD-10 diagnostic classifications.',
    department: 'Information Science & Engineering',
    progressStage: 'In Development',
    progressPercent: 65,
    techStack: ['Python', 'PyTorch', 'Transformers', 'FastAPI', 'Tailwind CSS', 'Docker'],
    githubUrl: 'https://github.com/jcer-ecell/kannadamed-ai',
    demoUrl: '',
    ownerName: 'Ananya Kulkarni',
    ownerEmail: 'ananya.kulkarni@jcer.edu.in',
    ownerRole: 'AI/ML Researcher',
    teamMembers: [
      { name: 'Ananya Kulkarni', role: 'NLP Model Architect & Fine-Tuning' },
      { name: 'Pooja Naik', role: 'Medical Dataset Annotation & Evaluation' },
    ],
    openRoles: ['Full-Stack React Engineer', 'Cloud Infra / DevOps'],
    lookingForTeammates: true,
    submittedAt: '2026-02-14T14:30:00.000Z',
    likesCount: 52,
  },
  {
    id: 'proj-campuspulse-vtu',
    title: 'CampusPulse VTU',
    tagline: 'High-speed institutional research hub and academic innovation portal',
    description:
      'Serving 4,000+ engineering students across Belagavi region with past VTU question paper breakdown, real-time lab code environments, and verified student notes indexed with vector semantic search.',
    department: 'Computer Science & Engineering',
    progressStage: 'Production',
    progressPercent: 95,
    techStack: ['Next.js', 'PostgreSQL', 'Tailwind CSS', 'TypeScript', 'Node.js', 'Redis'],
    githubUrl: 'https://github.com/jcer-ecell/campuspulse-vtu',
    demoUrl: 'https://campuspulse.jcer.edu.in',
    ownerName: 'Chinmay Joshi',
    ownerEmail: 'chinmay.joshi@jcer.edu.in',
    ownerRole: 'Lead Web Architect',
    teamMembers: [
      { name: 'Chinmay Joshi', role: 'Full-Stack Architecture' },
      { name: 'Vikram Shinde', role: 'Database & Redis Caching' },
    ],
    openRoles: ['UI/UX Product Designer'],
    lookingForTeammates: true,
    submittedAt: '2026-02-01T09:00:00.000Z',
    likesCount: 67,
  },
  {
    id: 'proj-aerorig-telemetry',
    title: 'AeroRig Baja Telemetry',
    tagline: 'Real-time CAN bus chassis telemetry and suspension dynamics logger',
    description:
      'Telemetry DAQ board engineered for Team JCER Motorsports BAJA all-terrain buggy. Captures wheel speed, suspension travel, brake temperature, and engine RPM at 100 Hz with wireless trackside telemetry transmission.',
    department: 'Mechanical Engineering',
    progressStage: 'Prototype',
    progressPercent: 50,
    techStack: ['STM32', 'CAN Bus', 'Python', 'SolidWorks', 'Grafana', 'C++'],
    githubUrl: 'https://github.com/jcer-ecell/aerorig-telemetry',
    demoUrl: '',
    ownerName: 'Karthik Hegde',
    ownerEmail: 'karthik.hegde@jcer.edu.in',
    ownerRole: 'Motorsports Captain & CAD Lead',
    teamMembers: [
      { name: 'Karthik Hegde', role: 'Chassis & Sensor Integration' },
      { name: 'Sagar More', role: 'DAQ Circuit & CAN Bus Wiring' },
    ],
    openRoles: ['Embedded Firmware Dev', 'CAD Modeler'],
    lookingForTeammates: true,
    submittedAt: '2026-02-18T16:00:00.000Z',
    likesCount: 29,
  },
  {
    id: 'proj-civicvoice-belagavi',
    title: 'CivicVoice Belagavi',
    tagline: 'Crowdsourced municipal grievance reporting and automated priority clustering',
    description:
      'Enables Belagavi citizens to submit geotagged photos of road potholes, drainage overflow, and streetlight outages. Automatically clusters duplicate incidents and computes severity scores for city corporator dashboard.',
    department: 'Artificial Intelligence & Data Science',
    progressStage: 'In Development',
    progressPercent: 60,
    techStack: ['React', 'Firebase', 'GeoJSON', 'FastAPI', 'Tailwind CSS'],
    githubUrl: 'https://github.com/jcer-ecell/civicvoice',
    demoUrl: '',
    ownerName: 'Sneha Patil',
    ownerEmail: 'sneha.patil@jcer.edu.in',
    ownerRole: 'UI/UX Architect & Product Strategist',
    teamMembers: [
      { name: 'Sneha Patil', role: 'Product Design & Frontend' },
      { name: 'Darshan K', role: 'GeoJSON & Spatial Indexing' },
    ],
    openRoles: ['Backend API Specialist', 'QA & Field Tester'],
    lookingForTeammates: true,
    submittedAt: '2026-02-24T12:15:00.000Z',
    likesCount: 41,
  },
];

const getStoredProjects = () => {
  try {
    const raw = localStorage.getItem(PROJECTS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(INITIAL_PROJECTS));
      return INITIAL_PROJECTS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(INITIAL_PROJECTS));
      return INITIAL_PROJECTS;
    }
    return parsed;
  } catch (e) {
    console.warn('Projects LocalStorage read error:', e);
    return INITIAL_PROJECTS;
  }
};

const setStoredProjects = (list) => {
  try {
    localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.warn('Projects LocalStorage write error:', e);
  }
};

export const getProjects = async () => {
  return getStoredProjects();
};

export const saveProject = async (projectData) => {
  const current = getStoredProjects();
  const newProj = {
    ...projectData,
    id: projectData.id || 'proj-' + Date.now().toString(36),
    submittedAt: projectData.submittedAt || new Date().toISOString(),
    likesCount: projectData.likesCount || 0,
    progressPercent: Number(projectData.progressPercent) || 50,
  };
  const updated = [newProj, ...current.filter((p) => p.id !== newProj.id)];
  setStoredProjects(updated);
  return newProj;
};

// Collaboration Requests Management
const getStoredRequests = () => {
  try {
    const raw = localStorage.getItem(COLLAB_REQUESTS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
};

const setStoredRequests = (list) => {
  try {
    localStorage.setItem(COLLAB_REQUESTS_KEY, JSON.stringify(list));
  } catch (e) {
    console.warn('Collab requests write error:', e);
  }
};

export const getCollaborationRequests = async (projectId = null) => {
  const all = getStoredRequests();
  if (projectId) {
    return all.filter((r) => r.projectId === projectId);
  }
  return all;
};

export const requestCollaboration = async (reqData) => {
  const all = getStoredRequests();
  const newReq = {
    ...reqData,
    id: 'collab-' + Date.now().toString(36),
    status: 'pending', // 'pending' | 'accepted' | 'declined'
    submittedAt: new Date().toISOString(),
  };
  const updated = [newReq, ...all];
  setStoredRequests(updated);
  return newReq;
};

export const updateCollaborationRequestStatus = async (requestId, newStatus) => {
  const all = getStoredRequests();
  const idx = all.findIndex((r) => r.id === requestId);
  if (idx >= 0) {
    all[idx].status = newStatus;
    setStoredRequests(all);
    return all[idx];
  }
  return null;
};

// Project Upvotes / Likes
export const getLikedProjectIds = () => {
  try {
    const raw = localStorage.getItem(LIKES_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const toggleLikeProject = async (projectId) => {
  const liked = getLikedProjectIds();
  const allProjects = getStoredProjects();
  const pIdx = allProjects.findIndex((p) => p.id === projectId);
  if (pIdx < 0) return { liked: false, count: 0 };

  let isNowLiked = false;
  let newLikedList = [];
  if (liked.includes(projectId)) {
    newLikedList = liked.filter((id) => id !== projectId);
    allProjects[pIdx].likesCount = Math.max(0, (allProjects[pIdx].likesCount || 1) - 1);
    isNowLiked = false;
  } else {
    newLikedList = [...liked, projectId];
    allProjects[pIdx].likesCount = (allProjects[pIdx].likesCount || 0) + 1;
    isNowLiked = true;
  }

  localStorage.setItem(LIKES_STORAGE_KEY, JSON.stringify(newLikedList));
  setStoredProjects(allProjects);
  return { liked: isNowLiked, count: allProjects[pIdx].likesCount };
};
