const LOCAL_STORAGE_KEY = 'jcer_achiever_profiles_v1';

// Initial realistic seed profiles representing JCER student achievers
export const INITIAL_SEED_PROFILES = [
  {
    id: 'achiever-chinmay-01',
    slug: 'chinmay-joshi',
    userId: 'seed-user-1',
    fullName: 'Chinmay Joshi',
    email: 'chinmay.joshi@jcer.edu.in',
    collegeEmail: '2jc22cs045@jcer.edu.in',
    usn: '2JC22CS045',
    department: 'Computer Science & Engineering',
    academicYear: '3rd Year',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80',
    bio: 'Full-Stack Developer and Open Source Builder at JCER E-Cell. Building distributed systems, next-gen web platforms, and empowering student builders across Belagavi.',
    primaryRole: 'Full-Stack Architect & Tech Lead',
    skills: ['React', 'Next.js', 'Firebase', 'TypeScript', 'Node.js', 'Tailwind CSS'],
    collaborationStatus: 'Open for Hackathons',
    preferredRoles: ['Frontend Engineer', 'Backend / Cloud', 'Product & Pitch Lead'],
    socialLinks: {
      linkedin: 'https://www.linkedin.com/in/chinmay-joshi-tech',
      github: 'https://github.com/chinmayjoshi-dev',
      portfolio: '',
      twitter: '',
      instagram: '',
    },
    status: 'approved',
    isFeatured: true,
    submittedAt: '2026-02-10T10:00:00.000Z',
    approvedAt: '2026-02-12T14:30:00.000Z',
    updatedAt: '2026-03-01T12:00:00.000Z',
    achievements: [
      {
        id: 'ach-cj-1',
        title: '1st Place & ₹1,00,000 Grand Prize — SIH National Hackathon',
        event: 'Smart India Hackathon 2024',
        organizer: 'Ministry of Education & AICTE',
        category: 'Hackathons',
        level: 'National',
        date: 'December 2024',
        position: 'National Winner (1st Rank)',
        description: 'Engineered an offline-first disaster response coordination dispatch system utilizing mesh wireless routing and local AI summarization.',
        evidenceUrl: 'https://images.unsplash.com/photo-1579389083078-4e7018379f7e?auto=format&fit=crop&w=1200&q=80',
        verificationLink: 'https://sih.gov.in',
        isVerified: true,
      },
      {
        id: 'ach-cj-2',
        title: 'Winner — VTU State Level Web Innovation Sprint',
        event: 'VTU State Tech Olympiad',
        organizer: 'Visvesvaraya Technological University',
        category: 'Technical Competitions',
        level: 'State',
        date: 'October 2024',
        position: '1st Place Winner',
        description: 'Designed and deployed an institutional open research sharing platform for 100+ affiliated colleges with real-time analytics.',
        evidenceUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
        verificationLink: 'https://vtu.ac.in',
        isVerified: true,
      },
      {
        id: 'ach-cj-3',
        title: 'Best Tech Venture Award — E-Cell InnoVenture',
        event: 'JCER InnoVenture Startup Pitch 2024',
        organizer: 'JCER Entrepreneurship Cell',
        category: 'Entrepreneurship & Pitching',
        level: 'College',
        date: 'August 2024',
        position: 'Champion (Gold Trophy)',
        description: 'Pitched an AI-driven automated code review assistant for engineering students, securing seed incubation support.',
        evidenceUrl: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1200&q=80',
        verificationLink: '',
        isVerified: true,
      },
      {
        id: 'ach-cj-4',
        title: 'Finalist — IEEE National Student Project Colloquium',
        event: 'IEEE Student Conclave 2024',
        organizer: 'IEEE Bangalore Section',
        category: 'Research & Publications',
        level: 'National',
        date: 'May 2024',
        position: 'Top 5 National Finalist',
        description: 'Presented a peer-reviewed research poster on low-latency micro-frontend architectures in educational institutions.',
        evidenceUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
        verificationLink: '',
        isVerified: true,
      },
    ],
    gallery: [
      {
        id: 'g-cj-1',
        url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80',
        caption: 'Team JCER at Smart India Hackathon Grand Finale',
        category: 'Hackathon',
      },
      {
        id: 'g-cj-2',
        url: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1200&q=80',
        caption: 'Accepting the Winner Trophy at VTU Innovation Fest',
        category: 'Award Ceremony',
      },
    ],
  },
  {
    id: 'achiever-ananya-02',
    slug: 'ananya-kulkarni',
    userId: 'seed-user-2',
    fullName: 'Ananya Kulkarni',
    email: 'ananya.kulkarni@jcer.edu.in',
    collegeEmail: '2jc21is012@jcer.edu.in',
    usn: '2JC21IS012',
    department: 'Information Science & Engineering',
    academicYear: '4th Year',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
    bio: 'Specializing in NLP and transformer models for low-resource Indian languages. Published researcher and hackathon mentor passionate about ethical AI and healthcare access.',
    primaryRole: 'AI/ML Researcher & NLP Engineer',
    skills: ['Python', 'PyTorch', 'Transformers', 'FastAPI', 'Hugging Face', 'Data Science'],
    collaborationStatus: 'Available for Mentorship',
    preferredRoles: ['AI / ML Specialist', 'Backend / Cloud', 'Product & Pitch Lead'],
    socialLinks: {
      linkedin: 'https://www.linkedin.com/in/ananya-kulkarni-ai',
      github: 'https://github.com/ananyakulkarni',
      portfolio: '',
      twitter: '',
      instagram: '',
    },
    status: 'approved',
    isFeatured: true,
    submittedAt: '2026-01-15T09:30:00.000Z',
    approvedAt: '2026-01-18T11:00:00.000Z',
    updatedAt: '2026-02-20T10:15:00.000Z',
    achievements: [
      {
        id: 'ach-ak-1',
        title: '1st Runner Up — Google Solution Challenge Regional',
        event: 'Google Developer Student Clubs 2024',
        organizer: 'Google Developers India',
        category: 'Hackathons',
        level: 'National',
        date: 'March 2024',
        position: '2nd Place (Regional Finalist)',
        description: 'Trained a real-time vocal biomarker analysis model running on mobile edge devices for early pediatric respiratory anomaly detection.',
        evidenceUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80',
        verificationLink: 'https://developers.google.com/community/gdsc-solution-challenge',
        isVerified: true,
      },
      {
        id: 'ach-ak-2',
        title: 'Best Healthcare AI Solution — BioHack Karnataka',
        event: 'BioHack India Summit',
        organizer: 'Karnataka Innovation Council',
        category: 'Innovation Challenges',
        level: 'State',
        date: 'November 2024',
        position: 'Category Winner (Gold Medal)',
        description: 'Developed an automated Kannada-to-English medical diagnostic translator for primary health centers in rural Belagavi district.',
        evidenceUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80',
        verificationLink: '',
        isVerified: true,
      },
      {
        id: 'ach-ak-3',
        title: '1st Place — State Level Algorithm & Data Olympiad',
        event: 'Karnataka State Intercollegiate Code Fest',
        organizer: 'Karnataka Science & Tech Academy',
        category: 'Technical Competitions',
        level: 'State',
        date: 'September 2024',
        position: 'State Champion (Rank 1)',
        description: 'Outperformed 450+ engineering competitors in competitive algorithmic problem solving, dynamic programming, and graph theory.',
        evidenceUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
        verificationLink: '',
        isVerified: true,
      },
    ],
    gallery: [
      {
        id: 'g-ak-1',
        url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
        caption: 'Presenting research at BioHack Karnataka',
        category: 'Presentation',
      },
    ],
  },
  {
    id: 'achiever-rohan-03',
    slug: 'rohan-deshmukh',
    userId: 'seed-user-3',
    fullName: 'Rohan Deshmukh',
    email: 'rohan.deshmukh@jcer.edu.in',
    collegeEmail: '2jc22ec034@jcer.edu.in',
    usn: '2JC22EC034',
    department: 'Electronics & Communication',
    academicYear: '3rd Year',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    bio: 'Hardware geek building autonomous robotics and ultra-low-power edge nodes. Integrating embedded firmware with custom PCB design.',
    primaryRole: 'Embedded Systems & IoT Innovator',
    skills: ['STM32', 'ESP32', 'C++', 'PCB Design', 'LoRaWAN', 'FreeRTOS'],
    collaborationStatus: 'Seeking Teammates',
    preferredRoles: ['Hardware & IoT', 'Product & Pitch Lead'],
    socialLinks: {
      linkedin: 'https://www.linkedin.com/in/rohan-deshmukh-iot',
      github: 'https://github.com/rohandeshmukh-hw',
      portfolio: '',
      twitter: '',
      instagram: '',
    },
    status: 'approved',
    isFeatured: false,
    submittedAt: '2026-01-20T14:00:00.000Z',
    approvedAt: '2026-01-22T16:00:00.000Z',
    updatedAt: '2026-02-15T11:00:00.000Z',
    achievements: [
      {
        id: 'ach-rd-1',
        title: 'National Winner — TI Innovation Hardware Challenge',
        event: 'Texas Instruments India University Program',
        organizer: 'Texas Instruments & AICTE',
        category: 'Technical Competitions',
        level: 'National',
        date: 'November 2024',
        position: 'National Winner (Top Hardware Project)',
        description: 'Constructed an ultra-low-power LoRa environmental telemetry node that runs 3 years on a single coin-cell battery.',
        evidenceUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
        verificationLink: 'https://ti.com',
        isVerified: true,
      },
      {
        id: 'ach-rd-2',
        title: '1st Place — Autonomous Line-Follower & Maze Bot',
        event: 'Shaastra Intercollegiate Robotics Championship',
        organizer: 'IIT Madras Shaastra',
        category: 'Technical Competitions',
        level: 'National',
        date: 'January 2025',
        position: '1st Place Champions',
        description: 'Built a dual-PID controlled high-speed micro-mouse robot clocking under 14.2s maze resolution time.',
        evidenceUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80',
        verificationLink: '',
        isVerified: true,
      },
      {
        id: 'ach-rd-3',
        title: 'College Patent Filing — Low-Cost Agri Sensor Node',
        event: 'JCER Innovation & Patent Sprint',
        organizer: 'JCER IIC & KSCST',
        category: 'Innovation Challenges',
        level: 'College',
        date: 'October 2024',
        position: 'Patent Applied & Granted College Grant',
        description: 'Granted ₹40,000 prototype funding for field validation in sugarcane farms around Belagavi district.',
        evidenceUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
        verificationLink: '',
        isVerified: true,
      },
    ],
    gallery: [
      {
        id: 'g-rd-1',
        url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1200&q=80',
        caption: 'Testing the custom PCB prototype in the electronics lab',
        category: 'Lab Prototype',
      },
    ],
  },
  {
    id: 'achiever-sneha-04',
    slug: 'sneha-patil',
    userId: 'seed-user-4',
    fullName: 'Sneha Patil',
    email: 'sneha.patil@jcer.edu.in',
    collegeEmail: '2jc23ad028@jcer.edu.in',
    usn: '2JC23AD028',
    department: 'Artificial Intelligence & Data Science',
    academicYear: '2nd Year',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    bio: 'Product Designer and Frontend Developer. Transforming complex algorithmic models into intuitive, tactile, and accessible visual interfaces.',
    primaryRole: 'UI/UX Architect & Product Strategist',
    skills: ['Figma', 'UI / UX', 'React', 'Tailwind CSS', 'Design Systems', 'User Research'],
    collaborationStatus: 'Open for Hackathons',
    preferredRoles: ['UI / UX Designer', 'Frontend Engineer', 'Product & Pitch Lead'],
    socialLinks: {
      linkedin: 'https://www.linkedin.com/in/sneha-patil-design',
      github: 'https://github.com/snehapatil-ui',
      portfolio: '',
      twitter: '',
      instagram: '',
    },
    status: 'approved',
    isFeatured: true,
    submittedAt: '2026-02-01T08:00:00.000Z',
    approvedAt: '2026-02-03T10:00:00.000Z',
    updatedAt: '2026-02-25T14:00:00.000Z',
    achievements: [
      {
        id: 'ach-sp-1',
        title: 'Gold Trophy — All-India Designathon 2024',
        event: 'National Design Fest (NID & IITB)',
        organizer: 'DesignX India Community',
        category: 'Technical Competitions',
        level: 'National',
        date: 'October 2024',
        position: '1st Place Winner (Best Micro-Interaction)',
        description: 'Designed a tactile financial management app for first-generation micro-entrepreneurs in tier-2 cities.',
        evidenceUrl: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=1200&q=80',
        verificationLink: '',
        isVerified: true,
      },
      {
        id: 'ach-sp-2',
        title: 'Winner — Karnataka Startup Summit Pitch & Prototype',
        event: 'K-Tech Karnataka Innovation Summit',
        organizer: 'Government of Karnataka IT/BT',
        category: 'Entrepreneurship & Pitching',
        level: 'State',
        date: 'December 2024',
        position: 'Best UI/UX Prototype Award',
        description: 'Delivered live Figma prototype and product design system for an EV fleet charging coordination hub.',
        evidenceUrl: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=1200&q=80',
        verificationLink: '',
        isVerified: true,
      },
      {
        id: 'ach-sp-3',
        title: '1st Place — JCER Code & Design Sprint 2024',
        event: 'JCER E-Cell Annual Hackathon',
        organizer: 'JCER E-Cell',
        category: 'Hackathons',
        level: 'College',
        date: 'September 2024',
        position: '1st Place Winner',
        description: 'Built a full interactive campus orientation experience in 24 hours with custom 3D campus navigation maps.',
        evidenceUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80',
        verificationLink: '',
        isVerified: true,
      },
    ],
    gallery: [
      {
        id: 'g-sp-1',
        url: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=1200&q=80',
        caption: 'Winning design prototype layout showcased at DesignX',
        category: 'Design Work',
      },
    ],
  },
  {
    id: 'achiever-karthik-05',
    slug: 'karthik-hegde',
    userId: 'seed-user-5',
    fullName: 'Karthik Hegde',
    email: 'karthik.hegde@jcer.edu.in',
    collegeEmail: '2jc21me044@jcer.edu.in',
    usn: '2JC21ME044',
    department: 'Mechanical Engineering',
    academicYear: '4th Year',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
    bio: 'Captain of Team JCER Motorsports. CAD Specialist, CFD simulations lead, and hands-on fabrication mentor driving competitive student racing.',
    primaryRole: 'Motorsports Captain & CAD Specialist',
    skills: ['SolidWorks', 'ANSYS CFD', 'Additive Manufacturing', 'Chassis Design', 'Leadership'],
    collaborationStatus: 'Busy with Projects',
    preferredRoles: ['Product & Pitch Lead', 'Hardware & IoT'],
    socialLinks: {
      linkedin: 'https://www.linkedin.com/in/karthik-hegde-mech',
      github: '',
      portfolio: '',
      twitter: '',
      instagram: '',
    },
    status: 'approved',
    isFeatured: false,
    submittedAt: '2026-01-25T11:00:00.000Z',
    approvedAt: '2026-01-27T15:00:00.000Z',
    updatedAt: '2026-02-18T16:00:00.000Z',
    achievements: [
      {
        id: 'ach-kh-1',
        title: 'National 1st Place — SAE India Baja Design Presentation',
        event: 'BAJA SAE India 2024',
        organizer: 'Society of Automotive Engineers India',
        category: 'Technical Competitions',
        level: 'National',
        date: 'January 2024',
        position: 'National Winner (Design Evaluation)',
        description: 'Led technical presentation on tubular spaceframe torsional rigidity optimization reducing weight by 18%.',
        evidenceUrl: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80',
        verificationLink: 'https://bajasaeindia.org',
        isVerified: true,
      },
      {
        id: 'ach-kh-2',
        title: 'Gold Medal — VTU Intercollegiate CAD Marathon',
        event: 'VTU Central Youth Tech Olympiad',
        organizer: 'VTU Belagavi',
        category: 'Technical Competitions',
        level: 'State',
        date: 'October 2024',
        position: 'Gold Medalist (Rank 1)',
        description: 'Completed complex parametric automotive assembly modeling with zero geometric constraint violations under 90 minutes.',
        evidenceUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
        verificationLink: '',
        isVerified: true,
      },
      {
        id: 'ach-kh-3',
        title: '1st Prize — Technical Paper on Lightweight Composites',
        event: 'National Conference on Advanced Materials (NCAM)',
        organizer: 'JCER Department of Mechanical Engineering',
        category: 'Research & Publications',
        level: 'National',
        date: 'August 2024',
        position: 'Best Research Paper Award',
        description: 'Published comparative analysis of carbon fiber reinforced polymer matrix impact resistance for EV battery enclosures.',
        evidenceUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
        verificationLink: '',
        isVerified: true,
      },
    ],
    gallery: [
      {
        id: 'g-kh-1',
        url: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80',
        caption: 'Team JCER buggy testing before SAE Baja finals',
        category: 'Motorsports',
      },
    ],
  },
];

// Helper to get local profiles
const getLocalProfiles = () => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_SEED_PROFILES));
      return INITIAL_SEED_PROFILES;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_SEED_PROFILES));
      return INITIAL_SEED_PROFILES;
    }
    // Automatically sanitize and purge any profile with pratham from storage
    const sanitized = parsed.filter(
      (p) => !p.slug?.includes('pratham') && !p.fullName?.toLowerCase().includes('pratham') && !p.email?.toLowerCase().includes('pratham')
    );
    if (sanitized.length !== parsed.length) {
      // If the first seed profile (Chinmay) was missing, prepend it
      if (!sanitized.some((p) => p.slug === 'chinmay-joshi')) {
        sanitized.unshift(INITIAL_SEED_PROFILES[0]);
      }
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(sanitized));
      return sanitized;
    }
    return parsed;
  } catch (e) {
    console.warn('LocalStorage read error:', e);
    return INITIAL_SEED_PROFILES;
  }
};

const setLocalProfiles = (profiles) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(profiles));
  } catch (e) {
    console.warn('LocalStorage write error:', e);
  }
};

/**
 * Fetch all approved profiles for public directory
 */
export const getApprovedProfiles = async () => {
  const local = getLocalProfiles();
  return local.filter((p) => p.status === 'approved');
};

/**
 * Fetch a single profile by slug (e.g. 'chinmay-joshi')
 */
export const getProfileBySlug = async (slug) => {
  const local = getLocalProfiles();
  return local.find((p) => p.slug === slug || p.id === slug) || null;
};

/**
 * Fetch profile by logged-in User ID
 */
export const getProfileByUserId = async (userId) => {
  if (!userId) return null;
  const local = getLocalProfiles();
  return local.find((p) => p.userId === userId) || null;
};

/**
 * Save or update student profile
 */
export const saveProfile = async (profileData) => {
  const local = getLocalProfiles();
  const existingIdx = local.findIndex(
    (p) => p.id === profileData.id || p.userId === profileData.userId || p.slug === profileData.slug
  );

  const updatedProfile = {
    ...profileData,
    updatedAt: new Date().toISOString(),
  };

  if (existingIdx >= 0) {
    local[existingIdx] = { ...local[existingIdx], ...updatedProfile };
  } else {
    local.push(updatedProfile);
  }
  setLocalProfiles(local);

  return updatedProfile;
};

/**
 * Fetch ALL profiles for Admin Dashboard (includes pending_review, rejected, approved, draft)
 */
export const getAllProfilesAdmin = async () => {
  return getLocalProfiles();
};

/**
 * Admin action: update profile review status
 */
export const updateProfileStatus = async (profileId, status, rejectionReason = '') => {
  const local = getLocalProfiles();
  const idx = local.findIndex((p) => p.id === profileId);
  if (idx >= 0) {
    local[idx].status = status;
    local[idx].rejectionReason = rejectionReason;
    if (status === 'approved') {
      local[idx].approvedAt = new Date().toISOString();
    }
    local[idx].updatedAt = new Date().toISOString();
    setLocalProfiles(local);
    return local[idx];
  }
  return null;
};

/**
 * Reset local data to seed (useful for dev/test)
 */
export const resetToSeedProfiles = () => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_SEED_PROFILES));
  return INITIAL_SEED_PROFILES;
};
