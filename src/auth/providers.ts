import bcrypt from 'bcrypt';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import connectToDatabase from '@/server/config/mongoose';
import User from '@/server/db/models/user';

export const CredentialsProvider = Credentials({
  async authorize(credentials) {
    if (!credentials?.email || !credentials?.password) {
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
        credentials.password as string,
        user.password
      );
      if (isPasswordCorrect) {
        return user;
      }
    }
    return null;
  },
});

export const GoogleProvider = Google({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
});
