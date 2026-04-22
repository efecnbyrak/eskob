import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { esnafId, puan, yorum, musteriAd } = body

    if (!esnafId || !puan || !musteriAd) {
      return NextResponse.json({ error: 'Zorunlu alanlar eksik' }, { status: 400 })
    }

    const session = await auth()

    const yorumObj = await prisma.yorum.create({
      data: {
        esnafId: parseInt(esnafId),
        puan: parseInt(puan),
        yorum: yorum || null,
        musteriAd,
        ...(session?.user?.id ? { kullaniciId: parseInt(session.user.id) } : {}),
        onaylı: false,
      },
    })

    return NextResponse.json({ yorum: yorumObj }, { status: 201 })
  } catch (err) {
    console.error('Yorum hatası:', err)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const esnafId = parseInt(req.nextUrl.searchParams.get('esnafId') || '0')
  if (!esnafId) return NextResponse.json({ yorumlar: [] })

  const yorumlar = await prisma.yorum.findMany({
    where: { esnafId, onaylı: true },
    orderBy: { olusturmaT: 'desc' },
  })

  return NextResponse.json({ yorumlar })
}
