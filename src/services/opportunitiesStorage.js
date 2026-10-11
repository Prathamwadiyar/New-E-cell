const LOCAL_STORAGE_KEY = 'jcer_opportunities_v1';
const SAVED_STORAGE_KEY = 'jcer_saved_opportunities_v1';

export const OPPORTUNITY_CATEGORIES = [
  'All',
  'Hackathons',
  'Internships',
  'Competitions',
  'Scholarships',
];

export const OPPORTUNITY_MODES = ['All', 'Online / Remote', 'In-Person', 'Hybrid'];

export const INITIAL_OPPORTUNITIES = [
  {
    id: 'opp-sih-2026',
    title: 'Smart India Hackathon (SIH) 2026',
    organizer: 'Ministry of Education & AICTE',
    category: 'Hackathons',
    mode: 'Hybrid',
    location: 'National Nodal Centers (Pan-India)',
    deadline: '2026-04-15',
    prizeOrStipend: '₹1,00,000 per problem statement',
    eligibility: 'All Engineering Students (Teams of 6 with at least 1 female teammate)',
    applyUrl: 'https://sih.gov.in',
    description:
      'The world’s biggest open innovation model. Compete on real problem statements submitted by central ministries, state departments, and premier industries. JCER internal screening conducted via E-Cell.',
    tags: ['AI/ML', 'IoT', 'Disaster Tech', 'Smart Governance', 'Web3'],
    submittedBy: 'JCER E-Cell Technical Council',
    submittedAt: '2026-02-15T10:00:00.000Z',
    isFeatured: true,
  },
  {
    id: 'opp-gsoc-2026',
    title: 'Google Summer of Code (GSoC) 2026',
    organizer: 'Google Open Source Programs Office',
    category: 'Internships',
    mode: 'Online / Remote',
    location: 'Remote',
    deadline: '2026-04-02',
    prizeOrStipend: '$1,500 – $3,000 Stipend (INR ~₹1.25L - ₹2.5L)',
    eligibility: 'Open to university students & open-source beginners aged 18+',
    applyUrl: 'https://summerofcode.withgoogle.com',
    description:
      'Spend 12 to 22 weeks writing production code for global open-source foundations (Linux, Apache, Python, CNCF). Includes dedicated 1-on-1 industry mentorship and competitive stipend.',
    tags: ['Open Source', 'Distributed Systems', 'Python', 'Rust', 'Cloud Native'],
    submittedBy: 'JCER Open Source Circle',
    submittedAt: '2026-02-18T12:00:00.000Z',
    isFeatured: true,
  },
  {
    id: 'opp-vtu-innovation-grant',
    title: 'VTU Student Research & Prototype Grant',
    organizer: 'Visvesvaraya Technological University (VTU Belagavi)',
    category: 'Scholarships',
    mode: 'In-Person',
    location: 'VTU Headquarters, Machhe, Belagavi',
    deadline: '2026-04-30',
    prizeOrStipend: '₹50,000 to ₹1,50,000 Prototype Grant',
    eligibility: 'Pre-final and Final Year B.E./B.Tech project teams in Karnataka',
    applyUrl: 'https://vtu.ac.in',
    description:
      'Grant funding directly awarded to student teams building patented hardware prototypes, agricultural robotics, low-cost medical diagnostics, or clean energy solutions.',
    tags: ['Prototyping', 'Hardware', 'CleanTech', 'Patents', 'Agritech'],
    submittedBy: 'JCER R&D Cell',
    submittedAt: '2026-02-20T09:30:00.000Z',
    isFeatured: true,
  },
  {
    id: 'opp-tata-crucible-2026',
    title: 'Tata Crucible Campus Techathon & Quiz 2026',
    organizer: 'Tata Sons & Tata Group',
    category: 'Competitions',
    mode: 'Hybrid',
    location: 'Bengaluru / Regional Hubs',
    deadline: '2026-05-10',
    prizeOrStipend: '₹2,50,000 Grand Prize + Fast-Track Tata Careers',
    eligibility: 'Enrolled undergraduate engineering & management students',
    applyUrl: 'https://tatacrucible.com',
    description:
      'India’s most prestigious collegiate business and technology challenge. Solve real-world industrial transformation and sustainability prompts set by Tata conglomerate companies.',
    tags: ['Case Study', 'Business Tech', 'AI Strategy', 'Analytics'],
    submittedBy: 'JCER E-Cell',
    submittedAt: '2026-02-22T14:00:00.000Z',
    isFeatured: false,
  },
  {
    id: 'opp-microsoft-imagine-cup',
    title: 'Microsoft Imagine Cup Global 2026',
    organizer: 'Microsoft Student Developer Hub',
    category: 'Competitions',
    mode: 'Online / Remote',
    location: 'Global (Seattle Finale for Top Finalists)',
    deadline: '2026-05-01',
    prizeOrStipend: '$100,000 USD + Mentorship with Satya Nadella',
    eligibility: 'Student founders and builders aged 16+ (teams up to 4)',
    applyUrl: 'https://imaginecup.microsoft.com',
    description:
      'Build startup MVPs harnessing Microsoft Azure AI, OpenAI models, and cloud infrastructure. Compete against student founders globally for global VC exposure and seed capital.',
    tags: ['Generative AI', 'Azure', 'SaaS', 'HealthTech', 'FinTech'],
    submittedBy: 'JCER Tech Club',
    submittedAt: '2026-02-25T11:00:00.000Z',
    isFeatured: true,
  },
  {
    id: 'opp-ktech-prototype-fund',
    title: 'K-Tech Karnataka Startup Seed Voucher',
    organizer: 'Dept. of Electronics, IT/BT, Govt. of Karnataka',
    category: 'Scholarships',
    mode: 'In-Person',
    location: 'Belagavi & Bengaluru Incubation Hubs',
    deadline: '2026-05-25',
    prizeOrStipend: 'Up to ₹20,00,000 Seed Grant',
    eligibility: 'Student startups registered in Karnataka with validated MVP',
    applyUrl: 'https://missionstartup.karnataka.gov.in',
    description:
      'Non-dilutive institutional grant funding for high-impact deeptech and hardware startups registered by engineering graduates and student innovators across Karnataka.',
    tags: ['Startup Grant', 'Govt of Karnataka', 'Incubation', 'DeepTech'],
    submittedBy: 'JCER E-Cell Incubation Desk',
    submittedAt: '2026-03-01T15:00:00.000Z',
    isFeatured: false,
  },
  {
    id: 'opp-isro-internship',
    title: 'ISRO / URSC Student Project Internship',
    organizer: 'U R Rao Satellite Centre (ISRO Bengaluru)',
    category: 'Internships',
    mode: 'In-Person',
    location: 'URSC Campus, Bengaluru',
    deadline: '2026-04-20',
    prizeOrStipend: 'Certificate of Excellence + Direct Scientist Mentorship',
    eligibility: 'B.E. 6th/7th Sem (ECE, CSE, Mech, EEE) with minimum 7.5 CGPA',
    applyUrl: 'https://ursc.gov.in',
    description:
      'Rigorous research internship working alongside ISRO space scientists on satellite telemetry, sensor fusion, FPGA accelerators, and autonomous attitude determination.',
    tags: ['Aerospace', 'Embedded', 'Signal Processing', 'FPGA', 'Robotics'],
    submittedBy: 'JCER Aerospace Interest Group',
    submittedAt: '2026-03-02T16:30:00.000Z',
    isFeatured: true,
  },
  {
    id: 'opp-unstop-code-marathon',
    title: 'Unstop National Code Marathon 2026',
    organizer: 'Unstop & Tech Mahindra',
    category: 'Hackathons',
    mode: 'Online / Remote',
    location: 'Online',
    deadline: '2026-04-10',
    prizeOrStipend: '₹3,00,000 Cash Prizes + Direct Job Interviews',
    eligibility: 'All Engineering & BCA / MCA students in India',
    applyUrl: 'https://unstop.com',
    description:
      'Three-round algorithmic speed run and full-stack application development sprint. Top 50 participants receive direct interview fast-tracks for software development roles.',
    tags: ['Data Structures', 'Full-Stack', 'Competitive Coding', 'Fast-Track'],
    submittedBy: 'JCER Code Club',
    submittedAt: '2026-03-03T10:00:00.000Z',
    isFeatured: false,
  },
];

const getStoredList = () => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_OPPORTUNITIES));
      return INITIAL_OPPORTUNITIES;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_OPPORTUNITIES));
      return INITIAL_OPPORTUNITIES;
    }
    return parsed;
  } catch (e) {
    console.warn('Opportunities LocalStorage read error:', e);
    return INITIAL_OPPORTUNITIES;
  }
};

const setStoredList = (list) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.warn('Opportunities LocalStorage write error:', e);
  }
};

export const getOpportunities = async () => {
  return getStoredList();
};

export const saveOpportunity = async (oppData) => {
  const current = getStoredList();
  const newOpp = {
    ...oppData,
    id: oppData.id || 'opp-' + Date.now().toString(36),
    submittedAt: oppData.submittedAt || new Date().toISOString(),
    isFeatured: oppData.isFeatured || false,
  };
  const updated = [newOpp, ...current.filter((o) => o.id !== newOpp.id)];
  setStoredList(updated);
  return newOpp;
};

export const deleteOpportunity = async (id) => {
  const current = getStoredList();
  const updated = current.filter((o) => o.id !== id);
  setStoredList(updated);
  return true;
};

// Saved / Bookmarked Opportunities
export const getSavedOpportunityIds = () => {
  try {
    const raw = localStorage.getItem(SAVED_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const toggleSaveOpportunity = (id) => {
  const current = getSavedOpportunityIds();
  let updated;
  if (current.includes(id)) {
    updated = current.filter((item) => item !== id);
  } else {
    updated = [...current, id];
  }
  localStorage.setItem(SAVED_STORAGE_KEY, JSON.stringify(updated));
  return updated;
};
