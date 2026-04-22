'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ISTANBUL_ILCELERI, ILGI_ALANLARI } from '@/lib/constants'

export default function KayitPage() {
  const router = useRouter()
  const [yukleniyor, setYukleniyor] = useState(false)
  const [hata, setHata] = useState('')
  const [tur, setTur] = useState<'user' | 'business'>('user')
  const [kategoriler, setKategoriler] = useState<Array<{ id: number; ad: string; ikon: string; tur: { ad: string } | null }>>([])

  const [form, setForm] = useState({
    ad: '', soyad: '', email: '', telefon: '', sifre: '',
    kullaniciAdi: '', dogumTarihi: '', ilce: '',
    // esnaf
    isletmeAdi: '', kategoriId: '', esnafSehir: 'İstanbul', esnafIlce: '',
    ilgiAlanlari: [] as string[],
  })

  useEffect(() => {
    if (tur === 'business') {
      fetch('/api/kategoriler').then(r => r.json()).then(setKategoriler).catch(() => {})
    }
  }, [tur])

  const maxDogumTarihi = (() => {
    const d = new Date()
    d.setFullYear(d.getFullYear() - 12)
    return d.toISOString().split('T')[0]
  })()

  function set(key: string, value: string) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setHata('')
    setYukleniyor(true)
    try {
      const res = await fetch('/api/auth/kayit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, tur }),
      })
      const data = await res.json()
      if (!res.ok) {
        setHata(data.error || 'Kayıt başarısız.')
        return
      }
      router.push('/giris?kayit=1')
    } finally {
      setYukleniyor(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-black text-orange-500">ESKOB</Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-4">Hesap Oluşturun</h1>
          <p className="text-gray-500 mt-1">Ücretsiz, hızlı, kolay</p>
        </div>

        {/* Tür seçimi */}
        <div className="flex gap-2 bg-gray-100 p-1 rounded-xl mb-6">
          {(['user', 'business'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTur(t)}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${tur === t ? 'bg-white text-orange-500 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
            >
              {t === 'user' ? '👤 Bireysel' : '🏪 İşletme'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {hata && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">{hata}</div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ad *</label>
              <input value={form.ad} onChange={e => set('ad', e.target.value)} required placeholder="Ahmet" className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Soyad *</label>
              <input value={form.soyad} onChange={e => set('soyad', e.target.value)} required placeholder="Yılmaz" className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">E-posta * <span className="text-gray-400 text-xs">(Gmail veya Hotmail)</span></label>
            <input type="email" value={form.email} onChange={e => set('email', e.target.value)} required placeholder="ornek@gmail.com" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Telefon * <span className="text-gray-400 text-xs">(+90 5XX...)</span></label>
            <input type="tel" value={form.telefon} onChange={e => set('telefon', e.target.value)} required placeholder="+90 532 123 45 67" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kullanıcı Adı *</label>
            <input value={form.kullaniciAdi} onChange={e => set('kullaniciAdi', e.target.value)} required placeholder="ahmetyilmaz" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Şifre * <span className="text-gray-400 text-xs">(min 6 harf, 1 büyük, 1 sembol)</span></label>
            <input type="password" value={form.sifre} onChange={e => set('sifre', e.target.value)} required placeholder="••••••••" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Doğum Tarihi</label>
              <input type="date" value={form.dogumTarihi} onChange={e => set('dogumTarihi', e.target.value)} max={maxDogumTarihi} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">İlçe (İstanbul)</label>
              <select value={form.ilce} onChange={e => set('ilce', e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white">
                <option value="">Seçiniz</option>
                {ISTANBUL_ILCELERI.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
          </div>

          {tur === 'business' && (
            <>
              <div className="border-t border-gray-100 pt-4 mt-2">
                <h3 className="font-semibold text-gray-800 mb-3">İşletme Bilgileri</h3>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">İşletme Adı *</label>
                <input value={form.isletmeAdi} onChange={e => set('isletmeAdi', e.target.value)} required={tur === 'business'} placeholder="İşletme Adınız" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kategori *</label>
                <select value={form.kategoriId} onChange={e => set('kategoriId', e.target.value)} required={tur === 'business'} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white">
                  <option value="">Kategori Seçin</option>
                  {kategoriler.map(k => (
                    <option key={k.id} value={k.id}>{k.ikon} {k.ad}{k.tur ? ` (${k.tur.ad})` : ''}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Şehir *</label>
                  <input value={form.esnafSehir} onChange={e => set('esnafSehir', e.target.value)} required={tur === 'business'} placeholder="İstanbul" className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">İlçe *</label>
                  <input value={form.esnafIlce} onChange={e => set('esnafIlce', e.target.value)} required={tur === 'business'} placeholder="Kadıköy" className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
                </div>
              </div>
            </>
          )}

          {tur === 'user' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">İlgi Alanları</label>
              <div className="flex flex-wrap gap-2">
                {ILGI_ALANLARI.map(alan => (
                  <button
                    key={alan}
                    type="button"
                    onClick={() => setForm(prev => ({
                      ...prev,
                      ilgiAlanlari: prev.ilgiAlanlari.includes(alan)
                        ? prev.ilgiAlanlari.filter(a => a !== alan)
                        : [...prev.ilgiAlanlari, alan],
                    }))}
                    className={`px-3 py-1.5 text-xs rounded-full border transition-all ${form.ilgiAlanlari.includes(alan) ? 'bg-orange-500 text-white border-orange-500' : 'border-gray-200 text-gray-600 hover:border-orange-300'}`}
                  >
                    {alan}
                  </button>
                ))}
              </div>
            </div>
          )}

          <p className="text-xs text-gray-500 mt-2">
            Kaydolarak{' '}
            <a href="/hizmet-sozlesmesi" target="_blank" className="text-orange-500 hover:underline">Hizmet Sözleşmesi</a>
            {' '}ve{' '}
            <a href="/kvkk" target="_blank" className="text-orange-500 hover:underline">KVKK Aydınlatma Metni</a>
            {' '}ni kabul etmiş olursunuz.
          </p>

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
            Hesap Oluştur
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Zaten hesabınız var mı?{' '}
          <Link href="/giris" className="text-orange-500 font-semibold hover:text-orange-600">Giriş Yapın</Link>
        </p>
      </div>
    </div>
  )
}
