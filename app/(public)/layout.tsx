import { Navbar } from '@/components/public/Navbar'
import Link from 'next/link'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>

      {/* Premium Footer */}
      <footer className="bg-gray-950 text-gray-400 pt-16 pb-8 mt-20 relative overflow-hidden">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-30">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500/3 rounded-full blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                  <span className="text-white font-black text-xs">E</span>
                </div>
                <span className="text-xl font-black text-white">ESKOB</span>
              </div>
              <p className="text-sm leading-relaxed text-gray-500">
                Yerel esnafı dijitalleştiriyoruz. Aradığınız hizmete anında ulaşın.
              </p>
            </div>

            {/* Platform */}
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm tracking-wide uppercase">Platform</h4>
              <ul className="flex flex-col gap-3 text-sm">
                <li><Link href="/ara" className="hover:text-orange-400 transition-colors duration-200">Keşfet</Link></li>
                <li><Link href="/hizmetler" className="hover:text-orange-400 transition-colors duration-200">Hizmetler</Link></li>
                <li><Link href="/esnaf-ol" className="hover:text-orange-400 transition-colors duration-200">Esnaf Ol</Link></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm tracking-wide uppercase">Yasal</h4>
              <ul className="flex flex-col gap-3 text-sm">
                <li><Link href="/kvkk" className="hover:text-orange-400 transition-colors duration-200">KVKK</Link></li>
                <li><Link href="/hizmet-sozlesmesi" className="hover:text-orange-400 transition-colors duration-200">Hizmet Sözleşmesi</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm tracking-wide uppercase">İletişim</h4>
              <ul className="flex flex-col gap-3 text-sm">
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  info@eskob.com.tr
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-12 pt-8 border-t border-gray-800/50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-600">
              © {new Date().getFullYear()} ESKOB. Tüm hakları saklıdır.
            </p>
            <p className="text-xs text-gray-600">
              Made with <span className="text-orange-500">♥</span> in İstanbul
            </p>
          </div>
        </div>
      </footer>
    </>
  )
}
