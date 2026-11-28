"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  ESERCIZIARI_CATEGORIES,
  ESERCIZIARI_PRODUCTS,
  type EserciziarioCategoryId,
} from "@/lib/eserciziari";
import { ProductCard } from "./ProductCard";

type SortId = "recenti" | "esercizi-desc" | "prezzo-asc" | "prezzo-desc";

const SORT_OPTIONS: { id: SortId; label: string }[] = [
  { id: "recenti", label: "Più recenti" },
  { id: "esercizi-desc", label: "Più esercizi" },
  { id: "prezzo-asc", label: "Prezzo ↑" },
  { id: "prezzo-desc", label: "Prezzo ↓" },
];

function isCategoryId(value: string | null): value is EserciziarioCategoryId {
  return ESERCIZIARI_CATEGORIES.some((c) => c.id === value);
}

function isSortId(value: string | null): value is SortId {
  return SORT_OPTIONS.some((o) => o.id === value);
}

function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "");
}

/**
 * Catalogo eserciziari — ricerca, filtri materia, ordinamento.
 * Sync URL: ?q= & ?cat= & ?sort=
 */
export function Catalog() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const initialQ = searchParams.get("q") ?? "";
  const initialCat = searchParams.get("cat");
  const initialSort = searchParams.get("sort");

  const [query, setQuery] = useState(initialQ);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQ);
  const [category, setCategory] = useState<EserciziarioCategoryId>(
    isCategoryId(initialCat) ? initialCat : "all",
  );
  const [sort, setSort] = useState<SortId>(
    isSortId(initialSort) ? initialSort : "recenti",
  );

  useEffect(() => {
    const t = window.setTimeout(() => setDebouncedQuery(query), 160);
    return () => window.clearTimeout(t);
  }, [query]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedQuery.trim()) params.set("q", debouncedQuery.trim());
    if (category !== "all") params.set("cat", category);
    if (sort !== "recenti") params.set("sort", sort);
    const qs = params.toString();
    const next = qs ? `${pathname}?${qs}` : pathname;
    const current = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
    if (next === current) return;
    startTransition(() => {
      router.replace(next, { scroll: false });
    });
  }, [debouncedQuery, category, sort, pathname, router, searchParams]);

  const categoriesWithProducts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of ESERCIZIARI_PRODUCTS) {
      counts.set(p.category, (counts.get(p.category) ?? 0) + 1);
    }
    return ESERCIZIARI_CATEGORIES.filter(
      (c) => c.id === "all" || (counts.get(c.id) ?? 0) > 0,
    );
  }, []);

  const products = useMemo(() => {
    const q = normalize(debouncedQuery.trim());
    let list = ESERCIZIARI_PRODUCTS.filter((p) => {
      if (category !== "all" && p.category !== category) return false;
      if (!q) return true;
      const haystack = normalize(
        [
          p.title,
          p.subjectLabel,
          p.shortDescription,
          p.description,
          ...p.topics,
        ].join(" "),
      );
      return haystack.includes(q);
    });

    list = [...list];
    if (sort === "esercizi-desc") {
      list.sort((a, b) => b.exerciseCount - a.exerciseCount);
    } else if (sort === "prezzo-asc") {
      list.sort((a, b) => a.priceEuro - b.priceEuro);
    } else if (sort === "prezzo-desc") {
      list.sort((a, b) => b.priceEuro - a.priceEuro);
    }
    // "recenti" = ordine catalogo (nuovi in cima)

    return list;
  }, [debouncedQuery, category, sort]);

  function onQueryChange(value: string) {
    setQuery(value);
  }

  function onCategoryChange(id: EserciziarioCategoryId) {
    setCategory(id);
  }

  function onSortChange(id: SortId) {
    setSort(id);
  }

  function clearFilters() {
    setQuery("");
    setDebouncedQuery("");
    setCategory("all");
    setSort("recenti");
    startTransition(() => {
      router.replace(pathname, { scroll: false });
    });
  }

  const hasActiveFilters =
    query.trim() !== "" || category !== "all" || sort !== "recenti";

  return (
    <div>
      <div className="mx-auto max-w-3xl">
        <label className="relative block">
          <span className="sr-only">Cerca eserciziario</span>
          <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.8" />
              <path
                d="M16.5 16.5L20 20"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <input
            type="search"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Cerca per titolo, materia o argomento…"
            className="w-full rounded-2xl border border-navy/10 bg-white py-3.5 pl-12 pr-4 text-[0.95rem] text-navy shadow-[0_8px_24px_rgba(16,27,54,0.04)] outline-none transition placeholder:text-slate/70 focus:border-blue/35 focus:ring-2 focus:ring-blue/15"
            autoComplete="off"
          />
        </label>
      </div>

      <div
        className="mt-5 flex flex-wrap justify-center gap-2"
        role="tablist"
        aria-label="Filtra per materia"
      >
        {categoriesWithProducts.map((cat) => {
          const active = category === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onCategoryChange(cat.id)}
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

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate" aria-live="polite">
          <span className="font-semibold tabular-nums text-navy">{products.length}</span>
          {products.length === 1 ? " risultato" : " risultati"}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="ml-3 text-sm font-semibold text-blue transition hover:text-blue-dark"
            >
              Azzera filtri
            </button>
          )}
        </p>

        <label className="inline-flex items-center gap-2 text-sm text-slate">
          <span className="font-medium">Ordina</span>
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value as SortId)}
            className="rounded-xl border border-navy/10 bg-white px-3 py-2 text-sm font-semibold text-navy outline-none transition focus:border-blue/35 focus:ring-2 focus:ring-blue/15"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {products.length === 0 ? (
        <div className="mt-12 text-center">
          <p className="text-base font-medium text-navy">Nessun eserciziario trovato</p>
          <p className="mt-2 text-sm text-slate">
            Prova un&apos;altra materia o cancella la ricerca.
          </p>
          <button
            type="button"
            onClick={clearFilters}
            className="btn-secondary mt-5 !px-5 !py-2.5 !text-sm"
          >
            Mostra tutto il catalogo
          </button>
        </div>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
