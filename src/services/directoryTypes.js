export const MIN_QUALIFYING_ACHIEVEMENTS = 3;

export const DEPARTMENTS = [
  'Computer Science & Engineering',
  'Information Science & Engineering',
  'Electronics & Communication',
  'Mechanical Engineering',
  'Artificial Intelligence & Data Science',
  'Civil Engineering',
];

export const ACADEMIC_YEARS = [
  '1st Year',
  '2nd Year',
  '3rd Year',
  '4th Year',
  'Alumni',
];

export const ACHIEVEMENT_CATEGORIES = [
  'Hackathons',
  'Technical Competitions',
  'Entrepreneurship & Pitching',
  'Innovation Challenges',
  'Research & Publications',
  'Cultural & Arts',
  'Sports & Athletics',
];

export const COMPETITION_LEVELS = [
  'International',
  'National',
  'State',
  'Intercollegiate',
  'College',
];

export const COLLABORATION_STATUSES = [
  'Open for Hackathons',
  'Seeking Teammates',
  'Available for Mentorship',
  'Busy with Projects',
];

export const PREFERRED_ROLES = [
  'Frontend Engineer',
  'Backend / Cloud',
  'AI / ML Specialist',
  'Mobile App Developer',
  'UI / UX Designer',
  'Product & Pitch Lead',
  'Hardware & IoT',
  'Cybersecurity & DevOps',
];

export const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
};

export const isEligibleForSubmission = (achievements = []) => {
  if (!Array.isArray(achievements)) return false;
  // A qualifying achievement must have title, event, category, and level
  const validAchievements = achievements.filter(
    (a) => a.title?.trim() && a.event?.trim() && a.category && a.level
  );
  return validAchievements.length >= MIN_QUALIFYING_ACHIEVEMENTS;
};
