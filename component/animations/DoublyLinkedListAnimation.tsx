'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface DLLNode {
  id: number
  value: number
}

const DoublyLinkedListAnimation = () => {
  const [list, setList] = useState<DLLNode[]>([
    { id: 1, value: 10 },
    { id: 2, value: 20 },
    { id: 3, value: 30 },
  ])
  const [inputValue, setInputValue] = useState('')
  const [pythonCode, setPythonCode] = useState('')

  const insertAtBeginning = () => {
    if (!inputValue) return
    const newNode: DLLNode = { id: Date.now(), value: Number(inputValue) }
    setList(prev => [newNode, ...prev])
    setInputValue('')

    setPythonCode(`
new_node = Node(${newNode.value})
new_node.next = head
if head:
    head.prev = new_node
head = new_node
    `.trim())
  }

  const insertAtEnd = () => {
    if (!inputValue) return
    const newNode: DLLNode = { id: Date.now(), value: Number(inputValue) }
    setList(prev => [...prev, newNode])
    setInputValue('')

    setPythonCode(`
new_node = Node(${newNode.value})
if head is None:
    head = new_node
else:
    temp = head
    while temp.next:
        temp = temp.next
    temp.next = new_node
    new_node.prev = temp
    `.trim())
  }

  const deleteAtBeginning = () => {
    if (list.length === 0) return
    const deletedNode = list[0]
    setList(prev => prev.slice(1))

    setPythonCode(`
if head:
    head = head.next
    if head:
        head.prev = None
# Deleted ${deletedNode.value}
    `.trim())
  }

  const deleteAtEnd = () => {
    if (list.length === 0) return
    const deletedNode = list[list.length - 1]
    setList(prev => prev.slice(0, -1))

    setPythonCode(`
if head:
    temp = head
    if not temp.next:
        head = None
    else:
        while temp.next:
            temp = temp.next
        temp.prev.next = None
# Deleted ${deletedNode.value}
    `.trim())
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-br from-purple-100 via-white to-purple-200">
      <h1 className="text-4xl font-bold mb-8 text-purple-700">Doubly Linked List Visualizer 📚</h1>

      <div className="flex gap-3 mb-6 flex-wrap justify-center">
        <input
          type="number"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          placeholder="Enter Value"
          className="border px-4 py-2 rounded shadow-sm focus:outline-none focus:ring focus:border-purple-500"
        />
        <button onClick={insertAtBeginning} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded shadow-md transition">
          Insert at Beginning
        </button>
        <button onClick={insertAtEnd} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow-md transition">
          Insert at End
        </button>
        <button onClick={deleteAtBeginning} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded shadow-md transition">
          Delete at Beginning
        </button>
        <button onClick={deleteAtEnd} className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded shadow-md transition">
          Delete at End
        </button>
      </div>

      {/* Doubly Linked List Visual */}
      <div className="flex items-center gap-6 mb-10 overflow-x-auto p-4">
        <div className="font-bold text-lg">Head ⇄</div>
        <AnimatePresence>
          {list.map((node, idx) => (
            <motion.div
              key={node.id}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center"
            >
              <div className="bg-white border-2 border-purple-500 rounded-lg px-6 py-4 shadow-md flex flex-col items-center w-40">
                <div className="font-bold text-lg mb-2">Data: {node.value}</div>
                <div className="text-sm text-gray-600">Prev: {list[idx - 1] ? list[idx - 1].value : 'NULL'}</div>
                <div className="text-sm text-gray-600">Next: {list[idx + 1] ? list[idx + 1].value : 'NULL'}</div>
              </div>
              {idx !== list.length - 1 && (
                <div className="text-3xl">⇄</div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
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

export default DoublyLinkedListAnimation
