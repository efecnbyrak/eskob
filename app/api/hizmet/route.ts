import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'

async function getEsnafBySession(userId: string | undefined) {
  if (!userId) return null
  return prisma.esnaf.findUnique({ where: { kullaniciId: parseInt(userId) } })
}

export async function GET(req: NextRequest) {
  const session = await auth()
  const esnaf = await getEsnafBySession(session?.user?.id)
  if (!esnaf) return NextResponse.json({ hizmetler: [] })

  const hizmetler = await prisma.hizmet.findMany({
    where: { esnafId: esnaf.id },
    orderBy: { sira: 'asc' },
  })

  return NextResponse.json({ hizmetler })
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Giriş gerekli' }, { status: 401 })

  const esnaf = await getEsnafBySession(session?.user?.id)
  if (!esnaf) return NextResponse.json({ error: 'İşletme bulunamadı' }, { status: 404 })

  const body = await req.json()
  const { ad, aciklama, fiyat, sure, kategori } = body

  if (!ad || fiyat === undefined) {
    return NextResponse.json({ error: 'Ad ve fiyat zorunlu' }, { status: 400 })
  }

  const hizmet = await prisma.hizmet.create({
    data: {
      ad,
      aciklama: aciklama || null,
      fiyat,
      sure: sure || null,
      kategori: kategori || null,
      esnafId: esnaf.id,
    },
  })

  return NextResponse.json({ hizmet }, { status: 201 })
}

export async function PUT(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Giriş gerekli' }, { status: 401 })

  const body = await req.json()
  const { id, ...data } = body

  const hizmet = await prisma.hizmet.update({
    where: { id },
    data,
  })

  return NextResponse.json({ hizmet })
}

export async function DELETE(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Giriş gerekli' }, { status: 401 })

  const id = parseInt(req.nextUrl.searchParams.get('id') || '0')
  await prisma.hizmet.delete({ where: { id } })

  return NextResponse.json({ ok: true })
}
