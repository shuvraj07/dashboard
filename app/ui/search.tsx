"use client";

import { useState } from "react";
import { Search, Mic } from "lucide-react";

const categories = [
  "All",
  "Music",
  "Mixes",
  "Podcasts",
  "Music of Nepal",
  "Startup company",
  "Tesla",
  "Live",
  "Nvidia",
  "Movie musicals",
  "Playlists",
  "Economics",
  "Algorithms",
];

export default function SearchBar() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [query, setQuery] = useState("");

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Search input */}
      <div className="flex items-center border rounded-full px-4 py-2 shadow-sm bg-white w-full max-w-3xl mx-auto">
        <input
          type="text"
          placeholder="Search"
          className="flex-1 outline-none px-2 text-sm md:text-base"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Search className="w-5 h-5 text-gray-500 cursor-pointer" />
        <div className="ml-2 bg-gray-100 p-2 rounded-full cursor-pointer">
          <Mic className="w-5 h-5 text-gray-700" />
        </div>
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar px-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1 rounded-full text-sm whitespace-nowrap ${
              activeCategory === cat
                ? "bg-black text-white"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}
