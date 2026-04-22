import type { Metadata } from 'next'
import './globals.css'
import { SessionProvider } from '@/components/providers/SessionProvider'

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
      <body className="min-h-screen bg-gray-50">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  )
}
