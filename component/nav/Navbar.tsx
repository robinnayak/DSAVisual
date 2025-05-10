"use client";
import Link from "next/link";
import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const navlinks = [
  { name: "Home", path: "/" },
  { name: "Topics", path: "/topic" },
  { name: "Git", path: "/git" },
  {name: "Folder Structure", path: "/folderstructure"},
  
  
  // Add more links here
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="w-full bg-amber-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 text-2xl font-bold text-cyan-600">
            <Link href="/">
              <Image 
                src="/images/logo.png"
                alt="Logo"
                width={100}
                height={100}
                className=""

              />
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            {navlinks.map((link, idx) => (
              <Link
                key={idx}
                href={link.path}
                className="relative px-3 py-2 text-gray-700 hover:text-cyan-600 transition-colors group"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-cyan-600 group-hover:w-full transition-all"></span>
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-amber-50"
          >
            <div className="px-2 pt-2 pb-4 space-y-1">
              {navlinks.map((link, idx) => (
                <Link
                  key={idx}
                  href={link.path}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 text-gray-700 hover:text-cyan-600 transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
