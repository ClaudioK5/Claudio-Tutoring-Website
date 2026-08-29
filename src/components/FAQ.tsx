"use client";

import { useState } from "react";
import { FAQ_ITEMS } from "@/lib/constants";
import { Reveal } from "./Reveal";

export function FAQ() {
  const [openId, setOpenId] = useState<number | null>(0);

  return (
    <section id="faq" className="section-pad bg-white/50">
      <div className="container-page">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">Domande frequenti</p>
            <h2 className="mt-3 font-display text-3xl text-navy sm:text-4xl">
              Le cose che di solito mi chiedono
            </h2>
          </div>
        </Reveal>

        <div className="mx-auto mt-10 max-w-3xl space-y-3">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openId === index;
            return (
              <Reveal key={item.question} delayMs={index * 40}>
                <div className="card-surface overflow-hidden">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                    aria-expanded={isOpen}
                    onClick={() => setOpenId(isOpen ? null : index)}
                  >
                    <span className="font-display text-lg text-navy">{item.question}</span>
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy/5 text-navy transition ${
                        isOpen ? "rotate-45 bg-blue text-white" : ""
                      }`}
                      aria-hidden
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M12 5v14M5 12h14"
                          stroke="currentColor"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </span>
                  </button>
                  <div
                    className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                      isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="px-5 pb-5 text-sm leading-relaxed text-slate">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
