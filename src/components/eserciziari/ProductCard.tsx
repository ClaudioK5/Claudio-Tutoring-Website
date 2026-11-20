"use client";

import Link from "next/link";
import { useState } from "react";
import {
  formatProductPrice,
  type EserciziarioProduct,
} from "@/lib/eserciziari";
import { BookPreview } from "./BookPreview";
import { BuyButton } from "./BuyButton";
import { ProductCover } from "./ProductCover";

export function ProductCard({ product }: { product: EserciziarioProduct }) {
  const href = `/eserciziari/${product.slug}`;
  const [bookOpen, setBookOpen] = useState(false);

  return (
    <article className="card-surface group flex h-full flex-col overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_48px_rgba(16,27,54,0.12)]">
      <button
        type="button"
        onClick={() => setBookOpen(true)}
        className="relative block w-full cursor-pointer p-3 pb-0 text-left outline-none focus-visible:ring-2 focus-visible:ring-blue/40 focus-visible:ring-offset-2"
        aria-label={`Apri anteprima di ${product.title}`}
      >
        <ProductCover product={product} />
        <span className="pointer-events-none absolute inset-x-6 bottom-4 rounded-full bg-white/95 px-3 py-2 text-center text-xs font-semibold text-navy shadow-sm opacity-0 transition group-hover:opacity-100 sm:text-sm">
          Sfoglia anteprima
        </span>
        {product.status === "draft" && !product.coverImage && (
          <span className="absolute left-5 top-5 rounded-full bg-ivory/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-navy shadow-sm ring-1 ring-navy/10">
            Anteprima
          </span>
        )}
      </button>

      <div className="flex flex-1 flex-col p-5 pt-5 sm:p-6 sm:pt-5">
        <p className="text-[0.7rem] font-bold uppercase tracking-[0.14em] text-blue">
          {product.subjectLabel}
        </p>
        <h3 className="mt-2 font-display text-[1.35rem] leading-[1.2] tracking-tight text-navy sm:text-[1.5rem]">
          <Link
            href={href}
            className="transition hover:text-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue/40"
          >
            {product.title}
          </Link>
        </h3>
        <p className="mt-3 text-[0.95rem] leading-relaxed text-slate">
          {product.shortDescription}
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          <MetaBadge>{product.exerciseCount} esercizi</MetaBadge>
          <MetaBadge>{product.difficulty}</MetaBadge>
          <MetaBadge>{product.format}</MetaBadge>
        </div>

        <div className="mt-auto pt-5">
          <div
            className="relative overflow-hidden rounded-2xl px-4 py-4 sm:px-5 sm:py-5"
            style={{
              background: `linear-gradient(145deg, ${product.coverAccent} 0%, #101B36 85%)`,
            }}
          >
            <div
              className="pointer-events-none absolute -right-8 -top-10 h-28 w-28 rounded-full opacity-25 blur-2xl"
              style={{ background: "#C9A45C" }}
              aria-hidden
            />
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.06] math-grid"
              aria-hidden
            />
            <p className="relative text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-white/65">
              Prezzo eserciziario
            </p>
            <p className="relative mt-1.5 font-sans text-3xl font-bold tracking-tight text-white sm:text-[2.05rem]">
              {formatProductPrice(product.priceEuro)}
            </p>
            <p className="relative mt-1 text-sm text-white/70">
              Soluzioni passo dopo passo incluse
            </p>
          </div>

          <div className="mt-4 space-y-2.5">
            <BuyButton product={product} />
            <Link href={href} className="btn-secondary w-full !py-3 !text-sm">
              Scopri di più
            </Link>
          </div>
        </div>
      </div>

      <BookPreview
        product={product}
        mode="overlay"
        open={bookOpen}
        onOpenChange={setBookOpen}
      />
    </article>
  );
}

function MetaBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-navy/10 bg-navy/[0.03] px-3.5 py-1.5 text-sm font-medium text-navy">
      {children}
    </span>
  );
}
