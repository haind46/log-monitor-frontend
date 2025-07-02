import { NextAuthOptions } from 'next-auth'
import { emailpassProvider } from './emailpassProvider';

export const authOptions: NextAuthOptions = {
  providers: [
    emailpassProvider
  ],
  callbacks: {
    async redirect({ url, baseUrl }) {
      return baseUrl
    },
    async jwt({ token, account , user, profile}) {
      if (user) {

        token.access_token = (user as any).access_token
        token.expires_in = (user as any).expires_in
        token.refreshToken = (user as any).refresh_token
        token.refresh_expires_in = (user as any).refresh_expires_in
      }

      return token
    },
    async session({ session, token }: any) {

      session.access_token = token.access_token as string

      session.tokenData = {
        ...token,
      }

      return session
    },
  },
}
