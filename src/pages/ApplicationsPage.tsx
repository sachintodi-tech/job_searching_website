import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Clock, Eye, FileText, XCircle } from 'lucide-react';
import { api, extractApiError } from '../api/client';
import { APPLICATION_STATUSES, type ApplicationItem, type ApplicationStatus } from '../types';

function StatusIndicator({ status }: { status: ApplicationStatus }) {
  switch (status) {
    case 'Shortlisted':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-md whitespace-nowrap">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Shortlisted
        </span>
      );
    case 'Under Review':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-amber-800 bg-amber-50 border border-amber-200 rounded-md whitespace-nowrap">
          <Eye className="w-3.5 h-3.5" />
          Under Review
        </span>
      );
    case 'Rejected':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-rose-800 bg-rose-50 border border-rose-200 rounded-md whitespace-nowrap">
          <XCircle className="w-3.5 h-3.5" />
          Rejected
        </span>
      );
    case 'Applied':
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 border border-slate-200 rounded-md whitespace-nowrap">
          <Clock className="w-3.5 h-3.5" />
          Applied
        </span>
      );
  }
}

export function ApplicationsPage() {
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | ApplicationStatus>('all');

  useEffect(() => {
    setLoading(true);
    api
      .get<{ applications: ApplicationItem[] }>('/applications/mine')
      .then((res) => setApplications(res.data.applications))
      .catch((err) => setError(extractApiError(err, 'Unable to load applications.')))
      .finally(() => setLoading(false));
  }, []);

  const filtered =
    statusFilter === 'all'
      ? applications
      : applications.filter((app) => app.status === statusFilter);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#FAFAFA] py-8 sm:py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              My Applications
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Track every role you have applied to, review your submitted PDF resume, and monitor hiring stages.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 border border-slate-200 rounded-lg">
            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                statusFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({applications.length})
            </button>
            {APPLICATION_STATUSES.map((st) => {
              const count = applications.filter((a) => a.status === st).length;
              return (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                    statusFilter === st
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {st} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {error && (
          <div
            role="alert"
            className="mt-6 px-4 py-3 text-sm text-rose-800 bg-rose-50 border border-rose-200 rounded-xl"
          >
            {error}
          </div>
        )}

        {loading ? (
          <div className="mt-6 space-y-3" aria-label="Loading applications">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="bg-white border border-slate-200 rounded-xl p-5 animate-pulse flex items-center justify-between"
              >
                <div className="space-y-2">
                  <div className="h-5 w-52 bg-slate-200 rounded" />
                  <div className="h-4 w-72 bg-slate-100 rounded" />
                </div>
                <div className="h-7 w-24 bg-slate-100 rounded-md" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="mt-6 bg-white border border-slate-200 rounded-xl p-10 text-center">
            <h2 className="font-display text-lg font-semibold text-slate-900">
              {applications.length === 0
                ? 'No applications submitted yet'
                : `No applications marked as ${statusFilter}`}
            </h2>
            <p className="mt-1.5 text-sm text-slate-600 max-w-md mx-auto">
              {applications.length === 0
                ? 'Explore openings tailored to your primary discipline and submit your PDF resume directly.'
                : 'Switch back to All to inspect your other submitted applications.'}
            </p>
            <div className="mt-6">
              {applications.length === 0 ? (
                <Link
                  to="/jobs"
                  className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-white bg-blue-800 hover:bg-blue-900 rounded-lg transition-colors"
                >
                  Explore Matching Roles
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => setStatusFilter('all')}
                  className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg cursor-pointer"
                >
                  Show All Applications
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="mt-6 bg-white border border-slate-200 rounded-xl divide-y divide-slate-200 overflow-hidden">
            {filtered.map((app) => {
              const appliedDate = new Date(app.appliedAt).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              });

              return (
                <div key={app.id} className="p-5 sm:p-6">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                        <Link
                          to={`/jobs/${app.job.id}`}
                          className="font-display text-lg font-semibold text-slate-900 hover:text-blue-800 transition-colors"
                        >
                          {app.job.title}
                        </Link>
                        <span className="text-sm font-medium text-slate-700">{app.job.company}</span>
                      </div>

                      <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-600">
                        <span>{app.job.niche}</span>
                        <span aria-hidden="true">·</span>
                        <span>{app.job.location}</span>
                        <span aria-hidden="true">·</span>
                        <span>{app.job.type}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono tabular-nums">{app.job.salaryRange}</span>
                      </div>

                      <p className="mt-3 text-sm text-slate-600 line-clamp-2 max-w-2xl">
                        {app.coverNote}
                      </p>
                    </div>

                    <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-3 shrink-0">
                      <StatusIndicator status={app.status} />

                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span className="font-mono tabular-nums">Applied {appliedDate}</span>
                        <a
                          href={app.resumeUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 font-medium text-blue-800 hover:underline whitespace-nowrap"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          Resume PDF
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
