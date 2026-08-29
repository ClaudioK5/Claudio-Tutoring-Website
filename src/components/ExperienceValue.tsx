import { Reveal } from "./Reveal";

const benefits = [
  {
    title: "Materiali già pronti",
    description:
      "Esercizi e tracce d'esame raccolti negli anni, scelti in base a ciò che devi preparare.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M8 4h6l4 4v11a1 1 0 01-1 1H8a1 1 0 01-1-1V5a1 1 0 011-1z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path
          d="M14 4v4h4M10 12h5M10 15h5"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    title: "Preparazione da esame",
    description:
      "Scritto, orale, esercizi ricorrenti: conosco bene le difficoltà più comuni e adattiamo il lavoro al tuo corso.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M8 4h8a2 2 0 012 2v14l-6-3-6 3V6a2 2 0 012-2z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path
          d="M10 10l1.5 1.5L14.5 8.5"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "Schemi e formulari utili davvero",
    description:
      "Formule, procedure e schemi sintetici per avere sotto mano ciò che serve quando affronti gli esercizi.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
        <rect x="5" y="4" width="14" height="16" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
        <path d="M8 9h8M8 12.5h8M8 16h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
];

export function ExperienceValue() {
  return (
    <section id="experience" className="relative overflow-hidden bg-navy pt-9 pb-14 text-white md:pt-11 md:pb-16">
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% -10%, rgba(53,99,233,0.28), transparent 55%), radial-gradient(ellipse 45% 40% at 90% 80%, rgba(201,164,92,0.12), transparent 50%)",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035] math-grid"
        aria-hidden
      />

      <div className="container-page relative">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow mb-0 !leading-none !text-gold">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-gold" aria-hidden />
              Il vantaggio dell&apos;esperienza
            </p>
            <h2
              className="font-display text-[1.6rem] font-medium leading-[1.15] tracking-tight sm:text-[2rem]"
              style={{ color: "#FFFFFF", marginTop: "14px", marginBottom: "16px" }}
            >
              Cosa hai in più, oltre alla lezione.
            </h2>
            <p className="mx-auto max-w-xl text-base leading-relaxed text-white/70">
              Anni di esami visti, tracce raccolte, esercizi, schemi e formulari:
              quando serve, non partiamo mai da zero.
            </p>
          </div>
        </Reveal>

        <div className="mt-8 grid gap-4 md:grid-cols-3 md:gap-5">
          {benefits.map((item, i) => (
            <Reveal key={item.title} delayMs={i * 80}>
              <article className="group relative flex h-full flex-col items-center overflow-hidden rounded-[1.25rem] border border-white/12 bg-gradient-to-b from-white/[0.09] to-white/[0.03] px-5 py-6 text-center shadow-[0_16px_40px_rgba(0,0,0,0.25)] transition duration-300 hover:-translate-y-0.5 hover:border-gold/25 sm:px-6 sm:py-7">
                <div
                  className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent"
                  aria-hidden
                />
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-gold/25 bg-gold/10 text-gold shadow-[0_0_20px_rgba(201,164,92,0.1)] transition group-hover:bg-gold/15">
                  {item.icon}
                </div>
                <h3
                  className="font-display text-xl leading-snug"
                  style={{ color: "#C9A45C" }}
                >
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/65">
                  {item.description}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
