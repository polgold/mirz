import type { Metadata, Viewport } from "next";
import { Inter, Lora } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://mirtazaliauskas.com"),
  title: { default: "Mirta Zaliauskas", template: "%s" },
  description: "Mirta Zaliauskas – Argentine visual artist. Mixed media, drawing, engraving and recycled materials.",
  openGraph: {
    url: "https://mirtazaliauskas.com",
    siteName: "Mirta Zaliauskas",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.variable} ${lora.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
