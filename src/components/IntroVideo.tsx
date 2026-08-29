import { INTRO_VIDEO } from "@/lib/constants";
import { Reveal } from "./Reveal";

/**
 * Sezione video di presentazione — Cloudflare R2, poster locale, niente autoplay.
 */
export function IntroVideo() {
  return (
    <section id="intro-video" className="section-pad bg-white/50">
      <div className="container-page">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">Video</p>
            <h2 className="mt-3 font-display text-3xl text-navy sm:text-4xl">
              Conosciamoci prima della prima lezione.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate sm:text-lg">
              In un minuto ti spiego come lavoro, cosa puoi aspettarti e come
              possiamo affrontare insieme ciò che stai preparando.
            </p>
          </div>
        </Reveal>

        <Reveal delayMs={100}>
          <div className="mx-auto mt-10 max-w-4xl">
            <div className="card-surface overflow-hidden p-2 sm:p-3">
              <div className="relative aspect-video overflow-hidden rounded-xl bg-navy">
                <video
                  className="h-full w-full object-cover"
                  controls
                  playsInline
                  preload="metadata"
                  poster={INTRO_VIDEO.poster}
                  aria-label="Video di presentazione di Claudio Asaro"
                >
                  <source src={INTRO_VIDEO.src} type="video/mp4" />
                  Il tuo browser non supporta la riproduzione video.
                </video>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
