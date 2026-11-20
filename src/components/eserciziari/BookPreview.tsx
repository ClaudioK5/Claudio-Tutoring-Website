"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import {
  formatProductPrice,
  type BookPreviewPage,
  type EserciziarioProduct,
} from "@/lib/eserciziari";

type Props = {
  product: EserciziarioProduct;
  /** section = blocco in pagina prodotto; overlay = modal da card catalogo */
  mode?: "section" | "overlay";
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return reduced;
}

function isLockedPdfPage(page: BookPreviewPage | undefined) {
  return page?.kind === "pdf" && Boolean(page.locked);
}

function CoverSlide({ src, title }: { src: string; title: string }) {
  return (
    <div className="relative h-full w-full overflow-hidden bg-navy">
      <Image
        src={src}
        alt={`Copertina di ${title}`}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 92vw, 480px"
        priority
        draggable={false}
      />
    </div>
  );
}

function PdfSlide({
  page,
  productTitle,
  locked,
}: {
  page: Extract<BookPreviewPage, { kind: "pdf" }>;
  productTitle: string;
  locked: boolean;
}) {
  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-[#F8F5EE]">
      <div className="relative min-h-0 flex-1">
        <Image
          src={page.src}
          alt={
            locked
              ? `${productTitle} — anteprima bloccata`
              : `${productTitle} — pagina ${page.pdfPage} del PDF`
          }
          fill
          className="object-contain object-top"
          sizes="(max-width: 768px) 92vw, 480px"
          draggable={false}
        />
        {locked && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0B1E3F]/45 px-6 text-center backdrop-blur-[2px]">
            <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white shadow-lg">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M7 11V8a5 5 0 0110 0v3M6 11h12v9H6v-9z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <p className="mt-4 text-sm font-semibold text-white">Anteprima bloccata</p>
            <p className="mt-1.5 max-w-[16rem] text-xs leading-relaxed text-white/70">
              Contenuto visibile in qualità, ma protetto. Sbloccalo con l&apos;eserciziario completo.
            </p>
          </div>
        )}
      </div>
      <p className="shrink-0 border-t border-navy/8 bg-white/90 px-3 py-1.5 text-center text-[11px] font-medium text-slate">
        {locked
          ? "Pagina protetta · anteprima"
          : `Pagina ${page.pdfPage} del PDF${
              page.label && page.label !== `Pagina ${page.pdfPage}` ? ` · ${page.label}` : ""
            }`}
      </p>
    </div>
  );
}

function CtaSlide({ product }: { product: EserciziarioProduct }) {
  return (
    <div
      className="flex h-full w-full flex-col items-center justify-center px-6 py-10 text-center text-white"
      style={{
        background: `linear-gradient(165deg, ${product.coverAccent} 0%, #101B36 80%)`,
      }}
    >
      <p className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-gold">Anteprima</p>
      <p className="mt-4 font-display text-2xl leading-snug sm:text-[1.65rem]">
        Ti è piaciuta l&apos;anteprima?
      </p>
      <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/75">
        Scopri tutti gli esercizi e le soluzioni nel PDF completo.
      </p>
      <p className="mt-6 font-sans text-3xl font-bold tracking-tight">
        {formatProductPrice(product.priceEuro)}
      </p>
      <p className="mt-2 text-xs text-white/60">Eserciziario completo · PDF</p>
    </div>
  );
}

export function BookPreview({
  product,
  mode = "section",
  open: openProp,
  onOpenChange,
}: Props) {
  const pages = product.bookPreview;
  const isOverlay = mode === "overlay";
  const reducedMotion = usePrefersReducedMotion();
  const [internalOpen, setInternalOpen] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => setMounted(true), []);

  const open = isOverlay ? Boolean(openProp) : internalOpen;
  const setOpen = useCallback(
    (next: boolean) => {
      if (isOverlay) onOpenChange?.(next);
      else setInternalOpen(next);
    },
    [isOverlay, onOpenChange],
  );

  const cover = pages.find((p) => p.kind === "cover");
  const pdfPages = pages.filter(
    (p): p is Extract<BookPreviewPage, { kind: "pdf" }> => p.kind === "pdf",
  );
  const nonConsecutive = useMemo(() => {
    const nums = pdfPages.map((p) => p.pdfPage);
    return nums.some((n, i) => i > 0 && n !== nums[i - 1] + 1);
  }, [pdfPages]);

  const totalPages = pages.length;
  const current = pages[pageIndex];
  const locked = isLockedPdfPage(current);

  const goTo = useCallback(
    (i: number) => {
      if (totalPages <= 0) return;
      setPageIndex(((i % totalPages) + totalPages) % totalPages);
    },
    [totalPages],
  );
  const prev = useCallback(() => goTo(pageIndex - 1), [goTo, pageIndex]);
  const next = useCallback(() => goTo(pageIndex + 1), [goTo, pageIndex]);

  useEffect(() => {
    if (isOverlay && open) {
      setFullscreen(true);
      setPageIndex(0);
    }
  }, [isOverlay, open]);

  useEffect(() => {
    const lockedChrome = fullscreen || (isOverlay && open);
    if (!lockedChrome) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isOverlay) setOpen(false);
        else setFullscreen(false);
      }
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [fullscreen, isOverlay, open, setOpen, next, prev]);

  const pageLabel = useMemo(() => {
    if (!current) return "";
    if (current.kind === "cover") return "Copertina";
    if (current.kind === "cta") return "Finale";
    if (locked) return "Pagina protetta";
    return `Pagina PDF ${current.pdfPage}`;
  }, [current, locked]);

  const openPreview = useCallback(() => {
    setOpen(true);
    setPageIndex(0);
  }, [setOpen]);

  const closePreview = useCallback(() => {
    setOpen(false);
    setFullscreen(false);
    setPageIndex(0);
  }, [setOpen]);

  const inFullscreenChrome = fullscreen || isOverlay;

  if (isOverlay && !open) return null;

  const slide = current && (
    <div
      key={`${current.kind}-${pageIndex}`}
      className={`relative mx-auto aspect-[3/4] w-full max-w-[min(100%,420px)] overflow-hidden rounded-2xl bg-white shadow-[0_24px_60px_rgba(0,0,0,0.28)] ring-1 ring-white/10 ${
        reducedMotion ? "" : "preview-slide-fade"
      }`}
      onTouchStart={(e) => {
        touchStartX.current = e.changedTouches[0]?.clientX ?? null;
      }}
      onTouchEnd={(e) => {
        if (touchStartX.current == null) return;
        const delta = e.changedTouches[0].clientX - touchStartX.current;
        touchStartX.current = null;
        if (Math.abs(delta) < 45) return;
        if (delta > 0) prev();
        else next();
      }}
    >
      {current.kind === "cover" && <CoverSlide src={current.src} title={product.title} />}
      {current.kind === "pdf" && (
        <PdfSlide page={current} productTitle={product.title} locked={locked} />
      )}
      {current.kind === "cta" && <CtaSlide product={product} />}
    </div>
  );

  const reader = open && (
    <div
      className={`mx-auto flex w-full flex-col items-center ${
        inFullscreenChrome ? "flex-1 justify-center" : ""
      }`}
    >
      <div className="mb-4 flex w-full max-w-3xl flex-wrap items-center justify-between gap-3">
        <div>
          {isOverlay && (
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-gold">
              {product.title}
            </p>
          )}
          <p className={`text-sm font-medium ${inFullscreenChrome ? "text-white/80" : "text-slate"}`}>
            {pageIndex + 1} / {totalPages}
            <span className="mx-2 opacity-40">·</span>
            {pageLabel}
          </p>
          {nonConsecutive && (
            <p className={`mt-1 text-xs ${inFullscreenChrome ? "text-white/55" : "text-slate"}`}>
              Estratti non consecutivi dal PDF completo.
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {!isOverlay && (
            <ControlButton
              onClick={() => setFullscreen((v) => !v)}
              dark={fullscreen}
              label={fullscreen ? "Esci da schermo intero" : "Schermo intero"}
            />
          )}
          <ControlButton onClick={closePreview} dark={inFullscreenChrome} label="Chiudi" />
        </div>
      </div>

      <div className="relative flex w-full max-w-3xl items-center justify-center gap-2 sm:gap-4">
        <NavArrow
          direction="prev"
          onClick={prev}
          disabled={pageIndex <= 0}
          dark={inFullscreenChrome}
        />
        {slide}
        <NavArrow
          direction="next"
          onClick={next}
          disabled={pageIndex >= totalPages - 1}
          dark={inFullscreenChrome}
        />
      </div>

      <div className="mt-5 flex items-center gap-1.5">
        {pages.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Vai allo slide ${i + 1}`}
            aria-current={i === pageIndex}
            onClick={() => goTo(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === pageIndex
                ? inFullscreenChrome
                  ? "w-6 bg-gold"
                  : "w-6 bg-navy"
                : inFullscreenChrome
                  ? "w-1.5 bg-white/25 hover:bg-white/45"
                  : "w-1.5 bg-navy/20 hover:bg-navy/40"
            }`}
          />
        ))}
      </div>

      <p
        className={`mt-4 max-w-md text-center text-xs ${
          inFullscreenChrome ? "text-white/55" : "text-slate"
        }`}
      >
        Scorri o usa le frecce. Le pagine centrali restano sfocate — anteprima protetta.
        {reducedMotion ? " Animazioni ridotte (preferenza sistema)." : ""}
      </p>
    </div>
  );

  if (isOverlay) {
    if (!mounted) return null;
    return createPortal(
      <div
        className="fixed inset-0 z-[80] flex flex-col bg-[#0B1E3F]/95 p-4 backdrop-blur-sm sm:p-8"
        role="dialog"
        aria-modal="true"
        aria-label={`Anteprima di ${product.title}`}
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) closePreview();
        }}
      >
        {reader}
      </div>,
      document.body,
    );
  }

  const sectionBody = (
    <>
      {!fullscreen && (
        <div className="mb-5 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue">
            Anteprima interattiva
          </p>
          <h2 className="mt-2 font-display text-2xl text-navy sm:text-3xl">
            Scorri le pagine
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-slate">
            Tutte le pagine del PDF, una alla volta. Solo la prima (esercizi) e
            l&apos;ultima (soluzioni) sono leggibili — le altre restano protette.
          </p>
          {nonConsecutive && (
            <p className="mt-2 text-xs font-medium text-amber-800/90">
              Le pagine dell&apos;anteprima non sono consecutive (estratti dal PDF completo).
            </p>
          )}
        </div>
      )}

      {!open ? (
        <div className="mx-auto w-full max-w-[300px]">
          <button
            type="button"
            onClick={openPreview}
            className="group relative w-full overflow-hidden rounded-2xl shadow-[0_20px_50px_rgba(16,27,54,0.18)] ring-1 ring-navy/10 transition hover:-translate-y-1 hover:shadow-[0_28px_60px_rgba(16,27,54,0.22)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue"
            aria-label={`Apri l'anteprima di ${product.title}`}
          >
            <div className="relative aspect-[3/4]">
              {cover && cover.kind === "cover" && (
                <Image
                  src={cover.src}
                  alt=""
                  fill
                  className="object-cover transition duration-500 group-hover:scale-[1.02]"
                  sizes="300px"
                  priority
                />
              )}
              <span className="absolute inset-x-4 bottom-4 rounded-full bg-white/95 px-4 py-2.5 text-center text-sm font-semibold text-navy shadow-sm">
                Clicca per aprire l&apos;anteprima
              </span>
            </div>
          </button>
        </div>
      ) : (
        reader
      )}
    </>
  );

  if (fullscreen && mounted) {
    return (
      <>
        <div id="anteprima-preview" className="mt-10" aria-hidden />
        {createPortal(
          <div className="fixed inset-0 z-[80] flex flex-col bg-[#0B1E3F]/95 p-4 backdrop-blur-sm sm:p-8">
            {sectionBody}
          </div>,
          document.body,
        )}
      </>
    );
  }

  return (
    <div id="anteprima-preview" className="mt-10">
      {sectionBody}
    </div>
  );
}

function ControlButton({
  onClick,
  label,
  dark,
}: {
  onClick: () => void;
  label: string;
  dark?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3.5 py-2 text-xs font-semibold transition ${
        dark
          ? "border border-white/20 bg-white/10 text-white hover:bg-white/20"
          : "border border-navy/12 bg-white text-navy hover:border-navy/20 hover:bg-navy/[0.03]"
      }`}
    >
      {label}
    </button>
  );
}

function NavArrow({
  direction,
  onClick,
  disabled,
  dark,
}: {
  direction: "prev" | "next";
  onClick: () => void;
  disabled?: boolean;
  dark?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "prev" ? "Pagina precedente" : "Pagina successiva"}
      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition disabled:pointer-events-none disabled:opacity-30 ${
        dark
          ? "border border-white/20 bg-white/10 text-white hover:bg-white/20"
          : "border border-navy/12 bg-white text-navy shadow-sm hover:border-navy/20"
      }`}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d={direction === "prev" ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
