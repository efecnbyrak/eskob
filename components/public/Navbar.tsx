'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { useSession, signOut } from 'next-auth/react'

export function Navbar() {
  const { data: session, status } = useSession()
  const [menuAcik, setMenuAcik] = useState(false)
  const [dropdownAcik, setDropdownAcik] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const kullanici = session?.user
    ? {
        id: session.user.id ?? '',
        ad: session.user.name?.split(' ')[0] ?? '',
        soyad: session.user.name?.split(' ').slice(1).join(' ') ?? '',
        email: session.user.email ?? '',
        kullaniciAdi: (session.user as any).kullaniciAdi ?? null,
        rol: (session.user as any).rol ?? 'USER',
      }
    : null

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownAcik(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

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
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 h-16 ${scrolled ? 'glass-nav shadow-sm' : 'bg-white border-b border-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        
        {/* Logo Bölümü */}
        <div className="flex items-center gap-12">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform">
              <span className="text-white font-black text-sm">E</span>
            </div>
            <span className="text-xl font-black tracking-tight text-gray-900">ESKOB</span>
          </Link>

          {/* Desktop Orta Linkler */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/ara" className="text-sm font-medium text-gray-600 hover:text-orange-500 transition-colors">Keşfet</Link>
            <Link href="/hizmetler" className="text-sm font-medium text-gray-600 hover:text-orange-500 transition-colors">Hizmetler</Link>
            {!kullanici && (
              <Link href="/esnaf-ol" className="text-sm font-medium text-gray-600 hover:text-orange-500 transition-colors">Esnaf Ol</Link>
            )}
          </div>
        </div>

        {/* Sağ Taraf - Auth */}
        <div className="flex items-center gap-4">
          {status === 'loading' ? (
            <div className="w-8 h-8 rounded-full bg-gray-100 animate-pulse" />
          ) : kullanici ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownAcik(!dropdownAcik)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-gray-50 transition-colors border border-gray-100"
              >
                <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center text-[10px] font-bold">
                  {basSaltHarfler}
                </div>
                <span className="text-sm font-semibold text-gray-700 hidden sm:block">{kullanici.ad}</span>
                <svg className={`w-3.5 h-3.5 text-gray-400 transition-transform ${dropdownAcik ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {dropdownAcik && (
                <div className="absolute right-0 top-full mt-2 w-56 max-w-[calc(100vw-1rem)] bg-white border border-gray-100 rounded-2xl shadow-xl py-2 z-[110] animate-slide-down">
                  {panelLinki && (
                    <Link href={panelLinki} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50" onClick={() => setDropdownAcik(false)}>
                      <span>📊</span> Panelim
                    </Link>
                  )}
                  {kullanici.rol === 'USER' && kullanici.kullaniciAdi && (
                    <>
                      <Link href={`/u/${kullanici.kullaniciAdi}/favoriler`} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50" onClick={() => setDropdownAcik(false)}>❤️ Favorilerim</Link>
                      <Link href={`/u/${kullanici.kullaniciAdi}/randevular`} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50" onClick={() => setDropdownAcik(false)}>📅 Randevularım</Link>
                      <Link href={`/u/${kullanici.kullaniciAdi}/profil`} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50" onClick={() => setDropdownAcik(false)}>👤 Profilim</Link>
                    </>
                  )}
                  <div className="border-t border-gray-50 my-1" />
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 w-full text-left"
                  >
                    <span>🚪</span> Çıkış Yap
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/giris" className="text-sm font-semibold text-gray-700 hover:text-orange-500 px-4 py-2">Giriş Yap</Link>
              <Link href="/kayit" className="btn-primary !py-2 !px-5 text-sm">Ücretsüz Başla</Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button onClick={() => setMenuAcik(!menuAcik)} aria-label="Menüyü aç/kapat" className="md:hidden p-2 text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuAcik ? <path d="M6 18L18 6M6 6l12 12" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuAcik && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-100 shadow-xl overflow-y-auto max-h-[80vh] flex flex-col p-4 gap-1">
          <Link href="/ara" className="flex items-center gap-3 p-3 text-sm font-medium hover:bg-gray-50 rounded-xl" onClick={() => setMenuAcik(false)}>🔍 Keşfet</Link>
          <Link href="/hizmetler" className="flex items-center gap-3 p-3 text-sm font-medium hover:bg-gray-50 rounded-xl" onClick={() => setMenuAcik(false)}>✨ Hizmetler</Link>
          {!kullanici && (
            <Link href="/esnaf-ol" className="flex items-center gap-3 p-3 text-sm font-medium hover:bg-gray-50 rounded-xl" onClick={() => setMenuAcik(false)}>🏪 Esnaf Ol</Link>
          )}
          {kullanici ? (
            <>
              {panelLinki && (
                <Link href={panelLinki} className="flex items-center gap-3 p-3 text-sm font-medium hover:bg-orange-50 rounded-xl text-orange-600" onClick={() => setMenuAcik(false)}>📊 Panelim</Link>
              )}
              {kullanici.rol === 'USER' && kullanici.kullaniciAdi && (
                <>
                  <Link href={`/u/${kullanici.kullaniciAdi}/favoriler`} className="flex items-center gap-3 p-3 text-sm font-medium hover:bg-gray-50 rounded-xl" onClick={() => setMenuAcik(false)}>❤️ Favorilerim</Link>
                  <Link href={`/u/${kullanici.kullaniciAdi}/randevular`} className="flex items-center gap-3 p-3 text-sm font-medium hover:bg-gray-50 rounded-xl" onClick={() => setMenuAcik(false)}>📅 Randevularım</Link>
                </>
              )}
              <div className="border-t border-gray-100 my-2" />
              <button onClick={() => signOut({ callbackUrl: '/' })} className="flex items-center gap-3 p-3 text-sm font-medium text-red-500 hover:bg-red-50 rounded-xl text-left w-full">🚪 Çıkış Yap</button>
            </>
          ) : (
            <div className="flex flex-col gap-2 mt-2 pt-2 border-t border-gray-100">
              <Link href="/giris" className="p-3 text-sm font-semibold text-center border border-gray-200 rounded-xl hover:bg-gray-50" onClick={() => setMenuAcik(false)}>Giriş Yap</Link>
              <Link href="/kayit" className="btn-primary text-center text-sm" onClick={() => setMenuAcik(false)}>Ücretsiz Başla</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}
