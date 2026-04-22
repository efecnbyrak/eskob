import { clsx, type ClassValue } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function formatFiyat(fiyat: number | string): string {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 0,
  }).format(Number(fiyat))
}

export function formatTarih(tarih: Date | string): string {
  return new Intl.DateTimeFormat('tr-TR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(tarih))
}

export function formatSure(dakika: number): string {
  if (dakika < 60) return `${dakika} dk`
  const saat = Math.floor(dakika / 60)
  const kalan = dakika % 60
  if (kalan === 0) return `${saat} saat`
  return `${saat} saat ${kalan} dk`
}

export function telefonMaskele(deger: string): string {
  const sadece = deger.replace(/\D/g, '')
  if (sadece.startsWith('90')) {
    const numara = sadece.slice(2)
    return formatTelefon(numara)
  }
  if (sadece.startsWith('0')) {
    return formatTelefon(sadece.slice(1))
  }
  return formatTelefon(sadece)
}

function formatTelefon(numara: string): string {
  if (numara.length <= 3) return `+90 ${numara}`
  if (numara.length <= 6) return `+90 ${numara.slice(0, 3)} ${numara.slice(3)}`
  if (numara.length <= 8) return `+90 ${numara.slice(0, 3)} ${numara.slice(3, 6)} ${numara.slice(6)}`
  return `+90 ${numara.slice(0, 3)} ${numara.slice(3, 6)} ${numara.slice(6, 8)} ${numara.slice(8, 10)}`
}
