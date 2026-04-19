import { Suspense, type ReactNode } from "react";
import type { Metadata } from "next";
import Script from "next/script";
import { Inter, Playfair_Display } from "next/font/google";
import { GoogleAnalytics } from "@/components/analytics/google-analytics";
import { WebVitals } from "@/components/analytics/web-vitals";
import { LayoutShell } from "@/components/layout/layout-shell";
import { JsonLd } from "@/components/ui/json-ld";
import { Toaster } from "@/components/ui/sonner";
import { SITE_NAME, SITE_URL, SITE_DESCRIPTION } from "@/lib/constants";
import "@/app/globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} | UK Development Finance Brokers`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} | UK Development Finance Brokers`,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | UK Development Finance Brokers`,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "FinancialService",
  name: SITE_NAME,
  description: SITE_DESCRIPTION,
  url: SITE_URL,
  areaServed: {
    "@type": "Country",
    name: "United Kingdom",
  },
  serviceType: "Development Finance Brokerage",
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html suppressHydrationWarning lang="en">
      <head>
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
      </head>
      <body
        className={`${inter.variable} ${playfair.variable} bg-background text-foreground overscroll-none antialiased`}
      >
        <GoogleAnalytics measurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "G-SRZHTZ3SVY"} />
        <WebVitals />
        <LayoutShell>{children}</LayoutShell>
          <Suspense fallback={null}><Toaster /></Suspense>
        <JsonLd data={organizationJsonLd} />
        {process.env.NEXT_PUBLIC_ANALYTICS_SITE_ID && (
          <Script
            src="/t.js"
            data-site={process.env.NEXT_PUBLIC_ANALYTICS_SITE_ID}
            strategy="afterInteractive"
          />
        )}
        <Script
          src="https://beta.leadconnectorhq.com/loader.js"
          data-resources-url="https://beta.leadconnectorhq.com/chat-widget/loader.js"
          data-widget-id="699f3a553303b65421850864"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
