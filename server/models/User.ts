import mongoose, { Schema, type Document } from 'mongoose';
import { NICHES, type Niche } from '../config/constants.ts';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  niche: Niche;
  phone: string;
  skills: string[];
  bio: string;
  role: 'jobseeker' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [80, 'Name cannot exceed 80 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email address is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
    },
    niche: {
      type: String,
      required: [true, 'Primary discipline is required'],
      enum: {
        values: NICHES,
        message: 'Please select a valid discipline',
      },
    },
    phone: {
      type: String,
      default: '',
      trim: true,
    },
    skills: {
      type: [String],
      default: [],
    },
    bio: {
      type: String,
      default: '',
      maxlength: [1000, 'Bio cannot exceed 1000 characters'],
    },
    role: {
      type: String,
      enum: ['jobseeker', 'admin'],
      default: 'jobseeker',
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);
