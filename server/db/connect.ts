import fs from 'node:fs';
import path from 'node:path';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Job } from '../models/Job.ts';
import { SEED_JOBS } from '../seedData.ts';

let memoryServer: MongoMemoryServer | null = null;
let isConnected = false;

export async function seedJobsIfEmpty(): Promise<number> {
  const existingCount = await Job.countDocuments();
  if (existingCount > 0) {
    return 0;
  }

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
  console.log(`[HireCraft] Seeded ${docs.length} curated Indian roles into MongoDB.`);
  return docs.length;
}

export async function connectDatabase(): Promise<void> {
  if (isConnected && mongoose.connection.readyState === 1) {
    return;
  }

  const externalUri = process.env.MONGODB_URI?.trim();
  if (externalUri) {
    await mongoose.connect(externalUri);
    isConnected = true;
    console.log('[HireCraft] Connected to external MongoDB.');
    await seedJobsIfEmpty();
    return;
  }

  const dataDir = path.resolve(process.cwd(), '.mongodb-data');
  fs.mkdirSync(dataDir, { recursive: true });

  try {
    memoryServer = await MongoMemoryServer.create({
      instance: {
        dbPath: dataDir,
        storageEngine: 'wiredTiger',
      },
    });
  } catch (err) {
    console.warn('[HireCraft] Persistent embedded MongoDB fallback to in-memory:', err);
    memoryServer = await MongoMemoryServer.create();
  }

  const uri = memoryServer.getUri();
  await mongoose.connect(uri);
  isConnected = true;
  console.log('[HireCraft] Connected to local MongoDB instance.');
  await seedJobsIfEmpty();
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.disconnect();
  if (memoryServer) {
    await memoryServer.stop();
    memoryServer = null;
  }
  isConnected = false;
}
