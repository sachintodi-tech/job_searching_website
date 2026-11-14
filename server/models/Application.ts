import mongoose, { Schema, type Document, type Types } from 'mongoose';
import { APPLICATION_STATUSES, type ApplicationStatus } from '../config/constants.ts';

export interface IApplication extends Document {
  user: Types.ObjectId;
  job: Types.ObjectId;
  phone: string;
  resumeUrl: string;
  coverNote: string;
  status: ApplicationStatus;
  appliedAt: Date;
}

const applicationSchema = new Schema<IApplication>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    job: {
      type: Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
      index: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    resumeUrl: {
      type: String,
      required: [true, 'Resume PDF is required'],
    },
    coverNote: {
      type: String,
      required: [true, 'Cover note is required'],
      trim: true,
      maxlength: [2000, 'Cover note cannot exceed 2000 characters'],
    },
    status: {
      type: String,
      enum: APPLICATION_STATUSES,
      default: 'Applied',
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

applicationSchema.index({ user: 1, job: 1 }, { unique: true });

export const Application =
  mongoose.models.Application || mongoose.model<IApplication>('Application', applicationSchema);
