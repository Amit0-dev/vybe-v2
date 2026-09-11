import type { Metadata } from "next";
import { Geist_Mono, Noto_Sans_JP, Zen_Kaku_Gothic_New } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const zenKaku = Zen_Kaku_Gothic_New({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const notoSansJp = Noto_Sans_JP({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vybe — Music, together",
  description:
    "Collaborative music queues for parties, hangouts, and groups. Add tracks, vote, and let the vibe decide.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${zenKaku.variable} ${notoSansJp.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background font-sans text-foreground">
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
