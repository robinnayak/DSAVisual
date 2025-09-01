"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
interface Bucket {
  key: string | null;
  value: string | null;
}

const tableSize = 7; // Number of buckets in the hash table

const initialBuckets: Bucket[] = [
  { key: "a", value: "Apple" },
  { key: null, value: null },
  { key: "b", value: "Banana" },
  { key: null, value: null },
  { key: "c", value: "Cherry" },
  { key: null, value: null },
  { key: null, value: null },
];

const HashTableAnimation = () => {
  const [table, setTable] = useState<Bucket[]>(initialBuckets);
  const [keyInput, setKeyInput] = useState("");
  const [valueInput, setValueInput] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error" | "info";
  } | null>(null);
  const [pythonCode, setPythonCode] = useState("");

  const hashFunction = (key: string) => {
    let hash = 0;
    for (let char of key) hash += char.charCodeAt(0);
    return hash % tableSize;
  };

  const insert = () => {
    if (!keyInput || !valueInput) return;
    const index = hashFunction(keyInput);
    const newTable = [...table];
    newTable[index] = { key: keyInput, value: valueInput };
    setTable(newTable);
    setHighlightedIndex(index);
    setMessage({
      text: `Inserted '${keyInput}' at index ${index}`,
      type: "success",
    });
    setPythonCode(
      `# Insert into Hash Table
index = hash('${keyInput}') % ${tableSize}
table[index] = ('${keyInput}', '${valueInput}')`
    );
    setKeyInput("");
    setValueInput("");
  };

  const deleteKey = () => {
    if (!keyInput) return;
    const index = hashFunction(keyInput);
    const newTable = [...table];
    if (newTable[index].key === keyInput) {
      newTable[index] = { key: null, value: null };
      setTable(newTable);
      setHighlightedIndex(index);
      setMessage({
        text: `Deleted '${keyInput}' from index ${index}`,
        type: "info",
      });
      setPythonCode(
        `# Delete from Hash Table
index = hash('${keyInput}') % ${tableSize}
if table[index][0] == '${keyInput}':
    table[index] = None`
      );
    } else {
      setMessage({ text: `Key '${keyInput}' not found`, type: "error" });
      setHighlightedIndex(null);
      setPythonCode(
        `# Delete from Hash Table
index = hash('${keyInput}') % ${tableSize}
# Key not found`
      );
    }
    setKeyInput("");
  };

  const search = () => {
    if (!keyInput) return;
    const index = hashFunction(keyInput);
    const bucket = table[index];
    if (bucket.key === keyInput) {
      setHighlightedIndex(index);
      setMessage({
        text: `Found '${keyInput}' at index ${index}: '${bucket.value}'`,
        type: "success",
      });
      setPythonCode(
        `# Search in Hash Table
index = hash('${keyInput}') % ${tableSize}
if table[index][0] == '${keyInput}':
    print("Found:", table[index][1])
else:
    print("Not Found")`
      );
    } else {
      setHighlightedIndex(null);
      setMessage({ text: `Key '${keyInput}' not found`, type: "error" });
      setPythonCode(
        `# Search in Hash Table
index = hash('${keyInput}') % ${tableSize}
print("Not Found")`
      );
    }
    setKeyInput("");
  };

  const getMessageClasses = () => {
    if (!message) return "";
    switch (message.type) {
      case "success":
        return "bg-green-100 text-green-800 border-green-200";
      case "error":
        return "bg-red-100 text-red-800 border-red-200";
      case "info":
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
      <h1 className="text-4xl font-bold mb-6 text-blue-700">
        Hash Table Visualizer 🧩
      </h1>

      <div className="flex flex-wrap justify-center gap-4 mb-4">
        <input
          type="text"
          value={keyInput}
          onChange={(e) => setKeyInput(e.target.value)}
          placeholder="Key"
          className="border px-4 py-2 rounded-md shadow-sm focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="text"
          value={valueInput}
          onChange={(e) => setValueInput(e.target.value)}
          placeholder="Value (Insert only)"
          className="border px-4 py-2 rounded-md shadow-sm focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div className="flex flex-wrap justify-center gap-4 mb-6">
        <button
          onClick={insert}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition"
        >
          Insert
        </button>
        <button
          onClick={deleteKey}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition"
        >
          Delete
        </button>
        <button
          onClick={search}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition"
        >
          Search
        </button>
      </div>

      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className={`mb-6 px-4 py-2 border rounded-lg ${getMessageClasses()}`}
          >
            {message.text}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-6">
        {table.map((bucket, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={`rounded-xl border-2 p-6 w-32 h-32 flex flex-col items-center justify-center transition-shadow 
              ${
                highlightedIndex === index
                  ? "border-green-400 bg-green-100 shadow-lg"
                  : "border-gray-300 bg-white hover:shadow-md"
              }`}
          >
            <div className="text-gray-500 text-xs mb-1">Index: {index}</div>
            {bucket.key ? (
              <>
                <div className="font-bold text-lg">{bucket.key}</div>
                <div className="text-sm text-gray-600">{bucket.value}</div>
              </>
            ) : (
              <div className="text-gray-400 italic">Empty</div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Python Code Display */}
      {pythonCode && (
        <div className="w-full max-w-2xl bg-gray-900 text-green-400 rounded-lg p-4 overflow-x-auto shadow-md">
          <h2 className="text-xl font-bold mb-2 text-white">Python Code</h2>
          <pre className="whitespace-pre-wrap">{pythonCode}</pre>
        </div>
      )}
    </div>
  );
};

export default HashTableAnimation;
