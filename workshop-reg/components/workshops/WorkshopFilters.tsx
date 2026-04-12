export default function WorkshopFilters({ filter, changeFilter }: any) {
  return (
    <div className="flex gap-3 mb-6">
      {["All", "Technical", "Non-Technical"].map((f) => (
        <button
          key={f}
          onClick={() => changeFilter(f)}
          className={`px-4 py-1 rounded-full border text-sm transition
            ${
              filter === f
                ? "bg-pink-500/20 text-pink-300 border-pink-500"
                : "border-[#2a2a2f] text-gray-400 hover:text-pink-300"
            }`}
        >
          {f}
        </button>
      ))}
    </div>
  );
}