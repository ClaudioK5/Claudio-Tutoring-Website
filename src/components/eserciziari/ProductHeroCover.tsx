"use client";

import { useState } from "react";
import type { EserciziarioProduct } from "@/lib/eserciziari";
import { BookPreview } from "./BookPreview";
import { ProductCover } from "./ProductCover";

type Props = {
  product: EserciziarioProduct;
};

export function ProductHeroCover({ product }: Props) {
  const [open, setOpen] = useState(false);
  const canPreview = product.previewAvailable && product.bookPreview.length > 0;

  return (
    <>
      {canPreview ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="group relative w-full cursor-pointer text-left outline-none focus-visible:ring-2 focus-visible:ring-blue/40 focus-visible:ring-offset-2"
          aria-label={`Apri anteprima di ${product.title}`}
        >
          <div className="card-surface p-3">
            <ProductCover product={product} large />
          </div>
          <span className="pointer-events-none absolute inset-x-8 bottom-6 rounded-full bg-white/95 px-3 py-2 text-center text-sm font-semibold text-navy shadow-sm opacity-0 transition group-hover:opacity-100">
            Sfoglia anteprima
          </span>
        </button>
      ) : (
        <div className="card-surface p-3">
          <ProductCover product={product} large />
        </div>
      )}

      {product.status === "draft" && (
        <p className="mt-3 text-center text-xs font-semibold uppercase tracking-[0.12em] text-amber-700">
          Anteprima — PDF in verifica
        </p>
      )}

      {canPreview && (
        <BookPreview
          product={product}
          mode="overlay"
          open={open}
          onOpenChange={setOpen}
        />
      )}
    </>
  );
}

/** Bottone secondario che apre la stessa overlay anteprima. */
export function PreviewOpenButton({
  product,
  className = "btn-secondary flex w-full !py-3.5 !text-sm",
}: {
  product: EserciziarioProduct;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const canPreview = product.previewAvailable && product.bookPreview.length > 0;

  if (!canPreview) {
    return (
      <button
        type="button"
        disabled
        className="w-full cursor-not-allowed rounded-2xl border border-navy/12 bg-white px-6 py-3.5 text-sm font-semibold text-navy opacity-45"
      >
        Scarica un&apos;anteprima gratuita
      </button>
    );
  }

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className}>
        Sfoglia l&apos;anteprima gratuita
      </button>
      <BookPreview
        product={product}
        mode="overlay"
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
}
