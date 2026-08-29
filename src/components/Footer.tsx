import { CONTACT, SITE } from "@/lib/constants";
import { BookingButton } from "./BookingButton";

const footerLinks = [
  { href: "#subjects", label: "Materie" },
  { href: "#how-it-works", label: "Come funziona" },
  { href: "#results", label: "Esperienza" },
  { href: "#about", label: "Chi sono" },
  { href: "#pricing", label: "Prezzi" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer id="contact" className="border-t border-navy/8 bg-white/70 pb-8 pt-12">
      <div className="container-page">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <p className="font-display text-xl text-navy">{SITE.footerBrand}</p>
            <p className="mt-2 text-sm leading-relaxed text-slate">
              Ripetizioni online di materie scientifiche: spiegazioni chiare, focus
              sull&apos;esame, lezioni sul tuo livello.
            </p>
            <div className="mt-4">
              <BookingButton className="!px-5 !py-2.5 !text-sm">Prenota una lezione</BookingButton>
            </div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate">Menu</p>
            <ul className="mt-3 space-y-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-sm text-navy hover:text-blue">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate">Contatti</p>
            <ul className="mt-3 space-y-2 text-sm text-navy">
              <li>
                <a href={`mailto:${CONTACT.email}`} className="hover:text-blue">
                  {CONTACT.email}
                </a>
              </li>
              <li>
                <p>{CONTACT.phoneDisplay}</p>
                <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
                  <a
                    href={CONTACT.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue"
                  >
                    WhatsApp
                  </a>
                  <span className="text-navy/25" aria-hidden>
                    ·
                  </span>
                  <a
                    href={CONTACT.telegram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue"
                  >
                    Telegram
                  </a>
                </p>
              </li>
              {(CONTACT.instagram || CONTACT.linkedin) && (
                <li className="flex gap-3 pt-1">
                  {CONTACT.instagram && (
                    <a
                      href={CONTACT.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-blue"
                    >
                      Instagram
                    </a>
                  )}
                  {CONTACT.instagram && CONTACT.linkedin && (
                    <span className="text-navy/20">·</span>
                  )}
                  {CONTACT.linkedin && (
                    <a
                      href={CONTACT.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-blue"
                    >
                      LinkedIn
                    </a>
                  )}
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-navy/8 pt-6 text-xs text-slate sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {SITE.name}. Tutti i diritti riservati.
          </p>
          <p>Ripetizioni online · Italia e non solo</p>
        </div>
      </div>
    </footer>
  );
}
