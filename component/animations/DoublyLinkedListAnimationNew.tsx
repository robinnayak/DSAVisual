"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface DoublyNode {
  id: number;
  value: number;
  position?: number;
  isNew?: boolean;
  isHighlighted?: boolean;
  isBeingRemoved?: boolean;
  isHead?: boolean;
  isTail?: boolean;
  isProcessing?: boolean;
}

interface AnimationStep {
  line: number;
  code: string;
  explanation: string;
  listState?: DoublyNode[];
  variables?: { [key: string]: string | number };
  highlightNode?: number;
  showPointers?: {
    forward?: boolean;
    backward?: boolean;
    both?: boolean;
  };
}

const DoublyLinkedListAnimation = () => {
  const [list, setList] = useState<DoublyNode[]>([
    { id: 1, value: 10, position: 0, isHead: true },
    { id: 2, value: 20, position: 1 },
    { id: 3, value: 30, position: 2, isTail: true },
  ]);
  
  const [inputValue, setInputValue] = useState("");
  const [positionInput, setPositionInput] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [animationSteps, setAnimationSteps] = useState<AnimationStep[]>([]);
  const [variables, setVariables] = useState<{ [key: string]: string | number }>({});
  const [operationSpeed, setOperationSpeed] = useState(1000);
  const [selectedOperation, setSelectedOperation] = useState<string>("");
  const [showPointers, setShowPointers] = useState(true);

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const resetAnimation = () => {
    setIsAnimating(false);
    setCurrentStep(0);
    setAnimationSteps([]);
    setVariables({});
    // Reset node states
    setList(prev => prev.map((node, idx) => ({
      ...node,
      isNew: false,
      isHighlighted: false,
      isBeingRemoved: false,
      isProcessing: false,
      isHead: idx === 0,
      isTail: idx === prev.length - 1
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
        isHighlighted: idx === step.highlightNode,
        isProcessing: idx === step.highlightNode
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

  // Insert at Beginning
  const animateInsertAtBeginning = () => {
    if (!inputValue || isNaN(Number(inputValue))) {
      alert("Please enter a valid number");
      return;
    }

    const newValue = Number(inputValue);
    resetAnimation();
    setSelectedOperation(`Insert ${newValue} at Beginning`);

    const steps: AnimationStep[] = [
      {
        line: 1,
        code: `def insert_at_beginning(self, data):`,
        explanation: `Insert ${newValue} at the beginning of doubly linked list`,
        variables: { 
          data: newValue, 
          list_size: list.length,
          operation: "Insert at Beginning"
        }
      },
      {
        line: 2,
        code: `    new_node = Node(${newValue})`,
        explanation: `Create new node with value ${newValue}, prev=None, next=None`,
        variables: { 
          new_node: newValue,
          prev_pointer: "None",
          next_pointer: "None"
        }
      }
    ];

    if (list.length === 0) {
      steps.push({
        line: 3,
        code: `    if self.head is None:`,
        explanation: `List is empty - new node becomes both head and tail`,
        variables: { 
          is_empty: "true",
          new_node: newValue
        }
      });

      steps.push({
        line: 4,
        code: `        self.head = self.tail = new_node`,
        explanation: `Set both head and tail pointers to new node`,
        variables: { 
          head: newValue,
          tail: newValue,
          list_size: 1
        },
        listState: [
          { 
            id: Date.now(), 
            value: newValue, 
            position: 0, 
            isNew: true, 
            isHead: true, 
            isTail: true 
          }
        ]
      });
    } else {
      steps.push({
        line: 5,
        code: `    else: # List not empty`,
        explanation: `List has elements - update head and connections`,
        variables: { 
          is_empty: "false",
          current_head: list[0].value,
          list_size: list.length
        }
      });

      steps.push({
        line: 6,
        code: `        new_node.next = self.head`,
        explanation: `Set new node's next pointer to current head: ${list[0].value}`,
        variables: { 
          new_node: newValue,
          new_node_next: list[0].value,
          connection: "forward link"
        }
      });

      steps.push({
        line: 7,
        code: `        self.head.prev = new_node`,
        explanation: `Set current head's prev pointer to new node (backward link)`,
        variables: { 
          current_head: list[0].value,
          head_prev: newValue,
          connection: "backward link"
        }
      });

      steps.push({
        line: 8,
        code: `        self.head = new_node`,
        explanation: `Update head pointer to new node`,
        variables: { 
          old_head: list[0].value,
          new_head: newValue,
          list_size: list.length + 1
        },
        listState: [
          { 
            id: Date.now(), 
            value: newValue, 
            position: 0, 
            isNew: true, 
            isHead: true 
          },
          ...list.map((node, idx) => ({ 
            ...node, 
            position: idx + 1, 
            isHead: false,
            isTail: idx === list.length - 1,
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

  // Insert at End
  const animateInsertAtEnd = () => {
    if (!inputValue || isNaN(Number(inputValue))) {
      alert("Please enter a valid number");
      return;
    }

    const newValue = Number(inputValue);
    resetAnimation();
    setSelectedOperation(`Insert ${newValue} at End`);

    const steps: AnimationStep[] = [
      {
        line: 1,
        code: `def insert_at_end(self, data):`,
        explanation: `Insert ${newValue} at the end of doubly linked list`,
        variables: { 
          data: newValue, 
          list_size: list.length
        }
      },
      {
        line: 2,
        code: `    new_node = Node(${newValue})`,
        explanation: `Create new node with value ${newValue}`,
        variables: { 
          new_node: newValue
        }
      }
    ];

    if (list.length === 0) {
      steps.push({
        line: 3,
        code: `    if self.head is None:`,
        explanation: `List is empty - new node becomes both head and tail`,
        variables: { 
          is_empty: "true"
        }
      });

      steps.push({
        line: 4,
        code: `        self.head = self.tail = new_node`,
        explanation: `Set both head and tail to new node`,
        variables: { 
          head: newValue,
          tail: newValue
        },
        listState: [
          { 
            id: Date.now(), 
            value: newValue, 
            position: 0, 
            isNew: true, 
            isHead: true, 
            isTail: true 
          }
        ]
      });
    } else {
      steps.push({
        line: 5,
        code: `    else: # List not empty`,
        explanation: `List has elements - append at end using tail pointer`,
        variables: { 
          current_tail: list[list.length - 1].value
        }
      });

      steps.push({
        line: 6,
        code: `        new_node.prev = self.tail`,
        explanation: `Set new node's prev pointer to current tail: ${list[list.length - 1].value}`,
        variables: { 
          new_node: newValue,
          new_node_prev: list[list.length - 1].value
        }
      });

      steps.push({
        line: 7,
        code: `        self.tail.next = new_node`,
        explanation: `Set current tail's next pointer to new node`,
        variables: { 
          current_tail: list[list.length - 1].value,
          tail_next: newValue
        }
      });

      steps.push({
        line: 8,
        code: `        self.tail = new_node`,
        explanation: `Update tail pointer to new node`,
        variables: { 
          old_tail: list[list.length - 1].value,
          new_tail: newValue,
          list_size: list.length + 1
        },
        listState: [
          ...list.map(node => ({ 
            ...node, 
            isTail: false,
            isNew: false, 
            isHighlighted: false 
          })),
          { 
            id: Date.now(), 
            value: newValue, 
            position: list.length, 
            isNew: true, 
            isTail: true 
          }
        ]
      });
    }

    setAnimationSteps(steps);
    setInputValue("");
    setIsAnimating(true);
  };

  // Insert at Position
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
    setSelectedOperation(`Insert ${newValue} at Position ${position}`);

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
    } else if (position === list.length) {
      steps.push({
        line: 3,
        code: `    elif pos == len(list):`,
        explanation: `Position is at end - insert at end`,
        variables: { 
          position: position,
          list_length: list.length
        }
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

      // Traverse to position
      for (let i = 0; i < position; i++) {
        steps.push({
          line: 6,
          code: `    for i in range(pos):`,
          explanation: `Traverse to position ${i} (target: ${position})`,
          variables: { 
            current: list[i].value,
            current_position: i,
            target_position: position
          },
          highlightNode: i
        });

        if (i < position - 1) {
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
      }

      steps.push({
        line: 8,
        code: `    new_node.next = current`,
        explanation: `Set new node's next to current node: ${list[position].value}`,
        variables: { 
          new_node: newValue,
          new_node_next: list[position].value
        }
      });

      steps.push({
        line: 9,
        code: `    new_node.prev = current.prev`,
        explanation: `Set new node's prev to current's prev: ${position > 0 ? list[position - 1].value : 'None'}`,
        variables: { 
          new_node: newValue,
          new_node_prev: position > 0 ? list[position - 1].value : 'None'
        }
      });

      if (position > 0) {
        steps.push({
          line: 10,
          code: `    current.prev.next = new_node`,
          explanation: `Update previous node's next pointer to new node`,
          variables: { 
            prev_node: list[position - 1].value,
            prev_next: newValue
          }
        });
      }

      steps.push({
        line: 11,
        code: `    current.prev = new_node`,
        explanation: `Update current node's prev pointer to new node`,
        variables: { 
          current: list[position].value,
          current_prev: newValue
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

  // Delete Operation
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
        code: `    current = self.head`,
        explanation: `Start search from head`,
        variables: { 
          current: list[0].value
        },
        highlightNode: 0
      }
    ];

    // Search for the node
    for (let i = 0; i <= deleteIndex; i++) {
      if (i === deleteIndex) {
        steps.push({
          line: 3,
          code: `    while current and current.data != data:`,
          explanation: `Found target node: ${list[i].value}`,
          variables: { 
            current: list[i].value,
            found: "true"
          },
          highlightNode: i
        });
      } else {
        steps.push({
          line: 3,
          code: `    while current and current.data != data:`,
          explanation: `Check ${list[i].value} - not target, continue search`,
          variables: { 
            current: list[i].value,
            target: deleteValue
          },
          highlightNode: i
        });

        steps.push({
          line: 4,
          code: `        current = current.next`,
          explanation: `Move to next node`,
          highlightNode: i + 1
        });
      }
    }

    if (list.length === 1) {
      steps.push({
        line: 5,
        code: `    if current == self.head == self.tail:`,
        explanation: `Only one node - clear head and tail`,
        variables: { 
          single_node: "true"
        }
      });

      steps.push({
        line: 6,
        code: `        self.head = self.tail = None`,
        explanation: `List becomes empty`,
        variables: { 
          head: "None",
          tail: "None",
          list_size: 0
        },
        listState: []
      });
    } else if (deleteIndex === 0) {
      // Deleting head
      steps.push({
        line: 7,
        code: `    elif current == self.head:`,
        explanation: `Deleting head node`,
        variables: { 
          deleting: "head"
        }
      });

      steps.push({
        line: 8,
        code: `        self.head = current.next`,
        explanation: `Update head to next node: ${list[1].value}`,
        variables: { 
          old_head: list[0].value,
          new_head: list[1].value
        }
      });

      steps.push({
        line: 9,
        code: `        self.head.prev = None`,
        explanation: `Set new head's prev to None`,
        variables: { 
          new_head: list[1].value,
          head_prev: "None"
        },
        listState: list.slice(1).map((node, idx) => ({ 
          ...node, 
          position: idx, 
          isHead: idx === 0,
          isTail: idx === list.length - 2,
          isHighlighted: false 
        }))
      });
    } else if (deleteIndex === list.length - 1) {
      // Deleting tail
      steps.push({
        line: 10,
        code: `    elif current == self.tail:`,
        explanation: `Deleting tail node`,
        variables: { 
          deleting: "tail"
        }
      });

      steps.push({
        line: 11,
        code: `        self.tail = current.prev`,
        explanation: `Update tail to previous node: ${list[list.length - 2].value}`,
        variables: { 
          old_tail: list[list.length - 1].value,
          new_tail: list[list.length - 2].value
        }
      });

      steps.push({
        line: 12,
        code: `        self.tail.next = None`,
        explanation: `Set new tail's next to None`,
        variables: { 
          new_tail: list[list.length - 2].value,
          tail_next: "None"
        },
        listState: list.slice(0, -1).map((node, idx) => ({ 
          ...node, 
          position: idx,
          isHead: idx === 0,
          isTail: idx === list.length - 2,
          isHighlighted: false 
        }))
      });
    } else {
      // Deleting middle node
      steps.push({
        line: 13,
        code: `    else: # Middle node`,
        explanation: `Deleting middle node - update connections`,
        variables: { 
          deleting: "middle",
          prev_node: list[deleteIndex - 1].value,
          next_node: list[deleteIndex + 1].value
        }
      });

      steps.push({
        line: 14,
        code: `        current.prev.next = current.next`,
        explanation: `Connect previous node to next node (skip current)`,
        variables: { 
          prev_node: list[deleteIndex - 1].value,
          next_node: list[deleteIndex + 1].value
        }
      });

      steps.push({
        line: 15,
        code: `        current.next.prev = current.prev`,
        explanation: `Connect next node to previous node (skip current)`,
        variables: { 
          bypassed_node: deleteValue
        },
        listState: list.filter((_, idx) => idx !== deleteIndex).map((node, idx) => ({ 
          ...node, 
          position: idx,
          isHead: idx === 0,
          isTail: idx === list.length - 2,
          isHighlighted: false 
        }))
      });
    }

    setAnimationSteps(steps);
    setInputValue("");
    setIsAnimating(true);
  };

  // Forward Traversal
  const animateForwardTraversal = () => {
    resetAnimation();
    setSelectedOperation("Forward Traversal");

    const steps: AnimationStep[] = [
      {
        line: 1,
        code: `def traverse_forward(self):`,
        explanation: `Traverse doubly linked list from head to tail`,
        variables: { 
          direction: "forward",
          list_size: list.length
        }
      },
      {
        line: 2,
        code: `    current = self.head`,
        explanation: `Start from head node`,
        variables: { 
          current: list.length > 0 ? list[0].value : "None"
        },
        highlightNode: list.length > 0 ? 0 : undefined
      }
    ];

    if (list.length > 0) {
      const visited: number[] = [];
      for (let i = 0; i < list.length; i++) {
        visited.push(list[i].value);
        steps.push({
          line: 3,
          code: `    while current:`,
          explanation: `Visit node: ${list[i].value}`,
          variables: { 
            current: list[i].value,
            visited: `[${visited.join(', ')}]`,
            position: i
          },
          highlightNode: i
        });

        steps.push({
          line: 4,
          code: `        print(current.data)`,
          explanation: `Process node value: ${list[i].value}`,
          variables: { 
            processed: list[i].value
          }
        });

        if (i < list.length - 1) {
          steps.push({
            line: 5,
            code: `        current = current.next`,
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
        code: `    # Reached end (current is None)`,
        explanation: `Forward traversal complete!`,
        variables: { 
          visited_all: `[${visited.join(', ')}]`,
          total_nodes: list.length
        }
      });
    }

    setAnimationSteps(steps);
    setIsAnimating(true);
  };

  // Backward Traversal
  const animateBackwardTraversal = () => {
    resetAnimation();
    setSelectedOperation("Backward Traversal");

    const steps: AnimationStep[] = [
      {
        line: 1,
        code: `def traverse_backward(self):`,
        explanation: `Traverse doubly linked list from tail to head`,
        variables: { 
          direction: "backward",
          list_size: list.length
        }
      },
      {
        line: 2,
        code: `    current = self.tail`,
        explanation: `Start from tail node`,
        variables: { 
          current: list.length > 0 ? list[list.length - 1].value : "None"
        },
        highlightNode: list.length > 0 ? list.length - 1 : undefined
      }
    ];

    if (list.length > 0) {
      const visited: number[] = [];
      for (let i = list.length - 1; i >= 0; i--) {
        visited.push(list[i].value);
        steps.push({
          line: 3,
          code: `    while current:`,
          explanation: `Visit node: ${list[i].value}`,
          variables: { 
            current: list[i].value,
            visited: `[${visited.join(', ')}]`,
            position: i
          },
          highlightNode: i
        });

        steps.push({
          line: 4,
          code: `        print(current.data)`,
          explanation: `Process node value: ${list[i].value}`,
          variables: { 
            processed: list[i].value
          }
        });

        if (i > 0) {
          steps.push({
            line: 5,
            code: `        current = current.prev`,
            explanation: `Move to previous node: ${list[i - 1].value}`,
            variables: { 
              current: list[i - 1].value
            },
            highlightNode: i - 1
          });
        }
      }

      steps.push({
        line: 6,
        code: `    # Reached beginning (current is None)`,
        explanation: `Backward traversal complete!`,
        variables: { 
          visited_all: `[${visited.join(', ')}]`,
          total_nodes: list.length
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold text-center text-purple-800 mb-8">
          ⇄ Interactive Doubly Linked List Visualizer
        </h1>

        {/* Operation Controls */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">🎮 Controls</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <input
              type="number"
              placeholder="Enter value"
              className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <input
              type="number"
              placeholder="Position (for insert)"
              className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-pink-500 focus:ring-2 focus:ring-pink-200"
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

          <div className="grid grid-cols-2 md:grid-cols-7 gap-3">
            <button onClick={animateInsertAtBeginning} className="btn-primary">
              ⬆️ Insert Begin
            </button>
            <button onClick={animateInsertAtEnd} className="btn-secondary">
              ⬇️ Insert End
            </button>
            <button onClick={animateInsertAtPosition} className="btn-warning">
              📍 Insert at Pos
            </button>
            <button onClick={animateDelete} className="btn-danger">
              🗑️ Delete
            </button>
            <button onClick={animateForwardTraversal} className="btn-info">
              ➡️ Forward
            </button>
            <button onClick={animateBackwardTraversal} className="btn-special">
              ⬅️ Backward
            </button>
            <button
              onClick={() => setShowPointers(!showPointers)}
              className="btn-toggle"
            >
              👁️ Pointers
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

        {/* Doubly Linked List Visualization */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            ⇄ Doubly Linked List Visualization
          </h2>
          
          <div className="relative bg-gray-50 rounded-lg p-8 overflow-x-auto">
            {list.length === 0 ? (
              <div className="flex items-center justify-center h-32 text-gray-500 text-lg">
                Empty Doubly Linked List
              </div>
            ) : (
              <div className="flex items-center gap-4 min-w-max">
                {/* Head Pointer */}
                <div className="flex flex-col items-center">
                  <div className="text-sm font-bold text-blue-600 mb-2">HEAD</div>
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">H</span>
                  </div>
                  <div className="mt-2 text-blue-600">↓</div>
                </div>

                {/* Nodes */}
                <div className="flex items-center gap-2">
                  <AnimatePresence>
                    {list.map((node, index) => (
                      <motion.div
                        key={`node-${node.id}`}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ 
                          opacity: 1, 
                          scale: node.isHighlighted ? 1.1 : 1
                        }}
                        exit={{ opacity: 0, scale: 0 }}
                        transition={{ 
                          type: "spring", 
                          stiffness: 300, 
                          damping: 20 
                        }}
                        className="flex items-center"
                      >
                        {/* Node Container */}
                        <div className={`
                          relative bg-white border-4 rounded-xl p-4 min-w-[120px]
                          ${node.isHighlighted 
                            ? 'border-purple-500 ring-4 ring-purple-300' 
                            : node.isNew
                            ? 'border-green-500'
                            : node.isBeingRemoved
                            ? 'border-red-500'
                            : 'border-gray-300'
                          }
                        `}>
                          {/* Prev Pointer */}
                          <div className="text-xs text-gray-500 mb-1">
                            Prev: {index > 0 ? list[index - 1].value : 'NULL'}
                          </div>
                          
                          {/* Data */}
                          <div className={`
                            text-xl font-bold text-center py-2
                            ${node.isHighlighted ? 'text-purple-600' : 'text-gray-800'}
                          `}>
                            {node.value}
                          </div>
                          
                          {/* Next Pointer */}
                          <div className="text-xs text-gray-500 mt-1">
                            Next: {index < list.length - 1 ? list[index + 1].value : 'NULL'}
                          </div>

                          {/* Head/Tail Indicators */}
                          {node.isHead && (
                            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded">
                              HEAD
                            </div>
                          )}
                          {node.isTail && (
                            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded">
                              TAIL
                            </div>
                          )}

                          {/* Position Indicator */}
                          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 text-xs text-gray-500">
                            [{index}]
                          </div>
                        </div>

                        {/* Arrows between nodes */}
                        {index < list.length - 1 && showPointers && (
                          <div className="flex flex-col items-center mx-2">
                            <div className="text-green-600 text-lg">→</div>
                            <div className="text-red-600 text-lg">←</div>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Tail Pointer */}
                <div className="flex flex-col items-center">
                  <div className="text-sm font-bold text-green-600 mb-2">TAIL</div>
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">T</span>
                  </div>
                  <div className="mt-2 text-green-600">↑</div>
                </div>
              </div>
            )}
          </div>

          {/* List Properties */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">📊 List Properties</h3>
              <div className="text-sm text-blue-700 space-y-1">
                <div>• <strong>Size:</strong> {list.length} nodes</div>
                <div>• <strong>Head:</strong> {list.length > 0 ? list[0].value : 'None'}</div>
                <div>• <strong>Tail:</strong> {list.length > 0 ? list[list.length - 1].value : 'None'}</div>
                <div>• <strong>Bidirectional:</strong> Yes</div>
              </div>
            </div>

            <div className="p-4 bg-purple-50 border-2 border-purple-200 rounded-lg">
              <h3 className="font-semibold text-purple-800 mb-2">🔗 Pointer Links</h3>
              <div className="text-sm text-purple-700 space-y-1">
                <div>• <strong>Forward Links:</strong> {list.length > 0 ? list.length - 1 : 0}</div>
                <div>• <strong>Backward Links:</strong> {list.length > 0 ? list.length - 1 : 0}</div>
                <div>• <strong>NULL Pointers:</strong> {list.length > 0 ? 2 : 0}</div>
                <div>• <strong>Total Pointers:</strong> {list.length * 2}</div>
              </div>
            </div>

            <div className="p-4 bg-green-50 border-2 border-green-200 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">⚡ Advantages</h3>
              <div className="text-sm text-green-700 space-y-1">
                <div>• Bidirectional traversal</div>
                <div>• Efficient insertion/deletion</div>
                <div>• Direct access to tail</div>
                <div>• No need to traverse for prev</div>
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
                  <span className="font-mono text-sm font-semibold text-purple-600">
                    {String(value)}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Time Complexity */}
            <div className="mt-6 p-4 bg-green-50 border-2 border-green-200 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">⚡ Time Complexity</h3>
              <div className="text-sm text-green-700 space-y-1">
                <div>• <strong>Insert at Head/Tail:</strong> O(1)</div>
                <div>• <strong>Insert at Position:</strong> O(n)</div>
                <div>• <strong>Delete at Head/Tail:</strong> O(1)</div>
                <div>• <strong>Delete by Value:</strong> O(n)</div>
                <div>• <strong>Traversal:</strong> O(n)</div>
              </div>
            </div>

            {/* Use Cases */}
            <div className="mt-4 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">🎯 Use Cases</h3>
              <div className="text-sm text-blue-700 space-y-1">
                <div>• Browser history (back/forward)</div>
                <div>• Music player playlists</div>
                <div>• Undo/Redo operations</div>
                <div>• Navigation systems</div>
                <div>• Cache implementations (LRU)</div>
              </div>
            </div>

            {/* Legend */}
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">🎨 Color Legend</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-4 border-purple-500 rounded"></div>
                  <span>Currently highlighted/processing</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-4 border-green-500 rounded"></div>
                  <span>Newly inserted node</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-4 border-gray-300 rounded"></div>
                  <span>Regular node</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-600">→←</span>
                  <span>Bidirectional pointers</span>
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
          @apply px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors font-medium;
        }
        .btn-warning {
          @apply px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors font-medium;
        }
        .btn-danger {
          @apply px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium;
        }
        .btn-info {
          @apply px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium;
        }
        .btn-special {
          @apply px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors font-medium;
        }
        .btn-toggle {
          @apply px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium;
        }
      `}</style>
    </div>
  );
};

export default DoublyLinkedListAnimation;
