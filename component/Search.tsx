'use client';

import React, { useEffect, useState } from "react";
import { Search as SearchIcon } from "lucide-react";

interface SearchProps {
  search: string;
  setSearch: (value: string) => void;
}

const Search = ({ search, setSearch }: SearchProps) => {
  const [localSearch, setLocalSearch] = useState(search);

  // Debounce search to improve performance
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(localSearch);
    }, 300);

    return () => clearTimeout(timer);
  }, [localSearch, setSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(localSearch);
  };

  const clearSearch = () => {
    setLocalSearch("");
    setSearch("");
  };

  return (
    <div className="flex justify-center items-center flex-col mt-5">
      <h1 className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
        Find Your Topic
      </h1>
      <form onSubmit={handleSubmit} className="flex items-center mt-5 relative">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            className="border-2 border-gray-300 rounded-lg pl-10 pr-12 py-3 mt-5 w-80 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200"
            placeholder="Search data structures..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
          />
          {localSearch && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-1/2 mt-2.5 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>
        <button
          type="submit"
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg px-6 py-3 mt-5 ml-3 hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          Search
        </button>
      </form>
      {localSearch && (
        <p className="text-sm text-gray-500 mt-2">
          Searching for: &quot;{localSearch}&quot;
        </p>
      )}
    </div>
  );
};

export default Search;
