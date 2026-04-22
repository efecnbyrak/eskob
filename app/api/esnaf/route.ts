import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const q = searchParams.get('q')
  const turSlug = searchParams.get('tur')
  const kategoriSlug = searchParams.get('kategori')
  const sehir = searchParams.get('sehir')
  const sayfa = parseInt(searchParams.get('sayfa') || '1')
  const limit = 12

  const esnaflar = await prisma.esnaf.findMany({
    where: {
      aktif: true,
      onaylı: true,
      ...(q && {
        OR: [
          { isletmeAdi: { contains: q, mode: 'insensitive' } },
          { sehir: { contains: q, mode: 'insensitive' } },
          { ilce: { contains: q, mode: 'insensitive' } },
        ],
      }),
      ...(kategoriSlug && { kategori: { slug: kategoriSlug } }),
      ...(turSlug && { kategori: { tur: { slug: turSlug } } }),
      ...(sehir && { sehir: { contains: sehir, mode: 'insensitive' } }),
    },
    include: { kategori: { include: { tur: true } } },
    orderBy: { olusturmaT: 'desc' },
    skip: (sayfa - 1) * limit,
    take: limit,
  })

  return NextResponse.json({ esnaflar })
}
