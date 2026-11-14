import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, FileText } from 'lucide-react';
import { api, extractApiError } from '../api/client';
import { ApplyModal } from '../components/ApplyModal';
import { useAuth } from '../context/AuthContext';
import type { ApplicationStatus, Job } from '../types';

interface JobDetailResponse {
  job: Job;
  hasApplied: boolean;
  application: {
    id: string;
    status: ApplicationStatus;
    appliedAt: string;
    resumeUrl: string;
  } | null;
}

export function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  const [data, setData] = useState<JobDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showApplyModal, setShowApplyModal] = useState(false);

  const loadJob = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<JobDetailResponse>(`/jobs/${id}`);
      setData(res.data);
    } catch (err) {
      setError(extractApiError(err, 'Unable to load this role.'));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadJob();
  }, [loadJob]);

  const handleApplicationSuccess = () => {
    setShowApplyModal(false);
    loadJob();
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-[#FAFAFA] py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6 animate-pulse">
          <div className="h-4 w-48 bg-slate-200 rounded" />
          <div className="bg-white border border-slate-200 rounded-xl p-8 space-y-4">
            <div className="h-8 w-80 bg-slate-200 rounded" />
            <div className="h-4 w-64 bg-slate-100 rounded" />
            <div className="h-32 w-full bg-slate-100 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-[#FAFAFA] py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 bg-white border border-slate-200 rounded-xl p-8 text-center">
          <h1 className="font-display text-xl font-bold text-slate-900">Role Unavailable</h1>
          <p className="mt-2 text-sm text-slate-600">{error || 'This job listing could not be found.'}</p>
          <Link
            to="/jobs"
            className="mt-6 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-800 hover:bg-blue-900 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Job Feed
          </Link>
        </div>
      </div>
    );
  }

  const { job, hasApplied, application } = data;
  const postedFormatted = new Date(job.postedAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#FAFAFA] py-8 sm:py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <nav className="flex items-center gap-2 text-sm text-slate-600 mb-6" aria-label="Breadcrumb">
          <Link to="/jobs" className="inline-flex items-center gap-1.5 hover:text-slate-900 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Job Feed
          </Link>
          <span aria-hidden="true">/</span>
          <span>{job.niche}</span>
          <span aria-hidden="true">/</span>
          <span className="text-slate-900 font-medium truncate">{job.title}</span>
        </nav>

        <article className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="p-6 sm:p-8 border-b border-slate-200 flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div>
              <p className="text-sm font-medium text-slate-700">{job.company}</p>
              <h1 className="mt-1 font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 text-balance">
                {job.title}
              </h1>

              <div className="mt-3 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-sm text-slate-600">
                <span>{job.niche}</span>
                <span aria-hidden="true">·</span>
                <span>{job.location}</span>
                <span aria-hidden="true">·</span>
                <span>{job.type}</span>
                <span aria-hidden="true">·</span>
                <span>{job.experienceLevel}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono text-xs text-slate-500 tabular-nums">
                  Posted {postedFormatted}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row md:flex-col items-start sm:items-center md:items-end justify-between gap-3 shrink-0">
              <div className="md:text-right">
                <div className="text-xs text-slate-500">Compensation</div>
                <div className="font-mono text-lg font-semibold text-slate-900 tabular-nums">
                  {job.salaryRange}
                </div>
              </div>

              {hasApplied ? (
                <div className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Applied ({application?.status || 'Applied'})</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowApplyModal(true)}
                  className="px-6 py-2.5 text-sm font-medium text-white bg-blue-800 hover:bg-blue-900 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
                >
                  Apply Now
                </button>
              )}
            </div>
          </div>

          {hasApplied && application && (
            <div className="px-6 sm:px-8 py-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm">
              <div className="text-slate-700">
                You applied on{' '}
                <span className="font-mono tabular-nums font-medium text-slate-900">
                  {new Date(application.appliedAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
                . Duplicate applications to the same role are disabled.
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <a
                  href={application.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 font-medium text-slate-700 hover:text-slate-900"
                >
                  <FileText className="w-4 h-4" />
                  View Resume PDF
                </a>
                <Link
                  to="/applications"
                  className="font-medium text-blue-800 hover:text-blue-900"
                >
                  Track in My Applications
                </Link>
              </div>
            </div>
          )}

          <div className="p-6 sm:p-8 space-y-8">
            <section>
              <h2 className="font-display text-lg font-semibold text-slate-900">
                Role Overview
              </h2>
              <p className="mt-3 text-base text-slate-700 leading-relaxed max-w-3xl">
                {job.description}
              </p>
            </section>

            <section>
              <h2 className="font-display text-lg font-semibold text-slate-900">
                Requirements
              </h2>
              <ul className="mt-3 space-y-2.5 max-w-3xl">
                {job.requirements.map((req, index) => (
                  <li key={index} className="flex items-start gap-3 text-base text-slate-700">
                    <span className="font-mono text-xs text-slate-400 pt-1.5 tabular-nums">
                      0{index + 1}
                    </span>
                    <span className="leading-relaxed">{req}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </article>
      </div>

      {showApplyModal && (
        <ApplyModal
          job={job}
          defaultPhone={user?.phone || ''}
          onClose={() => setShowApplyModal(false)}
          onSuccess={handleApplicationSuccess}
        />
      )}
    </div>
  );
}
