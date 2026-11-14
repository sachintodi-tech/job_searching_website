import { useState, type FormEvent } from 'react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { extractApiError } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { NICHES, type Niche } from '../types';

export function RegisterPage() {
  const { user, register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const initialNicheParam = searchParams.get('niche') || '';
  const validInitialNiche = NICHES.includes(initialNicheParam as Niche)
    ? (initialNicheParam as Niche)
    : '';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [niche, setNiche] = useState<string>(validInitialNiche);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (user) {
    return <Navigate to="/jobs" replace />;
  }

  const validate = (): boolean => {
    const errors: Record<string, string> = {};

    if (name.trim().length < 2) {
      errors.name = 'Full name must be at least 2 characters.';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = 'Please enter a valid email address.';
    }
    if (!niche || !NICHES.includes(niche as Niche)) {
      errors.niche = 'Please select your primary career discipline.';
    }
    if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters.';
    }
    if (confirmPassword !== password) {
      errors.confirmPassword = 'Passwords do not match.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setServerError(null);
    if (!validate()) return;

    setSubmitting(true);
    try {
      await register({
        name: name.trim(),
        email: email.trim(),
        password,
        confirmPassword,
        niche: niche as Niche,
      });
      navigate('/jobs', { replace: true });
    } catch (err) {
      setServerError(extractApiError(err, 'Unable to create account. Please try again.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#FAFAFA] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg bg-white border border-slate-200 rounded-xl p-6 sm:p-8">
        <div className="mb-6">
          <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900">
            Create your HireCraft account
          </h1>
          <p className="mt-1.5 text-sm text-slate-600">
            Choose your primary discipline to unlock curated roles matched to your craft.
          </p>
        </div>

        {serverError && (
          <div
            role="alert"
            className="mb-5 px-4 py-3 text-sm text-rose-800 bg-rose-50 border border-rose-200 rounded-lg"
          >
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <label htmlFor="reg-name" className="block text-sm font-medium text-slate-800 mb-1.5">
              Full Name
            </label>
            <input
              id="reg-name"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Aarav Sharma"
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800/20 focus:border-blue-800"
            />
            {fieldErrors.name && <p className="mt-1 text-xs text-rose-700">{fieldErrors.name}</p>}
          </div>

          <div>
            <label htmlFor="reg-email" className="block text-sm font-medium text-slate-800 mb-1.5">
              Email Address
            </label>
            <input
              id="reg-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="aarav@example.in"
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800/20 focus:border-blue-800"
            />
            {fieldErrors.email && <p className="mt-1 text-xs text-rose-700">{fieldErrors.email}</p>}
          </div>

          <div>
            <label htmlFor="reg-niche" className="block text-sm font-medium text-slate-800 mb-1.5">
              Primary Discipline <span className="text-rose-700">*</span>
            </label>
            <select
              id="reg-niche"
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800/20 focus:border-blue-800"
            >
              <option value="">Select your primary discipline</option>
              {NICHES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            {fieldErrors.niche && <p className="mt-1 text-xs text-rose-700">{fieldErrors.niche}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="reg-password" className="block text-sm font-medium text-slate-800 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="reg-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  className="w-full pl-3.5 pr-10 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800/20 focus:border-blue-800"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="mt-1 text-xs text-rose-700">{fieldErrors.password}</p>
              )}
            </div>

            <div>
              <label htmlFor="reg-confirm" className="block text-sm font-medium text-slate-800 mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="reg-confirm"
                  type={showConfirm ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className="w-full pl-3.5 pr-10 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800/20 focus:border-blue-800"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((prev) => !prev)}
                  aria-label={showConfirm ? 'Hide confirm password' : 'Show confirm password'}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {fieldErrors.confirmPassword && (
                <p className="mt-1 text-xs text-rose-700">{fieldErrors.confirmPassword}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-2 py-2.5 px-4 text-sm font-medium text-white bg-blue-800 hover:bg-blue-900 disabled:opacity-60 rounded-lg transition-colors cursor-pointer"
          >
            {submitting ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-blue-800 hover:text-blue-900">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
