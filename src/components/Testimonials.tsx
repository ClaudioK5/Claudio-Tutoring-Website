"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { TESTIMONIALS } from "@/lib/constants";
import { Reveal } from "./Reveal";

const PREVIEW_LENGTH = 155;
const GAP_PX = 20;

/**
 * Testimonianze — carousel orizzontale premium.
 * Testi lunghi troncati; click sulla card per espandere.
 */
export function Testimonials() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollerRef = useRef<HTMLDivElement>(null);

  const updateScrollState = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setCanPrev(el.scrollLeft > 8);
    setCanNext(el.scrollLeft < max - 8);

    const cards = el.querySelectorAll<HTMLElement>("[data-testimonial-card]");
    if (!cards.length) return;
    const mid = el.scrollLeft + el.clientWidth / 2;
    let closest = 0;
    let best = Infinity;
    cards.forEach((card, i) => {
      const center = card.offsetLeft + card.offsetWidth / 2;
      const dist = Math.abs(center - mid);
      if (dist < best) {
        best = dist;
        closest = i;
      }
    });
    setActiveIndex(closest);
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [updateScrollState]);

  function scrollByCard(direction: -1 | 1) {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-testimonial-card]");
    const step = card ? card.offsetWidth + GAP_PX : 340;
    el.scrollBy({ left: direction * step, behavior: "smooth" });
  }

  function scrollToIndex(index: number) {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelectorAll<HTMLElement>("[data-testimonial-card]")[index];
    if (!card) return;
    el.scrollTo({ left: card.offsetLeft - 4, behavior: "smooth" });
  }

  return (
    <section id="testimonials" className="section-pad overflow-hidden">
      <div className="container-page">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">Dicono di me</p>
            <h2 className="mt-3 font-display text-3xl text-navy sm:text-4xl">
              Parole di chi ha già fatto lezione
            </h2>
          </div>
        </Reveal>
      </div>

      <div className="relative mt-10">
        {/* Soft edge fades */}
        <div
          className={`pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-ivory to-transparent transition-opacity sm:w-16 ${
            canPrev ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden
        />
        <div
          className={`pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-ivory to-transparent transition-opacity sm:w-16 ${
            canNext ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden
        />

        <div
          ref={scrollerRef}
          className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-[max(1rem,calc((100%-1120px)/2+1rem))] pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:px-[max(1.5rem,calc((100%-1120px)/2+1.5rem))]"
          style={{ scrollPaddingInline: "max(1rem, calc((100% - 1120px) / 2 + 1rem))" }}
        >
          {TESTIMONIALS.map((item) => {
            const rating = "rating" in item ? item.rating : 5;
            const isLong = item.quote.length > PREVIEW_LENGTH;
            const isOpen = openId === item.id;
            const displayQuote =
              isLong && !isOpen
                ? `${item.quote.slice(0, PREVIEW_LENGTH).trimEnd()}…`
                : item.quote;

            return (
              <figure
                key={item.id}
                data-testimonial-card
                className={`card-surface flex w-[min(85vw,19.5rem)] shrink-0 snap-start flex-col p-6 sm:w-[21rem] sm:p-7 ${
                  isLong ? "cursor-pointer hover:border-navy/15" : ""
                }`}
                onClick={() => {
                  if (!isLong) return;
                  setOpenId(isOpen ? null : item.id);
                }}
                onKeyDown={(e) => {
                  if (!isLong) return;
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setOpenId(isOpen ? null : item.id);
                  }
                }}
                role={isLong ? "button" : undefined}
                tabIndex={isLong ? 0 : undefined}
                aria-expanded={isLong ? isOpen : undefined}
              >
                <div
                  className="mb-4 flex items-center gap-0.5"
                  aria-label={`${rating} su 5 stelle`}
                >
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <svg
                      key={idx}
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill={idx < rating ? "#C9A45C" : "none"}
                      stroke={idx < rating ? "#C9A45C" : "#D0D5DD"}
                      strokeWidth="1.5"
                      aria-hidden
                    >
                      <path d="M12 3.5l2.4 4.9 5.4.8-3.9 3.8.9 5.4L12 15.9 7.2 18.4l.9-5.4L4.2 9.2l5.4-.8L12 3.5z" />
                    </svg>
                  ))}
                </div>

                <blockquote className="min-h-[7.5rem] flex-1 text-[0.95rem] leading-relaxed text-slate">
                  “{displayQuote}”
                </blockquote>

                {isLong && (
                  <p className="mt-3 text-xs font-semibold tracking-wide text-blue">
                    {isOpen ? "Mostra meno" : "Continua a leggere"}
                  </p>
                )}

                <figcaption className="mt-5 border-t border-navy/8 pt-4">
                  <p className="text-sm font-semibold text-navy">{item.name}</p>
                  {(item.subject || item.result) && (
                    <p className="mt-0.5 text-xs leading-snug text-slate">
                      {[item.subject, item.result].filter(Boolean).join(" · ")}
                    </p>
                  )}
                </figcaption>
              </figure>
            );
          })}
        </div>
      </div>

      <div className="container-page mt-6">
        <div className="flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => scrollByCard(-1)}
            disabled={!canPrev}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-navy/10 bg-white text-navy shadow-[0_4px_14px_rgba(16,27,54,0.04)] transition hover:border-navy/20 hover:bg-navy/[0.03] disabled:pointer-events-none disabled:opacity-30"
            aria-label="Recensioni precedenti"
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

          <div className="flex items-center gap-2" role="tablist" aria-label="Navigazione recensioni">
            {TESTIMONIALS.map((item, i) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={i === activeIndex}
                aria-label={`Vai alla recensione ${i + 1}`}
                onClick={() => scrollToIndex(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === activeIndex ? "w-6 bg-blue" : "w-1.5 bg-navy/15 hover:bg-navy/30"
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => scrollByCard(1)}
            disabled={!canNext}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-navy/10 bg-white text-navy shadow-[0_4px_14px_rgba(16,27,54,0.04)] transition hover:border-navy/20 hover:bg-navy/[0.03] disabled:pointer-events-none disabled:opacity-30"
            aria-label="Recensioni successive"
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
        </div>
      </div>
    </section>
  );
}
