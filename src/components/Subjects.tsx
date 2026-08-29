import { ADDITIONAL_SUBJECTS, SUBJECTS } from "@/lib/constants";
import { Reveal } from "./Reveal";

function SubjectIcon({ type }: { type: (typeof SUBJECTS)[number]["icon"] }) {
  const common = {
    width: 28,
    height: 28,
    viewBox: "0 0 24 24",
    fill: "none",
    "aria-hidden": true as const,
  };

  switch (type) {
    case "integral":
      return (
        <svg {...common}>
          <path
            d="M10 4c-2 0-3 1.4-3 3.2V17c0 2.4-1.2 3.5-3 3.5M14 4c2 0 3 1.4 3 3.2V17c0 2.4 1.2 3.5 3 3.5"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
        </svg>
      );
    case "surface":
      return (
        <svg {...common}>
          <path
            d="M4 16c3-6 6-9 8-9s5 3 8 9M4 8c3 6 6 9 8 9s5-3 8-9"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
        </svg>
      );
    case "matrix":
      return (
        <svg {...common}>
          <path d="M7 5v14M17 5v14" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          <circle cx="12" cy="8" r="1.2" fill="currentColor" />
          <circle cx="12" cy="12" r="1.2" fill="currentColor" />
          <circle cx="12" cy="16" r="1.2" fill="currentColor" />
        </svg>
      );
    case "atom":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="1.6" fill="currentColor" />
          <ellipse cx="12" cy="12" rx="8" ry="3.2" stroke="currentColor" strokeWidth="1.5" />
          <ellipse
            cx="12"
            cy="12"
            rx="8"
            ry="3.2"
            stroke="currentColor"
            strokeWidth="1.5"
            transform="rotate(60 12 12)"
          />
          <ellipse
            cx="12"
            cy="12"
            rx="8"
            ry="3.2"
            stroke="currentColor"
            strokeWidth="1.5"
            transform="rotate(120 12 12)"
          />
        </svg>
      );
    case "flask":
      return (
        <svg {...common}>
          <path
            d="M10 3h4M11 3v5.2L6.8 17a3 3 0 002.6 4.5h5.2a3 3 0 002.6-4.5L13 8.2V3"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
  }
}

export function Subjects() {
  return (
    <section id="subjects" className="section-pad bg-white/50">
      <div className="container-page">
        <Reveal>
          <div className="max-w-2xl">
            <p className="eyebrow">Materie</p>
            <h2 className="mt-3 font-display text-3xl text-navy sm:text-4xl">
              Le materie che spiego più spesso.
            </h2>
            <p className="mt-3 text-base text-slate sm:text-lg">
              Queste sono le principali. Se ti serve altro di scientifico, chiedi pure.
            </p>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SUBJECTS.map((subject, i) => (
            <Reveal key={subject.id} delayMs={i * 60}>
              <article className="card-surface group h-full p-6 transition hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(16,27,54,0.1)]">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-navy text-white transition group-hover:bg-blue">
                  <SubjectIcon type={subject.icon} />
                </div>
                <h3 className="font-display text-xl text-navy">{subject.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate">{subject.description}</p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delayMs={100}>
          <div className="mt-10 border-t border-navy/8 pt-8">
            <h3 className="font-display text-2xl text-navy">Altre materie disponibili</h3>
            <p className="mt-2 max-w-2xl text-sm text-slate">
              Disponibili su richiesta, quando ha senso per il tuo percorso.
            </p>

            <div className="mt-6 grid gap-5 md:grid-cols-3">
              {ADDITIONAL_SUBJECTS.map((group) => (
                <div key={group.category}>
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate">
                    {group.category}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-navy/10 bg-white px-3 py-1.5 text-sm font-medium text-navy shadow-sm"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
