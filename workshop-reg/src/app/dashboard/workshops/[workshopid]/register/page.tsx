"use client";
import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, Calendar, Clock, MapPin } from "lucide-react";
import RegistrationForm from "../../../../../../components/workshops/RegistrationForm";

async function fetchWorkshop(id: string) {
  const res = await fetch(`/api/workshops/${id}`, { credentials: "include" });
  if (!res.ok) throw new Error("Workshop not found");
  return res.json().then((j) => j.data);
}

export default function RegisterPage() {
  const { workshopid } = useParams<{ workshopid: string }>();
  const router = useRouter();

  const { data: workshop, isLoading, isError } = useQuery({
    queryKey: ["workshop", workshopid],
    queryFn: () => fetchWorkshop(workshopid),
    enabled: !!workshopid,
    staleTime: 60_000,
  });

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

        {/* Back */}
        <button
          onClick={() => router.back()}
          className="mb-8 flex items-center gap-1 text-sm text-gray-400 transition hover:text-white"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to workshop
        </button>

        {/* Workshop summary card */}
        {isLoading && <SummarySkeleton />}

        {isError && (
          <p className="mb-6 text-sm text-red-400">
            Could not load workshop details.
          </p>
        )}

        {workshop && (
          <div className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="mb-1 flex items-start justify-between gap-3">
              <h1 className="text-lg font-semibold leading-snug text-white">
                {workshop.title}
              </h1>
              <span className="flex-shrink-0 rounded-full border border-pink-500/40 bg-pink-500/10 px-2.5 py-0.5 text-xs font-medium text-pink-400">
                {workshop.category}
              </span>
            </div>

            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-gray-400">
              {formattedDate && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {formattedDate}
                </span>
              )}
              {workshop.time && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {workshop.time}
                </span>
              )}
              {workshop.venue && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {workshop.venue}
                </span>
              )}
            </div>

            {/* Seats bar */}
            {workshop.seats && (
              <div className="mt-4">
                <div className="mb-1.5 flex justify-between text-xs text-gray-500">
                  <span>{workshop.seats - workshop.filled} seats remaining</span>
                  <span>{workshop.filled}/{workshop.seats} registered</span>
                </div>
                <div className="h-1 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-pink-500 transition-all"
                    style={{
                      width: `${Math.round((workshop.filled / workshop.seats) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Form */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="mb-6 text-base font-semibold text-white">
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

function SummarySkeleton() {
  return (
    <div className="mb-8 animate-pulse rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="mb-3 h-5 w-2/3 rounded-lg bg-white/10" />
      <div className="h-3 w-1/3 rounded-lg bg-white/10" />
    </div>
  );
}
