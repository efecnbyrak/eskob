import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { FavoriButonu } from '@/components/public/FavoriButonu'
import { formatFiyat, formatSure } from '@/lib/utils'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const esnaf = await prisma.esnaf.findUnique({ where: { slug }, include: { kategori: true } })
  if (!esnaf) return { title: 'Bulunamadı' }
  return {
    title: `${esnaf.isletmeAdi} - ${esnaf.sehir}`,
    description: esnaf.aciklama || `${esnaf.isletmeAdi} | ${esnaf.kategori.ad}`,
  }
}

export default async function EsnafProfilPage({ params }: Props) {
  const { slug } = await params

  const esnaf = await prisma.esnaf.findUnique({
    where: { slug },
    include: {
      kategori: { include: { tur: true } },
      hizmetler: { where: { aktif: true }, orderBy: { sira: 'asc' } },
      yorumlar: { where: { onaylı: true }, orderBy: { olusturmaT: 'desc' }, take: 10 },
    },
  })

  if (!esnaf || !esnaf.aktif || !esnaf.onaylı) notFound()

  const ortalamaPuan =
    esnaf.yorumlar.length > 0
      ? esnaf.yorumlar.reduce((acc, y) => acc + y.puan, 0) / esnaf.yorumlar.length
      : null

  // Görüntülenme istatistiği
  await prisma.istatistik.create({
    data: { esnafId: esnaf.id, goruntulenme: 1 },
  }).catch(() => {})

  return (
    <div className="max-w-4xl mx-auto px-4 pt-20 pb-8">
      {/* Kapak */}
      <div className="h-48 md:h-64 bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl flex items-center justify-center mb-6 relative overflow-hidden">
        <span className="text-7xl">{esnaf.kategori.ikon}</span>
        <div className="absolute top-4 right-4">
          <FavoriButonu esnafId={esnaf.id} />
        </div>
      </div>

      {/* Başlık */}
      <div className="flex flex-col md:flex-row md:items-start gap-4 mb-8">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full font-medium">
              {esnaf.kategori.ikon} {esnaf.kategori.ad}
            </span>
            {esnaf.kategori.tur && (
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                {esnaf.kategori.tur.ikon} {esnaf.kategori.tur.ad}
              </span>
            )}
          </div>
          <h1 className="text-3xl font-black text-gray-900">{esnaf.isletmeAdi}</h1>
          <p className="text-gray-500 mt-1">📍 {esnaf.sehir} / {esnaf.ilce}</p>
          {ortalamaPuan !== null && (
            <div className="flex items-center gap-1 mt-2">
              <span className="text-yellow-400">★</span>
              <span className="font-semibold text-gray-900">{ortalamaPuan.toFixed(1)}</span>
              <span className="text-gray-500 text-sm">({esnaf.yorumlar.length} yorum)</span>
            </div>
          )}
          {esnaf.aciklama && <p className="text-gray-700 mt-3">{esnaf.aciklama}</p>}
        </div>

        {/* İletişim */}
        <div className="flex flex-col gap-2 md:w-48">
          {esnaf.telefon && (
            <a href={`tel:${esnaf.telefon}`} className="flex items-center gap-2 px-4 py-2.5 bg-orange-500 text-white rounded-xl text-sm font-semibold hover:bg-orange-600 transition-colors">
              📞 Ara
            </a>
          )}
          {esnaf.whatsapp && (
            <a href={`https://wa.me/${esnaf.whatsapp}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2.5 bg-green-500 text-white rounded-xl text-sm font-semibold hover:bg-green-600 transition-colors">
              💬 WhatsApp
            </a>
          )}
          {esnaf.website && (
            <a href={esnaf.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm hover:bg-gray-50 transition-colors">
              🌐 Website
            </a>
          )}
        </div>
      </div>

      {/* Hizmetler */}
      {esnaf.hizmetler.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Hizmetler</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {esnaf.hizmetler.map((hizmet) => (
              <div key={hizmet.id} className="flex items-center justify-between bg-white border border-gray-100 rounded-xl px-4 py-3">
                <div>
                  <div className="font-medium text-gray-900">{hizmet.ad}</div>
                  {hizmet.aciklama && <div className="text-xs text-gray-500 mt-0.5">{hizmet.aciklama}</div>}
                  {hizmet.sure && <div className="text-xs text-gray-400 mt-0.5">⏱ {formatSure(hizmet.sure)}</div>}
                </div>
                <div className="text-orange-500 font-bold text-sm whitespace-nowrap ml-4">
                  {formatFiyat(hizmet.fiyat.toString())}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Randevu Formu */}
      <section className="mb-8">
        <RandevuFormu esnafId={esnaf.id} hizmetler={esnaf.hizmetler} />
      </section>

      {/* Yorumlar */}
      {esnaf.yorumlar.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Yorumlar</h2>
          <div className="flex flex-col gap-3">
            {esnaf.yorumlar.map((yorum) => (
              <div key={yorum.id} className="bg-white border border-gray-100 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="font-medium text-gray-900">{yorum.musteriAd}</div>
                  <div className="text-yellow-400">{'★'.repeat(yorum.puan)}{'☆'.repeat(5 - yorum.puan)}</div>
                </div>
                {yorum.yorum && <p className="text-gray-700 text-sm">{yorum.yorum}</p>}
                {yorum.yanitlar && (
                  <div className="mt-3 pl-3 border-l-2 border-orange-200">
                    <p className="text-xs text-gray-500 font-medium mb-1">İşletme yanıtı:</p>
                    <p className="text-gray-700 text-sm">{yorum.yanitlar}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

function RandevuFormu({ esnafId, hizmetler }: { esnafId: number; hizmetler: Array<{ id: number; ad: string; sure: number | null }> }) {
  return (
    <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Randevu Al</h2>
      <RandevuFormClient esnafId={esnafId} hizmetler={hizmetler} />
    </div>
  )
}

// Client bileşeni için ayrı dosya
import { RandevuFormClient } from '@/components/public/RandevuFormClient'
