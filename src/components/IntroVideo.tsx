"use client";

import { useState } from "react";
import { INTRO_VIDEO } from "@/lib/constants";
import { Reveal } from "./Reveal";

/**
 * Sezione video di presentazione — YouTube embed, poster locale, niente autoplay.
 */
export function IntroVideo() {
  const [playing, setPlaying] = useState(false);
  const embedSrc = `https://www.youtube-nocookie.com/embed/${INTRO_VIDEO.youtubeId}?autoplay=1&rel=0`;

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
                {playing ? (
                  <iframe
                    title="Video di presentazione di Claudio Asaro"
                    src={embedSrc}
                    className="absolute inset-0 h-full w-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => setPlaying(true)}
                    className="group absolute inset-0 h-full w-full"
                    aria-label="Riproduci video di presentazione"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={INTRO_VIDEO.poster}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                    <span className="absolute inset-0 bg-navy/25 transition group-hover:bg-navy/35" />
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/25 bg-white/15 text-white shadow-lg backdrop-blur-sm transition group-hover:scale-105 group-hover:bg-white/25 sm:h-[4.5rem] sm:w-[4.5rem]">
                        <svg
                          width="28"
                          height="28"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          aria-hidden
                          className="ml-1"
                        >
                          <path d="M8 6.5v11l9-5.5-9-5.5z" />
                        </svg>
                      </span>
                    </span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
