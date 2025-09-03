"use client";

import { useState, useRef } from "react";
import { Search, X } from "lucide-react";

type YTSearchBarProps = {
  onSearch: (query: string) => void;
  placeholder?: string;
  suggestions?: string[];
  className?: string;
};

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

export default function YTSearchBar({
  onSearch,
  placeholder = "Search",
  suggestions = [],
  className = "",
}: YTSearchBarProps) {
  const [query, setQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    onSearch(query);
    setMobileOpen(false);
  };

  const renderCategories = () => (
    <div className="flex gap-2 overflow-x-auto no-scrollbar px-1 sm:px-0 py-2">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => setActiveCategory(cat)}
          className={`px-3 py-1 rounded-full text-sm whitespace-nowrap transition ${
            activeCategory === cat
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-800 hover:bg-gray-200"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );

  return (
    <div className={`relative w-full ${className}`}>
      {/* Desktop / Tablet */}
      <form
        onSubmit={handleSubmit}
        className="hidden sm:flex flex-col w-full max-w-xl mx-auto"
      >
        <div className="flex items-center w-full rounded-full border border-gray-300 bg-white shadow-sm">
          <Search className="ml-3 w-5 h-5 text-gray-500" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="flex-1 px-3 py-2 text-sm outline-none rounded-l-full"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="mr-2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          )}
          <button
            type="submit"
            className="px-4 py-2 text-sm bg-blue-500 text-white rounded-r-full hover:bg-blue-600"
          >
            Search
          </button>
        </div>
        {renderCategories()}
      </form>

      {/* Mobile */}
      {!mobileOpen ? (
        <button
          onClick={() => {
            setMobileOpen(true);
            setTimeout(() => inputRef.current?.focus(), 100);
          }}
          className="sm:hidden flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-md w-full transition"
        >
          <Search className="w-5 h-5 text-gray-500" />
          <span className="text-gray-500 text-sm">{placeholder}</span>
        </button>
      ) : (
        <div className="sm:hidden fixed top-0 left-0 right-0 z-50 bg-white shadow-md flex flex-col">
          <form
            onSubmit={handleSubmit}
            className="flex items-center px-3 py-2 w-full"
          >
            <Search className="w-5 h-5 text-gray-500" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={placeholder}
              className="flex-1 mx-2 py-2 text-base outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="mr-2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            )}
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="px-3 py-2 text-sm text-blue-600"
            >
              Cancel
            </button>
          </form>
          {renderCategories()}
        </div>
      )}
    </div>
  );
}
