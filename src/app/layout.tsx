import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lavista Lawn Care — AI Quoting Tool",
  description:
    "Upload a yard photo, get an instant professional quote with payment link. Built for landscapers.",
  openGraph: {
    title: "Lavista Lawn Care",
    description:
      "AI-powered quoting and payment tool for landscapers.",
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
    <html lang="en" className="h-full">
      <body className="h-full bg-white text-gray-900 antialiased overflow-hidden">
        {children}
      </body>
    </html>
  );
}
