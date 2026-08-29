"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Reveal } from "./Reveal";

const SLIDES = [
  {
    id: "analisi",
    label: "Analisi 1 · Integrazione per parti",
    caption: "Un esercizio spiegato passaggio dopo passaggio.",
    image: "/images/board-analisi.png",
    alt: "Lavagna iDroo — esempio di integrazione per parti in Analisi 1",
  },
  {
    id: "fisica",
    label: "Termodinamica · Espansione isobara",
    caption: "Formule, grafico P–V e interpretazione del processo.",
    image: "/images/board-fisica.png",
    alt: "Lavagna iDroo — esercizio di termodinamica con grafico P-V",
  },
  {
    id: "chimica",
    label: "Chimica · Soluzione tampone",
    caption: "Calcolo del pH con procedimento e rappresentazione visiva.",
    image: "/images/board-chimica.png",
    alt: "Lavagna iDroo — calcolo del pH di una soluzione tampone",
  },
] as const;

export function BoardGallery() {
  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const slide = SLIDES[index];

  const goTo = useCallback((i: number) => {
    setIndex((i + SLIDES.length) % SLIDES.length);
  }, []);

  const prev = useCallback(() => goTo(index - 1), [goTo, index]);
  const next = useCallback(() => goTo(index + 1), [goTo, index]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prev, next]);

  return (
    <Reveal delayMs={60}>
      <div className="mt-9">
        <div className="mx-auto max-w-xl text-center">
          <h3 className="font-display text-2xl text-navy sm:text-[1.7rem]">
            Ecco come lavoriamo durante la lezione.
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-slate sm:text-[0.95rem]">
            Su iDroo posso scrivere formule, fare grafici e risolvere esercizi con te
            passo dopo passo.
          </p>
        </div>

        <div className="mx-auto mt-[18px] w-full max-w-[660px]">
          <div
            className="overflow-hidden rounded-xl border border-navy/8 bg-white p-1.5 shadow-[0_6px_18px_rgba(16,27,54,0.05)] sm:p-2"
            onTouchStart={(e) => {
              touchStartX.current = e.changedTouches[0]?.clientX ?? null;
            }}
            onTouchEnd={(e) => {
              if (touchStartX.current == null) return;
              const delta = e.changedTouches[0].clientX - touchStartX.current;
              touchStartX.current = null;
              if (Math.abs(delta) < 40) return;
              if (delta > 0) prev();
              else next();
            }}
          >
            <div className="overflow-hidden rounded-lg bg-[#eef3f8]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                key={slide.id}
                src={slide.image}
                alt={slide.alt}
                className="mx-auto h-auto w-full object-contain"
              />
            </div>
          </div>

          <div className="mt-3 flex flex-col items-center gap-2.5 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-center sm:text-left">
              <p className="text-sm font-semibold text-navy">{slide.label}</p>
              <p className="mt-0.5 text-sm text-slate">{slide.caption}</p>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={prev}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-navy/10 bg-white text-navy transition hover:bg-navy/5"
                aria-label="Esempio precedente"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path
                    d="M15 6l-6 6 6 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <span className="min-w-[2.75rem] text-center text-sm font-medium text-slate">
                {index + 1} / {SLIDES.length}
              </span>
              <button
                type="button"
                onClick={next}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-navy/10 bg-white text-navy transition hover:bg-navy/5"
                aria-label="Esempio successivo"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path
                    d="M9 6l6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
