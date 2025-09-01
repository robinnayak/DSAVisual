"use client";

import React, { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface AnimationStep {
  line: number;
  code: string;
  explanation: string;
  highlight?: number[];
  variables?: { [key: string]: string | number };
  arrayState?: number[];
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
  const [variables, setVariables] = useState<{ [key: string]: string | number }>({});
  const [operationSpeed, setOperationSpeed] = useState(1000);
  const [selectedOperation, setSelectedOperation] = useState<string>("");

  // Animation control
  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const resetAnimation = () => {
    setIsAnimating(false);
    setCurrentStep(0);
    setAnimationSteps([]);
    setArrayState({
      values: [...arr],
      highlighted: [],
      comparing: [],
      accessing: null
    });
    setVariables({});
  };

  // Step-by-step execution
  const executeStep = useCallback(async (step: AnimationStep) => {
    if (step.highlight) {
      setArrayState(prev => ({ ...prev, highlighted: step.highlight || [] }));
    }
    if (step.variables) {
      setVariables(step.variables);
    }
    if (step.arrayState) {
      setArrayState(prev => ({ ...prev, values: step.arrayState || prev.values }));
    }
    await sleep(operationSpeed);
  }, [operationSpeed]);

  // Auto-play animation
  useEffect(() => {
    if (isAnimating && currentStep < animationSteps.length) {
      executeStep(animationSteps[currentStep]).then(() => {
        setCurrentStep(prev => prev + 1);
      });
    } else if (isAnimating && currentStep >= animationSteps.length) {
      setIsAnimating(false);
    }
  }, [isAnimating, currentStep, animationSteps, executeStep]);

  // Linear Search Animation
  const animateLinearSearch = async () => {
    const target = Number(value);
    if (isNaN(target)) return;

    resetAnimation();
    setSelectedOperation("Linear Search");

    const steps: AnimationStep[] = [
      {
        line: 1,
        code: `def linear_search(arr, target):`,
        explanation: "Define the linear search function with array and target parameters",
        variables: { arr: `[${arr.join(', ')}]`, target: target }
      },
      {
        line: 2,
        code: `    for i in range(len(arr)):`,
        explanation: "Start loop to iterate through each index of the array",
        variables: { arr: `[${arr.join(', ')}]`, target: target, i: 0 }
      }
    ];

    // Add steps for each iteration
    for (let i = 0; i < arr.length; i++) {
      steps.push({
        line: 3,
        code: `        if arr[${i}] == ${target}:`,
        explanation: `Check if element at index ${i} (value: ${arr[i]}) equals target ${target}`,
        highlight: [i],
        variables: { arr: `[${arr.join(', ')}]`, target: target, i: i, 'arr[i]': arr[i] }
      });

      if (arr[i] === target) {
        steps.push({
          line: 4,
          code: `            return ${i}`,
          explanation: `Found target! Return index ${i}`,
          highlight: [i],
          variables: { arr: `[${arr.join(', ')}]`, target: target, i: i, result: i }
        });
        break;
      } else {
        steps.push({
          line: 5,
          code: `        # Continue searching...`,
          explanation: `Element ${arr[i]} ≠ ${target}, continue to next index`,
          highlight: [],
          variables: { arr: `[${arr.join(', ')}]`, target: target, i: i + 1 }
        });
      }
    }

    if (!arr.includes(target)) {
      steps.push({
        line: 6,
        code: `    return -1`,
        explanation: "Target not found in array, return -1",
        variables: { arr: `[${arr.join(', ')}]`, target: target, result: -1 }
      });
    }

    setAnimationSteps(steps);
    setIsAnimating(true);
  };

  // Binary Search Animation (for sorted arrays)
  const animateBinarySearch = async () => {
    const target = Number(value);
    if (isNaN(target)) return;

    // First sort the array for binary search
    const sortedArr = [...arr].sort((a, b) => a - b);
    setArr(sortedArr);

    resetAnimation();
    setSelectedOperation("Binary Search");

    const steps: AnimationStep[] = [
      {
        line: 1,
        code: `def binary_search(arr, target):`,
        explanation: "Define binary search function (requires sorted array)",
        variables: { arr: `[${sortedArr.join(', ')}]`, target: target }
      },
      {
        line: 2,
        code: `    left, right = 0, len(arr) - 1`,
        explanation: "Initialize left and right pointers",
        variables: { arr: `[${sortedArr.join(', ')}]`, target: target, left: 0, right: sortedArr.length - 1 }
      }
    ];

    let left = 0;
    let right = sortedArr.length - 1;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      
      steps.push({
        line: 3,
        code: `    while left <= right:`,
        explanation: `Continue while search space exists (left: ${left}, right: ${right})`,
        highlight: [left, right],
        variables: { arr: `[${sortedArr.join(', ')}]`, target: target, left: left, right: right }
      });

      steps.push({
        line: 4,
        code: `        mid = (left + right) // 2`,
        explanation: `Calculate middle index: (${left} + ${right}) // 2 = ${mid}`,
        highlight: [mid],
        variables: { arr: `[${sortedArr.join(', ')}]`, target: target, left: left, right: right, mid: mid }
      });

      steps.push({
        line: 5,
        code: `        if arr[${mid}] == ${target}:`,
        explanation: `Check if middle element ${sortedArr[mid]} equals target ${target}`,
        highlight: [mid],
        variables: { arr: `[${sortedArr.join(', ')}]`, target: target, left: left, right: right, mid: mid, 'arr[mid]': sortedArr[mid] }
      });

      if (sortedArr[mid] === target) {
        steps.push({
          line: 6,
          code: `            return ${mid}`,
          explanation: `Found target! Return index ${mid}`,
          highlight: [mid],
          variables: { arr: `[${sortedArr.join(', ')}]`, target: target, result: mid }
        });
        break;
      } else if (sortedArr[mid] < target) {
        steps.push({
          line: 7,
          code: `        elif arr[${mid}] < ${target}:`,
          explanation: `${sortedArr[mid]} < ${target}, search right half`,
          highlight: [mid],
          variables: { arr: `[${sortedArr.join(', ')}]`, target: target, left: left, right: right, mid: mid }
        });
        steps.push({
          line: 8,
          code: `            left = ${mid + 1}`,
          explanation: `Update left pointer to ${mid + 1}`,
          variables: { arr: `[${sortedArr.join(', ')}]`, target: target, left: mid + 1, right: right }
        });
        left = mid + 1;
      } else {
        steps.push({
          line: 9,
          code: `        else:`,
          explanation: `${sortedArr[mid]} > ${target}, search left half`,
          highlight: [mid],
          variables: { arr: `[${sortedArr.join(', ')}]`, target: target, left: left, right: right, mid: mid }
        });
        steps.push({
          line: 10,
          code: `            right = ${mid - 1}`,
          explanation: `Update right pointer to ${mid - 1}`,
          variables: { arr: `[${sortedArr.join(', ')}]`, target: target, left: left, right: mid - 1 }
        });
        right = mid - 1;
      }
    }

    if (left > right) {
      steps.push({
        line: 11,
        code: `    return -1`,
        explanation: "Target not found in array, return -1",
        variables: { arr: `[${sortedArr.join(', ')}]`, target: target, result: -1 }
      });
    }

    setAnimationSteps(steps);
    setIsAnimating(true);
  };

  // Insertion Sort Animation
  const animateInsertionSort = async () => {
    resetAnimation();
    setSelectedOperation("Insertion Sort");

    const steps: AnimationStep[] = [
      {
        line: 1,
        code: `def insertion_sort(arr):`,
        explanation: "Define insertion sort function",
        variables: { arr: `[${arr.join(', ')}]` }
      },
      {
        line: 2,
        code: `    for i in range(1, len(arr)):`,
        explanation: "Start from second element (index 1)",
        variables: { arr: `[${arr.join(', ')}]`, i: 1 }
      }
    ];

    const workingArr = [...arr];

    for (let i = 1; i < workingArr.length; i++) {
      const key = workingArr[i];
      let j = i - 1;

      steps.push({
        line: 3,
        code: `        key = arr[${i}]`,
        explanation: `Store current element ${key} as key`,
        highlight: [i],
        variables: { arr: `[${workingArr.join(', ')}]`, i: i, key: key },
        arrayState: [...workingArr]
      });

      steps.push({
        line: 4,
        code: `        j = ${i} - 1`,
        explanation: `Initialize j to ${j} (previous index)`,
        highlight: [j],
        variables: { arr: `[${workingArr.join(', ')}]`, i: i, key: key, j: j },
        arrayState: [...workingArr]
      });

      while (j >= 0 && workingArr[j] > key) {
        steps.push({
          line: 5,
          code: `        while j >= 0 and arr[${j}] > ${key}:`,
          explanation: `Check if ${workingArr[j]} > ${key}. Yes, need to shift right`,
          highlight: [j, i],
          variables: { arr: `[${workingArr.join(', ')}]`, i: i, key: key, j: j },
          arrayState: [...workingArr]
        });

        workingArr[j + 1] = workingArr[j];
        
        steps.push({
          line: 6,
          code: `            arr[${j + 1}] = arr[${j}]`,
          explanation: `Shift ${workingArr[j]} one position to the right`,
          highlight: [j, j + 1],
          variables: { arr: `[${workingArr.join(', ')}]`, i: i, key: key, j: j },
          arrayState: [...workingArr]
        });

        j--;
        
        steps.push({
          line: 7,
          code: `            j -= 1`,
          explanation: `Move j one position left to ${j}`,
          highlight: j >= 0 ? [j] : [],
          variables: { arr: `[${workingArr.join(', ')}]`, i: i, key: key, j: j },
          arrayState: [...workingArr]
        });
      }

      workingArr[j + 1] = key;
      
      steps.push({
        line: 8,
        code: `        arr[${j + 1}] = ${key}`,
        explanation: `Place key ${key} at its correct position ${j + 1}`,
        highlight: [j + 1],
        variables: { arr: `[${workingArr.join(', ')}]`, i: i, key: key, j: j },
        arrayState: [...workingArr]
      });
    }

    steps.push({
      line: 9,
      code: `    return arr`,
      explanation: "Array is now sorted!",
      variables: { arr: `[${workingArr.join(', ')}]`, result: `[${workingArr.join(', ')}]` },
      arrayState: [...workingArr]
    });

    setAnimationSteps(steps);
    setIsAnimating(true);
  };

  // Basic operations with animations
  const handleAppend = () => {
    const v = Number(value);
    if (isNaN(v)) return;
    
    setArr((prev) => [...prev, v]);
    setValue("");
    
    resetAnimation();
    setSelectedOperation("Append");
    setAnimationSteps([
      {
        line: 1,
        code: `arr.append(${v})`,
        explanation: `Add ${v} to the end of the array`,
        variables: { arr: `[${[...arr, v].join(', ')}]`, new_element: v }
      }
    ]);
  };

  const handleInsertAt = () => {
    const v = Number(value);
    const i = Math.max(0, Math.min(index, arr.length));
    if (isNaN(v)) return;
    
    const newArr = [...arr.slice(0, i), v, ...arr.slice(i)];
    setArr(newArr);
    setValue("");
    
    resetAnimation();
    setSelectedOperation("Insert at Index");
    setAnimationSteps([
      {
        line: 1,
        code: `arr.insert(${i}, ${v})`,
        explanation: `Insert ${v} at index ${i}`,
        variables: { arr: `[${newArr.join(', ')}]`, index: i, value: v }
      }
    ]);
  };

  const manualStepControl = () => {
    if (currentStep < animationSteps.length) {
      executeStep(animationSteps[currentStep]);
      setCurrentStep(prev => prev + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold text-center text-indigo-800 mb-8">
          🎯 Interactive Array Visualizer
        </h1>

        {/* Operation Controls */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">🎮 Controls</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <input
              type="number"
              placeholder="Value"
              className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
            <input
              type="number"
              placeholder="Index"
              className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
              value={index}
              onChange={(e) => setIndex(Number(e.target.value))}
            />
            <select
              className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-500"
              value={operationSpeed}
              onChange={(e) => setOperationSpeed(Number(e.target.value))}
            >
              <option value={2000}>Slow (2s)</option>
              <option value={1000}>Normal (1s)</option>
              <option value={500}>Fast (0.5s)</option>
              <option value={250}>Very Fast (0.25s)</option>
            </select>
            <button
              onClick={resetAnimation}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              🔄 Reset
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <button onClick={handleAppend} className="btn-primary">
              ➕ Append
            </button>
            <button onClick={handleInsertAt} className="btn-primary">
              📍 Insert @Idx
            </button>
            <button onClick={animateLinearSearch} className="btn-secondary">
              🔍 Linear Search
            </button>
            <button onClick={animateBinarySearch} className="btn-secondary">
              🎯 Binary Search
            </button>
            <button onClick={animateInsertionSort} className="btn-accent">
              📊 Insertion Sort
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

        {/* Array Visualization */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">📊 Array Visualization</h2>
          <div className="flex gap-2 mb-4 overflow-x-auto p-4 bg-gray-50 rounded-lg">
            <AnimatePresence>
              {(arrayState.values.length > 0 ? arrayState.values : arr).map((el, idx) => (
                <motion.div
                  key={`${el}-${idx}`}
                  layout
                  initial={{ opacity: 0, scale: 0.8, y: -20 }}
                  animate={{ 
                    opacity: 1, 
                    scale: arrayState.highlighted.includes(idx) ? 1.1 : 1,
                    y: 0 
                  }}
                  exit={{ opacity: 0, scale: 0.8, y: 20 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className={`
                    flex flex-col items-center justify-center 
                    w-16 h-20 rounded-lg shadow-md font-bold text-lg
                    ${arrayState.highlighted.includes(idx) 
                      ? 'bg-yellow-300 border-4 border-yellow-500 text-yellow-800' 
                      : arrayState.comparing.includes(idx)
                      ? 'bg-blue-300 border-4 border-blue-500 text-blue-800'
                      : arrayState.accessing === idx
                      ? 'bg-green-300 border-4 border-green-500 text-green-800'
                      : 'bg-white border-2 border-gray-300 text-gray-700'
                    }
                  `}
                >
                  <div className="text-xl">{el}</div>
                  <div className="text-xs text-gray-500 mt-1">[{idx}]</div>
                </motion.div>
              ))}
            </AnimatePresence>
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
                      className="px-3 py-1 bg-indigo-500 text-white rounded hover:bg-indigo-600 disabled:bg-gray-300"
                    >
                      Next Step
                    </button>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
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
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">🔧 Variables & State</h2>
            
            <div className="space-y-3">
              {Object.entries(variables).map(([key, value]) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                >
                  <span className="font-mono text-sm text-gray-700">{key}:</span>
                  <span className="font-mono text-sm font-semibold text-indigo-600">
                    {typeof value === 'string' ? value : String(value)}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Legend */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">🎨 Color Legend</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-300 border-2 border-yellow-500 rounded"></div>
                  <span>Currently processing</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-300 border-2 border-blue-500 rounded"></div>
                  <span>Comparing elements</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-300 border-2 border-green-500 rounded"></div>
                  <span>Accessing/Found</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .btn-primary {
          @apply px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors font-medium;
        }
        .btn-secondary {
          @apply px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium;
        }
        .btn-accent {
          @apply px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-medium;
        }
      `}</style>
    </div>
  );
};

export default ArrayAnimation;
