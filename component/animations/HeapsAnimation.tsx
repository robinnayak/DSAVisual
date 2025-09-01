"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface HeapNode {
  value: number;
  index: number;
  isNew?: boolean;
  isHighlighted?: boolean;
  isBeingSwapped?: boolean;
  isComparing?: boolean;
  level: number;
}

interface AnimationStep {
  line: number;
  code: string;
  explanation: string;
  heapState?: HeapNode[];
  variables?: { [key: string]: string | number };
  highlightIndices?: number[];
  swapIndices?: [number, number];
}

const HeapsAnimation = () => {
  const [heap, setHeap] = useState<HeapNode[]>([
    { value: 90, index: 0, level: 0 },
    { value: 85, index: 1, level: 1 },
    { value: 75, index: 2, level: 1 },
    { value: 70, index: 3, level: 2 },
    { value: 60, index: 4, level: 2 },
    { value: 65, index: 5, level: 2 },
    { value: 55, index: 6, level: 2 },
  ]);
  
  const [inputValue, setInputValue] = useState("");
  const [heapType, setHeapType] = useState<'max' | 'min'>('max');
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [animationSteps, setAnimationSteps] = useState<AnimationStep[]>([]);
  const [variables, setVariables] = useState<{ [key: string]: string | number }>({});
  const [operationSpeed, setOperationSpeed] = useState(1000);
  const [selectedOperation, setSelectedOperation] = useState<string>("");

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // Helper functions
  const parentIndex = (i: number): number => Math.floor((i - 1) / 2);
  const leftChildIndex = (i: number): number => 2 * i + 1;
  const rightChildIndex = (i: number): number => 2 * i + 2;
  const getLevel = (index: number): number => Math.floor(Math.log2(index + 1));

  const compare = (a: number, b: number): boolean => {
    return heapType === 'max' ? a > b : a < b;
  };

  const resetAnimation = () => {
    setIsAnimating(false);
    setCurrentStep(0);
    setAnimationSteps([]);
    setVariables({});
    // Reset node states
    setHeap(prev => prev.map(node => ({
      ...node,
      isNew: false,
      isHighlighted: false,
      isBeingSwapped: false,
      isComparing: false
    })));
  };

  const executeStep = useCallback(async (step: AnimationStep) => {
    if (step.variables) {
      setVariables(step.variables);
    }
    if (step.heapState) {
      setHeap(step.heapState);
    }
    if (step.highlightIndices) {
      setHeap(prev => prev.map((node, idx) => ({
        ...node,
        isHighlighted: step.highlightIndices!.includes(idx),
        isComparing: step.highlightIndices!.includes(idx)
      })));
    }
    if (step.swapIndices) {
      const [i, j] = step.swapIndices;
      setHeap(prev => prev.map((node, idx) => ({
        ...node,
        isBeingSwapped: idx === i || idx === j
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

  // Animate Insert Operation
  const animateInsert = () => {
    if (!inputValue || isNaN(Number(inputValue))) {
      alert("Please enter a valid number");
      return;
    }

    const newValue = Number(inputValue);
    resetAnimation();
    setSelectedOperation(`Insert into ${heapType.toUpperCase()} Heap`);

    const workingHeap = [...heap];
    const newIndex = workingHeap.length;
    
    const steps: AnimationStep[] = [
      {
        line: 1,
        code: `def insert(self, value):`,
        explanation: `Insert ${newValue} into ${heapType} heap`,
        variables: { 
          value: newValue, 
          heap_size: workingHeap.length,
          heap_type: heapType.toUpperCase()
        }
      },
      {
        line: 2,
        code: `    self.heap.append(${newValue})`,
        explanation: `Add ${newValue} to the end of heap array`,
        variables: { 
          value: newValue, 
          new_index: newIndex,
          heap_size: workingHeap.length + 1
        },
        heapState: [
          ...workingHeap,
          { value: newValue, index: newIndex, level: getLevel(newIndex), isNew: true }
        ]
      },
      {
        line: 3,
        code: `    self.heapify_up(${newIndex})`,
        explanation: `Restore heap property by bubbling up from index ${newIndex}`,
        variables: { 
          current_index: newIndex,
          heap_size: workingHeap.length + 1
        }
      }
    ];

    // Add the new element and simulate heapify up
    workingHeap.push({ value: newValue, index: newIndex, level: getLevel(newIndex) });
    let currentIndex = newIndex;

    while (currentIndex > 0) {
      const parentIdx = parentIndex(currentIndex);
      const currentValue = workingHeap[currentIndex].value;
      const parentValue = workingHeap[parentIdx].value;

      steps.push({
        line: 4,
        code: `    # Compare with parent: ${currentValue} vs ${parentValue}`,
        explanation: `Compare node ${currentValue} at index ${currentIndex} with parent ${parentValue} at index ${parentIdx}`,
        variables: {
          current_index: currentIndex,
          parent_index: parentIdx,
          current_value: currentValue,
          parent_value: parentValue,
          comparison: compare(currentValue, parentValue) ? `${currentValue} ${heapType === 'max' ? '>' : '<'} ${parentValue}` : `${currentValue} ${heapType === 'max' ? '≤' : '≥'} ${parentValue}`
        },
        highlightIndices: [currentIndex, parentIdx]
      });

      if (compare(currentValue, parentValue)) {
        // Swap needed
        steps.push({
          line: 5,
          code: `    # Swap: ${currentValue} ↔ ${parentValue}`,
          explanation: `Heap property violated! Swap ${currentValue} with parent ${parentValue}`,
          variables: {
            swap_from: currentIndex,
            swap_to: parentIdx,
            reason: `${currentValue} ${heapType === 'max' ? '>' : '<'} ${parentValue}`
          },
          swapIndices: [currentIndex, parentIdx]
        });

        // Perform the swap
        [workingHeap[currentIndex], workingHeap[parentIdx]] = [workingHeap[parentIdx], workingHeap[currentIndex]];
        workingHeap[currentIndex].index = currentIndex;
        workingHeap[parentIdx].index = parentIdx;

        steps.push({
          line: 6,
          code: `    # After swap: [${workingHeap.map(n => n.value).join(', ')}]`,
          explanation: `Swapped successfully. Continue checking upward.`,
          heapState: [...workingHeap],
          variables: {
            current_index: parentIdx,
            heap_array: `[${workingHeap.map(n => n.value).join(', ')}]`
          }
        });

        currentIndex = parentIdx;
      } else {
        steps.push({
          line: 7,
          code: `    # Heap property satisfied`,
          explanation: `${heapType.toUpperCase()} heap property is satisfied. Insert complete!`,
          variables: {
            final_position: currentIndex,
            heap_size: workingHeap.length,
            result: "Insert successful"
          }
        });
        break;
      }
    }

    if (currentIndex === 0) {
      steps.push({
        line: 8,
        code: `    # Reached root - insert complete`,
        explanation: `Element ${newValue} reached the root. ${heapType.toUpperCase()} heap property maintained.`,
        variables: {
          final_position: 0,
          new_root: newValue,
          heap_size: workingHeap.length
        }
      });
    }

    setAnimationSteps(steps);
    setInputValue("");
    setIsAnimating(true);
  };

  // Animate Extract Operation (Extract Max/Min)
  const animateExtract = () => {
    if (heap.length === 0) {
      alert("Heap is empty!");
      return;
    }

    resetAnimation();
    setSelectedOperation(`Extract ${heapType === 'max' ? 'Maximum' : 'Minimum'}`);

    const workingHeap = [...heap];
    const rootValue = workingHeap[0].value;
    const lastValue = workingHeap[workingHeap.length - 1].value;

    const steps: AnimationStep[] = [
      {
        line: 1,
        code: `def extract_${heapType}(self):`,
        explanation: `Extract ${heapType === 'max' ? 'maximum' : 'minimum'} element from heap`,
        variables: { 
          heap_size: workingHeap.length,
          root_value: rootValue
        }
      },
      {
        line: 2,
        code: `    if self.is_empty(): return None`,
        explanation: `Check if heap is empty`,
        variables: { is_empty: "false", heap_size: workingHeap.length }
      },
      {
        line: 3,
        code: `    max_val = self.heap[0]  # ${rootValue}`,
        explanation: `Store root value ${rootValue} to return`,
        variables: { 
          extracted_value: rootValue,
          heap_size: workingHeap.length
        },
        highlightIndices: [0]
      },
      {
        line: 4,
        code: `    # Move last element to root`,
        explanation: `Replace root with last element ${lastValue}`,
        variables: { 
          last_element: lastValue,
          last_index: workingHeap.length - 1
        },
        highlightIndices: [0, workingHeap.length - 1]
      }
    ];

    // Replace root with last element and remove last
    workingHeap[0] = { 
      ...workingHeap[workingHeap.length - 1], 
      index: 0, 
      level: 0,
      isNew: true 
    };
    workingHeap.pop();

    steps.push({
      line: 5,
      code: `    self.heap[0] = ${lastValue}`,
      explanation: `Root now contains ${lastValue}. Remove last element.`,
      variables: { 
        new_root: lastValue,
        heap_size: workingHeap.length
      },
      heapState: [...workingHeap]
    });

    steps.push({
      line: 6,
      code: `    self.heapify_down(0)`,
      explanation: `Restore heap property by sinking down from root`,
      variables: { 
        current_index: 0,
        heap_size: workingHeap.length
      }
    });

    // Simulate heapify down
    let currentIndex = 0;
    
    while (true) {
      const leftIdx = leftChildIndex(currentIndex);
      const rightIdx = rightChildIndex(currentIndex);
      let extremeIdx = currentIndex;
      
      steps.push({
        line: 7,
        code: `    # Find ${heapType === 'max' ? 'largest' : 'smallest'} among node and children`,
        explanation: `Compare node ${workingHeap[currentIndex].value} with its children`,
        variables: {
          current_index: currentIndex,
          current_value: workingHeap[currentIndex].value,
          left_child: leftIdx < workingHeap.length ? leftIdx : "none",
          right_child: rightIdx < workingHeap.length ? rightIdx : "none"
        },
        highlightIndices: [currentIndex, leftIdx, rightIdx].filter(i => i < workingHeap.length)
      });

      // Check left child
      if (leftIdx < workingHeap.length && compare(workingHeap[leftIdx].value, workingHeap[extremeIdx].value)) {
        extremeIdx = leftIdx;
      }

      // Check right child
      if (rightIdx < workingHeap.length && compare(workingHeap[rightIdx].value, workingHeap[extremeIdx].value)) {
        extremeIdx = rightIdx;
      }

      if (extremeIdx !== currentIndex) {
        const extremeValue = workingHeap[extremeIdx].value;
        const currentValue = workingHeap[currentIndex].value;

        steps.push({
          line: 8,
          code: `    # Swap ${currentValue} ↔ ${extremeValue}`,
          explanation: `Heap property violated! Swap ${currentValue} with ${extremeValue}`,
          variables: {
            swap_from: currentIndex,
            swap_to: extremeIdx,
            reason: `${extremeValue} ${heapType === 'max' ? '>' : '<'} ${currentValue}`
          },
          swapIndices: [currentIndex, extremeIdx]
        });

        // Perform swap
        [workingHeap[currentIndex], workingHeap[extremeIdx]] = [workingHeap[extremeIdx], workingHeap[currentIndex]];
        workingHeap[currentIndex].index = currentIndex;
        workingHeap[extremeIdx].index = extremeIdx;

        steps.push({
          line: 9,
          code: `    # Continue heapify from index ${extremeIdx}`,
          explanation: `Swapped successfully. Continue checking downward.`,
          heapState: [...workingHeap],
          variables: {
            current_index: extremeIdx,
            heap_array: `[${workingHeap.map(n => n.value).join(', ')}]`
          }
        });

        currentIndex = extremeIdx;
      } else {
        steps.push({
          line: 10,
          code: `    # Heap property restored`,
          explanation: `${heapType.toUpperCase()} heap property is satisfied. Extract complete!`,
          variables: {
            extracted_value: rootValue,
            final_heap_size: workingHeap.length,
            result: "Extract successful"
          }
        });
        break;
      }
    }

    steps.push({
      line: 11,
      code: `    return ${rootValue}`,
      explanation: `Return extracted ${heapType === 'max' ? 'maximum' : 'minimum'} value: ${rootValue}`,
      variables: {
        returned_value: rootValue,
        operation_complete: "true"
      }
    });

    setAnimationSteps(steps);
    setIsAnimating(true);
  };

  // Animate Heap Sort
  const animateHeapSort = () => {
    resetAnimation();
    setSelectedOperation("Heap Sort");

    const workingArray = heap.map(node => node.value);
    const sortedResults: number[] = [];
    let workingHeap = [...heap];

    const steps: AnimationStep[] = [
      {
        line: 1,
        code: `def heap_sort(arr):`,
        explanation: `Sort array using heap sort algorithm`,
        variables: { 
          array: `[${workingArray.join(', ')}]`,
          sorted: "[]"
        }
      },
      {
        line: 2,
        code: `    # Build max heap first`,
        explanation: `Array is already a valid ${heapType} heap`,
        variables: { 
          heap_type: heapType.toUpperCase(),
          heap_size: workingHeap.length
        }
      }
    ];

    // Extract elements one by one
    while (workingHeap.length > 0) {
      const maxValue = workingHeap[0].value;
      sortedResults.push(maxValue);

      steps.push({
        line: 3,
        code: `    # Extract ${heapType === 'max' ? 'maximum' : 'minimum'}: ${maxValue}`,
        explanation: `Extract root ${maxValue} and add to sorted array`,
        variables: {
          extracted: maxValue,
          sorted: `[${sortedResults.join(', ')}]`,
          remaining_size: workingHeap.length - 1
        },
        highlightIndices: [0]
      });

      if (workingHeap.length === 1) {
        workingHeap = [];
        break;
      }

      // Move last to root
      workingHeap[0] = { ...workingHeap[workingHeap.length - 1], index: 0, level: 0 };
      workingHeap.pop();
      
      // Update indices
      workingHeap.forEach((node, idx) => {
        node.index = idx;
        node.level = getLevel(idx);
      });

      steps.push({
        line: 4,
        code: `    # Heapify remaining elements`,
        explanation: `Restore heap property for remaining ${workingHeap.length} elements`,
        variables: {
          heap_size: workingHeap.length,
          sorted: `[${sortedResults.join(', ')}]`
        },
        heapState: [...workingHeap]
      });

      // Simulate heapify down for visualization
      let currentIndex = 0;
      while (currentIndex < workingHeap.length) {
        const leftIdx = leftChildIndex(currentIndex);
        const rightIdx = rightChildIndex(currentIndex);
        let extremeIdx = currentIndex;

        if (leftIdx < workingHeap.length && compare(workingHeap[leftIdx].value, workingHeap[extremeIdx].value)) {
          extremeIdx = leftIdx;
        }
        if (rightIdx < workingHeap.length && compare(workingHeap[rightIdx].value, workingHeap[extremeIdx].value)) {
          extremeIdx = rightIdx;
        }

        if (extremeIdx !== currentIndex) {
          [workingHeap[currentIndex], workingHeap[extremeIdx]] = [workingHeap[extremeIdx], workingHeap[currentIndex]];
          workingHeap.forEach((node, idx) => {
            node.index = idx;
            node.level = getLevel(idx);
          });
          currentIndex = extremeIdx;
        } else {
          break;
        }
      }
    }

    steps.push({
      line: 5,
      code: `    return sorted_array`,
      explanation: `Heap sort complete! Final sorted array: [${sortedResults.join(', ')}]`,
      variables: {
        final_sorted: `[${sortedResults.join(', ')}]`,
        time_complexity: "O(n log n)",
        space_complexity: "O(1)"
      }
    });

    setAnimationSteps(steps);
    setIsAnimating(true);
  };

  const manualStepControl = () => {
    if (currentStep < animationSteps.length) {
      executeStep(animationSteps[currentStep]);
      setCurrentStep(prev => prev + 1);
    }
  };

  // Calculate tree layout positions
  const getNodePosition = (index: number, level: number) => {
    const maxWidth = 800;
    const levelWidth = maxWidth / Math.pow(2, level);
    const positionInLevel = index - (Math.pow(2, level) - 1);
    const x = (positionInLevel + 0.5) * levelWidth;
    const y = level * 80 + 50;
    return { x, y };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold text-center text-yellow-800 mb-8">
          🌋 Interactive Heap Visualizer
        </h1>

        {/* Operation Controls */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">🎮 Controls</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <input
              type="number"
              placeholder="Enter value"
              className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <select
              className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-orange-500"
              value={heapType}
              onChange={(e) => setHeapType(e.target.value as 'max' | 'min')}
            >
              <option value="max">Max Heap</option>
              <option value="min">Min Heap</option>
            </select>
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

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button onClick={animateInsert} className="btn-primary">
              ➕ Insert
            </button>
            <button onClick={animateExtract} className="btn-secondary">
              ⬆️ Extract {heapType === 'max' ? 'Max' : 'Min'}
            </button>
            <button onClick={animateHeapSort} className="btn-special">
              🔄 Heap Sort
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

        {/* Heap Visualization */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            🌋 {heapType.toUpperCase()} Heap Tree Visualization
          </h2>
          
          <div className="relative bg-gray-50 rounded-lg p-8 overflow-x-auto" style={{ minHeight: '400px' }}>
            {heap.length === 0 ? (
              <div className="flex items-center justify-center h-40 text-gray-500 text-lg">
                Empty Heap
              </div>
            ) : (
              <div className="relative" style={{ width: '800px', height: `${(Math.max(...heap.map(n => n.level || 0)) + 1) * 80 + 100}px` }}>
                {/* Render edges first */}
                {heap.map((node, index) => {
                  const leftChildIdx = leftChildIndex(index);
                  const rightChildIdx = rightChildIndex(index);
                  const nodePos = getNodePosition(index, node.level || 0);
                  
                  return (
                    <div key={`edges-${index}`}>
                      {/* Left child edge */}
                      {leftChildIdx < heap.length && (
                        <svg
                          className="absolute"
                          style={{ 
                            left: 0, 
                            top: 0, 
                            width: '800px', 
                            height: `${(Math.max(...heap.map(n => n.level || 0)) + 1) * 80 + 100}px`,
                            pointerEvents: 'none'
                          }}
                        >
                          <line
                            x1={nodePos.x}
                            y1={nodePos.y + 25}
                            x2={getNodePosition(leftChildIdx, heap[leftChildIdx].level || 0).x}
                            y2={getNodePosition(leftChildIdx, heap[leftChildIdx].level || 0).y - 25}
                            stroke="#94a3b8"
                            strokeWidth="2"
                          />
                        </svg>
                      )}
                      {/* Right child edge */}
                      {rightChildIdx < heap.length && (
                        <svg
                          className="absolute"
                          style={{ 
                            left: 0, 
                            top: 0, 
                            width: '800px', 
                            height: `${(Math.max(...heap.map(n => n.level || 0)) + 1) * 80 + 100}px`,
                            pointerEvents: 'none'
                          }}
                        >
                          <line
                            x1={nodePos.x}
                            y1={nodePos.y + 25}
                            x2={getNodePosition(rightChildIdx, heap[rightChildIdx].level || 0).x}
                            y2={getNodePosition(rightChildIdx, heap[rightChildIdx].level || 0).y - 25}
                            stroke="#94a3b8"
                            strokeWidth="2"
                          />
                        </svg>
                      )}
                    </div>
                  );
                })}

                {/* Render nodes */}
                <AnimatePresence>
                  {heap.map((node, index) => {
                    const position = getNodePosition(index, node.level || 0);
                    return (
                      <motion.div
                        key={`node-${index}-${node.value}`}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ 
                          opacity: 1, 
                          scale: node.isHighlighted || node.isBeingSwapped ? 1.2 : 1,
                          x: position.x - 25,
                          y: position.y - 25
                        }}
                        exit={{ opacity: 0, scale: 0 }}
                        transition={{ 
                          type: "spring", 
                          stiffness: 300, 
                          damping: 20 
                        }}
                        className={`
                          absolute w-12 h-12 rounded-full flex items-center justify-center
                          font-bold text-white text-sm border-4 transition-all duration-300
                          ${node.isHighlighted 
                            ? 'bg-yellow-500 border-yellow-600 ring-4 ring-yellow-300' 
                            : node.isNew
                            ? 'bg-green-500 border-green-600'
                            : node.isBeingSwapped
                            ? 'bg-red-500 border-red-600'
                            : node.isComparing
                            ? 'bg-blue-500 border-blue-600'
                            : index === 0
                            ? 'bg-purple-600 border-purple-700'
                            : 'bg-orange-500 border-orange-600'
                          }
                        `}
                      >
                        {node.value}
                        {/* Index label */}
                        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-500">
                          {index}
                        </div>
                        {/* Root indicator */}
                        {index === 0 && (
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs font-bold text-purple-600">
                            ROOT
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Array Representation */}
          <div className="mt-6 p-4 bg-gray-100 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-2">📋 Array Representation</h3>
            <div className="flex items-center gap-2 overflow-x-auto">
              {heap.map((node, index) => (
                <div
                  key={index}
                  className={`
                    flex-shrink-0 w-12 h-12 rounded border-2 flex items-center justify-center font-bold
                    ${node.isHighlighted 
                      ? 'bg-yellow-200 border-yellow-500' 
                      : node.isNew
                      ? 'bg-green-200 border-green-500'
                      : 'bg-white border-gray-300'
                    }
                  `}
                >
                  {node.value}
                  <div className="absolute mt-8 text-xs text-gray-500">{index}</div>
                </div>
              ))}
            </div>
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
                      className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:bg-gray-300"
                    >
                      Next Step
                    </button>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-600 h-2 rounded-full transition-all duration-300"
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

          {/* Variables & Properties */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">🔧 Variables & Properties</h2>
            
            <div className="space-y-3">
              {Object.entries(variables).map(([key, value]) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                >
                  <span className="font-mono text-sm text-gray-700">{key}:</span>
                  <span className="font-mono text-sm font-semibold text-yellow-600">
                    {String(value)}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Heap Properties */}
            <div className="mt-6 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg">
              <h3 className="font-semibold text-yellow-800 mb-2">🌋 Heap Properties</h3>
              <div className="text-sm text-yellow-700 space-y-1">
                <div>• <strong>Type:</strong> {heapType.toUpperCase()} Heap</div>
                <div>• <strong>Size:</strong> {heap.length} elements</div>
                <div>• <strong>Height:</strong> {heap.length > 0 ? Math.floor(Math.log2(heap.length)) + 1 : 0}</div>
                <div>• <strong>Root:</strong> {heap.length > 0 ? heap[0].value : 'Empty'}</div>
              </div>
            </div>

            {/* Complexity Analysis */}
            <div className="mt-4 p-4 bg-orange-50 border-2 border-orange-200 rounded-lg">
              <h3 className="font-semibold text-orange-800 mb-2">⚡ Time Complexities</h3>
              <div className="text-sm text-orange-700 space-y-1">
                <div>• <strong>Insert:</strong> O(log n)</div>
                <div>• <strong>Extract:</strong> O(log n)</div>
                <div>• <strong>Peek:</strong> O(1)</div>
                <div>• <strong>Heap Sort:</strong> O(n log n)</div>
              </div>
            </div>

            {/* Legend */}
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">🎨 Color Legend</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                  <span>Currently highlighted/comparing</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <span>Newly inserted element</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                  <span>Being swapped</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-purple-600 rounded-full"></div>
                  <span>Root node</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .btn-primary {
          @apply px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors font-medium;
        }
        .btn-secondary {
          @apply px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium;
        }
        .btn-special {
          @apply px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-medium;
        }
      `}</style>
    </div>
  );
};

export default HeapsAnimation;
