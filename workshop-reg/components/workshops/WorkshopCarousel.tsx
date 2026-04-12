"use client";

import WorkshopCard from "./WorkshopCard";

export default function WorkshopCarousel({
  visible,
  hovered,
  setHovered,
  canPrev,
  canNext,
  setStartIndex,
  startIndex,
}: any) {
  return (
    <div className="relative w-full max-w-5xl px-6 py-12 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_0_40px_rgba(236,72,153,0.35)]">

      {/* LEFT */}
      <button
        onClick={() => canPrev && setStartIndex(startIndex - 1)}
        disabled={!canPrev}
        className={`absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full
          ${
            canPrev
              ? "bg-pink-500/20 hover:bg-pink-500/40 text-pink-300"
              : "opacity-30 cursor-not-allowed"
          }`}
      >
        ‹
      </button>

      {/* CARDS */}
      <div className="flex gap-6 justify-center">
        {visible.map((w: any) => (
          <WorkshopCard
            key={w.id}
            w={w}
            hovered={hovered}
            setHovered={setHovered}
          />
        ))}
      </div>

      {/* RIGHT */}
      <button
        onClick={() => canNext && setStartIndex(startIndex + 1)}
        disabled={!canNext}
        className={`absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full
          ${
            canNext
              ? "bg-pink-500/20 hover:bg-pink-500/40 text-pink-300"
              : "opacity-30 cursor-not-allowed"
          }`}
      >
        ›
      </button>
    </div>
  );
}