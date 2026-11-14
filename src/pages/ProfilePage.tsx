import { useState, type FormEvent, type KeyboardEvent } from 'react';
import { CheckCircle2, Plus, X } from 'lucide-react';
import { api, extractApiError } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { NICHES, type Niche, type User } from '../types';

export function ProfilePage() {
  const { user, setUser } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [niche, setNiche] = useState<Niche>(user?.niche || NICHES[0]);
  const [phone, setPhone] = useState(user?.phone || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [skills, setSkills] = useState<string[]>(user?.skills || []);
  const [skillInput, setSkillInput] = useState('');

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedNotice, setSavedNotice] = useState(false);

  const handleAddSkill = () => {
    const clean = skillInput.trim();
    if (!clean) return;
    if (!skills.some((s) => s.toLowerCase() === clean.toLowerCase())) {
      setSkills((prev) => [...prev, clean].slice(0, 20));
    }
    setSkillInput('');
  };

  const handleSkillKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills((prev) => prev.filter((s) => s !== skillToRemove));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSavedNotice(false);

    if (name.trim().length < 2) {
      setError('Full name must be at least 2 characters.');
      return;
    }

    if (phone.trim() && phone.replace(/\D/g, '').length < 10) {
      setError('Phone number must contain at least 10 digits.');
      return;
    }

    setSaving(true);
    try {
      const { data } = await api.put<{ user: User }>('/users/profile', {
        name: name.trim(),
        niche,
        phone: phone.trim(),
        skills,
        bio: bio.trim(),
      });
      setUser(data.user);
      setSavedNotice(true);
    } catch (err) {
      setError(extractApiError(err, 'Failed to update profile.'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#FAFAFA] py-8 sm:py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="pb-6 border-b border-slate-200">
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Candidate Profile
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Updating your primary discipline immediately tailors your default Job Feed.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-6 bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-6"
        >
          {error && (
            <div
              role="alert"
              className="px-4 py-3 text-sm text-rose-800 bg-rose-50 border border-rose-200 rounded-lg"
            >
              {error}
            </div>
          )}

          {savedNotice && (
            <div
              role="status"
              className="px-4 py-3 text-sm text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Profile updated. Your job feed now defaults to {niche}.</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="profile-name" className="block text-sm font-medium text-slate-800 mb-1.5">
                Full Name
              </label>
              <input
                id="profile-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800/20 focus:border-blue-800"
              />
            </div>

            <div>
              <label htmlFor="profile-email" className="block text-sm font-medium text-slate-800 mb-1.5">
                Email Address
              </label>
              <input
                id="profile-email"
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 text-slate-500 border border-slate-200 rounded-lg cursor-not-allowed"
              />
            </div>

            <div>
              <label htmlFor="profile-niche" className="block text-sm font-medium text-slate-800 mb-1.5">
                Primary Discipline
              </label>
              <select
                id="profile-niche"
                value={niche}
                onChange={(e) => setNiche(e.target.value as Niche)}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800/20 focus:border-blue-800"
              >
                {NICHES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="profile-phone" className="block text-sm font-medium text-slate-800 mb-1.5">
                Phone Number
              </label>
              <input
                id="profile-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800/20 focus:border-blue-800"
              />
            </div>
          </div>

          {/* Skills Editor */}
          <div>
            <label htmlFor="profile-skill-input" className="block text-sm font-medium text-slate-800 mb-1.5">
              Skills
            </label>
            <div className="flex gap-2">
              <input
                id="profile-skill-input"
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleSkillKeyDown}
                placeholder="Type a skill (e.g. SQL, React, Figma) and press Add"
                className="flex-1 px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800/20 focus:border-blue-800"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>

            {skills.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-slate-800 bg-slate-100 border border-slate-200 rounded-md"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      aria-label={`Remove ${skill}`}
                      className="text-slate-500 hover:text-slate-900 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Bio */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="profile-bio" className="block text-sm font-medium text-slate-800">
                Short Bio
              </label>
              <span className="font-mono text-xs tabular-nums text-slate-500">
                {bio.length}/1000
              </span>
            </div>
            <textarea
              id="profile-bio"
              rows={4}
              maxLength={1000}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Summarize your domain focus, years of experience, and target roles..."
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800/20 focus:border-blue-800 resize-y"
            />
          </div>

          <div className="pt-2 flex items-center justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 text-sm font-medium text-white bg-blue-800 hover:bg-blue-900 disabled:opacity-60 rounded-lg transition-colors cursor-pointer"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
