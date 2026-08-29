"use client";

import { useEffect, useState } from "react";
import { NAV_LINKS, SITE } from "@/lib/constants";
import { BookingButton } from "./BookingButton";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-navy/8 bg-ivory/90 shadow-[0_8px_30px_rgba(16,27,54,0.06)] backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <div className="container-page flex h-[4.25rem] items-center justify-between gap-4">
        <a href="#top" className="group flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-navy text-sm font-bold text-white shadow-sm">
            C
          </span>
          <span className="font-display text-[1.05rem] font-semibold tracking-tight text-navy">
            {SITE.brand}
          </span>
        </a>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Navigazione principale">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-full px-3.5 py-2 text-sm font-medium text-slate transition hover:bg-navy/5 hover:text-navy"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden lg:block">
          <BookingButton className="!px-5 !py-2.5 !text-sm">Prenota una lezione</BookingButton>
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-navy/10 bg-white text-navy lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Chiudi menu" : "Apri menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          )}
        </button>
      </div>

      {open && (
        <div
          id="mobile-nav"
          className="border-t border-navy/8 bg-ivory px-4 pb-5 pt-3 lg:hidden"
        >
          <nav className="flex flex-col gap-1" aria-label="Navigazione mobile">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-3 text-base font-medium text-navy hover:bg-white"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="mt-3">
            <BookingButton className="w-full">Prenota una lezione</BookingButton>
          </div>
        </div>
      )}
    </header>
  );
}
