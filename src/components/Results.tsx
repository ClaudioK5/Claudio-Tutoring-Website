"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { PROOF_ITEMS } from "@/lib/constants";
import { Reveal } from "./Reveal";

type ProofItem = (typeof PROOF_ITEMS)[number];

/**
 * Esperienza verificabile — prova concreta (piattaforme + percorso).
 * Sezione statica; lightbox con scroll premium se ci sono più immagini.
 */
export function Results() {
  const [active, setActive] = useState<ProofItem | null>(null);
  const [slide, setSlide] = useState(0);

  const open = (item: ProofItem) => {
    setActive(item);
    setSlide(0);
  };

  const close = useCallback(() => {
    setActive(null);
    setSlide(0);
  }, []);

  const slideCount = active?.images.length ?? 0;

  const goTo = useCallback(
    (i: number) => {
      if (!slideCount) return;
      setSlide((i + slideCount) % slideCount);
    },
    [slideCount],
  );

  const prev = useCallback(() => goTo(slide - 1), [goTo, slide]);
  const next = useCallback(() => goTo(slide + 1), [goTo, slide]);

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [active, close, prev, next]);

  return (
    <section
      id="results"
      className="bg-navy pt-9 pb-14 text-white md:pt-11 md:pb-16"
    >
      <div className="container-page">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow mb-0 !leading-none !text-gold">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-gold" aria-hidden />
              Esperienza verificabile
            </p>
            <h2
              className="font-display text-[1.6rem] font-medium leading-[1.15] tracking-tight sm:text-[2rem]"
              style={{ color: "#FFFFFF", marginTop: "14px", marginBottom: "16px" }}
            >
              I numeri parlano da soli.
            </h2>
            <p className="mx-auto max-w-xl text-base leading-relaxed text-white/70">
              Anni di lezioni, piattaforme reali e un percorso accademico che puoi
              verificare.
            </p>
          </div>
        </Reveal>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {PROOF_ITEMS.map((item, i) => {
            const cover = item.images[0];
            const multi = item.images.length > 1;

            return (
              <Reveal key={item.id} delayMs={i * 80}>
                <button
                  type="button"
                  onClick={() => open(item)}
                  className="group flex h-full w-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] text-left shadow-[0_18px_40px_rgba(0,0,0,0.22)] transition hover:border-gold/35 hover:bg-white/[0.06]"
                >
                  <div className="relative">
                    <ProofImage
                      src={cover.src}
                      alt={`${item.title} — ${item.highlight}`}
                      placeholderLabel={item.placeholderLabel}
                    />
                    {multi && (
                      <span className="absolute bottom-3 left-3 z-20 rounded-full bg-navy/80 px-2.5 py-1 text-[0.65rem] font-semibold tracking-wide text-white/90 backdrop-blur-sm">
                        {item.images.length} documenti
                      </span>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col border-t border-white/10 px-5 py-5 sm:px-6">
                    <div className="flex items-start justify-between gap-3">
                      <h3
                        className="font-display text-xl leading-snug"
                        style={{ color: "#C9A45C" }}
                      >
                        {item.title}
                      </h3>
                      <span className="mt-1 shrink-0 rounded-full bg-gold/15 px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-[0.1em] text-gold opacity-0 transition group-hover:opacity-100">
                        Apri
                      </span>
                    </div>
                    <p
                      className="mt-2 font-display text-lg leading-snug"
                      style={{ color: "#C9A45C" }}
                    >
                      {item.highlight}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-white/55">
                      {item.description}
                    </p>
                  </div>
                </button>
              </Reveal>
            );
          })}
        </div>
      </div>

      {active && (
        <ProofLightbox
          item={active}
          slide={slide}
          onClose={close}
          onPrev={prev}
          onNext={next}
          onGoTo={goTo}
        />
      )}
    </section>
  );
}

function ProofLightbox({
  item,
  slide,
  onClose,
  onPrev,
  onNext,
  onGoTo,
}: {
  item: ProofItem;
  slide: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  onGoTo: (i: number) => void;
}) {
  const multi = item.images.length > 1;
  const current = item.images[slide] ?? item.images[0];
  const touchStartX = useRef<number | null>(null);

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
    >
      <button
        type="button"
        className="absolute inset-0 bg-navy/85 backdrop-blur-md"
        aria-label="Chiudi anteprima"
        onClick={onClose}
      />

      <div className="relative z-10 flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0c1529] shadow-[0_28px_80px_rgba(0,0,0,0.45)]">
        <div className="flex shrink-0 items-center justify-between gap-4 border-b border-white/10 px-5 py-4">
          <div className="min-w-0">
            <p className="font-display text-lg text-white">{item.title}</p>
            <p className="mt-0.5 truncate text-sm text-gold">
              {item.highlight}
              {multi ? (
                <span className="text-white/40">
                  {" "}
                  · {slide + 1}/{item.images.length}
                </span>
              ) : null}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-full p-2 text-white/60 transition hover:bg-white/10 hover:text-white"
            aria-label="Chiudi"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {multi && (
          <div className="flex shrink-0 gap-2 px-5 py-3">
            {item.images.map((img, i) => (
              <button
                key={img.src}
                type="button"
                onClick={() => onGoTo(i)}
                className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold tracking-wide transition ${
                  i === slide
                    ? "bg-gold/20 text-gold"
                    : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/80"
                }`}
              >
                {img.label}
              </button>
            ))}
          </div>
        )}

        <div
          className="relative min-h-0 flex-1 overflow-hidden bg-[#080e1c]"
          onTouchStart={(e) => {
            touchStartX.current = e.changedTouches[0]?.clientX ?? null;
          }}
          onTouchEnd={(e) => {
            if (touchStartX.current == null || !multi) return;
            const delta = e.changedTouches[0].clientX - touchStartX.current;
            touchStartX.current = null;
            if (Math.abs(delta) < 45) return;
            if (delta > 0) onPrev();
            else onNext();
          }}
        >
          <div className="max-h-[min(68vh,720px)] overflow-y-auto overscroll-contain p-4 sm:p-6 [scrollbar-width:thin] [scrollbar-color:rgba(201,164,92,0.45)_transparent]">
            <div key={current.src} className="proof-fade">
              <ProofLightboxImage
                src={current.src}
                alt={`${item.title} — ${current.label}`}
                placeholderLabel={item.placeholderLabel}
              />
            </div>
          </div>

          {multi && (
            <>
              <button
                type="button"
                onClick={onPrev}
                className="absolute left-2 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-navy/70 text-white shadow-lg backdrop-blur-sm transition hover:border-gold/40 hover:bg-navy/90 sm:inline-flex"
                aria-label="Documento precedente"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path
                    d="M15 6l-6 6 6 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <button
                type="button"
                onClick={onNext}
                className="absolute right-2 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-navy/70 text-white shadow-lg backdrop-blur-sm transition hover:border-gold/40 hover:bg-navy/90 sm:inline-flex"
                aria-label="Documento successivo"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path
                    d="M9 6l6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </>
          )}
        </div>

        {multi && (
          <div className="flex shrink-0 items-center justify-between gap-3 border-t border-white/10 px-5 py-3.5">
            <p className="text-xs font-medium text-white/45 sm:text-sm">
              {current.label}
            </p>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                {item.images.map((img, i) => (
                  <button
                    key={img.src}
                    type="button"
                    aria-label={img.label}
                    aria-current={i === slide}
                    onClick={() => onGoTo(i)}
                    className={`h-1.5 rounded-full transition-all ${
                      i === slide ? "w-6 bg-gold" : "w-1.5 bg-white/20 hover:bg-white/40"
                    }`}
                  />
                ))}
              </div>
              <div className="flex gap-1.5 sm:hidden">
                <button
                  type="button"
                  onClick={onPrev}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/15 text-white/80"
                  aria-label="Precedente"
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
                <button
                  type="button"
                  onClick={onNext}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/15 text-white/80"
                  aria-label="Successivo"
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
        )}
      </div>
    </div>
  );
}

function ProofImage({
  src,
  alt,
  placeholderLabel,
}: {
  src: string;
  alt: string;
  placeholderLabel: string;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <div className="relative aspect-[5/4] overflow-hidden bg-white/[0.03] sm:aspect-[4/3]">
      {!failed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          className="relative z-10 h-full w-full object-cover object-top"
          onError={() => setFailed(true)}
        />
      ) : null}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2.5 bg-[linear-gradient(155deg,#1a2747_0%,#101b36_55%,#0c1529_100%)] p-6 text-center">
        <span className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-gold">
          {placeholderLabel}
        </span>
        <span className="max-w-[15rem] text-xs leading-relaxed text-white/45">
          Carica lo screenshot o il documento qui. Rimuovi ID e dati privati.
        </span>
        <span className="mt-1 font-mono text-[0.65rem] text-white/25">{src}</span>
      </div>
    </div>
  );
}

function ProofLightboxImage({
  src,
  alt,
  placeholderLabel,
}: {
  src: string;
  alt: string;
  placeholderLabel: string;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="flex min-h-[240px] flex-col items-center justify-center gap-2 rounded-xl border border-white/8 bg-white/[0.03] p-8 text-center">
        <span className="text-xs font-bold uppercase tracking-[0.14em] text-gold">
          {placeholderLabel}
        </span>
        <span className="font-mono text-xs text-white/40">{src}</span>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className="mx-auto max-h-[min(62vh,680px)] w-auto max-w-full rounded-xl object-contain shadow-[0_12px_40px_rgba(0,0,0,0.35)]"
      onError={() => setFailed(true)}
    />
  );
}
