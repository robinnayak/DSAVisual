"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";

interface QueueItem {
  id: number;
  value: number;
  isNew?: boolean;
  isHighlighted?: boolean;
  isBeingRemoved?: boolean;
  isProcessing?: boolean;
}

interface AnimationStep {
  line: number;
  code: string;
  explanation: string;
  queueState?: (QueueItem | null)[];
  variables?: { [key: string]: string | number };
  highlightIndex?: number;
  showPointers?: boolean;
}

const CircularQueueAnimation = () => {
  const maxSize = 8; // Fixed size for circular queue
  const [queue, setQueue] = useState<(QueueItem | null)[]>(new Array(maxSize).fill(null));
  const [front, setFront] = useState(0);
  const [rear, setRear] = useState(-1);
  const [size, setSize] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [animationSteps, setAnimationSteps] = useState<AnimationStep[]>([]);
  const [variables, setVariables] = useState<{ [key: string]: string | number }>({});
  const [operationSpeed, setOperationSpeed] = useState(1000);
  const [selectedOperation, setSelectedOperation] = useState<string>("");

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const resetAnimation = () => {
    setIsAnimating(false);
    setCurrentStep(0);
    setAnimationSteps([]);
    setVariables({});
    // Reset queue states
    setQueue(prev => prev.map(item => 
      item ? { ...item, isNew: false, isHighlighted: false, isBeingRemoved: false, isProcessing: false } : null
    ));
  };

  const executeStep = useCallback(async (step: AnimationStep) => {
    if (step.variables) {
      setVariables(step.variables);
    }
    if (step.queueState) {
      setQueue(step.queueState);
    }
    if (step.highlightIndex !== undefined) {
      setQueue(prev => prev.map((item, idx) => 
        item ? { 
          ...item, 
          isHighlighted: idx === step.highlightIndex,
          isProcessing: idx === step.highlightIndex
        } : null
      ));
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

  // Enqueue Operation
  const animateEnqueue = () => {
    if (!inputValue || isNaN(Number(inputValue))) {
      alert("Please enter a valid number");
      return;
    }

    const newValue = Number(inputValue);
    
    if (size >= maxSize) {
      alert("Queue is full! Cannot enqueue.");
      return;
    }

    resetAnimation();
    setSelectedOperation(`Enqueue ${newValue}`);

    const steps: AnimationStep[] = [
      {
        line: 1,
        code: `def enqueue(self, data):`,
        explanation: `Enqueue ${newValue} to circular queue`,
        variables: { 
          data: newValue,
          front: front,
          rear: rear,
          size: size,
          max_size: maxSize
        }
      },
      {
        line: 2,
        code: `    if self.is_full():`,
        explanation: `Check if queue is full (size == max_size)`,
        variables: { 
          size: size,
          max_size: maxSize,
          is_full: size >= maxSize ? "true" : "false"
        }
      }
    ];

    if (size >= maxSize) {
      steps.push({
        line: 3,
        code: `        raise Exception("Queue is full")`,
        explanation: `Queue overflow - cannot add more elements`,
        variables: { 
          error: "Queue Full",
          max_capacity: maxSize
        }
      });
    } else {
      const newRear = (rear + 1) % maxSize;
      
      steps.push({
        line: 4,
        code: `    self.rear = (self.rear + 1) % self.max_size`,
        explanation: `Calculate new rear position: (${rear} + 1) % ${maxSize} = ${newRear}`,
        variables: { 
          old_rear: rear,
          new_rear: newRear,
          calculation: `(${rear} + 1) % ${maxSize}`
        }
      });

      const newQueue = [...queue];
      newQueue[newRear] = { 
        id: Date.now(), 
        value: newValue, 
        isNew: true 
      };

      steps.push({
        line: 5,
        code: `    self.queue[self.rear] = data`,
        explanation: `Place ${newValue} at position ${newRear}`,
        variables: { 
          rear_position: newRear,
          value: newValue
        },
        queueState: newQueue,
        highlightIndex: newRear
      });

      steps.push({
        line: 6,
        code: `    self.size += 1`,
        explanation: `Increment size to ${size + 1}`,
        variables: { 
          old_size: size,
          new_size: size + 1,
          front: front,
          rear: newRear
        }
      });

      // Update actual state
      setRear(newRear);
      setSize(size + 1);
    }

    setAnimationSteps(steps);
    setInputValue("");
    setIsAnimating(true);
  };

  // Dequeue Operation
  const animateDequeue = () => {
    if (size === 0) {
      alert("Queue is empty! Cannot dequeue.");
      return;
    }

    resetAnimation();
    setSelectedOperation("Dequeue");

    const dequeuedValue = queue[front]?.value || 0;

    const steps: AnimationStep[] = [
      {
        line: 1,
        code: `def dequeue(self):`,
        explanation: `Remove element from front of circular queue`,
        variables: { 
          front: front,
          rear: rear,
          size: size
        }
      },
      {
        line: 2,
        code: `    if self.is_empty():`,
        explanation: `Check if queue is empty`,
        variables: { 
          size: size,
          is_empty: size === 0 ? "true" : "false"
        }
      }
    ];

    if (size === 0) {
      steps.push({
        line: 3,
        code: `        raise Exception("Queue is empty")`,
        explanation: `Queue underflow - no elements to remove`,
        variables: { 
          error: "Queue Empty"
        }
      });
    } else {
      steps.push({
        line: 4,
        code: `    data = self.queue[self.front]`,
        explanation: `Get element at front position ${front}: ${dequeuedValue}`,
        variables: { 
          front_position: front,
          dequeued_value: dequeuedValue
        },
        highlightIndex: front
      });

      const newQueue = [...queue];
      if (newQueue[front]) {
        newQueue[front] = { ...newQueue[front]!, isBeingRemoved: true };
      }

      steps.push({
        line: 5,
        code: `    self.queue[self.front] = None`,
        explanation: `Clear the front position`,
        variables: { 
          cleared_position: front
        },
        queueState: newQueue
      });

      const newFront = (front + 1) % maxSize;

      steps.push({
        line: 6,
        code: `    self.front = (self.front + 1) % self.max_size`,
        explanation: `Move front pointer: (${front} + 1) % ${maxSize} = ${newFront}`,
        variables: { 
          old_front: front,
          new_front: newFront,
          calculation: `(${front} + 1) % ${maxSize}`
        }
      });

      const finalQueue = [...queue];
      finalQueue[front] = null;

      steps.push({
        line: 7,
        code: `    self.size -= 1`,
        explanation: `Decrement size to ${size - 1}`,
        variables: { 
          old_size: size,
          new_size: size - 1,
          front: newFront,
          rear: rear,
          dequeued: dequeuedValue
        },
        queueState: finalQueue
      });

      steps.push({
        line: 8,
        code: `    return data`,
        explanation: `Return dequeued value: ${dequeuedValue}`,
        variables: { 
          returned_value: dequeuedValue,
          operation: "complete"
        }
      });

      // Update actual state
      setFront(newFront);
      setSize(size - 1);
    }

    setAnimationSteps(steps);
    setIsAnimating(true);
  };

  // Peek/Front Operation
  const animatePeek = () => {
    resetAnimation();
    setSelectedOperation("Peek/Front");

    const steps: AnimationStep[] = [
      {
        line: 1,
        code: `def peek(self):`,
        explanation: `Look at front element without removing it`,
        variables: { 
          front: front,
          size: size
        }
      },
      {
        line: 2,
        code: `    if self.is_empty():`,
        explanation: `Check if queue is empty`,
        variables: { 
          size: size,
          is_empty: size === 0 ? "true" : "false"
        }
      }
    ];

    if (size === 0) {
      steps.push({
        line: 3,
        code: `        return None`,
        explanation: `Queue is empty - nothing to peek`,
        variables: { 
          result: "None"
        }
      });
    } else {
      const frontValue = queue[front]?.value || 0;
      
      steps.push({
        line: 4,
        code: `    return self.queue[self.front]`,
        explanation: `Return front element: ${frontValue}`,
        variables: { 
          front_position: front,
          front_value: frontValue
        },
        highlightIndex: front
      });
    }

    setAnimationSteps(steps);
    setIsAnimating(true);
  };

  // Check if Full
  const animateIsFull = () => {
    resetAnimation();
    setSelectedOperation("Check if Full");

    const isFull = size >= maxSize;

    const steps: AnimationStep[] = [
      {
        line: 1,
        code: `def is_full(self):`,
        explanation: `Check if circular queue is at maximum capacity`,
        variables: { 
          size: size,
          max_size: maxSize
        }
      },
      {
        line: 2,
        code: `    return self.size == self.max_size`,
        explanation: `Compare size (${size}) with max_size (${maxSize})`,
        variables: { 
          size: size,
          max_size: maxSize,
          result: isFull ? "true" : "false",
          comparison: `${size} == ${maxSize}`
        }
      }
    ];

    setAnimationSteps(steps);
    setIsAnimating(true);
  };

  // Check if Empty
  const animateIsEmpty = () => {
    resetAnimation();
    setSelectedOperation("Check if Empty");

    const isEmpty = size === 0;

    const steps: AnimationStep[] = [
      {
        line: 1,
        code: `def is_empty(self):`,
        explanation: `Check if circular queue has no elements`,
        variables: { 
          size: size
        }
      },
      {
        line: 2,
        code: `    return self.size == 0`,
        explanation: `Check if size equals 0`,
        variables: { 
          size: size,
          result: isEmpty ? "true" : "false"
        }
      }
    ];

    setAnimationSteps(steps);
    setIsAnimating(true);
  };

  // Circular Queue Status Check
  const animateStatus = () => {
    resetAnimation();
    setSelectedOperation("Status Check");

    const steps: AnimationStep[] = [
      {
        line: 1,
        code: `def display_status(self):`,
        explanation: `Display current circular queue status`,
        variables: { 
          operation: "Status Display"
        }
      },
      {
        line: 2,
        code: `    print(f"Size: {self.size}")`,
        explanation: `Current size: ${size}`,
        variables: { 
          size: size
        }
      },
      {
        line: 3,
        code: `    print(f"Front: {self.front}")`,
        explanation: `Front pointer at index: ${front}`,
        variables: { 
          front: front,
          front_value: queue[front]?.value || "None"
        },
        highlightIndex: size > 0 ? front : undefined
      },
      {
        line: 4,
        code: `    print(f"Rear: {self.rear}")`,
        explanation: `Rear pointer at index: ${rear}`,
        variables: { 
          rear: rear,
          rear_value: rear >= 0 ? (queue[rear]?.value || "None") : "None"
        },
        highlightIndex: size > 0 ? rear : undefined
      },
      {
        line: 5,
        code: `    print(f"Is Full: {self.is_full()}")`,
        explanation: `Queue full status: ${size >= maxSize}`,
        variables: { 
          is_full: size >= maxSize ? "true" : "false",
          utilization: `${size}/${maxSize}`
        }
      },
      {
        line: 6,
        code: `    print(f"Is Empty: {self.is_empty()}")`,
        explanation: `Queue empty status: ${size === 0}`,
        variables: { 
          is_empty: size === 0 ? "true" : "false",
          available_space: maxSize - size
        }
      }
    ];

    setAnimationSteps(steps);
    setIsAnimating(true);
  };

  const manualStepControl = () => {
    if (currentStep < animationSteps.length) {
      executeStep(animationSteps[currentStep]);
      setCurrentStep(prev => prev + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold text-center text-orange-800 mb-8">
          🔄 Interactive Circular Queue Visualizer
        </h1>

        {/* Operation Controls */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">🎮 Controls</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <input
              type="number"
              placeholder="Enter value"
              className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <select
              className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-red-500"
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

          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            <button onClick={animateEnqueue} className="btn-primary">
              ➕ Enqueue
            </button>
            <button onClick={animateDequeue} className="btn-danger">
              ➖ Dequeue
            </button>
            <button onClick={animatePeek} className="btn-secondary">
              👁️ Peek
            </button>
            <button onClick={animateIsFull} className="btn-warning">
              🔍 Is Full?
            </button>
            <button onClick={animateIsEmpty} className="btn-info">
              🔍 Is Empty?
            </button>
            <button onClick={animateStatus} className="btn-special">
              📊 Status
            </button>
          </div>

          <div className="mt-4 flex justify-center">
            <button
              onClick={() => setIsAnimating(!isAnimating)}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                isAnimating ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
            >
              {isAnimating ? '⏸️ Pause' : '▶️ Play'}
            </button>
          </div>
        </div>

        {/* Circular Queue Visualization */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            🔄 Circular Queue Visualization (Max Size: {maxSize})
          </h2>
          
          <div className="relative bg-gray-50 rounded-lg p-8" style={{ height: '400px' }}>
            <div className="flex justify-center items-center h-full">
              <div className="relative">
                {/* Circular arrangement */}
                <div className="relative w-80 h-80">
                  {Array.from({ length: maxSize }).map((_, index) => {
                    const angle = (2 * Math.PI * index) / maxSize - Math.PI / 2;
                    const radius = 120;
                    const x = 150 + radius * Math.cos(angle);
                    const y = 150 + radius * Math.sin(angle);
                    
                    const item = queue[index];
                    const isFront = index === front && size > 0;
                    const isRear = index === rear && size > 0;
                    const isOccupied = item !== null;

                    return (
                      <motion.div
                        key={index}
                        className={`
                          absolute w-12 h-12 rounded-full flex items-center justify-center
                          font-bold text-white text-sm border-4 transition-all duration-300
                          ${item?.isHighlighted 
                            ? 'bg-purple-500 border-purple-600 ring-4 ring-purple-300' 
                            : item?.isNew
                            ? 'bg-green-500 border-green-600'
                            : item?.isBeingRemoved
                            ? 'bg-red-500 border-red-600'
                            : isOccupied
                            ? 'bg-orange-500 border-orange-600'
                            : 'bg-gray-300 border-gray-400'
                          }
                        `}
                        style={{
                          left: x - 24,
                          top: y - 24,
                        }}
                        initial={{ scale: 0 }}
                        animate={{ 
                          scale: item?.isHighlighted ? 1.3 : 1,
                        }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      >
                        {isOccupied ? item?.value : ''}
                        
                        {/* Index label */}
                        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs font-bold text-gray-600">
                          {index}
                        </div>
                        
                        {/* Front/Rear indicators */}
                        {isFront && (
                          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 text-xs font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded">
                            FRONT
                          </div>
                        )}
                        {isRear && (
                          <div className="absolute top-14 left-1/2 transform -translate-x-1/2 text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded">
                            REAR
                          </div>
                        )}
                      </motion.div>
                    );
                  })}

                  {/* Center info */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                    <div className="bg-white rounded-lg p-3 shadow-md border-2 border-orange-200">
                      <div className="text-sm font-bold text-orange-800">
                        Size: {size}/{maxSize}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        Front: {front} | Rear: {rear}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Queue Properties */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">📍 Pointers</h3>
              <div className="text-sm text-blue-700 space-y-1">
                <div>• <strong>Front:</strong> {front} {size > 0 ? `(${queue[front]?.value})` : '(empty)'}</div>
                <div>• <strong>Rear:</strong> {rear} {size > 0 && rear >= 0 ? `(${queue[rear]?.value})` : '(empty)'}</div>
                <div>• <strong>Next Front:</strong> {(front + 1) % maxSize}</div>
                <div>• <strong>Next Rear:</strong> {(rear + 1) % maxSize}</div>
              </div>
            </div>

            <div className="p-4 bg-orange-50 border-2 border-orange-200 rounded-lg">
              <h3 className="font-semibold text-orange-800 mb-2">📊 Status</h3>
              <div className="text-sm text-orange-700 space-y-1">
                <div>• <strong>Size:</strong> {size}/{maxSize}</div>
                <div>• <strong>Is Empty:</strong> {size === 0 ? 'Yes' : 'No'}</div>
                <div>• <strong>Is Full:</strong> {size >= maxSize ? 'Yes' : 'No'}</div>
                <div>• <strong>Space Left:</strong> {maxSize - size}</div>
              </div>
            </div>

            <div className="p-4 bg-green-50 border-2 border-green-200 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">🔄 Circular Benefits</h3>
              <div className="text-sm text-green-700 space-y-1">
                <div>• No memory waste</div>
                <div>• Efficient space utilization</div>
                <div>• Fixed memory allocation</div>
                <div>• Prevents queue drift</div>
              </div>
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
                      className="px-3 py-1 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:bg-gray-300"
                    >
                      Next Step
                    </button>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-orange-600 h-2 rounded-full transition-all duration-300"
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
                  <span className="font-mono text-sm font-semibold text-orange-600">
                    {String(value)}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Circular Queue Advantages */}
            <div className="mt-6 p-4 bg-green-50 border-2 border-green-200 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">✅ Advantages</h3>
              <div className="text-sm text-green-700 space-y-1">
                <div>• Fixed memory allocation</div>
                <div>• No memory waste after dequeue</div>
                <div>• Efficient for producer-consumer</div>
                <div>• Prevents queue drift problem</div>
              </div>
            </div>

            {/* Use Cases */}
            <div className="mt-4 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">🎯 Use Cases</h3>
              <div className="text-sm text-blue-700 space-y-1">
                <div>• CPU scheduling (round-robin)</div>
                <div>• Buffer for data streams</div>
                <div>• Print queue management</div>
                <div>• Traffic signal systems</div>
                <div>• Keyboard buffer</div>
              </div>
            </div>

            {/* Algorithm Complexity */}
            <div className="mt-4 p-4 bg-purple-50 border-2 border-purple-200 rounded-lg">
              <h3 className="font-semibold text-purple-800 mb-2">⚡ Time Complexity</h3>
              <div className="text-sm text-purple-700 space-y-1">
                <div>• <strong>Enqueue:</strong> O(1)</div>
                <div>• <strong>Dequeue:</strong> O(1)</div>
                <div>• <strong>Peek:</strong> O(1)</div>
                <div>• <strong>Is Full/Empty:</strong> O(1)</div>
              </div>
            </div>

            {/* Legend */}
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">🎨 Color Legend</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                  <span>Currently processing</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <span>Newly enqueued</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                  <span>Occupied slot</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                  <span>Empty slot</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .btn-primary {
          @apply px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium;
        }
        .btn-secondary {
          @apply px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-medium;
        }
        .btn-danger {
          @apply px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium;
        }
        .btn-warning {
          @apply px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors font-medium;
        }
        .btn-info {
          @apply px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium;
        }
        .btn-special {
          @apply px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors font-medium;
        }
      `}</style>
    </div>
  );
};

export default CircularQueueAnimation;
