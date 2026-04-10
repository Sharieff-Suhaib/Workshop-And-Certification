import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim()
    .min(3, { message: "Name must be at least 3 characters" })
    .max(30, { message: "Name must be less than 30 characters" }),

  email: z.string().trim().toLowerCase()
    .email({ message: "Enter a valid email address" }),

  password: z.string()
    .min(6, { message: "Password must be at least 6 characters" })
    .max(30, { message: "Password must be less than 30 characters" })
    .regex(/[^A-Za-z0-9]/, {
      message: "Password must contain at least one special character",
    }),
});

export type RegisterInput = z.infer<typeof registerSchema>;