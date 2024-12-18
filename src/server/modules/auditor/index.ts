import httpStatus from 'http-status';
import { protectedProcedure } from '@/server/middlewares/with-auth';
import { router } from '@/server/trpc';
import { JwtPayload } from 'jsonwebtoken';
import { ApiResponse } from '@/server/db/types';
import { errorHandler } from '@/server/middlewares/error-handler';
import { ApiError } from '@/lib/exceptions';
import { auditorValidation } from './auditor.validation';
import AuditorModel from '@/server/db/models/auditor';
import User from '@/server/db/models/user';
import jwt from 'jsonwebtoken';
import { AUDITOR_VERIFY_EMAIL_TEMPLATE } from '@/server/services/mail/constants';
import sendEmail from '@/server/services/mail/sendMail';

export const auditorRouter = router({
  inviteAuditor: protectedProcedure
    .input(auditorValidation.auditorSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const { auditor_email, message } = input;

        const sessionUser = ctx.user as JwtPayload;

        if (!sessionUser || !sessionUser?.email) {
          throw new Error('You must be logged in to update this data.');
        }

        const isEmailExist = await User.findOne({ email: auditor_email });

        if (isEmailExist) {
          throw new ApiError(
            httpStatus.BAD_REQUEST,
            'A user with this email address already exists.'
          );
        }

        // Generate JWT token for email verification
        const token = jwt.sign(
          { email: auditor_email, role: 'auditor' }, // Payload (user info)
          process.env.JWT_SECRET as string, // JWT secret from env
          { expiresIn: '1h' } // Token expiration
        );

        // Send verification email with the token
        const emailSent = await sendEmail(
          [auditor_email],
          {
            subject: 'Email Verification',
            data: {
              invited_by: 'Customer name',
              message: message,
              token: `${process.env.CLIENT_URL}?token=${token}`,
            },
          }, // Pass token to template context
          AUDITOR_VERIFY_EMAIL_TEMPLATE
        );

        // Only proceed with user and auditor creation if email is sent successfully
        if (emailSent) {
          const user = await User.create({
            email: auditor_email,
            role: 'auditor',
            password: 'not set',
          });
          const auditor = await AuditorModel.create({
            customer: sessionUser.id,
            auditor: user._id,
          });

          return {
            message: 'Auditor is invited successfully',
            status: 200,
            data: auditor,
          } as ApiResponse<typeof auditor>;
        } else {
          throw new ApiError(
            httpStatus.INTERNAL_SERVER_ERROR,
            'Failed to send invitation email'
          );
        }
      } catch (error: unknown) {
        const { message } = errorHandler(error);
        throw new ApiError(httpStatus.NOT_FOUND, message);
      }
    }),
});
