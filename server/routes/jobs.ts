import fs from 'node:fs';
import express from 'express';
import mongoose from 'mongoose';
import {
  EXPERIENCE_LEVELS,
  JOB_TYPES,
  NICHES,
  type ExperienceLevel,
  type JobType,
  type Niche,
} from '../config/constants.ts';
import { authMiddleware, type AuthenticatedRequest } from '../middleware/auth.ts';
import { handleResumeUpload } from '../middleware/upload.ts';
import { Application } from '../models/Application.ts';
import { Job } from '../models/Job.ts';

const router = express.Router();

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

router.get('/', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const user = req.user!;
    const {
      niche,
      search,
      location,
      type,
      experienceLevel,
      showAll,
      page = '1',
      limit = '8',
    } = req.query as Record<string, string | undefined>;

    const filter: Record<string, unknown> = {};

    const showAllNiches = showAll === 'true';
    if (!showAllNiches) {
      const targetNiche = niche && NICHES.includes(niche as Niche) ? niche : user.niche;
      filter.niche = targetNiche;
    } else if (niche && niche !== 'all' && NICHES.includes(niche as Niche)) {
      filter.niche = niche;
    }

    if (location && location !== 'all') {
      filter.location = new RegExp(`^${escapeRegex(location.trim())}$`, 'i');
    }

    if (type && type !== 'all' && JOB_TYPES.includes(type as JobType)) {
      filter.type = type;
    }

    if (
      experienceLevel &&
      experienceLevel !== 'all' &&
      EXPERIENCE_LEVELS.includes(experienceLevel as ExperienceLevel)
    ) {
      filter.experienceLevel = experienceLevel;
    }

    if (search && search.trim()) {
      const rx = new RegExp(escapeRegex(search.trim()), 'i');
      filter.$or = [{ title: rx }, { company: rx }, { description: rx }, { location: rx }];
    }

    const pageNum = Math.max(1, Number.parseInt(page, 10) || 1);
    const limitNum = Math.min(24, Math.max(1, Number.parseInt(limit, 10) || 8));
    const skip = (pageNum - 1) * limitNum;

    const [jobs, total, userApplications] = await Promise.all([
      Job.find(filter).sort({ postedAt: -1, _id: 1 }).skip(skip).limit(limitNum).lean(),
      Job.countDocuments(filter),
      Application.find({ user: user._id }).select('job status').lean(),
    ]);

    const appliedMap = new Map<string, string>();
    for (const app of userApplications) {
      appliedMap.set(app.job.toString(), app.status);
    }

    const enrichedJobs = jobs.map((job) => ({
      ...job,
      id: job._id.toString(),
      appliedStatus: appliedMap.get(job._id.toString()) || null,
    }));

    const totalPages = Math.max(1, Math.ceil(total / limitNum));

    res.json({
      jobs: enrichedJobs,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages,
      userNiche: user.niche,
    });
  } catch (error) {
    console.error('[Jobs List Error]', error);
    res.status(500).json({ message: 'Failed to load job listings.' });
  }
});

router.get('/:id', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const id = String(req.params.id);
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(404).json({ message: 'Job listing not found.' });
      return;
    }

    const job = await Job.findById(id).lean();
    if (!job) {
      res.status(404).json({ message: 'Job listing not found.' });
      return;
    }

    const existingApplication = await Application.findOne({
      user: req.user!._id,
      job: job._id,
    }).lean();

    res.json({
      job: {
        ...job,
        id: job._id.toString(),
      },
      hasApplied: Boolean(existingApplication),
      application: existingApplication
        ? {
            id: existingApplication._id.toString(),
            status: existingApplication.status,
            appliedAt: existingApplication.appliedAt,
            resumeUrl: existingApplication.resumeUrl,
          }
        : null,
    });
  } catch (error) {
    console.error('[Job Detail Error]', error);
    res.status(500).json({ message: 'Failed to load job details.' });
  }
});

router.post(
  '/:id/apply',
  authMiddleware,
  handleResumeUpload,
  async (req: AuthenticatedRequest, res) => {
    const cleanupUploadedFile = () => {
      if (req.file?.path && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
    };

    try {
      const id = String(req.params.id);
      if (!mongoose.Types.ObjectId.isValid(id)) {
        cleanupUploadedFile();
        res.status(404).json({ message: 'Job listing not found.' });
        return;
      }

      const job = await Job.findById(id);
      if (!job) {
        cleanupUploadedFile();
        res.status(404).json({ message: 'Job listing not found.' });
        return;
      }

      const existing = await Application.findOne({
        user: req.user!._id,
        job: job._id,
      });

      if (existing) {
        cleanupUploadedFile();
        res.status(409).json({ message: 'You have already applied to this role.' });
        return;
      }

      const { phone, coverNote } = req.body as { phone?: string; coverNote?: string };
      const trimmedPhone = phone?.trim() || '';
      const trimmedCoverNote = coverNote?.trim() || '';

      if (!trimmedPhone || trimmedPhone.replace(/\D/g, '').length < 10) {
        cleanupUploadedFile();
        res.status(400).json({ message: 'Please provide a valid phone number (at least 10 digits).' });
        return;
      }

      if (!req.file) {
        res.status(400).json({ message: 'Please upload your resume as a PDF file (max 2MB).' });
        return;
      }

      if (!trimmedCoverNote || trimmedCoverNote.length < 15) {
        cleanupUploadedFile();
        res.status(400).json({ message: 'Please write a brief cover note (at least 15 characters).' });
        return;
      }

      const resumeUrl = `/uploads/resumes/${req.file.filename}`;

      const application = await Application.create({
        user: req.user!._id,
        job: job._id,
        phone: trimmedPhone,
        resumeUrl,
        coverNote: trimmedCoverNote,
        status: 'Applied',
        appliedAt: new Date(),
      });

      res.status(201).json({
        message: 'Application submitted successfully.',
        application: {
          id: application._id.toString(),
          status: application.status,
          appliedAt: application.appliedAt,
          resumeUrl: application.resumeUrl,
          phone: application.phone,
          coverNote: application.coverNote,
        },
      });
    } catch (error) {
      cleanupUploadedFile();
      console.error('[Job Apply Error]', error);
      res.status(500).json({ message: 'Failed to submit application. Please try again.' });
    }
  }
);

export default router;
