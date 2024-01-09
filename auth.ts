import NextAuth from 'next-auth'
import { Role } from '@prisma/client'
import { PrismaAdapter } from '@auth/prisma-adapter'

import authConfig from '@/auth.config'
import { getUserById } from '@/data/user'
import { prisma } from './lib/prisma'
// import { getTwoFactorConfirmationByUserId } from '@/data/two-factor-confirmation'
// import { getAccountByUserId } from './data/account'

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
  update,
} = NextAuth({
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  //   events: {
  //     async linkAccount({ user }) {
  //       await prisma.user.update({
  //         where: { id: user.id },
  //         // data: { emailVerified: new Date() },
  //       })
  //     },
  //   },
  callbacks: {
    async signIn({ user, account }) {
      // Allow OAuth without email verification
      if (account?.provider !== 'credentials') return true

      const existingUser = await getUserById(user.id)

      // Prevent sign in without email verification
      if (!existingUser?.isVerified) return false

      //   if (existingUser.isTwoFactorEnabled) {
      //     const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(
      //       existingUser.id
      //     )

      //     if (!twoFactorConfirmation) return false

      //     // Delete two factor confirmation for next sign in
      //     await prisma.twoFactorConfirmation.delete({
      //       where: { id: twoFactorConfirmation.id },
      //     })
      //   }

      return true
    },
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub
      }

      if (token.role && session.user) {
        session.user.role = token.role as Role
      }

      if (session.user) {
        session.user.isVerified = token.isVerified as boolean
      }

      if (session.user) {
        session.user.name = token.name
        session.user.phone = token.phone as string
        // session.user.isOAuth = token.isOAuth as boolean
      }

      return session
    },
    async jwt({ token, user }) {
      if (!token.sub) return token

      const existingUser = await getUserById(token.sub)

      if (!existingUser) return token

      //   const existingAccount = await getAccountByUserId(existingUser.id)

      //   token.isOAuth = !!existingAccount
      token.name = existingUser.name
      token.phone = existingUser.phone
      token.role = existingUser.role
      token.isVerified = existingUser.isVerified

      return token
    },
  },
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  ...authConfig,
})
