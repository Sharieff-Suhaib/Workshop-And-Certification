"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, Calendar, Clock, MapPin, Users } from "lucide-react";
import RegistrationForm from "../../../../../../components/workshops/RegistrationForm";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function fetchWorkshop(id: string) {
  if (!id) throw new Error("Missing workshop id");

  const res = await fetch(`${API_URL}/api/workshops/${id}`);

  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data?.error || "Workshop not found");
  }

  return data.data;
}

export default function RegisterPage() {
  const params = useParams();
  const router = useRouter();

  const workshopid =
    (params?.workshopid as string) ||
    (params?.id as string) ||
    "";

  const {
    data: workshop,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["workshop", workshopid],
    queryFn: () => fetchWorkshop(workshopid),
    enabled: !!workshopid,
  });

  // format date
  const formattedDate = workshop?.date
    ? new Date(workshop.date).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <main className="min-h-screen bg-[#0d0d0d] px-4 py-10 text-white">
      <div className="mx-auto max-w-xl">

        {/* BACK BUTTON */}
        <button
          onClick={() => router.back()}
          className="mb-8 flex items-center gap-1 text-sm text-gray-400 hover:text-white"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to workshop
        </button>

        {/* LOADING */}
        {isLoading && (
          <div className="mb-8 animate-pulse rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="mb-3 h-5 w-2/3 rounded bg-white/10" />
            <div className="h-3 w-1/3 rounded bg-white/10" />
          </div>
        )}

        {/* ERROR */}
        {isError && (
          <p className="mb-6 text-sm text-red-400">
            {error instanceof Error
              ? error.message
              : "Failed to load workshop"}
          </p>
        )}

        {/* WORKSHOP INFO */}
        {workshop && (
          <div className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-5">

            {/* TITLE + CATEGORY */}
            <div className="flex items-start justify-between">
              <h1 className="text-lg font-semibold">
                {workshop.title}
              </h1>

              <span className="rounded-full border border-pink-500/40 bg-pink-500/10 px-3 py-1 text-xs text-pink-400">
                {workshop.category}
              </span>
            </div>

            {/* META INFO */}
            <div className="mt-3 flex flex-wrap gap-3 text-xs text-gray-400">

              {formattedDate && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formattedDate}
                </span>
              )}

              {workshop.time && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {workshop.time}
                </span>
              )}

              {workshop.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {workshop.location}
                </span>
              )}

              {/* capacity / filled */}
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {workshop.filled}/{workshop.capacity} filled
              </span>

            </div>
          </div>
        )}

        {/* FORM */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="mb-6 text-base font-semibold">
            Registration details
          </h2>

          <RegistrationForm
            workshopId={workshopid}
            workshopTitle={workshop?.title ?? ""}
          />
        </div>

      </div>
    </main>
  );
}
