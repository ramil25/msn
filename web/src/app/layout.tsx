import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "My Sticky Notes - AI-Powered Note Taking",
  description: "A local-first sticky notes app with AI summarization features",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
