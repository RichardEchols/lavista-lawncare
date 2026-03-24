import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lavista Lawn Care — Snap. Quote. Get Paid.",
  description:
    "AI-powered quoting and payment tool for landscapers. Take a picture, get a quote, get paid instantly.",
  openGraph: {
    title: "Lavista Lawn Care",
    description: "AI-powered quoting and payment tool for landscapers.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#2d6a4f",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900 antialiased">{children}</body>
    </html>
  );
}
