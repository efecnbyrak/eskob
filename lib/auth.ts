import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db'

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: 'E-posta', type: 'email' },
        sifre: { label: 'Şifre', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.sifre) return null

        const kullanici = await prisma.kullanici.findUnique({
          where: { email: credentials.email as string },
        })

        if (!kullanici) return null

        const eslesiyorMu = await bcrypt.compare(
          credentials.sifre as string,
          kullanici.sifreHash
        )

        if (!eslesiyorMu) return null

        return {
          id: kullanici.id.toString(),
          email: kullanici.email,
          name: `${kullanici.ad} ${kullanici.soyad}`,
          kullaniciAdi: kullanici.kullaniciAdi,
          rol: kullanici.rol,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        token.rol = (user as any).rol
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        token.kullaniciAdi = (user as any).kullaniciAdi
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(session.user as any).rol = token.rol as string
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(session.user as any).kullaniciAdi = token.kullaniciAdi as string | null
      }
      return session
    },
  },
  pages: {
    signIn: '/giris',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: process.env.AUTH_SECRET,
})

export function girisYoluByRol(rol: string): string {
  switch (rol) {
    case 'SUPER_ADMIN':
    case 'ADMIN':
      return '/phyberk/admin'
    case 'BUSINESS':
      return '/panel'
    default:
      return '/'
  }
}
