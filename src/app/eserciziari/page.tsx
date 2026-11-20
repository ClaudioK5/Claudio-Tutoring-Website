import type { Metadata } from "next";
import Link from "next/link";
import { BookingButton } from "@/components/BookingButton";
import { Catalog } from "@/components/eserciziari/Catalog";
import { ShopChrome } from "@/components/eserciziari/ShopChrome";
import { Reveal } from "@/components/Reveal";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Eserciziari universitari",
  description:
    "Preparati ai tuoi esami con esercizi a difficoltà crescente e soluzioni spiegate passo dopo passo. Eserciziari PDF di Analisi, Algebra Lineare e altre materie STEM.",
  alternates: { canonical: `${SITE.url}/eserciziari` },
  openGraph: {
    title: "Eserciziari universitari – ClaudioTutoring",
    description:
      "Esercizi a difficoltà crescente e soluzioni spiegate passo dopo passo.",
    url: `${SITE.url}/eserciziari`,
  },
};

export default function EserciziariPage() {
  return (
    <ShopChrome>
      <section className="section-pad">
        <div className="container-page">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <p className="eyebrow">Catalogo</p>
              <h1 className="mt-3 font-display text-3xl text-navy sm:text-4xl md:text-[2.6rem]">
                Eserciziari universitari – ClaudioTutoring
              </h1>
              <div className="mt-4 space-y-4 text-base leading-relaxed text-slate sm:text-lg">
                <p>
                  Ogni raccolta riunisce in un unico PDF esercizi mirati, tipologie diverse e
                  soluzioni complete passo dopo passo, così puoi continuare ad allenarti senza
                  perdere tempo tra siti, forum, dispense e materiale sparso.
                </p>
                <p>
                  Gli esercizi e gli svolgimenti vengono controllati e corretti personalmente da
                  Claudio e sottoposti anche alla verifica di altri professori prima della
                  pubblicazione.
                </p>
              </div>
            </div>
          </Reveal>

          <div className="mt-12">
            <Catalog />
          </div>

          <Reveal delayMs={100}>
            <aside className="card-surface mx-auto mt-16 max-w-3xl p-6 text-center sm:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-blue">
                In lezione privata
              </p>
              <h2 className="mt-2 font-display text-2xl text-navy">
                I materiali giusti, anche con te in diretta.
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate sm:text-base">
                Con le ripetizioni individuali, esercizi e schemi restano parte del percorso
                coordinato da Claudio Tutoring. Se ti serve supporto personalizzato sull&apos;esame,
                prenota una lezione.
              </p>
              <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                <BookingButton className="!px-6 !py-3 !text-sm">Prenota una lezione</BookingButton>
                <Link href="/#pricing" className="btn-secondary !px-6 !py-3 !text-sm">
                  Vedi i prezzi
                </Link>
              </div>
            </aside>
          </Reveal>
        </div>
      </section>
    </ShopChrome>
  );
}
