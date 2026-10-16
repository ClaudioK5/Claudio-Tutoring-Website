"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { BOOKING_URL, hasBookingUrl } from "@/lib/constants";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

const GOOGLE_ADS_CONVERSION = {
  send_to: "AW-18516959609/r5J3CPWD_p4dEPnCyf1E",
  value: 1.0,
  currency: "EUR",
} as const;

/** Fires the Google Ads "Prenota" conversion once per call; never blocks navigation. */
function reportBookingConversion() {
  window.gtag?.("event", "conversion", { ...GOOGLE_ADS_CONVERSION });
}

type ContactContextValue = {
  isOpen: boolean;
  openContact: () => void;
  closeContact: () => void;
  handleBooking: () => void;
};

const ContactContext = createContext<ContactContextValue | null>(null);

export function ContactProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openContact = useCallback(() => setIsOpen(true), []);
  const closeContact = useCallback(() => setIsOpen(false), []);

  const handleBooking = useCallback(() => {
    if (hasBookingUrl()) {
      window.open(BOOKING_URL, "_blank", "noopener,noreferrer");
      reportBookingConversion();
      return;
    }
    setIsOpen(true);
  }, []);

  const value = useMemo(
    () => ({ isOpen, openContact, closeContact, handleBooking }),
    [isOpen, openContact, closeContact, handleBooking]
  );

  return (
    <ContactContext.Provider value={value}>{children}</ContactContext.Provider>
  );
}

export function useContact() {
  const ctx = useContext(ContactContext);
  if (!ctx) {
    throw new Error("useContact must be used within ContactProvider");
  }
  return ctx;
}
