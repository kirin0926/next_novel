import { Header } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { type ReactNode } from 'react'

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <Header />
        <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}