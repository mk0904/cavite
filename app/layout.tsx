import type { Metadata } from "next";
import { Geist, Space_Grotesk } from "next/font/google";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Cavite Campus | Transparent Placement Management",
  description:
    "Cavite Campus helps college placement teams manage opportunities, custom hiring phases, shortlists, feedback, and 14-day student outcomes in one platform.",
  keywords: [
    "placement management software",
    "college placement platform",
    "campus hiring software",
    "student placement tracking",
    "Cavite Campus",
  ],
  openGraph: {
    title: "Cavite Campus",
    description:
      "A placement operating system for colleges built around live application status, editable hiring phases, and a 14-day outcome promise.",
    type: "website",
    url: "https://cavite.in",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geist.variable} ${spaceGrotesk.variable}`}>
        {children}
      </body>
    </html>
  );
}
