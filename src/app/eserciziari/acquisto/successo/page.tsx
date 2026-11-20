import Link from "next/link";
import { ShopChrome } from "@/components/eserciziari/ShopChrome";
import { createTimedDownloadUrlForSlug } from "@/lib/eserciziari/checkout";
import { isR2Configured } from "@/lib/eserciziari/r2";
import { getStripe, isStripeConfigured } from "@/lib/eserciziari/stripe";

type PageProps = {
  searchParams: Promise<{ session_id?: string }>;
};

export default async function CheckoutSuccessPage({ searchParams }: PageProps) {
  const { session_id: sessionId } = await searchParams;

  let title: string | null = null;
  let slug: string | null = null;
  let paid = false;
  let email: string | null = null;
  let downloadUrl: string | null = null;
  let downloadError: string | null = null;

  if (sessionId && isStripeConfigured()) {
    try {
      const session = await getStripe().checkout.sessions.retrieve(sessionId);
      paid = session.payment_status === "paid" || session.status === "complete";
      title = session.metadata?.productTitle ?? null;
      slug = session.metadata?.slug ?? null;
      email = session.customer_details?.email ?? session.customer_email ?? null;

      if (paid && slug) {
        if (!isR2Configured()) {
          downloadError = "Storage PDF non configurato. Contatta Claudio.";
        } else {
          downloadUrl = await createTimedDownloadUrlForSlug(slug);
          if (!downloadUrl) {
            downloadError =
              "Non siamo riusciti a generare il link di download. Scrivi a Claudio con la ricevuta Stripe.";
          }
        }
      }
    } catch {
      paid = false;
    }
  }

  return (
    <ShopChrome>
      <section className="section-pad">
        <div className="container-page">
          <div className="mx-auto max-w-xl text-center">
            <p className="eyebrow text-emerald-700">Pagamento</p>
            <h1 className="mt-3 font-display text-3xl text-navy sm:text-4xl">
              {paid ? "Pagamento ricevuto" : "Verifica del pagamento"}
            </h1>
            <p className="mt-4 text-base leading-relaxed text-slate">
              {paid ? (
                <>
                  Grazie
                  {title ? (
                    <>
                      {" "}
                      per l&apos;acquisto di{" "}
                      <span className="font-semibold text-navy">{title}</span>
                    </>
                  ) : null}
                  .
                  {email ? (
                    <>
                      {" "}
                      Conferma collegata a{" "}
                      <span className="font-medium text-navy">{email}</span>.
                    </>
                  ) : null}
                </>
              ) : (
                <>
                  Non siamo riusciti a confermare la sessione. Se hai completato il pagamento,
                  Controlla l&apos;email di Stripe o riprova dal catalogo.
                </>
              )}
            </p>

            <div className="card-surface mt-8 p-6 text-left sm:p-7">
              <p className="text-sm font-semibold text-navy">Download PDF</p>
              {paid && downloadUrl ? (
                <>
                  <p className="mt-2 text-sm leading-relaxed text-slate">
                    Il link è personale e scade tra circa un&apos;ora. Scarica subito il file
                    {title ? (
                      <>
                        {" "}
                        <span className="font-medium text-navy">{title}</span>
                      </>
                    ) : null}
                    .
                  </p>
                  <a
                    href={downloadUrl}
                    className="btn-primary mt-5 inline-flex !px-6 !py-3 !text-sm"
                  >
                    Scarica il PDF
                  </a>
                </>
              ) : (
                <p className="mt-2 text-sm leading-relaxed text-slate">
                  {downloadError ??
                    (paid
                      ? "Preparazione del download in corso… aggiorna la pagina tra poco."
                      : "Il download sarà disponibile dopo un pagamento confermato.")}
                </p>
              )}
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              {slug ? (
                <Link
                  href={`/eserciziari/${slug}`}
                  className="btn-secondary !px-6 !py-3 !text-sm"
                >
                  Torna all&apos;eserciziario
                </Link>
              ) : null}
              <Link href="/eserciziari" className="btn-primary !px-6 !py-3 !text-sm">
                Catalogo eserciziari
              </Link>
            </div>
          </div>
        </div>
      </section>
    </ShopChrome>
  );
}
