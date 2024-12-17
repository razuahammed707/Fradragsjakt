import httpStatus from 'http-status';
import { protectedProcedure } from '@/server/middlewares/with-auth';
import { router } from '@/server/trpc';
import { JwtPayload } from 'jsonwebtoken';
import { ApiResponse } from '@/server/db/types';
import { errorHandler } from '@/server/middlewares/error-handler';
import { ApiError } from '@/lib/exceptions';
import { auditorValidation } from './auditor.validation';
import AuditorModel from '@/server/db/models/auditor';

export const auditorRouter = router({
  inviteAuditor: protectedProcedure
    .input(auditorValidation.auditorSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const { customer } = input;

        const sessionUser = ctx.user as JwtPayload;

        if (!sessionUser || !sessionUser?.email) {
          throw new Error('You must be logged in to update this data.');
        }

        const auditor = await AuditorModel.findOne({ customer: customer });
        return {
          message: 'Auditor is invited successfully',
          status: 200,
          data: auditor,
        } as ApiResponse<typeof auditor>;
      } catch (error: unknown) {
        const { message } = errorHandler(error);
        throw new ApiError(httpStatus.NOT_FOUND, message);
      }
    }),
});
