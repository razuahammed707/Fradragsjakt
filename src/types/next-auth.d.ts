/* eslint-disable @typescript-eslint/no-unused-vars */
import type { JWT } from 'next-auth/jwt'; // Necessary for type augmentation

declare module 'next-auth' {
  interface User {
    id: string;
    role: string;
    firstName: string;
    lastName: string;
    hasAnswers: boolean;
    isSawInstructions: boolean;
    audit_for?: string;
    customer_email?: string;
  }

  interface Session {
    user: User;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role?: string;
    firstName?: string;
    lastName?: string;
    hasAnswers?: boolean;
    audit_for?: string;
    customer_email?: string;
    name?: string;
  }
}
/* eslint-enable @typescript-eslint/no-unused-vars */
