"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { RegisterWorkshopInput } from "../../lib/schemas/registration.schema";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface RegisterPayload extends RegisterWorkshopInput {
  workshopId: string;
}

async function postRegistration({ workshopId, ...body }: RegisterPayload) {
  console.log("🚀 REGISTER API HIT:", workshopId, body);

  const res = await fetch(
    `${API_URL}/api/workshops/${workshopId}/register`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(body),
    }
  );

  const text = await res.text(); // safer debug

  console.log("📦 RAW RESPONSE:", text);

  let json;
  try {
    json = JSON.parse(text);
  } catch (e) {
    throw new Error("Server did not return JSON (check backend)");
  }

  if (!res.ok) {
    const err: any = new Error(json.error ?? "Registration failed");
    err.status = res.status;
    err.issues = json.issues;
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
