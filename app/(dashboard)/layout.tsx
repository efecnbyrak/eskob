import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { signOut } from 'next-auth/react'
import { DashboardNav } from '@/components/dashboard/DashboardNav'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session?.user) redirect('/giris')

  const rol = (session.user as { rol: string }).rol
  if (rol !== 'BUSINESS' && rol !== 'SUPER_ADMIN' && rol !== 'ADMIN') {
    redirect('/')
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardNav kullanici={{ isim: session.user.name || '', rol }} />
      <main className="flex-1 p-6 md:ml-56">{children}</main>
    </div>
  )
}
