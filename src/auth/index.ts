import NextAuth from 'next-auth';
import connectToDatabase from '@/server/config/mongoose';
import User from '@/server/db/models/user';
import AuditorModel from '@/server/db/models/auditor';
import { authConfig } from './config';

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        await connectToDatabase();
        try {
          const existingUser = await User.findOne({ email: user.email });
          if (!existingUser) {
            const newUser = new User({
              email: user.email,
              firstName: user.name,
              lastName: '',
              role: 'customer',
              provider: 'google',
              image: user?.image || '',
              isVerified: true,
            });
            await newUser.save();
          }
          return true;
        } catch (err) {
          console.error('Error saving user during Google sign-in', err);
          return false;
        }
      }

      if (account?.provider === 'credentials') {
        return true;
      }

      return false;
    },
    async jwt({ token, user, trigger, session }) {
      if (trigger === 'signIn' || (trigger === 'update' && session)) {
        const retrievedUser = await User.findOne({ email: user?.email });

        if (retrievedUser) {
          token.id = retrievedUser.id;

          if (retrievedUser.role === 'auditor') {
            const auditor = await AuditorModel.find({
              auditor: retrievedUser._id,
            }).populate('customer', 'firstName email');

            if (auditor && auditor.length > 0) {
              token.id = auditor[0].customer._id;
              token.audit_for = auditor[0].customer.firstName;
              token.customer_email = auditor[0].customer.email;
            }
          }

          token.email = retrievedUser.email;
          token.firstName = retrievedUser.firstName || user?.name;
          token.lastName = retrievedUser.lastName;
          token.role = retrievedUser.role || 'customer';
          token.hasAnswers = retrievedUser.isStepperSkippedOrCompleted;
          token.isSawInstructions = retrievedUser.isSawInstructions;
        }
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          id: token.id,
          role: token.role || 'customer',
          email: token.email as string,
          firstName: token.firstName || token.name || '',
          lastName: token.lastName || '',
          hasAnswers: token.hasAnswers || false,
          isSawInstructions:
            typeof token.isSawInstructions === 'boolean'
              ? token.isSawInstructions
              : false,
          audit_for: token.audit_for || '',
          customer_email: token.customer_email || '',
        },
      };
    },
  },
  ...authConfig,
});
