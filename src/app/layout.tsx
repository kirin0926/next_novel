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
  title: "nicenovel.org Read Novels Online Free - Free Books Online",
  description: "Adventure Billionaire Christian Classic Fantasy Historical Horror Humorous Mystery New Adult Romance Science Fiction Thriller Western Young Adult. Read novels online free, free books online. Read books online free, read novels online free, read novel series online free. On nicenovel.org you can find thoundsands of english novel, novel series, best author!",
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
            <script defer data-domain="nicenovel.org" src="https://plausible.io/js/script.outbound-links.pageview-props.revenue.tagged-events.js"></script>
          </>
        )}
          
        </head>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <Layout>{children}</Layout>
        </body>
      </html>
    </ClerkProvider>
  );
}
