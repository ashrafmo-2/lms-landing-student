import type { Metadata } from "next";
import { Geist, Geist_Mono, IBM_Plex_Sans_Arabic } from "next/font/google";
import "../globals.css";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { routing } from "@/shared/i18n/routing";
import { Providers } from "../providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-ibm-plex-sans-arabic",
  subsets: ["arabic"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "LMS Student",
  description: "LMS Student Dashboard",
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  const direction = locale === "ar" ? "rtl" : "ltr";

  return (
    <html
      lang={locale}
      dir={direction}
      className={`${geistSans.variable} ${geistMono.variable} ${ibmPlexSansArabic.variable} h-full antialiased`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        {/* Apply saved theme before first paint to avoid flash */}
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: intentional inline script for theme init
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var mode   = localStorage.getItem('theme-mode')   || 'light';
                  var accent = localStorage.getItem('theme-accent') || 'violet';
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  var isDark = mode === 'dark' || (mode === 'system' && prefersDark);
                  document.documentElement.setAttribute('data-dark',  isDark ? 'true' : 'false');
                  document.documentElement.setAttribute('data-theme', accent);
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className="min-h-full flex flex-col"
        style={{
          fontFamily:
            locale === "ar"
              ? "var(--font-ibm-plex-sans-arabic), sans-serif"
              : undefined,
        }}
      >
        <NextIntlClientProvider messages={messages}>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
