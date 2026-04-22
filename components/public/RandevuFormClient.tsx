'use client'

import { useState } from 'react'

interface Props {
  esnafId: number
  hizmetler: Array<{ id: number; ad: string; sure: number | null }>
}

export function RandevuFormClient({ esnafId, hizmetler }: Props) {
  const [form, setForm] = useState({
    hizmetId: '',
    tarih: '',
    musteriAd: '',
    musteriTelefon: '',
    musteriNot: '',
  })
  const [yukleniyor, setYukleniyor] = useState(false)
  const [mesaj, setMesaj] = useState<{ tip: 'ok' | 'hata'; metin: string } | null>(null)

  function set(key: string, value: string) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMesaj(null)
    setYukleniyor(true)
    try {
      const hizmet = hizmetler.find(h => h.id.toString() === form.hizmetId)
      const res = await fetch('/api/randevu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          esnafId,
          hizmetId: form.hizmetId || null,
          tarih: form.tarih,
          sure: hizmet?.sure || 30,
          musteriAd: form.musteriAd,
          musteriTelefon: form.musteriTelefon,
          musteriNot: form.musteriNot,
        }),
      })
      if (res.ok) {
        setMesaj({ tip: 'ok', metin: 'Randevunuz alındı! İşletme sizi onaylayacak.' })
        setForm({ hizmetId: '', tarih: '', musteriAd: '', musteriTelefon: '', musteriNot: '' })
      } else {
        setMesaj({ tip: 'hata', metin: 'Randevu alınamadı. Tekrar deneyin.' })
      }
    } finally {
      setYukleniyor(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      {mesaj && (
        <div className={`px-4 py-3 rounded-xl text-sm ${mesaj.tip === 'ok' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>
          {mesaj.metin}
        </div>
      )}

      {hizmetler.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Hizmet Seçin</label>
          <select value={form.hizmetId} onChange={e => set('hizmetId', e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-400">
            <option value="">Hizmet seçin (isteğe bağlı)</option>
            {hizmetler.map(h => (
              <option key={h.id} value={h.id}>{h.ad}{h.sure ? ` (${h.sure} dk)` : ''}</option>
            ))}
          </select>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Adınız *</label>
          <input value={form.musteriAd} onChange={e => set('musteriAd', e.target.value)} required placeholder="Adınız" className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Telefon *</label>
          <input type="tel" value={form.musteriTelefon} onChange={e => set('musteriTelefon', e.target.value)} required placeholder="05XX XXX XX XX" className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Tarih & Saat *</label>
        <input type="datetime-local" value={form.tarih} onChange={e => set('tarih', e.target.value)} required min={new Date().toISOString().slice(0, 16)} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Not (isteğe bağlı)</label>
        <textarea value={form.musteriNot} onChange={e => set('musteriNot', e.target.value)} rows={2} placeholder="Herhangi bir isteğiniz var mı?" className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none" />
      </div>

      <button
        type="submit"
        disabled={yukleniyor}
        className="w-full bg-orange-500 text-white font-semibold py-3 rounded-xl hover:bg-orange-600 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
      >
        {yukleniyor && (
          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        Randevu Al
      </button>
    </form>
  )
}
