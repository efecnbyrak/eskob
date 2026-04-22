import { prisma } from '@/lib/db'
import Link from 'next/link'

interface Props {
  searchParams: Promise<{ q?: string; tur?: string; kategori?: string; sehir?: string }>
}

export default async function AraPage({ searchParams }: Props) {
  const params = await searchParams
  const { q, tur: turSlug, kategori: kategoriSlug, sehir } = params

  const [turler, esnaflar] = await Promise.all([
    prisma.tur.findMany({ orderBy: { sira: 'asc' } }),
    prisma.esnaf.findMany({
      where: {
        aktif: true,
        onaylı: true,
        ...(q && {
          OR: [
            { isletmeAdi: { contains: q, mode: 'insensitive' } },
            { sehir: { contains: q, mode: 'insensitive' } },
            { ilce: { contains: q, mode: 'insensitive' } },
            { kategori: { ad: { contains: q, mode: 'insensitive' } } },
          ],
        }),
        ...(kategoriSlug && { kategori: { slug: kategoriSlug } }),
        ...(turSlug && { kategori: { tur: { slug: turSlug } } }),
        ...(sehir && { sehir: { contains: sehir, mode: 'insensitive' } }),
      },
      include: { kategori: true },
      orderBy: { olusturmaT: 'desc' },
      take: 24,
    }),
  ])

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-black text-gray-900 mb-6">
        {q ? `"${q}" için sonuçlar` : 'İşletme Ara'}
      </h1>

      {/* Filtreler */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-gizle">
        <Link
          href="/ara"
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${!turSlug ? 'bg-orange-500 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:border-orange-300'}`}
        >
          Tümü
        </Link>
        {turler.map((tur) => (
          <Link
            key={tur.id}
            href={`/ara?tur=${tur.slug}${q ? `&q=${q}` : ''}`}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${turSlug === tur.slug ? 'bg-orange-500 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:border-orange-300'}`}
          >
            {tur.ikon} {tur.ad}
          </Link>
        ))}
      </div>

      {/* Sonuçlar */}
      {esnaflar.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">🔍</div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Sonuç bulunamadı</h2>
          <p className="text-gray-500">Farklı arama terimleri veya filtreler deneyin.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {esnaflar.map((esnaf) => (
            <Link
              key={esnaf.id}
              href={`/${esnaf.slug}`}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className="h-36 bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center">
                <span className="text-5xl">{esnaf.kategori.ikon}</span>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-gray-900">{esnaf.isletmeAdi}</h3>
                    <p className="text-sm text-gray-500">{esnaf.sehir} / {esnaf.ilce}</p>
                  </div>
                  <span className="text-xs bg-orange-50 text-orange-600 px-2 py-1 rounded-full whitespace-nowrap">
                    {esnaf.kategori.ad}
                  </span>
                </div>
                {esnaf.aciklama && (
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">{esnaf.aciklama}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
