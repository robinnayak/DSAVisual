"use client";
// export const runtime = "edge";
import BoxTopics from "@/component/DsaTopicsGrid/BoxTopics";
import Search from "@/component/Search";
import { useState } from "react";
import { motion } from "framer-motion";

export default function Home() {
  const [search, setSearch] = useState<string>("");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
              DSA Visualizer
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
              Master Data Structures and Algorithms with interactive visualizations, 
              step-by-step animations, and hands-on practice
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-4 mb-12"
          >
            <div className="bg-white px-6 py-3 rounded-full shadow-md border border-blue-100">
              <span className="text-blue-600 font-semibold">🚀 Interactive</span>
            </div>
            <div className="bg-white px-6 py-3 rounded-full shadow-md border border-purple-100">
              <span className="text-purple-600 font-semibold">📊 Visual</span>
            </div>
            <div className="bg-white px-6 py-3 rounded-full shadow-md border border-pink-100">
              <span className="text-pink-600 font-semibold">🎯 Educational</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Search Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <div className="container mx-auto flex justify-center items-center">
          <Search search={search} setSearch={setSearch} />
        </div>
      </motion.section>

      {/* Topics Grid Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="py-12"
      >
        <div className="container mx-auto flex justify-center">
          <BoxTopics search={search} />
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="py-16 px-4 bg-white/50 backdrop-blur-sm"
      >
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12 text-gray-800">Why Choose Our Platform?</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="p-6 rounded-2xl bg-white shadow-lg border border-blue-100">
              <div className="text-4xl mb-4">🎮</div>
              <h3 className="text-xl font-semibold mb-3 text-blue-600">Interactive Learning</h3>
              <p className="text-gray-600">Hands-on experience with drag-and-drop animations and real-time code execution</p>
            </div>
            <div className="p-6 rounded-2xl bg-white shadow-lg border border-purple-100">
              <div className="text-4xl mb-4">💡</div>
              <h3 className="text-xl font-semibold mb-3 text-purple-600">Step-by-Step</h3>
              <p className="text-gray-600">Follow along with detailed explanations and see exactly how algorithms work</p>
            </div>
            <div className="p-6 rounded-2xl bg-white shadow-lg border border-pink-100">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-xl font-semibold mb-3 text-pink-600">Mobile Friendly</h3>
              <p className="text-gray-600">Learn anywhere, anytime with our responsive design that works on all devices</p>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
