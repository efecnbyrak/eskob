import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ favoriler: [] })

  const favoriler = await prisma.favori.findMany({
    where: { kullaniciId: parseInt(session.user.id) },
    include: {
      esnaf: {
        include: { kategori: true },
      },
    },
    orderBy: { olusturmaT: 'desc' },
  })

  return NextResponse.json({ favoriler })
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Giriş gerekli' }, { status: 401 })

  const { esnafId } = await req.json()
  if (!esnafId) return NextResponse.json({ error: 'Geçersiz istek' }, { status: 400 })

  const mevcut = await prisma.favori.findUnique({
    where: { kullaniciId_esnafId: { kullaniciId: parseInt(session.user.id), esnafId } },
  })

  if (mevcut) return NextResponse.json({ ok: true })

  await prisma.favori.create({
    data: { kullaniciId: parseInt(session.user.id), esnafId },
  })

  return NextResponse.json({ ok: true })
}

export async function DELETE(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Giriş gerekli' }, { status: 401 })

  const esnafId = parseInt(req.nextUrl.searchParams.get('esnafId') || '0')
  if (!esnafId) return NextResponse.json({ error: 'Geçersiz istek' }, { status: 400 })

  await prisma.favori.deleteMany({
    where: { kullaniciId: parseInt(session.user.id), esnafId },
  })

  return NextResponse.json({ ok: true })
}
