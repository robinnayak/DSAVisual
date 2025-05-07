'use client';

import React from "react";

interface SearchProps {
  search: string;
  setSearch: (value: string) => void;
}

const Search = ({ search, setSearch }: SearchProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // console.log("Searching for:", search);
  };

  return (
    <div className="flex justify-center items-center flex-col mt-5">
      <h1 className="text-3xl font-bold">Search</h1>
      <form onSubmit={handleSubmit} method="POST" className="flex items-center mt-5">
        <input
          type="text"
          className="border-2 border-gray-300 rounded-md p-2 mt-5"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white rounded-md p-2 mt-5 hover:bg-blue-600 transition duration-300 mx-5"
        >
          Search
        </button>
      </form>
    </div>
  );
};

export default Search;
