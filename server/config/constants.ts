export const NICHES = [
  'Data Analytics',
  'Web Development',
  'Digital Marketing',
  'Design',
  'Finance',
  'Sales',
  'HR',
  'Content Writing',
] as const;

export type Niche = (typeof NICHES)[number];

export const JOB_TYPES = [
  'Full-time',
  'Part-time',
  'Contract',
  'Internship',
  'Remote',
] as const;

export type JobType = (typeof JOB_TYPES)[number];

export const EXPERIENCE_LEVELS = [
  'Entry Level',
  'Mid Level',
  'Senior',
  'Lead',
] as const;

export type ExperienceLevel = (typeof EXPERIENCE_LEVELS)[number];

export const APPLICATION_STATUSES = [
  'Applied',
  'Under Review',
  'Shortlisted',
  'Rejected',
] as const;

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export const INDIAN_LOCATIONS = [
  'Bengaluru',
  'Mumbai',
  'Gurugram',
  'Hyderabad',
  'Pune',
  'Delhi NCR',
  'Chennai',
  'Noida',
  'Remote - India',
] as const;

export const JWT_SECRET = process.env.JWT_SECRET || 'hirecraft-dev-jwt-secret-change-in-prod';
export const JWT_EXPIRES_IN = '7d';
export const COOKIE_NAME = 'hirecraft_token';
