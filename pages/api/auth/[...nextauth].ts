import NextAuth, { NextAuthOptions } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import Facebook from 'next-auth/providers/facebook';
import Instagram from 'next-auth/providers/instagram';

import { db } from '../../../database';
import { User } from '../../../models';
import { dbUsers } from '../../../database';

export const nextAuthOptions: NextAuthOptions = {

  providers: [

    Credentials({
      name: 'Custom Login',
      credentials: {
        email: { label: 'Correo', type: 'email', placeholder: 'correo@google.com' },
        password: { label: 'Contraseña', type: 'password', placeholder: 'Contraseña' },
      },
      async authorize(credentials, req) {
        return await dbUsers.CheckUserEmailPassword(credentials!.email, credentials!.password);
      }
    }),

    Google({
      clientId: process.env.GOOGLE_ID || '',
      clientSecret: process.env.GOOGLE_SECRET || '',
    }),

    Facebook({
      clientId: process.env.FACEBOOK_ID || '',
      clientSecret: process.env.FACEBOOK_SECRET || '',
    }),

    Instagram({
      clientId: process.env.INSTAGRAM_ID || '',
      clientSecret: process.env.INSTAGRAM_SECRET || '',
    }),

  ],

  // Custom pages
  pages: {
    signIn: '/auth',
    newUser: '/auth'
  },

  session: {
    maxAge: 86400 * 7, // 7d
    strategy: 'jwt',
    // updateAge: 86400, // cada dia
  },

  jwt: {
    secret: process.env.JWT_SECRET_SEED,
  },

  callbacks: {

    async signIn({ user, account, profile, email, credentials }) {

      await db.connect();
      const userInfo = await User.findOne({ email: user.email! }).select('isAble').lean();
      await db.disconnect();

      if (!userInfo || !userInfo.isAble) return '/';

      return true;
    },

    async jwt({ token, account, user }) {
      if (account) {
        token.accessToken = account.access_token;

        switch (account.type) {
          case 'credentials':
            token.user = user;
            break;

          case 'oauth':
            token.user = await dbUsers.oAuthToDbUser(user?.email || '', user?.name || '');
            break;
        }
      }

      return token;
    },

    async session({ session, token, user }) {
      session.accessToken = token.accessToken as string;
      session.user = token.user as any;

      return session;
    },

  },

  secret: process.env.NEXTAUTH_SECRET,
}

export default NextAuth(nextAuthOptions);