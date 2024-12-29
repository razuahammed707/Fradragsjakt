import {
  PASSWORD_RESET,
  VERIFY_EMAIL_TEMPLATE,
} from '@/server/services/mail/constants';
import sendEmail from '@/server/services/mail/sendMail';
import jwt from 'jsonwebtoken';

export const generateTokenAndSendMail = async (
  user: {
    _id: string;
    email: string;
    role: string;
    firstName: string;
  },
  templateFor: string
) => {
  try {
    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role }, // Payload (user info)
      process.env.JWT_SECRET as string, // JWT secret from env
      { expiresIn: '24h' } // Token expiration
    );

    // Determine the appropriate email template
    const emailTemplate =
      templateFor === 'Password Reset' ? PASSWORD_RESET : VERIFY_EMAIL_TEMPLATE;

    // Construct the verification/reset URL
    const url = `${process.env.CLIENT_URL}?token=${encodeURIComponent(token)}`;

    // Send email
    sendEmail(
      [user.email],
      {
        subject:
          templateFor === 'Password Reset'
            ? 'Password Reset - Skattepluss'
            : 'New Account Registration - Skattepluss',
        data: {
          firstName: user.firstName,
          token: url,
        },
      },
      emailTemplate
    );
  } catch (error) {
    console.error('Error generating token or sending email:', error);
    throw new Error('Failed to send email. Please try again later.');
  }
};
