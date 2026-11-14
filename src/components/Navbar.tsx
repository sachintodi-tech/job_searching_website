import { useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setMobileOpen(false);
    navigate('/');
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors whitespace-nowrap shrink-0 pb-0.5 border-b-2 ${
      isActive
        ? 'text-white border-blue-400'
        : 'text-slate-300 border-transparent hover:text-white hover:border-slate-500'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-line brand wordmark */}
        <Link
          to={user ? '/jobs' : '/'}
          className="font-display text-xl font-bold tracking-tight text-white whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-400 rounded-sm"
        >
          HireCraft
        </Link>

        {/* Zone 2: Concise single-line nav links */}
        {user ? (
          <nav className="hidden md:flex items-center gap-7" aria-label="Primary navigation">
            <NavLink to="/jobs" className={navLinkClass}>
              Job Feed
            </NavLink>
            <NavLink to="/applications" className={navLinkClass}>
              My Applications
            </NavLink>
            <NavLink to="/profile" className={navLinkClass}>
              Profile
            </NavLink>
          </nav>
        ) : (
          <nav className="hidden md:flex items-center gap-7" aria-label="Primary navigation">
            <a
              href={location.pathname === '/' ? '#niches' : '/#niches'}
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors whitespace-nowrap shrink-0"
            >
              Disciplines
            </a>
            <a
              href={location.pathname === '/' ? '#how-it-works' : '/#how-it-works'}
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors whitespace-nowrap shrink-0"
            >
              How It Works
            </a>
            <NavLink to="/login" className={navLinkClass}>
              Sign In
            </NavLink>
          </nav>
        )}

        {/* Zone 3: Single primary action */}
        <div className="hidden md:flex items-center shrink-0">
          {user ? (
            <button
              type="button"
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-slate-100 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400"
            >
              Sign Out
            </button>
          ) : (
            <Link
              to="/register"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-700 hover:bg-blue-600 rounded-lg transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400"
            >
              Get Started
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={mobileOpen}
          className="md:hidden p-2.5 -mr-2 text-slate-200 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-2">
          {user ? (
            <>
              <Link
                to="/jobs"
                onClick={() => setMobileOpen(false)}
                className="block py-2.5 px-3 text-sm font-medium text-slate-800 hover:bg-slate-50 rounded-lg"
              >
                Job Feed
              </Link>
              <Link
                to="/applications"
                onClick={() => setMobileOpen(false)}
                className="block py-2.5 px-3 text-sm font-medium text-slate-800 hover:bg-slate-50 rounded-lg"
              >
                My Applications
              </Link>
              <Link
                to="/profile"
                onClick={() => setMobileOpen(false)}
                className="block py-2.5 px-3 text-sm font-medium text-slate-800 hover:bg-slate-50 rounded-lg"
              >
                Profile
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="w-full text-left py-2.5 px-3 text-sm font-medium text-rose-700 hover:bg-rose-50 rounded-lg"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <a
                href="/#niches"
                onClick={() => setMobileOpen(false)}
                className="block py-2.5 px-3 text-sm font-medium text-slate-800 hover:bg-slate-50 rounded-lg"
              >
                Disciplines
              </a>
              <a
                href="/#how-it-works"
                onClick={() => setMobileOpen(false)}
                className="block py-2.5 px-3 text-sm font-medium text-slate-800 hover:bg-slate-50 rounded-lg"
              >
                How It Works
              </a>
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="block py-2.5 px-3 text-sm font-medium text-slate-800 hover:bg-slate-50 rounded-lg"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileOpen(false)}
                className="block text-center py-2.5 px-4 text-sm font-medium text-white bg-blue-800 hover:bg-blue-900 rounded-lg"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
