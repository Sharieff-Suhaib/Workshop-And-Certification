"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function WorkshopDetail() {
  const params = useParams();
  const workshopid = params?.workshopid as string;
  const router = useRouter();

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("description");

  // ✅ FETCH FROM BACKEND
  useEffect(() => {
    const fetchWorkshop = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/workshops/${workshopid}`
        );

        const json = await res.json();

        if (json.success) {
          setData(json.data);
        } else {
          setData(null);
        }
      } catch (err) {
        console.error("Error fetching workshop:", err);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    if (workshopid) fetchWorkshop();
  }, [workshopid]);

  // LOADING
  if (loading) {
    return (
      <p className="text-white text-center mt-10">Loading workshop...</p>
    );
  }

  // NOT FOUND
  if (!data) {
    return (
      <p className="text-white text-center mt-10">Workshop Not Found</p>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 text-white">

      {/* MAIN CARD */}
      <div className="flex gap-6 bg-[#111115] border border-[#1e1e24] rounded-xl p-5 shadow-[0_0_25px_rgba(236,72,153,0.25)]">

        {/* IMAGE (SAFE FIXED) */}
        <div className="relative w-[40%] h-[300px] rounded-xl overflow-hidden flex-shrink-0">

          {data.image ? (
            <Image
              src={data.image}
              alt={data.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[#1e1e24] text-gray-400">
              No Image Available
            </div>
          )}

        </div>

        {/* CONTENT */}
        <div className="w-[60%]">

          {/* TITLE */}
          <h1 className="text-2xl font-semibold">{data.title}</h1>
          <p className="text-sm text-gray-400">{data.category}</p>

          {/* TABS */}
          <div className="flex flex-wrap gap-2 mt-4">
            {["description", "schedule", "speaker", "prerequisites"].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-3 py-1 rounded-full border text-sm transition
                  ${
                    tab === t
                      ? "bg-pink-500/20 text-pink-300 border-pink-500"
                      : "bg-[#0c0c0f] text-gray-400 border-[#1e1e24] hover:text-pink-300"
                  }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* CONTENT */}
          <div className="mt-4 leading-relaxed text-gray-300">

            {tab === "description" && (
              <p className="whitespace-pre-line">{data.description}</p>
            )}

            {tab === "schedule" && (
              <div className="space-y-1">
                <p>💰 Fee: {data.schedule?.fee}</p>
                <p>📅 Date: {data.schedule?.date}</p>
                <p>📍 Venue: {data.schedule?.venue}</p>
              </div>
            )}

            {tab === "speaker" && <p>🎤 {data.speaker}</p>}

            {tab === "prerequisites" && (
              <p>📌 {data.prerequisites}</p>
            )}

          </div>
        </div>
      </div>

      {/* REGISTER BUTTON */}
      <div className="flex justify-center mt-8">
        <button
          onClick={() =>
            router.push(`/dashboard/workshops/${data.id}/register`)
          }
          className="px-6 py-3 rounded-lg bg-pink-700 hover:bg-pink-800 transition text-white font-semibold shadow-[0_0_20px_rgba(190,24,93,0.6)]"
        >
          Register Now
        </button>
      </div>
    </div>
  );
}