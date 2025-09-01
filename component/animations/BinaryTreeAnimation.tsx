"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TreeNode {
  id: number;
  value: number;
  left?: TreeNode;
  right?: TreeNode;
  x?: number;
  y?: number;
  isHighlighted?: boolean;
  isNew?: boolean;
  isBeingRemoved?: boolean;
  isVisited?: boolean;
}

interface AnimationStep {
  line: number;
  code: string;
  explanation: string;
  treeState?: TreeNode;
  variables?: { [key: string]: string | number };
  highlightNode?: number;
  visitedNodes?: number[];
  traversalResult?: number[];
}

const BinaryTreeAnimation = () => {
  const [tree, setTree] = useState<TreeNode>({
    id: 1,
    value: 50,
    x: 400,
    y: 50,
    left: {
      id: 2,
      value: 30,
      x: 200,
      y: 150,
      left: {
        id: 4,
        value: 20,
        x: 100,
        y: 250
      },
      right: {
        id: 5,
        value: 40,
        x: 300,
        y: 250
      }
    },
    right: {
      id: 3,
      value: 70,
      x: 600,
      y: 150,
      left: {
        id: 6,
        value: 60,
        x: 500,
        y: 250
      },
      right: {
        id: 7,
        value: 80,
        x: 700,
        y: 250
      }
    }
  });
  
  const [inputValue, setInputValue] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [animationSteps, setAnimationSteps] = useState<AnimationStep[]>([]);
  const [variables, setVariables] = useState<{ [key: string]: string | number }>({});
  const [operationSpeed, setOperationSpeed] = useState(1000);
  const [selectedOperation, setSelectedOperation] = useState<string>("");
  const [traversalResult, setTraversalResult] = useState<number[]>([]);

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const resetAnimation = () => {
    setIsAnimating(false);
    setCurrentStep(0);
    setAnimationSteps([]);
    setVariables({});
    setTraversalResult([]);
    // Reset node states
    const resetNodeStates = (node: TreeNode | undefined): TreeNode | undefined => {
      if (!node) return undefined;
      return {
        ...node,
        isHighlighted: false,
        isNew: false,
        isBeingRemoved: false,
        isVisited: false,
        left: resetNodeStates(node.left),
        right: resetNodeStates(node.right)
      };
    };
    setTree(prev => resetNodeStates(prev)!);
  };

  const highlightNode = useCallback((nodeValue: number) => {
    const updateNodeHighlight = (node: TreeNode | undefined): TreeNode | undefined => {
      if (!node) return undefined;
      return {
        ...node,
        isHighlighted: node.value === nodeValue,
        left: updateNodeHighlight(node.left),
        right: updateNodeHighlight(node.right)
      };
    };
    setTree(prev => updateNodeHighlight(prev)!);
  }, []);

  const visitNode = useCallback((nodeValue: number) => {
    const updateNodeVisited = (node: TreeNode | undefined): TreeNode | undefined => {
      if (!node) return undefined;
      return {
        ...node,
        isVisited: node.value === nodeValue || node.isVisited,
        left: updateNodeVisited(node.left),
        right: updateNodeVisited(node.right)
      };
    };
    setTree(prev => updateNodeVisited(prev)!);
  }, []);

  const executeStep = useCallback(async (step: AnimationStep) => {
    if (step.variables) {
      setVariables(step.variables);
    }
    if (step.highlightNode !== undefined) {
      highlightNode(step.highlightNode);
    }
    if (step.visitedNodes) {
      step.visitedNodes.forEach(nodeValue => visitNode(nodeValue));
    }
    if (step.traversalResult) {
      setTraversalResult(step.traversalResult);
    }
    await sleep(operationSpeed);
  }, [operationSpeed, highlightNode, visitNode]);

  useEffect(() => {
    if (isAnimating && currentStep < animationSteps.length) {
      executeStep(animationSteps[currentStep]).then(() => {
        setCurrentStep(prev => prev + 1);
      });
    } else if (isAnimating && currentStep >= animationSteps.length) {
      setIsAnimating(false);
    }
  }, [isAnimating, currentStep, animationSteps, executeStep]);

  // Helper function to find a node in the tree (for future use)
  // const findNode = (node: TreeNode | undefined, value: number): TreeNode | undefined => {
  //   if (!node) return undefined;
  //   if (node.value === value) return node;
  //   return findNode(node.left, value) || findNode(node.right, value);
  // };

  // Animate In-Order Traversal
  const animateInOrder = () => {
    resetAnimation();
    setSelectedOperation("In-Order Traversal");

    const steps: AnimationStep[] = [
      {
        line: 1,
        code: `def inorder(node):`,
        explanation: "In-order traversal: Left → Root → Right",
        variables: { traversal_type: "In-Order", result: "[]" }
      },
      {
        line: 2,
        code: `    if node is None:`,
        explanation: "Check if current node exists",
        variables: { current_node: tree.value, result: "[]" }
      }
    ];

    const result: number[] = [];
    
    const traverse = (node: TreeNode | undefined, depth: number = 0): void => {
      if (!node) {
        steps.push({
          line: 3,
          code: `        return  # Node is None`,
          explanation: "Node is None, return to parent",
          variables: { depth: depth, result: `[${result.join(', ')}]` }
        });
        return;
      }

      steps.push({
        line: 4,
        code: `    inorder(node.left)  # Visit left`,
        explanation: `Visit left subtree of node ${node.value}`,
        variables: { 
          current_node: node.value, 
          depth: depth,
          result: `[${result.join(', ')}]` 
        },
        highlightNode: node.value
      });

      // Traverse left
      traverse(node.left, depth + 1);

      // Process current node
      result.push(node.value);
      steps.push({
        line: 5,
        code: `    print(node.value)  # Process root`,
        explanation: `Process current node: ${node.value}`,
        variables: { 
          current_node: node.value, 
          depth: depth,
          result: `[${result.join(', ')}]` 
        },
        highlightNode: node.value,
        visitedNodes: [node.value],
        traversalResult: [...result]
      });

      steps.push({
        line: 6,
        code: `    inorder(node.right)  # Visit right`,
        explanation: `Visit right subtree of node ${node.value}`,
        variables: { 
          current_node: node.value, 
          depth: depth,
          result: `[${result.join(', ')}]` 
        },
        highlightNode: node.value
      });

      // Traverse right
      traverse(node.right, depth + 1);
    };

    traverse(tree);

    steps.push({
      line: 7,
      code: `# Traversal complete`,
      explanation: `In-order traversal result: [${result.join(', ')}]`,
      variables: { 
        final_result: `[${result.join(', ')}]`,
        traversal_complete: "true"
      },
      traversalResult: result
    });

    setAnimationSteps(steps);
    setIsAnimating(true);
  };

  // Animate Pre-Order Traversal
  const animatePreOrder = () => {
    resetAnimation();
    setSelectedOperation("Pre-Order Traversal");

    const steps: AnimationStep[] = [
      {
        line: 1,
        code: `def preorder(node):`,
        explanation: "Pre-order traversal: Root → Left → Right",
        variables: { traversal_type: "Pre-Order", result: "[]" }
      }
    ];

    const result: number[] = [];
    
    const traverse = (node: TreeNode | undefined, depth: number = 0): void => {
      if (!node) {
        steps.push({
          line: 2,
          code: `    if node is None: return`,
          explanation: "Node is None, return to parent",
          variables: { depth: depth, result: `[${result.join(', ')}]` }
        });
        return;
      }

      // Process current node first
      result.push(node.value);
      steps.push({
        line: 3,
        code: `    print(node.value)  # Process root`,
        explanation: `Process current node: ${node.value}`,
        variables: { 
          current_node: node.value, 
          depth: depth,
          result: `[${result.join(', ')}]` 
        },
        highlightNode: node.value,
        visitedNodes: [node.value],
        traversalResult: [...result]
      });

      steps.push({
        line: 4,
        code: `    preorder(node.left)  # Visit left`,
        explanation: `Visit left subtree of node ${node.value}`,
        variables: { 
          current_node: node.value, 
          depth: depth,
          result: `[${result.join(', ')}]` 
        },
        highlightNode: node.value
      });

      // Traverse left
      traverse(node.left, depth + 1);

      steps.push({
        line: 5,
        code: `    preorder(node.right)  # Visit right`,
        explanation: `Visit right subtree of node ${node.value}`,
        variables: { 
          current_node: node.value, 
          depth: depth,
          result: `[${result.join(', ')}]` 
        },
        highlightNode: node.value
      });

      // Traverse right
      traverse(node.right, depth + 1);
    };

    traverse(tree);

    steps.push({
      line: 6,
      code: `# Traversal complete`,
      explanation: `Pre-order traversal result: [${result.join(', ')}]`,
      variables: { 
        final_result: `[${result.join(', ')}]`,
        traversal_complete: "true"
      },
      traversalResult: result
    });

    setAnimationSteps(steps);
    setIsAnimating(true);
  };

  // Animate Post-Order Traversal
  const animatePostOrder = () => {
    resetAnimation();
    setSelectedOperation("Post-Order Traversal");

    const steps: AnimationStep[] = [
      {
        line: 1,
        code: `def postorder(node):`,
        explanation: "Post-order traversal: Left → Right → Root",
        variables: { traversal_type: "Post-Order", result: "[]" }
      }
    ];

    const result: number[] = [];
    
    const traverse = (node: TreeNode | undefined, depth: number = 0): void => {
      if (!node) {
        steps.push({
          line: 2,
          code: `    if node is None: return`,
          explanation: "Node is None, return to parent",
          variables: { depth: depth, result: `[${result.join(', ')}]` }
        });
        return;
      }

      steps.push({
        line: 3,
        code: `    postorder(node.left)  # Visit left`,
        explanation: `Visit left subtree of node ${node.value}`,
        variables: { 
          current_node: node.value, 
          depth: depth,
          result: `[${result.join(', ')}]` 
        },
        highlightNode: node.value
      });

      // Traverse left
      traverse(node.left, depth + 1);

      steps.push({
        line: 4,
        code: `    postorder(node.right)  # Visit right`,
        explanation: `Visit right subtree of node ${node.value}`,
        variables: { 
          current_node: node.value, 
          depth: depth,
          result: `[${result.join(', ')}]` 
        },
        highlightNode: node.value
      });

      // Traverse right
      traverse(node.right, depth + 1);

      // Process current node last
      result.push(node.value);
      steps.push({
        line: 5,
        code: `    print(node.value)  # Process root`,
        explanation: `Process current node: ${node.value}`,
        variables: { 
          current_node: node.value, 
          depth: depth,
          result: `[${result.join(', ')}]` 
        },
        highlightNode: node.value,
        visitedNodes: [node.value],
        traversalResult: [...result]
      });
    };

    traverse(tree);

    steps.push({
      line: 6,
      code: `# Traversal complete`,
      explanation: `Post-order traversal result: [${result.join(', ')}]`,
      variables: { 
        final_result: `[${result.join(', ')}]`,
        traversal_complete: "true"
      },
      traversalResult: result
    });

    setAnimationSteps(steps);
    setIsAnimating(true);
  };

  // Animate Search Operation
  const animateSearch = () => {
    if (!inputValue || isNaN(Number(inputValue))) {
      alert("Please enter a valid number to search");
      return;
    }

    const searchValue = Number(inputValue);
    resetAnimation();
    setSelectedOperation("Search");

    const steps: AnimationStep[] = [
      {
        line: 1,
        code: `def search(node, value):`,
        explanation: `Search for value ${searchValue} in binary tree`,
        variables: { search_value: searchValue, current_node: "None" }
      }
    ];

    const search = (node: TreeNode | undefined, depth: number = 0): boolean => {
      if (!node) {
        steps.push({
          line: 2,
          code: `    if node is None:`,
          explanation: "Reached null node - value not found in this path",
          variables: { 
            search_value: searchValue, 
            current_node: "None",
            depth: depth,
            found: "false"
          }
        });
        steps.push({
          line: 3,
          code: `        return False`,
          explanation: "Return False - value not found",
          variables: { 
            search_value: searchValue, 
            found: "false"
          }
        });
        return false;
      }

      steps.push({
        line: 4,
        code: `    if node.value == ${searchValue}:`,
        explanation: `Compare current node ${node.value} with search value ${searchValue}`,
        variables: { 
          search_value: searchValue, 
          current_node: node.value,
          depth: depth
        },
        highlightNode: node.value
      });

      if (node.value === searchValue) {
        steps.push({
          line: 5,
          code: `        return True  # Found!`,
          explanation: `Found the value ${searchValue}! 🎉`,
          variables: { 
            search_value: searchValue, 
            current_node: node.value,
            found: "true"
          },
          highlightNode: node.value,
          visitedNodes: [node.value]
        });
        return true;
      }

      steps.push({
        line: 6,
        code: `    # Search left and right subtrees`,
        explanation: `Value not found here, search both subtrees`,
        variables: { 
          search_value: searchValue, 
          current_node: node.value,
          depth: depth
        }
      });

      const foundLeft = search(node.left, depth + 1);
      if (foundLeft) return true;
      
      const foundRight = search(node.right, depth + 1);
      return foundRight;
    };

    const found = search(tree);

    if (!found) {
      steps.push({
        line: 7,
        code: `# Search complete - not found`,
        explanation: `Value ${searchValue} not found in the tree`,
        variables: { 
          search_value: searchValue,
          final_result: "not found"
        }
      });
    }

    setAnimationSteps(steps);
    setInputValue("");
    setIsAnimating(true);
  };

  const renderNode = (node: TreeNode | undefined): React.JSX.Element | null => {
    if (!node) return null;

    return (
      <g key={node.id}>
        {/* Lines to children */}
        {node.left && (
          <motion.line
            x1={node.x}
            y1={node.y! + 25}
            x2={node.left.x}
            y2={node.left.y! - 25}
            stroke="#374151"
            strokeWidth={2}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5 }}
          />
        )}
        {node.right && (
          <motion.line
            x1={node.x}
            y1={node.y! + 25}
            x2={node.right.x}
            y2={node.right.y! - 25}
            stroke="#374151"
            strokeWidth={2}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5 }}
          />
        )}

        {/* Node circle */}
        <motion.circle
          cx={node.x}
          cy={node.y}
          r={25}
          fill={
            node.isHighlighted
              ? "#FDE047"
              : node.isVisited
              ? "#BBF7D0"
              : node.isNew
              ? "#BFDBFE"
              : "#FFFFFF"
          }
          stroke={
            node.isHighlighted
              ? "#EAB308"
              : node.isVisited
              ? "#16A34A"
              : "#374151"
          }
          strokeWidth={node.isHighlighted ? 4 : 2}
          initial={{ scale: 0 }}
          animate={{ 
            scale: node.isHighlighted ? 1.2 : 1,
          }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 20 
          }}
        />

        {/* Node value */}
        <motion.text
          x={node.x}
          y={node.y! + 5}
          textAnchor="middle"
          fontSize="16"
          fontWeight="bold"
          fill={node.isHighlighted ? "#92400E" : "#374151"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {node.value}
        </motion.text>

        {/* Recursively render children */}
        {renderNode(node.left)}
        {renderNode(node.right)}
      </g>
    );
  };

  const manualStepControl = () => {
    if (currentStep < animationSteps.length) {
      executeStep(animationSteps[currentStep]);
      setCurrentStep(prev => prev + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold text-center text-green-800 mb-8">
          🌳 Interactive Binary Tree Visualizer
        </h1>

        {/* Operation Controls */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">🎮 Controls</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <input
              type="text"
              placeholder="Search value"
              className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200"
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
            <button onClick={animateInOrder} className="btn-primary">
              📝 In-Order
            </button>
            <button onClick={animatePreOrder} className="btn-secondary">
              📋 Pre-Order
            </button>
            <button onClick={animatePostOrder} className="btn-accent">
              📄 Post-Order
            </button>
            <button onClick={animateSearch} className="btn-special">
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

        {/* Tree Visualization */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">🌳 Binary Tree Structure</h2>
          
          <div className="flex justify-center">
            <svg width="800" height="350" className="border border-gray-200 rounded-lg">
              <AnimatePresence>
                {renderNode(tree)}
              </AnimatePresence>
            </svg>
          </div>

          {/* Traversal Result Display */}
          {traversalResult.length > 0 && (
            <div className="mt-6 p-4 bg-green-50 border-2 border-green-200 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">
                📊 {selectedOperation} Result
              </h3>
              <div className="flex flex-wrap gap-2">
                {traversalResult.map((value, index) => (
                  <motion.div
                    key={`result-${index}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="px-3 py-1 bg-green-200 text-green-800 rounded-full font-semibold"
                  >
                    {value}
                  </motion.div>
                ))}
              </div>
            </div>
          )}
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
                      className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-300"
                    >
                      Next Step
                    </button>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full transition-all duration-300"
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
                  <span className="font-mono text-sm font-semibold text-green-600">
                    {String(value)}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Traversal Types */}
            <div className="mt-6 p-4 bg-green-50 border-2 border-green-200 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">🌳 Traversal Types</h3>
              <div className="text-sm text-green-700 space-y-2">
                <div><strong>In-Order:</strong> Left → Root → Right</div>
                <div><strong>Pre-Order:</strong> Root → Left → Right</div>
                <div><strong>Post-Order:</strong> Left → Right → Root</div>
              </div>
            </div>

            {/* Use Cases */}
            <div className="mt-4 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">🎯 Common Uses</h3>
              <div className="text-sm text-blue-700 space-y-1">
                <div>• Expression parsing</div>
                <div>• File system hierarchy</div>
                <div>• Decision trees</div>
                <div>• Binary search trees</div>
              </div>
            </div>

            {/* Legend */}
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">🎨 Color Legend</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-200 border-2 border-yellow-500 rounded-full"></div>
                  <span>Currently processing</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-200 border-2 border-green-500 rounded-full"></div>
                  <span>Visited/processed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .btn-primary {
          @apply px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium;
        }
        .btn-secondary {
          @apply px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium;
        }
        .btn-accent {
          @apply px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-medium;
        }
        .btn-special {
          @apply px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium;
        }
      `}</style>
    </div>
  );
};

export default BinaryTreeAnimation;
