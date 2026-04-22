'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'

const MENU = [
  { href: '/panel', ikon: '📊', etiket: 'Panel' },
  { href: '/vitrin', ikon: '🏪', etiket: 'Vitrin' },
  { href: '/hizmetler', ikon: '✂️', etiket: 'Hizmetler' },
  { href: '/randevular', ikon: '📅', etiket: 'Randevular' },
]

export function DashboardNav({ kullanici }: { kullanici: { isim: string; rol: string } }) {
  const pathname = usePathname()

  return (
    <nav className="fixed left-0 top-0 h-screen w-56 bg-white border-r border-gray-100 flex flex-col z-30">
      <div className="p-4 border-b border-gray-100">
        <Link href="/" className="text-xl font-black text-orange-500">ESKOB</Link>
        <div className="text-xs text-gray-500 mt-1">{kullanici.isim}</div>
      </div>

      <div className="flex-1 p-3 flex flex-col gap-1">
        {MENU.map((item) => {
          const aktif = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${aktif ? 'bg-orange-50 text-orange-600 font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <span>{item.ikon}</span>
              {item.etiket}
            </Link>
          )
        })}
      </div>

      <div className="p-3 border-t border-gray-100">
        <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-all">
          🌐 Siteye Git
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50 transition-all w-full text-left"
        >
          🚪 Çıkış Yap
        </button>
      </div>
    </nav>
  )
}
