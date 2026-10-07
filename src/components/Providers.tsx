"use client";

import { usePathname } from "next/navigation";
import { ContactProvider } from "@/lib/contact-context";
import { ContactModal } from "./ContactModal";
import { FloatingChatButtons } from "./ChatButtons";

export function Providers({ children }: { children: React.ReactNode }) {
  const isAdmin = usePathname()?.startsWith("/admin") ?? false;

  return (
    <ContactProvider>
      {children}
      <ContactModal />
      {!isAdmin && <FloatingChatButtons />}
    </ContactProvider>
  );
}
