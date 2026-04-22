import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ kullanici: null })
  }

  const kullanici = await prisma.kullanici.findUnique({
    where: { id: parseInt(session.user.id) },
    select: { id: true, ad: true, soyad: true, email: true, kullaniciAdi: true, rol: true, avatarUrl: true },
  })

  return NextResponse.json({ kullanici })
}
