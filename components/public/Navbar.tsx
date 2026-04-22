'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'

export function Navbar() {
  const { data: session, status } = useSession()
  const [menuAcik, setMenuAcik] = useState(false)
  const [dropdownAcik, setDropdownAcik] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Kullanıcı bilgilerini session'dan al
  const kullanici = session?.user
    ? {
        id: session.user.id ?? '',
        ad: session.user.name?.split(' ')[0] ?? '',
        soyad: session.user.name?.split(' ').slice(1).join(' ') ?? '',
        email: session.user.email ?? '',
        kullaniciAdi: (session.user as any).kullaniciAdi ?? null,
        rol: (session.user as any).rol ?? 'USER',
        avatarUrl: session.user.image ?? null,
      }
    : null

  // Scroll efekti
  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Dropdown dışına tıklama
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownAcik(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Mobil menü açıkken scroll kilitle
  useEffect(() => {
    if (menuAcik) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [menuAcik])

  const basSaltHarfler = kullanici
    ? `${kullanici.ad[0] ?? ''}${kullanici.soyad[0] ?? ''}`.toUpperCase()
    : ''

  const panelLinki =
    kullanici?.rol === 'SUPER_ADMIN' || kullanici?.rol === 'ADMIN'
      ? '/phyberk/admin'
      : kullanici?.rol === 'BUSINESS'
      ? '/panel'
      : null

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'navbar-glass navbar-scrolled' : 'navbar-glass'}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:shadow-orange-500/40 transition-shadow">
              <span className="text-white font-black text-sm">E</span>
            </div>
            <span className="text-xl font-black tracking-tight">
              <span className="gradient-text">ESKOB</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            <Link href="/ara" className="btn-ghost text-sm">
              Keşfet
            </Link>
            <Link href="/hizmetler" className="btn-ghost text-sm">
              Hizmetler
            </Link>
            {!kullanici && (
              <Link href="/esnaf-ol" className="btn-ghost text-sm">
                Esnaf Ol
              </Link>
            )}
          </div>

          {/* Desktop auth */}
          <div className="hidden md:flex items-center gap-3">
            {status === 'loading' ? (
              <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
            ) : kullanici ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownAcik(!dropdownAcik)}
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-full hover:bg-orange-50/80 transition-all duration-200 border border-transparent hover:border-orange-100"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 text-white flex items-center justify-center text-xs font-bold shadow-md shadow-orange-500/20">
                    {basSaltHarfler}
                  </div>
                  <span className="text-sm font-semibold text-gray-700">{kullanici.ad}</span>
                  <svg className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${dropdownAcik ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {dropdownAcik && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white/95 backdrop-blur-xl border border-gray-100 rounded-2xl shadow-xl shadow-black/5 py-1.5 z-50 animate-slide-down">
                    {/* User info header */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900">{kullanici.ad} {kullanici.soyad}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{kullanici.email}</p>
                    </div>

                    {panelLinki && (
                      <>
                        <Link href={panelLinki} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 transition-colors" onClick={() => setDropdownAcik(false)}>
                          <span className="w-5 text-center">📊</span> Panel
                        </Link>
                        <div className="border-t border-gray-100 my-1" />
                      </>
                    )}
                    {kullanici.rol === 'USER' && kullanici.kullaniciAdi && (
                      <>
                        <Link href={`/u/${kullanici.kullaniciAdi}/favoriler`} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 transition-colors" onClick={() => setDropdownAcik(false)}>
                          <span className="w-5 text-center">❤️</span> Favorilerim
                        </Link>
                        <Link href={`/u/${kullanici.kullaniciAdi}/randevular`} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 transition-colors" onClick={() => setDropdownAcik(false)}>
                          <span className="w-5 text-center">📅</span> Randevularım
                        </Link>
                        <Link href={`/u/${kullanici.kullaniciAdi}/yorumlar`} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 transition-colors" onClick={() => setDropdownAcik(false)}>
                          <span className="w-5 text-center">⭐</span> Yorumlarım
                        </Link>
                        <Link href={`/u/${kullanici.kullaniciAdi}/profil`} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 transition-colors" onClick={() => setDropdownAcik(false)}>
                          <span className="w-5 text-center">👤</span> Profilim
                        </Link>
                        <Link href={`/u/${kullanici.kullaniciAdi}/ayarlar`} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 transition-colors" onClick={() => setDropdownAcik(false)}>
                          <span className="w-5 text-center">⚙️</span> Ayarlar
                        </Link>
                        <div className="border-t border-gray-100 my-1" />
                      </>
                    )}
                    <button
                      onClick={() => { signOut({ callbackUrl: '/' }); setDropdownAcik(false) }}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 w-full text-left transition-colors"
                    >
                      <span className="w-5 text-center">🚪</span> Çıkış Yap
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/giris" className="btn-ghost text-sm font-medium">
                  Giriş Yap
                </Link>
                <Link href="/kayit" className="btn-primary text-sm !py-2.5 !px-5">
                  <span>Ücretsiz Başla</span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuAcik(!menuAcik)}
            className="md:hidden p-2 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="Menü"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuAcik
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>

        {/* Mobile menu overlay */}
        {menuAcik && (
          <div className="md:hidden fixed inset-0 top-16 z-40">
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setMenuAcik(false)} />
            <div className="relative bg-white border-t border-gray-100 shadow-xl animate-slide-down">
              <div className="px-4 py-4 flex flex-col gap-1">
                {kullanici && (
                  <div className="flex items-center gap-3 px-3 py-3 mb-2 bg-orange-50 rounded-xl">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 text-white flex items-center justify-center text-sm font-bold">
                      {basSaltHarfler}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{kullanici.ad} {kullanici.soyad}</p>
                      <p className="text-xs text-gray-500">{kullanici.email}</p>
                    </div>
                  </div>
                )}

                <Link href="/ara" className="px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-xl font-medium transition-colors" onClick={() => setMenuAcik(false)}>
                  🔍 Keşfet
                </Link>
                <Link href="/hizmetler" className="px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-xl font-medium transition-colors" onClick={() => setMenuAcik(false)}>
                  📋 Hizmetler
                </Link>

                {kullanici ? (
                  <>
                    {panelLinki && (
                      <Link href={panelLinki} className="px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-xl font-medium transition-colors" onClick={() => setMenuAcik(false)}>
                        📊 Panel
                      </Link>
                    )}
                    {kullanici.rol === 'USER' && kullanici.kullaniciAdi && (
                      <>
                        <div className="border-t border-gray-100 my-1" />
                        <Link href={`/u/${kullanici.kullaniciAdi}/favoriler`} className="px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-xl transition-colors" onClick={() => setMenuAcik(false)}>❤️ Favorilerim</Link>
                        <Link href={`/u/${kullanici.kullaniciAdi}/randevular`} className="px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-xl transition-colors" onClick={() => setMenuAcik(false)}>📅 Randevularım</Link>
                        <Link href={`/u/${kullanici.kullaniciAdi}/ayarlar`} className="px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-xl transition-colors" onClick={() => setMenuAcik(false)}>⚙️ Ayarlar</Link>
                      </>
                    )}
                    <div className="border-t border-gray-100 my-1" />
                    <button onClick={() => signOut({ callbackUrl: '/' })} className="px-3 py-2.5 text-sm text-red-500 hover:bg-red-50 rounded-xl text-left font-medium transition-colors">
                      🚪 Çıkış Yap
                    </button>
                  </>
                ) : (
                  <>
                    <div className="border-t border-gray-100 my-2" />
                    <Link href="/giris" className="px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-xl font-medium transition-colors" onClick={() => setMenuAcik(false)}>Giriş Yap</Link>
                    <Link href="/kayit" className="btn-primary text-sm text-center !rounded-xl mt-1" onClick={() => setMenuAcik(false)}>
                      <span>Ücretsiz Başla</span>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
