import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, CheckCircle2, ChevronLeft, ChevronRight, RotateCcw, Search } from 'lucide-react';
import { api, extractApiError } from '../api/client';
import { useAuth } from '../context/AuthContext';
import {
  EXPERIENCE_LEVELS,
  INDIAN_LOCATIONS,
  JOB_TYPES,
  NICHES,
  type Job,
  type JobsResponse,
} from '../types';

function formatPostedDate(isoDate: string): string {
  const date = new Date(isoDate);
  const diffDays = Math.max(0, Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24)));
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return '1 day ago';
  if (diffDays < 30) return `${diffDays} days ago`;
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function JobsFeedPage() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [showAllNiches, setShowAllNiches] = useState(
    searchParams.get('showAll') === 'true'
  );
  const [selectedNiche, setSelectedNiche] = useState(
    searchParams.get('niche') || (showAllNiches ? 'all' : user?.niche || '')
  );
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');
  const [activeSearch, setActiveSearch] = useState(searchParams.get('search') || '');
  const [locationFilter, setLocationFilter] = useState(searchParams.get('location') || 'all');
  const [typeFilter, setTypeFilter] = useState(searchParams.get('type') || 'all');
  const [experienceFilter, setExperienceFilter] = useState(
    searchParams.get('experienceLevel') || 'all'
  );
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);

  const [jobs, setJobs] = useState<Job[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);

    try {
      const params: Record<string, string | number> = {
        page,
        limit: 8,
        showAll: showAllNiches ? 'true' : 'false',
      };

      if (showAllNiches && selectedNiche && selectedNiche !== 'all') {
        params.niche = selectedNiche;
      } else if (!showAllNiches) {
        params.niche = user.niche;
      }

      if (activeSearch.trim()) params.search = activeSearch.trim();
      if (locationFilter !== 'all') params.location = locationFilter;
      if (typeFilter !== 'all') params.type = typeFilter;
      if (experienceFilter !== 'all') params.experienceLevel = experienceFilter;

      const { data } = await api.get<JobsResponse>('/jobs', { params });
      setJobs(data.jobs);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError(extractApiError(err, 'Unable to load job listings.'));
    } finally {
      setLoading(false);
    }
  }, [user, page, showAllNiches, selectedNiche, activeSearch, locationFilter, typeFilter, experienceFilter]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  useEffect(() => {
    const nextParams = new URLSearchParams();
    if (showAllNiches) nextParams.set('showAll', 'true');
    if (showAllNiches && selectedNiche !== 'all') nextParams.set('niche', selectedNiche);
    if (activeSearch.trim()) nextParams.set('search', activeSearch.trim());
    if (locationFilter !== 'all') nextParams.set('location', locationFilter);
    if (typeFilter !== 'all') nextParams.set('type', typeFilter);
    if (experienceFilter !== 'all') nextParams.set('experienceLevel', experienceFilter);
    if (page > 1) nextParams.set('page', String(page));
    setSearchParams(nextParams, { replace: true });
  }, [
    showAllNiches,
    selectedNiche,
    activeSearch,
    locationFilter,
    typeFilter,
    experienceFilter,
    page,
    setSearchParams,
  ]);

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    setPage(1);
    setActiveSearch(searchInput);
  };

  const handleToggleShowAll = () => {
    const nextShowAll = !showAllNiches;
    setShowAllNiches(nextShowAll);
    setSelectedNiche(nextShowAll ? 'all' : user?.niche || '');
    setPage(1);
  };

  const handleResetFilters = () => {
    setSearchInput('');
    setActiveSearch('');
    setLocationFilter('all');
    setTypeFilter('all');
    setExperienceFilter('all');
    setShowAllNiches(false);
    setSelectedNiche(user?.niche || '');
    setPage(1);
  };

  const hasCustomFilters =
    Boolean(activeSearch) ||
    locationFilter !== 'all' ||
    typeFilter !== 'all' ||
    experienceFilter !== 'all' ||
    showAllNiches;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#FAFAFA] py-8 sm:py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <p className="text-sm text-slate-600">
              {showAllNiches ? (
                <>Showing openings across all disciplines</>
              ) : (
                <>
                  Default feed for <span className="font-semibold text-slate-900">{user?.niche}</span>{' '}
                  <span aria-hidden="true">·</span>{' '}
                  <Link to="/profile" className="text-blue-800 hover:underline">
                    Change discipline
                  </Link>
                </>
              )}
            </p>
            <h1 className="mt-1 font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Open Roles
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              role="switch"
              aria-checked={showAllNiches}
              onClick={handleToggleShowAll}
              className={`inline-flex items-center gap-2.5 px-4 py-2 text-sm font-medium rounded-lg border transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                showAllNiches
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-50'
              }`}
            >
              <span
                className={`w-8 h-4.5 rounded-full relative transition-colors ${
                  showAllNiches ? 'bg-blue-500' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                    showAllNiches ? 'translate-x-3.5' : 'translate-x-0'
                  }`}
                />
              </span>
              Show all disciplines
            </button>
          </div>
        </div>

        <div className="mt-6 bg-white border border-slate-200 rounded-xl p-4 space-y-3">
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="search"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search by role title, company, or skill..."
                aria-label="Search jobs"
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800/20 focus:border-blue-800"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 text-sm font-medium text-white bg-blue-800 hover:bg-blue-900 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Search
            </button>
          </form>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <div>
              <label htmlFor="filter-niche" className="sr-only">
                Filter by Discipline
              </label>
              <select
                id="filter-niche"
                disabled={!showAllNiches}
                value={showAllNiches ? selectedNiche : user?.niche || ''}
                onChange={(e) => {
                  setSelectedNiche(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg disabled:bg-slate-50 disabled:text-slate-500 focus:outline-none focus:border-blue-800"
              >
                {showAllNiches && <option value="all">All Disciplines</option>}
                {NICHES.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="filter-location" className="sr-only">
                Filter by Location
              </label>
              <select
                id="filter-location"
                value={locationFilter}
                onChange={(e) => {
                  setLocationFilter(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-blue-800"
              >
                <option value="all">All Locations</option>
                {INDIAN_LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="filter-type" className="sr-only">
                Filter by Job Type
              </label>
              <select
                id="filter-type"
                value={typeFilter}
                onChange={(e) => {
                  setTypeFilter(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-blue-800"
              >
                <option value="all">All Job Types</option>
                {JOB_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="filter-experience" className="sr-only">
                Filter by Experience Level
              </label>
              <select
                id="filter-experience"
                value={experienceFilter}
                onChange={(e) => {
                  setExperienceFilter(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-blue-800"
              >
                <option value="all">All Experience Levels</option>
                {EXPERIENCE_LEVELS.map((exp) => (
                  <option key={exp} value={exp}>
                    {exp}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={handleResetFilters}
              disabled={!hasCustomFilters}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors cursor-pointer whitespace-nowrap"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Filters
            </button>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between text-xs text-slate-500">
          <span className="font-mono tabular-nums">
            {loading ? 'Loading roles...' : `${total} ${total === 1 ? 'role' : 'roles'} found`}
          </span>
          {totalPages > 1 && (
            <span className="font-mono tabular-nums">
              Page {page} of {totalPages}
            </span>
          )}
        </div>

        {error && (
          <div
            role="alert"
            className="mt-4 px-4 py-3 text-sm text-rose-800 bg-rose-50 border border-rose-200 rounded-xl"
          >
            {error}
          </div>
        )}

        {loading ? (
          <div className="mt-4 space-y-3" aria-label="Loading jobs">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="bg-white border border-slate-200 rounded-xl p-5 animate-pulse flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-2.5 flex-1">
                  <div className="h-5 w-56 bg-slate-200 rounded" />
                  <div className="h-4 w-80 bg-slate-100 rounded" />
                </div>
                <div className="h-9 w-28 bg-slate-100 rounded-lg" />
              </div>
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className="mt-4 bg-white border border-slate-200 rounded-xl p-10 text-center">
            <h2 className="font-display text-lg font-semibold text-slate-900">
              No roles match your current filters
            </h2>
            <p className="mt-1.5 text-sm text-slate-600 max-w-md mx-auto">
              Try clearing your search terms, widening location filters, or browsing across all 8 career disciplines.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              {!showAllNiches && (
                <button
                  type="button"
                  onClick={handleToggleShowAll}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-800 hover:bg-blue-900 rounded-lg transition-colors cursor-pointer"
                >
                  Show All Disciplines
                </button>
              )}
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-4 bg-white border border-slate-200 rounded-xl divide-y divide-slate-200 overflow-hidden">
            {jobs.map((job) => (
              <Link
                key={job.id}
                to={`/jobs/${job.id}`}
                className="block p-5 hover:bg-slate-50/80 transition-colors group"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                      <h2 className="font-display text-lg font-semibold text-slate-900 group-hover:text-blue-800 transition-colors">
                        {job.title}
                      </h2>
                      <span className="text-sm font-medium text-slate-700">{job.company}</span>
                    </div>

                    <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-600">
                      <span>{job.niche}</span>
                      <span aria-hidden="true">·</span>
                      <span>{job.location}</span>
                      <span aria-hidden="true">·</span>
                      <span>{job.type}</span>
                      <span aria-hidden="true">·</span>
                      <span>{job.experienceLevel}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-slate-500">{formatPostedDate(job.postedAt)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-5 shrink-0">
                    <div className="text-left md:text-right">
                      <div className="font-mono text-sm font-semibold text-slate-900 tabular-nums">
                        {job.salaryRange}
                      </div>
                      {job.appliedStatus && (
                        <div className="mt-0.5 inline-flex items-center gap-1 text-xs font-medium text-emerald-700">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{job.appliedStatus}</span>
                        </div>
                      )}
                    </div>

                    <span className="inline-flex items-center gap-1 text-sm font-medium text-blue-800 group-hover:translate-x-0.5 transition-transform whitespace-nowrap">
                      {job.appliedStatus ? 'View' : 'View Role'}
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {!loading && totalPages > 1 && (
          <nav
            aria-label="Job feed pagination"
            className="mt-6 flex items-center justify-between gap-4"
          >
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            <div className="flex items-center gap-1.5">
              {Array.from({ length: totalPages }).map((_, index) => {
                const pageNumber = index + 1;
                const active = pageNumber === page;
                return (
                  <button
                    key={pageNumber}
                    type="button"
                    onClick={() => setPage(pageNumber)}
                    aria-current={active ? 'page' : undefined}
                    className={`w-9 h-9 text-sm font-mono tabular-nums rounded-lg transition-colors cursor-pointer ${
                      active
                        ? 'bg-blue-800 text-white font-semibold'
                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg cursor-pointer"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </nav>
        )}
      </div>
    </div>
  );
}
