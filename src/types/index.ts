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

export interface User {
  id: string;
  name: string;
  email: string;
  niche: Niche;
  phone: string;
  skills: string[];
  bio: string;
  role: 'jobseeker' | 'admin';
  createdAt?: string;
}

export interface Job {
  id: string;
  _id?: string;
  title: string;
  company: string;
  location: string;
  niche: Niche;
  type: JobType;
  experienceLevel: ExperienceLevel;
  salaryRange: string;
  description: string;
  requirements: string[];
  postedAt: string;
  appliedStatus?: ApplicationStatus | null;
}

export interface JobsResponse {
  jobs: Job[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  userNiche: Niche;
}

export interface ApplicationItem {
  id: string;
  phone: string;
  resumeUrl: string;
  coverNote: string;
  status: ApplicationStatus;
  appliedAt: string;
  job: {
    id: string;
    title: string;
    company: string;
    location: string;
    niche: Niche;
    type: JobType;
    experienceLevel: ExperienceLevel;
    salaryRange: string;
  };
}

export interface PublicStatsResponse {
  totalJobs: number;
  nicheCounts: Record<string, number>;
}
