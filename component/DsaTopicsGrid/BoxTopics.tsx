"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import topics from "@/utils/topics";

interface BoxTopicsProps {
  search: string;
}

const BoxTopics = ({ search }: BoxTopicsProps) => {
  const router = useRouter();

  // Filter topics based on search (case-insensitive)
  const filteredTopics = topics.filter((topic) =>
    topic.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-3xl text-center mb-5 font-bold">DSA Topics</h1>
      <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-10 p-4">
        {filteredTopics.length > 0 ? (
          filteredTopics.map((topic, index) => (
            <div
              key={index}
              onClick={() => router.push(topic.path)}
              className="w-64 cursor-pointer bg-white shadow-md hover:shadow-lg rounded-xl overflow-hidden transition-all duration-300"
            >
              <div className="relative h-40 w-full">
                <Image
                  alt={topic.name}
                  src={topic.image}
                  fill
                  style={{ objectFit: "contain" }}
                  className="rounded-t-xl"
                />
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-800 text-center">
                  {topic.name}
                </h3>
                <p className="text-sm text-gray-500 text-center">
                  Difficulty: {topic.difficulty}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500">
            No topics found.
          </div>
        )}
      </div>
    </div>
  );
};

export default BoxTopics;
