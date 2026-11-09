import { Reveal } from "./Reveal";

const points = [
  {
    title: "Migliaia di ore di esperienza",
    description: "Tutor con esperienza consolidata nelle lezioni universitarie.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.7" />
        <path
          d="M12 8v4.5l3 1.8"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "Selezione personale",
    description: "Ogni tutor viene valutato direttamente da Claudio.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M10 13.5 8.2 11.7l-1.4 1.4L10 16.3l7.2-7.2-1.4-1.4L10 13.5Z"
          fill="currentColor"
        />
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
      </svg>
    ),
  },
  {
    title: "Specialisti STEM",
    description: "Il tutor viene scelto in base alla materia e al tipo di esame.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M4 7.5 12 4l8 3.5v.5c0 5.2-3.4 9.8-8 11.5C7.4 17.8 4 13.2 4 8v-.5Z"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
        <path
          d="M9.5 12.2 11.2 14l3.6-3.8"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

export function SelectedTutors() {
  return (
    <section
      id="selected-tutors"
      className="relative overflow-hidden border-b border-navy/8 py-12 pb-14 md:py-14 md:pb-16"
      style={{ background: "#EEF1F6" }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 55% 45% at 0% 0%, rgba(53,99,233,0.06), transparent 55%), radial-gradient(ellipse 40% 40% at 100% 100%, rgba(16,27,54,0.03), transparent 50%)",
        }}
        aria-hidden
      />

      <div className="container-page relative">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl leading-tight text-navy sm:text-4xl">
              Il tutor giusto, quando ti serve.
            </h2>
            <p className="mt-3 text-base leading-relaxed text-slate sm:text-lg">
              Se Claudio non è disponibile, oppure hai bisogno di supporto in una materia
              specifica, Claudio Tutoring può affidarti a un tutor selezionato personalmente
              in base al tuo esame e alle tue esigenze.
            </p>
          </div>
        </Reveal>

        <div className="mt-8 grid gap-3.5 md:grid-cols-3 md:gap-4">
          {points.map((item, i) => (
            <Reveal key={item.title} delayMs={i * 70}>
              <article className="card-surface group flex h-full flex-col items-start gap-3.5 px-5 py-5 transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(16,27,54,0.1)] sm:items-center sm:px-6 sm:py-6 sm:text-center">
                <div className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-navy text-white transition duration-300 group-hover:bg-blue">
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-display text-lg leading-snug text-navy sm:text-xl">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate">{item.description}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delayMs={200}>
          <p className="mt-7 text-center text-sm leading-relaxed text-slate">
            <span className="font-semibold text-navy">
              Tu hai sempre un solo riferimento: Claudio Tutoring.
            </span>
            <br className="hidden sm:block" />{" "}
            Dalla scelta del tutor all&apos;organizzazione delle lezioni.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
