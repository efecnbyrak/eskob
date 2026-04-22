export default function KvkkPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-black text-gray-900 mb-2">KVKK Aydınlatma Metni</h1>
      <p className="text-gray-500 text-sm mb-8">Son güncelleme: Nisan 2025</p>

      <div className="prose prose-gray max-w-none space-y-6 text-gray-700">
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">1. Veri Sorumlusu</h2>
          <p>ESKOB Esnaf Dijital Vitrin Platformu, 6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında veri sorumlusu sıfatıyla hareket etmektedir.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">2. İşlenen Kişisel Veriler</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Ad, soyad, kullanıcı adı</li>
            <li>E-posta adresi ve telefon numarası</li>
            <li>Doğum tarihi ve konum bilgisi</li>
            <li>İşletme bilgileri (esnaf kullanıcıları için)</li>
            <li>Randevu ve yorum kayıtları</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">3. Kişisel Verilerin İşlenme Amaçları</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Hesap oluşturma ve kimlik doğrulama</li>
            <li>Hizmet sunumu ve randevu yönetimi</li>
            <li>Platform güvenliğinin sağlanması</li>
            <li>Yasal yükümlülüklerin yerine getirilmesi</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">4. Haklarınız</h2>
          <p>KVKK'nın 11. maddesi kapsamında: kişisel verilerinize erişim, düzeltme, silme, işlemenin kısıtlanması ve itiraz haklarına sahipsiniz. Talepler için: <strong>kvkk@eskob.com.tr</strong></p>
        </section>
      </div>
    </div>
  )
}
