import { AuthOptions } from 'next-auth';
import bcrypt from 'bcrypt';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import connectToDatabase from '@/server/config/mongoose';
import User from '@/server/db/models/user';

declare module 'next-auth' {
  interface User {
    id: string;
    role: string;
    firstName: string;
    lastName: string;
    hasAnswers: boolean;
    audit_for?: string;
    customer_email?: string;
  }

  interface Session {
    user: User;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role?: string;
    firstName?: string;
    lastName?: string;
    hasAnswers?: boolean;
    audit_for?: string;
    customer_email?: string;
    name?: string;
  }
}

export const authOptions: AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials || !credentials.email || !credentials.password) {
          throw new Error('Invalid credentials');
        }
        await connectToDatabase();
        const user = await User.findOne({ email: credentials.email });

        if (!user) {
          throw new Error('User not found');
        }
        if (user && !user?.isVerified) {
          throw new Error('Please verify your email first!');
        }

        if (user) {
          if (credentials.password === user.password) {
            return user;
          }
          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (isPasswordCorrect) {
            return user;
          }
        }
        return null;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),
  ],

  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60, // Add update age to reduce token updates
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        await connectToDatabase();
        const existingUser = await User.findOne({ email: user.email });
        if (!existingUser) {
          await User.create({
            email: user.email,
            firstName: user.name,
            lastName: user.name,
            role: 'customer',
            provider: 'google',
            image: user?.image || '',
            isVerified: true,
          });
        }
        return true;
      }
      return account?.provider === 'credentials';
    },
    async jwt({ token, user }) {
      if (user) {
        await connectToDatabase();
        // Combine queries into a single aggregation pipeline
        const [userInfo] = await User.aggregate([
          { $match: { email: user.email } },
          {
            $lookup: {
              from: 'auditors',
              let: { userId: '$_id' },
              pipeline: [
                { $match: { $expr: { $eq: ['$auditor', '$$userId'] } } },
                {
                  $lookup: {
                    from: 'users',
                    localField: 'customer',
                    foreignField: '_id',
                    as: 'customerInfo',
                  },
                },
                { $unwind: '$customerInfo' },
              ],
              as: 'auditorInfo',
            },
          },
        ]);

        if (userInfo) {
          token.id = userInfo._id;
          token.email = userInfo.email;
          token.firstName = userInfo.firstName || user.name;
          token.lastName = userInfo.lastName;
          token.role = userInfo.role || 'customer';
          token.hasAnswers = userInfo.questionnaires?.length > 0;

          if (userInfo.role === 'auditor' && userInfo.auditorInfo?.[0]) {
            const customerInfo = userInfo.auditorInfo[0].customerInfo;
            token.id = customerInfo._id;
            token.audit_for = customerInfo.firstName;
            token.customer_email = customerInfo.email;
          }
        }
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.id,
        role: token.role || 'customer',
        email: token.email as string,
        firstName: token.firstName || token.name || '',
        lastName: token.lastName || '',
        hasAnswers: token.hasAnswers || false,
        audit_for: token.audit_for || '',
        customer_email: token.customer_email || '',
      };

      console.log('session', session);
      return session;
    },
  },
};
