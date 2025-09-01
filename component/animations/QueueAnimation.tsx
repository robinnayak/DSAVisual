"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface QueueNode {
  id: number;
  value: number;
  isNew?: boolean;
  isHighlighted?: boolean;
  isBeingRemoved?: boolean;
  position?: number;
}

interface AnimationStep {
  line: number;
  code: string;
  explanation: string;
  queueState?: QueueNode[];
  variables?: { [key: string]: string | number };
  highlightFront?: boolean;
  highlightRear?: boolean;
}

const QueueAnimation = () => {
  const [queue, setQueue] = useState<QueueNode[]>([
    { id: 1, value: 10, position: 0 },
    { id: 2, value: 20, position: 1 },
    { id: 3, value: 30, position: 2 },
    { id: 4, value: 40, position: 3 },
  ]);
  
  const [inputValue, setInputValue] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [animationSteps, setAnimationSteps] = useState<AnimationStep[]>([]);
  const [variables, setVariables] = useState<{ [key: string]: string | number }>({});
  const [operationSpeed, setOperationSpeed] = useState(1000);
  const [selectedOperation, setSelectedOperation] = useState<string>("");
  const [frontPointer] = useState(0);
  const [rearPointer] = useState(3);

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const resetAnimation = () => {
    setIsAnimating(false);
    setCurrentStep(0);
    setAnimationSteps([]);
    setVariables({});
    // Reset node states
    setQueue(prev => prev.map(node => ({
      ...node,
      isNew: false,
      isHighlighted: false,
      isBeingRemoved: false
    })));
  };

  const executeStep = useCallback(async (step: AnimationStep) => {
    if (step.variables) {
      setVariables(step.variables);
    }
    if (step.queueState) {
      setQueue(step.queueState);
    } else if (step.highlightFront && queue.length > 0) {
      setQueue(prev => prev.map((node, idx) => ({
        ...node,
        isHighlighted: idx === 0
      })));
    } else if (step.highlightRear && queue.length > 0) {
      setQueue(prev => prev.map((node, idx) => ({
        ...node,
        isHighlighted: idx === queue.length - 1
      })));
    }
    await sleep(operationSpeed);
  }, [operationSpeed, queue.length]);

  useEffect(() => {
    if (isAnimating && currentStep < animationSteps.length) {
      executeStep(animationSteps[currentStep]).then(() => {
        setCurrentStep(prev => prev + 1);
      });
    } else if (isAnimating && currentStep >= animationSteps.length) {
      setIsAnimating(false);
    }
  }, [isAnimating, currentStep, animationSteps, executeStep]);

  // Animate Enqueue Operation
  const animateEnqueue = () => {
    if (!inputValue || isNaN(Number(inputValue))) {
      alert("Please enter a valid number");
      return;
    }

    const newValue = Number(inputValue);
    resetAnimation();
    setSelectedOperation("Enqueue");

    const steps: AnimationStep[] = [
      {
        line: 1,
        code: `def enqueue(self, data):`,
        explanation: "Define enqueue function to add element to rear of queue",
        variables: { data: newValue, size: queue.length, front: frontPointer, rear: rearPointer }
      },
      {
        line: 2,
        code: `    if self.is_full():`,
        explanation: "Check if queue has reached maximum capacity",
        variables: { data: newValue, size: queue.length, is_full: "false" }
      },
      {
        line: 3,
        code: `    new_node = Node(${newValue})`,
        explanation: `Create new node with value ${newValue}`,
        variables: { data: newValue, new_node: newValue, size: queue.length }
      },
      {
        line: 4,
        code: `    if self.is_empty():`,
        explanation: queue.length === 0 ? "Queue is empty - set both front and rear" : "Queue not empty - only update rear",
        variables: { 
          data: newValue, 
          new_node: newValue, 
          is_empty: queue.length === 0 ? "true" : "false",
          size: queue.length 
        }
      }
    ];

    if (queue.length === 0) {
      steps.push({
        line: 5,
        code: `        self.front = self.rear = new_node`,
        explanation: `First element - set both front and rear pointers to new node`,
        variables: { 
          data: newValue, 
          front: newValue,
          rear: newValue,
          size: 1 
        },
        queueState: [
          { id: Date.now(), value: newValue, isNew: true, position: 0 }
        ]
      });
    } else {
      steps.push(
        {
          line: 6,
          code: `        self.rear.next = new_node`,
          explanation: `Link current rear node to new node`,
          variables: { 
            data: newValue, 
            rear_value: queue[queue.length - 1].value,
            size: queue.length 
          }
        },
        {
          line: 7,
          code: `        self.rear = new_node`,
          explanation: `Update rear pointer to new node`,
          variables: { 
            data: newValue, 
            front: queue[0].value,
            rear: newValue,
            size: queue.length + 1 
          },
          queueState: [
            ...queue.map(node => ({ ...node, isNew: false, isHighlighted: false })),
            { id: Date.now(), value: newValue, isNew: true, position: queue.length }
          ]
        }
      );
    }

    steps.push({
      line: 8,
      code: `    self.size += 1`,
      explanation: `Increment queue size`,
      variables: { 
        data: newValue, 
        front: queue.length === 0 ? newValue : queue[0].value,
        rear: newValue,
        size: queue.length + 1 
      }
    });

    setAnimationSteps(steps);
    setInputValue("");
    setIsAnimating(true);
  };

  // Animate Dequeue Operation
  const animateDequeue = () => {
    if (queue.length === 0) {
      alert("Queue is empty!");
      return;
    }

    resetAnimation();
    setSelectedOperation("Dequeue");

    const dequeuedValue = queue[0].value;
    const steps: AnimationStep[] = [
      {
        line: 1,
        code: `def dequeue(self):`,
        explanation: "Define dequeue function to remove element from front of queue",
        variables: { size: queue.length, front: frontPointer, rear: rearPointer }
      },
      {
        line: 2,
        code: `    if self.is_empty():`,
        explanation: "Check if queue is empty",
        variables: { size: queue.length, is_empty: "false" }
      },
      {
        line: 3,
        code: `    data = self.front.data`,
        explanation: `Store front element value (${dequeuedValue}) to return`,
        variables: { 
          front_value: dequeuedValue,
          size: queue.length 
        },
        highlightFront: true
      },
      {
        line: 4,
        code: `    self.front = self.front.next`,
        explanation: `Move front pointer to next element`,
        variables: { 
          dequeued_value: dequeuedValue,
          new_front: queue[1]?.value || "None",
          size: queue.length - 1 
        },
        queueState: queue.slice(1).map((node, idx) => ({ ...node, position: idx }))
      },
      {
        line: 5,
        code: `    if self.front is None:`,
        explanation: queue.length === 1 ? "Queue becomes empty - reset rear pointer" : "Queue not empty - continue",
        variables: { 
          dequeued_value: dequeuedValue,
          front_is_none: queue.length === 1 ? "true" : "false",
          size: queue.length - 1 
        }
      }
    ];

    if (queue.length === 1) {
      steps.push({
        line: 6,
        code: `        self.rear = None`,
        explanation: `Queue is empty - reset rear pointer to None`,
        variables: { 
          dequeued_value: dequeuedValue,
          front: "None",
          rear: "None",
          size: 0 
        }
      });
    }

    steps.push(
      {
        line: 7,
        code: `    self.size -= 1`,
        explanation: `Decrement queue size`,
        variables: { 
          dequeued_value: dequeuedValue,
          size: queue.length - 1 
        }
      },
      {
        line: 8,
        code: `    return data`,
        explanation: `Return the dequeued value: ${dequeuedValue}`,
        variables: { 
          returned_value: dequeuedValue,
          size: queue.length - 1 
        }
      }
    );

    setAnimationSteps(steps);
    setIsAnimating(true);
  };

  // Animate Front/Peek Operation
  const animateFront = () => {
    if (queue.length === 0) {
      alert("Queue is empty!");
      return;
    }

    resetAnimation();
    setSelectedOperation("Front/Peek");

    const frontValue = queue[0].value;
    const steps: AnimationStep[] = [
      {
        line: 1,
        code: `def front(self):`,
        explanation: "Define front function to view front element without removing",
        variables: { size: queue.length }
      },
      {
        line: 2,
        code: `    if self.is_empty():`,
        explanation: "Check if queue is empty",
        variables: { size: queue.length, is_empty: "false" }
      },
      {
        line: 3,
        code: `    return self.front.data`,
        explanation: `Return front element value: ${frontValue} (without removing)`,
        variables: { 
          front_value: frontValue,
          size: queue.length 
        },
        highlightFront: true
      }
    ];

    setAnimationSteps(steps);
    setIsAnimating(true);
  };

  // Animate BFS Traversal Simulation
  const animateBFS = () => {
    resetAnimation();
    setSelectedOperation("BFS Simulation");

    // Simulate a simple graph: 1 -> [2,3], 2 -> [4], 3 -> [4], 4 -> []
    const graph: { [key: number]: number[] } = {
      1: [2, 3],
      2: [4],
      3: [4],
      4: []
    };

    const steps: AnimationStep[] = [
      {
        line: 1,
        code: `def bfs(graph, start):`,
        explanation: "Breadth-First Search using queue to explore level by level",
        variables: { start_node: 1, visited: "[]" }
      },
      {
        line: 2,
        code: `    queue = Queue()`,
        explanation: "Create empty queue for BFS traversal",
        variables: { start_node: 1, visited: "[]" }
      },
      {
        line: 3,
        code: `    visited = set()`,
        explanation: "Create set to track visited nodes",
        variables: { start_node: 1, visited: "[]" }
      },
      {
        line: 4,
        code: `    queue.enqueue(1)`,
        explanation: "Add starting node to queue",
        variables: { start_node: 1, visited: "[]", queue_size: 1 },
        queueState: [{ id: Date.now(), value: 1, isNew: true, position: 0 }]
      }
    ];

    let workingQueue: QueueNode[] = [{ id: Date.now(), value: 1, position: 0 }];
    const visited: number[] = [];
    let stepId = 0;

    while (workingQueue.length > 0) {
      const current = workingQueue[0].value;
      workingQueue = workingQueue.slice(1).map((node, idx) => ({ ...node, position: idx }));
      visited.push(current);

      steps.push({
        line: 5,
        code: `    while queue is not empty:`,
        explanation: `Process queue - current node: ${current}`,
        variables: { 
          current_node: current, 
          visited: `[${visited.join(', ')}]`,
          queue_size: workingQueue.length 
        },
        queueState: [...workingQueue]
      });

      steps.push({
        line: 6,
        code: `        current = queue.dequeue()`,
        explanation: `Dequeue node ${current} and mark as visited`,
        variables: { 
          current_node: current, 
          visited: `[${visited.join(', ')}]`,
          queue_size: workingQueue.length 
        }
      });

      const neighbors = graph[current] || [];
      for (const neighbor of neighbors) {
        if (!visited.includes(neighbor) && !workingQueue.some(n => n.value === neighbor)) {
          stepId++;
          workingQueue.push({ 
            id: Date.now() + stepId, 
            value: neighbor, 
            isNew: true, 
            position: workingQueue.length 
          });

          steps.push({
            line: 7,
            code: `        for neighbor in graph[${current}]:`,
            explanation: `Add unvisited neighbor ${neighbor} to queue`,
            variables: { 
              current_node: current, 
              neighbor: neighbor,
              visited: `[${visited.join(', ')}]`,
              queue_size: workingQueue.length 
            },
            queueState: [...workingQueue]
          });
        }
      }
    }

    steps.push({
      line: 8,
      code: `    return visited`,
      explanation: `BFS traversal complete! Visited: [${visited.join(', ')}]`,
      variables: { 
        final_visited: `[${visited.join(', ')}]`,
        traversal_complete: "true"
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold text-center text-blue-800 mb-8">
          🚶‍♂️ Interactive Queue Visualizer (FIFO)
        </h1>

        {/* Operation Controls */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">🎮 Controls</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <input
              type="text"
              placeholder="Enter value"
              className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
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
            <button onClick={animateEnqueue} className="btn-primary">
              ➡️ Enqueue
            </button>
            <button onClick={animateDequeue} className="btn-secondary">
              ⬅️ Dequeue
            </button>
            <button onClick={animateFront} className="btn-accent">
              👁️ Front
            </button>
            <button onClick={animateBFS} className="btn-special">
              🔍 BFS Demo
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

        {/* Queue Visualization */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">🚶‍♂️ Queue Visualization (FIFO)</h2>
          
          <div className="flex flex-col items-center gap-4 p-4 bg-gray-50 rounded-lg">
            {/* Queue direction indicators */}
            <div className="flex justify-between w-full max-w-4xl text-lg font-bold">
              <div className="text-blue-600">⬅️ FRONT (First Out)</div>
              <div className="text-green-600">➡️ REAR (Last In)</div>
            </div>
            
            {queue.length === 0 ? (
              <div className="flex items-center justify-center w-full h-40 text-gray-500 text-lg border-2 border-dashed border-gray-300 rounded-lg">
                Empty Queue
              </div>
            ) : (
              <div className="flex items-center gap-2 p-4 overflow-x-auto">
                <AnimatePresence>
                  {queue.map((node, idx) => (
                    <motion.div
                      key={node.id}
                      initial={{ opacity: 0, x: 100, scale: 0.8 }}
                      animate={{ 
                        opacity: 1, 
                        x: 0, 
                        scale: node.isHighlighted ? 1.1 : 1
                      }}
                      exit={{ opacity: 0, x: -100, scale: 0.8 }}
                      transition={{ 
                        type: "spring", 
                        stiffness: 300, 
                        damping: 20,
                        delay: idx * 0.1 
                      }}
                      className={`
                        relative flex flex-col items-center justify-center 
                        w-20 h-20 rounded-lg shadow-md font-bold text-lg border-4
                        ${node.isHighlighted 
                          ? 'bg-yellow-200 border-yellow-500 text-yellow-800 ring-4 ring-yellow-300' 
                          : node.isNew
                          ? 'bg-green-200 border-green-500 text-green-800'
                          : node.isBeingRemoved
                          ? 'bg-red-200 border-red-500 text-red-800'
                          : 'bg-white border-blue-300 text-gray-700'
                        }
                      `}
                    >
                      {/* Front/Rear indicators */}
                      {idx === 0 && (
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-sm font-bold text-blue-600">
                          FRONT
                        </div>
                      )}
                      {idx === queue.length - 1 && (
                        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-sm font-bold text-green-600">
                          REAR
                        </div>
                      )}
                      
                      {/* Node value */}
                      <div>{node.value}</div>
                      
                      {/* Position indicator */}
                      <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 text-xs text-gray-500">
                        {idx}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Arrow indicators */}
                {queue.length > 1 && (
                  <div className="flex items-center gap-2">
                    {Array.from({ length: queue.length - 1 }).map((_, idx) => (
                      <motion.div
                        key={`arrow-${idx}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-blue-500 text-2xl"
                      >
                        ➡️
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* FIFO explanation */}
            <div className="text-center text-gray-600 mt-4">
              <div className="text-sm">
                <strong>First In, First Out:</strong> Elements are added at REAR and removed from FRONT
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
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300"
                    >
                      Next Step
                    </button>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
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
                  <span className="font-mono text-sm font-semibold text-blue-600">
                    {String(value)}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* FIFO Principle */}
            <div className="mt-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">🚶‍♂️ FIFO Principle</h3>
              <div className="text-sm text-blue-700 space-y-1">
                <div>• <strong>First In, First Out</strong></div>
                <div>• Elements added at rear, removed from front</div>
                <div>• Like a line of people waiting</div>
                <div>• Perfect for BFS, task scheduling</div>
              </div>
            </div>

            {/* Use Cases */}
            <div className="mt-4 p-4 bg-green-50 border-2 border-green-200 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">🎯 Common Uses</h3>
              <div className="text-sm text-green-700 space-y-1">
                <div>• Breadth-First Search (BFS)</div>
                <div>• Process scheduling in OS</div>
                <div>• Handling requests in web servers</div>
                <div>• Print job management</div>
              </div>
            </div>

            {/* Legend */}
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">🎨 Color Legend</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-200 border-2 border-yellow-500 rounded"></div>
                  <span>Currently accessing/highlighted</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-200 border-2 border-green-500 rounded"></div>
                  <span>Newly enqueued element</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-200 border-2 border-red-500 rounded"></div>
                  <span>Being dequeued/removed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .btn-primary {
          @apply px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium;
        }
        .btn-secondary {
          @apply px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium;
        }
        .btn-accent {
          @apply px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium;
        }
        .btn-special {
          @apply px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-medium;
        }
      `}</style>
    </div>
  );
};

export default QueueAnimation;
