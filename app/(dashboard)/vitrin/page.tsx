'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

interface EsnafData {
  id: number
  isletmeAdi: string
  aciklama: string | null
  telefon: string | null
  whatsapp: string | null
  website: string | null
  instagram: string | null
  sehir: string
  ilce: string
  adres: string | null
}

export default function VitrinPage() {
  const [esnaf, setEsnaf] = useState<EsnafData | null>(null)
  const [yukleniyor, setYukleniyor] = useState(true)
  const [kaydediyor, setKaydediyor] = useState(false)
  const [mesaj, setMesaj] = useState('')

  useEffect(() => {
    fetch('/api/vitrin').then(r => r.json()).then(data => {
      setEsnaf(data.esnaf)
      setYukleniyor(false)
    })
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!esnaf) return
    setKaydediyor(true)
    try {
      const res = await fetch('/api/vitrin', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(esnaf),
      })
      if (res.ok) setMesaj('Vitrin güncellendi!')
      else setMesaj('Hata oluştu.')
    } finally {
      setKaydediyor(false)
      setTimeout(() => setMesaj(''), 3000)
    }
  }

  if (yukleniyor) return <div className="p-8 text-center text-gray-400">Yükleniyor...</div>
  if (!esnaf) return <div className="p-8 text-center text-gray-400">İşletme bulunamadı.</div>

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-black text-gray-900 mb-6">Vitrin Yönetimi</h1>

      {mesaj && (
        <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-xl mb-4">
          {mesaj}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col gap-4">
        <Input
          label="İşletme Adı"
          value={esnaf.isletmeAdi}
          onChange={e => setEsnaf(prev => prev && { ...prev, isletmeAdi: e.target.value })}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
          <textarea
            value={esnaf.aciklama || ''}
            onChange={e => setEsnaf(prev => prev && { ...prev, aciklama: e.target.value })}
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
            placeholder="İşletmenizi tanıtın..."
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input label="Telefon" value={esnaf.telefon || ''} onChange={e => setEsnaf(prev => prev && { ...prev, telefon: e.target.value })} />
          <Input label="WhatsApp" value={esnaf.whatsapp || ''} onChange={e => setEsnaf(prev => prev && { ...prev, whatsapp: e.target.value })} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input label="Website" value={esnaf.website || ''} onChange={e => setEsnaf(prev => prev && { ...prev, website: e.target.value })} />
          <Input label="Instagram" value={esnaf.instagram || ''} onChange={e => setEsnaf(prev => prev && { ...prev, instagram: e.target.value })} placeholder="@kullanici" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input label="Şehir" value={esnaf.sehir} onChange={e => setEsnaf(prev => prev && { ...prev, sehir: e.target.value })} />
          <Input label="İlçe" value={esnaf.ilce} onChange={e => setEsnaf(prev => prev && { ...prev, ilce: e.target.value })} />
        </div>

        <Input label="Adres" value={esnaf.adres || ''} onChange={e => setEsnaf(prev => prev && { ...prev, adres: e.target.value })} />

        <Button type="submit" loading={kaydediyor}>Kaydet</Button>
      </form>
    </div>
  )
}
