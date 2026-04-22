import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'ESKOB - Esnaf Dijital Vitrin Platformu',
    template: '%s | ESKOB',
  },
  description: 'Yerel esnafı keşfet, randevu al, hizmet bul.',
  metadataBase: new URL('https://eskob.vercel.app'),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body className="min-h-screen bg-gray-50">{children}</body>
    </html>
  )
}
