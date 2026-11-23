/**
 * Catalogo eserciziari PDF — unica fonte prodotti.
 * Aggiungi qui i nuovi PDF; checkout resta disattivato finché status === "draft".
 */

export const ESERCIZIARI_CATEGORIES = [
  { id: "all", label: "Tutti" },
  { id: "analisi-1", label: "Analisi 1" },
  { id: "analisi-2", label: "Analisi 2" },
  { id: "algebra-lineare", label: "Algebra Lineare" },
  { id: "fisica", label: "Fisica" },
  { id: "altro", label: "Altro" },
] as const;

export type EserciziarioCategoryId = (typeof ESERCIZIARI_CATEGORIES)[number]["id"];
export type ProductCategoryId = Exclude<EserciziarioCategoryId, "all">;

export type EserciziarioProduct = {
  slug: string;
  title: string;
  category: ProductCategoryId;
  subjectLabel: string;
  exerciseCount: number;
  difficulty: "Base" | "Intermedio" | "Avanzato" | "Crescente";
  format: "PDF";
  priceEuro: number;
  /** draft = anteprima catalogo, acquisto disattivato */
  status: "draft" | "live";
  shortDescription: string;
  description: string;
  topics: string[];
  includes: string[];
  coverAccent: string;
  coverLabel: string;
  /** Cover immagine in /public — se assente si usa la cover tipografica */
  coverImage: string | null;
  /** Path privato futuro — mai esporre in URL pubblici */
  privatePdfKey: string | null;
  previewAvailable: boolean;
  /** Solo pagine anteprima pubbliche — mai il PDF completo */
  bookPreview: BookPreviewPage[];
};

export type BookPreviewPage =
  | { kind: "cover"; src: string; label?: string }
  | {
      kind: "pdf";
      src: string;
      pdfPage: number;
      label?: string;
      /** true = middle page, pre-blurred asset + lock overlay */
      locked?: boolean;
    }
  | { kind: "cta" };

/**
 * Tutte le pagine PDF: sharp di default solo prima (esercizi) e ultima (soluzioni).
 * Passa `extraSharp` per sbloccare altre pagine (es. 11 se 12 è solo una nota).
 */
function pdfPreviewPages(
  folder: string,
  pageCount: number,
  extraSharp: readonly number[] = [],
): BookPreviewPage[] {
  const sharp = new Set<number>([1, pageCount, ...extraSharp]);
  return Array.from({ length: pageCount }, (_, i) => {
    const pdfPage = i + 1;
    const locked = !sharp.has(pdfPage);
    return {
      kind: "pdf" as const,
      src: `/images/eserciziari-preview/${folder}/page-${String(pdfPage).padStart(2, "0")}.png`,
      pdfPage,
      label: locked ? `Pagina ${pdfPage} · protetta` : `Pagina ${pdfPage}`,
      locked,
    };
  });
}

export const ESERCIZIARI_PRODUCTS: readonly EserciziarioProduct[] = [
  {
    slug: "continuita-derivabilita-differenziabilita",
    title: "Continuità, Derivabilità e Differenziabilità",
    category: "analisi-2",
    subjectLabel: "Analisi 2",
    exerciseCount: 20,
    difficulty: "Crescente",
    format: "PDF",
    priceEuro: 5.9,
    status: "live",
    shortDescription:
      "Limiti in R², derivate direzionali, gradiente e differenziabilità con soluzioni complete.",
    description:
      "Una raccolta di 20 esercizi su continuità, derivate parziali e direzionali, differenziabilità e formula del gradiente — i temi tipici di Analisi Matematica II. Ogni svolgimento è dettagliato passo dopo passo, così puoi ripercorrere il ragionamento come a lezione.",
    topics: [
      "Limiti e continuità in R²",
      "Derivate parziali e direzionali",
      "Gradiente e piano tangente",
      "Differenziabilità",
      "Esercizi in stile esame di Analisi 2",
    ],
    includes: [
      "20 esercizi a difficoltà crescente",
      "Soluzioni complete e commentate",
      "Formato PDF scaricabile dopo l'acquisto",
      "Ideale per ripasso e preparazione all'esame di Analisi 2",
    ],
    coverAccent: "#0B5D5E",
    coverLabel: "A2",
    coverImage: "/images/cover-continuita-derivabilita.jpg",
    privatePdfKey: "Dispensa_Analisi2_20_Esercizi_Soluzioni_Dettagliate.pdf",
    previewAvailable: true,
    bookPreview: [
      {
        kind: "cover",
        src: "/images/cover-continuita-derivabilita.jpg",
        label: "Copertina",
      },
      ...pdfPreviewPages("continuita-derivabilita", 16),
      { kind: "cta" },
    ],
  },
  {
    slug: "sistemi-lineari-rouche-capelli",
    title: "Sistemi Lineari e Rouché–Capelli",
    category: "algebra-lineare",
    subjectLabel: "Algebra Lineare",
    exerciseCount: 20,
    difficulty: "Crescente",
    format: "PDF",
    priceEuro: 5.9,
    status: "live",
    shortDescription:
      "Sistemi 2×2, 3×3 e 4×4, parametro k e soluzioni svolte passo dopo passo.",
    description:
      "Una raccolta mirata per consolidare sistemi lineari e il teorema di Rouché–Capelli. Gli esercizi salgono di difficoltà in modo progressivo: parti dai casi classici e arrivi a sistemi parametrici, con soluzioni spiegate in modo chiaro, come a lezione.",
    topics: [
      "Sistemi lineari 2×2, 3×3 e 4×4",
      "Teorema di Rouché–Capelli",
      "Sistemi con parametro k",
      "Discussione delle soluzioni",
      "Metodo di risoluzione passo dopo passo",
    ],
    includes: [
      "20 esercizi a difficoltà crescente",
      "Soluzioni complete e commentate",
      "Formato PDF scaricabile dopo l'acquisto",
      "Ideale per ripasso e preparazione all'esame",
    ],
    coverAccent: "#1D3F8F",
    coverLabel: "AL",
    coverImage: "/images/cover-sistemi-lineari.jpg",
    privatePdfKey: "ClaudioTutoring_20_Sistemi_Lineari_Gauss_Completo.pdf",
    previewAvailable: true,
    bookPreview: [
      {
        kind: "cover",
        src: "/images/cover-sistemi-lineari.jpg",
        label: "Copertina",
      },
      ...pdfPreviewPages("sistemi-lineari", 18),
      { kind: "cta" },
    ],
  },
  {
    slug: "numeri-complessi-e-integrali",
    title: "Numeri Complessi e Integrali",
    category: "analisi-1",
    subjectLabel: "Analisi 1",
    exerciseCount: 24,
    difficulty: "Crescente",
    format: "PDF",
    priceEuro: 5.9,
    status: "live",
    shortDescription:
      "Numeri complessi e integrali con soluzioni spiegate passo dopo passo.",
    description:
      "Due nuclei fondamentali di Analisi 1 in un unico eserciziario: numeri complessi e integrali. Ogni esercizio è pensato per allenarti sull'esame, con passaggi esplicitati così puoi ricostruire il ragionamento anche da solo.",
    topics: [
      "Forma algebrica e trigonometrica",
      "Operazioni con i numeri complessi",
      "Integrali indefiniti e definiti",
      "Tecniche di integrazione ricorrenti",
      "Esercizi in stile esame",
    ],
    includes: [
      "24 esercizi a difficoltà crescente",
      "Soluzioni passo dopo passo",
      "Formato PDF scaricabile dopo l'acquisto",
      "Utile sia per ripasso che per pratica mirata",
    ],
    coverAccent: "#0B5D4E",
    coverLabel: "A1",
    coverImage: "/images/cover-numeri-complessi-integrali.png",
    privatePdfKey: "ClaudioTutoring_Complessi_e_Integrali.pdf",
    previewAvailable: true,
    bookPreview: [
      {
        kind: "cover",
        src: "/images/cover-numeri-complessi-integrali.png",
        label: "Copertina",
      },
      ...pdfPreviewPages("numeri-complessi", 10),
      { kind: "cta" },
    ],
  },
  {
    slug: "studi-di-funzione",
    title: "Studi di Funzione",
    category: "analisi-1",
    subjectLabel: "Analisi 1",
    exerciseCount: 15,
    difficulty: "Crescente",
    format: "PDF",
    priceEuro: 5.9,
    status: "live",
    shortDescription:
      "15 studi di funzione completi: dominio, limiti, derivate, asintoti e grafici.",
    description:
      "Una raccolta ragionata di 15 studi di funzione svolti passo dopo passo. Per ogni funzione lavori su dominio, simmetrie, intersezioni, segno, limiti e asintoti, derivate (monotonia e estremi), concavità e flessi, fino al grafico qualitativo — come si richiede all'esame di Analisi 1.",
    topics: [
      "Dominio naturale e simmetrie",
      "Limiti e asintoti (verticali, orizzontali, obliqui)",
      "Derivata prima: monotonia, massimi e minimi",
      "Derivata seconda: concavità e flessi",
      "Grafici qualitativi verificati",
    ],
    includes: [
      "15 studi di funzione completi",
      "Soluzioni dettagliate passo dopo passo",
      "Formato PDF scaricabile dopo l'acquisto",
      "Ideale per ripasso e preparazione all'esame di Analisi 1",
    ],
    coverAccent: "#6B21A8",
    coverLabel: "SF",
    coverImage: "/images/cover-studi-di-funzione-v4.jpg",
    privatePdfKey:
      "ClaudioTutoring_15_Studi_di_Funzione_Stile_Originale_1.pdf",
    previewAvailable: true,
    bookPreview: [
      {
        kind: "cover",
        src: "/images/cover-studi-di-funzione-v4.jpg",
        label: "Copertina",
      },
      ...pdfPreviewPages("studi-di-funzione", 12, [11]),
      { kind: "cta" },
    ],
  },
];

export function formatProductPrice(euro: number) {
  return `€${euro.toFixed(2).replace(".", ",")}`;
}

export function getProductBySlug(slug: string) {
  return ESERCIZIARI_PRODUCTS.find((p) => p.slug === slug);
}

export function getRelatedProducts(slug: string, limit = 2) {
  const current = getProductBySlug(slug);
  if (!current) return ESERCIZIARI_PRODUCTS.slice(0, limit);
  const sameCategory = ESERCIZIARI_PRODUCTS.filter(
    (p) => p.slug !== slug && p.category === current.category,
  );
  const others = ESERCIZIARI_PRODUCTS.filter(
    (p) => p.slug !== slug && p.category !== current.category,
  );
  return [...sameCategory, ...others].slice(0, limit);
}

export function categoryLabel(id: ProductCategoryId) {
  return ESERCIZIARI_CATEGORIES.find((c) => c.id === id)?.label ?? id;
}

/**
 * Abilita il bottone Acquista nel client.
 * Il server valida comunque Stripe keys + stato prodotto (draft solo in sk_test).
 * Disattiva qui (o con ESERCIZIARI_CHECKOUT_ENABLED=false in env) per spegnere tutto.
 */
export const ESERCIZIARI_CHECKOUT_ENABLED = true;
