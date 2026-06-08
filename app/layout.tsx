import type { Metadata } from "next";
import { Geist, Space_Grotesk } from "next/font/google";
import { ThemeProvider } from "./theme-provider";
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
  title: "cavite.",
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
    title: "cavite.",
    description:
      "A placement operating system for colleges built around live application status, editable hiring phases, and a 14-day outcome promise.",
    type: "website",
    url: "https://cavite.in",
    images: [
      {
        url: "https://cavite.in/logo.png",
        width: 1200,
        height: 630,
        alt: "Cavite Campus - no ghosting. clear outcomes.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "cavite.",
    description:
      "A placement operating system for colleges built around live application status, editable hiring phases, and a 14-day outcome promise.",
    images: ["https://cavite.in/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{var t=localStorage.getItem('cavite-theme');if(t==='dark'||t==='light'){document.documentElement.dataset.theme=t;}}catch(e){}",
          }}
        />
      </head>
      <body className={`${geist.variable} ${spaceGrotesk.variable}`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
