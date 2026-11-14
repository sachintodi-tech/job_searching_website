import 'dotenv/config';
import { connectDatabase, disconnectDatabase } from './db/connect.ts';
import { Job } from './models/Job.ts';
import { SEED_JOBS } from './seedData.ts';

async function runSeed() {
  try {
    await connectDatabase();
    const force = process.argv.includes('--force');

    if (force) {
      await Job.deleteMany({});
    }

    const existing = await Job.countDocuments();
    if (existing === 0) {
      const now = Date.now();
      const docs = SEED_JOBS.map((job) => ({
        title: job.title,
        company: job.company,
        location: job.location,
        niche: job.niche,
        type: job.type,
        experienceLevel: job.experienceLevel,
        salaryRange: job.salaryRange,
        description: job.description,
        requirements: job.requirements,
        postedAt: new Date(now - job.daysAgo * 24 * 60 * 60 * 1000),
      }));
      await Job.insertMany(docs);
      console.log(`[Seed] Inserted ${docs.length} jobs successfully.`);
    } else {
      console.log(`[Seed] Database already contains ${existing} jobs. Use --force to reseed.`);
    }
  } catch (error) {
    console.error('[Seed] Failed:', error);
    process.exitCode = 1;
  } finally {
    await disconnectDatabase();
  }
}

runSeed();
