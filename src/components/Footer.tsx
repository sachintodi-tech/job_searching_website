import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Footer() {
  const { user } = useAuth();

  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <Link to="/" className="font-display text-lg font-bold tracking-tight text-slate-900">
            HireCraft
          </Link>
          <p className="text-sm text-slate-600 max-w-md">
            Focused career discovery for specialists across India. One primary discipline, transparent INR bands, and direct PDF applications.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-sm text-slate-600">
          <Link to={user ? '/jobs' : '/register'} className="hover:text-slate-900 transition-colors whitespace-nowrap">
            Explore Roles
          </Link>
          {user ? (
            <>
              <Link to="/applications" className="hover:text-slate-900 transition-colors whitespace-nowrap">
                My Applications
              </Link>
              <Link to="/profile" className="hover:text-slate-900 transition-colors whitespace-nowrap">
                Profile
              </Link>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-slate-900 transition-colors whitespace-nowrap">
                Sign In
              </Link>
              <Link to="/register" className="hover:text-slate-900 transition-colors whitespace-nowrap">
                Create Account
              </Link>
            </>
          )}
        </div>
      </div>
      <div className="border-t border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <span>© {new Date().getFullYear()} HireCraft. All rights reserved.</span>
          <span>Bengaluru · Mumbai · Gurugram · Hyderabad · Pune · Chennai · Remote</span>
        </div>
      </div>
    </footer>
  );
}
