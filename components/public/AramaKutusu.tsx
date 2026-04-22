'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

interface AramaSonuc {
  id: number
  isletmeAdi: string
  sehir: string
  ilce: string
  kategori: string
  ikon: string
  slug: string
}

export function AramaKutusu() {
  const [acik, setAcik] = useState(false)
  const [sorgu, setSorgu] = useState('')
  const [sonuclar, setSonuclar] = useState<AramaSonuc[]>([])
  const [yukleniyor, setYukleniyor] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    if (acik) inputRef.current?.focus()
  }, [acik])

  useEffect(() => {
    if (!sorgu || sorgu.length < 2) { setSonuclar([]); return }
    const timeout = setTimeout(async () => {
      setYukleniyor(true)
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(sorgu)}`)
        const data = await res.json()
        setSonuclar(data.results ?? [])
      } finally {
        setYukleniyor(false)
      }
    }, 300)
    return () => clearTimeout(timeout)
  }, [sorgu])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setAcik(false)
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [])

  if (!acik) {
    return (
      <button
        onClick={() => setAcik(true)}
        className="flex items-center gap-3 bg-white border-2 border-gray-200 hover:border-orange-400 rounded-2xl px-6 py-4 mx-auto w-full max-w-xl text-left text-gray-500 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02]"
      >
        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1116.65 16.65z" />
        </svg>
        <span>Berber, restoran, spor salonu...</span>
      </button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-20" onClick={() => setAcik(false)}>
      <div className="bg-white w-full max-w-2xl mx-4 rounded-2xl shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
          <svg className="w-5 h-5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1116.65 16.65z" />
          </svg>
          <input
            ref={inputRef}
            value={sorgu}
            onChange={(e) => setSorgu(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && sorgu.trim()) {
                router.push(`/ara?q=${encodeURIComponent(sorgu.trim())}`)
                setAcik(false)
              }
            }}
            placeholder="İşletme, kategori veya şehir ara..."
            className="flex-1 text-gray-900 outline-none bg-transparent"
          />
          <button onClick={() => setAcik(false)} className="text-xs text-gray-400 hover:text-gray-600 border border-gray-200 rounded px-2 py-1">ESC</button>
        </div>

        {yukleniyor && (
          <div className="p-8 text-center text-gray-400 text-sm">Aranıyor...</div>
        )}

        {!yukleniyor && sonuclar.length > 0 && (
          <ul className="py-2 max-h-80 overflow-y-auto">
            {sonuclar.map((s) => (
              <li key={s.id}>
                <button
                  onClick={() => { router.push(`/${s.slug}`); setAcik(false) }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-orange-50 text-left transition-colors"
                >
                  <span className="text-2xl">{s.ikon}</span>
                  <div>
                    <div className="font-medium text-gray-900">{s.isletmeAdi}</div>
                    <div className="text-xs text-gray-500">{s.kategori} · {s.sehir} / {s.ilce}</div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}

        {!yukleniyor && sorgu.length >= 2 && sonuclar.length === 0 && (
          <div className="p-8 text-center text-gray-400 text-sm">Sonuç bulunamadı.</div>
        )}

        {sorgu.length < 2 && (
          <div className="p-8 text-center text-gray-400 text-sm">Aramak için yazmaya başlayın...</div>
        )}
      </div>
    </div>
  )
}
