"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface GraphNode {
  id: string;
  x: number;
  y: number;
  isVisited?: boolean;
  isCurrently?: boolean;
  isInPath?: boolean;
  distance?: number;
  parent?: string | null;
}

interface GraphEdge {
  from: string;
  to: string;
  weight: number;
  isHighlighted?: boolean;
  isInPath?: boolean;
  isBeingExplored?: boolean;
}

interface AnimationStep {
  line: number;
  code: string;
  explanation: string;
  nodeStates?: { [key: string]: Partial<GraphNode> };
  edgeStates?: { [key: string]: Partial<GraphEdge> };
  variables?: { [key: string]: string | number };
  currentNode?: string;
  queue?: string[];
  stack?: string[];
  distances?: { [key: string]: number };
}

const GraphAnimation = () => {
  const CANVAS_WIDTH = 700;
  const CANVAS_HEIGHT = 500;
  const RADIUS = Math.min(CANVAS_WIDTH, CANVAS_HEIGHT) / 2 - 80;
  const CENTER_X = CANVAS_WIDTH / 2;
  const CENTER_Y = CANVAS_HEIGHT / 2;

  const [nodes, setNodes] = useState<GraphNode[]>([
    { id: "A", x: CENTER_X, y: CENTER_Y - RADIUS },
    { id: "B", x: CENTER_X + RADIUS * 0.8, y: CENTER_Y - RADIUS * 0.3 },
    { id: "C", x: CENTER_X + RADIUS * 0.3, y: CENTER_Y + RADIUS * 0.8 },
    { id: "D", x: CENTER_X - RADIUS * 0.3, y: CENTER_Y + RADIUS * 0.8 },
    { id: "E", x: CENTER_X - RADIUS * 0.8, y: CENTER_Y - RADIUS * 0.3 },
  ]);

  const [edges, setEdges] = useState<GraphEdge[]>([
    { from: "A", to: "B", weight: 4 },
    { from: "A", to: "E", weight: 2 },
    { from: "B", to: "C", weight: 3 },
    { from: "C", to: "D", weight: 1 },
    { from: "D", to: "E", weight: 5 },
    { from: "E", to: "B", weight: 7 },
  ]);

  const [isAnimating, setIsAnimating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [animationSteps, setAnimationSteps] = useState<AnimationStep[]>([]);
  const [variables, setVariables] = useState<{ [key: string]: string | number }>({});
  const [operationSpeed, setOperationSpeed] = useState(1500);
  const [selectedOperation, setSelectedOperation] = useState<string>("");
  const [startNode, setStartNode] = useState("A");
  const [endNode, setEndNode] = useState("D");
  const [newNodeId, setNewNodeId] = useState("");
  const [edgeFrom, setEdgeFrom] = useState("");
  const [edgeTo, setEdgeTo] = useState("");
  const [edgeWeight, setEdgeWeight] = useState("");

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const resetAnimation = () => {
    setIsAnimating(false);
    setCurrentStep(0);
    setAnimationSteps([]);
    setVariables({});
    // Reset node and edge states
    setNodes(prev => prev.map(node => ({
      ...node,
      isVisited: false,
      isCurrently: false,
      isInPath: false,
      distance: undefined,
      parent: undefined
    })));
    setEdges(prev => prev.map(edge => ({
      ...edge,
      isHighlighted: false,
      isInPath: false,
      isBeingExplored: false
    })));
  };

  const executeStep = useCallback(async (step: AnimationStep) => {
    if (step.variables) {
      setVariables(step.variables);
    }
    if (step.nodeStates) {
      setNodes(prev => prev.map(node => 
        step.nodeStates![node.id] ? { ...node, ...step.nodeStates![node.id] } : node
      ));
    }
    if (step.edgeStates) {
      setEdges(prev => prev.map(edge => {
        const edgeKey = `${edge.from}-${edge.to}`;
        const reverseKey = `${edge.to}-${edge.from}`;
        return step.edgeStates![edgeKey] || step.edgeStates![reverseKey] 
          ? { ...edge, ...(step.edgeStates![edgeKey] || step.edgeStates![reverseKey]) }
          : edge;
      }));
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

  // Build adjacency list
  const buildAdjacencyList = () => {
    const adjList: { [key: string]: { node: string; weight: number }[] } = {};
    nodes.forEach(node => {
      adjList[node.id] = [];
    });
    edges.forEach(edge => {
      adjList[edge.from].push({ node: edge.to, weight: edge.weight });
      // For undirected graph, add reverse edge
      adjList[edge.to].push({ node: edge.from, weight: edge.weight });
    });
    return adjList;
  };

  // Animate BFS
  const animateBFS = () => {
    resetAnimation();
    setSelectedOperation("Breadth-First Search (BFS)");

    const adjList = buildAdjacencyList();
    const visited = new Set<string>();
    const queue: string[] = [startNode];
    const parent: { [key: string]: string | null } = {};
    parent[startNode] = null;

    const steps: AnimationStep[] = [
      {
        line: 1,
        code: `def bfs(graph, start):`,
        explanation: `Start BFS traversal from node ${startNode}`,
        variables: { start_node: startNode, visited_count: 0 }
      },
      {
        line: 2,
        code: `    queue = [start]`,
        explanation: `Initialize queue with starting node`,
        variables: { queue: `[${startNode}]`, visited_count: 0 },
        queue: [startNode]
      },
      {
        line: 3,
        code: `    visited = set()`,
        explanation: `Initialize visited set to track explored nodes`,
        variables: { visited: "{}", queue: `[${startNode}]` }
      }
    ];

    while (queue.length > 0) {
      const current = queue.shift()!;
      
      if (visited.has(current)) continue;
      
      visited.add(current);

      steps.push({
        line: 4,
        code: `    current = queue.pop(0)  # ${current}`,
        explanation: `Dequeue node ${current} and mark as visited`,
        variables: {
          current_node: current,
          visited: `{${Array.from(visited).join(', ')}}`,
          queue: `[${queue.join(', ')}]`
        },
        nodeStates: {
          [current]: { isCurrently: true, isVisited: true }
        },
        currentNode: current
      });

      // Explore neighbors
      const neighbors = adjList[current] || [];
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor.node) && !queue.includes(neighbor.node)) {
          queue.push(neighbor.node);
          parent[neighbor.node] = current;

          steps.push({
            line: 5,
            code: `    # Add neighbor ${neighbor.node} to queue`,
            explanation: `Discovered unvisited neighbor ${neighbor.node}, add to queue`,
            variables: {
              current_node: current,
              discovered: neighbor.node,
              queue: `[${queue.join(', ')}]`,
              visited: `{${Array.from(visited).join(', ')}}`
            },
            edgeStates: {
              [`${current}-${neighbor.node}`]: { isBeingExplored: true }
            }
          });
        }
      }

      steps.push({
        line: 6,
        code: `    # Finished exploring ${current}`,
        explanation: `Completed exploration of node ${current}`,
        nodeStates: {
          [current]: { isCurrently: false, isVisited: true }
        }
      });
    }

    steps.push({
      line: 7,
      code: `    return visited`,
      explanation: `BFS complete! Visited all reachable nodes: {${Array.from(visited).join(', ')}}`,
      variables: {
        final_visited: `{${Array.from(visited).join(', ')}}`,
        total_nodes: visited.size,
        time_complexity: "O(V + E)"
      }
    });

    setAnimationSteps(steps);
    setIsAnimating(true);
  };

  // Animate DFS
  const animateDFS = () => {
    resetAnimation();
    setSelectedOperation("Depth-First Search (DFS)");

    const adjList = buildAdjacencyList();
    const visited = new Set<string>();
    const stack: string[] = [startNode];
    const visitOrder: string[] = [];

    const steps: AnimationStep[] = [
      {
        line: 1,
        code: `def dfs(graph, start):`,
        explanation: `Start DFS traversal from node ${startNode}`,
        variables: { start_node: startNode, visited_count: 0 }
      },
      {
        line: 2,
        code: `    stack = [start]`,
        explanation: `Initialize stack with starting node`,
        variables: { stack: `[${startNode}]`, visited_count: 0 },
        stack: [startNode]
      },
      {
        line: 3,
        code: `    visited = set()`,
        explanation: `Initialize visited set to track explored nodes`,
        variables: { visited: "{}", stack: `[${startNode}]` }
      }
    ];

    while (stack.length > 0) {
      const current = stack.pop()!;
      
      if (visited.has(current)) continue;
      
      visited.add(current);
      visitOrder.push(current);

      steps.push({
        line: 4,
        code: `    current = stack.pop()  # ${current}`,
        explanation: `Pop node ${current} from stack and mark as visited`,
        variables: {
          current_node: current,
          visited: `{${Array.from(visited).join(', ')}}`,
          stack: `[${stack.join(', ')}]`,
          visit_order: `[${visitOrder.join(', ')}]`
        },
        nodeStates: {
          [current]: { isCurrently: true, isVisited: true }
        },
        currentNode: current
      });

      // Add unvisited neighbors to stack (in reverse order for proper DFS)
      const neighbors = adjList[current] || [];
      const unvisitedNeighbors = neighbors
        .filter(n => !visited.has(n.node))
        .reverse();

      for (const neighbor of unvisitedNeighbors) {
        if (!stack.includes(neighbor.node)) {
          stack.push(neighbor.node);

          steps.push({
            line: 5,
            code: `    # Push neighbor ${neighbor.node} to stack`,
            explanation: `Add unvisited neighbor ${neighbor.node} to stack`,
            variables: {
              current_node: current,
              discovered: neighbor.node,
              stack: `[${stack.join(', ')}]`,
              visited: `{${Array.from(visited).join(', ')}}`
            },
            edgeStates: {
              [`${current}-${neighbor.node}`]: { isBeingExplored: true }
            }
          });
        }
      }

      steps.push({
        line: 6,
        code: `    # Finished exploring ${current}`,
        explanation: `Completed exploration of node ${current}`,
        nodeStates: {
          [current]: { isCurrently: false, isVisited: true }
        }
      });
    }

    steps.push({
      line: 7,
      code: `    return visit_order`,
      explanation: `DFS complete! Visit order: [${visitOrder.join(', ')}]`,
      variables: {
        final_order: `[${visitOrder.join(', ')}]`,
        total_nodes: visited.size,
        time_complexity: "O(V + E)"
      }
    });

    setAnimationSteps(steps);
    setIsAnimating(true);
  };

  // Animate Dijkstra's Algorithm
  const animateDijkstra = () => {
    resetAnimation();
    setSelectedOperation("Dijkstra's Shortest Path");

    const adjList = buildAdjacencyList();
    const distances: { [key: string]: number } = {};
    const previous: { [key: string]: string | null } = {};
    const visited = new Set<string>();
    
    // Initialize distances
    nodes.forEach(node => {
      distances[node.id] = node.id === startNode ? 0 : Infinity;
      previous[node.id] = null;
    });

    const steps: AnimationStep[] = [
      {
        line: 1,
        code: `def dijkstra(graph, start, end):`,
        explanation: `Find shortest path from ${startNode} to ${endNode}`,
        variables: { start_node: startNode, end_node: endNode }
      },
      {
        line: 2,
        code: `    distances = {node: ∞ for node in graph}`,
        explanation: `Initialize all distances to infinity`,
        variables: { 
          distances: nodes.map(n => `${n.id}: ${n.id === startNode ? '0' : '∞'}`).join(', ')
        }
      },
      {
        line: 3,
        code: `    distances[start] = 0`,
        explanation: `Set distance to start node as 0`,
        variables: { start_distance: 0 },
        nodeStates: {
          [startNode]: { distance: 0 }
        }
      }
    ];

    while (visited.size < nodes.length) {
      // Find unvisited node with minimum distance
      let minNode = "";
      let minDistance = Infinity;
      
      for (const node of nodes) {
        if (!visited.has(node.id) && distances[node.id] < minDistance) {
          minDistance = distances[node.id];
          minNode = node.id;
        }
      }

      if (minDistance === Infinity) break;

      visited.add(minNode);

      steps.push({
        line: 4,
        code: `    current = min_unvisited_node()  # ${minNode}`,
        explanation: `Select unvisited node with minimum distance: ${minNode} (distance: ${minDistance})`,
        variables: {
          current_node: minNode,
          current_distance: minDistance,
          visited: `{${Array.from(visited).join(', ')}}`
        },
        nodeStates: {
          [minNode]: { isCurrently: true, distance: minDistance }
        },
        distances: distances
      });

      // If we reached the end node, we can stop
      if (minNode === endNode) {
        steps.push({
          line: 5,
          code: `    # Reached target node ${endNode}!`,
          explanation: `Found shortest path to ${endNode} with distance ${minDistance}`,
          variables: {
            target_reached: "true",
            shortest_distance: minDistance
          }
        });
        break;
      }

      // Update distances to neighbors
      const neighbors = adjList[minNode] || [];
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor.node)) {
          const newDistance = distances[minNode] + neighbor.weight;
          
          steps.push({
            line: 6,
            code: `    # Check neighbor ${neighbor.node}: ${distances[minNode]} + ${neighbor.weight} = ${newDistance}`,
            explanation: `Calculate new distance to ${neighbor.node} via ${minNode}`,
            variables: {
              neighbor: neighbor.node,
              current_dist: distances[neighbor.node],
              new_dist: newDistance,
              is_shorter: newDistance < distances[neighbor.node] ? "Yes" : "No"
            },
            edgeStates: {
              [`${minNode}-${neighbor.node}`]: { isHighlighted: true }
            }
          });

          if (newDistance < distances[neighbor.node]) {
            distances[neighbor.node] = newDistance;
            previous[neighbor.node] = minNode;

            steps.push({
              line: 7,
              code: `    # Update: distances[${neighbor.node}] = ${newDistance}`,
              explanation: `Found shorter path to ${neighbor.node}! Update distance and parent.`,
              variables: {
                updated_node: neighbor.node,
                new_distance: newDistance,
                parent: minNode
              },
              nodeStates: {
                [neighbor.node]: { distance: newDistance, parent: minNode }
              },
              distances: { ...distances }
            });
          }
        }
      }

      steps.push({
        line: 8,
        code: `    # Mark ${minNode} as visited`,
        explanation: `Finished processing ${minNode}`,
        nodeStates: {
          [minNode]: { isCurrently: false, isVisited: true }
        }
      });
    }

    // Reconstruct path
    if (distances[endNode] !== Infinity) {
      const path: string[] = [];
      let current = endNode;
      while (current !== null) {
        path.unshift(current);
        current = previous[current]!;
      }

      steps.push({
        line: 9,
        code: `    # Reconstruct shortest path`,
        explanation: `Shortest path: ${path.join(' → ')} (total distance: ${distances[endNode]})`,
        variables: {
          shortest_path: path.join(' → '),
          total_distance: distances[endNode],
          path_length: path.length - 1
        }
      });

      // Highlight the shortest path
      for (let i = 0; i < path.length - 1; i++) {
        steps.push({
          line: 10,
          code: `    # Highlight path edge: ${path[i]} → ${path[i + 1]}`,
          explanation: `Mark edge ${path[i]} → ${path[i + 1]} as part of shortest path`,
          edgeStates: {
            [`${path[i]}-${path[i + 1]}`]: { isInPath: true }
          },
          nodeStates: {
            [path[i]]: { isInPath: true },
            [path[i + 1]]: { isInPath: true }
          }
        });
      }
    }

    setAnimationSteps(steps);
    setIsAnimating(true);
  };

  // Add new node
  const addNode = () => {
    if (!newNodeId || nodes.some(n => n.id === newNodeId)) {
      alert("Please enter a unique node ID");
      return;
    }

    const angle = (2 * Math.PI * nodes.length) / (nodes.length + 1);
    const newNode: GraphNode = {
      id: newNodeId,
      x: CENTER_X + RADIUS * Math.cos(angle),
      y: CENTER_Y + RADIUS * Math.sin(angle)
    };

    setNodes(prev => [...prev, newNode]);
    setNewNodeId("");
  };

  // Add new edge
  const addEdge = () => {
    if (!edgeFrom || !edgeTo || !edgeWeight || isNaN(Number(edgeWeight))) {
      alert("Please fill all edge fields with valid data");
      return;
    }

    if (!nodes.some(n => n.id === edgeFrom) || !nodes.some(n => n.id === edgeTo)) {
      alert("Both nodes must exist");
      return;
    }

    if (edges.some(e => e.from === edgeFrom && e.to === edgeTo)) {
      alert("Edge already exists");
      return;
    }

    const newEdge: GraphEdge = {
      from: edgeFrom,
      to: edgeTo,
      weight: Number(edgeWeight)
    };

    setEdges(prev => [...prev, newEdge]);
    setEdgeFrom("");
    setEdgeTo("");
    setEdgeWeight("");
  };

  const manualStepControl = () => {
    if (currentStep < animationSteps.length) {
      executeStep(animationSteps[currentStep]);
      setCurrentStep(prev => prev + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold text-center text-green-800 mb-8">
          🌐 Interactive Graph Algorithms Visualizer
        </h1>

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">🎮 Controls</h2>
          
          {/* Algorithm Controls */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <select
              className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-500"
              value={startNode}
              onChange={(e) => setStartNode(e.target.value)}
            >
              <option value="">Select Start Node</option>
              {nodes.map(node => (
                <option key={node.id} value={node.id}>Start: {node.id}</option>
              ))}
            </select>
            <select
              className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500"
              value={endNode}
              onChange={(e) => setEndNode(e.target.value)}
            >
              <option value="">Select End Node</option>
              {nodes.map(node => (
                <option key={node.id} value={node.id}>End: {node.id}</option>
              ))}
            </select>
            <select
              className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500"
              value={operationSpeed}
              onChange={(e) => setOperationSpeed(Number(e.target.value))}
            >
              <option value={2000}>Slow (2s)</option>
              <option value={1500}>Normal (1.5s)</option>
              <option value={1000}>Fast (1s)</option>
            </select>
            <button
              onClick={resetAnimation}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              🔄 Reset
            </button>
          </div>

          {/* Algorithm Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <button onClick={animateBFS} className="btn-primary">
              🔄 BFS
            </button>
            <button onClick={animateDFS} className="btn-secondary">
              📦 DFS
            </button>
            <button onClick={animateDijkstra} className="btn-special">
              🗺️ Dijkstra
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

          {/* Graph Construction */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-3">🔧 Build Graph</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Add Node */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Node ID (e.g., F)"
                  className="flex-1 px-3 py-2 border rounded-lg focus:border-green-500"
                  value={newNodeId}
                  onChange={(e) => setNewNodeId(e.target.value)}
                />
                <button onClick={addNode} className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
                  ➕ Node
                </button>
              </div>

              {/* Add Edge */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="From"
                  className="w-16 px-2 py-2 border rounded-lg focus:border-blue-500"
                  value={edgeFrom}
                  onChange={(e) => setEdgeFrom(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="To"
                  className="w-16 px-2 py-2 border rounded-lg focus:border-blue-500"
                  value={edgeTo}
                  onChange={(e) => setEdgeTo(e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Weight"
                  className="w-20 px-2 py-2 border rounded-lg focus:border-blue-500"
                  value={edgeWeight}
                  onChange={(e) => setEdgeWeight(e.target.value)}
                />
                <button onClick={addEdge} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                  ➕ Edge
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Graph Visualization */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            🌐 Graph Visualization {selectedOperation && `- ${selectedOperation}`}
          </h2>
          
          <div className="relative bg-gray-50 rounded-lg p-4 overflow-hidden">
            <svg width={CANVAS_WIDTH} height={CANVAS_HEIGHT} className="border rounded">
              {/* Render Edges */}
              {edges.map((edge, index) => {
                const fromNode = nodes.find(n => n.id === edge.from);
                const toNode = nodes.find(n => n.id === edge.to);
                if (!fromNode || !toNode) return null;

                const midX = (fromNode.x + toNode.x) / 2;
                const midY = (fromNode.y + toNode.y) / 2;

                return (
                  <g key={`edge-${index}`}>
                    {/* Edge line */}
                    <motion.line
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      x1={fromNode.x}
                      y1={fromNode.y}
                      x2={toNode.x}
                      y2={toNode.y}
                      stroke={
                        edge.isInPath ? "#10b981" :
                        edge.isHighlighted ? "#f59e0b" :
                        edge.isBeingExplored ? "#3b82f6" :
                        "#6b7280"
                      }
                      strokeWidth={edge.isInPath ? "4" : edge.isHighlighted ? "3" : "2"}
                      markerEnd="url(#arrowhead)"
                    />
                    
                    {/* Edge weight */}
                    <motion.circle
                      cx={midX}
                      cy={midY}
                      r="12"
                      fill="white"
                      stroke="#374151"
                      strokeWidth="1"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                    />
                    <motion.text
                      x={midX}
                      y={midY + 4}
                      textAnchor="middle"
                      fontSize="10"
                      fontWeight="bold"
                      fill="#374151"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                    >
                      {edge.weight}
                    </motion.text>
                  </g>
                );
              })}

              {/* Arrow marker definition */}
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="10"
                  markerHeight="7"
                  refX="9"
                  refY="3.5"
                  orient="auto"
                >
                  <polygon
                    points="0 0, 10 3.5, 0 7"
                    fill="#6b7280"
                  />
                </marker>
              </defs>

              {/* Render Nodes */}
              <AnimatePresence>
                {nodes.map((node, index) => (
                  <motion.g key={`node-${node.id}`}>
                    {/* Node circle */}
                    <motion.circle
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ 
                        scale: node.isCurrently ? 1.3 : 1, 
                        opacity: 1 
                      }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ 
                        type: "spring", 
                        stiffness: 300, 
                        damping: 20,
                        delay: index * 0.1 
                      }}
                      cx={node.x}
                      cy={node.y}
                      r="25"
                      fill={
                        node.isInPath ? "#10b981" :
                        node.isCurrently ? "#f59e0b" :
                        node.isVisited ? "#3b82f6" :
                        "#e5e7eb"
                      }
                      stroke={
                        node.isCurrently ? "#d97706" :
                        node.isVisited ? "#1d4ed8" :
                        "#374151"
                      }
                      strokeWidth="3"
                    />
                    
                    {/* Node label */}
                    <motion.text
                      x={node.x}
                      y={node.y + 5}
                      textAnchor="middle"
                      fontSize="16"
                      fontWeight="bold"
                      fill={node.isVisited || node.isCurrently || node.isInPath ? "white" : "#374151"}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                    >
                      {node.id}
                    </motion.text>

                    {/* Distance label for Dijkstra */}
                    {node.distance !== undefined && (
                      <motion.text
                        x={node.x}
                        y={node.y - 35}
                        textAnchor="middle"
                        fontSize="12"
                        fontWeight="bold"
                        fill="#7c3aed"
                        initial={{ opacity: 0, y: node.y - 25 }}
                        animate={{ opacity: 1, y: node.y - 35 }}
                      >
                        d: {node.distance === Infinity ? '∞' : node.distance}
                      </motion.text>
                    )}
                  </motion.g>
                ))}
              </AnimatePresence>
            </svg>
          </div>
        </div>

        {/* Animation Controls & Algorithm Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Step-by-Step Execution */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              📝 Algorithm Execution {selectedOperation && `- ${selectedOperation}`}
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

          {/* Variables & Statistics */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">📊 Algorithm State</h2>
            
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

            {/* Algorithm Information */}
            <div className="mt-6 p-4 bg-green-50 border-2 border-green-200 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">🧠 Algorithm Info</h3>
              <div className="text-sm text-green-700 space-y-1">
                {selectedOperation === "Breadth-First Search (BFS)" && (
                  <>
                    <div>• <strong>Strategy:</strong> Explore level by level</div>
                    <div>• <strong>Data Structure:</strong> Queue (FIFO)</div>
                    <div>• <strong>Use Case:</strong> Shortest path (unweighted)</div>
                    <div>• <strong>Time:</strong> O(V + E)</div>
                  </>
                )}
                {selectedOperation === "Depth-First Search (DFS)" && (
                  <>
                    <div>• <strong>Strategy:</strong> Go deep before wide</div>
                    <div>• <strong>Data Structure:</strong> Stack (LIFO)</div>
                    <div>• <strong>Use Case:</strong> Connectivity, cycles</div>
                    <div>• <strong>Time:</strong> O(V + E)</div>
                  </>
                )}
                {selectedOperation === "Dijkstra's Shortest Path" && (
                  <>
                    <div>• <strong>Strategy:</strong> Greedy shortest distance</div>
                    <div>• <strong>Data Structure:</strong> Priority Queue</div>
                    <div>• <strong>Use Case:</strong> Shortest path (weighted)</div>
                    <div>• <strong>Time:</strong> O((V + E) log V)</div>
                  </>
                )}
              </div>
            </div>

            {/* Legend */}
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">🎨 Color Legend</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                  <span>Currently processing</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                  <span>Visited/explored</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <span>In shortest path</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                  <span>Unvisited</span>
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
        .btn-special {
          @apply px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-medium;
        }
      `}</style>
    </div>
  );
};

export default GraphAnimation;
