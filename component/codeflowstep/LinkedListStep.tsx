"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

const operations = ["Append", "Delete", "Search", "Insert"];

const codeLines = {
  Append: [
    "def append(self, data):",
    "    new_node = Node(data)",
    "    if not self.head:",
    "        self.head = new_node",
    "        return",
    "    last = self.head",
    "    while last.next:",
    "        last = last.next",
    "    last.next = new_node",
  ],
  Delete: [
    "def delete(self, key):",
    "    temp = self.head",
    "    if temp is not None:",
    "        if temp.data == key:",
    "            self.head = temp.next",
    "            return",
    "    while temp is not None:",
    "        if temp.data == key:",
    "            break",
    "        prev = temp",
    "        temp = temp.next",
    "    if temp == None:",
    "        return",
    "    prev.next = temp.next",
  ],
  Search: [
    "def search(self, key):",
    "    current = self.head",
    "    while current:",
    "        if current.data == key:",
    "            return True",
    "        current = current.next",
    "    return False",
  ],
  Insert: [
    "def insert(self, prev_node, data):",
    "    if not prev_node:",
    "        return",
    "    new_node = Node(data)",
    "    new_node.next = prev_node.next",
    "    prev_node.next = new_node",
  ],
};

type OperationType = keyof typeof codeLines;

interface NodeType {
  id: number;
  value: string;
  next?: NodeType | null;
}

const Card: React.FC<{ title: string; value: string; next?: string | null }> = ({ title, value, next }) => {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100 }}
      className="bg-white border border-gray-300 shadow rounded-xl px-4 py-3 w-32 text-center"
    >
      <p className="font-bold text-sm">{title}</p>
      <p className="text-lg font-semibold">{value}</p>
      <p className="text-xs text-gray-500">Next: {next ?? "null"}</p>
    </motion.div>
  );
};

const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, ...props }) => {
  return (
    <button
      {...props}
      className={`px-4 py-2 rounded font-medium transition-colors duration-200 ${
        props.className ?? "bg-gray-200 hover:bg-gray-300"
      }`}
    >
      {children}
    </button>
  );
};

const LinkedListStep = () => {
  const [mode, setMode] = useState<OperationType>("Append");
  const [currentStep, setCurrentStep] = useState(0);
  const [newNode, setNewNode] = useState<NodeType | null>(null);

  const currentCodeLines = codeLines[mode];

  const handleModeChange = (newMode: OperationType) => {
    setMode(newMode);
    setCurrentStep(0);
    setNewNode(null);
  };

  const handlePrev = () => {
    setCurrentStep((prev) => (prev > 0 ? prev - 1 : currentCodeLines.length - 1));
  };

  const handleNext = () => {
    setCurrentStep((prev) => (prev < currentCodeLines.length - 1 ? prev + 1 : 0));
    if (mode === "Append" && currentStep + 1 === 2 && !newNode) {
      const randomNode: NodeType = {
        id: Math.floor(Math.random() * 100),
        value: Math.floor(Math.random() * 100).toString(),
        next: null,
      };
      setNewNode(randomNode);
    }
  };

  // Simulate a linked list: head -> node1 -> node2
  const node2: NodeType = { id: 2, value: "70", next: null };
  const node1: NodeType = { id: 1, value: "50", next: node2 };
  const head: NodeType = { id: 0, value: "head", next: node1 };

  return (
    <div className="m-10">
      <h1 className="text-2xl font-bold mb-4">Linked List Visualization</h1>

      <div className="flex gap-4 mb-4">
        {operations.map((op) => (
          <Button
            key={op}
            onClick={() => handleModeChange(op as OperationType)}
            className={
              mode === op ? "bg-blue-600 text-white" : "bg-gray-200 hover:bg-gray-300"
            }
          >
            {op}
          </Button>
        ))}
      </div>

      <div className="mb-6">
        <p className="font-bold mb-2">Python Code:</p>
        {currentCodeLines.map((line, index) => (
          <motion.pre
            key={index}
            animate={{
              backgroundColor: index === currentStep ? "#FACC15" : "#111827",
              color: index === currentStep ? "#000" : "#fff",
            }}
            transition={{ duration: 0.3 }}
            className="p-1 rounded mb-1 font-mono"
          >
            {line}
          </motion.pre>
        ))}
        <p className="mt-2 text-sm text-gray-500">
          Step {currentStep + 1} of {currentCodeLines.length}
        </p>
      </div>

      <div className="flex gap-4 mb-6">
        <Button onClick={handlePrev}>Prev</Button>
        <Button className="bg-green-500 text-white" onClick={handleNext}>
          Next
        </Button>
        <Button className="bg-red-500 text-white" onClick={() => handleModeChange(mode)}>
          Reset
        </Button>
      </div>

      <div className="flex items-center gap-4 overflow-x-auto pb-4">
        <RenderNode node={head} currentStep={currentStep} />
      </div>

      <div className="mt-6">
        <p className="font-bold mt-10">Current Step:</p>
        <CodeWorkingStep currentStep={currentStep} newNode={newNode} />
      </div>

      <p className="mt-6 text-gray-600">
        Current Mode: <b>{mode}</b>
      </p>
    </div>
  );
};

const RenderNode: React.FC<{ node: NodeType | null; currentStep: number }> = ({ node, currentStep }) => {
  if (!node) return null;

  return (
    <div className="flex items-center gap-4">
      <Card title={node.value === "head" ? "Head" : "Node"} value={node.value} next={node.next?.value} />
      {node.next && <span className="text-xl">➡️</span>}
      {node.next && <RenderNode node={node.next} currentStep={currentStep} />}
    </div>
  );
};

const CodeWorkingStep: React.FC<{
  currentStep: number;
  newNode: NodeType | null;
}> = ({ currentStep, newNode }) => {
  return (
    <div className="mt-4">
      {!(currentStep + 1 === 1) && newNode && (
        <>
          <p className="text-green-500 font-semibold mb-2">
            ✅ Node created successfully!
          </p>
          <Card title="New Node" value={newNode.value} next={null} />
        </>
      )}
      {currentStep + 1 === 3 && (
        <p className="text-yellow-500 font-semibold mb-2">✅ Head is not None!</p>
      )}
      {currentStep + 1 === 7 && (
        <p className="text-green-400 font-semibold mb-2">✅ Traversing through the linked list!</p>
      )}
    </div>
  );
};

export default LinkedListStep;