// backend/src/config/adminWhitelist.ts
import 'dotenv/config';

const parseAdminEmails = (): string[] => {
  return (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
};

export const isAdminEmail = (email: string): boolean => {
  return parseAdminEmails().includes(email.toLowerCase());
};

export const getAdminEmails = (): string[] => {
  return parseAdminEmails();
};