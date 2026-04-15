// src/validation/registrationValidation.ts
import { z } from "zod";

export const RegisterWorkshopSchema = z.object({
  fullName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(60, "Name too long")
    .regex(/^[a-zA-Z\s'-]+$/, "Only letters, spaces, hyphens and apostrophes allowed"),
  email: z.string().email("Enter a valid email address"),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  college: z.string().min(2, "College / Organisation name is required"),
  department: z.string().min(2, "Department is required"),
  year: z.enum(
    [
      "1st Year",
      "2nd Year",
      "3rd Year",
      "4th Year",
      "Postgraduate",
      "Working Professional",
    ],
    { errorMap: () => ({ message: "Please select your year" }) }
  ),
  experience: z.enum(["Beginner", "Intermediate", "Advanced"], {
    errorMap: () => ({ message: "Please select your experience level" }),
  }),
});

export type RegisterWorkshopInput = z.infer<typeof RegisterWorkshopSchema>;
