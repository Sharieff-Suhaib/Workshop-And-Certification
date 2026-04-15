"use client";

import { useEffect, useState } from "react";

import WorkshopCarousel from "../../../../components/workshops/WorkshopCarousel";
import WorkshopDropdown from "../../../../components/workshops/WorkshopDropdown";
import WorkshopFilters from "../../../../components/workshops/WorkshopFilters";

export default function WorkshopsPage() {
  const [workshops, setWorkshops] = useState<any[]>([]);
  const [filter, setFilter] = useState("All");
  const [startIndex, setStartIndex] = useState(0);
  const [hovered, setHovered] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [loading, setLoading] = useState(true);

  const visibleCount = 3;

  // ✅ FETCH FROM EXPRESS BACKEND
  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/workshops`
        );

        const json = await res.json();

        if (json.success) {
          setWorkshops(json.data); // 👈 IMPORTANT FIX
        } else {
          setWorkshops([]);
        }
      } catch (err) {
        console.error("Failed to fetch workshops:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkshops();
  }, []);

  // FILTER LOGIC
  const filtered =
    filter === "All"
      ? workshops
      : workshops.filter((w) => w.category === filter);

  const visible = filtered.slice(startIndex, startIndex + visibleCount);

  const canPrev = startIndex > 0;
  const canNext = startIndex + visibleCount < filtered.length;

  const changeFilter = (value: string) => {
    setFilter(value);
    setStartIndex(0);
  };

  if (loading) {
    return (
      <div className="text-white flex items-center justify-center h-screen">
        Loading workshops...
      </div>
    );
  }

  return (
    <div className="relative h-screen w-full flex flex-col items-center text-white overflow-hidden">

      <div className="absolute inset-0 bg-[#0b0b0f]" />

      <div className="relative z-10 flex flex-col items-center w-full h-full pt-16 gap-10">

        <WorkshopFilters
          filter={filter}
          changeFilter={changeFilter}
        />

        <WorkshopCarousel
          visible={visible}
          hovered={hovered}
          setHovered={setHovered}
          canPrev={canPrev}
          canNext={canNext}
          setStartIndex={setStartIndex}
          startIndex={startIndex}
        />

        <WorkshopDropdown
          openDropdown={openDropdown}
          setOpenDropdown={setOpenDropdown}
          filter={filter}
          dropdownWorkshops={filtered}
        />

      </div>
    </div>
  );
}