import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db'
import { kayitSchema } from '@/lib/validations'
import { slugOlustur } from '@/lib/slug'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { tur, isletmeAdi, kategoriId, esnafSehir, esnafIlce, ...rest } = body

    const parsed = kayitSchema.safeParse(rest)
    if (!parsed.success) {
      const ilkHata = parsed.error.issues[0]?.message || 'Geçersiz veri'
      return NextResponse.json({ error: ilkHata }, { status: 400 })
    }

    const { ad, soyad, email, telefon, sifre, kullaniciAdi, dogumTarihi, ilce } = parsed.data
    const ilgiAlanlari: string[] = body.ilgiAlanlari || []

    // Benzersizlik kontrolü
    const mevcutEmail = await prisma.kullanici.findUnique({ where: { email } })
    if (mevcutEmail) return NextResponse.json({ error: 'Bu e-posta zaten kayıtlı.' }, { status: 409 })

    if (kullaniciAdi) {
      const mevcutAdi = await prisma.kullanici.findUnique({ where: { kullaniciAdi } })
      if (mevcutAdi) return NextResponse.json({ error: 'Bu kullanıcı adı alınmış.' }, { status: 409 })
    }

    const sifreHash = await bcrypt.hash(sifre, 12)

    const kullanici = await prisma.kullanici.create({
      data: {
        ad,
        soyad,
        email,
        telefon: telefon || null,
        sifreHash,
        kullaniciAdi: kullaniciAdi || null,
        dogumTarihi: dogumTarihi ? new Date(dogumTarihi) : null,
        adres: ilce ? `İstanbul, ${ilce}` : null,
        ilgiAlanlari: ilgiAlanlari || [],
        rol: tur === 'business' ? 'BUSINESS' : 'USER',
      },
    })

    // İşletme kaydı
    if (tur === 'business' && isletmeAdi && kategoriId && esnafSehir && esnafIlce) {
      let slug = slugOlustur(isletmeAdi)
      const mevcut = await prisma.esnaf.findUnique({ where: { slug } })
      if (mevcut) slug = `${slug}-${kullanici.id}`

      await prisma.esnaf.create({
        data: {
          slug,
          isletmeAdi,
          kategoriId: parseInt(kategoriId),
          sehir: esnafSehir,
          ilce: esnafIlce,
          kullaniciId: kullanici.id,
        },
      })
    }

    return NextResponse.json({ ok: true }, { status: 201 })
  } catch (err) {
    console.error('Kayıt hatası:', err)
    return NextResponse.json({ error: 'Sunucu hatası.' }, { status: 500 })
  }
}
