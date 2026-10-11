const RESOURCES_STORAGE_KEY = 'jcer_campus_resources_v1';
const BORROW_REQUESTS_KEY = 'jcer_resource_borrow_requests_v1';

export const RESOURCE_CATEGORIES = [
  'All',
  'Hardware & Microcontrollers',
  'Lab Instrumentation & Tools',
  'Rapid Prototyping & 3D Printing',
  'Event & Media Tech',
  'Startup Books & Seed Library',
];

export const INITIAL_RESOURCES = [
  {
    id: 'res-rpi4-kit',
    name: 'Raspberry Pi 4 Model B (8GB) Sensor Dev Kit',
    category: 'Hardware & Microcontrollers',
    labLocation: 'IoT & Embedded Lab, Room 302',
    specs: '8GB LPDDR4, 64GB MicroSD, Camera Module V2, 37-Sensor expansion hat, 5V 3A Type-C PSU',
    totalQty: 6,
    availableQty: 4,
    condition: 'Excellent',
    maxDurationDays: 14,
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    tags: ['Raspberry Pi', 'Linux', 'Computer Vision', 'IoT'],
    managedBy: 'Prof. S. R. Patil / E-Cell Tech Council',
  },
  {
    id: 'res-jetson-nano',
    name: 'NVIDIA Jetson Nano (4GB B01) AI Dev Kit',
    category: 'Hardware & Microcontrollers',
    labLocation: 'AI & Vision Innovation Lab, Room 405',
    specs: '128-core NVIDIA Maxwell GPU, Quad-core ARM A57, 4GB 64-bit LPDDR4, dual CSI camera ports',
    totalQty: 4,
    availableQty: 2,
    condition: 'Excellent',
    maxDurationDays: 14,
    imageUrl: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=800&q=80',
    tags: ['Edge AI', 'CUDA', 'TensorRT', 'Robotics'],
    managedBy: 'Dept of AI & DS Lab Admin',
  },
  {
    id: 'res-esp32-lora',
    name: 'Heltec ESP32-S3 LoRaWAN V3 Node (Pack of 3)',
    category: 'Hardware & Microcontrollers',
    labLocation: 'Embedded Systems Research Lab, Room 208',
    specs: '868/915MHz LoRa SX1262, Wi-Fi & BLE 5, 0.96-inch OLED screen, LiPo battery connector',
    totalQty: 8,
    availableQty: 5,
    condition: 'Excellent',
    maxDurationDays: 10,
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    tags: ['LoRa', 'Sub-GHz', 'Telemetry', 'Wireless'],
    managedBy: 'ECE Dept Project Coordinator',
  },
  {
    id: 'res-rigol-dso',
    name: 'Rigol DS1054Z 4-Channel 100MHz Digital Oscilloscope',
    category: 'Lab Instrumentation & Tools',
    labLocation: 'Circuit Analysis Bay, ECE Block Room 204',
    specs: '50MHz (unlocked 100MHz), 1 GSa/s real-time sample rate, 24 Mpts memory depth, 4 passive probes',
    totalQty: 3,
    availableQty: 1,
    condition: 'Excellent',
    maxDurationDays: 3,
    imageUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80',
    tags: ['Oscilloscope', 'Signal Debug', 'Analog', 'Hardware Test'],
    managedBy: 'ECE Instrumentation Officer',
  },
  {
    id: 'res-smd-rework',
    name: 'Quick 861DW Digital SMD Hot Air & Soldering Station',
    category: 'Lab Instrumentation & Tools',
    labLocation: 'Hardware Prototyping Workshop, Room 102',
    specs: '1000W High power, 100°C–500°C precision thermostatic regulation, anti-static ESD safe tweezers',
    totalQty: 2,
    availableQty: 2,
    condition: 'Good',
    maxDurationDays: 3,
    imageUrl: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=800&q=80',
    tags: ['Soldering', 'PCB Assembly', 'SMD Rework', 'Maker Tools'],
    managedBy: 'Workshop Superintendent',
  },
  {
    id: 'res-ender-3d',
    name: 'Creality Ender-3 V3 3D Printer (Dedicated Time Slot)',
    category: 'Rapid Prototyping & 3D Printing',
    labLocation: 'Mechanical MakerSpace, Workshop Block 01',
    specs: '220x220x250mm build volume, direct drive extruder, PLA/PETG/TPU filaments included for E-Cell teams',
    totalQty: 2,
    availableQty: 1,
    condition: 'Excellent',
    maxDurationDays: 2,
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    tags: ['3D Printing', 'CAD', 'Rapid Prototyping', 'Enclosures'],
    managedBy: 'Team JCER Motorsports Fabrication Lab',
  },
  {
    id: 'res-hdmi-projector',
    name: 'BenQ 4000-Lumen High-Definition Projector & Clicker Kit',
    category: 'Event & Media Tech',
    labLocation: 'E-Cell Incubation Seminar Hall',
    specs: '1080p Full HD, 4000 ANSI Lumens, 10m HDMI + USB-C dongle, wireless laser slide presenter',
    totalQty: 2,
    availableQty: 2,
    condition: 'Excellent',
    maxDurationDays: 2,
    imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
    tags: ['Pitching', 'Presentation', 'AV Equipment', 'Demo Day'],
    managedBy: 'E-Cell Operations Head',
  },
  {
    id: 'res-book-lean',
    name: 'The Lean Startup & Zero to One Master Book Pack',
    category: 'Startup Books & Seed Library',
    labLocation: 'E-Cell Library Shelf, Room 301',
    specs: 'Original paperbacks: The Lean Startup (Ries), Zero to One (Thiel), Disciplined Entrepreneurship (Aulet)',
    totalQty: 5,
    availableQty: 3,
    condition: 'Good',
    maxDurationDays: 14,
    imageUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80',
    tags: ['Startup Strategy', 'Product Market Fit', 'Venture Capital', 'Books'],
    managedBy: 'E-Cell Knowledge Desk',
  },
];

export const INITIAL_BORROW_REQUESTS = [
  {
    id: 'req-bor-101',
    resourceId: 'res-rpi4-kit',
    resourceName: 'Raspberry Pi 4 Model B (8GB) Sensor Dev Kit',
    studentName: 'Kavya Patil',
    studentEmail: 'kavya.patil@jcer.edu.in',
    studentUsn: '2JC22CS040',
    department: 'Computer Science & Engineering',
    phone: '+91 94812 33021',
    purpose: 'Deploying offline image classification model for SIH disaster relief mesh prototype.',
    durationDays: 14,
    requestedDate: '2026-03-01',
    returnDueDate: '2026-03-15',
    status: 'Active / In Use',
    notes: 'Handed over by Prof. S. R. Patil. Kit verification complete.',
    submittedAt: '2026-03-01T10:00:00.000Z',
  },
  {
    id: 'req-bor-102',
    resourceId: 'res-rigol-dso',
    resourceName: 'Rigol DS1054Z 4-Channel 100MHz Digital Oscilloscope',
    studentName: 'Aditya Hegde',
    studentEmail: 'aditya.hegde@jcer.edu.in',
    studentUsn: '2JC23EC011',
    department: 'Electronics & Communication',
    phone: '+91 98450 78219',
    purpose: 'Debugging noisy switching power supply rail on autonomous maze solver robot.',
    durationDays: 3,
    requestedDate: '2026-03-08',
    returnDueDate: '2026-03-11',
    status: 'Approved / Ready for Pickup',
    notes: 'Approved. Available for collection from Room 204 between 3:30 PM - 5:00 PM.',
    submittedAt: '2026-03-08T11:20:00.000Z',
  },
  {
    id: 'req-bor-103',
    resourceId: 'res-ender-3d',
    resourceName: 'Creality Ender-3 V3 3D Printer (Dedicated Time Slot)',
    studentName: 'Sneha Patil',
    studentEmail: 'sneha.patil@jcer.edu.in',
    studentUsn: '2JC23AD028',
    department: 'Artificial Intelligence & Data Science',
    phone: '+91 99014 45678',
    purpose: 'Rapid printing of camera gimbal mounting bracket for drone field test.',
    durationDays: 2,
    requestedDate: '2026-03-10',
    returnDueDate: '2026-03-12',
    status: 'Pending Approval',
    notes: 'Awaiting lab technician review.',
    submittedAt: '2026-03-10T14:10:00.000Z',
  },
];

const getStoredResources = () => {
  try {
    const raw = localStorage.getItem(RESOURCES_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(RESOURCES_STORAGE_KEY, JSON.stringify(INITIAL_RESOURCES));
      return INITIAL_RESOURCES;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(RESOURCES_STORAGE_KEY, JSON.stringify(INITIAL_RESOURCES));
      return INITIAL_RESOURCES;
    }
    return parsed;
  } catch (e) {
    console.warn('Resources read error:', e);
    return INITIAL_RESOURCES;
  }
};

const setStoredResources = (list) => {
  try {
    localStorage.setItem(RESOURCES_STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.warn('Resources write error:', e);
  }
};

const getStoredRequests = () => {
  try {
    const raw = localStorage.getItem(BORROW_REQUESTS_KEY);
    if (!raw) {
      localStorage.setItem(BORROW_REQUESTS_KEY, JSON.stringify(INITIAL_BORROW_REQUESTS));
      return INITIAL_BORROW_REQUESTS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      localStorage.setItem(BORROW_REQUESTS_KEY, JSON.stringify(INITIAL_BORROW_REQUESTS));
      return INITIAL_BORROW_REQUESTS;
    }
    return parsed;
  } catch (e) {
    console.warn('Borrow requests read error:', e);
    return INITIAL_BORROW_REQUESTS;
  }
};

const setStoredRequests = (list) => {
  try {
    localStorage.setItem(BORROW_REQUESTS_KEY, JSON.stringify(list));
  } catch (e) {
    console.warn('Borrow requests write error:', e);
  }
};

export const getResources = async () => {
  return getStoredResources();
};

export const saveResource = async (resData) => {
  const current = getStoredResources();
  const newRes = {
    ...resData,
    id: resData.id || 'res-' + Date.now().toString(36),
    totalQty: Number(resData.totalQty) || 1,
    availableQty: Number(resData.availableQty) || Number(resData.totalQty) || 1,
  };
  const updated = [newRes, ...current.filter((r) => r.id !== newRes.id)];
  setStoredResources(updated);
  return newRes;
};

export const getBorrowRequests = async () => {
  return getStoredRequests();
};

export const createBorrowRequest = async (requestData) => {
  const allRequests = getStoredRequests();
  const allResources = getStoredResources();

  const newReq = {
    ...requestData,
    id: 'req-bor-' + Math.floor(100 + Math.random() * 900) + '-' + Date.now().toString(36).slice(-4),
    status: 'Pending Approval',
    submittedAt: new Date().toISOString(),
  };

  const updatedRequests = [newReq, ...allRequests];
  setStoredRequests(updatedRequests);

  return newReq;
};

export const updateBorrowRequestStatus = async (requestId, newStatus, adminNote = '') => {
  const allRequests = getStoredRequests();
  const allResources = getStoredResources();

  const reqIndex = allRequests.findIndex((r) => r.id === requestId);
  if (reqIndex < 0) return null;

  const currentReq = allRequests[reqIndex];
  const oldStatus = currentReq.status;
  currentReq.status = newStatus;
  if (adminNote) {
    currentReq.notes = adminNote;
  }

  // Adjust resource availability dynamically
  const resIndex = allResources.findIndex((r) => r.id === currentReq.resourceId);
  if (resIndex >= 0) {
    // If transitioning to Active / In Use from a non-active status, decrement available
    if (newStatus === 'Active / In Use' && oldStatus !== 'Active / In Use') {
      allResources[resIndex].availableQty = Math.max(0, allResources[resIndex].availableQty - 1);
    }
    // If transitioning to Returned, increment available back up
    if (newStatus === 'Returned' && oldStatus === 'Active / In Use') {
      allResources[resIndex].availableQty = Math.min(
        allResources[resIndex].totalQty,
        allResources[resIndex].availableQty + 1
      );
    }
    setStoredResources(allResources);
  }

  setStoredRequests(allRequests);
  return currentReq;
};
