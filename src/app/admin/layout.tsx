import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Dashboard · Claudio Tutor" },
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="admin-root min-h-screen">{children}</div>;
}
