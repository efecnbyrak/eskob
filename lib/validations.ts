import { z } from 'zod'
import { KUFUR_LISTESI } from './constants'

function kufurKontrol(deger: string): boolean {
  const kucuk = deger.toLowerCase()
  return !KUFUR_LISTESI.some((k) => kucuk.includes(k))
}

export const kayitSchema = z.object({
  ad: z
    .string()
    .min(2, 'En az 2 karakter')
    .regex(/^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$/, 'Sadece harf girilebilir'),
  soyad: z
    .string()
    .min(2, 'En az 2 karakter')
    .regex(/^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$/, 'Sadece harf girilebilir'),
  email: z
    .string()
    .email('Geçersiz e-posta')
    .refine(
      (e) => e.endsWith('@gmail.com') || e.endsWith('@hotmail.com'),
      'Sadece Gmail veya Hotmail adresi kabul edilir'
    ),
  telefon: z.string().min(10, 'Geçerli telefon numarası giriniz'),
  sifre: z
    .string()
    .min(6, 'En az 6 karakter')
    .regex(/[A-Z]/, 'En az 1 büyük harf olmalı')
    .regex(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, 'En az 1 sembol olmalı'),
  kullaniciAdi: z
    .string()
    .min(3, 'En az 3 karakter')
    .regex(/^[a-zA-Z0-9]+$/, 'Sadece harf ve rakam')
    .regex(/[a-zA-Z]/, 'En az 1 harf zorunlu')
    .refine(kufurKontrol, 'Geçersiz kullanıcı adı'),
  dogumTarihi: z.string().optional(),
  ilce: z.string().optional(),
})

export const girisSchema = z.object({
  email: z.string().email('Geçersiz e-posta'),
  sifre: z.string().min(1, 'Şifre zorunlu'),
  beniHatirla: z.boolean().optional(),
})

export const esnafKayitSchema = z.object({
  isletmeAdi: z.string().min(2, 'En az 2 karakter'),
  kategoriId: z.number().int().positive('Kategori seçiniz'),
  sehir: z.string().min(2, 'Şehir zorunlu'),
  ilce: z.string().min(2, 'İlçe zorunlu'),
  telefon: z.string().optional(),
  aciklama: z.string().optional(),
})
