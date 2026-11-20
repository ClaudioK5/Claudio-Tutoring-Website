import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookingButton } from "@/components/BookingButton";
import { BuyButton } from "@/components/eserciziari/BuyButton";
import { ProductCard } from "@/components/eserciziari/ProductCard";
import {
  PreviewOpenButton,
  ProductHeroCover,
} from "@/components/eserciziari/ProductHeroCover";
import { ShopChrome } from "@/components/eserciziari/ShopChrome";
import { Reveal } from "@/components/Reveal";
import { SITE } from "@/lib/constants";
import {
  ESERCIZIARI_PRODUCTS,
  formatProductPrice,
  getProductBySlug,
  getRelatedProducts,
} from "@/lib/eserciziari";

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ checkout?: string }>;
};

export function generateStaticParams() {
  return ESERCIZIARI_PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Eserciziario" };

  return {
    title: `${product.title} | Eserciziari`,
    description: product.shortDescription,
    alternates: { canonical: `${SITE.url}/eserciziari/${product.slug}` },
    openGraph: {
      title: `${product.title} – ClaudioTutoring`,
      description: product.shortDescription,
      url: `${SITE.url}/eserciziari/${product.slug}`,
    },
  };
}

export default async function EserciziarioProductPage({
  params,
  searchParams,
}: PageProps) {
  const { slug } = await params;
  const { checkout } = await searchParams;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const related = getRelatedProducts(product.slug);
  const checkoutCancelled = checkout === "annullato";

  return (
    <ShopChrome>
      <section className="section-pad">
        <div className="container-page">
          <Link
            href="/eserciziari"
            className="text-sm font-medium text-blue transition hover:underline"
          >
            ← Torna agli eserciziari
          </Link>

          {checkoutCancelled && (
            <p
              role="status"
              className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-900"
            >
              Pagamento annullato. Nessun addebito effettuato — puoi riprovare quando vuoi.
            </p>
          )}

          <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-14">
            <Reveal>
              <div className="mx-auto w-full max-w-sm lg:mx-0">
                <ProductHeroCover product={product} />
              </div>
            </Reveal>

            <Reveal delayMs={80}>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue">
                  {product.subjectLabel}
                </p>
                <h1 className="mt-2 font-display text-3xl leading-tight text-navy sm:text-4xl">
                  {product.title}
                </h1>
                <p className="mt-4 text-base leading-relaxed text-slate sm:text-lg">
                  {product.description}
                </p>

                <dl className="mt-6 flex flex-wrap gap-2">
                  <MetaChip label={`${product.exerciseCount} esercizi`} />
                  <MetaChip label={`Difficoltà: ${product.difficulty}`} />
                  <MetaChip label={product.format} />
                  <MetaChip label={formatProductPrice(product.priceEuro)} strong />
                </dl>

                <div className="mt-8 space-y-3">
                  <BuyButton product={product} />
                  <PreviewOpenButton product={product} />
                </div>

                <div className="mt-10">
                  <h2 className="font-display text-xl text-navy">Argomenti trattati</h2>
                  <ul className="mt-3 space-y-2">
                    {product.topics.map((topic) => (
                      <li key={topic} className="flex gap-2.5 text-sm text-slate">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" aria-hidden />
                        {topic}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8">
                  <h2 className="font-display text-xl text-navy">Cosa include</h2>
                  <ul className="mt-3 space-y-2">
                    {product.includes.map((item) => (
                      <li key={item} className="flex gap-2.5 text-sm text-slate">
                        <span className="mt-0.5 text-emerald-600" aria-hidden>
                          ✓
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          </div>

          <aside className="card-surface mx-auto mt-16 max-w-3xl p-6 sm:p-8">
            <h2 className="font-display text-xl text-navy sm:text-2xl">
              Ti serve una spiegazione su misura?
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate">
              Gli eserciziari ti allenano da solo. In lezione privata lavoriamo sul tuo esame,
              sui punti in cui ti blocchi e — quando serve — sui materiali già inclusi nel
              percorso con Claudio Tutoring.
            </p>
            <div className="mt-5">
              <BookingButton className="!px-6 !py-3 !text-sm">Prenota una lezione</BookingButton>
            </div>
          </aside>

          {related.length > 0 && (
            <div className="mt-16">
              <h2 className="text-center font-display text-2xl text-navy">
                Altre raccolte di esercizi
              </h2>
              <div className="mx-auto mt-8 grid max-w-4xl gap-5 sm:grid-cols-2">
                {related.map((p) => (
                  <ProductCard key={p.slug} product={p} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </ShopChrome>
  );
}

function MetaChip({ label, strong = false }: { label: string; strong?: boolean }) {
  return (
    <span
      className={`rounded-full px-3.5 py-1.5 text-xs font-semibold ${
        strong
          ? "bg-navy text-white"
          : "bg-navy/[0.05] text-navy ring-1 ring-navy/10"
      }`}
    >
      {label}
    </span>
  );
}
