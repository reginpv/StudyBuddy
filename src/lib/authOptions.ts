import { compare } from 'bcrypt'
import { type NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import prisma from '@/lib/prisma'
import { email } from 'zod'

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
    maxAge: 1 * 24 * 60 * 60, // 1 days
  },
  pages: {
    signIn: '/login',
  },
  providers: [
    CredentialsProvider({
      name: 'Signin',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
        },
        password: {
          label: 'Password',
          type: 'password',
        },
      },
      async authorize(credentials): Promise<any> {
        // Check creds
        if (!credentials?.email || !credentials.password) {
          return null
        }

        // Check if user exist
        const user = await prisma.user.findFirst({
          where: {
            email: credentials.email,
          },
        })

        // Not found
        if (!user) {
          return null
        }

        // If user check password
        const isPasswordValid = await compare(
          credentials.password,
          user.password + ''
        )

        // Password failed
        if (!isPasswordValid) {
          return null
        }

        // If password valied
        // Success
        await prisma.user.update({
          where: {
            email: credentials.email,
          },
          data: {
            lastLogin: new Date().toISOString(),
          },
        })

        return {
          id: user.id.toString(),
          name: user.name,
          email: user.email,
        }

        //
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },
}
