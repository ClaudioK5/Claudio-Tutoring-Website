"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ESERCIZIARI_PRODUCTS } from "@/lib/eserciziari";
import { Reveal } from "./Reveal";
import { HomePreviewCard } from "./eserciziari/HomePreviewCard";

const GAP_PX = 20;

/**
 * Homepage eserciziari — carousel orizzontale (come recensioni),
 * così il catalogo può crescere senza allungare tutta la pagina.
 */
export function EserciziariPreview() {
  const products = ESERCIZIARI_PRODUCTS;
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

    const cards = el.querySelectorAll<HTMLElement>("[data-eserciziario-card]");
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
  }, [updateScrollState, products.length]);

  function scrollByCard(direction: -1 | 1) {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-eserciziario-card]");
    const step = card ? card.offsetWidth + GAP_PX : 340;
    el.scrollBy({ left: direction * step, behavior: "smooth" });
  }

  function scrollToIndex(index: number) {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelectorAll<HTMLElement>("[data-eserciziario-card]")[index];
    if (!card) return;
    el.scrollTo({ left: card.offsetLeft - 4, behavior: "smooth" });
  }

  return (
    <section
      id="eserciziari-preview"
      className="section-pad relative overflow-hidden border-y border-navy/8 bg-ivory"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.45]"
        style={{
          background:
            "radial-gradient(ellipse 55% 45% at 10% 0%, rgba(29,63,143,0.06), transparent 55%), radial-gradient(ellipse 40% 35% at 95% 100%, rgba(201,164,92,0.07), transparent 50%)",
        }}
        aria-hidden
      />

      <div className="container-page relative">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">Eserciziari</p>
            <h2 className="mt-3 font-display text-3xl text-navy sm:text-4xl">
              Eserciziari pensati sugli esercizi d&apos;esame
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate sm:text-lg">
              Eserciziari pensati per darti sempre nuovo materiale su cui allenarti: trovi sia
              esercizi specifici che possono comparire negli esami universitari ma che spesso
              sono difficili da reperire online, sia numerose nuove varianti sugli argomenti
              più comuni.
            </p>
          </div>
        </Reveal>
      </div>

      <div className="relative mt-10">
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
          {products.map((product) => (
            <div
              key={product.slug}
              data-eserciziario-card
              className="w-[min(85vw,19.5rem)] shrink-0 snap-start sm:w-[21rem]"
            >
              <HomePreviewCard product={product} />
            </div>
          ))}
        </div>
      </div>

      <div className="container-page relative mt-6">
        <div className="flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => scrollByCard(-1)}
            disabled={!canPrev}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-navy/10 bg-white text-navy shadow-[0_4px_14px_rgba(16,27,54,0.04)] transition hover:border-navy/20 hover:bg-navy/[0.03] disabled:pointer-events-none disabled:opacity-30"
            aria-label="Eserciziari precedenti"
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

          <div
            className="flex max-w-[min(100%,14rem)] flex-wrap items-center justify-center gap-2"
            role="tablist"
            aria-label="Navigazione eserciziari"
          >
            {products.map((product, i) => (
              <button
                key={product.slug}
                type="button"
                role="tab"
                aria-selected={i === activeIndex}
                aria-label={`Vai a ${product.title}`}
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
            aria-label="Eserciziari successivi"
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

        <Reveal delayMs={120}>
          <div className="mt-10 flex justify-center">
            <Link href="/eserciziari" className="btn-primary">
              Scopri gli eserciziari
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
