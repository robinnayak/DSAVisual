"use client";
// export const runtime = "edge";
import BoxTopics from "@/component/DsaTopicsGrid/BoxTopics";
import Search from "@/component/Search";
import { useState } from "react";

export default function Home() {
  const [search, setSearch] = useState<string>("");

  return (
    <div>
      <div className="container flex justify-center items-center">
        <Search search={search} setSearch={setSearch} />
      </div>

      <div className="container mt-10 flex justify-center">
        <BoxTopics search={search} />
      </div>
    </div>
  );
}
