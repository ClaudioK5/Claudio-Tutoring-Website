import { STATS } from "@/lib/constants";
import { Reveal } from "./Reveal";

const bullets = [
  "Ingegneria Aerospaziale — Università di Pisa",
  `Oltre ${STATS.lessonsTaught} lezioni online`,
  "Esperienza con studenti universitari e delle superiori",
  "Founder di FrameAware, micro-SaaS basato su AI video analysis",
  "Lezioni chiare, pazienti e senza pressione",
];

export function About() {
  return (
    <section id="about" className="section-pad bg-white/50">
      <div className="container-page grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
        <Reveal>
          <div className="relative mx-auto w-full max-w-md">
            <div className="card-surface overflow-hidden p-3">
              <div className="aspect-[4/5] overflow-hidden rounded-[1rem] bg-navy/5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/claudio-about.jpg"
                  alt="Claudio Asaro"
                  className="h-full w-full object-cover object-top"
                />
              </div>
            </div>
            <div className="absolute -bottom-4 left-6 right-6 rounded-2xl border border-navy/8 bg-white px-4 py-3 shadow-[0_12px_30px_rgba(16,27,54,0.1)] sm:left-10 sm:right-10">
              <p className="text-sm font-semibold text-navy">Ingegneria Aerospaziale</p>
              <p className="text-xs text-slate">Università di Pisa · {STATS.lessonsTaught} lezioni</p>
            </div>
          </div>
        </Reveal>

        <Reveal delayMs={100}>
          <p className="eyebrow">Chi sono</p>
          <h2 className="mt-3 font-display text-3xl leading-tight text-navy sm:text-4xl">
            La materia può essere difficile. La lezione non deve esserlo.
          </h2>

          <p className="mt-6 text-base leading-relaxed text-slate sm:text-lg">
            Con gli studenti lavoro in modo molto diretto, tranquillo e umano.
            Puoi fermarmi, chiedermi di rifare un passaggio o dirmi che non hai
            capito nulla: nessun problema. Mi piace parlare con gli studenti,
            conoscere il loro percorso e creare un ambiente in cui si lavora
            seriamente senza stare un&apos;ora sotto pressione.
          </p>

          <p className="mt-4 text-base leading-relaxed text-slate sm:text-lg">
            L&apos;obiettivo è che a fine lezione tu abbia più chiarezza, meno
            confusione e sappia esattamente quale sarà il passo successivo.
          </p>

          <ul className="mt-6 space-y-3 text-sm text-navy sm:text-base">
            {bullets.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-gold" aria-hidden />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <div className="mt-7 rounded-2xl border border-navy/8 bg-white px-5 py-5 shadow-[0_8px_24px_rgba(16,27,54,0.04)]">
            <h3 className="font-display text-xl text-navy">
              Serio con la materia. Tranquillo con lo studente.
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate sm:text-[0.95rem]">
              A lezione sono paziente, diretto e molto tranquillo. Puoi fare domande,
              sbagliare e fermarmi quando qualcosa non è chiaro. Gli argomenti possono
              essere difficili; la lezione non deve essere pesante.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
