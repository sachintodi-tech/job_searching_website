import 'dotenv/config';
import path from 'node:path';
import cookieParser from 'cookie-parser';
import express from 'express';
import { createServer as createViteServer } from 'vite';
import { NICHES } from './server/config/constants.ts';
import { connectDatabase } from './server/db/connect.ts';
import { RESUME_UPLOAD_DIR } from './server/middleware/upload.ts';
import { Job } from './server/models/Job.ts';
import applicationsRoutes from './server/routes/applications.ts';
import authRoutes from './server/routes/auth.ts';
import jobsRoutes from './server/routes/jobs.ts';
import usersRoutes from './server/routes/users.ts';

async function startServer() {
  await connectDatabase();

  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  app.use('/uploads/resumes', express.static(RESUME_UPLOAD_DIR));

  app.get('/api/public/stats', async (_req, res) => {
    try {
      const counts = await Job.aggregate<{ _id: string; count: number }>([
        { $group: { _id: '$niche', count: { $sum: 1 } } },
      ]);
      const nicheCounts: Record<string, number> = {};
      for (const niche of NICHES) {
        nicheCounts[niche] = 0;
      }
      let totalJobs = 0;
      for (const row of counts) {
        nicheCounts[row._id] = row.count;
        totalJobs += row.count;
      }
      res.json({ totalJobs, nicheCounts });
    } catch {
      res.status(500).json({ message: 'Failed to fetch platform stats.' });
    }
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/jobs', jobsRoutes);
  app.use('/api/applications', applicationsRoutes);
  app.use('/api/users', usersRoutes);

  app.use('/api', (_req, res) => {
    res.status(404).json({ message: 'API endpoint not found.' });
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[HireCraft] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error('[HireCraft] Fatal startup error:', error);
  process.exit(1);
});
