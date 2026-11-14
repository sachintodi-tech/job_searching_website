import fs from 'node:fs';
import path from 'node:path';
import type { NextFunction, Request, Response } from 'express';
import multer from 'multer';
import type { AuthenticatedRequest } from './auth.ts';

export const RESUME_UPLOAD_DIR = path.resolve(process.cwd(), 'uploads/resumes');
fs.mkdirSync(RESUME_UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, RESUME_UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const authReq = req as AuthenticatedRequest;
    const userId = authReq.user?._id?.toString() || 'candidate';
    const ext = path.extname(file.originalname).toLowerCase() || '.pdf';
    const safeName = `${userId}-${Date.now()}${ext}`;
    cb(null, safeName);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
  fileFilter: (_req, file, cb) => {
    const isPdfMime = file.mimetype === 'application/pdf';
    const isPdfExt = path.extname(file.originalname).toLowerCase() === '.pdf';
    if (!isPdfMime || !isPdfExt) {
      cb(new Error('INVALID_FILE_TYPE'));
      return;
    }
    cb(null, true);
  },
});

export function handleResumeUpload(req: Request, res: Response, next: NextFunction): void {
  const singleUpload = upload.single('resume');
  singleUpload(req, res, (err: unknown) => {
    if (!err) {
      next();
      return;
    }

    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        res.status(400).json({ message: 'Resume PDF must be 2MB or smaller.' });
        return;
      }
      res.status(400).json({ message: `Upload error: ${err.message}` });
      return;
    }

    if (err instanceof Error && err.message === 'INVALID_FILE_TYPE') {
      res.status(400).json({ message: 'Only PDF files (.pdf) are accepted for resumes.' });
      return;
    }

    res.status(400).json({ message: 'Unable to process uploaded resume.' });
  });
}
