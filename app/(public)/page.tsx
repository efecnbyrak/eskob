import { prisma } from '@/lib/db'
import Link from 'next/link'
import { AramaKutusu } from '@/components/public/AramaKutusu'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { AnimatedCounter } from '@/components/ui/AnimatedCounter'

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
    <div className="flex flex-col w-full bg-white">
      {/* Spacer for Fixed Navbar */}
      <div className="h-20" />

      {/* Hero Section */}
      <section className="relative w-full py-20 md:py-32 bg-[#FAFAFA] border-b border-gray-100 overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 text-[12px] font-bold px-4 py-1.5 rounded-full mb-8">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            İSTANBUL'UN ESNAF PLATFORMU
          </div>
          <h1 className="text-4x sm:text-5xl md:text-7xl font-black text-gray-900 mb-6 leading-tight">
            Yakınındaki Esnafı <br />
            <span className="gradient-text">Keşfet</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-500 mb-12 max-w-2xl mx-auto leading-relaxed">
            Berberden restorana, spor salonundan güzellik merkezine — <br className="hidden sm:block" />
            tüm yerel hizmetler güvenle bir arada.
          </p>
          <div className="max-w-2xl mx-auto px-4">
            <AramaKutusu />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white border-b border-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatCard icon="🏪" value={esnafSayisi} suffix="+" label="Kayıtlı İşletme" />
            <StatCard icon="📂" value={turler.length} suffix="" label="Hizmet Türü" />
            <StatCard icon="📋" value={kategoriSayisi} suffix="" label="Kategori" />
            <StatCard icon="⭐" value={1200} suffix="+" label="Yorum" />
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4">Ne Arıyorsunuz?</h2>
            <p className="text-gray-500">İhtiyacınıza en uygun hizmet kategorisini seçin</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {turler.map((tur) => (
              <Link
                key={tur.id}
                href={`/ara?tur=${tur.slug}`}
                className="card-premium flex flex-col items-center gap-4 p-6 hover:shadow-xl transition-all"
              >
                <span className="text-4xl">{tur.ikon}</span>
                <span className="text-xs font-bold text-gray-800 text-center uppercase tracking-wider">{tur.ad}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-24 bg-[#F8F9FA]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4">Nasıl Çalışır?</h2>
            <p className="text-gray-500">3 basit adımda hizmete ulaşın</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ProcessCard step="01" icon="🔍" title="Ara" desc="İhtiyacın olan hizmeti veya işletmeyi kolayca bul." />
            <ProcessCard step="02" icon="⚖️" title="Karşılaştır" desc="Yorumları incele, fiyatları ve kaliteyi kıyasla." />
            <ProcessCard step="03" icon="📅" title="Randevu Al" desc="Saniyeler içinde online randevunu oluştur." />
          </div>
        </div>
      </section>

      {/* Featured Businesses Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-end justify-between mb-16 px-4">
            <div>
              <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4">Öne Çıkanlar</h2>
              <p className="text-gray-500">En kaliteli ve popüler işletmeler</p>
            </div>
            <Link href="/ara" className="text-sm font-bold text-orange-500 hover:underline">Tümünü Gör →</Link>
          </div>
          <OncuIsletmeler />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto bg-gray-900 rounded-[2.5rem] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 blur-[100px] rounded-full" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-6xl font-black text-white mb-8">İşletmenizi Dijitale Taşıyın</h2>
            <p className="text-gray-400 text-lg mb-12 max-w-2xl mx-auto">
              Ücretsiz hesabınızı oluşturun, hizmetlerinizi listeleyin ve binlerce müşteriye hemen ulaşın.
            </p>
            <Link href="/kayit" className="btn-primary text-xl px-12 py-5 !rounded-2xl">
              Ücretsiz Başla
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

function StatCard({ icon, value, suffix, label }: { icon: string; value: number; suffix: string; label: string }) {
  return (
    <div className="text-center p-4">
      <span className="text-3xl mb-2 block">{icon}</span>
      <div className="text-3xl md:text-4xl font-black text-gray-900 mb-1">
        <AnimatedCounter target={value} suffix={suffix} />
      </div>
      <div className="text-sm font-semibold text-gray-500 uppercase tracking-widest">{label}</div>
    </div>
  )
}

function ProcessCard({ step, icon, title, desc }: { step: string; icon: string; title: string; desc: string }) {
  return (
    <div className="bg-white p-10 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative group">
      <div className="absolute top-6 right-6 text-4xl font-black text-gray-50 opacity-10 group-hover:opacity-20 transition-opacity">{step}</div>
      <span className="text-5xl mb-6 block animate-float">{icon}</span>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {esnaflar.map((esnaf) => (
        <Link key={esnaf.id} href={`/${esnaf.slug}`} className="card-premium overflow-hidden group">
          <div className="h-48 bg-gray-50 flex items-center justify-center text-6xl group-hover:scale-105 transition-transform duration-500">
            {esnaf.kategori.ikon}
          </div>
          <div className="p-8">
            <div className="flex items-start justify-between mb-4">
              <h3 className="font-bold text-xl text-gray-900">{esnaf.isletmeAdi}</h3>
              <span className="bg-orange-50 text-orange-600 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter">
                {esnaf.kategori.ad}
              </span>
            </div>
            <p className="text-gray-400 text-sm mb-4 flex items-center gap-1">
              📍 {esnaf.sehir} / {esnaf.ilce}
            </p>
            {esnaf.aciklama && (
              <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed">{esnaf.aciklama}</p>
            )}
          </div>
        </Link>
      ))}
    </div>
  )
}
