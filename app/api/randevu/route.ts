import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { esnafId, hizmetId, tarih, sure, musteriAd, musteriTelefon, musteriNot } = body

    if (!esnafId || !tarih || !musteriAd || !musteriTelefon) {
      return NextResponse.json({ error: 'Zorunlu alanlar eksik' }, { status: 400 })
    }

    const randevu = await prisma.randevu.create({
      data: {
        esnafId: parseInt(esnafId),
        hizmetId: hizmetId ? parseInt(hizmetId) : null,
        tarih: new Date(tarih),
        sure: sure || 30,
        musteriAd,
        musteriTelefon,
        musteriNot: musteriNot || null,
      },
    })

    return NextResponse.json({ randevu }, { status: 201 })
  } catch (err) {
    console.error('Randevu hatası:', err)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Giriş gerekli' }, { status: 401 })

  const esnaf = await prisma.esnaf.findUnique({
    where: { kullaniciId: parseInt(session.user.id) },
  })

  if (!esnaf) return NextResponse.json({ randevular: [] })

  const randevular = await prisma.randevu.findMany({
    where: { esnafId: esnaf.id },
    include: { hizmet: { select: { ad: true } } },
    orderBy: { tarih: 'desc' },
  })

  return NextResponse.json({ randevular })
}

export async function PATCH(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Giriş gerekli' }, { status: 401 })

  const { id, durum } = await req.json()
  const randevu = await prisma.randevu.update({
    where: { id },
    data: { durum },
  })

  return NextResponse.json({ randevu })
}
