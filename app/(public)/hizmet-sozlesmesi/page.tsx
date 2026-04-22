export default function HizmetSozlesmesiPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-black text-gray-900 mb-2">Hizmet Sözleşmesi</h1>
      <p className="text-gray-500 text-sm mb-8">Son güncelleme: Nisan 2025</p>

      <div className="space-y-6 text-gray-700">
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">1. Taraflar</h2>
          <p>Bu Hizmet Sözleşmesi, ESKOB platformu ile platforma kaydolan kullanıcılar arasındaki ilişkiyi düzenler.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">2. Hizmet Kapsamı</h2>
          <p>ESKOB, yerel esnaf ve işletmeler ile tüketicileri buluşturan dijital bir platform hizmeti sunar. Platform; işletme vitrin yönetimi, randevu sistemi ve arama hizmetleri içerir.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">3. Kullanıcı Yükümlülükleri</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Gerçek ve doğru bilgi sağlamak</li>
            <li>Platforma zarar verecek eylemlerden kaçınmak</li>
            <li>Diğer kullanıcıların haklarına saygı göstermek</li>
            <li>Yürürlükteki mevzuata uymak</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">4. Hesap Feshi</h2>
          <p>ESKOB, sözleşme ihlali durumunda hesabı askıya alma veya kapatma hakkını saklı tutar.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">5. İletişim</h2>
          <p>Sözleşmeye ilişkin sorularınız için: <strong>destek@eskob.com.tr</strong></p>
        </section>
      </div>
    </div>
  )
}
