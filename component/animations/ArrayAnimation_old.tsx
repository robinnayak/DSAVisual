"use client";

import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface AnimationStep {
  line: number;
  code: string;
  explanation: string;
  highlight?: number[];
  variables?: { [key: string]: any };
}

interface ArrayState {
  values: number[];
  highlighted: number[];
  comparing: number[];
  accessing: number | null;
}

const ArrayAnimation = () => {
  const [arr, setArr] = useState<number[]>([10, 20, 30, 40, 50]);
  const [value, setValue] = useState<string>("");
  const [index, setIndex] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [animationSteps, setAnimationSteps] = useState<AnimationStep[]>([]);
  const [arrayState, setArrayState] = useState<ArrayState>({
    values: [10, 20, 30, 40, 50],
    highlighted: [],
    comparing: [],
    accessing: null
  });
  const [variables, setVariables] = useState<{ [key: string]: any }>({});
  const [operationSpeed, setOperationSpeed] = useState(1000);

  // Append (push)
  const handleAppend = () => {
    const v = Number(value);
    setArr((prev) => [...prev, v]);
    setPythonCode(
      `# Python: append to list
arr.append(${v})
print(arr)`
    );
    setValue("");
    setSearchIdx(null);
  };

  // Pop (remove last)
  const handlePop = () => {
    setArr((prev) => {
      if (!prev.length) return prev;
      const newArr = prev.slice(0, -1);
      return newArr;
    });
    setPythonCode(
      `# Python: pop last element
arr.pop()
print(arr)`
    );
    setSearchIdx(null);
  };

  // Insert at index
  const handleInsertAt = () => {
    const v = Number(value);
    const i = Math.max(0, Math.min(index, arr.length));
    const newArr = [...arr.slice(0, i), v, ...arr.slice(i)];
    setArr(newArr);
    setPythonCode(
      `# Python: insert at index ${i}
arr.insert(${i}, ${v})
print(arr)`
    );
    setValue("");
    setSearchIdx(null);
  };

  // Delete at index
  const handleDeleteAt = () => {
    const i = Math.max(0, Math.min(index, arr.length - 1));
    setArr((prev) => [...prev.slice(0, i), ...prev.slice(i + 1)]);
    setPythonCode(
      `# Python: delete at index ${i}
arr.pop(${i})
print(arr)`
    );
    setSearchIdx(null);
  };

  // Update at index
  const handleUpdateAt = () => {
    const v = Number(value);
    const i = Math.max(0, Math.min(index, arr.length - 1));
    setArr((prev) => prev.map((el, idx) => (idx === i ? v : el)));
    setPythonCode(
      `# Python: update at index ${i}
arr[${i}] = ${v}
print(arr)`
    );
    setValue("");
    setSearchIdx(null);
  };

  // Search (highlight) at index
  const handleSearch = () => {
    const i = Math.max(0, Math.min(index, arr.length - 1));
    setSearchIdx(i);
    setPythonCode(
      `# Python: access element at index ${i}
print(arr[${i}])  # => ${arr[i]}`
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <h1 className="text-4xl font-bold text-blue-700 mb-6">
        Array Visualizer 🔢
      </h1>

      {/* Controls */}
      <div className="flex flex-wrap gap-4 mb-8 justify-center">
        <input
          type="number"
          placeholder="Value"
          className="border px-3 py-2 rounded w-24 focus:ring focus:ring-blue-300"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <input
          type="number"
          placeholder="Index"
          className="border px-3 py-2 rounded w-24 focus:ring focus:ring-purple-300"
          value={index}
          onChange={(e) => setIndex(Number(e.target.value))}
        />
        <button onClick={handleAppend} className="btn">
          Append
        </button>
        <button onClick={handlePop} className="btn">
          Pop
        </button>
        <button onClick={handleInsertAt} className="btn">
          Insert @Idx
        </button>
        <button onClick={handleDeleteAt} className="btn">
          Delete @Idx
        </button>
        <button onClick={handleUpdateAt} className="btn">
          Update @Idx
        </button>
        <button onClick={handleSearch} className="btn">
          Search @Idx
        </button>
      </div>

      {/* Array Visualization */}
      <div className="flex gap-4 mb-8 overflow-x-auto p-2">
        <AnimatePresence>
          {arr.map((el, idx) => (
            <motion.div
              key={`${el}-${idx}`}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className={`
                flex flex-col items-center justify-center 
                w-16 h-16 bg-white border-2 rounded shadow 
                ${searchIdx === idx ? "ring-4 ring-green-400" : ""}
              `}
            >
              <div className="text-lg font-semibold">{el}</div>
              <div className="text-xs text-gray-500 mt-1">[{idx}]</div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Python Code */}
      {pythonCode && (
        <div className="w-full max-w-2xl bg-gray-900 text-green-400 rounded-lg p-4 overflow-x-auto shadow-md">
          <h2 className="text-xl font-bold mb-2 text-white">Python Code</h2>
          <pre className="whitespace-pre-wrap">{pythonCode}</pre>
        </div>
      )}
    </div>
  );
};

export default ArrayAnimation;
