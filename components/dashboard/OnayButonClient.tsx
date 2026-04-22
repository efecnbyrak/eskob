'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function OnayButonClient({ esnafId }: { esnafId: number }) {
  const [yukleniyor, setYukleniyor] = useState(false)
  const router = useRouter()

  async function onayla() {
    setYukleniyor(true)
    try {
      await fetch('/api/admin/esnaf-onayla', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ esnafId }),
      })
      router.refresh()
    } finally {
      setYukleniyor(false)
    }
  }

  return (
    <button
      onClick={onayla}
      disabled={yukleniyor}
      className="text-sm bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-600 transition-colors disabled:opacity-60"
    >
      {yukleniyor ? '...' : 'Onayla'}
    </button>
  )
}
