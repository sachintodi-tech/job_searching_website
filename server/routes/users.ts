import express from 'express';
import { NICHES, type Niche } from '../config/constants.ts';
import { authMiddleware, type AuthenticatedRequest } from '../middleware/auth.ts';
import { User } from '../models/User.ts';

const router = express.Router();

router.put('/profile', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const { name, niche, phone, skills, bio } = req.body as {
      name?: string;
      niche?: string;
      phone?: string;
      skills?: unknown;
      bio?: string;
    };

    const errors: Record<string, string> = {};

    if (!name || name.trim().length < 2) {
      errors.name = 'Full name must be at least 2 characters.';
    }

    if (!niche || !NICHES.includes(niche as Niche)) {
      errors.niche = 'Please select a valid discipline.';
    }

    const cleanPhone = phone?.trim() || '';
    if (cleanPhone && cleanPhone.replace(/\D/g, '').length < 10) {
      errors.phone = 'Phone number must contain at least 10 digits.';
    }

    const cleanBio = bio?.trim() || '';
    if (cleanBio.length > 1000) {
      errors.bio = 'Bio cannot exceed 1000 characters.';
    }

    if (Object.keys(errors).length > 0) {
      res.status(400).json({
        message: Object.values(errors)[0],
        errors,
      });
      return;
    }

    let normalizedSkills: string[] = [];
    if (Array.isArray(skills)) {
      normalizedSkills = Array.from(
        new Set(
          skills
            .filter((item): item is string => typeof item === 'string')
            .map((item) => item.trim())
            .filter(Boolean)
        )
      ).slice(0, 20);
    }

    const updated = await User.findByIdAndUpdate(
      req.user!._id,
      {
        name: name!.trim(),
        niche: niche as Niche,
        phone: cleanPhone,
        skills: normalizedSkills,
        bio: cleanBio,
      },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updated) {
      res.status(404).json({ message: 'User account not found.' });
      return;
    }

    res.json({
      message: 'Profile updated successfully.',
      user: {
        id: updated._id.toString(),
        name: updated.name,
        email: updated.email,
        niche: updated.niche,
        phone: updated.phone || '',
        skills: updated.skills || [],
        bio: updated.bio || '',
        role: updated.role,
        createdAt: updated.createdAt,
      },
    });
  } catch (error) {
    console.error('[Profile Update Error]', error);
    res.status(500).json({ message: 'Failed to update profile.' });
  }
});

export default router;
