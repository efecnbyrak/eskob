import 'dotenv/config'
import { PrismaClient } from '../app/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import bcrypt from 'bcryptjs'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  // SUPER_ADMIN kullanıcısı
  const sifreHash = await bcrypt.hash('phyberk123', 12)
  await prisma.kullanici.upsert({
    where: { email: 'phyberk123@gmail.com' },
    update: {},
    create: {
      email: 'phyberk123@gmail.com',
      kullaniciAdi: 'phyberk',
      sifreHash,
      ad: 'Admin',
      soyad: 'ESKOB',
      rol: 'SUPER_ADMIN',
      emailOnay: true,
    },
  })

  // Türler
  const turler = [
    { ad: 'Hizmet', slug: 'hizmet', ikon: '🛠️', renk: '#F97316', sira: 1 },
    { ad: 'Sağlık', slug: 'saglik', ikon: '🏥', renk: '#EF4444', sira: 2 },
    { ad: 'Yemek & İçecek', slug: 'yemek-icecek', ikon: '🍽️', renk: '#F59E0B', sira: 3 },
    { ad: 'Eğitim', slug: 'egitim', ikon: '📚', renk: '#3B82F6', sira: 4 },
    { ad: 'Spor & Aktivite', slug: 'spor-aktivite', ikon: '⚽', renk: '#10B981', sira: 5 },
    { ad: 'Profesyonel Hizmetler', slug: 'profesyonel', ikon: '💼', renk: '#8B5CF6', sira: 6 },
    { ad: 'Eğlence', slug: 'eglence', ikon: '🎮', renk: '#EC4899', sira: 7 },
  ]

  for (const tur of turler) {
    await prisma.tur.upsert({
      where: { slug: tur.slug },
      update: {},
      create: tur,
    })
  }

  const hizmetTur = await prisma.tur.findUnique({ where: { slug: 'hizmet' } })
  const saglikTur = await prisma.tur.findUnique({ where: { slug: 'saglik' } })
  const yemekTur = await prisma.tur.findUnique({ where: { slug: 'yemek-icecek' } })
  const sporTur = await prisma.tur.findUnique({ where: { slug: 'spor-aktivite' } })
  const eglenceTur = await prisma.tur.findUnique({ where: { slug: 'eglence' } })
  const saglikTurId = saglikTur?.id
  const yemekTurId = yemekTur?.id

  // Kategoriler
  const kategoriler = [
    { ad: 'Berber', slug: 'berber', ikon: '💈', renk: '#F97316', sira: 1, turId: hizmetTur?.id },
    { ad: 'Güzellik Salonu', slug: 'guzellik-salonu', ikon: '💄', renk: '#EC4899', sira: 2, turId: hizmetTur?.id },
    { ad: 'Tamirci', slug: 'tamirci', ikon: '🔧', renk: '#6B7280', sira: 3, turId: hizmetTur?.id },
    { ad: 'Temizlik', slug: 'temizlik', ikon: '🧹', renk: '#3B82F6', sira: 4, turId: hizmetTur?.id },
    { ad: 'Fotoğraf & Video', slug: 'fotograf-video', ikon: '📷', renk: '#8B5CF6', sira: 5, turId: hizmetTur?.id },
    { ad: 'Ev Yemekleri', slug: 'ev-yemekleri', ikon: '🍲', renk: '#F59E0B', sira: 1, turId: yemekTurId },
    { ad: 'Kafe & Pastane', slug: 'kafe-pastane', ikon: '☕', renk: '#92400E', sira: 2, turId: yemekTurId },
    { ad: 'Restoran', slug: 'restoran', ikon: '🍽️', renk: '#EF4444', sira: 3, turId: yemekTurId },
    { ad: 'Diş Kliniği', slug: 'dis-klinigi', ikon: '🦷', renk: '#EF4444', sira: 1, turId: saglikTurId },
    { ad: 'Psikolog', slug: 'psikolog', ikon: '🧠', renk: '#8B5CF6', sira: 2, turId: saglikTurId },
    { ad: 'Spor Salonu', slug: 'spor-salonu', ikon: '🏋️', renk: '#10B981', sira: 1, turId: sporTur?.id },
    { ad: 'Yoga & Pilates', slug: 'yoga-pilates', ikon: '🧘', renk: '#F59E0B', sira: 2, turId: sporTur?.id },
    { ad: 'Bilardo & Oyun', slug: 'bilardo-oyun', ikon: '🎱', renk: '#1F2937', sira: 1, turId: eglenceTur?.id },
    { ad: 'Sinema & Tiyatro', slug: 'sinema-tiyatro', ikon: '🎭', renk: '#7C3AED', sira: 2, turId: eglenceTur?.id },
  ]

  for (const kat of kategoriler) {
    await prisma.kategori.upsert({
      where: { slug: kat.slug },
      update: {},
      create: kat,
    })
  }

  // Demo esnaflar
  const berber = await prisma.kategori.findUnique({ where: { slug: 'berber' } })
  const evYemek = await prisma.kategori.findUnique({ where: { slug: 'ev-yemekleri' } })
  const sporSalonu = await prisma.kategori.findUnique({ where: { slug: 'spor-salonu' } })
  const guzellik = await prisma.kategori.findUnique({ where: { slug: 'guzellik-salonu' } })
  const bilardo = await prisma.kategori.findUnique({ where: { slug: 'bilardo-oyun' } })

  const demoEsnaflar = [
    {
      slug: 'ozkan-erkek-kuaforu',
      isletmeAdi: 'Özkan Erkek Kuaförü',
      aciklama: 'Profesyonel erkek kuaförü hizmetleri. Saç, sakal ve bakım.',
      sehir: 'İstanbul',
      ilce: 'Kadıköy',
      telefon: '05321234567',
      whatsapp: '905321234567',
      aktif: true,
      onaylı: true,
      kategoriId: berber!.id,
    },
    {
      slug: 'lezzet-duragi-ev-yemekleri',
      isletmeAdi: 'Lezzet Durağı Ev Yemekleri',
      aciklama: 'Günlük taze ev yemekleri, paket servis ve catering.',
      sehir: 'Ankara',
      ilce: 'Çankaya',
      telefon: '05329876543',
      aktif: true,
      onaylı: true,
      kategoriId: evYemek!.id,
    },
    {
      slug: 'fit-life-spor-merkezi',
      isletmeAdi: 'Fit Life Spor Merkezi',
      aciklama: 'Modern ekipmanlarla fitness, kardio ve grup dersleri.',
      sehir: 'Antalya',
      ilce: 'Muratpaşa',
      telefon: '05355551234',
      aktif: true,
      onaylı: true,
      kategoriId: sporSalonu!.id,
    },
    {
      slug: 'guzellik-kosesi-bakim-merkezi',
      isletmeAdi: 'Güzellik Köşesi Bakım Merkezi',
      aciklama: 'Cilt bakımı, manikür, pedikür ve epilasyon hizmetleri.',
      sehir: 'İzmir',
      ilce: 'Bornova',
      telefon: '05329991111',
      aktif: true,
      onaylı: true,
      kategoriId: guzellik!.id,
    },
    {
      slug: 'bilardo-47-eglence-merkezi',
      isletmeAdi: 'Bilardo 47 Eğlence Merkezi',
      aciklama: '15 masa ile bilardo, snooker ve dart alanı.',
      sehir: 'İstanbul',
      ilce: 'Beşiktaş',
      telefon: '05381112222',
      aktif: true,
      onaylı: true,
      kategoriId: bilardo!.id,
    },
  ]

  for (const demo of demoEsnaflar) {
    const existing = await prisma.esnaf.findUnique({ where: { slug: demo.slug } })
    if (!existing) {
      // Demo kullanıcı oluştur
      const demoHash = await bcrypt.hash('demo123456', 10)
      const demoKullanici = await prisma.kullanici.create({
        data: {
          email: `${demo.slug}@demo.eskob.com`,
          kullaniciAdi: demo.slug,
          sifreHash: demoHash,
          ad: demo.isletmeAdi,
          soyad: 'Demo',
          rol: 'BUSINESS',
          emailOnay: true,
        },
      })
      await prisma.esnaf.create({
        data: { ...demo, kullaniciId: demoKullanici.id },
      })
    }
  }

  console.log('✅ Seed tamamlandı')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
