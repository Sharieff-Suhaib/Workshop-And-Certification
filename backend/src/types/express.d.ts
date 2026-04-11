import 'express-session';
import { Request } from 'express';

declare global {
  namespace Express {
    interface User {
      id: string;
      name: string;
      email: string;
      role: string;
      profileImage?: string | null;
      token: string;
    }

    interface Request {
      user?: User;
      logout: (callback: (err?: Error) => void) => void;
      session?: Express.Session;
      sessionID?: string;
    }
  }
}

declare module 'express-session' {
  interface Session {
    passport?: {
      user: any;
    };
  }
}