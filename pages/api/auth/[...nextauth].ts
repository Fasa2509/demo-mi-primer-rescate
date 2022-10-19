import NextAuth, { NextAuthOptions } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'
import Facebook from 'next-auth/providers/facebook'
import Instagram from 'next-auth/providers/instagram'
import GitHub from 'next-auth/providers/github'
import { dbUsers } from '../../../database'

export const nextAuthOptions: NextAuthOptions = {

  providers: [
      
    Credentials({
      name: 'Custom Login',
      credentials: {
        email: { label: 'Correo', type: 'email', placeholder: 'correo@google.com' },
        password: { label: 'Contraseña', type: 'password', placeholder: 'Contraseña' },
      },
      async authorize( credentials ) {
        // console.log(credentials)
        return await dbUsers.CheckUserEmailPassword( credentials!.email, credentials!.password );
      }
    }),

    GitHub({
      clientId: process.env.GITHUB_ID || '',
      clientSecret: process.env.GITHUB_SECRET || '',
    })

    // Google({
    //   clientId: process.env.GOOGLE_ID || '',
    //   clientSecret: process.env.GOOGLE_SECRET || '',
    // }),

    // Facebook({
    //   clientId: process.env.FACEBOOK_ID || '',
    //   clientSecret: process.env.FACEBOOK_SECRET || '',
    // }),

    // Instagram({
    //   clientId: process.env.INSTAGRAM_ID || '',
    //   clientSecret: process.env.INSTAGRAM_SECRET || '',
    // }),

  ],

  // Custom pages
  pages: {
    signIn: '/auth',
    newUser: '/auth'
  },

  session: {
    maxAge: 604800, // 7d
    strategy: 'jwt',
    // updateAge: 86400, // cada dia
  },

  callbacks: {

    async jwt({ token, account, user }) {
      if ( account ) {
        token.accessToken = account.access_token;

        switch( account.type ) {
          case 'credentials':
            token.user = user
            break

          case 'oauth':
            token.user = await dbUsers.oAuthToDbUser( user?.email || '', user?.name || '' )
            break
        }
      }

      return token;
    },

    async session({ session, token, user }) {

      session.accessToken = token.accessToken;
      session.user = token.user as any;

      return session;
    },

  },

  secret: process.env.NEXT_PUBLIC_SECRET,
}

export default NextAuth(nextAuthOptions);