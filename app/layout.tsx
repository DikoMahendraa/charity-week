import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryProvider } from "@/providers/query-provider";
import { AuthProvider } from "@/contexts/auth-context";

const raleway = localFont({
  src: [
    { path: "../public/assets/fonts/Raleway/Raleway-Light.ttf", weight: "300", style: "normal" },
    { path: "../public/assets/fonts/Raleway/Raleway-Regular.ttf", weight: "400", style: "normal" },
    { path: "../public/assets/fonts/Raleway/Raleway-Medium.ttf", weight: "500", style: "normal" },
    { path: "../public/assets/fonts/Raleway/Raleway-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "../public/assets/fonts/Raleway/Raleway-Bold.ttf", weight: "700", style: "normal" },
    { path: "../public/assets/fonts/Raleway/Raleway-ExtraBold.ttf", weight: "800", style: "normal" },
    { path: "../public/assets/fonts/Raleway/Raleway-Black.ttf", weight: "900", style: "normal" },
    { path: "../public/assets/fonts/Raleway/Raleway-LightItalic.ttf", weight: "300", style: "italic" },
    { path: "../public/assets/fonts/Raleway/Raleway-Italic.ttf", weight: "400", style: "italic" },
  ],
  variable: "--font-raleway",
  display: "swap",
});

const nexa = localFont({
  src: [
    { path: "../public/assets/fonts/Nexa/Webfonts/Nexa_Free_Bold-webfont.woff2", weight: "700", style: "normal" },
    { path: "../public/assets/fonts/Nexa/Webfonts/Nexa_Free_Bold-webfont.woff", weight: "700", style: "normal" },
    { path: "../public/assets/fonts/Nexa/Nexa Light.otf", weight: "300", style: "normal" },
  ],
  variable: "--font-nexa",
  display: "swap",
});

export const metadata: Metadata = {
  title: "IRUK Charity Week CMS",
  description: "CMS Dashboard for IRUK Charity Week",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${raleway.variable} ${nexa.variable} h-full antialiased`}
    >
      <body className="h-full">
        <QueryProvider>
          <AuthProvider>
            <TooltipProvider delay={300}>{children}</TooltipProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
