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
