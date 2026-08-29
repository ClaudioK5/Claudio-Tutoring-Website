import { PRICING_PACKAGES } from "@/lib/constants";
import { Reveal } from "./Reveal";

export function Pricing() {
  return (
    <section id="pricing" className="section-pad">
      <div className="container-page">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">Prezzi</p>
            <h2 className="mt-3 font-display text-3xl text-navy sm:text-4xl">
              Prezzi chiari. Pacchetti semplici.
            </h2>
          </div>
        </Reveal>

        <div className="mx-auto mt-10 grid max-w-5xl gap-5 md:grid-cols-3">
          {PRICING_PACKAGES.map((pkg, i) => (
            <Reveal key={pkg.id} delayMs={i * 70}>
              <article
                className={`card-surface relative flex h-full flex-col overflow-hidden p-6 sm:p-7 ${
                  pkg.featured
                    ? "border-blue/25 shadow-[0_18px_44px_rgba(53,99,233,0.14)] ring-1 ring-blue/20"
                    : ""
                }`}
              >
                <div
                  className={`absolute inset-x-0 top-0 h-1 ${
                    pkg.featured
                      ? "bg-gradient-to-r from-blue via-blue to-gold"
                      : "bg-navy/10"
                  }`}
                  aria-hidden
                />

                {pkg.featured && (
                  <span className="mb-3 inline-flex self-start rounded-full bg-gold/15 px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-[0.12em] text-gold">
                    Più conveniente
                  </span>
                )}

                <p
                  className={`text-sm font-semibold uppercase tracking-[0.12em] ${
                    pkg.featured ? "text-blue" : "text-slate"
                  }`}
                >
                  {pkg.name}
                </p>

                <p className="mt-4">
                  <span className="price-figure text-5xl leading-none">{pkg.priceLabel}</span>
                  <span className="ml-1 text-lg font-sans font-medium text-slate">
                    {pkg.priceSuffix}
                  </span>
                </p>

                {pkg.detail && (
                  <p className="mt-2 text-sm font-medium text-blue">{pkg.detail}</p>
                )}

                <p className="mt-4 text-sm leading-relaxed text-slate">
                  {pkg.description}
                </p>
              </article>
            </Reveal>
          ))}
        </div>

        <p className="mt-6 text-center text-xs leading-relaxed text-slate">
          Il pagamento si accorda direttamente con lo studente.
        </p>
      </div>
    </section>
  );
}
