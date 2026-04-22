import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  const kategoriler = await prisma.kategori.findMany({
    include: { tur: { select: { ad: true } } },
    orderBy: { sira: 'asc' },
  })
  return NextResponse.json(kategoriler)
}
