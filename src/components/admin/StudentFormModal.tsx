"use client";

import { useEffect, useState } from "react";
import { ADDITIONAL_SUBJECTS, SUBJECTS, type PackageId } from "@/lib/constants";
import {
  createStudentAction,
  deleteStudentAction,
  updateStudentAction,
} from "@/lib/admin/actions";
import {
  ADMIN_PACKAGE_LABELS,
  ADMIN_PACKAGE_ORDER,
  SOURCES,
  formatEuro,
  getPackage,
  type SourceId,
  type Student,
} from "@/lib/admin/students";

const SUBJECT_SUGGESTIONS = [
  ...SUBJECTS.map((s) => s.title),
  ...ADDITIONAL_SUBJECTS.flatMap((group) => group.items),
];

type Props = {
  student: Student | null;
  onClose: () => void;
  onSaved: (student: Student) => void;
  onDeleted: (id: string) => void;
};

export function StudentFormModal({ student, onClose, onSaved, onDeleted }: Props) {
  const isEdit = student !== null;
  const [name, setName] = useState(student?.name ?? "");
  const [subject, setSubject] = useState(student?.subject ?? "");
  const [packageId, setPackageId] = useState<PackageId | null>(student?.packageId ?? null);
  const [source, setSource] = useState<SourceId | null>(student?.source ?? null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && !saving && onClose();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose, saving]);

  const packageChanged = isEdit && packageId !== student.packageId;
  const selected = packageId ? getPackage(packageId) : null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !subject.trim()) return setError("Name and subject are required.");
    if (!packageId) return setError("Choose a package type.");

    setSaving(true);
    setError(null);
    const input = { name, subject, packageId, source };
    const res = isEdit
      ? await updateStudentAction(student.id, input)
      : await createStudentAction(input);
    setSaving(false);

    if (!res.ok) return setError(res.error);
    onSaved(res.data);
  }

  async function handleDelete() {
    if (!student) return;
    setSaving(true);
    setError(null);
    const res = await deleteStudentAction(student.id);
    setSaving(false);
    if (!res.ok) return setError(res.error);
    onDeleted(student.id);
  }

  return (
    <div
      className="admin-fade fixed inset-0 z-50 flex items-end justify-center bg-[#0B1E3F]/40 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      onMouseDown={(e) => e.target === e.currentTarget && !saving && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="student-form-title"
        className="admin-rise max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-[1.75rem] bg-white p-6 shadow-2xl sm:rounded-[1.75rem] sm:p-8"
      >
        <div className="flex items-center justify-between">
          <h2 id="student-form-title" className="text-2xl font-bold">
            {isEdit ? "Edit student" : "Add student"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            aria-label="Close"
            className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-[#0B1E3F]"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
              <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <Field label="Name" htmlFor="student-name">
            <input
              id="student-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={80}
              required
              autoFocus={!isEdit}
              placeholder="e.g. Giulia Rossi"
              className={inputClass}
            />
          </Field>

          <Field label="Subject" htmlFor="student-subject">
            <input
              id="student-subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              maxLength={80}
              required
              list="subject-suggestions"
              placeholder="e.g. Analisi 1"
              className={inputClass}
            />
            <datalist id="subject-suggestions">
              {SUBJECT_SUGGESTIONS.map((s) => (
                <option key={s} value={s} />
              ))}
            </datalist>
          </Field>

          <fieldset>
            <legend className={labelClass}>Package type</legend>
            <div className="mt-2 grid gap-2.5">
              {ADMIN_PACKAGE_ORDER.map((id) => {
                const pkg = getPackage(id);
                const active = packageId === id;
                return (
                  <label
                    key={id}
                    className={`flex cursor-pointer items-center justify-between gap-3 rounded-2xl border px-4 py-3.5 transition ${
                      active
                        ? "border-emerald-400 bg-emerald-50/70 ring-4 ring-emerald-500/10"
                        : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="package"
                        value={id}
                        checked={active}
                        onChange={() => setPackageId(id)}
                        required
                        className="h-4 w-4 accent-emerald-600"
                      />
                      <span>
                        <span className="block text-sm font-semibold">{ADMIN_PACKAGE_LABELS[id]}</span>
                        <span className="block text-xs text-slate-500">
                          {pkg.hours} {pkg.hours === 1 ? "lesson" : "lessons"}
                        </span>
                      </span>
                    </span>
                    <span className="text-base font-bold tabular-nums">{formatEuro(pkg.value)}</span>
                  </label>
                );
              })}
            </div>
            {selected && (
              <p className="mt-2.5 text-xs text-slate-500">
                Total: {selected.hours} {selected.hours === 1 ? "lesson" : "lessons"} ·{" "}
                {formatEuro(selected.value)}
                {packageChanged &&
                  student.lessonsCompleted > selected.hours &&
                  ` · completed lessons will be capped at ${selected.hours}`}
              </p>
            )}
          </fieldset>

          <fieldset>
            <legend className={labelClass}>
              Acquisition source <span className="font-normal text-slate-400">(optional)</span>
            </legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {SOURCES.map((s) => {
                const active = source === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSource(active ? null : s.id)}
                    aria-pressed={active}
                    className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                      active
                        ? "border-[#0B1E3F] bg-[#0B1E3F] text-white"
                        : "border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    {s.label}
                  </button>
                );
              })}
            </div>
          </fieldset>

          {error && (
            <p role="alert" className="admin-fade rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
              {error}
            </p>
          )}

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
            {isEdit ? (
              confirmDelete ? (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={saving}
                    className="rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:opacity-60"
                  >
                    Yes, remove
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(false)}
                    disabled={saving}
                    className="rounded-xl px-3 py-2.5 text-sm font-medium text-slate-500 hover:text-[#0B1E3F]"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  className="rounded-xl px-1 py-2.5 text-left text-sm font-semibold text-rose-600 transition hover:text-rose-700"
                >
                  Remove student
                </button>
              )
            ) : (
              <span />
            )}

            <button
              type="submit"
              disabled={saving}
              className="rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition hover:-translate-y-0.5 hover:shadow-xl disabled:translate-y-0 disabled:opacity-60"
            >
              {saving ? "Saving…" : isEdit ? "Save changes" : "Add student"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const labelClass = "text-sm font-semibold text-[#0B1E3F]";
const inputClass =
  "mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-500/15";

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className={labelClass}>
        {label}
      </label>
      {children}
    </div>
  );
}
