/**
 * Catalogo eserciziari PDF — unica fonte prodotti.
 * Aggiungi qui i nuovi PDF; checkout resta disattivato finché status === "draft".
 */

export const ESERCIZIARI_CATEGORIES = [
  { id: "all", label: "Tutti" },
  { id: "analisi-1", label: "Analisi 1" },
  { id: "analisi-2", label: "Analisi 2" },
  { id: "algebra-lineare", label: "Algebra Lineare" },
  { id: "elettrotecnica", label: "Elettrotecnica" },
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
    slug: "metodo-dei-nodi",
    title: "Metodo dei Nodi",
    category: "elettrotecnica",
    subjectLabel: "Elettrotecnica",
    exerciseCount: 15,
    difficulty: "Crescente",
    format: "PDF",
    priceEuro: 5.9,
    status: "live",
    shortDescription:
      "15 esercizi: generatori, supernodi, leggi di Kirchhoff e soluzioni passo dopo passo.",
    description:
      "Una raccolta di 15 esercizi a difficoltà crescente sul metodo dei nodi: circuiti resistivi, generatori ideali, supernodi e regime sinusoidale, senza Laplace né equazioni differenziali. Tracce e svolgimenti separati, pensati per l'esame di Elettrotecnica.",
    topics: [
      "Metodo dei nodi",
      "Generatori ideali di tensione e corrente",
      "Supernodi",
      "Leggi di Kirchhoff",
      "Circuiti in regime sinusoidale",
    ],
    includes: [
      "15 esercizi a difficoltà crescente",
      "Soluzioni complete passo dopo passo",
      "Formato PDF scaricabile dopo l'acquisto",
      "Ideale per ripasso e preparazione all'esame di Elettrotecnica",
    ],
    coverAccent: "#0E7490",
    coverLabel: "ET",
    coverImage: "/images/cover-metodo-dei-nodi.jpg",
    privatePdfKey: "ClaudioTutoring_15_Esercizi_Metodo_dei_Nodi.pdf",
    previewAvailable: true,
    bookPreview: [
      {
        kind: "cover",
        src: "/images/cover-metodo-dei-nodi.jpg",
        label: "Copertina",
      },
      ...pdfPreviewPages("metodo-dei-nodi", 28),
      { kind: "cta" },
    ],
  },
  {
    slug: "massimi-e-minimi-vincolati",
    title: "Massimi e Minimi Vincolati",
    category: "analisi-2",
    subjectLabel: "Analisi 2",
    exerciseCount: 35,
    difficulty: "Crescente",
    format: "PDF",
    priceEuro: 5.9,
    status: "live",
    shortDescription:
      "35 esercizi: moltiplicatori di Lagrange, 1 e 2 vincoli, soluzioni passo dopo passo.",
    description:
      "Una raccolta di 35 esercizi di difficoltà crescente su massimi e minimi vincolati: moltiplicatori di Lagrange, punti interni, frontiere, vincoli attivi e intersezioni. Tracce e svolgimenti separati, pensati per l'esame di Analisi Matematica II.",
    topics: [
      "Moltiplicatori di Lagrange",
      "Vincoli singoli e doppi",
      "Punti interni e frontiere",
      "Vincoli attivi e intersezioni",
      "Esercizi in stile esame di Analisi 2",
    ],
    includes: [
      "35 esercizi a difficoltà crescente",
      "Soluzioni complete passo dopo passo",
      "Formato PDF scaricabile dopo l'acquisto",
      "Ideale per ripasso e preparazione all'esame di Analisi 2",
    ],
    coverAccent: "#9A3412",
    coverLabel: "A2",
    coverImage: "/images/cover-massimi-minimi-vincolati.jpg",
    privatePdfKey:
      "ClaudioTutoring_35_Massimi_Minimi_Lagrange_Svolgimenti_Completi.pdf",
    previewAvailable: true,
    bookPreview: [
      {
        kind: "cover",
        src: "/images/cover-massimi-minimi-vincolati.jpg",
        label: "Copertina",
      },
      ...pdfPreviewPages("massimi-minimi-vincolati", 31),
      { kind: "cta" },
    ],
  },
  {
    slug: "100-limiti",
    title: "100 Limiti",
    category: "analisi-1",
    subjectLabel: "Analisi 1",
    exerciseCount: 100,
    difficulty: "Crescente",
    format: "PDF",
    priceEuro: 5.9,
    status: "live",
    shortDescription:
      "100 limiti: forme indeterminate, limiti notevoli, confronti, Taylor e successioni.",
    description:
      "Una raccolta ampia di 100 esercizi di difficoltà crescente su limiti di funzioni e successioni: limiti immediati, forme indeterminate, limiti notevoli, confronti asintotici, sviluppi di Taylor e successioni. Tracce e svolgimenti separati, pensati per allenarti all'esame di Analisi 1.",
    topics: [
      "Limiti immediati e forme indeterminate",
      "Limiti notevoli",
      "Confronti asintotici",
      "Sviluppi di Taylor",
      "Limiti di successioni",
    ],
    includes: [
      "100 esercizi a difficoltà crescente",
      "Soluzioni dettagliate passo dopo passo",
      "Formato PDF scaricabile dopo l'acquisto",
      "Ideale per ripasso e preparazione all'esame di Analisi 1",
    ],
    coverAccent: "#14532D",
    coverLabel: "A1",
    coverImage: "/images/cover-100-limiti.jpg",
    privatePdfKey: "ClaudioTutoring_100_Limiti_Soluzioni_Dettagliate.pdf",
    previewAvailable: true,
    bookPreview: [
      {
        kind: "cover",
        src: "/images/cover-100-limiti.jpg",
        label: "Copertina",
      },
      ...pdfPreviewPages("100-limiti", 23),
      { kind: "cta" },
    ],
  },
  {
    slug: "basi-e-sottospazi-vettoriali",
    title: "Basi e Sottospazi Vettoriali",
    category: "algebra-lineare",
    subjectLabel: "Algebra Lineare",
    exerciseCount: 20,
    difficulty: "Crescente",
    format: "PDF",
    priceEuro: 5.9,
    status: "live",
    shortDescription:
      "Generatori, indipendenza lineare, dimensione, nuclei e immagini con soluzioni complete.",
    description:
      "Una raccolta di 20 esercizi a difficoltà crescente su basi, dimensione, generatori, indipendenza lineare, nuclei, immagini, somme e intersezioni di sottospazi. Ogni svolgimento è dettagliato passo dopo passo, come si richiede all'esame di Algebra Lineare.",
    topics: [
      "Generatori e Span",
      "Indipendenza lineare",
      "Basi e dimensione",
      "Nucleo e immagine",
      "Somme e intersezioni di sottospazi",
    ],
    includes: [
      "20 esercizi a difficoltà crescente",
      "Soluzioni complete e commentate",
      "Formato PDF scaricabile dopo l'acquisto",
      "Ideale per ripasso e preparazione all'esame di Algebra Lineare",
    ],
    coverAccent: "#7C2D12",
    coverLabel: "AL",
    coverImage: "/images/cover-basi-sottospazi.jpg",
    privatePdfKey: "ClaudioTutoring_20_Esercizi_Basi_Sottospazi_Vettoriali.pdf",
    previewAvailable: true,
    bookPreview: [
      {
        kind: "cover",
        src: "/images/cover-basi-sottospazi.jpg",
        label: "Copertina",
      },
      ...pdfPreviewPages("basi-sottospazi", 11),
      { kind: "cta" },
    ],
  },
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
