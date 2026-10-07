"use client";

import {
  ADMIN_PACKAGE_LABELS,
  earnedValue,
  formatEuro,
  sourceLabel,
  type Student,
} from "@/lib/admin/students";

type Props = {
  student: Student;
  index: number;
  onAdjust: (delta: 1 | -1) => void;
  onEdit: () => void;
};

export function StudentCard({ student, index, onAdjust, onEdit }: Props) {
  const { lessonsCompleted: done, totalLessons: total } = student;
  const remaining = total - done;
  const finished = remaining === 0;
  const progress = total > 0 ? (done / total) * 100 : 0;
  const source = sourceLabel(student.source);

  return (
    <article
      className="admin-card admin-rise group flex flex-col p-6 transition-shadow duration-300 hover:shadow-[0_20px_48px_-16px_rgba(11,30,63,0.22)] sm:p-7"
      style={{ animationDelay: `${Math.min(index, 8) * 50}ms` }}
    >
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-xl font-bold">{student.name}</h3>
          <p className="mt-0.5 truncate text-sm font-medium text-slate-500">{student.subject}</p>
        </div>
        <button
          type="button"
          onClick={onEdit}
          aria-label={`Edit ${student.name}`}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-[#0B1E3F]"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
            <path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16v4Z" strokeLinejoin="round" />
            <path d="m13.5 6.5 4 4" />
          </svg>
        </button>
      </header>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-[#0B1E3F]/[0.06] px-3 py-1 text-xs font-semibold text-[#0B1E3F]">
          {ADMIN_PACKAGE_LABELS[student.packageId]}
        </span>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
          {formatEuro(student.packageValue)}
        </span>
        {finished && (
          <span className="admin-fade inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-3 py-1 text-xs font-semibold text-white shadow-sm shadow-emerald-500/30">
            <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="currentColor" aria-hidden>
              <path d="M8.1 14.2 3.9 10l1.4-1.4 2.8 2.8 6.6-6.6 1.4 1.4-8 8Z" />
            </svg>
            Completato
          </span>
        )}
      </div>

      <div className="mt-7 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => onAdjust(-1)}
          disabled={done <= 0}
          aria-label="Remove one completed lesson"
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white text-[#0B1E3F] shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md active:scale-95 disabled:pointer-events-none disabled:opacity-35"
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2.5} aria-hidden>
            <path d="M5 12h14" strokeLinecap="round" />
          </svg>
        </button>

        <p className="text-center tabular-nums" aria-live="polite">
          <span key={done} className="admin-pop text-5xl font-extrabold tracking-tight text-[#0B1E3F]">
            {done}
          </span>
          <span className="ml-1.5 text-2xl font-semibold text-slate-300">/ {total}</span>
        </p>

        <button
          type="button"
          onClick={() => onAdjust(1)}
          disabled={finished}
          aria-label="Add one completed lesson"
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-500/30 active:scale-95 disabled:pointer-events-none disabled:opacity-35"
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2.5} aria-hidden>
            <path d="M12 5v14M5 12h14" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <div className="mt-6 h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#1D3F8F] to-emerald-500 transition-[width] duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div>
          <dt className="text-slate-400">Completed</dt>
          <dd className="font-semibold">
            {done} {done === 1 ? "lesson" : "lessons"}
          </dd>
        </div>
        <div className="text-right">
          <dt className="text-slate-400">Remaining</dt>
          <dd className={`font-semibold ${finished ? "text-emerald-600" : ""}`}>
            {remaining} {remaining === 1 ? "lesson" : "lessons"}
          </dd>
        </div>
      </dl>

      <footer className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4 text-xs text-slate-500">
        <span>
          Earned <span className="font-semibold text-[#0B1E3F]">{formatEuro(earnedValue(student))}</span>{" "}
          of {formatEuro(student.packageValue)}
        </span>
        {source && <span className="rounded-full bg-slate-100 px-2.5 py-1 font-medium">{source}</span>}
      </footer>
    </article>
  );
}
