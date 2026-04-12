"use client";
// src/hooks/useRegisterWorkshop.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { RegisterWorkshopInput } from "@/lib/schemas/registration.schema";

interface RegisterPayload extends RegisterWorkshopInput {
  workshopId: string;
}

async function postRegistration({ workshopId, ...body }: RegisterPayload) {
  const res = await fetch(`/api/workshops/${workshopId}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  });

  const json = await res.json();

  if (!res.ok) {
    const err = new Error(json.error ?? "Registration failed") as any;
    err.status = res.status;
    err.issues = json.issues; // server-side Zod field errors
    throw err;
  }

  return json.data;
}

export function useRegisterWorkshop() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: postRegistration,
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ["workshop", variables.workshopId] });
    },
  });
}
