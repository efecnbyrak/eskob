import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const q = req.nextUrl.searchParams.get('q')

    if (!q || q.trim().length < 2) {
      return NextResponse.json({ results: [] })
    }

    const arama = q.trim()

    // Kategorileri de ara
    const esnaflar = await prisma.esnaf.findMany({
      where: {
        aktif: true,
        onaylı: true,
        OR: [
          { isletmeAdi: { contains: arama, mode: 'insensitive' } },
          { sehir: { contains: arama, mode: 'insensitive' } },
          { ilce: { contains: arama, mode: 'insensitive' } },
          { kategori: { ad: { contains: arama, mode: 'insensitive' } } },
        ],
      },
      include: {
        kategori: { select: { ad: true, ikon: true } },
      },
      take: 5,
      orderBy: { olusturmaT: 'desc' },
    })

    const results = esnaflar.map((e) => ({
      id: e.id,
      isletmeAdi: e.isletmeAdi,
      sehir: e.sehir,
      ilce: e.ilce,
      kategori: e.kategori.ad,
      ikon: e.kategori.ikon,
      slug: e.slug,
    }))

    return NextResponse.json({ results })
  } catch (err) {
    console.error('Arama hatası:', err)
    return NextResponse.json({ results: [] }, { status: 500 })
  }
}
