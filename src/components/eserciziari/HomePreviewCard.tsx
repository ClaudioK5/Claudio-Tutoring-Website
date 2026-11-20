"use client";

import Link from "next/link";
import { useState } from "react";
import {
  formatProductPrice,
  type EserciziarioProduct,
} from "@/lib/eserciziari";
import { BookPreview } from "./BookPreview";
import { ProductCover } from "./ProductCover";

export function HomePreviewCard({ product }: { product: EserciziarioProduct }) {
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
        <p className="mt-3 text-sm leading-relaxed text-slate">
          {product.exerciseCount} esercizi · {formatProductPrice(product.priceEuro)}
        </p>
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
