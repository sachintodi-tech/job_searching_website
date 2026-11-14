import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Briefcase, CheckCircle2, FileText } from 'lucide-react';
import { api } from '../api/client';
import { Footer } from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { NICHES, type PublicStatsResponse } from '../types';

const NICHE_DESCRIPTIONS: Record<string, string> = {
  'Data Analytics': 'Product telemetry, SQL experimentation, risk modeling, and BI leadership.',
  'Web Development': 'Full-stack TypeScript, React interfaces, and resilient Node.js APIs.',
  'Digital Marketing': 'Performance acquisition, technical SEO, and lifecycle CRM automation.',
  Design: 'Product systems, UX field research across Bharat, and editorial craft.',
  Finance: 'Strategic FP&A, fintech treasury operations, and corporate finance.',
  Sales: 'Enterprise SaaS closing, mid-market partnerships, and outbound SDR.',
  HR: 'Technical talent acquisition, HR business partnering, and people ops.',
  'Content Writing': 'Developer documentation, UX product copy, and B2B research.',
};

const HERO_IMAGE = '/src/assets/images/hero_hirecraft_studio_1794637864093.jpg';
const PROOF_IMAGE = '/src/assets/images/proof_interview_session_1794637864387.jpg';

export function LandingPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<PublicStatsResponse | null>(null);
  const [heroImgFailed, setHeroImgFailed] = useState(false);
  const [proofImgFailed, setProofImgFailed] = useState(false);

  useEffect(() => {
    api
      .get<PublicStatsResponse>('/public/stats')
      .then((res) => setStats(res.data))
      .catch(() => {
        // Fallback gracefully if stats fail
      });
  }, []);

  const totalJobs = stats?.totalJobs ?? 28;

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA] text-slate-900">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="border-b border-slate-200 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 lg:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
              <div className="lg:col-span-6 flex flex-col justify-center">
                <p className="text-sm font-medium text-blue-800 mb-3">
                  Specialized hiring across India
                </p>
                <h1
                  className="font-display font-bold tracking-tight text-blue-900 leading-[1.1] text-balance"
                  style={{ fontSize: 'clamp(2.25rem, 4vw, 3.5rem)' }}
                >
                  Your Career Moves Faster in the Right Field.
                </h1>
                <p className="mt-5 text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
                  HireCraft filters out irrelevant listings from day one. Pick your primary discipline, review curated Indian roles with transparent INR compensation, and apply with a single PDF resume.
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-4">
                  {user ? (
                    <Link
                      to="/jobs"
                      className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-blue-800 hover:bg-blue-900 rounded-lg transition-colors whitespace-nowrap"
                    >
                      Open {user.niche} Feed
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  ) : (
                    <>
                      <Link
                        to="/register"
                        className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-blue-800 hover:bg-blue-900 rounded-lg transition-colors whitespace-nowrap"
                      >
                        Create Account
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                      <Link
                        to="/login"
                        className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-slate-800 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors whitespace-nowrap"
                      >
                        Sign In
                      </Link>
                    </>
                  )}
                </div>
              </div>

              <div className="lg:col-span-6 flex">
                <div className="w-full rounded-xl overflow-hidden border border-slate-200 bg-slate-100 min-h-[280px] lg:min-h-[380px] flex">
                  {!heroImgFailed ? (
                    <img
                      src={HERO_IMAGE}
                      alt="Specialists collaborating in a sunlit Bengaluru workspace"
                      referrerPolicy="no-referrer"
                      onError={() => setHeroImgFailed(true)}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-slate-100 to-slate-200 text-slate-600 text-center">
                      <Briefcase className="w-10 h-10 mb-3 text-blue-800" />
                      <p className="font-display font-semibold text-slate-800">
                        Curated Tech, Product & Business Teams Across India
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 4-column quantitative proof strip */}
            <div className="mt-12 pt-8 border-t border-slate-200 grid grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <div className="font-mono text-2xl sm:text-3xl font-semibold text-slate-900 tabular-nums">
                  8
                </div>
                <div className="mt-1 text-sm text-slate-600">Focused career disciplines</div>
              </div>
              <div>
                <div className="font-mono text-2xl sm:text-3xl font-semibold text-slate-900 tabular-nums">
                  {totalJobs}+
                </div>
                <div className="mt-1 text-sm text-slate-600">Active Indian openings</div>
              </div>
              <div>
                <div className="font-mono text-2xl sm:text-3xl font-semibold text-slate-900 tabular-nums">
                  100%
                </div>
                <div className="mt-1 text-sm text-slate-600">INR compensation bands listed</div>
              </div>
              <div>
                <div className="font-mono text-2xl sm:text-3xl font-semibold text-slate-900 tabular-nums">
                  2 MB
                </div>
                <div className="mt-1 text-sm text-slate-600">Direct PDF resume upload</div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Disciplines */}
        <section id="niches" className="max-w-6xl mx-auto px-4 sm:px-6 py-16 lg:py-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 text-balance">
                Eight Disciplines, Zero Clutter
              </h2>
              <p className="mt-2 text-base text-slate-600 max-w-2xl">
                Choose your primary track during sign-up to tailor your default feed, or toggle across all disciplines whenever you explore adjacent roles.
              </p>
            </div>
            <Link
              to={user ? '/jobs' : '/register'}
              className="text-sm font-medium text-blue-800 hover:text-blue-900 inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              {user ? 'Go to Job Feed' : 'Select your discipline'}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {NICHES.map((niche, idx) => {
              const count = stats?.nicheCounts?.[niche];
              const target = user
                ? `/jobs?niche=${encodeURIComponent(niche)}&showAll=true`
                : `/register?niche=${encodeURIComponent(niche)}`;

              return (
                <Link
                  key={niche}
                  to={target}
                  className="group bg-white border border-slate-200 hover:border-slate-400 rounded-xl p-5 flex flex-col justify-between transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 text-xs text-slate-500 font-mono tabular-nums mb-3">
                      <span>0{idx + 1}</span>
                      <span>
                        {count !== undefined ? `${count} open ${count === 1 ? 'role' : 'roles'}` : 'Active track'}
                      </span>
                    </div>
                    <h3 className="font-display text-lg font-semibold text-slate-900 group-hover:text-blue-800 transition-colors">
                      {niche}
                    </h3>
                    <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                      {NICHE_DESCRIPTIONS[niche]}
                    </p>
                  </div>
                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-medium text-slate-700 group-hover:text-blue-800">
                    <span>{user ? 'Browse roles' : 'Explore this discipline'}</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="border-t border-slate-200 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 lg:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
              <div className="lg:col-span-5 flex">
                <div className="w-full rounded-xl overflow-hidden border border-slate-200 bg-slate-100 min-h-[280px] flex">
                  {!proofImgFailed ? (
                    <img
                      src={PROOF_IMAGE}
                      alt="Hiring lead reviewing a candidate portfolio in a calm glass meeting room"
                      referrerPolicy="no-referrer"
                      onError={() => setProofImgFailed(true)}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-slate-100 text-slate-600 text-center">
                      <FileText className="w-10 h-10 mb-3 text-blue-800" />
                      <p className="font-display font-semibold text-slate-800">
                        Direct Review & Transparent Status Tracking
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="lg:col-span-7 flex flex-col justify-center">
                <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 text-balance">
                  How HireCraft Works
                </h2>
                <p className="mt-2 text-base text-slate-600">
                  Built to replace sprawling job boards with a focused, transparent application pipeline.
                </p>

                <div className="mt-8 divide-y divide-slate-200 border-t border-b border-slate-200">
                  <div className="py-5 flex items-start gap-4">
                    <span className="font-mono text-sm font-semibold text-blue-800 tabular-nums pt-0.5">
                      01.
                    </span>
                    <div>
                      <h3 className="font-display text-base font-semibold text-slate-900">
                        Declare Your Primary Discipline
                      </h3>
                      <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                        Select your core craft when creating your account. Your job feed automatically prioritizes openings in that discipline.
                      </p>
                    </div>
                  </div>

                  <div className="py-5 flex items-start gap-4">
                    <span className="font-mono text-sm font-semibold text-blue-800 tabular-nums pt-0.5">
                      02.
                    </span>
                    <div>
                      <h3 className="font-display text-base font-semibold text-slate-900">
                        Filter by Indian City, Format & Experience
                      </h3>
                      <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                        Narrow down Bengaluru, Mumbai, Gurugram, Hyderabad, Pune, Chennai, or Remote-India roles by job type and seniority, or toggle all disciplines anytime.
                      </p>
                    </div>
                  </div>

                  <div className="py-5 flex items-start gap-4">
                    <span className="font-mono text-sm font-semibold text-blue-800 tabular-nums pt-0.5">
                      03.
                    </span>
                    <div>
                      <h3 className="font-display text-base font-semibold text-slate-900">
                        Apply Once with PDF Resume & Track Progress
                      </h3>
                      <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                        Submit your phone number, a 2MB PDF resume, and a tailored cover note. Duplicate applications are blocked, and every status update appears in My Applications.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex items-center gap-4">
                  <Link
                    to={user ? '/jobs' : '/register'}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-blue-800 hover:bg-blue-900 rounded-lg transition-colors"
                  >
                    {user ? 'Explore Matching Roles' : 'Start Your Search'}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    Free for candidates
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
