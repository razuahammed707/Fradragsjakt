import { CredentialsProvider, GoogleProvider } from '@/auth/providers';
import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  providers: [CredentialsProvider, GoogleProvider],
} satisfies NextAuthConfig;
