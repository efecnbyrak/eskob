'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function FavoriButonu({ esnafId }: { esnafId: number }) {
  const [favoriMi, setFavoriMi] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleTikla = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    setLoading(true)
    try {
      if (favoriMi) {
        const res = await fetch(`/api/user/favori?esnafId=${esnafId}`, { method: 'DELETE' })
        if (res.ok) {
          setFavoriMi(false)
        } else if (res.status === 401) {
          router.push('/giris')
        }
      } else {
        const res = await fetch('/api/user/favori', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ esnafId })
        })
        if (res.ok) {
          setFavoriMi(true)
        } else if (res.status === 401) {
          router.push('/giris')
        }
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleTikla}
      disabled={loading}
      className={`flex items-center justify-center w-8 h-8 rounded-full bg-white/90 backdrop-blur shadow-sm transition-all duration-300 hover:scale-110 active:scale-95 ${
        favoriMi ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-red-400'
      }`}
      style={{ zIndex: 20 }}
      aria-label="Favorilere Ekle"
    >
      <svg className="w-5 h-5 pointer-events-none transition-transform" fill={favoriMi ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={favoriMi ? 1 : 2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    </button>
  )
}
