"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import topics from "@/utils/topics";
import { motion } from "framer-motion";

interface BoxTopicsProps {
  search: string;
}

const BoxTopics = ({ search }: BoxTopicsProps) => {
  const router = useRouter();

  // Filter topics based on search (case-insensitive)
  const filteredTopics = topics.filter((topic) =>
    topic.name.toLowerCase().includes(search.toLowerCase())
  );

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'text-green-600 bg-green-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'hard':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4">
      <h1 className="text-4xl text-center mb-8 font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
        DSA Topics
      </h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredTopics.length > 0 ? (
          filteredTopics.map((topic, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              onClick={() => router.push(topic.path)}
              className="group cursor-pointer bg-white shadow-lg hover:shadow-xl rounded-2xl overflow-hidden transition-all duration-300 transform hover:scale-[1.02] border border-gray-100"
            >
              <div className="relative h-48 w-full overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-50"></div>
                <Image
                  alt={topic.name}
                  src={topic.image}
                  fill
                  style={{ objectFit: "contain" }}
                  className="p-4 group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-800 text-center mb-3 group-hover:text-blue-600 transition-colors">
                  {topic.name}
                </h3>
                <div className="flex justify-center">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getDifficultyColor(topic.difficulty)}`}>
                    {topic.difficulty}
                  </span>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No topics found</h3>
            <p className="text-gray-500 text-center">
              Try adjusting your search terms or browse all available topics.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BoxTopics;
