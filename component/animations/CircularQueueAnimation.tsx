"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

const CAPACITY = 6;
const CANVAS_SIZE = 400;
const RADIUS = CANVAS_SIZE / 2 - 60;
const CENTER = CANVAS_SIZE / 2;

interface Pos {
  x: number;
  y: number;
}

export default function CircularQueueAnimation() {
  // internal state
  const [queue, setQueue] = useState<(number | null)[]>([
    10,
    20,
    30,
    null,
    null,
    null,
  ]);
  const [front, setFront] = useState(0);
  const [rear, setRear] = useState(2);
  const [count, setCount] = useState(3);
  const [input, setInput] = useState("");
  const [pythonCode, setPythonCode] = useState("");
  const [remove, setRemove] = useState("");

  // compute positions around a circle
  const positions: Pos[] = Array.from({ length: CAPACITY }, (_, i) => {
    const angle = (2 * Math.PI * i) / CAPACITY - Math.PI / 2;
    return {
      x: CENTER + RADIUS * Math.cos(angle),
      y: CENTER + RADIUS * Math.sin(angle),
    };
  });

  // Helpers to set Python snippet
  const code = (snippet: string) => setPythonCode(snippet.trim());

  // Operations
  const enqueue = () => {
    if (count === CAPACITY) {
      code(`# Cannot enqueue: queue is full`);
      return;
    }
    const v = Number(input);
    if (isNaN(v)) return;
    const newRear = (rear + 1) % CAPACITY;
    setQueue((q) => {
      const a = [...q];
      a[newRear] = v;
      return a;
    });
    setRear(newRear);
    setCount((c) => c + 1);
    code(
      `# Python: enqueue
capacity = ${CAPACITY}
queue = [${queue.map((x) => (x == null ? "None" : x)).join(", ")}]
front, rear, size = ${front}, ${rear}, ${count}
if size < capacity:
    rear = (rear + 1) % capacity
    queue[rear] = ${v}
    size += 1
print(queue)`
    );
    setInput("");
  };

  const dequeue = () => {
    if (count === 0) {
      code(`# Cannot dequeue: queue is empty`);
      return;
    }
    const removed = queue[front];
    if (removed == null) {
      code(`# Cannot dequeue: queue is empty`);
      return;
    }
    setRemove(removed.toString());
    
    setQueue((q) => {
      const a = [...q];
      a[front] = null;
      return a;
    });
    const newFront = (front + 1) % CAPACITY;
    setFront(newFront);
    setCount((c) => c - 1);
    code(
      `# Python: dequeue
capacity = ${CAPACITY}
queue = [${queue.map((x) => (x == null ? "None" : x)).join(", ")}]
front, rear, size = ${front}, ${rear}, ${count}
if size > 0:
    removed = queue[front]
    queue[front] = None
    front = (front + 1) % capacity
    size -= 1
print(removed, queue)`
    );
  };

  const peek = () =>
    code(
      `# Python: peek
queue = [${queue.map((x) => (x == null ? "None" : x)).join(", ")}]
front = ${front}
print(queue[front] if queue[front] is not None else None)`
    );

  const isEmpty = () =>
    code(
      `# Python: isEmpty
size = ${count}
print(size == 0)`
    );

  const isFull = () =>
    code(
      `# Python: isFull
capacity = ${CAPACITY}
size = ${count}
print(size == capacity)`
    );

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
      <h1 className="text-4xl font-bold text-indigo-700 mb-6">
        Circular Queue Visualizer 🔄
      </h1>

      {/* Controls */}
      <div className="flex flex-wrap gap-4 mb-8 justify-center">
        <input
          type="number"
          placeholder="Value"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="border px-3 py-2 rounded w-24 focus:ring focus:ring-indigo-300"
        />
        <button onClick={enqueue} className="btn bg-green-500">
          Enqueue
        </button>
        <button onClick={dequeue} className="btn bg-red-500">
          Dequeue
        </button>
        <button onClick={peek} className="btn bg-blue-500">
          Peek
        </button>
        <button onClick={isEmpty} className="btn bg-gray-500">
          isEmpty?
        </button>
        <button onClick={isFull} className="btn bg-purple-500">
          isFull?
        </button>
      </div>

      {/* Circular Layout */}
      <div className="relative w-[400px] h-[400px]">
        {positions.map((pos, idx) => (
          <motion.div
            key={idx}
            className={`
              absolute w-16 h-16 bg-white border-2 rounded-full 
              flex items-center justify-center text-lg font-semibold shadow-md
              ${count && idx === front ? "ring-4 ring-green-400" : ""}
              ${count && idx === rear ? "ring-4 ring-red-400" : ""}
            `}
            style={{ left: pos.x - 32, top: pos.y - 32 }}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            {queue[idx] !== null ? queue[idx] : ""}
          </motion.div>
        ))}
        {remove && (
          <motion.div
            className="absolute top-10 left-5 text-red-500 font-bold"
            style={{
              left: positions[front].x - 8,
              top: positions[front].y - 60,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            Removed: {remove}
          </motion.div>
        )}

        {/* Head/Tail labels */}
        <div
          className="absolute text-green-600 font-bold"
          style={{
            left: positions[front].x - 8,
            top: positions[front].y - 60,
          }}
        >
          H
        </div>
        <div
          className="absolute text-red-600 font-bold"
          style={{
            left: positions[rear].x - 8,
            top: positions[rear].y + 48,
          }}
        >
          T
        </div>
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
}
