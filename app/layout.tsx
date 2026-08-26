import type { Metadata, Viewport } from "next";
import { Inter, IBM_Plex_Sans_Arabic } from "next/font/google";
import "./globals.css";
import { LocaleBootstrap } from "@/components/LocaleBootstrap";
import { ThreeBackground } from "@/components/ThreeBackgroundLazy";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-ibm-plex-arabic",
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700"],
});

// خلفية 3D تفاعلية (Three.js) - تبقى خلف كل الصفحات
const BG_VIDEO_SRC = "/bg-video.mp4";

export const metadata: Metadata = {
  title: "زهقان | Zawhan",
  description: "حوّل مللك إلى بناء حقيقي. مهام صغيرة مُنتجة في 2، 10، 30 دقيقة أو ساعة.",
  applicationName: "زهقان",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "زهقان",
  },
  formatDetection: {
    telephone: false,
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0a0a0a",
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${inter.variable} ${ibmPlexArabic.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {/* TEMP: ThreeBackground disabled to debug 'page couldn't load' */}
        {/* <ThreeBackground /> */}
        <LocaleBootstrap />
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js').catch(() => {});
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
