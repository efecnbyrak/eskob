'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { useState } from 'react'

const MENU = [
  { href: '/panel', ikon: '📊', etiket: 'Panel' },
  { href: '/vitrin', ikon: '🏪', etiket: 'Vitrin' },
  { href: '/hizmetler', ikon: '✂️', etiket: 'Hizmetler' },
  { href: '/randevular', ikon: '📅', etiket: 'Randevular' },
]

function NavLinks({ pathname, onClose }: { pathname: string; onClose?: () => void }) {
  return (
    <>
      {MENU.map((item) => {
        const aktif = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${aktif ? 'bg-orange-50 text-orange-600 font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <span>{item.ikon}</span>
            {item.etiket}
          </Link>
        )
      })}
    </>
  )
}

export function DashboardNav({ kullanici }: { kullanici: { isim: string; rol: string } }) {
  const pathname = usePathname()
  const [menuAcik, setMenuAcik] = useState(false)

  return (
    <>
      {/* Desktop Sidebar */}
      <nav className="hidden md:flex fixed left-0 top-0 h-screen w-56 bg-white border-r border-gray-100 flex-col z-30">
        <div className="p-4 border-b border-gray-100">
          <Link href="/" className="text-xl font-black text-orange-500">ESKOB</Link>
          <div className="text-xs text-gray-500 mt-1 truncate">{kullanici.isim}</div>
        </div>

        <div className="flex-1 p-3 flex flex-col gap-1 overflow-y-auto">
          <NavLinks pathname={pathname} />
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

      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-white border-b border-gray-100 flex items-center justify-between px-4 z-30">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMenuAcik(true)}
            className="p-2 rounded-lg hover:bg-gray-50 text-gray-600"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <Link href="/" className="text-lg font-black text-orange-500">ESKOB</Link>
        </div>
        <span className="text-sm text-gray-500 truncate max-w-[120px]">{kullanici.isim}</span>
      </div>

      {/* Mobile Sidebar Overlay */}
      {menuAcik && (
        <div className="md:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMenuAcik(false)} />
          <nav className="absolute left-0 top-0 h-screen w-64 bg-white flex flex-col shadow-2xl">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <Link href="/" className="text-xl font-black text-orange-500" onClick={() => setMenuAcik(false)}>ESKOB</Link>
                <div className="text-xs text-gray-500 mt-1">{kullanici.isim}</div>
              </div>
              <button onClick={() => setMenuAcik(false)} className="p-2 rounded-lg hover:bg-gray-50 text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 p-3 flex flex-col gap-1 overflow-y-auto">
              <NavLinks pathname={pathname} onClose={() => setMenuAcik(false)} />
            </div>

            <div className="p-3 border-t border-gray-100">
              <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-all" onClick={() => setMenuAcik(false)}>
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
        </div>
      )}
    </>
  )
}
