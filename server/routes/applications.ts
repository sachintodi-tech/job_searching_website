import express from 'express';
import { authMiddleware, type AuthenticatedRequest } from '../middleware/auth.ts';
import { Application } from '../models/Application.ts';

const router = express.Router();

router.get('/mine', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const applications = await Application.find({ user: req.user!._id })
      .populate({
        path: 'job',
        select: 'title company location niche type experienceLevel salaryRange postedAt',
      })
      .sort({ appliedAt: -1 })
      .lean();

    const formatted = applications
      .filter((app) => app.job)
      .map((app) => {
        const job = app.job as unknown as {
          _id: { toString: () => string };
          title: string;
          company: string;
          location: string;
          niche: string;
          type: string;
          experienceLevel: string;
          salaryRange: string;
        };

        return {
          id: app._id.toString(),
          phone: app.phone,
          resumeUrl: app.resumeUrl,
          coverNote: app.coverNote,
          status: app.status,
          appliedAt: app.appliedAt,
          job: {
            id: job._id.toString(),
            title: job.title,
            company: job.company,
            location: job.location,
            niche: job.niche,
            type: job.type,
            experienceLevel: job.experienceLevel,
            salaryRange: job.salaryRange,
          },
        };
      });

    res.json({ applications: formatted });
  } catch (error) {
    console.error('[My Applications Error]', error);
    res.status(500).json({ message: 'Failed to load your applications.' });
  }
});

export default router;
