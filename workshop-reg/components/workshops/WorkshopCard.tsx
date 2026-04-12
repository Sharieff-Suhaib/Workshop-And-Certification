"use client";

import { useRouter } from "next/navigation";

export default function WorkshopCard({ w, hovered, setHovered }: any) {
  const router = useRouter();

  return (
    <div
      onMouseEnter={() => setHovered(w.id)}
      onMouseLeave={() => setHovered(null)}
      onClick={() => router.push(`/dashboard/workshops/${w.id}`)}
      className={`w-72 p-4 rounded-xl border transition cursor-pointer
        bg-white/5 border-white/10 backdrop-blur-sm
        ${
          hovered === w.id
            ? "scale-105 border-pink-400/60 shadow-lg shadow-pink-500/20"
            : ""
        }`}
    >
      <div className="h-32 rounded-lg bg-white/10 mb-3" />

      <h3
        className={`text-sm font-semibold transition ${
          hovered === w.id ? "text-pink-300" : "text-white"
        }`}
      >
        {w.title}
      </h3>

      <p className="text-xs text-gray-400">{w.category}</p>
    </div>
  );
}