import httpStatus from 'http-status';
import { z } from 'zod'; // Import Zod for validation
import { publicProcedure, router } from '@/server/trpc';
import User from '@/server/db/models/user';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'; // Import JWT for token generation
import { authValidation } from './auth.validation';
import { generateTokenAndSendMail } from '@/utils/helpers/generateToken';
import { ApiError } from '@/lib/exceptions';

export const authRouter = router({
  signup: publicProcedure
    .input(authValidation.signupSchema)
    .mutation(async ({ input }) => {
      const { email, password, firstName, lastName, profile } = input;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error('User already exists');
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
        email,
        password: hashedPassword,
        firstName,
        lastName,
        profile,
      });

      await newUser.save();

      await generateTokenAndSendMail(
        newUser,
        'New Account Registration - Skattepluss'
      );

      return {
        message: 'User registered successfully, please verify your email.',
        status: 200,
        user: newUser,
      };
    }),
  forgotPassword: publicProcedure
    .input(
      z.object({
        email: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { email } = input;

      const user = await User.findOne({ email: email });
      if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
      }

      await generateTokenAndSendMail(user, 'Password Reset');
      return {
        message:
          'Password reset link has been sent to your email. Please check.',
        status: 200,
      };
    }),
  verifyEmail: publicProcedure
    .input(
      z.object({
        token: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { token } = input;

      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
        id: string;
      };

      const user = await User.findById(decoded.id);
      if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
      }

      if (user.isVerified) {
        return {
          message: 'User is already verified.',
          alreadyVerified: true,
          status: 200,
        };
      }

      user.isVerified = true;
      await user.save();

      return {
        message: 'Email verified successfully.',
        status: 200,
        alreadyVerified: false,
        data: user,
      };
    }),
  resetPassword: publicProcedure
    .input(
      z.object({
        token: z.string(),
        password: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { token, password } = input;

      let decoded;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
          id: string;
        };
      } catch (error) {
        throw new ApiError(
          httpStatus.UNAUTHORIZED,
          `Invalid or expired token:${error}`
        );
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const updatedUser = await User.findByIdAndUpdate(
        decoded.id,
        { password: hashedPassword },
        { new: true }
      );

      if (!updatedUser) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
      }

      return {
        message: 'Password has been changed successfully',
        status: 200,
        data: updatedUser,
      };
    }),
});
