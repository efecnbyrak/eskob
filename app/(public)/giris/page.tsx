'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function GirisPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [sifre, setSifre] = useState('')
  const [beniHatirla, setBeniHatirla] = useState(false)
  const [hata, setHata] = useState('')
  const [yukleniyor, setYukleniyor] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setHata('')
    setYukleniyor(true)
    try {
      const sonuc = await signIn('credentials', {
        email,
        sifre,
        redirect: false,
      })
      if (sonuc?.error) {
        setHata('E-posta veya şifre hatalı.')
      } else {
        router.push('/')
        router.refresh()
      }
    } finally {
      setYukleniyor(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-black text-orange-500">ESKOB</Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-4">Hoş Geldiniz</h1>
          <p className="text-gray-500 mt-1">Hesabınıza giriş yapın</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {hata && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
              {hata}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">E-posta</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="ornek@gmail.com"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Şifre</label>
            <input
              type="password"
              value={sifre}
              onChange={(e) => setSifre(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm"
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                checked={beniHatirla}
                onChange={(e) => setBeniHatirla(e.target.checked)}
                className="rounded accent-orange-500"
              />
              Beni hatırla (30 gün)
            </label>
          </div>

          <button
            type="submit"
            disabled={yukleniyor}
            className="w-full bg-orange-500 text-white font-semibold py-3 rounded-xl hover:bg-orange-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {yukleniyor && (
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            )}
            Giriş Yap
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Hesabınız yok mu?{' '}
          <Link href="/kayit" className="text-orange-500 font-semibold hover:text-orange-600">
            Ücretsiz Kaydolun
          </Link>
        </p>
      </div>
    </div>
  )
}
