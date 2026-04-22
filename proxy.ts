import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

export async function proxy(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.AUTH_SECRET })
  const { pathname } = req.nextUrl

  // Koruma gerektiren yollar
  const panelYollari = ['/panel', '/vitrin', '/hizmetler', '/randevular']
  const adminYolları = ['/phyberk/admin']
  const kullaniciYollari = ['/u/']

  const isPanelYolu = panelYollari.some((p) => pathname.startsWith(p))
  const isAdminYolu = adminYolları.some((p) => pathname.startsWith(p))
  const isKullaniciYolu = kullaniciYollari.some((p) => pathname.startsWith(p))

  if (isPanelYolu || isAdminYolu || isKullaniciYolu) {
    if (!token) {
      return NextResponse.redirect(new URL('/giris', req.url))
    }

    if (isAdminYolu && token.rol !== 'SUPER_ADMIN' && token.rol !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', req.url))
    }

    if (isPanelYolu && token.rol !== 'BUSINESS' && token.rol !== 'SUPER_ADMIN' && token.rol !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', req.url))
    }
  }

  // Giriş yapmış kullanıcı /giris veya /kayit sayfasına giremez
  if (token && (pathname === '/giris' || pathname === '/kayit')) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/panel/:path*',
    '/vitrin/:path*',
    '/hizmetler/:path*',
    '/randevular/:path*',
    '/phyberk/:path*',
    '/u/:path*',
    '/giris',
    '/kayit',
  ],
}
