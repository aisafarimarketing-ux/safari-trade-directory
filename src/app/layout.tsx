import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Safari Trade Directory | 2025-2026',
  description: 'Nyumbani & Hilala Camp Special Offers and Trade Profiles',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
