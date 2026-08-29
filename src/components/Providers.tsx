"use client";

import { ContactProvider } from "@/lib/contact-context";
import { ContactModal } from "./ContactModal";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ContactProvider>
      {children}
      <ContactModal />
    </ContactProvider>
  );
}
