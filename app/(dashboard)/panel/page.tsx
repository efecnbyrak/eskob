import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'

export default async function PanelPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/giris')

  const esnaf = await prisma.esnaf.findUnique({
    where: { kullaniciId: parseInt(session.user.id) },
    include: {
      kategori: true,
      _count: { select: { randevular: true, yorumlar: true, hizmetler: true, favoriler: true } },
    },
  })

  if (!esnaf) {
    return (
      <div className="text-center py-20">
        <div className="text-5xl mb-4">🏪</div>
        <h2 className="text-xl font-semibold text-gray-700 mb-2">İşletmeniz henüz oluşturulmadı</h2>
        <p className="text-gray-500">Kayıt sırasında işletme bilgilerinizi girmeniz gerekiyor.</p>
      </div>
    )
  }

  const stats = [
    { etiket: 'Hizmet', deger: esnaf._count.hizmetler, ikon: '✂️' },
    { etiket: 'Randevu', deger: esnaf._count.randevular, ikon: '📅' },
    { etiket: 'Yorum', deger: esnaf._count.yorumlar, ikon: '⭐' },
    { etiket: 'Favori', deger: esnaf._count.favoriler, ikon: '❤️' },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900">{esnaf.isletmeAdi}</h1>
          <p className="text-gray-500 text-sm mt-1">
            {esnaf.kategori.ikon} {esnaf.kategori.ad} · {esnaf.sehir} / {esnaf.ilce}
            {!esnaf.onaylı && (
              <span className="ml-2 text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">Onay Bekliyor</span>
            )}
          </p>
        </div>
        <a
          href={`/${esnaf.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-orange-500 hover:text-orange-600 flex items-center gap-1"
        >
          🔗 Profilimi Gör
        </a>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.etiket} className="bg-white rounded-2xl border border-gray-100 p-5 text-center">
            <div className="text-3xl mb-2">{s.ikon}</div>
            <div className="text-2xl font-black text-gray-900">{s.deger}</div>
            <div className="text-sm text-gray-500 mt-1">{s.etiket}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SonRandevular esnafId={esnaf.id} />
        <SonYorumlar esnafId={esnaf.id} />
      </div>
    </div>
  )
}

async function SonRandevular({ esnafId }: { esnafId: number }) {
  const randevular = await prisma.randevu.findMany({
    where: { esnafId },
    orderBy: { tarih: 'desc' },
    take: 5,
    include: { hizmet: true },
  })

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <h3 className="font-bold text-gray-900 mb-4">Son Randevular</h3>
      {randevular.length === 0 ? (
        <p className="text-gray-400 text-sm">Henüz randevu yok.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {randevular.map((r) => (
            <div key={r.id} className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900 text-sm">{r.musteriAd}</div>
                <div className="text-xs text-gray-500">{r.hizmet?.ad || 'Belirtilmemiş'}</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-600">{new Date(r.tarih).toLocaleDateString('tr-TR')}</div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  r.durum === 'BEKLIYOR' ? 'bg-yellow-100 text-yellow-700' :
                  r.durum === 'ONAYLANDI' ? 'bg-green-100 text-green-700' :
                  r.durum === 'TAMAMLANDI' ? 'bg-blue-100 text-blue-700' :
                  'bg-red-100 text-red-700'
                }`}>{r.durum}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

async function SonYorumlar({ esnafId }: { esnafId: number }) {
  const yorumlar = await prisma.yorum.findMany({
    where: { esnafId },
    orderBy: { olusturmaT: 'desc' },
    take: 5,
  })

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <h3 className="font-bold text-gray-900 mb-4">Son Yorumlar</h3>
      {yorumlar.length === 0 ? (
        <p className="text-gray-400 text-sm">Henüz yorum yok.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {yorumlar.map((y) => (
            <div key={y.id}>
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900 text-sm">{y.musteriAd}</span>
                <span className="text-yellow-400 text-xs">{'★'.repeat(y.puan)}</span>
              </div>
              {y.yorum && <p className="text-xs text-gray-600 mt-0.5 line-clamp-1">{y.yorum}</p>}
              {!y.onaylı && <span className="text-xs text-orange-500">Onay bekliyor</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
