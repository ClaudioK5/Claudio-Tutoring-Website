import { Reveal } from "./Reveal";

const pillars = [
  {
    title: "Partiamo dal punto in cui ti perdi",
    description:
      "Non ricominciamo tutto da zero. Troviamo il passaggio che non torna e costruiamo da lì.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M12 3v18M12 3l4 4M12 3L8 7M5 12h14"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "Lavoriamo pensando all'esame",
    description:
      "Teoria quando serve, poi esercizi, tracce e metodo per affrontare davvero scritto o orale.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M8 4h8a2 2 0 012 2v14l-6-3-6 3V6a2 2 0 012-2z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "Serio con la materia. Tranquillo con te.",
    description:
      "Puoi fermarmi, fare domande e sbagliare. Lavoriamo sul serio, ma senza rendere la lezione pesante.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <circle cx="12" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.8" />
        <path
          d="M5 19c1.4-3.2 3.8-4.8 7-4.8s5.6 1.6 7 4.8"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
];

export function ValueProposition() {
  return (
    <section className="section-pad" id="approach">
      <div className="container-page">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl leading-tight text-navy sm:text-4xl">
              Non ti serve un&apos;altra spiegazione complicata.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate sm:text-lg">
              Ti serve capire dove ti blocchi, lavorarci con ordine e arrivare
              all&apos;esame molto più sicuro di prima.
            </p>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {pillars.map((item, i) => (
            <Reveal key={item.title} delayMs={i * 80}>
              <article className="card-surface h-full p-6">
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-blue/10 text-blue">
                  {item.icon}
                </div>
                <h3 className="font-display text-xl text-navy">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate">{item.description}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
