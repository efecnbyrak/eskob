import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'

export default async function AdminPage() {
  const session = await auth()
  if (!session?.user) redirect('/giris')

  const rol = (session.user as { rol: string }).rol
  if (rol !== 'SUPER_ADMIN' && rol !== 'ADMIN') redirect('/')

  const [kullaniciSayisi, esnafSayisi, randevuSayisi, onayBekleyen] = await Promise.all([
    prisma.kullanici.count(),
    prisma.esnaf.count(),
    prisma.randevu.count(),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (prisma.esnaf as any).findMany({
      where: { onaylı: false },
      include: { kategori: true, kullanici: { select: { email: true } } },
      orderBy: { olusturmaT: 'desc' },
      take: 20,
    }) as Promise<Array<{ id: number; isletmeAdi: string; sehir: string; ilce: string; kategori: { ikon: string; ad: string }; kullanici: { email: string } }>>,
  ])

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Admin Paneli</h1>
          <p className="text-gray-500 text-sm mt-1">ESKOB yönetim merkezi</p>
        </div>
        <a href="/" className="text-sm text-orange-500 hover:text-orange-600">← Siteye Dön</a>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { ikon: '👤', etiket: 'Kullanıcı', deger: kullaniciSayisi },
          { ikon: '🏪', etiket: 'İşletme', deger: esnafSayisi },
          { ikon: '📅', etiket: 'Randevu', deger: randevuSayisi },
        ].map(s => (
          <div key={s.etiket} className="bg-white rounded-2xl border border-gray-100 p-5 text-center">
            <div className="text-3xl mb-2">{s.ikon}</div>
            <div className="text-2xl font-black text-gray-900">{s.deger}</div>
            <div className="text-sm text-gray-500">{s.etiket}</div>
          </div>
        ))}
      </div>

      {/* Onay bekleyen işletmeler */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          Onay Bekleyen İşletmeler
          {onayBekleyen.length > 0 && (
            <span className="ml-2 text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">{onayBekleyen.length}</span>
          )}
        </h2>

        {onayBekleyen.length === 0 ? (
          <p className="text-gray-400 text-sm">Onay bekleyen işletme yok.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {onayBekleyen.map((esnaf) => (
              <div key={esnaf.id} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                <div>
                  <div className="font-medium text-gray-900">{esnaf.isletmeAdi}</div>
                  <div className="text-sm text-gray-500">
                    {esnaf.kategori.ikon} {esnaf.kategori.ad} · {esnaf.sehir}/{esnaf.ilce}
                  </div>
                  <div className="text-xs text-gray-400">{esnaf.kullanici.email}</div>
                </div>
                <OnayButon esnafId={esnaf.id} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function OnayButon({ esnafId }: { esnafId: number }) {
  return <OnayButonClient esnafId={esnafId} />
}

import { OnayButonClient } from '@/components/dashboard/OnayButonClient'
