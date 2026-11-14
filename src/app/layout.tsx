import type { Metadata, Viewport } from "next";
import { Cairo, IBM_Plex_Sans_Arabic, JetBrains_Mono } from "next/font/google";
import { WhatsAppButton } from "@/components/site/whatsapp-button";
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
  "كورسات برمجة وتصميم UI/UX وتسويق رقمي وذكاء اصطناعي وتحليل بيانات، أونلاين أو في القاعة. أول درس مجاني وشهادة إتمام مع المدرّب ريمون رومانى.";

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
        <WhatsAppButton />
      </body>
    </html>
  );
}
