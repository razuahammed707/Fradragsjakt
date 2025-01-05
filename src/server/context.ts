import { inferAsyncReturnType } from '@trpc/server';
import connectToDatabase from './config/mongoose';
import mongoose from 'mongoose';
import { auth } from '@/auth';

// Define the type for the incoming request

export const createContext = async () => {
  // Get the session using NextAuth v5's auth() function
  const session = await auth();

  // Connect to the database
  await connectToDatabase();

  return {
    user: session?.user || null,
    session: session || null,
    db: mongoose.connection,
  };
};

// Define the context type using inferAsyncReturnType
export type Context = inferAsyncReturnType<typeof createContext>;
