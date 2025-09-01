"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Node {
  id: number;
  value: number;
  isHead?: boolean;
  isNew?: boolean;
  isHighlighted?: boolean;
  isBeingDeleted?: boolean;
}

interface AnimationStep {
  line: number;
  code: string;
  explanation: string;
  nodeStates?: Node[];
  variables?: { [key: string]: string | number };
  highlightNodes?: number[];
  pointerPosition?: { current?: number; previous?: number; next?: number };
}

const LinkedListAnimation = () => {
  const [list, setList] = useState<Node[]>([
    { id: 1, value: 10, isHead: true },
    { id: 2, value: 20 },
    { id: 3, value: 30 },
    { id: 4, value: 40 },
  ]);
  
  const [inputValue, setInputValue] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [animationSteps, setAnimationSteps] = useState<AnimationStep[]>([]);
  const [variables, setVariables] = useState<{ [key: string]: string | number }>({});
  const [operationSpeed, setOperationSpeed] = useState(1000);
  const [selectedOperation, setSelectedOperation] = useState<string>("");
  const [pointers, setPointers] = useState<{ current?: number; previous?: number; next?: number }>({});

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const resetAnimation = () => {
    setIsAnimating(false);
    setCurrentStep(0);
    setAnimationSteps([]);
    setVariables({});
    setPointers({});
    // Reset node states
    setList(prev => prev.map(node => ({
      ...node,
      isNew: false,
      isHighlighted: false,
      isBeingDeleted: false
    })));
  };

  const executeStep = useCallback(async (step: AnimationStep) => {
    if (step.variables) {
      setVariables(step.variables);
    }
    if (step.pointerPosition) {
      setPointers(step.pointerPosition);
    }
    if (step.nodeStates) {
      setList(step.nodeStates);
    } else if (step.highlightNodes) {
      setList(prev => prev.map((node, idx) => ({
        ...node,
        isHighlighted: step.highlightNodes?.includes(idx) || false
      })));
    }
    await sleep(operationSpeed);
  }, [operationSpeed]);

  useEffect(() => {
    if (isAnimating && currentStep < animationSteps.length) {
      executeStep(animationSteps[currentStep]).then(() => {
        setCurrentStep(prev => prev + 1);
      });
    } else if (isAnimating && currentStep >= animationSteps.length) {
      setIsAnimating(false);
    }
  }, [isAnimating, currentStep, animationSteps, executeStep]);

  // Animate Insert at Beginning
  const animateInsertAtBeginning = () => {
    if (!inputValue || isNaN(Number(inputValue))) {
      alert("Please enter a valid number");
      return;
    }

    const newValue = Number(inputValue);
    resetAnimation();
    setSelectedOperation("Insert at Beginning");

    const steps: AnimationStep[] = [
      {
        line: 1,
        code: `def insert_at_beginning(self, data):`,
        explanation: "Define function to insert node at the beginning",
        variables: { data: newValue, head: list[0]?.value || "None" }
      },
      {
        line: 2,
        code: `    new_node = Node(${newValue})`,
        explanation: `Create a new node with value ${newValue}`,
        variables: { data: newValue, new_node: newValue, head: list[0]?.value || "None" },
        nodeStates: [
          { id: Date.now(), value: newValue, isNew: true, isHead: false },
          ...list.map(node => ({ ...node, isHead: false }))
        ]
      },
      {
        line: 3,
        code: `    new_node.next = self.head`,
        explanation: `Point new node's next to current head (${list[0]?.value || "None"})`,
        variables: { data: newValue, new_node: newValue, head: list[0]?.value || "None" },
        pointerPosition: { current: 0, next: 1 }
      },
      {
        line: 4,
        code: `    self.head = new_node`,
        explanation: `Update head to point to the new node`,
        variables: { data: newValue, new_node: newValue, head: newValue },
        nodeStates: [
          { id: Date.now(), value: newValue, isNew: false, isHead: true },
          ...list.map(node => ({ ...node, isHead: false }))
        ]
      }
    ];

    setAnimationSteps(steps);
    setInputValue("");
    setIsAnimating(true);
  };

  // Animate Insert at End
  const animateInsertAtEnd = () => {
    if (!inputValue || isNaN(Number(inputValue))) {
      alert("Please enter a valid number");
      return;
    }

    const newValue = Number(inputValue);
    resetAnimation();
    setSelectedOperation("Insert at End");

    const steps: AnimationStep[] = [
      {
        line: 1,
        code: `def insert_at_end(self, data):`,
        explanation: "Define function to insert node at the end",
        variables: { data: newValue }
      },
      {
        line: 2,
        code: `    new_node = Node(${newValue})`,
        explanation: `Create a new node with value ${newValue}`,
        variables: { data: newValue, new_node: newValue }
      },
      {
        line: 3,
        code: `    if not self.head:`,
        explanation: "Check if list is empty",
        variables: { data: newValue, new_node: newValue, head: list[0]?.value || "None" }
      }
    ];

    if (list.length === 0) {
      steps.push({
        line: 4,
        code: `        self.head = new_node`,
        explanation: "List is empty, make new node the head",
        variables: { data: newValue, new_node: newValue, head: newValue },
        nodeStates: [{ id: Date.now(), value: newValue, isNew: true, isHead: true }]
      });
    } else {
      steps.push({
        line: 5,
        code: `    current = self.head`,
        explanation: "Start traversal from head",
        variables: { data: newValue, new_node: newValue, current: list[0]?.value },
        pointerPosition: { current: 0 }
      });

      // Add traversal steps
      for (let i = 0; i < list.length - 1; i++) {
        steps.push({
          line: 6,
          code: `    while current.next:`,
          explanation: `Check if current node (${list[i].value}) has next`,
          variables: { data: newValue, new_node: newValue, current: list[i].value },
          pointerPosition: { current: i },
          highlightNodes: [i]
        });
        
        steps.push({
          line: 7,
          code: `        current = current.next`,
          explanation: `Move to next node (${list[i + 1].value})`,
          variables: { data: newValue, new_node: newValue, current: list[i + 1].value },
          pointerPosition: { current: i + 1 }
        });
      }

      steps.push({
        line: 8,
        code: `    current.next = new_node`,
        explanation: `Link last node to new node`,
        variables: { data: newValue, new_node: newValue, current: list[list.length - 1].value },
        nodeStates: [
          ...list,
          { id: Date.now(), value: newValue, isNew: true, isHead: false }
        ]
      });
    }

    setAnimationSteps(steps);
    setInputValue("");
    setIsAnimating(true);
  };

  // Animate Delete by Value
  const animateDeleteByValue = () => {
    const target = Number(inputValue);
    if (isNaN(target)) {
      alert("Please enter a valid number");
      return;
    }

    resetAnimation();
    setSelectedOperation("Delete by Value");

    const steps: AnimationStep[] = [
      {
        line: 1,
        code: `def delete_by_value(self, target):`,
        explanation: `Define function to delete node with value ${target}`,
        variables: { target: target }
      },
      {
        line: 2,
        code: `    if not self.head:`,
        explanation: "Check if list is empty",
        variables: { target: target, head: list[0]?.value || "None" }
      }
    ];

    if (list.length === 0) {
      steps.push({
        line: 3,
        code: `        return  # List is empty`,
        explanation: "List is empty, nothing to delete",
        variables: { target: target, result: "None" }
      });
    } else {
      // Check if head node is the target
      if (list[0].value === target) {
        steps.push({
          line: 4,
          code: `    if self.head.data == ${target}:`,
          explanation: `Head node value (${list[0].value}) equals target (${target})`,
          variables: { target: target, head: list[0].value },
          highlightNodes: [0]
        });
        
        steps.push({
          line: 5,
          code: `        self.head = self.head.next`,
          explanation: "Update head to next node, removing current head",
          variables: { target: target, head: list[1]?.value || "None" },
          nodeStates: list.slice(1).map((node, idx) => ({
            ...node,
            isHead: idx === 0
          }))
        });
      } else {
        // Traverse to find the target
        steps.push({
          line: 6,
          code: `    current = self.head`,
          explanation: "Start traversal from head",
          variables: { target: target, current: list[0].value },
          pointerPosition: { current: 0 }
        });

        let foundIndex = -1;
        for (let i = 0; i < list.length; i++) {
          steps.push({
            line: 7,
            code: `    while current and current.data != ${target}:`,
            explanation: `Check if current node (${list[i].value}) equals target (${target})`,
            variables: { target: target, current: list[i].value },
            highlightNodes: [i]
          });

          if (list[i].value === target) {
            foundIndex = i;
            steps.push({
              line: 8,
              code: `    # Found target node!`,
              explanation: `Found target node with value ${target} at position ${i}`,
              variables: { target: target, current: list[i].value, found: "true" },
              highlightNodes: [i]
            });
            break;
          } else if (i < list.length - 1) {
            steps.push({
              line: 9,
              code: `        previous = current`,
              explanation: `Store current as previous`,
              variables: { target: target, current: list[i].value, previous: list[i].value },
              pointerPosition: { current: i, previous: i }
            });
            
            steps.push({
              line: 10,
              code: `        current = current.next`,
              explanation: `Move to next node`,
              variables: { target: target, current: list[i + 1].value, previous: list[i].value },
              pointerPosition: { current: i + 1, previous: i }
            });
          }
        }

        if (foundIndex !== -1 && foundIndex > 0) {
          steps.push({
            line: 11,
            code: `    previous.next = current.next`,
            explanation: `Link previous node to current's next, removing target node`,
            variables: { target: target, previous: list[foundIndex - 1].value },
            nodeStates: list.filter((_, idx) => idx !== foundIndex)
          });
        } else if (foundIndex === -1) {
          steps.push({
            line: 12,
            code: `    # Target not found`,
            explanation: `Target value ${target} not found in the list`,
            variables: { target: target, result: "Not found" }
          });
        }
      }
    }

    setAnimationSteps(steps);
    setInputValue("");
    setIsAnimating(true);
  };

  // Animate Search
  const animateSearch = () => {
    const target = Number(inputValue);
    if (isNaN(target)) {
      alert("Please enter a valid number");
      return;
    }

    resetAnimation();
    setSelectedOperation("Search");

    const steps: AnimationStep[] = [
      {
        line: 1,
        code: `def search(self, target):`,
        explanation: `Define function to search for value ${target}`,
        variables: { target: target }
      },
      {
        line: 2,
        code: `    current = self.head`,
        explanation: "Start search from head",
        variables: { target: target, current: list[0]?.value || "None" },
        pointerPosition: { current: 0 }
      }
    ];

    let found = false;
    for (let i = 0; i < list.length; i++) {
      steps.push({
        line: 3,
        code: `    while current:`,
        explanation: `Check if current node exists`,
        variables: { target: target, current: list[i].value, position: i },
        highlightNodes: [i]
      });

      steps.push({
        line: 4,
        code: `        if current.data == ${target}:`,
        explanation: `Compare current value (${list[i].value}) with target (${target})`,
        variables: { target: target, current: list[i].value, position: i },
        highlightNodes: [i]
      });

      if (list[i].value === target) {
        found = true;
        steps.push({
          line: 5,
          code: `            return True  # Found!`,
          explanation: `Target found at position ${i}!`,
          variables: { target: target, current: list[i].value, position: i, result: "Found" },
          highlightNodes: [i]
        });
        break;
      } else {
        steps.push({
          line: 6,
          code: `        current = current.next`,
          explanation: `Move to next node`,
          variables: { target: target, current: list[i + 1]?.value || "None", position: i + 1 },
          pointerPosition: { current: i + 1 }
        });
      }
    }

    if (!found) {
      steps.push({
        line: 7,
        code: `    return False  # Not found`,
        explanation: `Target ${target} not found in the list`,
        variables: { target: target, result: "Not found" }
      });
    }

    setAnimationSteps(steps);
    setInputValue("");
    setIsAnimating(true);
  };

  const manualStepControl = () => {
    if (currentStep < animationSteps.length) {
      executeStep(animationSteps[currentStep]);
      setCurrentStep(prev => prev + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold text-center text-purple-800 mb-8">
          🔗 Interactive Linked List Visualizer
        </h1>

        {/* Operation Controls */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">🎮 Controls</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <input
              type="number"
              placeholder="Value"
              className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <select
              className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-500"
              value={operationSpeed}
              onChange={(e) => setOperationSpeed(Number(e.target.value))}
            >
              <option value={2000}>Slow (2s)</option>
              <option value={1000}>Normal (1s)</option>
              <option value={500}>Fast (0.5s)</option>
            </select>
            <button
              onClick={resetAnimation}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              🔄 Reset
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <button onClick={animateInsertAtBeginning} className="btn-primary">
              ⬅️ Insert at Head
            </button>
            <button onClick={animateInsertAtEnd} className="btn-primary">
              ➡️ Insert at Tail
            </button>
            <button onClick={animateDeleteByValue} className="btn-secondary">
              🗑️ Delete by Value
            </button>
            <button onClick={animateSearch} className="btn-accent">
              🔍 Search
            </button>
            <button
              onClick={() => setIsAnimating(!isAnimating)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                isAnimating ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
            >
              {isAnimating ? '⏸️ Pause' : '▶️ Play'}
            </button>
          </div>
        </div>

        {/* Linked List Visualization */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">🔗 Linked List Visualization</h2>
          <div className="flex items-center gap-4 overflow-x-auto p-4 bg-gray-50 rounded-lg min-h-[120px]">
            {list.length === 0 ? (
              <div className="flex items-center justify-center w-full h-20 text-gray-500 text-lg">
                Empty List - Head → NULL
              </div>
            ) : (
              <AnimatePresence>
                {list.map((node, idx) => (
                  <React.Fragment key={node.id}>
                    {/* Node */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ 
                        opacity: 1, 
                        scale: node.isHighlighted ? 1.1 : 1,
                        borderColor: node.isHighlighted ? '#9333ea' : 
                                   node.isNew ? '#10b981' : 
                                   node.isBeingDeleted ? '#ef4444' : '#d1d5db'
                      }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className={`
                        relative flex flex-col items-center justify-center 
                        w-20 h-16 rounded-lg shadow-md font-bold text-lg border-4
                        ${node.isHighlighted 
                          ? 'bg-purple-200 border-purple-500 text-purple-800' 
                          : node.isNew
                          ? 'bg-green-200 border-green-500 text-green-800'
                          : node.isBeingDeleted
                          ? 'bg-red-200 border-red-500 text-red-800'
                          : 'bg-white border-gray-300 text-gray-700'
                        }
                      `}
                    >
                      {/* Head indicator */}
                      {node.isHead && (
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs font-bold text-purple-600">
                          HEAD
                        </div>
                      )}
                      
                      {/* Node value */}
                      <div className="text-sm">{node.value}</div>
                      
                      {/* Pointer indicators */}
                      {pointers.current === idx && (
                        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs font-bold text-blue-600">
                          CURRENT
                        </div>
                      )}
                      {pointers.previous === idx && (
                        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs font-bold text-orange-600">
                          PREV
                        </div>
                      )}
                    </motion.div>

                    {/* Arrow */}
                    {idx < list.length - 1 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center"
                      >
                        <div className="w-8 h-0.5 bg-gray-400"></div>
                        <div className="w-0 h-0 border-l-4 border-l-gray-400 border-t-2 border-b-2 border-t-transparent border-b-transparent"></div>
                      </motion.div>
                    )}
                  </React.Fragment>
                ))}
                
                {/* NULL indicator */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2"
                >
                  <div className="w-8 h-0.5 bg-gray-400"></div>
                  <div className="px-3 py-1 bg-red-100 border-2 border-red-300 rounded text-red-600 font-bold text-sm">
                    NULL
                  </div>
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </div>

        {/* Animation Controls & Code Display */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Step-by-Step Execution */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              📝 Code Execution {selectedOperation && `- ${selectedOperation}`}
            </h2>
            
            {animationSteps.length > 0 && (
              <>
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">
                      Step {currentStep} of {animationSteps.length}
                    </span>
                    <button
                      onClick={manualStepControl}
                      disabled={currentStep >= animationSteps.length}
                      className="px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:bg-gray-300"
                    >
                      Next Step
                    </button>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(currentStep / animationSteps.length) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {currentStep > 0 && animationSteps[currentStep - 1] && (
                  <div className="bg-gray-900 rounded-lg p-4 mb-4">
                    <pre className="text-green-400 font-mono text-sm mb-2">
                      {animationSteps[currentStep - 1].code}
                    </pre>
                    <p className="text-blue-300 text-sm">
                      💡 {animationSteps[currentStep - 1].explanation}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Variables & State */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">🔧 Variables & Pointers</h2>
            
            <div className="space-y-3">
              {Object.entries(variables).map(([key, value]) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                >
                  <span className="font-mono text-sm text-gray-700">{key}:</span>
                  <span className="font-mono text-sm font-semibold text-purple-600">
                    {String(value)}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Legend */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">🎨 Color Legend</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-purple-200 border-2 border-purple-500 rounded"></div>
                  <span>Currently processing</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-200 border-2 border-green-500 rounded"></div>
                  <span>New node</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-200 border-2 border-red-500 rounded"></div>
                  <span>Being deleted</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .btn-primary {
          @apply px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-medium;
        }
        .btn-secondary {
          @apply px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium;
        }
        .btn-accent {
          @apply px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium;
        }
      `}</style>
    </div>
  );
};

export default LinkedListAnimation;
