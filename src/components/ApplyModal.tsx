import { useState, type ChangeEvent, type FormEvent } from 'react';
import { FileText, Upload, X } from 'lucide-react';
import { api, extractApiError } from '../api/client';
import type { Job } from '../types';

interface ApplyModalProps {
  job: Job;
  defaultPhone?: string;
  onClose: () => void;
  onSuccess: () => void;
}

const MAX_PDF_BYTES = 2 * 1024 * 1024;

export function ApplyModal({ job, defaultPhone = '', onClose, onSuccess }: ApplyModalProps) {
  const [phone, setPhone] = useState(defaultPhone);
  const [coverNote, setCoverNote] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) {
      setResumeFile(null);
      return;
    }

    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    if (!isPdf) {
      setError('Only PDF files (.pdf) are accepted for resumes.');
      e.target.value = '';
      setResumeFile(null);
      return;
    }

    if (file.size > MAX_PDF_BYTES) {
      setError('Resume PDF exceeds the 2MB limit. Please upload a smaller file.');
      e.target.value = '';
      setResumeFile(null);
      return;
    }

    setResumeFile(file);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const digitsOnly = phone.replace(/\D/g, '');
    if (digitsOnly.length < 10) {
      setError('Please enter a valid 10-digit phone number.');
      return;
    }

    if (!resumeFile) {
      setError('Please attach your resume as a PDF (max 2MB).');
      return;
    }

    if (coverNote.trim().length < 15) {
      setError('Please include a cover note of at least 15 characters.');
      return;
    }

    const formData = new FormData();
    formData.append('phone', phone.trim());
    formData.append('coverNote', coverNote.trim());
    formData.append('resume', resumeFile);

    setSubmitting(true);
    try {
      await api.post(`/jobs/${job.id}/apply`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      onSuccess();
    } catch (err) {
      setError(extractApiError(err, 'Unable to submit application.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-[2px] p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="apply-modal-title"
    >
      <div className="bg-white border border-slate-200 rounded-xl w-full max-w-lg shadow-xl overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200 flex items-start justify-between gap-4">
          <div>
            <h2 id="apply-modal-title" className="font-display text-lg font-bold text-slate-900">
              Apply to {job.title}
            </h2>
            <p className="text-sm text-slate-600 mt-0.5">
              {job.company} <span aria-hidden="true">·</span> {job.location} <span aria-hidden="true">·</span>{' '}
              <span className="font-mono text-xs tabular-nums">{job.salaryRange}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close application form"
            className="p-2 -mr-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div
              role="alert"
              className="px-4 py-3 text-sm text-rose-800 bg-rose-50 border border-rose-200 rounded-lg"
            >
              {error}
            </div>
          )}

          <div>
            <label htmlFor="apply-phone" className="block text-sm font-medium text-slate-800 mb-1.5">
              Phone Number
            </label>
            <input
              id="apply-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              required
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800/20 focus:border-blue-800"
            />
          </div>

          <div>
            <label htmlFor="apply-resume" className="block text-sm font-medium text-slate-800 mb-1.5">
              Resume (PDF only, max 2MB)
            </label>
            <label
              htmlFor="apply-resume"
              className="flex flex-col items-center justify-center gap-2 px-4 py-5 border border-dashed border-slate-300 hover:border-blue-800 bg-slate-50/70 rounded-lg cursor-pointer transition-colors"
            >
              {resumeFile ? (
                <div className="flex items-center gap-2.5 text-sm text-slate-800">
                  <FileText className="w-5 h-5 text-blue-800 shrink-0" />
                  <span className="font-medium truncate max-w-[260px]">{resumeFile.name}</span>
                  <span className="font-mono text-xs text-slate-500 tabular-nums">
                    ({(resumeFile.size / 1024).toFixed(0)} KB)
                  </span>
                </div>
              ) : (
                <>
                  <Upload className="w-5 h-5 text-slate-500" />
                  <span className="text-sm text-slate-700 font-medium">Choose PDF resume file</span>
                  <span className="text-xs text-slate-500">Maximum file size: 2 MB</span>
                </>
              )}
              <input
                id="apply-resume"
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleFileChange}
                className="sr-only"
              />
            </label>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="apply-cover" className="block text-sm font-medium text-slate-800">
                Cover Note
              </label>
              <span className="text-xs font-mono tabular-nums text-slate-500">
                {coverNote.length}/2000
              </span>
            </div>
            <textarea
              id="apply-cover"
              rows={4}
              maxLength={2000}
              value={coverNote}
              onChange={(e) => setCoverNote(e.target.value)}
              placeholder="Briefly share relevant outcomes, domain projects, or notice period..."
              required
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800/20 focus:border-blue-800 resize-y"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 text-sm font-medium text-white bg-blue-800 hover:bg-blue-900 disabled:opacity-60 rounded-lg transition-colors cursor-pointer"
            >
              {submitting ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
