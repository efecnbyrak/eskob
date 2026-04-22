import { prisma } from '@/lib/db'
import Link from 'next/link'
import { AramaKutusu } from '@/components/public/AramaKutusu'

export default async function AnaSayfa() {
  const [turler, esnafSayisi, kategoriSayisi] = await Promise.all([
    prisma.tur.findMany({
      include: { kategoriler: { take: 5, orderBy: { sira: 'asc' } } },
      orderBy: { sira: 'asc' },
    }),
    prisma.esnaf.count({ where: { aktif: true, onaylı: true } }),
    prisma.kategori.count(),
  ])

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-orange-50 via-white to-orange-50 py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-4 leading-tight">
            Yakınındaki Esnafı{' '}
            <span className="text-orange-500">Keşfet</span>
          </h1>
          <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
            Berberden restorana, spor salonundan güzellik merkezine — tüm yerel hizmetler bir arada.
          </p>
          <AramaKutusu />
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-white border-y border-gray-100">
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-3xl font-black text-orange-500">{esnafSayisi}+</div>
            <div className="text-sm text-gray-600 mt-1">Kayıtlı İşletme</div>
          </div>
          <div>
            <div className="text-3xl font-black text-orange-500">{turler.length}</div>
            <div className="text-sm text-gray-600 mt-1">Hizmet Türü</div>
          </div>
          <div>
            <div className="text-3xl font-black text-orange-500">{kategoriSayisi}</div>
            <div className="text-sm text-gray-600 mt-1">Kategori</div>
          </div>
        </div>
      </section>

      {/* Türler */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-black text-gray-900 mb-8 text-center">Ne Arıyorsunuz?</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {turler.map((tur) => (
              <Link
                key={tur.id}
                href={`/ara?tur=${tur.slug}`}
                className="flex flex-col items-center gap-2 p-4 bg-white rounded-2xl border border-gray-100 hover:border-orange-200 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
              >
                <span className="text-3xl">{tur.ikon}</span>
                <span className="text-xs font-medium text-gray-700 text-center">{tur.ad}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Demo İşletmeler */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-gray-900">Öne Çıkan İşletmeler</h2>
            <Link href="/ara" className="text-sm font-medium text-orange-500 hover:text-orange-600">
              Tümünü Gör →
            </Link>
          </div>
          <OncuIsletmeler />
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-orange-500">
        <div className="max-w-2xl mx-auto px-4 text-center text-white">
          <h2 className="text-3xl font-black mb-4">İşletmenizi Dijitale Taşıyın</h2>
          <p className="text-orange-100 mb-8">Ücretsiz hesap oluşturun, hizmetlerinizi listeleyin, randevu alın.</p>
          <Link href="/kayit" className="inline-block bg-white text-orange-500 font-bold px-8 py-4 rounded-2xl hover:bg-orange-50 transition-colors text-lg">
            Hemen Başla — Ücretsiz
          </Link>
        </div>
      </section>
    </div>
  )
}

async function OncuIsletmeler() {
  const esnaflar = await prisma.esnaf.findMany({
    where: { aktif: true, onaylı: true },
    include: { kategori: true },
    take: 6,
    orderBy: { olusturmaT: 'desc' },
  })

  if (esnaflar.length === 0) return null

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {esnaflar.map((esnaf) => (
        <Link key={esnaf.id} href={`/${esnaf.slug}`} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
          <div className="h-40 bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center relative">
            <span className="text-5xl">{esnaf.kategori.ikon}</span>
          </div>
          <div className="p-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-bold text-gray-900">{esnaf.isletmeAdi}</h3>
                <p className="text-sm text-gray-500 mt-0.5">{esnaf.sehir} / {esnaf.ilce}</p>
              </div>
              <span className="text-xs bg-orange-50 text-orange-600 px-2 py-1 rounded-full whitespace-nowrap">
                {esnaf.kategori.ikon} {esnaf.kategori.ad}
              </span>
            </div>
            {esnaf.aciklama && (
              <p className="text-sm text-gray-600 mt-2 line-clamp-2">{esnaf.aciklama}</p>
            )}
          </div>
        </Link>
      ))}
    </div>
  )
}
