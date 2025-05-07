'use client'
import React, { useState } from 'react';
import { motion } from 'framer-motion';

// LinkedList operations
const operations = ['Append', 'Delete', 'Search', 'Insert'];

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
    "    last.next = new_node"
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
    "    prev.next = temp.next"
  ],
  Search: [
    "def search(self, key):",
    "    current = self.head",
    "    while current:",
    "        if current.data == key:",
    "            return True",
    "        current = current.next",
    "    return False"
  ],
  Insert: [
    "def insert(self, prev_node, data):",
    "    if not prev_node:",
    "        return",
    "    new_node = Node(data)",
    "    new_node.next = prev_node.next",
    "    prev_node.next = new_node"
  ]
};

interface NodeType {
  id: number;
  value: string;
}

const LinkedListFlow = () => {
  const [mode, setMode] = useState<'Append' | 'Delete' | 'Search' | 'Insert'>('Append');
  const [currentStep, setCurrentStep] = useState(0);
  const [nodes, setNodes] = useState<NodeType[]>([]);
  const [lastNodeIndex, setLastNodeIndex] = useState<number | null>(null);

  const currentCodeLines = codeLines[mode];

  const handleNext = () => {
    if (mode === 'Append') {
      if (currentStep === 1) { // new_node = Node(data)
        const newNodeValue = (nodes.length + 1).toString();
        const newNode: NodeType = { id: nodes.length + 1, value: newNodeValue };
        setNodes([...nodes, newNode]);
      } else if (currentStep === 3) { // head = new_node
        if (nodes.length === 1) {
          setLastNodeIndex(0);
        }
      } else if (currentStep === 8) { // last.next = new_node
        if (nodes.length > 1) {
          setLastNodeIndex(nodes.length - 1);
        }
      }
    }
    setCurrentStep((prev) => Math.min(prev + 1, currentCodeLines.length - 1));
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleModeChange = (newMode: 'Append' | 'Delete' | 'Search' | 'Insert') => {
    setMode(newMode);
    setCurrentStep(0);
    setNodes([]);
    setLastNodeIndex(null);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Linked List Visualizer</h1>

      {/* Mode Switcher */}
      <div className="flex gap-4 mb-6">
        {operations.map((op) => (
          <button
            key={op}
            onClick={() => handleModeChange(op as 'Append' | 'Delete' | 'Search' | 'Insert')} 
            className={`px-4 py-2 rounded-lg ${mode === op ? 'bg-blue-600 text-white' : 'bg-gray-300 text-black'}`}
          >
            {op}
          </button>
        ))}
      </div>

      {/* Code & Visualization */}
      <div className="grid grid-cols-2 gap-8">

        {/* Code section */}
        <div className="bg-gray-900 p-4 rounded-lg text-white font-mono text-sm h-fit">
          {currentCodeLines.map((line, index) => (
            <pre
              key={index}
              className={`p-1 rounded ${
                index === currentStep ? 'bg-yellow-500 text-black' : ''
              }`}
            >
              {line}
            </pre>
          ))}
        </div>

        {/* LinkedList visualization */}
        <div className="flex items-center flex-wrap gap-4">
          {nodes.map((node, index) => (
            <div key={index} className="flex items-center">
              <motion.div 
                className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                animate={{ scale: lastNodeIndex === index ? 1.2 : 1 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                {node.value}
              </motion.div>
              {index < nodes.length - 1 && (
                <div className="text-2xl mx-2">➡️</div>
              )}
            </div>
          ))}
        </div>

      </div>

      {/* Buttons */}
      <div className="mt-8 flex gap-4">
        <button 
          onClick={handlePrev}
          className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg"
        >
          Prev
        </button>

        <button 
          onClick={handleNext}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default LinkedListFlow;
