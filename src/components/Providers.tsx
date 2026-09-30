"use client";

import { ContactProvider } from "@/lib/contact-context";
import { ContactModal } from "./ContactModal";
import { FloatingChatButtons } from "./ChatButtons";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ContactProvider>
      {children}
      <ContactModal />
      <FloatingChatButtons />
    </ContactProvider>
  );
}
