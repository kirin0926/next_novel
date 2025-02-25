import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Layout } from "@/components/layout";
import { ClerkProvider } from '@clerk/nextjs'
import Script from 'next/script'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Read Novels Online Free - nicenovel.org | Free Books Online | NovelShort, NovelMaster, RealNovel, NovaBeats",
  description: "Discover thousands of English novels and series on nicenovel.org. Genres include Adventure, Billionaire, Christian, Classic, Fantasy, Historical, Horror, Humorous, Mystery, New Adult, Romance, Science Fiction, Thriller, Western, and Young Adult. Read novels online free, free books online. Explore NovelShort, NovelMaster, RealNovel, NovaBeats.",
  keywords: [
    "novels online",
    "free books",
    "read novels",
    "online reading",
    "NovelShort",
    "NovelMaster",
    "RealNovel",
    "NovaBeats",
    "Adventure",
    "Billionaire",
    "Christian",
    "Classic",
    "Fantasy",
    "Historical",
    "Horror",
    "Humorous",
    "Mystery",
    "New Adult",
    "Romance",
    "Science Fiction",
    "Thriller",
    "Western",
    "Young Adult"
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head> 
        {process.env.NODE_ENV === 'production' && (
          <>
            <script
              async
              src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7897104007345492"
              crossOrigin="anonymous"
            />
            <script defer src="https://umami-dun-pi.vercel.app/script.js" data-website-id="a8c9a43e-6ecf-465d-8024-651833a02934"></script>
          </>
        )}
          
        </head>
        <body  className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <Layout>{children}</Layout>
        </body>
      </html>
    </ClerkProvider>
  );
}
