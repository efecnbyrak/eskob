'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'

interface NavbarProps {
  kullanici?: {
    id: string
    ad: string
    soyad: string
    email: string
    kullaniciAdi?: string | null
    rol: string
    avatarUrl?: string | null
  } | null
}

export function Navbar({ kullanici }: NavbarProps) {
  const [menuAcik, setMenuAcik] = useState(false)
  const [dropdownAcik, setDropdownAcik] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownAcik(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const basSaltHarfler = kullanici
    ? `${kullanici.ad[0]}${kullanici.soyad[0]}`.toUpperCase()
    : ''

  const panelLinki =
    kullanici?.rol === 'SUPER_ADMIN' || kullanici?.rol === 'ADMIN'
      ? '/phyberk/admin'
      : kullanici?.rol === 'BUSINESS'
      ? '/panel'
      : null

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-black text-orange-500 tracking-tight">ESKOB</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/ara" className="text-sm text-gray-600 hover:text-orange-500 transition-colors">
              Keşfet
            </Link>
            {!kullanici && (
              <Link href="/esnaf-ol" className="text-sm text-gray-600 hover:text-orange-500 transition-colors">
                Esnaf Ol
              </Link>
            )}
          </div>

          {/* Desktop auth */}
          <div className="hidden md:flex items-center gap-3">
            {kullanici ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownAcik(!dropdownAcik)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-orange-50 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-semibold">
                    {basSaltHarfler}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{kullanici.ad}</span>
                  <svg className={`w-4 h-4 text-gray-500 transition-transform ${dropdownAcik ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {dropdownAcik && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-gray-100 rounded-2xl shadow-lg py-2 z-50">
                    {panelLinki && (
                      <>
                        <Link href={panelLinki} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setDropdownAcik(false)}>
                          <span>📊</span> Panel
                        </Link>
                        <div className="border-t border-gray-100 my-1" />
                      </>
                    )}
                    {kullanici.rol === 'USER' && kullanici.kullaniciAdi && (
                      <>
                        <Link href={`/u/${kullanici.kullaniciAdi}/favoriler`} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setDropdownAcik(false)}>
                          <span>❤️</span> Favorilerim
                        </Link>
                        <Link href={`/u/${kullanici.kullaniciAdi}/randevular`} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setDropdownAcik(false)}>
                          <span>📅</span> Randevularım
                        </Link>
                        <Link href={`/u/${kullanici.kullaniciAdi}/yorumlar`} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setDropdownAcik(false)}>
                          <span>⭐</span> Yorumlarım
                        </Link>
                        <Link href={`/u/${kullanici.kullaniciAdi}/profil`} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setDropdownAcik(false)}>
                          <span>👤</span> Profilim
                        </Link>
                        <Link href={`/u/${kullanici.kullaniciAdi}/ayarlar`} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setDropdownAcik(false)}>
                          <span>⚙️</span> Ayarlar
                        </Link>
                        <div className="border-t border-gray-100 my-1" />
                      </>
                    )}
                    <button
                      onClick={() => { signOut({ callbackUrl: '/' }); setDropdownAcik(false) }}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 w-full text-left"
                    >
                      <span>🚪</span> Çıkış Yap
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/giris" className="text-sm font-medium text-gray-700 hover:text-orange-500 px-4 py-2 transition-colors">
                  Giriş Yap
                </Link>
                <Link href="/kayit" className="text-sm font-semibold bg-orange-500 text-white px-4 py-2 rounded-xl hover:bg-orange-600 transition-colors">
                  Ücretsiz Başla
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuAcik(!menuAcik)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuAcik
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {menuAcik && (
          <div className="md:hidden py-4 border-t border-gray-100 flex flex-col gap-2">
            <Link href="/ara" className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg" onClick={() => setMenuAcik(false)}>
              Keşfet
            </Link>
            {kullanici ? (
              <>
                {panelLinki && (
                  <Link href={panelLinki} className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg" onClick={() => setMenuAcik(false)}>
                    📊 Panel
                  </Link>
                )}
                {kullanici.rol === 'USER' && kullanici.kullaniciAdi && (
                  <>
                    <Link href={`/u/${kullanici.kullaniciAdi}/favoriler`} className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg" onClick={() => setMenuAcik(false)}>❤️ Favorilerim</Link>
                    <Link href={`/u/${kullanici.kullaniciAdi}/randevular`} className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg" onClick={() => setMenuAcik(false)}>📅 Randevularım</Link>
                    <Link href={`/u/${kullanici.kullaniciAdi}/ayarlar`} className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg" onClick={() => setMenuAcik(false)}>⚙️ Ayarlar</Link>
                  </>
                )}
                <button onClick={() => signOut({ callbackUrl: '/' })} className="px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg text-left">
                  🚪 Çıkış Yap
                </button>
              </>
            ) : (
              <>
                <Link href="/giris" className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg" onClick={() => setMenuAcik(false)}>Giriş Yap</Link>
                <Link href="/kayit" className="px-3 py-2 text-sm font-semibold bg-orange-500 text-white rounded-xl text-center" onClick={() => setMenuAcik(false)}>Ücretsiz Başla</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
