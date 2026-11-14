import type { Metadata, Viewport } from "next";
import { Cairo, IBM_Plex_Sans_Arabic, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import { WhatsAppButton } from "@/components/site/whatsapp-button";
import { VisitPing } from "@/components/analytics/visit-ping";
import { MotionProvider } from "@/components/ui/motion-provider";
import { SITE_NAME, SITE_URL } from "@/content/site";
import "./globals.css";

const plex = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  variable: "--font-plex",
  display: "swap",
});

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["900"],
  variable: "--font-cairo",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  preload: false,
  variable: "--font-mono",
  display: "swap",
});

const DEFAULT_TITLE = `${SITE_NAME} | كورسات برمجة وتصميم وتسويق وذكاء اصطناعي أونلاين وحضوري`;
const DEFAULT_DESCRIPTION =
  "كورسات برمجة وتصميم UI/UX وتسويق رقمي وذكاء اصطناعي وIT وشبكات وتحليل بيانات، أونلاين أو في القاعة. أول درس مجاني وشهادة إتمام مع المدرّب ريمون رومانى.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: "Remon Romany", url: "https://remonromany.com" }],
  creator: "Remon Romany",
  keywords: [
    "كورسات برمجة",
    "كورس UI/UX",
    "كورس تسويق رقمي",
    "كورس ذكاء اصطناعي",
    "كورس تحليل بيانات",
    "كورس Flutter",
    "كورس React",
    "كورسات أونلاين",
    "أكاديمية ريمون",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "ar_EG",
    url: "/",
    siteName: SITE_NAME,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  category: "education",
  verification: process.env.GOOGLE_SITE_VERIFICATION ? { google: process.env.GOOGLE_SITE_VERIFICATION } : undefined,
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0b1511",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${plex.variable} ${cairo.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <MotionProvider>{children}</MotionProvider>
        <VisitPing />
        <WhatsAppButton />
        {process.env.NEXT_PUBLIC_GA_ID && /^G-[A-Z0-9]+$/i.test(process.env.NEXT_PUBLIC_GA_ID) ? (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`} strategy="afterInteractive" />
            <Script id="ga4" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${process.env.NEXT_PUBLIC_GA_ID}');`}
            </Script>
          </>
        ) : null}
      </body>
    </html>
  );
}
