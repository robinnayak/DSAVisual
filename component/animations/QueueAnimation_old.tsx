"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const QueueAnimation = () => {
  const [queue, setQueue] = useState<number[]>([10, 20, 30, 40]);
  const [value, setValue] = useState<string>("");
  const [pythonCode, setPythonCode] = useState<string>("");

  const enqueue = () => {
    const v = Number(value);
    if (isNaN(v)) return;
    setQueue((prev) => [...prev, v]);
    setPythonCode(
      `# Python: enqueue
from collections import deque
q = deque(${JSON.stringify(queue)})
q.append(${v})
print(q)`
    );
    setValue("");
  };

  const dequeue = () => {
    setQueue((prev) => {
      if (prev.length === 0) return prev;
      return prev.slice(1);
    });
    setPythonCode(
      `# Python: dequeue
from collections import deque
q = deque(${JSON.stringify(queue)})
if q:
    q.popleft()
print(q)`
    );
  };

  const peek = () => {
    setPythonCode(
      `# Python: peek front
from collections import deque
q = deque(${JSON.stringify(queue)})
print(q[0] if q else None)`
    );
  };

  const clear = () => {
    setQueue([]);
    setPythonCode(
      `# Python: clear queue
from collections import deque
q = deque(${JSON.stringify(queue)})
q.clear()
print(q)`
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <h1 className="text-4xl font-bold text-blue-700 mb-6">
        Queue Visualizer 📋
      </h1>

      {/* Controls */}
      <div className="flex flex-wrap gap-4 mb-8 justify-center">
        <input
          type="number"
          placeholder="Value"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="border px-3 py-2 rounded w-24 focus:ring focus:ring-blue-300"
        />
        <button onClick={enqueue} className="btn bg-green-500">
          Enqueue
        </button>
        <button onClick={dequeue} className="btn bg-red-500">
          Dequeue
        </button>
        <button onClick={peek} className="btn bg-indigo-500">
          Peek
        </button>
        <button onClick={clear} className="btn bg-yellow-500">
          Clear
        </button>
      </div>

      {/* Queue Visualization */}
      <div className="flex items-center gap-3 mb-8 overflow-x-auto p-2">
        <span className="text-lg font-bold text-gray-700">Front ➤</span>
        <AnimatePresence>
          {queue.map((el, idx) => (
            <motion.div
              key={`${el}-${idx}`}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="flex flex-col items-center justify-center 
                         w-16 h-16 bg-white border-2 rounded shadow 
                         text-lg font-semibold"
            >
              <div>{el}</div>
              <div className="text-xs text-gray-400">[{idx}]</div>
            </motion.div>
          ))}
        </AnimatePresence>
        <span className="text-lg font-bold text-gray-700">◀ Rear</span>
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

export default QueueAnimation;
