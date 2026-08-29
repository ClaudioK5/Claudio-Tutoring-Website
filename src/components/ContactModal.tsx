"use client";

import { useEffect, useId, useState, type FormEvent } from "react";
import { useContact } from "@/lib/contact-context";
import { CONTACT } from "@/lib/constants";

/**
 * Modale di contatto / prenotazione.
 * Collega Formspree, Resend, EmailJS, ecc. sostituendo handleSubmit.
 */
export function ContactModal() {
  const { isOpen, closeContact } = useContact();
  if (!isOpen) return null;
  return <ContactModalContent onClose={closeContact} />;
}

function ContactModalContent({ onClose }: { onClose: () => void }) {
  const titleId = useId();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);

    const form = e.currentTarget;
    const data = new FormData(form);

    // Punto di integrazione:
    // await fetch("https://formspree.io/f/YOUR_ID", { method: "POST", body: data, headers: { Accept: "application/json" } });
    console.info("Richiesta prenotazione (collega un servizio form più avanti):", Object.fromEntries(data));

    await new Promise((r) => setTimeout(r, 450));
    setSubmitting(false);
    setSubmitted(true);
    form.reset();
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <button
        type="button"
        className="absolute inset-0 bg-navy/55 backdrop-blur-[2px]"
        aria-label="Chiudi modulo di contatto"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-white shadow-[0_30px_80px_rgba(16,27,54,0.35)]">
        <div className="flex items-start justify-between gap-4 border-b border-navy/8 px-5 py-4 sm:px-6">
          <div>
            <p className="eyebrow mb-1">Prenota</p>
            <h2 id={titleId} className="font-display text-2xl text-navy">
              Raccontami un attimo
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate hover:bg-navy/5 hover:text-navy"
            aria-label="Chiudi"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="px-5 py-5 sm:px-6">
          {submitted ? (
            <div className="py-6 text-center">
              <p className="font-display text-xl text-navy">Messaggio ricevuto</p>
              <p className="mt-2 text-sm leading-relaxed text-slate">
                {CONTACT.email
                  ? `Ti rispondo appena posso. Se preferisci, puoi anche scrivermi a ${CONTACT.email}.`
                  : "Ti rispondo appena posso con disponibilità e prossimi passi."}
              </p>
              <button type="button" className="btn-primary mt-6" onClick={onClose}>
                Chiudi
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <Field label="Nome" name="name" required autoComplete="name" />
              <Field label="Email" name="email" type="email" required autoComplete="email" />
              <Field label="Materia" name="subject" required placeholder="es. Analisi 1" />
              <Field
                label="Scuola o università"
                name="level"
                required
                placeholder="es. Uni — primo anno"
              />
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-navy">
                  Dove sei bloccato?
                </span>
                <textarea
                  name="message"
                  required
                  rows={4}
                  className="w-full rounded-xl border border-navy/12 bg-ivory/60 px-3.5 py-2.5 text-sm text-navy outline-none transition focus:border-blue focus:bg-white focus:ring-2 focus:ring-blue/20"
                  placeholder="Argomento, data esame, cosa non ti torna…"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-navy">
                  Come preferisci che ti risponda?
                </span>
                <select
                  name="preferredContact"
                  required
                  className="w-full rounded-xl border border-navy/12 bg-ivory/60 px-3.5 py-2.5 text-sm text-navy outline-none transition focus:border-blue focus:bg-white focus:ring-2 focus:ring-blue/20"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Scegli…
                  </option>
                  <option value="email">Email</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="telegram">Telegram</option>
                </select>
              </label>

              <button type="submit" className="btn-primary mt-2 w-full" disabled={submitting}>
                {submitting ? "Sto inviando…" : "Invia"}
              </button>
              <p className="text-center text-xs text-slate">
                Niente spam. Ti rispondo solo sulla lezione.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-navy">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="w-full rounded-xl border border-navy/12 bg-ivory/60 px-3.5 py-2.5 text-sm text-navy outline-none transition focus:border-blue focus:bg-white focus:ring-2 focus:ring-blue/20"
      />
    </label>
  );
}
