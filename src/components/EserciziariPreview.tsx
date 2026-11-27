"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ESERCIZIARI_PRODUCTS,
  formatProductPrice,
  type EserciziarioProduct,
} from "@/lib/eserciziari";
import { BookPreview } from "./eserciziari/BookPreview";
import { Reveal } from "./Reveal";

/**
 * Homepage — scaffale orizzontale di copertine.
 * Copertine centrate + frecce grandi ai lati per scorrere facilmente.
 */
export function EserciziariPreview() {
  const products = ESERCIZIARI_PRODUCTS;
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [previewProduct, setPreviewProduct] = useState<EserciziarioProduct | null>(
    null,
  );
  const [fitsAll, setFitsAll] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);

  const updateScrollState = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const max = Math.max(0, el.scrollWidth - el.clientWidth);
    const fits = max <= 2;
    setFitsAll(fits);
    setCanPrev(!fits && el.scrollLeft > 4);
    setCanNext(!fits && el.scrollLeft < max - 4);

    const items = el.querySelectorAll<HTMLElement>("[data-shelf-cover]");
    if (!items.length) return;
    const anchor = el.scrollLeft + 24;
    let closest = 0;
    let best = Infinity;
    items.forEach((item, i) => {
      const dist = Math.abs(item.offsetLeft - anchor);
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

    requestAnimationFrame(() => {
      el.scrollLeft = 0;
      updateScrollState();
    });

    el.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [updateScrollState, products.length]);

  function scrollByCover(direction: -1 | 1) {
    const el = scrollerRef.current;
    if (!el) return;
    const cover = el.querySelector<HTMLElement>("[data-shelf-cover]");
    if (!cover) return;
    const styles = getComputedStyle(el);
    const gap = parseFloat(styles.columnGap || styles.gap) || 28;
    const step = cover.getBoundingClientRect().width + gap;
    el.scrollBy({ left: direction * step, behavior: "smooth" });
  }

  return (
    <section
      id="eserciziari-preview"
      className="section-pad relative overflow-hidden border-y border-navy/8 bg-ivory"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.5]"
        style={{
          background:
            "radial-gradient(ellipse 50% 40% at 8% 20%, rgba(29,63,143,0.07), transparent 55%), radial-gradient(ellipse 45% 35% at 92% 80%, rgba(11,93,78,0.05), transparent 50%)",
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
              Materiale d&apos;esame difficile da trovare online, più varianti sugli argomenti
              più richiesti. Scorri lo scaffale e apri un&apos;anteprima.
            </p>
          </div>
        </Reveal>
      </div>

      {/* Scaffale + frecce laterali */}
      <div className="relative mt-12">
        <button
          type="button"
          onClick={() => scrollByCover(-1)}
          disabled={!canPrev}
          className="absolute left-2 top-[38%] z-30 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-navy/10 bg-white text-navy shadow-[0_10px_28px_rgba(16,27,54,0.14)] transition hover:scale-105 hover:border-navy/20 hover:bg-white disabled:cursor-default disabled:opacity-35 sm:left-4 sm:h-14 sm:w-14 md:left-6"
          aria-label="Copertina precedente"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M15 6l-6 6 6 6"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => scrollByCover(1)}
          disabled={!canNext}
          className="absolute right-2 top-[38%] z-30 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-navy/10 bg-white text-navy shadow-[0_10px_28px_rgba(16,27,54,0.14)] transition hover:scale-105 hover:border-navy/20 hover:bg-white disabled:cursor-default disabled:opacity-35 sm:right-4 sm:h-14 sm:w-14 md:right-6"
          aria-label="Copertina successiva"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M9 6l6 6-6 6"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <div
          className={`pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-ivory via-ivory/70 to-transparent sm:w-24 ${
            canPrev ? "opacity-100" : "opacity-40"
          }`}
          aria-hidden
        />
        <div
          className={`pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-ivory via-ivory/70 to-transparent sm:w-24 ${
            canNext ? "opacity-100" : "opacity-40"
          }`}
          aria-hidden
        />

        <div
          ref={scrollerRef}
          className={`flex snap-x snap-mandatory items-end gap-7 overflow-x-auto scroll-smooth px-[max(1rem,calc((100%-1120px)/2+1rem))] pb-2 pt-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-8 md:px-[max(1.5rem,calc((100%-1120px)/2+1.5rem))] ${
            fitsAll ? "justify-center" : ""
          }`}
        >
          {products.map((product, i) => (
            <ShelfCover
              key={product.slug}
              product={product}
              index={i}
              onOpenPreview={() => setPreviewProduct(product)}
            />
          ))}
        </div>

        <div
          className="pointer-events-none mx-auto mt-0 h-px max-w-[1120px] bg-gradient-to-r from-transparent via-navy/15 to-transparent"
          aria-hidden
        />
        <div
          className="pointer-events-none mx-auto h-3 max-w-[1120px] bg-gradient-to-b from-navy/[0.06] to-transparent"
          aria-hidden
        />
      </div>

      <div className="container-page relative mt-6">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.16em] text-slate">
          <span className="tabular-nums text-navy">
            {String(activeIndex + 1).padStart(2, "0")}
          </span>
          <span className="mx-2 text-navy/25">/</span>
          <span className="tabular-nums">
            {String(products.length).padStart(2, "0")}
          </span>
        </p>

        <Reveal delayMs={100}>
          <div className="mt-10 flex justify-center">
            <Link href="/eserciziari" className="btn-primary">
              Vedi tutto il catalogo
            </Link>
          </div>
        </Reveal>
      </div>

      {previewProduct && (
        <BookPreview
          product={previewProduct}
          mode="overlay"
          open={Boolean(previewProduct)}
          onOpenChange={(open) => {
            if (!open) setPreviewProduct(null);
          }}
        />
      )}
    </section>
  );
}

function ShelfCover({
  product,
  index,
  onOpenPreview,
}: {
  product: EserciziarioProduct;
  index: number;
  onOpenPreview: () => void;
}) {
  const href = `/eserciziari/${product.slug}`;

  return (
    <article
      data-shelf-cover
      className="group w-[min(72vw,15.5rem)] shrink-0 snap-start sm:w-[17.5rem] md:w-[18.5rem]"
      style={{ animationDelay: `${Math.min(index, 6) * 40}ms` }}
    >
      <button
        type="button"
        onClick={onOpenPreview}
        className="relative block w-full text-left outline-none focus-visible:ring-2 focus-visible:ring-blue/40 focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
        aria-label={`Apri anteprima di ${product.title}`}
      >
        <div
          className="relative aspect-[3/4] overflow-hidden rounded-[0.65rem] bg-navy transition duration-500 ease-out group-hover:-translate-y-2 group-hover:shadow-[0_28px_50px_-12px_rgba(16,27,54,0.45)]"
          style={{
            boxShadow:
              "0 18px 40px -14px rgba(16,27,54,0.35), 4px 0 0 0 rgba(16,27,54,0.12), 0 0 0 1px rgba(16,27,54,0.06)",
          }}
        >
          <span
            className="pointer-events-none absolute inset-y-0 left-0 z-[1] w-[3%] bg-gradient-to-r from-black/35 via-black/10 to-transparent"
            aria-hidden
          />
          {product.coverImage ? (
            <Image
              src={product.coverImage}
              alt=""
              fill
              sizes="(max-width: 640px) 72vw, 296px"
              className="object-cover transition duration-700 ease-out group-hover:scale-[1.03]"
            />
          ) : (
            <div
              className="absolute inset-0 flex flex-col justify-between p-5 text-white"
              style={{
                background: `linear-gradient(165deg, ${product.coverAccent} 0%, #101B36 78%)`,
              }}
              aria-hidden
            >
              <p className="font-display text-lg leading-tight">{product.title}</p>
              <span className="text-xs text-white/70">{product.subjectLabel}</span>
            </div>
          )}
          <span className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] bg-gradient-to-t from-navy/80 via-navy/20 to-transparent px-3 pb-3 pt-10 opacity-0 transition duration-300 group-hover:opacity-100">
            <span className="block text-center text-[0.7rem] font-bold uppercase tracking-[0.14em] text-white">
              Sfoglia anteprima
            </span>
          </span>
        </div>
      </button>

      <div className="mt-4 px-0.5">
        <p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-blue">
          {product.subjectLabel}
        </p>
        <h3 className="mt-1.5 font-display text-[1.15rem] leading-[1.2] tracking-tight text-navy sm:text-[1.25rem]">
          <Link
            href={href}
            className="transition hover:text-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue/40"
          >
            {product.title}
          </Link>
        </h3>
        <p className="mt-2 text-sm text-slate">
          {product.exerciseCount} esercizi
          <span className="mx-1.5 text-navy/20">·</span>
          {formatProductPrice(product.priceEuro)}
        </p>
      </div>
    </article>
  );
}
