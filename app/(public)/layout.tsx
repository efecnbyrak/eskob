import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { Navbar } from '@/components/public/Navbar'

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  let kullanici = null

  if (session?.user?.id) {
    const db = await prisma.kullanici.findUnique({
      where: { id: parseInt(session.user.id) },
      select: { id: true, ad: true, soyad: true, email: true, kullaniciAdi: true, rol: true, avatarUrl: true },
    })
    if (db) {
      kullanici = {
        ...db,
        id: db.id.toString(),
        rol: db.rol as string,
      }
    }
  }

  return (
    <>
      <Navbar kullanici={kullanici} />
      <main>{children}</main>
      <footer className="bg-gray-900 text-gray-400 py-12 mt-16">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <span className="text-2xl font-black text-orange-500">ESKOB</span>
            <p className="mt-2 text-sm">Yerel esnafı dijitalleştiriyoruz.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Platform</h4>
            <ul className="flex flex-col gap-2 text-sm">
              <li><a href="/ara" className="hover:text-white transition-colors">Keşfet</a></li>
              <li><a href="/esnaf-ol" className="hover:text-white transition-colors">Esnaf Ol</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Yasal</h4>
            <ul className="flex flex-col gap-2 text-sm">
              <li><a href="/kvkk" className="hover:text-white transition-colors">KVKK</a></li>
              <li><a href="/hizmet-sozlesmesi" className="hover:text-white transition-colors">Hizmet Sözleşmesi</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">İletişim</h4>
            <p className="text-sm">info@eskob.com.tr</p>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-4 mt-8 pt-8 border-t border-gray-800 text-sm text-center">
          © {new Date().getFullYear()} ESKOB. Tüm hakları saklıdır.
        </div>
      </footer>
    </>
  )
}
