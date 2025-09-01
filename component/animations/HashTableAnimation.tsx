"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";

interface HashBucket {
  key: string | null;
  value: string | null;
  id: number;
  isNew?: boolean;
  isHighlighted?: boolean;
  isCollision?: boolean;
  isBeingRemoved?: boolean;
}

interface AnimationStep {
  line: number;
  code: string;
  explanation: string;
  tableState?: HashBucket[];
  variables?: { [key: string]: string | number };
  highlightBucket?: number;
  showHash?: number;
}

const HashTableAnimation = () => {
  const tableSize = 7;
  
  const initialTable: HashBucket[] = Array.from({ length: tableSize }, (_, i) => ({
    id: i,
    key: null,
    value: null
  }));

  // Initialize with some sample data
  initialTable[1] = { id: 1, key: "apple", value: "🍎" };
  initialTable[3] = { id: 3, key: "banana", value: "🍌" };
  initialTable[5] = { id: 5, key: "cherry", value: "🍒" };

  const [table, setTable] = useState<HashBucket[]>(initialTable);
  const [keyInput, setKeyInput] = useState("");
  const [valueInput, setValueInput] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [animationSteps, setAnimationSteps] = useState<AnimationStep[]>([]);
  const [variables, setVariables] = useState<{ [key: string]: string | number }>({});
  const [operationSpeed, setOperationSpeed] = useState(1000);
  const [selectedOperation, setSelectedOperation] = useState<string>("");
  const [collisionCount, setCollisionCount] = useState(0);

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // Simple hash function (sum of ASCII values mod table size)
  const hashFunction = (key: string): number => {
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      hash += key.charCodeAt(i);
    }
    return hash % tableSize;
  };

  // Better hash function (djb2 algorithm)
  const djb2Hash = (key: string): number => {
    let hash = 5381;
    for (let i = 0; i < key.length; i++) {
      hash = ((hash << 5) + hash) + key.charCodeAt(i);
    }
    return Math.abs(hash) % tableSize;
  };

  const resetAnimation = () => {
    setIsAnimating(false);
    setCurrentStep(0);
    setAnimationSteps([]);
    setVariables({});
    setCollisionCount(0);
    // Reset bucket states
    setTable(prev => prev.map(bucket => ({
      ...bucket,
      isNew: false,
      isHighlighted: false,
      isCollision: false,
      isBeingRemoved: false
    })));
  };

  const executeStep = useCallback(async (step: AnimationStep) => {
    if (step.variables) {
      setVariables(step.variables);
    }
    if (step.tableState) {
      setTable(step.tableState);
    }
    if (step.highlightBucket !== undefined) {
      setTable(prev => prev.map((bucket, idx) => ({
        ...bucket,
        isHighlighted: idx === step.highlightBucket
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

  // Animate Insert Operation with Linear Probing
  const animateInsert = () => {
    if (!keyInput || !valueInput) {
      alert("Please enter both key and value");
      return;
    }

    resetAnimation();
    setSelectedOperation("Insert with Linear Probing");

    const key = keyInput.toLowerCase();
    const value = valueInput;
    const hashValue = hashFunction(key);
    let probeCount = 0;
    let collisions = 0;

    const steps: AnimationStep[] = [
      {
        line: 1,
        code: `def insert(self, key, value):`,
        explanation: `Insert key "${key}" with value "${value}" into hash table`,
        variables: { key: key, value: value, table_size: tableSize }
      },
      {
        line: 2,
        code: `    hash_value = hash_function("${key}")`,
        explanation: `Calculate hash: sum of ASCII values mod ${tableSize}`,
        variables: { 
          key: key, 
          ascii_sum: key.split('').map(c => c.charCodeAt(0)).reduce((a, b) => a + b, 0),
          hash_value: hashValue,
          table_size: tableSize 
        },
        highlightBucket: hashValue,
        showHash: hashValue
      }
    ];

    // Show ASCII calculation step by step
    let asciiSum = 0;
    for (let i = 0; i < key.length; i++) {
      const char = key[i];
      const ascii = char.charCodeAt(0);
      asciiSum += ascii;
      
      steps.push({
        line: 3,
        code: `    # "${char}" = ${ascii}, sum = ${asciiSum}`,
        explanation: `Character "${char}" has ASCII value ${ascii}, running sum: ${asciiSum}`,
        variables: { 
          key: key, 
          current_char: char,
          ascii_value: ascii,
          running_sum: asciiSum,
          hash_value: hashValue 
        }
      });
    }

    steps.push({
      line: 4,
      code: `    # ${asciiSum} % ${tableSize} = ${hashValue}`,
      explanation: `Final hash value: ${asciiSum} mod ${tableSize} = ${hashValue}`,
      variables: { 
        ascii_sum: asciiSum,
        table_size: tableSize,
        hash_value: hashValue 
      },
      highlightBucket: hashValue
    });

    // Linear probing for collision resolution
    let currentIndex = hashValue;
    while (table[currentIndex].key !== null) {
      collisions++;
      probeCount++;
      
      steps.push({
        line: 5,
        code: `    # Collision at index ${currentIndex}! Linear probing...`,
        explanation: `Index ${currentIndex} is occupied by "${table[currentIndex].key}". Try next slot.`,
        variables: { 
          collision_index: currentIndex,
          occupied_by: table[currentIndex].key || "",
          probe_count: probeCount,
          collisions: collisions
        },
        highlightBucket: currentIndex
      });

      currentIndex = (currentIndex + 1) % tableSize;
      
      steps.push({
        line: 6,
        code: `    # Try index ${currentIndex}`,
        explanation: `Linear probe to next index: (${currentIndex - 1} + 1) % ${tableSize} = ${currentIndex}`,
        variables: { 
          new_index: currentIndex,
          probe_count: probeCount,
          collisions: collisions
        },
        highlightBucket: currentIndex
      });

      if (probeCount >= tableSize) {
        steps.push({
          line: 7,
          code: `    # Table is full!`,
          explanation: `Hash table is full! Cannot insert "${key}".`,
          variables: { error: "Table Full", probe_count: probeCount }
        });
        break;
      }
    }

    if (probeCount < tableSize) {
      const newTable = [...table];
      newTable[currentIndex] = {
        ...newTable[currentIndex],
        key: key,
        value: value,
        isNew: true,
        isCollision: collisions > 0
      };

      steps.push({
        line: 8,
        code: `    table[${currentIndex}] = ("${key}", "${value}")`,
        explanation: `Successfully inserted at index ${currentIndex}${collisions > 0 ? ` after ${collisions} collision(s)` : ''}`,
        variables: { 
          final_index: currentIndex,
          collisions: collisions,
          load_factor: ((table.filter(b => b.key !== null).length + 1) / tableSize * 100).toFixed(1) + '%'
        },
        tableState: newTable
      });
    }

    setAnimationSteps(steps);
    setKeyInput("");
    setValueInput("");
    setCollisionCount(collisions);
    setIsAnimating(true);
  };

  // Animate Search Operation
  const animateSearch = () => {
    if (!keyInput) {
      alert("Please enter a key to search");
      return;
    }

    resetAnimation();
    setSelectedOperation("Search with Linear Probing");

    const key = keyInput.toLowerCase();
    const hashValue = hashFunction(key);
    let probeCount = 0;

    const steps: AnimationStep[] = [
      {
        line: 1,
        code: `def search(self, key):`,
        explanation: `Search for key "${key}" in hash table`,
        variables: { search_key: key, table_size: tableSize }
      },
      {
        line: 2,
        code: `    hash_value = hash_function("${key}")`,
        explanation: `Calculate hash value for "${key}"`,
        variables: { 
          search_key: key, 
          hash_value: hashValue 
        },
        highlightBucket: hashValue
      }
    ];

    let currentIndex = hashValue;
    let found = false;

    while (probeCount < tableSize) {
      steps.push({
        line: 3,
        code: `    # Check index ${currentIndex}`,
        explanation: `Checking index ${currentIndex}...`,
        variables: { 
          current_index: currentIndex,
          probe_count: probeCount
        },
        highlightBucket: currentIndex
      });

      if (table[currentIndex].key === null) {
        steps.push({
          line: 4,
          code: `    # Empty slot found - key not in table`,
          explanation: `Empty slot at index ${currentIndex}. Key "${key}" not found.`,
          variables: { 
            result: "Not Found",
            probe_count: probeCount + 1
          }
        });
        break;
      } else if (table[currentIndex].key === key) {
        found = true;
        steps.push({
          line: 5,
          code: `    # Found! Return value: "${table[currentIndex].value}"`,
          explanation: `Key "${key}" found at index ${currentIndex} with value "${table[currentIndex].value}"`,
          variables: { 
            result: "Found",
            value: table[currentIndex].value || "",
            index: currentIndex,
            probe_count: probeCount + 1
          }
        });
        break;
      } else {
        steps.push({
          line: 6,
          code: `    # Key mismatch: "${table[currentIndex].key}" != "${key}"`,
          explanation: `Index ${currentIndex} contains "${table[currentIndex].key}", continue probing...`,
          variables: { 
            found_key: table[currentIndex].key || "",
            search_key: key,
            probe_count: probeCount + 1
          }
        });
      }

      probeCount++;
      currentIndex = (currentIndex + 1) % tableSize;
    }

    if (!found && probeCount >= tableSize) {
      steps.push({
        line: 7,
        code: `    # Searched entire table - key not found`,
        explanation: `Probed all ${tableSize} slots. Key "${key}" not in table.`,
        variables: { 
          result: "Not Found",
          total_probes: probeCount
        }
      });
    }

    setAnimationSteps(steps);
    setIsAnimating(true);
  };

  // Animate Delete Operation
  const animateDelete = () => {
    if (!keyInput) {
      alert("Please enter a key to delete");
      return;
    }

    resetAnimation();
    setSelectedOperation("Delete with Linear Probing");

    const key = keyInput.toLowerCase();
    const hashValue = hashFunction(key);
    let probeCount = 0;

    const steps: AnimationStep[] = [
      {
        line: 1,
        code: `def delete(self, key):`,
        explanation: `Delete key "${key}" from hash table`,
        variables: { delete_key: key }
      },
      {
        line: 2,
        code: `    hash_value = hash_function("${key}")`,
        explanation: `Calculate hash value for "${key}"`,
        variables: { 
          delete_key: key, 
          hash_value: hashValue 
        },
        highlightBucket: hashValue
      }
    ];

    let currentIndex = hashValue;
    let found = false;

    while (probeCount < tableSize && table[currentIndex].key !== null) {
      steps.push({
        line: 3,
        code: `    # Check index ${currentIndex}`,
        explanation: `Checking index ${currentIndex}...`,
        variables: { 
          current_index: currentIndex,
          probe_count: probeCount
        },
        highlightBucket: currentIndex
      });

      if (table[currentIndex].key === key) {
        found = true;
        const newTable = [...table];
        newTable[currentIndex] = {
          ...newTable[currentIndex],
          key: null,
          value: null,
          isBeingRemoved: true
        };

        steps.push({
          line: 4,
          code: `    # Found! Delete key "${key}"`,
          explanation: `Key "${key}" found at index ${currentIndex}. Deleting...`,
          variables: { 
            deleted_key: key,
            deleted_from: currentIndex,
            probe_count: probeCount + 1
          },
          tableState: newTable
        });
        break;
      }

      probeCount++;
      currentIndex = (currentIndex + 1) % tableSize;
    }

    if (!found) {
      steps.push({
        line: 5,
        code: `    # Key not found`,
        explanation: `Key "${key}" not found in hash table`,
        variables: { 
          result: "Not Found",
          probe_count: probeCount
        }
      });
    }

    setAnimationSteps(steps);
    setKeyInput("");
    setIsAnimating(true);
  };

  // Demonstrate Hash Function Comparison
  const animateHashComparison = () => {
    if (!keyInput) {
      alert("Please enter a key to compare hash functions");
      return;
    }

    resetAnimation();
    setSelectedOperation("Hash Function Comparison");

    const key = keyInput.toLowerCase();
    const simpleHash = hashFunction(key);
    const djb2HashValue = djb2Hash(key);

    const steps: AnimationStep[] = [
      {
        line: 1,
        code: `# Compare hash functions for "${key}"`,
        explanation: `Comparing different hash functions for key "${key}"`,
        variables: { test_key: key }
      },
      {
        line: 2,
        code: `def simple_hash(key):`,
        explanation: `Simple hash: sum of ASCII values mod table size`,
        variables: { test_key: key, method: "Simple Hash" }
      },
      {
        line: 3,
        code: `    return sum(ord(c) for c in key) % ${tableSize}`,
        explanation: `Simple hash result: ${simpleHash}`,
        variables: { 
          test_key: key, 
          simple_result: simpleHash,
          ascii_sum: key.split('').map(c => c.charCodeAt(0)).reduce((a, b) => a + b, 0)
        },
        highlightBucket: simpleHash
      },
      {
        line: 4,
        code: `def djb2_hash(key):`,
        explanation: `DJB2 hash: more uniform distribution`,
        variables: { test_key: key, method: "DJB2 Hash" }
      },
      {
        line: 5,
        code: `    # DJB2 algorithm with better distribution`,
        explanation: `DJB2 hash result: ${djb2HashValue}`,
        variables: { 
          test_key: key, 
          simple_result: simpleHash,
          djb2_result: djb2HashValue,
          difference: Math.abs(simpleHash - djb2HashValue)
        },
        highlightBucket: djb2HashValue
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

  const loadFactor = (table.filter(bucket => bucket.key !== null).length / tableSize * 100).toFixed(1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold text-center text-purple-800 mb-8">
          🗂️ Interactive Hash Table Visualizer
        </h1>

        {/* Operation Controls */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">🎮 Controls</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <input
              type="text"
              placeholder="Key (e.g., apple)"
              className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
            />
            <input
              type="text"
              placeholder="Value (e.g., 🍎)"
              className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-pink-500 focus:ring-2 focus:ring-pink-200"
              value={valueInput}
              onChange={(e) => setValueInput(e.target.value)}
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
            <button onClick={animateInsert} className="btn-primary">
              ➕ Insert
            </button>
            <button onClick={animateSearch} className="btn-secondary">
              🔍 Search
            </button>
            <button onClick={animateDelete} className="btn-danger">
              🗑️ Delete
            </button>
            <button onClick={animateHashComparison} className="btn-special">
              ⚖️ Compare Hash
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

        {/* Hash Table Visualization */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            🗂️ Hash Table (Load Factor: {loadFactor}%)
          </h2>
          
          <div className="grid grid-cols-1 gap-4 p-4 bg-gray-50 rounded-lg">
            {table.map((bucket, index) => (
              <motion.div
                key={bucket.id}
                initial={{ opacity: 0, x: -50 }}
                animate={{ 
                  opacity: 1, 
                  x: 0,
                  scale: bucket.isHighlighted ? 1.05 : 1
                }}
                transition={{ delay: index * 0.1 }}
                className={`
                  flex items-center justify-between p-4 rounded-lg border-2 transition-all duration-300
                  ${bucket.isHighlighted 
                    ? 'bg-yellow-200 border-yellow-500 ring-4 ring-yellow-300' 
                    : bucket.isNew
                    ? 'bg-green-200 border-green-500'
                    : bucket.isCollision
                    ? 'bg-orange-200 border-orange-500'
                    : bucket.isBeingRemoved
                    ? 'bg-red-200 border-red-500'
                    : bucket.key
                    ? 'bg-blue-100 border-blue-300'
                    : 'bg-white border-gray-300'
                  }
                `}
              >
                {/* Index */}
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                    {index}
                  </div>
                  
                  {/* Bucket Content */}
                  <div className="flex items-center gap-2 min-w-[200px]">
                    {bucket.key ? (
                      <>
                        <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                          {bucket.key}
                        </span>
                        <span className="text-gray-500">→</span>
                        <span className="text-lg">{bucket.value}</span>
                      </>
                    ) : (
                      <span className="text-gray-400 italic">Empty</span>
                    )}
                  </div>
                </div>

                {/* Hash Indicator */}
                {bucket.key && (
                  <div className="text-xs text-gray-500">
                    hash({bucket.key}) = {hashFunction(bucket.key)}
                  </div>
                )}
              </motion.div>
            ))}
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

          {/* Variables & Statistics */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">📊 Variables & Statistics</h2>
            
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

            {/* Hash Table Stats */}
            <div className="mt-6 p-4 bg-purple-50 border-2 border-purple-200 rounded-lg">
              <h3 className="font-semibold text-purple-800 mb-2">📈 Hash Table Statistics</h3>
              <div className="text-sm text-purple-700 space-y-1">
                <div>• <strong>Size:</strong> {tableSize} buckets</div>
                <div>• <strong>Occupied:</strong> {table.filter(b => b.key !== null).length} buckets</div>
                <div>• <strong>Load Factor:</strong> {loadFactor}%</div>
                <div>• <strong>Collisions:</strong> {collisionCount}</div>
              </div>
            </div>

            {/* Hash Function Info */}
            <div className="mt-4 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">🔢 Hash Function</h3>
              <div className="text-sm text-blue-700 space-y-1">
                <div>• <strong>Method:</strong> Sum of ASCII values</div>
                <div>• <strong>Formula:</strong> hash(key) = Σ(ASCII) % {tableSize}</div>
                <div>• <strong>Collision Resolution:</strong> Linear Probing</div>
                <div>• <strong>Time Complexity:</strong> O(1) average, O(n) worst</div>
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
                  <span>Newly inserted element</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-orange-200 border-2 border-orange-500 rounded"></div>
                  <span>Collision occurred during insertion</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-200 border-2 border-red-500 rounded"></div>
                  <span>Being deleted/removed</span>
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
          @apply px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium;
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

export default HashTableAnimation;
