"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface CLLNode {
  id: number;
  value: number;
}

const CircularLinkedListAnimation = () => {
  const [list, setList] = useState<CLLNode[]>([
    { id: 1, value: 10 },
    { id: 2, value: 20 },
    { id: 3, value: 30 },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [position, setPosition] = useState<number>(0);
  const [pythonCode, setPythonCode] = useState("");

  // Helpers to update Python snippet
  const setCode = (code: string) => setPythonCode(code.trim());

  // Operations
  const insertAtBeginning = () => {
    if (!inputValue) return;
    const newNode = { id: Date.now(), value: +inputValue };
    setList((prev) => [newNode, ...prev]);
    setInputValue("");
    setCode(`
class Node:
    def __init__(self, data):
        self.data = data
        self.next = None

class CircularLinkedList:
    def __init__(self):
        self.head = None

    def insert_at_beginning(self, data):
        new_node = Node(data)
        if not self.head:
            new_node.next = new_node
            self.head = new_node
        else:
            temp = self.head
            while temp.next != self.head:
                temp = temp.next
            new_node.next = self.head
            temp.next = new_node
            self.head = new_node
`);
  };

  const insertAtEnd = () => {
    if (!inputValue) return;
    const newNode = { id: Date.now(), value: +inputValue };
    setList((prev) => [...prev, newNode]);
    setInputValue("");
    setCode(`
    # insert at end is same as insert at beginning + rotate head
    def insert_at_end(self, data):
        self.insert_at_beginning(data)
        self.head = self.head.next
`);
  };

  const insertAtPos = () => {
    if (!inputValue) return;
    const pos = Math.max(0, Math.min(position, list.length));
    const newNode = { id: Date.now(), value: +inputValue };
    setList((prev) => {
      if (pos === 0) return [newNode, ...prev];
      const a = prev.slice();
      a.splice(pos, 0, newNode);
      return a;
    });
    setInputValue("");
    setCode(`
    def insert_at_position(self, pos, data):
        if pos == 0:
            return self.insert_at_beginning(data)
        temp = self.head
        for _ in range(pos - 1):
            temp = temp.next
        new_node = Node(data)
        new_node.next = temp.next
        temp.next = new_node
`);
  };

  const deleteAtBeginning = () => {
    if (!list.length) return;
    setList((prev) => {
      if (prev.length === 1) return [];
      return prev.slice(1);
    });
    setCode(`
    def delete_at_beginning(self):
        if not self.head:
            return
        if self.head.next == self.head:
            self.head = None
        else:
            temp = self.head
            while temp.next != self.head:
                temp = temp.next
            temp.next = self.head.next
            self.head = self.head.next
`);
  };

  const deleteAtEnd = () => {
    if (!list.length) return;
    setList((prev) => prev.slice(0, -1));
    setCode(`
    def delete_at_end(self):
        if not self.head:
            return
        prev = None
        curr = self.head
        while curr.next != self.head:
            prev = curr
            curr = curr.next
        if prev:
            prev.next = self.head
        else:
            self.head = None
`);
  };

  const deleteAtPos = () => {
    if (!list.length) return;
    const pos = Math.max(0, Math.min(position, list.length - 1));
    setList((prev) => {
      if (pos === 0) return prev.slice(1);
      const a = prev.slice();
      a.splice(pos, 1);
      return a;
    });
    setCode(`
    def delete_at_position(self, pos):
        if pos == 0:
            return self.delete_at_beginning()
        temp = self.head
        for _ in range(pos - 1):
            temp = temp.next
        temp.next = temp.next.next
`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <h1 className="text-4xl font-bold text-indigo-700 mb-6">
        Circular Linked List Visualizer ⭕
      </h1>

      {/* Inputs */}
      <div className="flex flex-wrap gap-4 mb-6 justify-center">
        <input
          type="number"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Value"
          className="border px-3 py-2 rounded-md w-24 focus:ring focus:ring-indigo-300"
        />
        <input
          type="number"
          value={position}
          onChange={(e) => setPosition(Number(e.target.value))}
          placeholder="Position"
          className="border px-3 py-2 rounded-md w-24 focus:ring focus:ring-purple-300"
        />
      </div>

      {/* Buttons */}
      <div className="flex flex-wrap gap-3 mb-8 justify-center">
        <button onClick={insertAtBeginning} className="btn bg-green-500">
          Insert at Beginning
        </button>
        <button onClick={insertAtEnd} className="btn bg-green-500">
          Insert at End
        </button>
        <button onClick={insertAtPos} className="btn bg-green-500">
          Insert at Position
        </button>
        <button onClick={deleteAtBeginning} className="btn bg-red-500">
          Delete at Beginning
        </button>
        <button onClick={deleteAtEnd} className="btn bg-red-500">
          Delete at End
        </button>
        <button onClick={deleteAtPos} className="btn bg-red-500">
          Delete at Position
        </button>
      </div>

      {/* Visualization */}
      <div className="flex items-center gap-6 flex-wrap justify-center mb-10">
        <div className="text-lg font-bold text-gray-700">Head ⭮</div>
        <AnimatePresence>
          {list.map((node, idx) => (
            <motion.div
              key={node.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center"
            >
              <div className="bg-white border-2 border-indigo-400 rounded-lg px-6 py-4 min-w-[100px] text-center shadow-lg">
                <div className="text-xl font-semibold">{node.value}</div>
                <div className="text-sm text-gray-500">
                  Next: {list[(idx + 1) % list.length]?.value ?? "NULL"}
                </div>
              </div>
              <div className="text-2xl mt-2 text-indigo-600">→</div>
            </motion.div>
          ))}
        </AnimatePresence>
        {/* back to head */}
        {list.length > 0 && (
          <div className="text-2xl text-indigo-600 animate-pulse">⭮</div>
        )}
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

export default CircularLinkedListAnimation;
