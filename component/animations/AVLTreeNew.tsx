"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";

interface AVLNode {
  id: number;
  value: number;
  left: AVLNode | null;
  right: AVLNode | null;
  height: number;
  balanceFactor?: number;
  isNew?: boolean;
  isHighlighted?: boolean;
  isBeingRemoved?: boolean;
  isRotating?: boolean;
  isProcessing?: boolean;
  x?: number;
  y?: number;
}

interface AnimationStep {
  line: number;
  code: string;
  explanation: string;
  treeState?: AVLNode | null;
  variables?: { [key: string]: string | number };
  highlightNode?: number;
  rotationType?: 'left' | 'right' | 'left-right' | 'right-left';
}

const AVLTreeAnimation = () => {
  const [tree, setTree] = useState<AVLNode | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [animationSteps, setAnimationSteps] = useState<AnimationStep[]>([]);
  const [variables, setVariables] = useState<{ [key: string]: string | number }>({});
  const [operationSpeed, setOperationSpeed] = useState(1000);
  const [selectedOperation, setSelectedOperation] = useState<string>("");
  const [rotationCount, setRotationCount] = useState(0);

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // Utility functions
  const getHeight = (node: AVLNode | null): number => (node ? node.height : 0);

  const getBalanceFactor = (node: AVLNode | null): number => {
    if (!node) return 0;
    return getHeight(node.left) - getHeight(node.right);
  };

  const updateHeight = (node: AVLNode): void => {
    node.height = Math.max(getHeight(node.left), getHeight(node.right)) + 1;
    node.balanceFactor = getBalanceFactor(node);
  };

  const resetAnimation = () => {
    setIsAnimating(false);
    setCurrentStep(0);
    setAnimationSteps([]);
    setVariables({});
    setRotationCount(0);
    // Reset tree node states
    const resetNodeStates = (node: AVLNode | null): AVLNode | null => {
      if (!node) return null;
      return {
        ...node,
        isNew: false,
        isHighlighted: false,
        isBeingRemoved: false,
        isRotating: false,
        isProcessing: false,
        left: resetNodeStates(node.left),
        right: resetNodeStates(node.right)
      };
    };
    setTree(resetNodeStates(tree));
  };

  const executeStep = useCallback(async (step: AnimationStep) => {
    if (step.variables) {
      setVariables(step.variables);
    }
    if (step.treeState !== undefined) {
      setTree(step.treeState);
    }
    if (step.highlightNode !== undefined) {
      const highlightNodeInTree = (node: AVLNode | null, targetValue: number): AVLNode | null => {
        if (!node) return null;
        return {
          ...node,
          isHighlighted: node.value === targetValue,
          isProcessing: node.value === targetValue,
          left: highlightNodeInTree(node.left, targetValue),
          right: highlightNodeInTree(node.right, targetValue)
        };
      };
      setTree(prev => highlightNodeInTree(prev, step.highlightNode!));
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

  // Right Rotation
  const rightRotate = (y: AVLNode, steps: AnimationStep[]): AVLNode => {
    steps.push({
      line: 1,
      code: `def right_rotate(y):`,
      explanation: `Performing right rotation on node ${y.value}`,
      variables: { 
        rotation_type: "Right Rotation",
        pivot: y.value,
        rotation_count: rotationCount + 1
      }
    });

    const x = y.left!;
    steps.push({
      line: 2,
      code: `    x = y.left  # ${x.value}`,
      explanation: `Store left child (${x.value}) as new root`,
      variables: { 
        x: x.value,
        y: y.value
      }
    });

    steps.push({
      line: 3,
      code: `    y.left = x.right`,
      explanation: `Move x's right subtree to y's left`,
      variables: { 
        y_left: x.right ? x.right.value : "None",
        operation: "subtree transfer"
      }
    });

    steps.push({
      line: 4,
      code: `    x.right = y`,
      explanation: `Make y the right child of x`,
      variables: { 
        x_right: y.value,
        new_structure: `${x.value} -> ${y.value}`
      }
    });

    const newX: AVLNode = {
      ...x,
      right: {
        ...y,
        left: x.right,
        isRotating: true
      },
      isRotating: true
    };

    updateHeight(newX.right!);
    updateHeight(newX);

    steps.push({
      line: 5,
      code: `    update_heights(y, x)`,
      explanation: `Update heights after rotation`,
      variables: { 
        y_height: newX.right!.height,
        x_height: newX.height,
        y_balance: getBalanceFactor(newX.right!),
        x_balance: getBalanceFactor(newX)
      },
      treeState: newX
    });

    setRotationCount(prev => prev + 1);
    return newX;
  };

  // Left Rotation
  const leftRotate = (x: AVLNode, steps: AnimationStep[]): AVLNode => {
    steps.push({
      line: 1,
      code: `def left_rotate(x):`,
      explanation: `Performing left rotation on node ${x.value}`,
      variables: { 
        rotation_type: "Left Rotation",
        pivot: x.value,
        rotation_count: rotationCount + 1
      }
    });

    const y = x.right!;
    steps.push({
      line: 2,
      code: `    y = x.right  # ${y.value}`,
      explanation: `Store right child (${y.value}) as new root`,
      variables: { 
        x: x.value,
        y: y.value
      }
    });

    steps.push({
      line: 3,
      code: `    x.right = y.left`,
      explanation: `Move y's left subtree to x's right`,
      variables: { 
        x_right: y.left ? y.left.value : "None",
        operation: "subtree transfer"
      }
    });

    steps.push({
      line: 4,
      code: `    y.left = x`,
      explanation: `Make x the left child of y`,
      variables: { 
        y_left: x.value,
        new_structure: `${y.value} -> ${x.value}`
      }
    });

    const newY: AVLNode = {
      ...y,
      left: {
        ...x,
        right: y.left,
        isRotating: true
      },
      isRotating: true
    };

    updateHeight(newY.left!);
    updateHeight(newY);

    steps.push({
      line: 5,
      code: `    update_heights(x, y)`,
      explanation: `Update heights after rotation`,
      variables: { 
        x_height: newY.left!.height,
        y_height: newY.height,
        x_balance: getBalanceFactor(newY.left!),
        y_balance: getBalanceFactor(newY)
      },
      treeState: newY
    });

    setRotationCount(prev => prev + 1);
    return newY;
  };

  // Balance the tree
  const balance = (node: AVLNode, steps: AnimationStep[]): AVLNode => {
    const bf = getBalanceFactor(node);
    
    steps.push({
      line: 1,
      code: `def balance(node):`,
      explanation: `Check balance factor of node ${node.value}`,
      variables: { 
        node: node.value,
        balance_factor: bf,
        height: node.height
      },
      highlightNode: node.value
    });

    steps.push({
      line: 2,
      code: `    bf = height(left) - height(right) = ${bf}`,
      explanation: `Balance factor = ${getHeight(node.left)} - ${getHeight(node.right)} = ${bf}`,
      variables: { 
        left_height: getHeight(node.left),
        right_height: getHeight(node.right),
        balance_factor: bf,
        is_balanced: Math.abs(bf) <= 1 ? "Yes" : "No"
      }
    });

    if (bf > 1) {
      // Left heavy
      const leftBF = getBalanceFactor(node.left);
      steps.push({
        line: 3,
        code: `    if bf > 1: # Left Heavy`,
        explanation: `Left subtree is heavier (bf = ${bf} > 1)`,
        variables: { 
          case: "Left Heavy",
          left_bf: leftBF
        }
      });

      if (leftBF < 0) {
        // Left-Right case
        steps.push({
          line: 4,
          code: `        if left.bf < 0: # Left-Right Case`,
          explanation: `Left child is right heavy (${leftBF} < 0) - LR rotation needed`,
          variables: { 
            rotation_case: "Left-Right",
            first_rotation: "Left on left child",
            second_rotation: "Right on node"
          },
          rotationType: 'left-right'
        });

        node.left = leftRotate(node.left!, steps);
      } else {
        steps.push({
          line: 5,
          code: `        # Left-Left Case`,
          explanation: `Left child is left heavy or balanced - LL rotation`,
          variables: { 
            rotation_case: "Left-Left",
            rotation_needed: "Right rotation"
          }
        });
      }
      
      return rightRotate(node, steps);
    }
    
    if (bf < -1) {
      // Right heavy
      const rightBF = getBalanceFactor(node.right);
      steps.push({
        line: 6,
        code: `    elif bf < -1: # Right Heavy`,
        explanation: `Right subtree is heavier (bf = ${bf} < -1)`,
        variables: { 
          case: "Right Heavy",
          right_bf: rightBF
        }
      });

      if (rightBF > 0) {
        // Right-Left case
        steps.push({
          line: 7,
          code: `        if right.bf > 0: # Right-Left Case`,
          explanation: `Right child is left heavy (${rightBF} > 0) - RL rotation needed`,
          variables: { 
            rotation_case: "Right-Left",
            first_rotation: "Right on right child",
            second_rotation: "Left on node"
          },
          rotationType: 'right-left'
        });

        node.right = rightRotate(node.right!, steps);
      } else {
        steps.push({
          line: 8,
          code: `        # Right-Right Case`,
          explanation: `Right child is right heavy or balanced - RR rotation`,
          variables: { 
            rotation_case: "Right-Right",
            rotation_needed: "Left rotation"
          }
        });
      }
      
      return leftRotate(node, steps);
    }

    steps.push({
      line: 9,
      code: `    return node  # Already balanced`,
      explanation: `Node is balanced (|${bf}| ≤ 1), no rotation needed`,
      variables: { 
        balanced: "true",
        final_bf: bf
      }
    });

    return node;
  };

  // Insert with animation
  const animateInsert = () => {
    if (!inputValue || isNaN(Number(inputValue))) {
      alert("Please enter a valid number");
      return;
    }

    const newValue = Number(inputValue);
    resetAnimation();
    setSelectedOperation(`Insert ${newValue}`);

    const steps: AnimationStep[] = [
      {
        line: 1,
        code: `def insert(root, value):`,
        explanation: `Insert ${newValue} into AVL tree`,
        variables: { 
          value: newValue,
          operation: "Insert"
        }
      }
    ];

    let nodeCounter = 0;
    
    const insertRecursive = (node: AVLNode | null, value: number, depth: number = 0): AVLNode => {
      if (!node) {
        steps.push({
          line: 2,
          code: `    if root is None:`,
          explanation: `Create new node with value ${value}`,
          variables: { 
            new_node: value,
            depth: depth,
            height: 1
          }
        });

        const newNode: AVLNode = {
          id: ++nodeCounter,
          value,
          left: null,
          right: null,
          height: 1,
          balanceFactor: 0,
          isNew: true
        };

        steps.push({
          line: 3,
          code: `        return Node(${value})`,
          explanation: `Return new node with height 1`,
          variables: { 
            created: value,
            node_height: 1
          },
          treeState: newNode
        });

        return newNode;
      }

      steps.push({
        line: 4,
        code: `    # At node ${node.value}`,
        explanation: `Compare ${value} with current node ${node.value}`,
        variables: { 
          current: node.value,
          target: value,
          depth: depth
        },
        highlightNode: node.value
      });

      if (value < node.value) {
        steps.push({
          line: 5,
          code: `    if value < root.value:`,
          explanation: `${value} < ${node.value}, go to left subtree`,
          variables: { 
            direction: "left",
            comparison: `${value} < ${node.value}`
          }
        });

        node.left = insertRecursive(node.left, value, depth + 1);
      } else if (value > node.value) {
        steps.push({
          line: 6,
          code: `    elif value > root.value:`,
          explanation: `${value} > ${node.value}, go to right subtree`,
          variables: { 
            direction: "right",
            comparison: `${value} > ${node.value}`
          }
        });

        node.right = insertRecursive(node.right, value, depth + 1);
      } else {
        steps.push({
          line: 7,
          code: `    else: # Duplicate value`,
          explanation: `Value ${value} already exists, return unchanged`,
          variables: { 
            duplicate: "true",
            action: "ignore"
          }
        });
        return node;
      }

      steps.push({
        line: 8,
        code: `    update_height(root)`,
        explanation: `Update height of node ${node.value}`,
        variables: { 
          node: node.value,
          old_height: node.height
        }
      });

      updateHeight(node);

      steps.push({
        line: 9,
        code: `    # Height: ${node.height}, BF: ${node.balanceFactor}`,
        explanation: `Node ${node.value}: height=${node.height}, balance_factor=${node.balanceFactor}`,
        variables: { 
          node: node.value,
          new_height: node.height,
          balance_factor: node.balanceFactor || 0,
          needs_balancing: Math.abs(node.balanceFactor || 0) > 1 ? "Yes" : "No"
        }
      });

      return balance(node, steps);
    };

    const newTree = tree ? { ...tree } : null;
    const result = insertRecursive(newTree, newValue);
    
    steps.push({
      line: 10,
      code: `# Insertion complete`,
      explanation: `Successfully inserted ${newValue}. Tree remains balanced.`,
      variables: { 
        inserted: newValue,
        total_rotations: rotationCount,
        tree_height: result.height
      },
      treeState: result
    });

    setAnimationSteps(steps);
    setInputValue("");
    setIsAnimating(true);
  };

  // Delete with animation
  const animateDelete = () => {
    if (!inputValue || isNaN(Number(inputValue))) {
      alert("Please enter a valid number");
      return;
    }

    const deleteValue = Number(inputValue);
    resetAnimation();
    setSelectedOperation(`Delete ${deleteValue}`);

    const steps: AnimationStep[] = [
      {
        line: 1,
        code: `def delete(root, value):`,
        explanation: `Delete ${deleteValue} from AVL tree`,
        variables: { 
          value: deleteValue,
          operation: "Delete"
        }
      }
    ];

    const findMin = (node: AVLNode): AVLNode => {
      while (node.left) {
        node = node.left;
      }
      return node;
    };

    const deleteRecursive = (node: AVLNode | null, value: number): AVLNode | null => {
      if (!node) {
        steps.push({
          line: 2,
          code: `    if root is None:`,
          explanation: `Value ${value} not found in tree`,
          variables: { 
            found: "false",
            action: "return None"
          }
        });
        return null;
      }

      steps.push({
        line: 3,
        code: `    # At node ${node.value}`,
        explanation: `Compare ${value} with current node ${node.value}`,
        variables: { 
          current: node.value,
          target: value
        },
        highlightNode: node.value
      });

      if (value < node.value) {
        steps.push({
          line: 4,
          code: `    if value < root.value:`,
          explanation: `${value} < ${node.value}, search left subtree`,
          variables: { 
            direction: "left"
          }
        });
        node.left = deleteRecursive(node.left, value);
      } else if (value > node.value) {
        steps.push({
          line: 5,
          code: `    elif value > root.value:`,
          explanation: `${value} > ${node.value}, search right subtree`,
          variables: { 
            direction: "right"
          }
        });
        node.right = deleteRecursive(node.right, value);
      } else {
        // Node to be deleted found
        steps.push({
          line: 6,
          code: `    else: # Found node to delete`,
          explanation: `Found node ${value} to delete`,
          variables: { 
            found: "true",
            deleting: value
          }
        });

        if (!node.left) {
          steps.push({
            line: 7,
            code: `        if left is None:`,
            explanation: `No left child, replace with right child`,
            variables: { 
              replacement: node.right?.value || "None",
              case: "no left child"
            }
          });
          return node.right;
        }
        
        if (!node.right) {
          steps.push({
            line: 8,
            code: `        elif right is None:`,
            explanation: `No right child, replace with left child`,
            variables: { 
              replacement: node.left?.value || "None",
              case: "no right child"
            }
          });
          return node.left;
        }

        // Node has both children
        steps.push({
          line: 9,
          code: `        # Both children exist`,
          explanation: `Node has both children, find inorder successor`,
          variables: { 
            case: "two children",
            left_child: node.left.value,
            right_child: node.right.value
          }
        });

        const minRight = findMin(node.right);
        steps.push({
          line: 10,
          code: `        successor = findMin(right)`,
          explanation: `Inorder successor is ${minRight.value}`,
          variables: { 
            successor: minRight.value,
            action: "replace value"
          }
        });

        node.value = minRight.value;
        steps.push({
          line: 11,
          code: `        root.value = successor.value`,
          explanation: `Replace ${value} with successor ${minRight.value}`,
          variables: { 
            old_value: value,
            new_value: minRight.value
          }
        });

        node.right = deleteRecursive(node.right, minRight.value);
      }

      if (node) {
        updateHeight(node);
        steps.push({
          line: 12,
          code: `    update_height(root)`,
          explanation: `Update height and check balance of node ${node.value}`,
          variables: { 
            node: node.value,
            height: node.height,
            balance_factor: node.balanceFactor || 0
          }
        });

        return balance(node, steps);
      }

      return node;
    };

    const newTree = tree ? { ...tree } : null;
    const result = deleteRecursive(newTree, deleteValue);
    
    steps.push({
      line: 13,
      code: `# Deletion complete`,
      explanation: `Successfully deleted ${deleteValue}. Tree remains balanced.`,
      variables: { 
        deleted: deleteValue,
        total_rotations: rotationCount,
        tree_height: result?.height || 0
      },
      treeState: result
    });

    setAnimationSteps(steps);
    setInputValue("");
    setIsAnimating(true);
  };

  // Search with animation
  const animateSearch = () => {
    if (!inputValue || isNaN(Number(inputValue))) {
      alert("Please enter a valid number");
      return;
    }

    const searchValue = Number(inputValue);
    resetAnimation();
    setSelectedOperation(`Search ${searchValue}`);

    const steps: AnimationStep[] = [
      {
        line: 1,
        code: `def search(root, value):`,
        explanation: `Search for ${searchValue} in AVL tree`,
        variables: { 
          value: searchValue,
          operation: "Search"
        }
      }
    ];

    const searchRecursive = (node: AVLNode | null, value: number, depth: number = 0): boolean => {
      if (!node) {
        steps.push({
          line: 2,
          code: `    if root is None:`,
          explanation: `Reached end of path, value ${value} not found`,
          variables: { 
            found: "false",
            depth: depth,
            comparisons: depth
          }
        });
        return false;
      }

      steps.push({
        line: 3,
        code: `    # At node ${node.value}`,
        explanation: `Compare ${value} with current node ${node.value}`,
        variables: { 
          current: node.value,
          target: value,
          depth: depth
        },
        highlightNode: node.value
      });

      if (value === node.value) {
        steps.push({
          line: 4,
          code: `    if value == root.value:`,
          explanation: `Found! ${value} equals ${node.value}`,
          variables: { 
            found: "true",
            depth: depth,
            comparisons: depth + 1
          }
        });
        return true;
      } else if (value < node.value) {
        steps.push({
          line: 5,
          code: `    elif value < root.value:`,
          explanation: `${value} < ${node.value}, search left subtree`,
          variables: { 
            direction: "left",
            comparison: `${value} < ${node.value}`
          }
        });
        return searchRecursive(node.left, value, depth + 1);
      } else {
        steps.push({
          line: 6,
          code: `    else: # value > root.value`,
          explanation: `${value} > ${node.value}, search right subtree`,
          variables: { 
            direction: "right",
            comparison: `${value} > ${node.value}`
          }
        });
        return searchRecursive(node.right, value, depth + 1);
      }
    };

    const found = searchRecursive(tree, searchValue);
    
    steps.push({
      line: 7,
      code: `# Search complete`,
      explanation: `Search complete: ${searchValue} ${found ? 'found' : 'not found'}`,
      variables: { 
        result: found ? "found" : "not found",
        efficiency: `O(log n) due to balanced tree`
      }
    });

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

  // Calculate tree layout positions
  const calculateLayout = (node: AVLNode | null, x: number = 400, y: number = 60, level: number = 0): void => {
    if (!node) return;
    
    const spacing = Math.max(150 / (level + 1), 30);
    node.x = x;
    node.y = y;
    
    if (node.left) {
      calculateLayout(node.left, x - spacing, y + 80, level + 1);
    }
    if (node.right) {
      calculateLayout(node.right, x + spacing, y + 80, level + 1);
    }
  };

  if (tree) {
    calculateLayout(tree);
  }

  // Render Tree Nodes
  const renderNode = (node: AVLNode | null): React.JSX.Element | null => {
    if (!node) return null;

    return (
      <g key={node.id}>
        {/* Connections to children */}
        {node.left && (
          <line
            x1={node.x}
            y1={node.y! + 25}
            x2={node.left.x}
            y2={node.left.y! - 25}
            stroke={node.isRotating ? "#8b5cf6" : "#6b7280"}
            strokeWidth={node.isRotating ? "3" : "2"}
          />
        )}
        {node.right && (
          <line
            x1={node.x}
            y1={node.y! + 25}
            x2={node.right.x}
            y2={node.right.y! - 25}
            stroke={node.isRotating ? "#8b5cf6" : "#6b7280"}
            strokeWidth={node.isRotating ? "3" : "2"}
          />
        )}

        {/* Node circle */}
        <motion.circle
          cx={node.x}
          cy={node.y}
          r="25"
          fill={
            node.isHighlighted 
              ? "#8b5cf6" 
              : node.isNew
              ? "#10b981"
              : node.isRotating
              ? "#f59e0b"
              : "#3b82f6"
          }
          stroke={
            node.isHighlighted 
              ? "#7c3aed" 
              : node.isNew
              ? "#059669"
              : node.isRotating
              ? "#d97706"
              : "#2563eb"
          }
          strokeWidth="3"
          initial={{ scale: 0 }}
          animate={{ 
            scale: node.isHighlighted ? 1.2 : 1,
            rotate: node.isRotating ? 360 : 0
          }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 20,
            rotate: { duration: 1 }
          }}
        />

        {/* Node value */}
        <text
          x={node.x}
          y={node.y! + 5}
          textAnchor="middle"
          fill="white"
          fontSize="14"
          fontWeight="bold"
        >
          {node.value}
        </text>

        {/* Height and Balance Factor */}
        <text
          x={node.x}
          y={node.y! - 35}
          textAnchor="middle"
          fill="#4b5563"
          fontSize="10"
        >
          h:{node.height} bf:{node.balanceFactor}
        </text>

        {/* Recursively render children */}
        {renderNode(node.left)}
        {renderNode(node.right)}
      </g>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold text-center text-blue-800 mb-8">
          🌳 Interactive AVL Tree Visualizer
        </h1>

        {/* Operation Controls */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">🎮 Controls</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <input
              type="number"
              placeholder="Enter value"
              className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <select
              className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-indigo-500"
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button onClick={animateInsert} className="btn-primary">
              ➕ Insert
            </button>
            <button onClick={animateDelete} className="btn-danger">
              🗑️ Delete
            </button>
            <button onClick={animateSearch} className="btn-secondary">
              🔍 Search
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

        {/* AVL Tree Visualization */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            🌳 AVL Tree Visualization
          </h2>
          
          <div className="relative bg-gray-50 rounded-lg p-8" style={{ height: '500px' }}>
            {!tree ? (
              <div className="flex items-center justify-center h-full text-gray-500 text-lg">
                Empty AVL Tree - Insert nodes to build the tree
              </div>
            ) : (
              <svg width="100%" height="100%" viewBox="0 0 800 500">
                {renderNode(tree)}
              </svg>
            )}
          </div>

          {/* Tree Statistics */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">📊 Tree Stats</h3>
              <div className="text-sm text-blue-700 space-y-1">
                <div>• <strong>Height:</strong> {tree?.height || 0}</div>
                <div>• <strong>Root:</strong> {tree?.value || 'None'}</div>
                <div>• <strong>Balance Factor:</strong> {tree?.balanceFactor || 0}</div>
              </div>
            </div>

            <div className="p-4 bg-green-50 border-2 border-green-200 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">🔄 Rotations</h3>
              <div className="text-sm text-green-700 space-y-1">
                <div>• <strong>Total:</strong> {rotationCount}</div>
                <div>• <strong>Maintains:</strong> Balance</div>
                <div>• <strong>Ensures:</strong> O(log n)</div>
              </div>
            </div>

            <div className="p-4 bg-purple-50 border-2 border-purple-200 rounded-lg">
              <h3 className="font-semibold text-purple-800 mb-2">⚡ Performance</h3>
              <div className="text-sm text-purple-700 space-y-1">
                <div>• <strong>Search:</strong> O(log n)</div>
                <div>• <strong>Insert:</strong> O(log n)</div>
                <div>• <strong>Delete:</strong> O(log n)</div>
              </div>
            </div>

            <div className="p-4 bg-orange-50 border-2 border-orange-200 rounded-lg">
              <h3 className="font-semibold text-orange-800 mb-2">🎯 Balance Rule</h3>
              <div className="text-sm text-orange-700 space-y-1">
                <div>• <strong>|BF| ≤ 1:</strong> Balanced</div>
                <div>• <strong>BF {'>'}  1:</strong> Left heavy</div>
                <div>• <strong>BF {'<'} -1:</strong> Right heavy</div>
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
                  <span className="font-mono text-sm font-semibold text-blue-600">
                    {String(value)}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Rotation Types */}
            <div className="mt-6 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg">
              <h3 className="font-semibold text-yellow-800 mb-2">🔄 Rotation Types</h3>
              <div className="text-sm text-yellow-700 space-y-1">
                <div>• <strong>LL:</strong> Right rotation</div>
                <div>• <strong>RR:</strong> Left rotation</div>
                <div>• <strong>LR:</strong> Left-Right rotation</div>
                <div>• <strong>RL:</strong> Right-Left rotation</div>
              </div>
            </div>

            {/* AVL Properties */}
            <div className="mt-4 p-4 bg-green-50 border-2 border-green-200 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">✅ AVL Properties</h3>
              <div className="text-sm text-green-700 space-y-1">
                <div>• Self-balancing binary search tree</div>
                <div>• Height difference ≤ 1 for all nodes</div>
                <div>• Guarantees O(log n) operations</div>
                <div>• Automatic rebalancing after modifications</div>
              </div>
            </div>

            {/* Use Cases */}
            <div className="mt-4 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">🎯 Use Cases</h3>
              <div className="text-sm text-blue-700 space-y-1">
                <div>• Database indexing</div>
                <div>• Memory management systems</div>
                <div>• Priority queues</div>
                <div>• Consistent search performance</div>
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
                  <span>Rotating node</span>
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
          @apply px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium;
        }
        .btn-secondary {
          @apply px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-medium;
        }
        .btn-danger {
          @apply px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium;
        }
      `}</style>
    </div>
  );
};

export default AVLTreeAnimation;
