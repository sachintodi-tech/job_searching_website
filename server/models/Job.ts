import mongoose, { Schema, type Document } from 'mongoose';
import {
  EXPERIENCE_LEVELS,
  JOB_TYPES,
  NICHES,
  type ExperienceLevel,
  type JobType,
  type Niche,
} from '../config/constants.ts';

export interface IJob extends Document {
  title: string;
  company: string;
  location: string;
  niche: Niche;
  type: JobType;
  experienceLevel: ExperienceLevel;
  salaryRange: string;
  description: string;
  requirements: string[];
  postedAt: Date;
}

const jobSchema = new Schema<IJob>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    niche: {
      type: String,
      required: true,
      enum: NICHES,
      index: true,
    },
    type: {
      type: String,
      required: true,
      enum: JOB_TYPES,
      index: true,
    },
    experienceLevel: {
      type: String,
      required: true,
      enum: EXPERIENCE_LEVELS,
      index: true,
    },
    salaryRange: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    requirements: {
      type: [String],
      required: true,
      default: [],
    },
    postedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

jobSchema.index({ title: 'text', company: 'text', description: 'text' });

export const Job = mongoose.models.Job || mongoose.model<IJob>('Job', jobSchema);
