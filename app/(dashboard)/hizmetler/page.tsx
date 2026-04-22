'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { formatFiyat, formatSure } from '@/lib/utils'

interface Hizmet {
  id: number
  ad: string
  aciklama: string | null
  fiyat: string
  sure: number | null
  aktif: boolean
}

export default function HizmetlerPage() {
  const [hizmetler, setHizmetler] = useState<Hizmet[]>([])
  const [formAcik, setFormAcik] = useState(false)
  const [yukleniyor, setYukleniyor] = useState(false)
  const [form, setForm] = useState({ ad: '', aciklama: '', fiyat: '', sure: '' })

  useEffect(() => { yukle() }, [])

  async function yukle() {
    const res = await fetch('/api/hizmet')
    const data = await res.json()
    setHizmetler(data.hizmetler || [])
  }

  function set(k: string, v: string) { setForm(prev => ({ ...prev, [k]: v })) }

  async function ekle(e: React.FormEvent) {
    e.preventDefault()
    setYukleniyor(true)
    try {
      await fetch('/api/hizmet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, fiyat: parseFloat(form.fiyat), sure: form.sure ? parseInt(form.sure) : null }),
      })
      setForm({ ad: '', aciklama: '', fiyat: '', sure: '' })
      setFormAcik(false)
      yukle()
    } finally {
      setYukleniyor(false)
    }
  }

  async function sil(id: number) {
    if (!confirm('Bu hizmeti silmek istiyor musunuz?')) return
    await fetch(`/api/hizmet?id=${id}`, { method: 'DELETE' })
    yukle()
  }

  async function toggle(hizmet: Hizmet) {
    await fetch('/api/hizmet', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: hizmet.id, aktif: !hizmet.aktif }),
    })
    yukle()
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black text-gray-900">Hizmetler</h1>
        <Button onClick={() => setFormAcik(!formAcik)} size="sm">
          {formAcik ? 'İptal' : '+ Hizmet Ekle'}
        </Button>
      </div>

      {formAcik && (
        <form onSubmit={ekle} className="bg-white rounded-2xl border border-gray-100 p-5 mb-6 flex flex-col gap-3">
          <Input label="Hizmet Adı *" value={form.ad} onChange={e => set('ad', e.target.value)} required />
          <Input label="Açıklama" value={form.aciklama} onChange={e => set('aciklama', e.target.value)} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Fiyat (₺) *" type="number" step="0.01" value={form.fiyat} onChange={e => set('fiyat', e.target.value)} required />
            <Input label="Süre (dakika)" type="number" value={form.sure} onChange={e => set('sure', e.target.value)} />
          </div>
          <Button type="submit" loading={yukleniyor}>Kaydet</Button>
        </form>
      )}

      <div className="flex flex-col gap-3">
        {hizmetler.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-4xl mb-3">✂️</p>
            <p>Henüz hizmet eklenmedi.</p>
          </div>
        ) : (
          hizmetler.map((h) => (
            <div key={h.id} className={`bg-white rounded-2xl border p-4 flex items-center justify-between ${h.aktif ? 'border-gray-100' : 'border-gray-100 opacity-60'}`}>
              <div>
                <div className="font-medium text-gray-900">{h.ad}</div>
                {h.aciklama && <div className="text-sm text-gray-500">{h.aciklama}</div>}
                <div className="flex gap-3 mt-1">
                  <span className="text-sm font-semibold text-orange-500">{formatFiyat(h.fiyat)}</span>
                  {h.sure && <span className="text-sm text-gray-400">⏱ {formatSure(h.sure)}</span>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => toggle(h)} className={`px-2 py-1 text-xs rounded-full ${h.aktif ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {h.aktif ? 'Aktif' : 'Pasif'}
                </button>
                <button onClick={() => sil(h.id)} className="text-red-400 hover:text-red-600 text-sm px-2">✕</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
