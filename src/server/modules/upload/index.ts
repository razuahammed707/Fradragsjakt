import { protectedProcedure } from '@/server/middlewares/with-auth';
import { router } from '@/server/trpc';
import httpStatus from 'http-status';
import { ApiError } from '@/lib/exceptions';
import { errorHandler } from '@/server/middlewares/error-handler';
import cloudinary from '@/server/config/cloudinary';
import { uploadFileValidation } from './upload.validation';

export const uploadRouter = router({
  uploadFile: protectedProcedure
    .input(uploadFileValidation.uploadFileSchema)
    .mutation(async ({ input }) => {
      try {
        const { base64File, folder, fileName, fileType } = input;
        const fileExtension = fileType.split('/').pop() ?? 'jpeg';

        // Upload to Cloudinary
        const uploadResult = await cloudinary.uploader.upload(base64File, {
          folder: folder || 'images',
          public_id: fileName.split('.')[0], // Remove extension from public_id
          resource_type: 'auto',
          format: fileExtension,
        });

        if (!uploadResult) {
          throw new ApiError(
            httpStatus.INTERNAL_SERVER_ERROR,
            'Something went wrong uploading file'
          );
        }

        return {
          success: true,
          message: 'File uploaded successfully',
          data: uploadResult.secure_url,
        };
      } catch (error: unknown) {
        const { message } = errorHandler(error);
        throw new ApiError(httpStatus.BAD_REQUEST, message);
      }
    }),
});
