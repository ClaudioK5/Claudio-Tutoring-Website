import { STATS, formatPrice, PRICING } from "@/lib/constants";
import { BookingButton } from "./BookingButton";
import { Reveal } from "./Reveal";

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pb-10 pt-6 md:pb-14 md:pt-10">
      <div className="pointer-events-none absolute inset-0 math-grid opacity-70" aria-hidden />
      <div
        className="pointer-events-none absolute -right-24 top-10 h-72 w-72 rounded-full bg-blue/10 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-gold/10 blur-3xl"
        aria-hidden
      />

      <div className="container-page relative grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
        <Reveal>
          <p className="eyebrow">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-gold" aria-hidden />
            Ripetizioni scientifiche online
          </p>

          <h1 className="mt-4 max-w-xl font-display text-[2.35rem] leading-[1.12] text-navy sm:text-5xl lg:text-[3.25rem]">
            Se quell&apos;esame ti blocca da mesi, ripartiamo da lì.
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-slate sm:text-lg">
            Analisi, Fisica, Chimica, Algebra Lineare e altre materie STEM. Dalla
            prima lezione lavoriamo sui punti che ti stanno fermando, con calma,
            metodo e un obiettivo chiaro: arrivare all&apos;esame sapendo cosa fare.
          </p>

          <ul className="mt-6 flex flex-wrap gap-2.5" aria-label="Punti chiave">
            {[
              `${STATS.lessonsTaught} lezioni`,
              "Livello universitario",
              "Online, 1 to 1",
              "Preparazione esami",
            ].map((item) => (
              <li
                key={item}
                className="rounded-full border border-navy/10 bg-white/80 px-3.5 py-1.5 text-sm font-medium text-navy shadow-sm"
              >
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <BookingButton>Prenota la prima lezione</BookingButton>
            <a href="#results" className="btn-secondary">
              Guarda i risultati
            </a>
          </div>

          <p className="mt-4 text-sm font-medium text-slate">
            {PRICING.label}{" "}
            <span className="text-navy">
              {formatPrice()}/{PRICING.unit}
            </span>
          </p>
        </Reveal>

        <Reveal delayMs={120} className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="relative">
            <div className="card-surface relative overflow-hidden p-3 sm:p-4">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1rem] bg-navy/5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/claudio-hero.jpg"
                  alt="Claudio Asaro, tutor di materie scientifiche"
                  className="h-full w-full object-cover object-top"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy/25 via-transparent to-transparent" />
              </div>
            </div>

            <div className="float-soft absolute -left-2 top-8 rounded-2xl border border-white/70 bg-white px-3.5 py-2.5 shadow-[0_12px_30px_rgba(16,27,54,0.12)] sm:-left-6">
              <p className="font-display text-lg leading-none text-navy">{STATS.lessonsTaught}</p>
              <p className="mt-1 text-xs font-medium text-slate">lezioni</p>
            </div>

            <div
              className="float-soft absolute -right-1 top-28 rounded-2xl border border-white/70 bg-white px-3.5 py-2.5 shadow-[0_12px_30px_rgba(16,27,54,0.12)] sm:-right-5"
              style={{ animationDelay: "1.2s" }}
            >
              <p className="text-[0.7rem] font-bold uppercase tracking-[0.12em] text-gold">
                Studi
              </p>
              <p className="mt-1 text-sm font-semibold text-navy">Ing. Aerospaziale</p>
            </div>

            <div
              className="float-soft absolute bottom-10 -left-1 rounded-2xl border border-white/70 bg-white px-3.5 py-2.5 shadow-[0_12px_30px_rgba(16,27,54,0.12)] sm:-left-4"
              style={{ animationDelay: "0.6s" }}
            >
              <p className="text-sm font-semibold text-navy">Università e superiori</p>
              <p className="mt-0.5 text-xs text-slate">Materie scientifiche · online</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
