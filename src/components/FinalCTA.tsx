import { BookingButton } from "./BookingButton";
import { Reveal } from "./Reveal";

export function FinalCTA() {
  return (
    <section className="section-pad pt-4 md:pt-6">
      <div className="container-page">
        <Reveal>
          <div className="relative overflow-hidden rounded-[1.75rem] bg-navy px-6 py-12 text-center shadow-[0_24px_60px_rgba(16,27,54,0.28)] sm:px-10 sm:py-16">
            <div
              className="pointer-events-none absolute inset-0 opacity-40"
              style={{
                background:
                  "radial-gradient(circle at 20% 20%, rgba(53,99,233,0.45), transparent 42%), radial-gradient(circle at 80% 80%, rgba(201,164,92,0.22), transparent 40%)",
              }}
              aria-hidden
            />
            <div className="relative mx-auto max-w-2xl">
              <h2
                className="font-display text-3xl sm:text-4xl"
                style={{ color: "#FFFFFF" }}
              >
                Passiamo insieme il prossimo esame.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-white/70 sm:text-lg">
                Dimmi cosa stai preparando, quando hai l&apos;esame e dove ti
                blocchi. Partiamo da lì.
              </p>
              <div className="mt-8 flex justify-center">
                <BookingButton className="!px-7 !py-3.5">Prenota la prima lezione</BookingButton>
              </div>
              <p className="mt-4 text-sm text-white/55">
                Online · uno a uno · università e superiori
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
