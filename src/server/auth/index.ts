import { z } from "zod"; // Import Zod for validation
import { publicProcedure, router } from "@/server/trpc";
import User from "@/server/db/models/user";
import bcrypt from "bcrypt";
import sendEmail from "../services/mail/sendMail";
import { VERIFY_EMAIL_TEMPLATE } from "../services/mail/constants";
import jwt from "jsonwebtoken"; // Import JWT for token generation

const signupSchema = z.object({
  email: z.string().email(), // Validate email format
  password: z.string().min(6), // Validate password length
  firstName: z.string().min(1), // Validate first name
  lastName: z.string().min(1), // Validate last name
  role: z.string(),
});

export const authRouter = router({
  // Sign Up Procedure
  signup: publicProcedure
    .input(signupSchema) // Validate input with Zod schema
    .mutation(async ({ input }) => {
      const { email, password, firstName, lastName, role } = input;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error("User already exists"); // Handle user already existing
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new user
      const newUser = new User({
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role,
      });

      await newUser.save(); // Save user to the database

      // Generate JWT token for email verification
      const token = jwt.sign(
        { id: newUser._id, email: newUser.email, role:newUser.role }, // Payload (user info)
        process.env.JWT_SECRET as string, // JWT secret from env
        { expiresIn: "1h" } // Token expiration
      );

      // Send verification email with the token
      sendEmail(
        [newUser.email],
        { subject: "Email Verification", data: { firstName: newUser.firstName, token:`${process.env.CLIENT_URL}?token=${token}`,  } }, // Pass token to template context
        VERIFY_EMAIL_TEMPLATE
      );

      return {
        message: "User registered successfully, please verify your email.",
        status: 200,
        user: newUser,
        token, // Send token if you want to use it on the client side immediately
      };
    }),
  
});