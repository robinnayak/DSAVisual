"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface StackNode {
  id: number;
  value: number;
  isNew?: boolean;
  isHighlighted?: boolean;
  isBeingRemoved?: boolean;
}

interface AnimationStep {
  line: number;
  code: string;
  explanation: string;
  stackState?: StackNode[];
  variables?: { [key: string]: string | number };
  highlightTop?: boolean;
}

const StackAnimation = () => {
  const [stack, setStack] = useState<StackNode[]>([
    { id: 1, value: 10 },
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

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const resetAnimation = () => {
    setIsAnimating(false);
    setCurrentStep(0);
    setAnimationSteps([]);
    setVariables({});
    // Reset node states
    setStack(prev => prev.map(node => ({
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
    if (step.stackState) {
      setStack(step.stackState);
    } else if (step.highlightTop && stack.length > 0) {
      setStack(prev => prev.map((node, idx) => ({
        ...node,
        isHighlighted: idx === 0
      })));
    }
    await sleep(operationSpeed);
  }, [operationSpeed, stack.length]);

  useEffect(() => {
    if (isAnimating && currentStep < animationSteps.length) {
      executeStep(animationSteps[currentStep]).then(() => {
        setCurrentStep(prev => prev + 1);
      });
    } else if (isAnimating && currentStep >= animationSteps.length) {
      setIsAnimating(false);
    }
  }, [isAnimating, currentStep, animationSteps, executeStep]);

  // Animate Push Operation
  const animatePush = () => {
    if (!inputValue || isNaN(Number(inputValue))) {
      alert("Please enter a valid number");
      return;
    }

    const newValue = Number(inputValue);
    resetAnimation();
    setSelectedOperation("Push");

    const steps: AnimationStep[] = [
      {
        line: 1,
        code: `def push(self, data):`,
        explanation: "Define push function to add element to top of stack",
        variables: { data: newValue, stack_size: stack.length }
      },
      {
        line: 2,
        code: `    if self.is_full():`,
        explanation: "Check if stack has reached maximum capacity",
        variables: { data: newValue, stack_size: stack.length, is_full: "false" }
      },
      {
        line: 3,
        code: `    new_node = Node(${newValue})`,
        explanation: `Create new node with value ${newValue}`,
        variables: { data: newValue, new_node: newValue, stack_size: stack.length }
      },
      {
        line: 4,
        code: `    new_node.next = self.top`,
        explanation: `Point new node to current top element`,
        variables: { 
          data: newValue, 
          new_node: newValue, 
          top: stack[0]?.value || "None",
          stack_size: stack.length 
        }
      },
      {
        line: 5,
        code: `    self.top = new_node`,
        explanation: `Update top pointer to new node`,
        variables: { 
          data: newValue, 
          top: newValue,
          stack_size: stack.length + 1 
        },
        stackState: [
          { id: Date.now(), value: newValue, isNew: true },
          ...stack.map(node => ({ ...node, isNew: false, isHighlighted: false }))
        ]
      },
      {
        line: 6,
        code: `    self.size += 1`,
        explanation: `Increment stack size`,
        variables: { 
          data: newValue, 
          top: newValue,
          stack_size: stack.length + 1 
        },
        stackState: [
          { id: Date.now(), value: newValue, isNew: false },
          ...stack
        ]
      }
    ];

    setAnimationSteps(steps);
    setInputValue("");
    setIsAnimating(true);
  };

  // Animate Pop Operation
  const animatePop = () => {
    if (stack.length === 0) {
      alert("Stack is empty!");
      return;
    }

    resetAnimation();
    setSelectedOperation("Pop");

    const poppedValue = stack[0].value;
    const steps: AnimationStep[] = [
      {
        line: 1,
        code: `def pop(self):`,
        explanation: "Define pop function to remove top element from stack",
        variables: { stack_size: stack.length }
      },
      {
        line: 2,
        code: `    if self.is_empty():`,
        explanation: "Check if stack is empty",
        variables: { stack_size: stack.length, is_empty: "false" }
      },
      {
        line: 3,
        code: `    data = self.top.data`,
        explanation: `Store top element value (${poppedValue}) to return`,
        variables: { 
          top_value: poppedValue,
          stack_size: stack.length 
        },
        highlightTop: true
      },
      {
        line: 4,
        code: `    self.top = self.top.next`,
        explanation: `Move top pointer to next element`,
        variables: { 
          popped_value: poppedValue,
          new_top: stack[1]?.value || "None",
          stack_size: stack.length - 1 
        },
        stackState: stack.slice(1)
      },
      {
        line: 5,
        code: `    self.size -= 1`,
        explanation: `Decrement stack size`,
        variables: { 
          popped_value: poppedValue,
          stack_size: stack.length - 1 
        }
      },
      {
        line: 6,
        code: `    return data`,
        explanation: `Return the popped value: ${poppedValue}`,
        variables: { 
          returned_value: poppedValue,
          stack_size: stack.length - 1 
        }
      }
    ];

    setAnimationSteps(steps);
    setIsAnimating(true);
  };

  // Animate Peek Operation
  const animatePeek = () => {
    if (stack.length === 0) {
      alert("Stack is empty!");
      return;
    }

    resetAnimation();
    setSelectedOperation("Peek");

    const topValue = stack[0].value;
    const steps: AnimationStep[] = [
      {
        line: 1,
        code: `def peek(self):`,
        explanation: "Define peek function to view top element without removing",
        variables: { stack_size: stack.length }
      },
      {
        line: 2,
        code: `    if self.is_empty():`,
        explanation: "Check if stack is empty",
        variables: { stack_size: stack.length, is_empty: "false" }
      },
      {
        line: 3,
        code: `    return self.top.data`,
        explanation: `Return top element value: ${topValue} (without removing)`,
        variables: { 
          top_value: topValue,
          stack_size: stack.length 
        },
        highlightTop: true
      }
    ];

    setAnimationSteps(steps);
    setIsAnimating(true);
  };

  // Animate Balanced Parentheses Check
  const animateBalancedParentheses = () => {
    const expression = inputValue || "({[]})";
    resetAnimation();
    setSelectedOperation("Balanced Parentheses");

    const steps: AnimationStep[] = [
      {
        line: 1,
        code: `def is_balanced(expression):`,
        explanation: `Check if parentheses in "${expression}" are balanced`,
        variables: { expression: expression, stack_size: 0 }
      },
      {
        line: 2,
        code: `    stack = Stack()`,
        explanation: "Create empty stack to track opening brackets",
        variables: { expression: expression, stack_size: 0 }
      }
    ];

    let workingStack: StackNode[] = [];
    const openBrackets = ['(', '[', '{'];
    const closeBrackets = [')', ']', '}'];
    const pairs: { [key: string]: string } = { ')': '(', ']': '[', '}': '{' };

    for (let i = 0; i < expression.length; i++) {
      const char = expression[i];
      
      steps.push({
        line: 3,
        code: `    for char in "${expression}":`,
        explanation: `Processing character '${char}' at position ${i}`,
        variables: { 
          expression: expression, 
          current_char: char, 
          position: i,
          stack_size: workingStack.length 
        }
      });

      if (openBrackets.includes(char)) {
        workingStack = [
          { id: Date.now() + i, value: char.charCodeAt(0), isNew: true },
          ...workingStack
        ];
        
        steps.push({
          line: 4,
          code: `        if char in "([{":`,
          explanation: `'${char}' is opening bracket - push to stack`,
          variables: { 
            expression: expression, 
            current_char: char, 
            stack_size: workingStack.length 
          },
          stackState: [...workingStack]
        });
      } else if (closeBrackets.includes(char)) {
        steps.push({
          line: 5,
          code: `        elif char in ")]}":`,
          explanation: `'${char}' is closing bracket - check for matching opening`,
          variables: { 
            expression: expression, 
            current_char: char, 
            stack_size: workingStack.length 
          }
        });

        if (workingStack.length === 0) {
          steps.push({
            line: 6,
            code: `            return False`,
            explanation: `No opening bracket to match '${char}' - unbalanced!`,
            variables: { 
              expression: expression, 
              result: "False",
              reason: "No matching opening bracket"
            }
          });
          break;
        } else {
          const topChar = String.fromCharCode(workingStack[0].value);
          if (pairs[char] === topChar) {
            workingStack = workingStack.slice(1);
            steps.push({
              line: 7,
              code: `            stack.pop()  # Match found`,
              explanation: `'${char}' matches '${topChar}' - pop from stack`,
              variables: { 
                expression: expression, 
                current_char: char, 
                matched_with: topChar,
                stack_size: workingStack.length 
              },
              stackState: [...workingStack]
            });
          } else {
            steps.push({
              line: 8,
              code: `            return False`,
              explanation: `'${char}' doesn't match '${topChar}' - unbalanced!`,
              variables: { 
                expression: expression, 
                result: "False",
                reason: `'${char}' doesn't match '${topChar}'`
              }
            });
            break;
          }
        }
      }
    }

    steps.push({
      line: 9,
      code: `    return stack.is_empty()`,
      explanation: workingStack.length === 0 
        ? "Stack is empty - all brackets matched! Balanced ✓"
        : "Stack not empty - unmatched opening brackets! Unbalanced ✗",
      variables: { 
        expression: expression, 
        result: workingStack.length === 0 ? "True" : "False",
        final_stack_size: workingStack.length
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold text-center text-orange-800 mb-8">
          📚 Interactive Stack Visualizer (LIFO)
        </h1>

        {/* Operation Controls */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">🎮 Controls</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <input
              type="text"
              placeholder="Value or Expression"
              className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
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
            <button onClick={animatePush} className="btn-primary">
              ⬆️ Push
            </button>
            <button onClick={animatePop} className="btn-secondary">
              ⬇️ Pop
            </button>
            <button onClick={animatePeek} className="btn-accent">
              👁️ Peek
            </button>
            <button onClick={animateBalancedParentheses} className="btn-special">
              🔍 Check Balance
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

        {/* Stack Visualization */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">📚 Stack Visualization (LIFO)</h2>
          <div className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-lg min-h-[300px] justify-end">
            {/* Top indicator */}
            <div className="text-lg font-bold text-orange-600 mb-2">
              ⬆️ TOP (Last In, First Out)
            </div>
            
            {stack.length === 0 ? (
              <div className="flex items-center justify-center w-full h-40 text-gray-500 text-lg border-2 border-dashed border-gray-300 rounded-lg">
                Empty Stack
              </div>
            ) : (
              <div className="flex flex-col-reverse gap-2">
                <AnimatePresence>
                  {stack.map((node, idx) => (
                    <motion.div
                      key={node.id}
                      initial={{ opacity: 0, y: -50, scale: 0.8 }}
                      animate={{ 
                        opacity: 1, 
                        y: 0, 
                        scale: node.isHighlighted ? 1.1 : 1
                      }}
                      exit={{ opacity: 0, y: -50, scale: 0.8 }}
                      transition={{ 
                        type: "spring", 
                        stiffness: 300, 
                        damping: 20,
                        delay: idx * 0.1 
                      }}
                      className={`
                        relative flex items-center justify-center 
                        w-32 h-16 rounded-lg shadow-md font-bold text-xl border-4
                        ${node.isHighlighted 
                          ? 'bg-yellow-200 border-yellow-500 text-yellow-800 ring-4 ring-yellow-300' 
                          : node.isNew
                          ? 'bg-green-200 border-green-500 text-green-800'
                          : node.isBeingRemoved
                          ? 'bg-red-200 border-red-500 text-red-800'
                          : 'bg-white border-orange-300 text-gray-700'
                        }
                      `}
                    >
                      {/* Stack position indicator */}
                      {idx === 0 && (
                        <div className="absolute -right-16 top-1/2 transform -translate-y-1/2 text-sm font-bold text-orange-600">
                          ← TOP
                        </div>
                      )}
                      
                      {/* Node value */}
                      <div>{selectedOperation === "Balanced Parentheses" ? String.fromCharCode(node.value) : node.value}</div>
                      
                      {/* Position indicator */}
                      <div className="absolute -left-8 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
                        {idx}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
            
            {/* Bottom indicator */}
            <div className="text-lg font-bold text-gray-500 mt-4">
              ⬇️ BOTTOM (First In)
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
                  <span className="font-mono text-sm font-semibold text-orange-600">
                    {String(value)}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* LIFO Principle */}
            <div className="mt-6 p-4 bg-orange-50 border-2 border-orange-200 rounded-lg">
              <h3 className="font-semibold text-orange-800 mb-2">📚 LIFO Principle</h3>
              <div className="text-sm text-orange-700 space-y-1">
                <div>• <strong>Last In, First Out</strong></div>
                <div>• Elements added/removed from top only</div>
                <div>• Like a stack of plates or books</div>
                <div>• Perfect for function calls, undo operations</div>
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
                  <span>Newly pushed element</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-200 border-2 border-red-500 rounded"></div>
                  <span>Being removed/popped</span>
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
          @apply px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium;
        }
        .btn-accent {
          @apply px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium;
        }
        .btn-special {
          @apply px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-medium;
        }
      `}</style>
    </div>
  );
};

export default StackAnimation;
