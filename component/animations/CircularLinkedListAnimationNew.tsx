"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CircularNode {
  id: number;
  value: number;
  isNew?: boolean;
  isHighlighted?: boolean;
  isBeingRemoved?: boolean;
  isHead?: boolean;
  position: number;
}

interface AnimationStep {
  line: number;
  code: string;
  explanation: string;
  listState?: CircularNode[];
  variables?: { [key: string]: string | number };
  highlightNode?: number;
  showPointer?: boolean;
}

const CircularLinkedListAnimation = () => {
  const [list, setList] = useState<CircularNode[]>([
    { id: 1, value: 10, position: 0, isHead: true },
    { id: 2, value: 20, position: 1 },
    { id: 3, value: 30, position: 2 },
    { id: 4, value: 40, position: 3 },
  ]);
  
  const [inputValue, setInputValue] = useState("");
  const [positionInput, setPositionInput] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [animationSteps, setAnimationSteps] = useState<AnimationStep[]>([]);
  const [variables, setVariables] = useState<{ [key: string]: string | number }>({});
  const [operationSpeed, setOperationSpeed] = useState(1000);
  const [selectedOperation, setSelectedOperation] = useState<string>("");
  const [currentTraversal, setCurrentTraversal] = useState(-1);

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const resetAnimation = () => {
    setIsAnimating(false);
    setCurrentStep(0);
    setAnimationSteps([]);
    setVariables({});
    setCurrentTraversal(-1);
    // Reset node states
    setList(prev => prev.map(node => ({
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
    if (step.listState) {
      setList(step.listState);
    }
    if (step.highlightNode !== undefined) {
      setList(prev => prev.map((node, idx) => ({
        ...node,
        isHighlighted: idx === step.highlightNode
      })));
      setCurrentTraversal(step.highlightNode || -1);
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
        explanation: `Insert ${newValue} at the beginning of circular linked list`,
        variables: { 
          data: newValue, 
          list_size: list.length,
          operation: "Insert at Beginning"
        }
      },
      {
        line: 2,
        code: `    new_node = Node(${newValue})`,
        explanation: `Create new node with value ${newValue}`,
        variables: { 
          data: newValue, 
          new_node: newValue,
          list_size: list.length
        }
      }
    ];

    if (list.length === 0) {
      steps.push({
        line: 3,
        code: `    if self.head is None:`,
        explanation: `List is empty - new node becomes head and points to itself`,
        variables: { 
          is_empty: "true",
          new_node: newValue
        }
      });

      steps.push({
        line: 4,
        code: `        new_node.next = new_node`,
        explanation: `Set new node's next pointer to itself (circular)`,
        variables: { 
          new_node: newValue,
          next_pointer: "self"
        }
      });

      steps.push({
        line: 5,
        code: `        self.head = new_node`,
        explanation: `Set head pointer to new node`,
        variables: { 
          head: newValue,
          list_size: 1
        },
        listState: [
          { id: Date.now(), value: newValue, position: 0, isNew: true, isHead: true }
        ]
      });
    } else {
      steps.push({
        line: 6,
        code: `    else: # List not empty`,
        explanation: `List has elements - need to update last node's pointer`,
        variables: { 
          is_empty: "false",
          current_head: list[0].value,
          list_size: list.length
        }
      });

      steps.push({
        line: 7,
        code: `        temp = self.head`,
        explanation: `Start from head to find the last node`,
        variables: { 
          temp: list[0].value,
          searching_for: "last node"
        },
        highlightNode: 0
      });

      // Traverse to find last node
      for (let i = 0; i < list.length; i++) {
        const isLast = i === list.length - 1;
        steps.push({
          line: 8,
          code: `        while temp.next != self.head:`,
          explanation: isLast 
            ? `Found last node: ${list[i].value} (points back to head)`
            : `Checking ${list[i].value} - not last node, continue traversing`,
          variables: { 
            temp: list[i].value,
            temp_next: i === list.length - 1 ? list[0].value : list[i + 1].value,
            is_last: isLast ? "true" : "false"
          },
          highlightNode: i
        });

        if (!isLast) {
          steps.push({
            line: 9,
            code: `            temp = temp.next`,
            explanation: `Move to next node: ${list[i + 1].value}`,
            variables: { 
              temp: list[i + 1].value
            },
            highlightNode: i + 1
          });
        }
      }

      steps.push({
        line: 10,
        code: `        new_node.next = self.head`,
        explanation: `Set new node's next to current head: ${list[0].value}`,
        variables: { 
          new_node: newValue,
          new_node_next: list[0].value
        }
      });

      steps.push({
        line: 11,
        code: `        temp.next = new_node`,
        explanation: `Set last node's next to new node`,
        variables: { 
          last_node: list[list.length - 1].value,
          last_node_next: newValue
        }
      });

      steps.push({
        line: 12,
        code: `        self.head = new_node`,
        explanation: `Update head pointer to new node`,
        variables: { 
          old_head: list[0].value,
          new_head: newValue,
          list_size: list.length + 1
        },
        listState: [
          { id: Date.now(), value: newValue, position: 0, isNew: true, isHead: true },
          ...list.map((node, idx) => ({ 
            ...node, 
            position: idx + 1, 
            isHead: false, 
            isNew: false, 
            isHighlighted: false 
          }))
        ]
      });
    }

    setAnimationSteps(steps);
    setInputValue("");
    setIsAnimating(true);
  };

  // Animate Insert at Position
  const animateInsertAtPosition = () => {
    if (!inputValue || !positionInput || isNaN(Number(inputValue)) || isNaN(Number(positionInput))) {
      alert("Please enter valid numbers for both value and position");
      return;
    }

    const newValue = Number(inputValue);
    const position = Number(positionInput);

    if (position < 0 || position > list.length) {
      alert(`Position must be between 0 and ${list.length}`);
      return;
    }

    resetAnimation();
    setSelectedOperation(`Insert at Position ${position}`);

    const steps: AnimationStep[] = [
      {
        line: 1,
        code: `def insert_at_position(self, data, pos):`,
        explanation: `Insert ${newValue} at position ${position}`,
        variables: { 
          data: newValue, 
          position: position,
          list_size: list.length
        }
      }
    ];

    if (position === 0) {
      steps.push({
        line: 2,
        code: `    if pos == 0:`,
        explanation: `Position is 0 - insert at beginning`,
        variables: { position: 0 }
      });

      steps.push({
        line: 3,
        code: `        return self.insert_at_beginning(data)`,
        explanation: `Call insert_at_beginning method`,
        variables: { redirect: "insert_at_beginning" }
      });
    } else {
      steps.push({
        line: 4,
        code: `    new_node = Node(${newValue})`,
        explanation: `Create new node with value ${newValue}`,
        variables: { 
          new_node: newValue,
          target_position: position
        }
      });

      steps.push({
        line: 5,
        code: `    current = self.head`,
        explanation: `Start traversal from head`,
        variables: { 
          current: list[0].value,
          current_position: 0
        },
        highlightNode: 0
      });

      // Traverse to position - 1
      for (let i = 0; i < position - 1; i++) {
        steps.push({
          line: 6,
          code: `    for i in range(pos - 1):`,
          explanation: `Traverse to position ${i + 1} (need to reach position ${position - 1})`,
          variables: { 
            current: list[i].value,
            current_position: i,
            target_position: position - 1
          },
          highlightNode: i
        });

        steps.push({
          line: 7,
          code: `        current = current.next`,
          explanation: `Move to next node: ${list[i + 1].value}`,
          variables: { 
            current: list[i + 1].value,
            current_position: i + 1
          },
          highlightNode: i + 1
        });
      }

      steps.push({
        line: 8,
        code: `    new_node.next = current.next`,
        explanation: `Set new node's next to current's next: ${list[position] ? list[position].value : list[0].value}`,
        variables: { 
          new_node: newValue,
          current: list[position - 1].value,
          new_node_next: list[position] ? list[position].value : list[0].value
        }
      });

      steps.push({
        line: 9,
        code: `    current.next = new_node`,
        explanation: `Set current node's next to new node`,
        variables: { 
          current: list[position - 1].value,
          current_next: newValue
        },
        listState: [
          ...list.slice(0, position).map(node => ({ ...node, isHighlighted: false })),
          { 
            id: Date.now(), 
            value: newValue, 
            position: position, 
            isNew: true 
          },
          ...list.slice(position).map((node, idx) => ({ 
            ...node, 
            position: position + idx + 1, 
            isHighlighted: false 
          }))
        ]
      });
    }

    setAnimationSteps(steps);
    setInputValue("");
    setPositionInput("");
    setIsAnimating(true);
  };

  // Animate Delete Operation
  const animateDelete = () => {
    if (!inputValue || isNaN(Number(inputValue))) {
      alert("Please enter a valid number to delete");
      return;
    }

    const deleteValue = Number(inputValue);
    const deleteIndex = list.findIndex(node => node.value === deleteValue);

    if (deleteIndex === -1) {
      alert(`Value ${deleteValue} not found in the list`);
      return;
    }

    resetAnimation();
    setSelectedOperation(`Delete Value ${deleteValue}`);

    const steps: AnimationStep[] = [
      {
        line: 1,
        code: `def delete(self, data):`,
        explanation: `Delete node with value ${deleteValue}`,
        variables: { 
          data: deleteValue,
          list_size: list.length
        }
      },
      {
        line: 2,
        code: `    if self.head is None:`,
        explanation: `Check if list is empty`,
        variables: { 
          is_empty: "false",
          list_size: list.length
        }
      }
    ];

    if (list.length === 1) {
      steps.push({
        line: 3,
        code: `    if self.head.next == self.head:`,
        explanation: `Only one node in list - delete it and set head to None`,
        variables: { 
          single_node: "true",
          node_value: list[0].value
        },
        highlightNode: 0
      });

      steps.push({
        line: 4,
        code: `        self.head = None`,
        explanation: `List becomes empty`,
        variables: { 
          head: "None",
          list_size: 0
        },
        listState: []
      });
    } else if (deleteIndex === 0) {
      // Deleting head node
      steps.push({
        line: 5,
        code: `    if self.head.data == data:`,
        explanation: `Found target at head position`,
        variables: { 
          head_value: list[0].value,
          target: deleteValue,
          is_head: "true"
        },
        highlightNode: 0
      });

      steps.push({
        line: 6,
        code: `        temp = self.head`,
        explanation: `Find last node to update its pointer`,
        variables: { 
          temp: list[0].value
        }
      });

      // Find last node
      for (let i = 0; i < list.length; i++) {
        const isLast = i === list.length - 1;
        steps.push({
          line: 7,
          code: `        while temp.next != self.head:`,
          explanation: isLast 
            ? `Found last node: ${list[i].value}`
            : `Checking ${list[i].value} - continue to find last`,
          variables: { 
            temp: list[i].value,
            is_last: isLast ? "true" : "false"
          },
          highlightNode: i
        });

        if (!isLast) {
          steps.push({
            line: 8,
            code: `            temp = temp.next`,
            explanation: `Move to next node`,
            highlightNode: i + 1
          });
        }
      }

      steps.push({
        line: 9,
        code: `        temp.next = self.head.next`,
        explanation: `Update last node to point to new head`,
        variables: { 
          last_node: list[list.length - 1].value,
          new_head: list[1].value
        }
      });

      steps.push({
        line: 10,
        code: `        self.head = self.head.next`,
        explanation: `Update head pointer`,
        variables: { 
          old_head: list[0].value,
          new_head: list[1].value,
          list_size: list.length - 1
        },
        listState: list.slice(1).map((node, idx) => ({ 
          ...node, 
          position: idx, 
          isHead: idx === 0,
          isHighlighted: false 
        }))
      });
    } else {
      // Deleting middle/end node
      steps.push({
        line: 11,
        code: `    current = self.head`,
        explanation: `Start from head to find the node before target`,
        variables: { 
          current: list[0].value,
          target: deleteValue,
          target_position: deleteIndex
        },
        highlightNode: 0
      });

      // Traverse to node before delete position
      for (let i = 0; i < deleteIndex - 1; i++) {
        steps.push({
          line: 12,
          code: `    while current.next.data != data:`,
          explanation: `Traverse to find node before ${deleteValue}`,
          variables: { 
            current: list[i].value,
            current_next: list[i + 1].value,
            target: deleteValue
          },
          highlightNode: i
        });

        steps.push({
          line: 13,
          code: `        current = current.next`,
          explanation: `Move to next node`,
          highlightNode: i + 1
        });
      }

      steps.push({
        line: 14,
        code: `    current.next = current.next.next`,
        explanation: `Skip the target node (${deleteValue})`,
        variables: { 
          current: list[deleteIndex - 1].value,
          skip_node: deleteValue,
          new_next: deleteIndex + 1 < list.length ? list[deleteIndex + 1].value : list[0].value
        },
        listState: list.filter((_, idx) => idx !== deleteIndex).map((node, idx) => ({ 
          ...node, 
          position: idx,
          isHighlighted: false 
        }))
      });
    }

    setAnimationSteps(steps);
    setInputValue("");
    setIsAnimating(true);
  };

  // Animate Circular Traversal
  const animateTraversal = () => {
    resetAnimation();
    setSelectedOperation("Circular Traversal");

    const steps: AnimationStep[] = [
      {
        line: 1,
        code: `def traverse(self):`,
        explanation: `Traverse the circular linked list`,
        variables: { 
          list_size: list.length,
          operation: "Circular Traversal"
        }
      },
      {
        line: 2,
        code: `    if self.head is None: return`,
        explanation: `Check if list is empty`,
        variables: { 
          is_empty: list.length === 0 ? "true" : "false"
        }
      }
    ];

    if (list.length > 0) {
      steps.push({
        line: 3,
        code: `    current = self.head`,
        explanation: `Start traversal from head node`,
        variables: { 
          current: list[0].value,
          visited: "[]"
        },
        highlightNode: 0
      });

      // First complete cycle
      const visited: number[] = [];
      for (let i = 0; i < list.length; i++) {
        visited.push(list[i].value);
        steps.push({
          line: 4,
          code: `    print(current.data)  # ${list[i].value}`,
          explanation: `Visit node ${list[i].value}`,
          variables: { 
            current: list[i].value,
            visited: `[${visited.join(', ')}]`,
            position: i
          },
          highlightNode: i
        });

        if (i < list.length - 1) {
          steps.push({
            line: 5,
            code: `    current = current.next`,
            explanation: `Move to next node: ${list[i + 1].value}`,
            variables: { 
              current: list[i + 1].value
            },
            highlightNode: i + 1
          });
        }
      }

      steps.push({
        line: 6,
        code: `    current = current.next  # Back to head`,
        explanation: `Next pointer leads back to head (circular nature)`,
        variables: { 
          current: list[0].value,
          back_to_head: "true",
          cycle_complete: "true"
        },
        highlightNode: 0
      });

      steps.push({
        line: 7,
        code: `    # Stop here to avoid infinite loop`,
        explanation: `Traversal complete! Circular structure verified.`,
        variables: { 
          traversed_nodes: `[${visited.join(', ')}]`,
          total_nodes: list.length,
          circular_confirmed: "true"
        }
      });
    }

    setAnimationSteps(steps);
    setIsAnimating(true);
  };

  const manualStepControl = () => {
    if (currentStep < animationSteps.length) {
      executeStep(animationSteps[currentStep]);
      setCurrentStep(prev => prev + 1);
    }
  };

  // Calculate circular positions for visualization
  const getNodePosition = (index: number, total: number) => {
    const centerX = 300;
    const centerY = 200;
    const radius = 120;
    const angle = (2 * Math.PI * index) / total - Math.PI / 2; // Start from top
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle)
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold text-center text-indigo-800 mb-8">
          🔄 Interactive Circular Linked List Visualizer
        </h1>

        {/* Operation Controls */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">🎮 Controls</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <input
              type="number"
              placeholder="Enter value"
              className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <input
              type="number"
              placeholder="Position (for insert)"
              className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
              value={positionInput}
              onChange={(e) => setPositionInput(e.target.value)}
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
              ⬆️ Insert Begin
            </button>
            <button onClick={animateInsertAtPosition} className="btn-secondary">
              📍 Insert at Pos
            </button>
            <button onClick={animateDelete} className="btn-danger">
              🗑️ Delete
            </button>
            <button onClick={animateTraversal} className="btn-special">
              🔄 Traverse
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

        {/* Circular List Visualization */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            🔄 Circular Linked List Visualization
          </h2>
          
          <div className="relative bg-gray-50 rounded-lg p-8" style={{ height: '450px' }}>
            {list.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-500 text-lg">
                Empty Circular List
              </div>
            ) : (
              <div className="relative w-full h-full">
                {/* Render circular connections first */}
                <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
                  {list.map((node, index) => {
                    const currentPos = getNodePosition(index, list.length);
                    const nextIndex = (index + 1) % list.length;
                    const nextPos = getNodePosition(nextIndex, list.length);
                    
                    return (
                      <g key={`edge-${index}`}>
                        {/* Curved arrow for circular connection */}
                        <defs>
                          <marker
                            id={`arrowhead-${index}`}
                            markerWidth="10"
                            markerHeight="7"
                            refX="9"
                            refY="3.5"
                            orient="auto"
                          >
                            <polygon
                              points="0 0, 10 3.5, 0 7"
                              fill={node.isHighlighted ? "#8b5cf6" : "#6b7280"}
                            />
                          </marker>
                        </defs>
                        
                        <path
                          d={`M ${currentPos.x + 20} ${currentPos.y} Q ${(currentPos.x + nextPos.x) / 2} ${(currentPos.y + nextPos.y) / 2 - 30} ${nextPos.x - 20} ${nextPos.y}`}
                          stroke={node.isHighlighted ? "#8b5cf6" : "#6b7280"}
                          strokeWidth={node.isHighlighted ? "3" : "2"}
                          fill="none"
                          markerEnd={`url(#arrowhead-${index})`}
                        />
                      </g>
                    );
                  })}
                </svg>

                {/* Render nodes */}
                <AnimatePresence>
                  {list.map((node, index) => {
                    const position = getNodePosition(index, list.length);
                    return (
                      <motion.div
                        key={`node-${node.id}`}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ 
                          opacity: 1, 
                          scale: node.isHighlighted ? 1.2 : 1,
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
                            ? 'bg-purple-500 border-purple-600 ring-4 ring-purple-300' 
                            : node.isNew
                            ? 'bg-green-500 border-green-600'
                            : node.isBeingRemoved
                            ? 'bg-red-500 border-red-600'
                            : node.isHead
                            ? 'bg-indigo-600 border-indigo-700'
                            : 'bg-blue-500 border-blue-600'
                          }
                        `}
                        style={{ zIndex: 2 }}
                      >
                        {node.value}
                        
                        {/* Head indicator */}
                        {node.isHead && (
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs font-bold text-indigo-600">
                            HEAD
                          </div>
                        )}
                        
                        {/* Position indicator */}
                        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-500">
                          {index}
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>

                {/* Center circle indicating circular nature */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center border-2 border-gray-400">
                  <span className="text-xs font-bold text-gray-600">🔄</span>
                </div>
              </div>
            )}
          </div>

          {/* Circular Properties */}
          <div className="mt-6 p-4 bg-indigo-50 border-2 border-indigo-200 rounded-lg">
            <h3 className="font-semibold text-indigo-800 mb-2">🔄 Circular Properties</h3>
            <div className="text-sm text-indigo-700 space-y-1">
              <div>• <strong>Size:</strong> {list.length} nodes</div>
              <div>• <strong>Head:</strong> {list.length > 0 ? list[0].value : 'None'}</div>
              <div>• <strong>Last Node Points To:</strong> {list.length > 0 ? 'Head (circular)' : 'None'}</div>
              <div>• <strong>Traversal:</strong> Can cycle infinitely</div>
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
                  <span className="font-mono text-sm font-semibold text-indigo-600">
                    {String(value)}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Circular List Advantages */}
            <div className="mt-6 p-4 bg-green-50 border-2 border-green-200 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">✅ Advantages</h3>
              <div className="text-sm text-green-700 space-y-1">
                <div>• No NULL pointers - every node points somewhere</div>
                <div>• Can traverse entire list from any node</div>
                <div>• Useful for round-robin scheduling</div>
                <div>• Memory efficient for cyclic data</div>
              </div>
            </div>

            {/* Use Cases */}
            <div className="mt-4 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">🎯 Use Cases</h3>
              <div className="text-sm text-blue-700 space-y-1">
                <div>• Music playlist (repeat mode)</div>
                <div>• CPU process scheduling</div>
                <div>• Game turn management</div>
                <div>• Buffer management in operating systems</div>
              </div>
            </div>

            {/* Legend */}
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">🎨 Color Legend</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                  <span>Currently highlighted/processing</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <span>Newly inserted node</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-indigo-600 rounded-full"></div>
                  <span>Head node</span>
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
          @apply px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors font-medium;
        }
        .btn-secondary {
          @apply px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-medium;
        }
        .btn-danger {
          @apply px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium;
        }
        .btn-special {
          @apply px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors font-medium;
        }
      `}</style>
    </div>
  );
};

export default CircularLinkedListAnimation;
