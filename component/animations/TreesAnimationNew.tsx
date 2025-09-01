"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";

interface TreeNode {
  id: number;
  value: number;
  children: TreeNode[];
  parent?: TreeNode | null;
  level?: number;
  isNew?: boolean;
  isHighlighted?: boolean;
  isBeingRemoved?: boolean;
  isProcessing?: boolean;
  isVisited?: boolean;
  x?: number;
  y?: number;
}

interface AnimationStep {
  line: number;
  code: string;
  explanation: string;
  treeState?: TreeNode[];
  variables?: { [key: string]: string | number };
  highlightNode?: number;
  traversalOrder?: number[];
}

const TreesAnimation = () => {
  const [trees, setTrees] = useState<TreeNode[]>([
    {
      id: 1,
      value: 1,
      level: 0,
      children: [
        {
          id: 2,
          value: 2,
          level: 1,
          children: [
            { id: 4, value: 4, level: 2, children: [] },
            { id: 5, value: 5, level: 2, children: [] }
          ]
        },
        {
          id: 3,
          value: 3,
          level: 1,
          children: [
            { id: 6, value: 6, level: 2, children: [] },
            { id: 7, value: 7, level: 2, children: [] },
            { id: 8, value: 8, level: 2, children: [] }
          ]
        }
      ]
    }
  ]);
  
  const [inputValue, setInputValue] = useState("");
  const [parentValue, setParentValue] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [animationSteps, setAnimationSteps] = useState<AnimationStep[]>([]);
  const [variables, setVariables] = useState<{ [key: string]: string | number }>({});
  const [operationSpeed, setOperationSpeed] = useState(1000);
  const [selectedOperation, setSelectedOperation] = useState<string>("");
  const [traversalOrder, setTraversalOrder] = useState<number[]>([]);

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const resetAnimation = () => {
    setIsAnimating(false);
    setCurrentStep(0);
    setAnimationSteps([]);
    setVariables({});
    setTraversalOrder([]);
    // Reset tree node states
    const resetNodeStates = (nodes: TreeNode[]): TreeNode[] => {
      return nodes.map(node => ({
        ...node,
        isNew: false,
        isHighlighted: false,
        isBeingRemoved: false,
        isProcessing: false,
        isVisited: false,
        children: resetNodeStates(node.children)
      }));
    };
    setTrees(resetNodeStates(trees));
  };

  const executeStep = useCallback(async (step: AnimationStep) => {
    if (step.variables) {
      setVariables(step.variables);
    }
    if (step.treeState) {
      setTrees(step.treeState);
    }
    if (step.highlightNode !== undefined) {
      const highlightNodeInTree = (nodes: TreeNode[], targetValue: number): TreeNode[] => {
        return nodes.map(node => ({
          ...node,
          isHighlighted: node.value === targetValue,
          isProcessing: node.value === targetValue,
          children: highlightNodeInTree(node.children, targetValue)
        }));
      };
      setTrees(prev => highlightNodeInTree(prev, step.highlightNode!));
    }
    if (step.traversalOrder) {
      setTraversalOrder(step.traversalOrder);
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

  // Find node by value
  const findNode = (nodes: TreeNode[], value: number): TreeNode | null => {
    for (const node of nodes) {
      if (node.value === value) return node;
      const found = findNode(node.children, value);
      if (found) return found;
    }
    return null;
  };

  // Calculate tree depth
  const calculateDepth = (nodes: TreeNode[]): number => {
    if (nodes.length === 0) return 0;
    return 1 + Math.max(...nodes.map(node => calculateDepth(node.children)));
  };

  // Count total nodes
  const countNodes = (nodes: TreeNode[]): number => {
    return nodes.reduce((count, node) => count + 1 + countNodes(node.children), 0);
  };

  // Insert Node
  const animateInsert = () => {
    if (!inputValue || !parentValue || isNaN(Number(inputValue)) || isNaN(Number(parentValue))) {
      alert("Please enter valid numbers for both node value and parent value");
      return;
    }

    const newValue = Number(inputValue);
    const parentVal = Number(parentValue);

    const parent = findNode(trees, parentVal);
    if (!parent) {
      alert(`Parent node ${parentVal} not found`);
      return;
    }

    resetAnimation();
    setSelectedOperation(`Insert ${newValue} as child of ${parentVal}`);

    const steps: AnimationStep[] = [
      {
        line: 1,
        code: `def insert_child(parent_value, new_value):`,
        explanation: `Insert ${newValue} as child of node ${parentVal}`,
        variables: { 
          parent_value: parentVal,
          new_value: newValue,
          operation: "Insert"
        }
      },
      {
        line: 2,
        code: `    parent = find_node(root, parent_value)`,
        explanation: `Search for parent node with value ${parentVal}`,
        variables: { 
          searching_for: parentVal
        },
        highlightNode: parentVal
      },
      {
        line: 3,
        code: `    if parent is None:`,
        explanation: `Parent node found: ${parentVal}`,
        variables: { 
          parent_found: "true",
          parent_value: parentVal
        }
      },
      {
        line: 4,
        code: `    new_node = Node(${newValue})`,
        explanation: `Create new node with value ${newValue}`,
        variables: { 
          new_node: newValue,
          parent_level: parent.level || 0,
          new_level: (parent.level || 0) + 1
        }
      }
    ];

    const newNode: TreeNode = {
      id: Date.now(),
      value: newValue,
      level: (parent.level || 0) + 1,
      children: [],
      parent: parent,
      isNew: true
    };

    const insertNodeInTree = (nodes: TreeNode[]): TreeNode[] => {
      return nodes.map(node => {
        if (node.value === parentVal) {
          return {
            ...node,
            children: [...node.children, newNode]
          };
        }
        return {
          ...node,
          children: insertNodeInTree(node.children)
        };
      });
    };

    const newTrees = insertNodeInTree(trees);

    steps.push({
      line: 5,
      code: `    parent.children.append(new_node)`,
      explanation: `Add new node to parent's children list`,
      variables: { 
        parent: parentVal,
        children_count: parent.children.length + 1,
        inserted: newValue
      },
      treeState: newTrees
    });

    steps.push({
      line: 6,
      code: `    new_node.parent = parent`,
      explanation: `Set parent pointer for new node`,
      variables: { 
        new_node: newValue,
        parent_pointer: parentVal,
        tree_depth: calculateDepth(newTrees)
      }
    });

    setAnimationSteps(steps);
    setInputValue("");
    setParentValue("");
    setIsAnimating(true);
  };

  // Delete Node
  const animateDelete = () => {
    if (!inputValue || isNaN(Number(inputValue))) {
      alert("Please enter a valid number");
      return;
    }

    const deleteValue = Number(inputValue);
    const nodeToDelete = findNode(trees, deleteValue);

    if (!nodeToDelete) {
      alert(`Node ${deleteValue} not found`);
      return;
    }

    resetAnimation();
    setSelectedOperation(`Delete Node ${deleteValue}`);

    const steps: AnimationStep[] = [
      {
        line: 1,
        code: `def delete_node(value):`,
        explanation: `Delete node with value ${deleteValue}`,
        variables: { 
          value: deleteValue,
          operation: "Delete"
        }
      },
      {
        line: 2,
        code: `    node = find_node(root, value)`,
        explanation: `Find node to delete`,
        variables: { 
          searching_for: deleteValue
        },
        highlightNode: deleteValue
      },
      {
        line: 3,
        code: `    if node.children:`,
        explanation: `Check if node has children: ${nodeToDelete.children.length > 0 ? 'Yes' : 'No'}`,
        variables: { 
          has_children: nodeToDelete.children.length > 0 ? "true" : "false",
          children_count: nodeToDelete.children.length
        }
      }
    ];

    if (nodeToDelete.children.length > 0) {
      steps.push({
        line: 4,
        code: `        # Handle children`,
        explanation: `Node has ${nodeToDelete.children.length} children - need to handle them`,
        variables: { 
          children_values: nodeToDelete.children.map(c => c.value).join(', '),
          strategy: "promote or reassign"
        }
      });

      // Option 1: Promote first child and attach siblings
      if (nodeToDelete.children.length > 0) {
        steps.push({
          line: 5,
          code: `        promote_first_child()`,
          explanation: `Promote first child (${nodeToDelete.children[0].value}) to replace deleted node`,
          variables: { 
            promoted: nodeToDelete.children[0].value,
            siblings_count: nodeToDelete.children.length - 1
          }
        });
      }
    }

    const deleteNodeFromTree = (nodes: TreeNode[]): TreeNode[] => {
      return nodes.filter(node => {
        if (node.value === deleteValue) {
          return false; // Remove this node
        }
        return true;
      }).map(node => ({
        ...node,
        children: deleteNodeFromTree(node.children)
      }));
    };

    const newTrees = deleteNodeFromTree(trees);

    steps.push({
      line: 6,
      code: `    remove_node_from_tree(node)`,
      explanation: `Remove node ${deleteValue} from tree structure`,
      variables: { 
        deleted: deleteValue,
        remaining_nodes: countNodes(newTrees),
        new_depth: calculateDepth(newTrees)
      },
      treeState: newTrees
    });

    setAnimationSteps(steps);
    setInputValue("");
    setIsAnimating(true);
  };

  // Depth-First Search Traversal
  const animateDFS = () => {
    resetAnimation();
    setSelectedOperation("Depth-First Search (DFS)");

    const steps: AnimationStep[] = [
      {
        line: 1,
        code: `def dfs(node):`,
        explanation: `Depth-First Search traversal of general tree`,
        variables: { 
          algorithm: "DFS",
          order: "Pre-order",
          total_nodes: countNodes(trees)
        }
      }
    ];

    const visited: number[] = [];
    
    const dfsRecursive = (nodes: TreeNode[], depth: number = 0): void => {
      for (const node of nodes) {
        visited.push(node.value);
        
        steps.push({
          line: 2,
          code: `    visit(${node.value})`,
          explanation: `Visit node ${node.value} at level ${node.level || depth}`,
          variables: { 
            current: node.value,
            level: node.level || depth,
            visited_count: visited.length,
            children_count: node.children.length
          },
          highlightNode: node.value,
          traversalOrder: [...visited]
        });

        if (node.children.length > 0) {
          steps.push({
            line: 3,
            code: `    for child in node.children:`,
            explanation: `Explore ${node.children.length} children of node ${node.value}`,
            variables: { 
              parent: node.value,
              children: node.children.map(c => c.value).join(', ')
            }
          });

          dfsRecursive(node.children, depth + 1);
        }

        steps.push({
          line: 4,
          code: `    # Backtrack from ${node.value}`,
          explanation: `Finished exploring subtree rooted at ${node.value}`,
          variables: { 
            backtrack_from: node.value,
            subtree_complete: "true"
          }
        });
      }
    };

    dfsRecursive(trees);

    steps.push({
      line: 5,
      code: `# DFS Complete`,
      explanation: `DFS traversal complete. Visited ${visited.length} nodes.`,
      variables: { 
        total_visited: visited.length,
        traversal_order: visited.join(' → '),
        algorithm_complete: "true"
      },
      traversalOrder: visited
    });

    setAnimationSteps(steps);
    setIsAnimating(true);
  };

  // Breadth-First Search Traversal
  const animateBFS = () => {
    resetAnimation();
    setSelectedOperation("Breadth-First Search (BFS)");

    const steps: AnimationStep[] = [
      {
        line: 1,
        code: `def bfs(root):`,
        explanation: `Breadth-First Search traversal of general tree`,
        variables: { 
          algorithm: "BFS",
          order: "Level-order",
          total_nodes: countNodes(trees)
        }
      },
      {
        line: 2,
        code: `    queue = [root]`,
        explanation: `Initialize queue with root nodes`,
        variables: { 
          queue_size: trees.length,
          initial_nodes: trees.map(t => t.value).join(', ')
        }
      }
    ];

    const visited: number[] = [];
    const queue: TreeNode[] = [...trees];
    let level = 0;

    while (queue.length > 0) {
      const levelSize = queue.length;
      const currentLevel: number[] = [];

      steps.push({
        line: 3,
        code: `    while queue: # Level ${level}`,
        explanation: `Process level ${level} with ${levelSize} nodes`,
        variables: { 
          current_level: level,
          nodes_in_level: levelSize,
          queue_state: queue.map(n => n.value).join(', ')
        }
      });

      for (let i = 0; i < levelSize; i++) {
        const node = queue.shift()!;
        visited.push(node.value);
        currentLevel.push(node.value);

        steps.push({
          line: 4,
          code: `        node = queue.pop(0)  # ${node.value}`,
          explanation: `Visit node ${node.value} at level ${level}`,
          variables: { 
            current: node.value,
            level: level,
            visited_count: visited.length,
            remaining_in_queue: queue.length
          },
          highlightNode: node.value,
          traversalOrder: [...visited]
        });

        if (node.children.length > 0) {
          steps.push({
            line: 5,
            code: `        queue.extend(node.children)`,
            explanation: `Add ${node.children.length} children to queue: ${node.children.map(c => c.value).join(', ')}`,
            variables: { 
              parent: node.value,
              children_added: node.children.map(c => c.value).join(', '),
              new_queue_size: queue.length + node.children.length
            }
          });

          queue.push(...node.children);
        }
      }

      steps.push({
        line: 6,
        code: `    # Level ${level} complete`,
        explanation: `Completed level ${level}: ${currentLevel.join(', ')}`,
        variables: { 
          completed_level: level,
          level_nodes: currentLevel.join(', '),
          nodes_remaining: queue.length
        }
      });

      level++;
    }

    steps.push({
      line: 7,
      code: `# BFS Complete`,
      explanation: `BFS traversal complete. Visited ${visited.length} nodes level by level.`,
      variables: { 
        total_visited: visited.length,
        levels_traversed: level,
        traversal_order: visited.join(' → '),
        algorithm_complete: "true"
      },
      traversalOrder: visited
    });

    setAnimationSteps(steps);
    setIsAnimating(true);
  };

  // Find Height of Tree
  const animateFindHeight = () => {
    resetAnimation();
    setSelectedOperation("Find Tree Height");

    const steps: AnimationStep[] = [
      {
        line: 1,
        code: `def find_height(node):`,
        explanation: `Find the height of the tree (longest path from root to leaf)`,
        variables: { 
          operation: "Find Height",
          total_nodes: countNodes(trees)
        }
      }
    ];

    const findHeightRecursive = (nodes: TreeNode[], depth: number = 0): number => {
      if (nodes.length === 0) {
        steps.push({
          line: 2,
          code: `    if not node: return 0`,
          explanation: `Leaf reached, return height 0`,
          variables: { 
            leaf_reached: "true",
            current_depth: depth
          }
        });
        return 0;
      }

      let maxHeight = 0;
      
      for (const node of nodes) {
        steps.push({
          line: 3,
          code: `    # At node ${node.value}`,
          explanation: `Calculate height for subtree rooted at ${node.value}`,
          variables: { 
            current_node: node.value,
            current_depth: depth,
            children_count: node.children.length
          },
          highlightNode: node.value
        });

        if (node.children.length > 0) {
          const childHeight = findHeightRecursive(node.children, depth + 1);
          const nodeHeight = 1 + childHeight;
          maxHeight = Math.max(maxHeight, nodeHeight);

          steps.push({
            line: 4,
            code: `    height = 1 + max(child_heights)`,
            explanation: `Height of ${node.value}: 1 + ${childHeight} = ${nodeHeight}`,
            variables: { 
              node: node.value,
              child_height: childHeight,
              node_height: nodeHeight,
              max_so_far: maxHeight
            }
          });
        } else {
          steps.push({
            line: 5,
            code: `    # Leaf node height = 1`,
            explanation: `Node ${node.value} is a leaf, height = 1`,
            variables: { 
              leaf_node: node.value,
              height: 1
            }
          });
          maxHeight = Math.max(maxHeight, 1);
        }
      }

      return maxHeight;
    };

    const treeHeight = findHeightRecursive(trees);

    steps.push({
      line: 6,
      code: `# Height calculation complete`,
      explanation: `Tree height is ${treeHeight}`,
      variables: { 
        final_height: treeHeight,
        calculation_complete: "true"
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

  // Calculate layout positions for nodes
  const calculateLayout = (nodes: TreeNode[], startX: number = 400, startY: number = 60, levelGap: number = 100): void => {
    const nodeWidth = 80;

    const positionNodes = (nodeList: TreeNode[], x: number, y: number): number => {
      let currentX = x;
      
      for (const node of nodeList) {
        
        if (node.children.length === 0) {
          node.x = currentX;
          node.y = y;
          currentX += nodeWidth;
        } else {
          const childrenStartX = currentX;
          const childrenEndX = positionNodes(node.children, currentX, y + levelGap);
          node.x = (childrenStartX + childrenEndX) / 2 - nodeWidth / 2;
          node.y = y;
          currentX = childrenEndX;
        }
      }
      
      return currentX;
    };

    positionNodes(nodes, startX - (countNodes(trees) * nodeWidth) / 2, startY);
  };

  calculateLayout(trees);

  // Render Tree Nodes
  const renderNodes = (nodes: TreeNode[]): React.JSX.Element[] => {
    return nodes.flatMap(node => [
      // Connections to children
      ...node.children.map(child => (
        <line
          key={`edge-${node.id}-${child.id}`}
          x1={node.x! + 25}
          y1={node.y! + 25}
          x2={child.x! + 25}
          y2={child.y! - 25}
          stroke={node.isHighlighted ? "#8b5cf6" : "#6b7280"}
          strokeWidth={node.isHighlighted ? "3" : "2"}
        />
      )),
      
      // Node circle
      <motion.circle
        key={`node-${node.id}`}
        cx={node.x! + 25}
        cy={node.y!}
        r="25"
        fill={
          node.isHighlighted 
            ? "#8b5cf6" 
            : node.isNew
            ? "#10b981"
            : node.isVisited
            ? "#f59e0b"
            : "#3b82f6"
        }
        stroke={
          node.isHighlighted 
            ? "#7c3aed" 
            : node.isNew
            ? "#059669"
            : node.isVisited
            ? "#d97706"
            : "#2563eb"
        }
        strokeWidth="3"
        initial={{ scale: 0 }}
        animate={{ 
          scale: node.isHighlighted ? 1.2 : 1
        }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 20 
        }}
      />,

      // Node value
      <text
        key={`text-${node.id}`}
        x={node.x! + 25}
        y={node.y! + 5}
        textAnchor="middle"
        fill="white"
        fontSize="14"
        fontWeight="bold"
      >
        {node.value}
      </text>,

      // Level indicator
      <text
        key={`level-${node.id}`}
        x={node.x! + 25}
        y={node.y! - 35}
        textAnchor="middle"
        fill="#4b5563"
        fontSize="10"
      >
        L{node.level || 0}
      </text>,

      // Recursively render children
      ...renderNodes(node.children)
    ]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold text-center text-green-800 mb-8">
          🌲 Interactive General Tree Visualizer
        </h1>

        {/* Operation Controls */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">🎮 Controls</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <input
              type="number"
              placeholder="Node value"
              className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <input
              type="number"
              placeholder="Parent value (for insert)"
              className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
              value={parentValue}
              onChange={(e) => setParentValue(e.target.value)}
            />
            <select
              className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500"
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
            <button onClick={animateInsert} className="btn-primary">
              ➕ Insert
            </button>
            <button onClick={animateDelete} className="btn-danger">
              🗑️ Delete
            </button>
            <button onClick={animateDFS} className="btn-secondary">
              🔍 DFS
            </button>
            <button onClick={animateBFS} className="btn-info">
              🔍 BFS
            </button>
            <button onClick={animateFindHeight} className="btn-warning">
              📏 Height
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

        {/* General Tree Visualization */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            🌲 General Tree Visualization
          </h2>
          
          <div className="relative bg-gray-50 rounded-lg p-8" style={{ height: '500px' }}>
            {trees.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-500 text-lg">
                Empty Tree - Insert nodes to build the tree
              </div>
            ) : (
              <svg width="100%" height="100%" viewBox="0 0 800 500">
                {renderNodes(trees)}
              </svg>
            )}
          </div>

          {/* Tree Statistics */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-green-50 border-2 border-green-200 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">📊 Tree Stats</h3>
              <div className="text-sm text-green-700 space-y-1">
                <div>• <strong>Total Nodes:</strong> {countNodes(trees)}</div>
                <div>• <strong>Tree Height:</strong> {calculateDepth(trees)}</div>
                <div>• <strong>Root Nodes:</strong> {trees.length}</div>
              </div>
            </div>

            <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">🔍 Traversal</h3>
              <div className="text-sm text-blue-700 space-y-1">
                <div>• <strong>DFS:</strong> Depth-first</div>
                <div>• <strong>BFS:</strong> Level-order</div>
                <div>• <strong>Current:</strong> {selectedOperation.includes('DFS') ? 'DFS' : selectedOperation.includes('BFS') ? 'BFS' : 'None'}</div>
              </div>
            </div>

            <div className="p-4 bg-purple-50 border-2 border-purple-200 rounded-lg">
              <h3 className="font-semibold text-purple-800 mb-2">🌟 Properties</h3>
              <div className="text-sm text-purple-700 space-y-1">
                <div>• <strong>Type:</strong> General Tree</div>
                <div>• <strong>Children:</strong> Unlimited</div>
                <div>• <strong>Structure:</strong> Hierarchical</div>
              </div>
            </div>

            <div className="p-4 bg-orange-50 border-2 border-orange-200 rounded-lg">
              <h3 className="font-semibold text-orange-800 mb-2">📈 Complexity</h3>
              <div className="text-sm text-orange-700 space-y-1">
                <div>• <strong>Search:</strong> O(n)</div>
                <div>• <strong>Insert:</strong> O(n)</div>
                <div>• <strong>Delete:</strong> O(n)</div>
              </div>
            </div>
          </div>

          {/* Traversal Order Display */}
          {traversalOrder.length > 0 && (
            <div className="mt-6 p-4 bg-indigo-50 border-2 border-indigo-200 rounded-lg">
              <h3 className="font-semibold text-indigo-800 mb-2">🔄 Traversal Order</h3>
              <div className="text-sm text-indigo-700">
                <strong>Visited Nodes:</strong> {traversalOrder.join(' → ')}
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
                  <span className="font-mono text-sm font-semibold text-green-600">
                    {String(value)}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Tree Properties */}
            <div className="mt-6 p-4 bg-green-50 border-2 border-green-200 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">🌲 Tree Properties</h3>
              <div className="text-sm text-green-700 space-y-1">
                <div>• Each node can have unlimited children</div>
                <div>• Hierarchical structure with parent-child relationships</div>
                <div>• No ordering constraints (unlike BST)</div>
                <div>• Useful for file systems, organization charts</div>
              </div>
            </div>

            {/* Traversal Comparison */}
            <div className="mt-4 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">🔍 Traversal Methods</h3>
              <div className="text-sm text-blue-700 space-y-1">
                <div>• <strong>DFS (Pre-order):</strong> Node → Children</div>
                <div>• <strong>BFS (Level-order):</strong> Level by level</div>
                <div>• <strong>Use DFS for:</strong> File system traversal</div>
                <div>• <strong>Use BFS for:</strong> Finding shortest paths</div>
              </div>
            </div>

            {/* Use Cases */}
            <div className="mt-4 p-4 bg-purple-50 border-2 border-purple-200 rounded-lg">
              <h3 className="font-semibold text-purple-800 mb-2">🎯 Use Cases</h3>
              <div className="text-sm text-purple-700 space-y-1">
                <div>• File system directories</div>
                <div>• Organization hierarchies</div>
                <div>• Decision trees</div>
                <div>• XML/HTML DOM structure</div>
                <div>• Game AI decision making</div>
              </div>
            </div>

            {/* Legend */}
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">🎨 Color Legend</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                  <span>Currently highlighted</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <span>Newly inserted</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                  <span>Visited during traversal</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                  <span>Regular node</span>
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
          @apply px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-medium;
        }
        .btn-danger {
          @apply px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium;
        }
        .btn-info {
          @apply px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium;
        }
        .btn-warning {
          @apply px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors font-medium;
        }
      `}</style>
    </div>
  );
};

export default TreesAnimation;
