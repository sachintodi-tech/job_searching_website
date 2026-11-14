import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {
  COOKIE_NAME,
  JWT_EXPIRES_IN,
  JWT_SECRET,
  NICHES,
  type Niche,
} from '../config/constants.ts';
import { authMiddleware, type AuthenticatedRequest } from '../middleware/auth.ts';
import { User, type IUser } from '../models/User.ts';

const router = express.Router();

function sanitizeUser(user: IUser) {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    niche: user.niche,
    phone: user.phone || '',
    skills: user.skills || [],
    bio: user.bio || '',
    role: user.role,
    createdAt: user.createdAt,
  };
}

function issueTokenAndCookie(res: express.Response, userId: string): string {
  const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',
  });
  return token;
}

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, confirmPassword, niche } = req.body as {
      name?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
      niche?: string;
    };

    const errors: Record<string, string> = {};

    if (!name || name.trim().length < 2) {
      errors.name = 'Full name must be at least 2 characters.';
    }

    const normalizedEmail = email?.trim().toLowerCase() || '';
    if (!normalizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      errors.email = 'Please enter a valid email address.';
    }

    if (!password || password.length < 6) {
      errors.password = 'Password must be at least 6 characters.';
    }

    if (confirmPassword !== undefined && password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
    }

    if (!niche || !NICHES.includes(niche as Niche)) {
      errors.niche = 'Please select your primary career discipline.';
    }

    if (Object.keys(errors).length > 0) {
      res.status(400).json({
        message: Object.values(errors)[0],
        errors,
      });
      return;
    }

    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      res.status(409).json({
        message: 'An account with this email already exists.',
        errors: { email: 'An account with this email already exists.' },
      });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password!, salt);

    const user = await User.create({
      name: name!.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      niche: niche as Niche,
      role: 'jobseeker',
    });

    const token = issueTokenAndCookie(res, user._id.toString());
    res.status(201).json({
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error('[Auth Register Error]', error);
    res.status(500).json({ message: 'Unable to complete registration. Please try again.' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body as { email?: string; password?: string };

    if (!email || !email.trim() || !password) {
      res.status(400).json({ message: 'Email and password are required.' });
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      res.status(401).json({ message: 'Invalid email or password.' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ message: 'Invalid email or password.' });
      return;
    }

    const token = issueTokenAndCookie(res, user._id.toString());
    res.json({
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error('[Auth Login Error]', error);
    res.status(500).json({ message: 'Unable to sign in right now. Please try again.' });
  }
});

router.post('/logout', (_req, res) => {
  res.clearCookie(COOKIE_NAME, { path: '/' });
  res.json({ message: 'Signed out successfully.' });
});

router.get('/me', authMiddleware, (req: AuthenticatedRequest, res) => {
  if (!req.user) {
    res.status(401).json({ message: 'Not authenticated.' });
    return;
  }
  res.json({ user: sanitizeUser(req.user) });
});

export default router;
