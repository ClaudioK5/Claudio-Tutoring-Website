"use client";

import { useEffect, useState } from "react";
import { ADDITIONAL_SUBJECTS, SUBJECTS, type PackageId } from "@/lib/constants";
import {
  createStudentAction,
  deleteStudentAction,
  updateStudentAction,
} from "@/lib/admin/actions";
import {
  ITEM_LABELS,
  ITEM_ORDER,
  MAX_ITEM_COUNT,
  SOURCES,
  emptyItems,
  formatEuro,
  getPackage,
  itemLabel,
  summarizeItems,
  type ItemCounts,
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
  const [items, setItems] = useState<ItemCounts>(student?.items ?? emptyItems());
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

  const totals = summarizeItems(items);
  const activeItems = ITEM_ORDER.filter((id) => items[id] > 0);
  const missingItems = ITEM_ORDER.filter((id) => items[id] === 0);

  const setCount = (id: PackageId, count: number) =>
    setItems((prev) => ({ ...prev, [id]: Math.min(Math.max(count, 0), MAX_ITEM_COUNT) }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !subject.trim()) return setError("Name and subject are required.");
    if (totals.lessons === 0) return setError("Add at least one lesson or package.");

    setSaving(true);
    setError(null);
    const input = { name, subject, items, source };
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
            <legend className={labelClass}>Lessons & packages</legend>

            {activeItems.length > 0 && (
              <div className="mt-2 grid gap-2.5">
                {activeItems.map((id) => {
                  const pkg = getPackage(id);
                  return (
                    <div
                      key={id}
                      className="admin-fade flex items-center justify-between gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/50 px-4 py-3"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-semibold capitalize">{itemLabel(id, items[id])}</p>
                        <p className="text-xs text-slate-500">
                          {formatEuro(pkg.value)} each · {formatEuro(items[id] * pkg.value)}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-1.5">
                        <StepButton
                          label={`Remove one ${ITEM_LABELS[id].one}`}
                          onClick={() => setCount(id, items[id] - 1)}
                        >
                          <path d="M5 12h14" strokeLinecap="round" />
                        </StepButton>
                        <input
                          type="number"
                          inputMode="numeric"
                          min={0}
                          max={MAX_ITEM_COUNT}
                          value={items[id]}
                          onChange={(e) => setCount(id, Math.floor(Number(e.target.value) || 0))}
                          aria-label={`Number of ${ITEM_LABELS[id].many}`}
                          className="w-12 rounded-lg bg-transparent text-center text-lg font-bold tabular-nums outline-none [appearance:textfield] focus:bg-white [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                        />
                        <StepButton
                          label={`Add one ${ITEM_LABELS[id].one}`}
                          onClick={() => setCount(id, items[id] + 1)}
                          primary
                        >
                          <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                        </StepButton>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {missingItems.length > 0 && (
              <div className="mt-2.5 flex flex-wrap gap-2">
                {missingItems.map((id) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setCount(id, 1)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-slate-300 px-3.5 py-2 text-sm font-medium text-slate-600 transition hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-700"
                  >
                    <span className="text-base leading-none">+</span>
                    <span className="capitalize">{ITEM_LABELS[id].one}</span>
                    <span className="text-slate-400">{formatEuro(getPackage(id).value)}</span>
                  </button>
                ))}
              </div>
            )}

            <p className="mt-3 text-sm font-semibold">
              {totals.lessons > 0 ? (
                <>
                  Total: {totals.lessons} {totals.lessons === 1 ? "lesson" : "lessons"} ·{" "}
                  {formatEuro(totals.value)}
                </>
              ) : (
                <span className="font-normal text-slate-400">Tap what the student bought.</span>
              )}
            </p>
            {isEdit && totals.lessons > 0 && student.lessonsCompleted > totals.lessons && (
              <p className="mt-1 text-xs text-amber-700">
                Completed lessons will be capped at {totals.lessons}.
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

function StepButton({
  label,
  onClick,
  primary = false,
  children,
}: {
  label: string;
  onClick: () => void;
  primary?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`flex h-9 w-9 items-center justify-center rounded-xl transition active:scale-95 ${
        primary
          ? "bg-emerald-500 text-white shadow-sm shadow-emerald-500/30 hover:bg-emerald-600"
          : "border border-slate-200 bg-white text-[#0B1E3F] hover:border-slate-300"
      }`}
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} aria-hidden>
        {children}
      </svg>
    </button>
  );
}
