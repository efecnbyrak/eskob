import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const session = await auth()
  const rol = (session?.user as { rol?: string } | undefined)?.rol
  if (!session || (rol !== 'SUPER_ADMIN' && rol !== 'ADMIN')) {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 })
  }

  const { esnafId } = await req.json()
  await prisma.esnaf.update({
    where: { id: esnafId },
    data: { onaylı: true },
  })

  return NextResponse.json({ ok: true })
}
