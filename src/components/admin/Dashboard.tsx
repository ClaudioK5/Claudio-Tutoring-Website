"use client";

import { useCallback, useRef, useState } from "react";
import { adjustLessonsAction, logout } from "@/lib/admin/actions";
import type { StorageMode } from "@/lib/admin/store";
import { clampLessons, earnedValue, formatEuro, type Student } from "@/lib/admin/students";
import { StudentCard } from "./StudentCard";
import { StudentFormModal } from "./StudentFormModal";

type Props = {
  initialStudents: Student[];
  storageMode: StorageMode;
  loadError: string | null;
};

type ModalState = { open: false } | { open: true; student: Student | null };

export function Dashboard({ initialStudents, storageMode, loadError }: Props) {
  const [students, setStudents] = useState(initialStudents);
  const [modal, setModal] = useState<ModalState>({ open: false });
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const canEdit = storageMode !== "none" && !loadError;
  const earnings = students.reduce((sum, s) => sum + earnedValue(s), 0);
  const lessonsDone = students.reduce((sum, s) => sum + s.lessonsCompleted, 0);

  const showToast = useCallback((message: string) => {
    setToast(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 4000);
  }, []);

  const shift = (id: string, delta: number) =>
    setStudents((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, lessonsCompleted: clampLessons(s.lessonsCompleted + delta, s.totalLessons) }
          : s,
      ),
    );

  async function adjust(student: Student, delta: 1 | -1) {
    const next = clampLessons(student.lessonsCompleted + delta, student.totalLessons);
    if (next === student.lessonsCompleted) return;

    shift(student.id, delta);
    try {
      const res = await adjustLessonsAction(student.id, delta);
      if (!res.ok) {
        shift(student.id, -delta);
        showToast(res.error);
      }
    } catch {
      shift(student.id, -delta);
      showToast("Couldn't save. Check your connection and try again.");
    }
  }

  const closeModal = useCallback(() => setModal({ open: false }), []);

  function handleSaved(saved: Student) {
    setStudents((prev) =>
      prev.some((s) => s.id === saved.id)
        ? prev.map((s) => (s.id === saved.id ? saved : s))
        : [...prev, saved],
    );
    closeModal();
  }

  function handleDeleted(id: string) {
    setStudents((prev) => prev.filter((s) => s.id !== id));
    closeModal();
  }

  return (
    <div className="mx-auto max-w-6xl px-5 pb-20 pt-6 sm:px-8 sm:pt-10">
      <header className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#0B1E3F] to-[#1D3F8F] text-sm font-bold text-white shadow-md">
            CA
          </div>
          <div>
            <p className="text-sm font-bold leading-tight">Claudio Asaro</p>
            <p className="text-xs text-slate-500">Tutoring dashboard</p>
          </div>
        </div>
        <form action={logout}>
          <button
            type="submit"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-slate-300 hover:text-[#0B1E3F]"
          >
            Log out
          </button>
        </form>
      </header>

      {storageMode === "none" && (
        <Notice tone="error">
          <strong>Database not connected.</strong> Add <code>DATABASE_URL</code> (Neon) in the Vercel
          environment variables and redeploy to start saving students.
        </Notice>
      )}
      {storageMode === "file" && (
        <Notice tone="info">
          <strong>Local test mode.</strong> Students are saved in <code>.data/students.json</code> on
          this computer only. Connect Neon before using the dashboard live.
        </Notice>
      )}
      {loadError && <Notice tone="error">{loadError}</Notice>}

      <section className="admin-rise relative mt-8 overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#0B1E3F] via-[#13306B] to-[#0B5D4E] p-7 text-white shadow-[0_30px_60px_-24px_rgba(11,30,63,0.55)] sm:p-10">
        <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-emerald-400/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-blue-400/20 blur-3xl" />

        <div className="relative">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-emerald-300">
            Expected earnings next month
          </p>
          <p
            key={earnings}
            className="admin-pop mt-3 text-5xl font-extrabold tabular-nums tracking-tight sm:text-7xl"
          >
            {formatEuro(earnings)}
          </p>
          <p className="mt-3 max-w-md text-sm text-white/70">
            Value of the lessons completed across all current packages.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Stat label={students.length === 1 ? "student" : "students"} value={students.length} />
            <Stat label={lessonsDone === 1 ? "lesson completed" : "lessons completed"} value={lessonsDone} />
          </div>
        </div>
      </section>

      <section className="mt-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold sm:text-3xl">Students</h2>
            <p className="mt-1 text-sm text-slate-500">Tap + after each lesson.</p>
          </div>
          <AddButton disabled={!canEdit} onClick={() => setModal({ open: true, student: null })} />
        </div>

        {students.length === 0 ? (
          <div className="admin-card admin-rise mt-6 flex flex-col items-center px-6 py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
                <circle cx="12" cy="8" r="3.5" />
                <path d="M5 20a7 7 0 0 1 14 0" strokeLinecap="round" />
              </svg>
            </div>
            <h3 className="mt-5 text-lg font-bold">No students yet</h3>
            <p className="mt-1 max-w-xs text-sm text-slate-500">
              Add your first student to start tracking lessons and earnings.
            </p>
          </div>
        ) : (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {students.map((student, i) => (
              <StudentCard
                key={student.id}
                student={student}
                index={i}
                onAdjust={(delta) => (canEdit ? adjust(student, delta) : undefined)}
                onEdit={() => canEdit && setModal({ open: true, student })}
              />
            ))}
          </div>
        )}
      </section>

      {modal.open && (
        <StudentFormModal
          key={modal.student?.id ?? "new"}
          student={modal.student}
          onClose={closeModal}
          onSaved={handleSaved}
          onDeleted={handleDeleted}
        />
      )}

      {toast && (
        <div
          role="status"
          className="admin-rise fixed inset-x-0 bottom-6 z-[60] mx-auto w-fit max-w-[90vw] rounded-2xl bg-[#0B1E3F] px-5 py-3 text-sm font-medium text-white shadow-2xl"
        >
          {toast}
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm backdrop-blur">
      <span className="font-bold tabular-nums">{value}</span>{" "}
      <span className="text-white/70">{label}</span>
    </span>
  );
}

function AddButton({ onClick, disabled }: { onClick: () => void; disabled: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-emerald-500/30 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-500/35 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2.5} aria-hidden>
        <path d="M12 5v14M5 12h14" strokeLinecap="round" />
      </svg>
      Add student
    </button>
  );
}

function Notice({ tone, children }: { tone: "info" | "error"; children: React.ReactNode }) {
  const styles =
    tone === "error"
      ? "border-rose-200 bg-rose-50 text-rose-800"
      : "border-amber-200 bg-amber-50 text-amber-800";
  return (
    <div className={`admin-fade mt-6 rounded-2xl border px-5 py-4 text-sm leading-relaxed ${styles}`}>
      {children}
    </div>
  );
}
