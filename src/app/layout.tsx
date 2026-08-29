import type { Metadata, Viewport } from "next";
import { Fraunces, Manrope } from "next/font/google";
import { Providers } from "@/components/Providers";
import { SITE } from "@/lib/constants";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["SOFT", "opsz"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: SITE.title,
    template: `%s | ${SITE.shortName} Tutor STEM`,
  },
  description: SITE.description,
  keywords: [
    "ripetizioni matematica online",
    "ripetizioni analisi 1",
    "ripetizioni analisi 2",
    "ripetizioni fisica online",
    "ripetizioni algebra lineare",
    "tutor universitario online",
    "lezioni private matematica",
    "preparazione esami universitari",
    "ripetizioni chimica online",
    "Claudio Asaro tutor",
  ],
  authors: [{ name: SITE.name }],
  creator: SITE.name,
  openGraph: {
    type: "website",
    locale: SITE.locale,
    url: SITE.url,
    siteName: SITE.brand,
    title: SITE.title,
    description: SITE.description,
    images: [
      {
        url: "/images/claudio-hero.jpg",
        width: 800,
        height: 1000,
        alt: "Claudio Asaro — Tutor STEM Online",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.title,
    description: SITE.description,
    images: ["/images/claudio-hero.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: SITE.url,
  },
};

export const viewport: Viewport = {
  themeColor: "#101B36",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" className={`${manrope.variable} ${fraunces.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans text-ink">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
