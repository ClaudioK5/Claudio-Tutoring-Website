"use client";

import { useMemo, useState } from "react";
import {
  ESERCIZIARI_CATEGORIES,
  ESERCIZIARI_PRODUCTS,
  type EserciziarioCategoryId,
} from "@/lib/eserciziari";
import { ProductCard } from "./ProductCard";

export function Catalog() {
  const [category, setCategory] = useState<EserciziarioCategoryId>("all");

  const products = useMemo(() => {
    if (category === "all") return [...ESERCIZIARI_PRODUCTS];
    return ESERCIZIARI_PRODUCTS.filter((p) => p.category === category);
  }, [category]);

  return (
    <div>
      <div
        className="flex flex-wrap justify-center gap-2"
        role="tablist"
        aria-label="Filtra per materia"
      >
        {ESERCIZIARI_CATEGORIES.map((cat) => {
          const active = category === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setCategory(cat.id)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                active
                  ? "bg-navy text-white shadow-sm"
                  : "border border-navy/10 bg-white text-slate hover:border-navy/20 hover:text-navy"
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {products.length === 0 ? (
        <p className="mt-12 text-center text-sm text-slate">
          Nessun eserciziario in questa categoria per ora. Torna presto.
        </p>
      ) : (
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
