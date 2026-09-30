import { CONTACT, getWhatsAppUrl } from "@/lib/constants";

function WhatsAppIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12.04 2C6.58 2 2.15 6.4 2.15 11.84c0 1.94.51 3.76 1.4 5.34L2 22l4.98-1.3a9.86 9.86 0 004.99 1.27h.01c5.46 0 9.89-4.4 9.89-9.84C21.87 6.4 17.5 2 12.04 2zm5.75 13.96c-.24.67-1.4 1.23-1.93 1.31-.5.07-1.13.1-1.82-.11-.42-.13-.96-.31-1.65-.61-2.9-1.25-4.79-4.17-4.93-4.36-.14-.19-1.15-1.53-1.15-2.92 0-1.39.73-2.07.99-2.36.26-.29.57-.36.76-.36h.55c.17 0 .4-.06.63.48.24.56.81 1.97.88 2.11.07.14.12.31.02.5-.1.19-.14.31-.28.48-.14.17-.3.38-.43.51-.14.14-.29.29-.12.57.16.28.73 1.2 1.56 1.94 1.07.96 1.97 1.26 2.25 1.4.28.14.44.12.6-.07.17-.19.7-.81.89-1.09.19-.28.38-.23.63-.14.26.1 1.63.77 1.91.91.28.14.47.21.54.33.07.12.07.69-.17 1.36z" />
    </svg>
  );
}

function TelegramIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm4.6 7.04l-1.63 7.68c-.12.55-.45.68-.91.42l-2.52-1.86-1.22 1.17c-.13.14-.25.25-.51.25l.18-2.56 4.67-4.22c.2-.18-.04-.28-.31-.1l-5.77 3.63-2.49-.78c-.54-.17-.55-.54.11-.8l9.72-3.75c.45-.16.84.11.68.72z" />
    </svg>
  );
}

type ChatLinkProps = {
  className?: string;
  children?: React.ReactNode;
};

export function WhatsAppButton({
  className = "",
  children = "Scrivimi su WhatsApp",
}: ChatLinkProps) {
  return (
    <a
      href={getWhatsAppUrl()}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(37,211,102,0.28)] transition hover:bg-[#1ebe57] ${className}`}
    >
      <WhatsAppIcon />
      {children}
    </a>
  );
}

export function TelegramButton({
  className = "",
  children = "Scrivimi su Telegram",
}: ChatLinkProps) {
  return (
    <a
      href={CONTACT.telegram}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 rounded-full bg-[#2AABEE] px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(42,171,238,0.28)] transition hover:bg-[#1f9ad9] ${className}`}
    >
      <TelegramIcon />
      {children}
    </a>
  );
}

export function TelegramTextLink({ className = "" }: { className?: string }) {
  return (
    <a
      href={CONTACT.telegram}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1.5 text-sm font-medium text-[#2AABEE] transition hover:underline ${className}`}
    >
      <TelegramIcon size={16} />
      Oppure su Telegram
    </a>
  );
}

/** Pulsanti flottanti — WhatsApp primario, Telegram secondario */
export function FloatingChatButtons() {
  return (
    <div className="fixed bottom-5 right-4 z-[70] flex flex-col items-end gap-2.5 sm:bottom-6 sm:right-6">
      <a
        href={getWhatsAppUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_12px_28px_rgba(37,211,102,0.4)] transition hover:scale-105 hover:bg-[#1ebe57] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366]"
        aria-label="Scrivi su WhatsApp"
      >
        <WhatsAppIcon size={26} />
      </a>
      <a
        href={CONTACT.telegram}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#2AABEE] text-white shadow-[0_10px_22px_rgba(42,171,238,0.35)] transition hover:scale-105 hover:bg-[#1f9ad9] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2AABEE]"
        aria-label="Scrivi su Telegram"
      >
        <TelegramIcon size={20} />
      </a>
    </div>
  );
}
