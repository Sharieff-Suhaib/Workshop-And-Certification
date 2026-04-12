"use client";
// components/RegistrationForm.tsx

import { forwardRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import {
  RegisterWorkshopSchema,
  type RegisterWorkshopInput,
} from "../../lib/schemas/registration.schema";
import { useRegisterWorkshop } from "../../src/hooks/useRegisterWorkshop";

const YEARS = [
  "1st Year",
  "2nd Year",
  "3rd Year",
  "4th Year",
  "Postgraduate",
  "Working Professional",
];
const LEVELS = ["Beginner", "Intermediate", "Advanced"];

interface Props {
  workshopId: string;
  workshopTitle: string;
}

export default function RegistrationForm({ workshopId, workshopTitle }: Props) {
  const router = useRouter();
  const { mutate, isPending, isSuccess, isError, error } = useRegisterWorkshop();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterWorkshopInput>({
    resolver: zodResolver(RegisterWorkshopSchema),
  });

  // Map server-side Zod field errors back into form fields
  useEffect(() => {
    if (isError && (error as any)?.issues) {
      const issues = (error as any).issues as Record<string, string[]>;
      (Object.entries(issues) as [keyof RegisterWorkshopInput, string[]][]).forEach(
        ([field, msgs]) => setError(field, { message: msgs[0] })
      );
    }
  }, [isError, error, setError]);

  const onSubmit = (data: RegisterWorkshopInput) => {
    mutate({ ...data, workshopId });
  };

  // ── Success ────────────────────────────────────────────────────────────────
  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-pink-500/30 bg-pink-500/10 px-8 py-12 text-center">
        <CheckCircle2 className="h-12 w-12 text-pink-500" />
        <div>
          <h3 className="mb-1 text-lg font-semibold text-white">
            Registration confirmed!
          </h3>
          <p className="text-sm text-gray-400">
            You&apos;re registered for{" "}
            <span className="text-pink-400">{workshopTitle}</span>.
            <br />
            A confirmation has been sent to your email.
          </p>
        </div>
        <button
          onClick={() => router.push(`/workshops/${workshopId}`)}
          className="mt-2 rounded-full border border-white/10 px-5 py-2 text-sm text-gray-300 transition hover:border-white/30 hover:text-white"
        >
          ← Back to workshop
        </button>
      </div>
    );
  }

  // ── Form ───────────────────────────────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Non-field server error (duplicate / fully booked) */}
      {isError && !(error as any)?.issues && (
        <div className="flex items-start gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3">
          <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-400" />
          <p className="text-sm text-red-300">{(error as Error).message}</p>
        </div>
      )}

      {/* Full name */}
      <Field label="Full name" error={errors.fullName?.message}>
        <Input
          {...register("fullName")}
          placeholder="e.g. Ananya Sharma"
          hasError={!!errors.fullName}
        />
      </Field>

      {/* Email + Phone */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Email" error={errors.email?.message}>
          <Input
            {...register("email")}
            type="email"
            placeholder="you@college.edu"
            hasError={!!errors.email}
          />
        </Field>
        <Field label="Mobile number" error={errors.phone?.message}>
          <Input
            {...register("phone")}
            type="tel"
            placeholder="10-digit mobile"
            hasError={!!errors.phone}
          />
        </Field>
      </div>

      {/* College */}
      <Field label="College / Organisation" error={errors.college?.message}>
        <Input
          {...register("college")}
          placeholder="e.g. Anna University"
          hasError={!!errors.college}
        />
      </Field>

      {/* Department + Year */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Department" error={errors.department?.message}>
          <Input
            {...register("department")}
            placeholder="e.g. Computer Science"
            hasError={!!errors.department}
          />
        </Field>
        <Field label="Year of study" error={errors.year?.message}>
          <Select {...register("year")} hasError={!!errors.year}>
            <option value="">Select year</option>
            {YEARS.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      {/* Experience */}
      <Field label="Experience level" error={errors.experience?.message}>
        <Select {...register("experience")} hasError={!!errors.experience}>
          <option value="">Select level</option>
          {LEVELS.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </Select>
      </Field>

      {/* Submit */}
      <button
        type="submit"
        disabled={isPending}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-pink-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-pink-500 disabled:opacity-60"
      >
        {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
        {isPending ? "Registering…" : "Register Now"}
      </button>
    </form>
  );
}

// ── Input primitive ───────────────────────────────────────────────────────────

const base =
  "w-full rounded-xl border bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-gray-500 outline-none transition focus:ring-2";

const Input = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { hasError?: boolean }
>(({ hasError, className, ...props }, ref) => (
  <input
    ref={ref}
    className={[
      base,
      hasError
        ? "border-red-500/50 focus:ring-red-500/40"
        : "border-white/10 hover:border-white/20 focus:border-pink-500/50 focus:ring-pink-500/30",
      className,
    ]
      .filter(Boolean)
      .join(" ")}
    {...props}
  />
));
Input.displayName = "Input";

// ── Select primitive ──────────────────────────────────────────────────────────

const Select = forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement> & { hasError?: boolean }
>(({ hasError, className, children, ...props }, ref) => (
  <select
    ref={ref}
    className={[
      base,
      "cursor-pointer [&>option]:bg-gray-900",
      hasError
        ? "border-red-500/50 focus:ring-red-500/40"
        : "border-white/10 hover:border-white/20 focus:border-pink-500/50 focus:ring-pink-500/30",
      className,
    ]
      .filter(Boolean)
      .join(" ")}
    {...props}
  >
    {children}
  </select>
));
Select.displayName = "Select";

// ── Field wrapper ─────────────────────────────────────────────────────────────

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-300">
        {label}
        <span className="ml-1 text-pink-500">*</span>
      </label>
      {children}
      {error && (
        <p className="flex items-center gap-1 text-xs text-red-400">
          <AlertCircle className="h-3 w-3 flex-shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}
