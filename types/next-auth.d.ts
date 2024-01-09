import { Image, Role } from '@prisma/client'
import NextAuth, { type DefaultSession } from 'next-auth'

export type ExtendedUser = DefaultSession['user'] & {
  role: Role
  phone: string
  isVerified: boolean
  image: Image
}

declare module 'next-auth' {
  interface Session {
    user: ExtendedUser
  }
}
