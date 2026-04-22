'use client'

import { useState, useEffect } from 'react'

interface Randevu {
  id: number
  tarih: string
  sure: number
  durum: string
  musteriAd: string
  musteriTelefon: string
  musteriNot: string | null
  hizmet: { ad: string } | null
}

const DURUM_RENK: Record<string, string> = {
  BEKLIYOR: 'bg-yellow-100 text-yellow-700',
  ONAYLANDI: 'bg-green-100 text-green-700',
  TAMAMLANDI: 'bg-blue-100 text-blue-700',
  IPTAL: 'bg-red-100 text-red-700',
}

export default function RandevularPage() {
  const [randevular, setRandevular] = useState<Randevu[]>([])
  const [yukleniyor, setYukleniyor] = useState(true)

  useEffect(() => {
    fetch('/api/randevu').then(r => r.json()).then(data => {
      setRandevular(data.randevular || [])
      setYukleniyor(false)
    })
  }, [])

  async function durumGuncelle(id: number, durum: string) {
    await fetch('/api/randevu', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, durum }),
    })
    setRandevular(prev => prev.map(r => r.id === id ? { ...r, durum } : r))
  }

  if (yukleniyor) return <div className="p-8 text-center text-gray-400">Yükleniyor...</div>

  return (
    <div>
      <h1 className="text-2xl font-black text-gray-900 mb-6">Randevular</h1>

      {randevular.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-4xl mb-3">📅</p>
          <p>Henüz randevu yok.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {randevular.map((r) => (
            <div key={r.id} className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-semibold text-gray-900">{r.musteriAd}</div>
                  <div className="text-sm text-gray-500 mt-0.5">
                    {r.hizmet?.ad && <span>{r.hizmet.ad} · </span>}
                    {new Date(r.tarih).toLocaleString('tr-TR')}
                    {' '}({r.sure} dk)
                  </div>
                  <div className="text-sm text-gray-500">📞 {r.musteriTelefon}</div>
                  {r.musteriNot && <div className="text-sm text-gray-600 mt-1 italic">"{r.musteriNot}"</div>}
                </div>
                <div className="flex flex-col gap-2 items-end">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${DURUM_RENK[r.durum]}`}>
                    {r.durum}
                  </span>
                  {r.durum === 'BEKLIYOR' && (
                    <div className="flex gap-2">
                      <button onClick={() => durumGuncelle(r.id, 'ONAYLANDI')} className="text-xs bg-green-500 text-white px-3 py-1.5 rounded-lg hover:bg-green-600">Onayla</button>
                      <button onClick={() => durumGuncelle(r.id, 'IPTAL')} className="text-xs bg-red-500 text-white px-3 py-1.5 rounded-lg hover:bg-red-600">İptal</button>
                    </div>
                  )}
                  {r.durum === 'ONAYLANDI' && (
                    <button onClick={() => durumGuncelle(r.id, 'TAMAMLANDI')} className="text-xs bg-blue-500 text-white px-3 py-1.5 rounded-lg hover:bg-blue-600">Tamamlandı</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
