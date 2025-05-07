'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface StackNode {
  id: number
  value: number
}

const StackAnimation = () => {
  const [stack, setStack] = useState<StackNode[]>([
    { id: 1, value: 10 },
    { id: 2, value: 20 },
    { id: 3, value: 30 },
    { id: 4, value: 40 },
  ])
  const [inputValue, setInputValue] = useState('')
  const [pythonCode, setPythonCode] = useState('')

  const push = () => {
    if (!inputValue) return
    const newNode: StackNode = { id: Date.now(), value: Number(inputValue) }
    setStack(prev => [newNode, ...prev])
    setInputValue('')

    setPythonCode(`
stack.append(${newNode.value})
print(stack)
    `.trim())
  }

  const pop = () => {
    if (stack.length === 0) return
    const poppedNode = stack[0]
    setStack(prev => prev.slice(1))

    setPythonCode(`
stack.pop()  # Removed ${poppedNode.value}
print(stack)
    `.trim())
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-b from-blue-100 via-white to-blue-100">
      <h1 className="text-4xl font-bold mb-8 text-indigo-700">Stack Visualizer 📚</h1>

      <div className="flex gap-3 mb-6">
        <input
          type="number"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          placeholder="Enter Value"
          className="border px-4 py-2 rounded shadow-sm focus:outline-none focus:ring focus:border-blue-500"
        />
        <button onClick={push} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded shadow-md transition">
          Push
        </button>
        <button onClick={pop} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded shadow-md transition">
          Pop
        </button>
      </div>

      {/* Stack Visual */}
      <div className="flex flex-col-reverse items-center gap-4 mb-10">
        <AnimatePresence>
          {stack.map((node) => (
            <motion.div
              key={node.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.4 }}
              className="bg-white border-2 border-blue-500 rounded-lg w-32 h-16 flex items-center justify-center text-lg font-semibold shadow-md"
            >
              {node.value}
            </motion.div>
          ))}
        </AnimatePresence>
        <div className="mt-4 text-xl font-bold text-indigo-600">Top</div>
      </div>

      {/* Python Code Display */}
      {pythonCode && (
        <div className="w-full max-w-2xl bg-gray-900 text-green-400 rounded-lg p-4 overflow-x-auto shadow-md">
          <h2 className="text-xl font-bold mb-2 text-white">Python Code</h2>
          <pre className="whitespace-pre-wrap">{pythonCode}</pre>
        </div>
      )}
    </div>
  )
}

export default StackAnimation
