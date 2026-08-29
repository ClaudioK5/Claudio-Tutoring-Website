import { Reveal } from "./Reveal";
import { BoardGallery } from "./BoardGallery";

const steps = [
  {
    step: "01",
    title: "Mi mandi materiale e obiettivo",
    description:
      "Prima della lezione mi mandi ciò su cui vuoi lavorare: teoria, esercizi, compiti o materiale d'esame. Così so già da dove partire.",
  },
  {
    step: "02",
    title: "Ci vediamo su Google Meet",
    description:
      "Prenoti l'orario e ti mando il link. Ti basta aprirlo e ci colleghiamo: niente procedure complicate.",
  },
  {
    step: "03",
    title: "Studiamo insieme passo dopo passo",
    description:
      "Lavoriamo su teoria ed esercizi usando iDroo, la mia lavagna digitale, per spiegare formule, grafici e passaggi in modo chiaro.",
  },
  {
    step: "04",
    title: "Facciamo il punto",
    description:
      "A fine lezione facciamo il punto su ciò che hai capito e decidiamo cosa affrontare dopo. Se ti è utile, ti mando la lavagna in PDF o immagine: così rivedi gli appunti e ti resta tutto il lavoro fatto.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="section-pad">
      <div className="container-page">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">Come funziona</p>
            <h2 className="mt-3 font-display text-3xl text-navy sm:text-4xl">
              Un percorso chiaro, dall&apos;inizio alla fine.
            </h2>
            <p className="mt-3 text-base text-slate sm:text-lg">
              Non è solo “ci vediamo su Meet”. È un flusso professionale: materiale,
              lezione preparata, lavagna digitale e appunti che ti restano.
            </p>
          </div>
        </Reveal>

        <ol className="relative mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          <div
            className="pointer-events-none absolute left-[8%] right-[8%] top-10 hidden h-px bg-gradient-to-r from-transparent via-blue/30 to-transparent lg:block"
            aria-hidden
          />
          {steps.map((item, i) => (
            <Reveal key={item.step} delayMs={i * 80}>
              <li className="card-surface relative h-full p-6">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue text-sm font-bold text-white">
                  {item.step}
                </span>
                <h3 className="mt-4 font-display text-xl text-navy">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate">{item.description}</p>
              </li>
            </Reveal>
          ))}
        </ol>

        <BoardGallery />
      </div>
    </section>
  );
}
