import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ esnaf: null }, { status: 401 })

  const esnaf = await prisma.esnaf.findUnique({
    where: { kullaniciId: parseInt(session.user.id) },
  })

  return NextResponse.json({ esnaf })
}

export async function PUT(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Giriş gerekli' }, { status: 401 })

  const body = await req.json()
  const { isletmeAdi, aciklama, telefon, whatsapp, website, instagram, sehir, ilce, adres } = body

  const esnaf = await prisma.esnaf.update({
    where: { kullaniciId: parseInt(session.user.id) },
    data: {
      isletmeAdi,
      aciklama: aciklama || null,
      telefon: telefon || null,
      whatsapp: whatsapp || null,
      website: website || null,
      instagram: instagram || null,
      sehir,
      ilce,
      adres: adres || null,
    },
  })

  return NextResponse.json({ esnaf })
}
