import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Esnaf Ol - İşletmenizi Dijitale Taşıyın',
  description: 'ESKOB ile işletmenizi ücretsiz dijitale taşıyın. Vitrin oluşturun, randevu alın, müşteri kazanın.',
}

const OZELLIKLER = [
  {
    ikon: '🏪',
    baslik: 'Dijital Vitrin',
    aciklama: 'İşletmenizi online temsil eden profesyonel bir vitrin sayfası oluşturun.',
  },
  {
    ikon: '📅',
    baslik: 'Randevu Sistemi',
    aciklama: 'Müşterileriniz 7/24 online randevu alabilsin, siz onaylayın.',
  },
  {
    ikon: '⭐',
    baslik: 'Müşteri Yorumları',
    aciklama: 'Gerçek müşteri yorumlarıyla güven oluşturun, yeni müşteriler kazanın.',
  },
  {
    ikon: '📊',
    baslik: 'Analitik Panel',
    aciklama: 'Kaç kişi profilinizi gördü, kaç randevu aldınız — hepsini takip edin.',
  },
  {
    ikon: '✂️',
    baslik: 'Hizmet Yönetimi',
    aciklama: 'Hizmetlerinizi, fiyatlarınızı ve sürelerini kolayca yönetin.',
  },
  {
    ikon: '🔗',
    baslik: 'Kolay Paylaşım',
    aciklama: 'Size özel bağlantınızı sosyal medyada paylaşın, müşteri çekin.',
  },
]

const ADIMLAR = [
  { numara: '1', baslik: 'Ücretsiz Kaydol', aciklama: 'Dakikalar içinde hesabınızı oluşturun.' },
  { numara: '2', baslik: 'Vitrininizi Kurun', aciklama: 'İşletme bilgilerinizi ve hizmetlerinizi ekleyin.' },
  { numara: '3', baslik: 'Müşteri Kazanın', aciklama: 'Keşfedilmeye başlayın, randevular gelsin.' },
]

export default function EsnafOlPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-orange-500 to-orange-600 py-20 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
            İşletmenizi Dakikalar İçinde<br />Dijitale Taşıyın
          </h1>
          <p className="text-orange-100 text-lg mb-10 max-w-2xl mx-auto">
            Ücretsiz vitrin oluşturun, randevu sistemi kurun, yeni müşteriler kazanın.
            Kredi kartı gerekmez.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/kayit"
              className="bg-white text-orange-500 font-bold px-8 py-4 rounded-2xl hover:bg-orange-50 transition-colors text-lg"
            >
              Hemen Ücretsiz Başla
            </Link>
            <Link
              href="/ara"
              className="bg-orange-400/30 text-white border border-orange-300 font-semibold px-8 py-4 rounded-2xl hover:bg-orange-400/50 transition-colors text-lg"
            >
              İşletmeleri İncele
            </Link>
          </div>
        </div>
      </section>

      {/* Nasıl Çalışır */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 text-center mb-12">Nasıl Çalışır?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {ADIMLAR.map((adim) => (
              <div key={adim.numara} className="text-center">
                <div className="w-14 h-14 bg-orange-500 text-white text-2xl font-black rounded-2xl flex items-center justify-center mx-auto mb-4">
                  {adim.numara}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{adim.baslik}</h3>
                <p className="text-gray-500">{adim.aciklama}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Özellikler */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 text-center mb-12">Her Şey Dahil, Ücretsiz</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {OZELLIKLER.map((o) => (
              <div key={o.baslik} className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="text-4xl mb-4">{o.ikon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{o.baslik}</h3>
                <p className="text-gray-500 text-sm">{o.aciklama}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-black text-gray-900 mb-4">Başlamaya Hazır mısınız?</h2>
          <p className="text-gray-500 mb-8">
            Binlerce yerel işletme zaten ESKOB&apos;da. Sıra sizde.
          </p>
          <Link
            href="/kayit"
            className="inline-block bg-orange-500 text-white font-bold px-10 py-4 rounded-2xl hover:bg-orange-600 transition-colors text-lg"
          >
            Ücretsiz Hesap Oluştur →
          </Link>
          <p className="text-sm text-gray-400 mt-4">
            Zaten hesabınız var mı?{' '}
            <Link href="/giris" className="text-orange-500 hover:text-orange-600">
              Giriş yapın
            </Link>
          </p>
        </div>
      </section>
    </div>
  )
}
