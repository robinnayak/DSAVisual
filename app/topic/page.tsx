"use client";

import BoxTopics from "@/component/DsaTopicsGrid/BoxTopics";
import Search from "@/component/Search";
import { useState } from "react";

export default function TopicsPage() {
  const [search, setSearch] = useState<string>("");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Data Structures & Algorithms
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Master the fundamentals of computer science with interactive visualizations and step-by-step explanations
          </p>
        </div>
        
        <div className="flex justify-center items-center mb-8">
          <Search search={search} setSearch={setSearch} />
        </div>

        <div className="flex justify-center">
          <BoxTopics search={search} />
        </div>
      </div>
    </div>
  );
}
