"use client";

import { useRouter } from "next/navigation";

export default function WorkshopDropdown({
  openDropdown,
  setOpenDropdown,
  filter,
  dropdownWorkshops,
}: any) {
  const router = useRouter();

  return (
    <div className="relative mb-4">
      <button
        onClick={() => setOpenDropdown(!openDropdown)}
        className="px-8 py-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-pink-300 font-semibold hover:scale-105 transition"
      >
        {filter} Workshops ▼
      </button>

      {openDropdown && (
        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-72 bg-black/70 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden z-50">
          {dropdownWorkshops.map((w: any) => (
            <div
              key={w.id}
              onClick={() => {
                router.push(`/dashboard/workshops/${w.id}`);
                setOpenDropdown(false);
              }}
              className="px-4 py-2 text-sm hover:bg-pink-500/10 cursor-pointer"
            >
              {w.title}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}