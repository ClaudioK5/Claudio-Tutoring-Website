import Link from "next/link";
import { ESERCIZIARI_PRODUCTS } from "@/lib/eserciziari";
import { Reveal } from "./Reveal";
import { HomePreviewCard } from "./eserciziari/HomePreviewCard";

export function EserciziariPreview() {
  const preview = ESERCIZIARI_PRODUCTS.slice(0, 5);

  return (
    <section
      id="eserciziari-preview"
      className="section-pad relative border-y border-navy/8 bg-ivory"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.45]"
        style={{
          background:
            "radial-gradient(ellipse 55% 45% at 10% 0%, rgba(29,63,143,0.06), transparent 55%), radial-gradient(ellipse 40% 35% at 95% 100%, rgba(201,164,92,0.07), transparent 50%)",
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
              Eserciziari pensati per darti sempre nuovo materiale su cui allenarti: trovi sia
              esercizi specifici che possono comparire negli esami universitari ma che spesso
              sono difficili da reperire online, sia numerose nuove varianti sugli argomenti
              più comuni.
            </p>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {preview.map((product, i) => (
            <Reveal key={product.slug} delayMs={i * 80}>
              <HomePreviewCard product={product} />
            </Reveal>
          ))}
        </div>

        <Reveal delayMs={160}>
          <div className="mt-10 flex justify-center">
            <Link href="/eserciziari" className="btn-primary">
              Scopri gli eserciziari
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
