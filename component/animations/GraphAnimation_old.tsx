"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

interface Edge {
  from: string;
  to: string;
  weight: number;
}

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 500;
const RADIUS = Math.min(CANVAS_WIDTH, CANVAS_HEIGHT) / 2 - 60;
const CENTER_X = CANVAS_WIDTH / 2;
const CENTER_Y = CANVAS_HEIGHT / 2;

export default function GraphAnimation() {
  const [nodeIds, setNodeIds] = useState<string[]>(["A", "B", "C"]);
  const [edges, setEdges] = useState<Edge[]>([
    { from: "A", to: "B", weight: 5 },
    { from: "A", to: "C", weight: 3 },
    { from: "B", to: "C", weight: 1 },
  ]);

  // form state
  const [newNodeId, setNewNodeId] = useState("");
  const [edgeFrom, setEdgeFrom] = useState("");
  const [edgeTo, setEdgeTo] = useState("");
  const [weightInput, setWeightInput] = useState("");
  const [delNodeId, setDelNodeId] = useState("");
  const [delEdgeFrom, setDelEdgeFrom] = useState("");
  const [delEdgeTo, setDelEdgeTo] = useState("");
  const [pythonCode, setPythonCode] = useState("");

  // compute circular layout
  const positions = nodeIds.map((id, i) => {
    const angle = (2 * Math.PI * i) / nodeIds.length - Math.PI / 2;
    return {
      id,
      x: CENTER_X + RADIUS * Math.cos(angle),
      y: CENTER_Y + RADIUS * Math.sin(angle),
    };
  });
  const getPos = (id: string) =>
    positions.find((p) => p.id === id) ?? { x: CENTER_X, y: CENTER_Y };

  // add node
  const addNode = () => {
    if (!newNodeId || nodeIds.includes(newNodeId)) return;
    setNodeIds((prev) => [...prev, newNodeId]);
    setPythonCode(
      `# add a node
graph = {}
def add_node(g, n):
    g[n] = []

add_node(graph, '${newNodeId}')
print(graph)`
    );
    setNewNodeId("");
  };

  // delete node (and its edges)
  const deleteNode = () => {
    if (!delNodeId || !nodeIds.includes(delNodeId)) return;
    setNodeIds((prev) => prev.filter((id) => id !== delNodeId));
    setEdges((prev) =>
      prev.filter((e) => e.from !== delNodeId && e.to !== delNodeId)
    );
    setPythonCode(
      `# delete a node
def delete_node(g, n):
    g.pop(n, None)
    for v in g:
        if n in g[v]:
            g[v].remove(n)

delete_node(graph, '${delNodeId}')
print(graph)`
    );
    setDelNodeId("");
  };

  // add weighted edge
  const addEdge = () => {
    if (!edgeFrom || !edgeTo || !weightInput) return;
    const w = Number(weightInput);
    setEdges((prev) => [...prev, { from: edgeFrom, to: edgeTo, weight: w }]);
    setPythonCode(
      `# add weighted edge (undirected)
def add_edge(g, u, v, w):
    g[u].append((v, w))
    g[v].append((u, w))

add_edge(graph, '${edgeFrom}', '${edgeTo}', ${w})
print(graph)`
    );
    setEdgeFrom("");
    setEdgeTo("");
    setWeightInput("");
  };

  // delete edge
  const deleteEdge = () => {
    if (!delEdgeFrom || !delEdgeTo) return;
    setEdges((prev) =>
      prev.filter(
        (e) =>
          !(e.from === delEdgeFrom && e.to === delEdgeTo) &&
          !(e.from === delEdgeTo && e.to === delEdgeFrom)
      )
    );
    setPythonCode(
      `# delete edge
def delete_edge(g, u, v):
    g[u] = [(x,w) for x,w in g[u] if x!=v]
    g[v] = [(x,w) for x,w in g[v] if x!=u]

delete_edge(graph, '${delEdgeFrom}', '${delEdgeTo}')
print(graph)`
    );
    setDelEdgeFrom("");
    setDelEdgeTo("");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
      <h1 className="text-4xl font-bold text-blue-700 mb-6">
        Weighted Graph Visualizer 🌐
      </h1>

      {/* Controls */}
      <div className="flex flex-wrap gap-6 mb-8">
        {/* Add Node */}
        <div className="flex flex-col items-start">
          <input
            value={newNodeId}
            onChange={(e) => setNewNodeId(e.target.value)}
            placeholder="New Node ID"
            className="border px-3 py-2 rounded-md mb-2 w-36 focus:ring focus:ring-blue-300"
          />
          <button
            onClick={addNode}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition"
          >
            Add Node
          </button>
        </div>

        {/* Delete Node */}
        <div className="flex flex-col items-start">
          <input
            value={delNodeId}
            onChange={(e) => setDelNodeId(e.target.value)}
            placeholder="Delete Node ID"
            className="border px-3 py-2 rounded-md mb-2 w-36 focus:ring focus:ring-red-300"
          />
          <button
            onClick={deleteNode}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition"
          >
            Delete Node
          </button>
        </div>

        {/* Add Edge */}
        <div className="flex flex-col items-start">
          <input
            value={edgeFrom}
            onChange={(e) => setEdgeFrom(e.target.value)}
            placeholder="From"
            className="border px-3 py-2 rounded-md mb-2 w-36 focus:ring focus:ring-green-300"
          />
          <input
            value={edgeTo}
            onChange={(e) => setEdgeTo(e.target.value)}
            placeholder="To"
            className="border px-3 py-2 rounded-md mb-2 w-36 focus:ring focus:ring-green-300"
          />
          <input
            value={weightInput}
            onChange={(e) => setWeightInput(e.target.value)}
            placeholder="Weight"
            className="border px-3 py-2 rounded-md mb-2 w-36 focus:ring focus:ring-green-300"
          />
          <button
            onClick={addEdge}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition"
          >
            Add Edge
          </button>
        </div>

        {/* Delete Edge */}
        <div className="flex flex-col items-start">
          <input
            value={delEdgeFrom}
            onChange={(e) => setDelEdgeFrom(e.target.value)}
            placeholder="From"
            className="border px-3 py-2 rounded-md mb-2 w-36 focus:ring focus:ring-yellow-300"
          />
          <input
            value={delEdgeTo}
            onChange={(e) => setDelEdgeTo(e.target.value)}
            placeholder="To"
            className="border px-3 py-2 rounded-md mb-2 w-36 focus:ring focus:ring-yellow-300"
          />
          <button
            onClick={deleteEdge}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md transition"
          >
            Delete Edge
          </button>
        </div>
      </div>

      {/* Graph Area */}
      <div className="relative w-[600px] h-[500px] border border-gray-300 rounded-lg bg-white shadow-lg">
        <svg className="absolute top-0 left-0 w-full h-full">
          <defs>
            <marker
              id="arrow"
              markerWidth="6"
              markerHeight="6"
              refX="5"
              refY="3"
              orient="auto"
            >
              <path d="M0,0 L6,3 L0,6 Z" fill="#4B5563" />
            </marker>
          </defs>

          {edges.map((e, i) => {
            const p1 = getPos(e.from);
            const p2 = getPos(e.to);
            const mx = (p1.x + p2.x) / 2;
            const my = (p1.y + p2.y) / 2;
            return (
              <g key={i}>
                <motion.line
                  x1={p1.x}
                  y1={p1.y}
                  x2={p2.x}
                  y2={p2.y}
                  stroke="#4B5563"
                  strokeWidth={2}
                  markerEnd="url(#arrow)"
                  initial={{ strokeDashoffset: 100 }}
                  animate={{ strokeDashoffset: 0 }}
                  transition={{ duration: 0.6 }}
                />
                <text
                  x={mx}
                  y={my - 6}
                  className="fill-gray-700 font-bold text-sm"
                  textAnchor="middle"
                >
                  {e.weight}
                </text>
              </g>
            );
          })}
        </svg>

        {positions.map(({ id, x, y }) => (
          <motion.div
            key={id}
            className="absolute w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-500 
                       text-white rounded-full flex items-center justify-center 
                       shadow-xl ring-2 ring-white cursor-pointer 
                       hover:scale-110 transition-transform"
            style={{ left: x - 24, top: y - 24 }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            {id}
          </motion.div>
        ))}
      </div>

      {/* Python Code */}
      {pythonCode && (
        <div className="w-full max-w-2xl bg-gray-900 text-green-400 rounded-lg p-4 overflow-x-auto shadow-md">
          <h2 className="text-xl font-bold mb-2 text-white">Python Code</h2>
          <pre className="whitespace-pre-wrap">{pythonCode}</pre>
        </div>
      )}
    </div>
  );
}
