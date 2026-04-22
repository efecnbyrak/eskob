import { prisma } from '@/lib/db'
import Link from 'next/link'
import { AramaKutusu } from '@/components/public/AramaKutusu'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { AnimatedCounter } from '@/components/ui/AnimatedCounter'

export default async function AnaSayfa() {
  const [turler, esnafSayisi, kategoriSayisi, yorumSayisi] = await Promise.all([
    prisma.tur.findMany({
      include: { kategoriler: { take: 5, orderBy: { sira: 'asc' } } },
      orderBy: { sira: 'asc' },
    }),
    prisma.esnaf.count({ where: { aktif: true, onaylı: true } }),
    prisma.kategori.count(),
    prisma.yorum.count().catch(() => 0),
  ])

  return (
    <div className="overflow-hidden">
      {/* ==================== HERO ==================== */}
      <section className="gradient-hero relative py-24 md:py-32">
        {/* Floating decorative elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-orange-200/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-orange-300/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-100/20 rounded-full blur-3xl" />
        </div>

        <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
          <AnimatedSection delay={0}>
            <div className="inline-flex items-center gap-2 bg-orange-100/80 backdrop-blur-sm text-orange-700 text-sm font-semibold px-4 py-2 rounded-full mb-6 border border-orange-200/50">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              İstanbul&apos;un En Büyük Esnaf Platformu
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-gray-900 mb-6 leading-[1.1] text-balance">
              Yakınındaki Esnafı{' '}
              <span className="gradient-text">Keşfet</span>
            </h1>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <p className="text-lg md:text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed text-balance">
              Berberden restorana, spor salonundan güzellik merkezine — tüm yerel hizmetler bir arada.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.3}>
            <AramaKutusu />
          </AnimatedSection>

          <AnimatedSection delay={0.45}>
            <div className="flex items-center justify-center gap-6 mt-8 text-sm text-gray-400">
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Ücretsiz
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Hızlı
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Güvenli
              </span>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ==================== STATS ==================== */}
      <section className="py-16 bg-white relative">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-50/50 to-white" />
        <div className="max-w-5xl mx-auto px-4 relative z-10">
          <AnimatedSection>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <StatCard
                icon="🏪"
                value={esnafSayisi}
                suffix="+"
                label="Kayıtlı İşletme"
                delay={0}
              />
              <StatCard
                icon="📂"
                value={turler.length}
                suffix=""
                label="Hizmet Türü"
                delay={0.1}
              />
              <StatCard
                icon="📋"
                value={kategoriSayisi}
                suffix=""
                label="Kategori"
                delay={0.2}
              />
              <StatCard
                icon="⭐"
                value={yorumSayisi}
                suffix="+"
                label="Değerlendirme"
                delay={0.3}
              />
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ==================== TÜRLER ==================== */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">Ne Arıyorsunuz?</h2>
              <p className="text-gray-500 max-w-lg mx-auto">İhtiyacınıza uygun hizmet kategorisini seçin</p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {turler.map((tur, i) => (
              <AnimatedSection key={tur.id} delay={i * 0.05} direction="scale">
                <Link
                  href={`/ara?tur=${tur.slug}`}
                  className="card-glass flex flex-col items-center gap-3 p-5 group cursor-pointer"
                >
                  <span className="text-4xl group-hover:scale-110 transition-transform duration-300 group-hover:animate-float">
                    {tur.ikon}
                  </span>
                  <span className="text-xs font-semibold text-gray-700 text-center group-hover:text-orange-600 transition-colors">
                    {tur.ad}
                  </span>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== NASIL ÇALIŞIR ==================== */}
      <section className="py-20 gradient-mesh">
        <div className="max-w-5xl mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">Nasıl Çalışır?</h2>
              <p className="text-gray-500">3 adımda ihtiyacınız olan hizmete ulaşın</p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', icon: '🔍', title: 'Arayın', desc: 'İhtiyacınız olan hizmeti veya işletmeyi arayın.' },
              { step: '02', icon: '📋', title: 'Karşılaştırın', desc: 'Yorumları okuyun, fiyatları ve hizmetleri karşılaştırın.' },
              { step: '03', icon: '📅', title: 'Randevu Alın', desc: 'Online randevu oluşturun, hemen tarihinizi belirleyin.' },
            ].map((item, i) => (
              <AnimatedSection key={item.step} delay={i * 0.15} direction={i === 0 ? 'left' : i === 2 ? 'right' : 'up'}>
                <div className="card-premium p-8 text-center relative group">
                  <div className="absolute -top-3 -right-3 w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 text-white text-xs font-bold flex items-center justify-center shadow-lg shadow-orange-500/20">
                    {item.step}
                  </div>
                  <span className="text-5xl mb-4 block group-hover:animate-float">{item.icon}</span>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== ÖNE ÇIKANLAR ==================== */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <AnimatedSection>
            <div className="flex items-end justify-between mb-10">
              <div>
                <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">Öne Çıkan İşletmeler</h2>
                <p className="text-gray-500">En son eklenen ve popüler işletmeler</p>
              </div>
              <Link href="/ara" className="hidden sm:flex items-center gap-2 text-sm font-semibold text-orange-500 hover:text-orange-600 transition-colors group">
                Tümünü Gör
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </AnimatedSection>
          <OncuIsletmeler />
          <div className="sm:hidden mt-6 text-center">
            <Link href="/ara" className="btn-primary inline-flex items-center gap-2 text-sm">
              <span>Tüm İşletmeleri Gör</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ==================== CTA ==================== */}
      <section className="py-24 gradient-cta relative overflow-hidden">
        {/* Floating circles */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-10 w-32 h-32 border border-white/10 rounded-full" />
          <div className="absolute bottom-10 right-20 w-48 h-48 border border-white/10 rounded-full" />
          <div className="absolute top-1/2 left-1/3 w-24 h-24 border border-white/5 rounded-full" />
        </div>

        <div className="max-w-3xl mx-auto px-4 text-center relative z-10">
          <AnimatedSection>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6 text-balance">
              İşletmenizi Dijitale Taşıyın
            </h2>
          </AnimatedSection>
          <AnimatedSection delay={0.1}>
            <p className="text-orange-100 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
              Ücretsiz hesap oluşturun, hizmetlerinizi listeleyin, online randevu alın. Müşterileriniz sizi kolayca bulsun.
            </p>
          </AnimatedSection>
          <AnimatedSection delay={0.2}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/kayit" className="inline-flex items-center gap-2 bg-white text-orange-600 font-bold px-8 py-4 rounded-2xl hover:bg-orange-50 transition-all duration-300 hover:shadow-xl hover:shadow-black/10 hover:-translate-y-1 text-lg">
                <span>Hemen Başla — Ücretsiz</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link href="/ara" className="inline-flex items-center gap-2 text-white/90 font-medium hover:text-white transition-colors text-sm">
                veya platformu keşfedin →
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  )
}

/* ==================== STAT CARD ==================== */
function StatCard({ icon, value, suffix, label, delay }: {
  icon: string; value: number; suffix: string; label: string; delay: number
}) {
  return (
    <AnimatedSection delay={delay} direction="scale">
      <div className="card-premium p-6 text-center group hover:border-orange-100">
        <span className="text-2xl mb-2 block">{icon}</span>
        <div className="text-3xl md:text-4xl font-black gradient-text mb-1">
          <AnimatedCounter target={value} suffix={suffix} />
        </div>
        <div className="text-sm text-gray-500 font-medium">{label}</div>
      </div>
    </AnimatedSection>
  )
}

/* ==================== ÖNE ÇIKAN İŞLETMELER ==================== */
async function OncuIsletmeler() {
  const esnaflar = await prisma.esnaf.findMany({
    where: { aktif: true, onaylı: true },
    include: { kategori: true },
    take: 6,
    orderBy: { olusturmaT: 'desc' },
  })

  if (esnaflar.length === 0) {
    return (
      <div className="text-center py-12">
        <span className="text-5xl mb-4 block">🏪</span>
        <p className="text-gray-500">Henüz öne çıkan işletme bulunmuyor.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {esnaflar.map((esnaf, i) => (
        <AnimatedSection key={esnaf.id} delay={i * 0.1}>
          <Link href={`/${esnaf.slug}`} className="card-premium group block">
            <div className="h-44 bg-gradient-to-br from-orange-50 via-orange-100 to-orange-200 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent" />
              <span className="text-6xl group-hover:scale-110 transition-transform duration-500">{esnaf.kategori.ikon}</span>
            </div>
            <div className="p-5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-bold text-gray-900 group-hover:text-orange-600 transition-colors">{esnaf.isletmeAdi}</h3>
                  <p className="text-sm text-gray-400 mt-1 flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {esnaf.sehir} / {esnaf.ilce}
                  </p>
                </div>
                <span className="text-xs bg-orange-50 text-orange-600 px-3 py-1.5 rounded-full whitespace-nowrap font-medium border border-orange-100">
                  {esnaf.kategori.ad}
                </span>
              </div>
              {esnaf.aciklama && (
                <p className="text-sm text-gray-500 mt-3 line-clamp-2 leading-relaxed">{esnaf.aciklama}</p>
              )}
            </div>
          </Link>
        </AnimatedSection>
      ))}
    </div>
  )
}
