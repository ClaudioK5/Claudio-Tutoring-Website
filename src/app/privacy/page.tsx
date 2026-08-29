import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Privacy",
  description: `Informativa privacy di ${SITE.brand}.`,
  robots: { index: false, follow: false },
};

export default function PrivacyPage() {
  return (
    <main className="container-page section-pad max-w-3xl">
      <Link href="/" className="text-sm font-medium text-blue hover:underline">
        ← Torna alla home
      </Link>
      <h1 className="mt-6 font-display text-4xl text-navy">Privacy</h1>
      <p className="mt-4 text-sm leading-relaxed text-slate">
        Pagina provvisoria: prima di raccogliere dati con il form o con un servizio esterno,
        sostituisci questo testo con l&apos;informativa completa.
      </p>
      <div className="mt-8 space-y-4 text-sm leading-relaxed text-navy/80">
        <p>
          Se mi scrivi dal sito, posso ricevere nome, email, scuola/università, materia e
          messaggio. Li uso solo per risponderti su disponibilità e organizzazione delle
          lezioni.
        </p>
        <p>
          Quando colleghi un servizio di form (Formspree, Resend, EmailJS…), controlla come
          tratta i dati e aggiorna questa pagina.
        </p>
        <p>
          Per domande sulla privacy, usa l&apos;email che indichi in{" "}
          <code className="rounded bg-navy/5 px-1.5 py-0.5 text-xs">src/lib/constants.ts</code>.
        </p>
      </div>
    </main>
  );
}
