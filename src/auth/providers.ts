import bcrypt from 'bcrypt';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import connectToDatabase from '@/server/config/mongoose';
import User from '@/server/db/models/user';
import { ApiError } from '@/lib/exceptions';
import httpStatus from 'http-status';
import { errorHandler } from '@/server/middlewares/error-handler';

export const CredentialsProvider = Credentials({
  async authorize(credentials) {
    try {
      if (!credentials?.email || !credentials?.password) {
        throw new Error('Invalid credentials');
      }

      await connectToDatabase();
      const user = await User.findOne({ email: credentials.email });

      if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
      }

      if (user && !user?.isVerified) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          'Please verify your email first!'
        );
      }

      if (user) {
        const isPasswordCorrect = await bcrypt.compare(
          credentials.password as string,
          user.password
        );
        if (!isPasswordCorrect) {
          throw new Error('Invalid email or password. Please try again.');
        }
        if (isPasswordCorrect) {
          return user;
        }
      }
      return null;
    } catch (error) {
      const { message } = errorHandler(error);
      console.log('message from credentials', message);
      throw new ApiError(httpStatus.NOT_FOUND, message);
    }
  },
});

export const GoogleProvider = Google({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
});
