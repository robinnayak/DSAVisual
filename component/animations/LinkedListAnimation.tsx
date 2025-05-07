'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Node {
  id: number
  value: number
}

const LinkedListAnimation = () => {
  const [list, setList] = useState<Node[]>([
    { id: 1, value: 10 },
    { id: 2, value: 20 },
    { id: 3, value: 30 },
    { id: 4, value: 40 },
  ])

  const [inputValue, setInputValue] = useState('')
  const [position, setPosition] = useState<number>(0)
  const [pythonCode, setPythonCode] = useState<string>('') // <-- Added for Python Code display

  const insertAtBeginning = () => {
    if (!inputValue) return
    const newNode: Node = { id: Date.now(), value: Number(inputValue) }
    setList(prev => [newNode, ...prev])
    setInputValue('')
    setPythonCode(`
class Node:
    def __init__(self, data):
        self.data = data
        self.next = None

class LinkedList:
    def __init__(self):
        self.head = None

    def insert_at_beginning(self, data):
        new_node = Node(data)
        new_node.next = self.head
        self.head = new_node
`)
  }

  const insertAtEnd = () => {
    if (!inputValue) return
    const newNode: Node = { id: Date.now(), value: Number(inputValue) }
    setList(prev => [...prev, newNode])
    setInputValue('')
    setPythonCode(`
class Node:
    def __init__(self, data):
        self.data = data
        self.next = None

class LinkedList:
    def __init__(self):
        self.head = None

    def insert_at_end(self, data):
        new_node = Node(data)
        if not self.head:
            self.head = new_node
            return
        temp = self.head
        while temp.next:
            temp = temp.next
        temp.next = new_node
`)
  }

  const insertAtPos = () => {
    if (!inputValue) return
    const newNode: Node = { id: Date.now(), value: Number(inputValue) }
    const pos = Math.min(Math.max(position, 0), list.length)
    const updatedList = [...list.slice(0, pos), newNode, ...list.slice(pos)]
    setList(updatedList)
    setInputValue('')
    setPythonCode(`
class Node:
    def __init__(self, data):
        self.data = data
        self.next = None

class LinkedList:
    def __init__(self):
        self.head = None

    def insert_at_position(self, pos, data):
        new_node = Node(data)
        if pos == 0:
            new_node.next = self.head
            self.head = new_node
            return
        temp = self.head
        for _ in range(pos - 1):
            if temp is None:
                return
            temp = temp.next
        new_node.next = temp.next
        temp.next = new_node
`)
  }

  const deleteAtBeginning = () => {
    setList(prev => prev.slice(1))
    setPythonCode(`
class LinkedList:
    def __init__(self):
        self.head = None

    def delete_at_beginning(self):
        if self.head:
            self.head = self.head.next
`)
  }

  const deleteAtEnd = () => {
    setList(prev => prev.slice(0, -1))
    setPythonCode(`
class LinkedList:
    def __init__(self):
        self.head = None

    def delete_at_end(self):
        if not self.head:
            return
        if not self.head.next:
            self.head = None
            return
        temp = self.head
        while temp.next.next:
            temp = temp.next
        temp.next = None
`)
  }

  const deleteAtPos = () => {
    const pos = Math.min(Math.max(position, 0), list.length - 1)
    const updatedList = list.filter((_, idx) => idx !== pos)
    setList(updatedList)
    setPythonCode(`
class LinkedList:
    def __init__(self):
        self.head = None

    def delete_at_position(self, pos):
        if pos == 0 and self.head:
            self.head = self.head.next
            return
        temp = self.head
        for _ in range(pos - 1):
            if temp is None:
                return
            temp = temp.next
        if temp and temp.next:
            temp.next = temp.next.next
`)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gradient-to-tr from-blue-50 to-purple-100">
      <h1 className="text-5xl font-extrabold mb-10 text-blue-700 tracking-wide drop-shadow-md">
        Linked List Visualizer 📚
      </h1>

      <div className="flex flex-wrap gap-4 mb-10 justify-center">
        <input
          type="number"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          placeholder="Data"
          className="border-2 border-blue-400 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-300"
        />
        <input
          type="number"
          value={position}
          onChange={e => setPosition(Number(e.target.value))}
          placeholder="Position"
          className="border-2 border-purple-400 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-purple-300"
        />
      </div>

      <div className="flex flex-wrap gap-3 mb-10 justify-center">
        <button onClick={insertAtBeginning} className="btn bg-green-500 hover:bg-green-600">
          Insert at Beginning
        </button>
        <button onClick={insertAtEnd} className="btn bg-green-500 hover:bg-green-600">
          Insert at End
        </button>
        <button onClick={insertAtPos} className="btn bg-green-500 hover:bg-green-600">
          Insert at Position
        </button>
        <button onClick={deleteAtBeginning} className="btn bg-red-500 hover:bg-red-600">
          Delete at Beginning
        </button>
        <button onClick={deleteAtEnd} className="btn bg-red-500 hover:bg-red-600">
          Delete at End
        </button>
        <button onClick={deleteAtPos} className="btn bg-red-500 hover:bg-red-600">
          Delete at Position
        </button>
      </div>

      {/* Linked List Visual */}
      <div className="flex items-center gap-8 flex-wrap justify-center mb-16">
        <div className="font-bold text-xl text-gray-700">Head ➡</div>
        <AnimatePresence>
          {list.map((node, idx) => (
            <motion.div
              key={node.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center"
            >
              <div className="node shadow-lg">
                <div className="text-xl font-semibold mb-1">Data: {node.value}</div>
                <div className="text-sm text-gray-500">
                  Next: {list[idx + 1] ? list[idx + 1].value : 'NULL'}
                </div>
              </div>
              {idx !== list.length - 1 && (
                <div className="text-3xl mt-2 text-blue-600 animate-bounce">➡</div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Python Code Display */}
      {pythonCode && (
        <div className="w-full max-w-4xl bg-gray-900 text-green-400 rounded-lg p-6 shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-white">Corresponding Python Code:</h2>
          <pre className="whitespace-pre-wrap">
            <code>{pythonCode}</code>
          </pre>
        </div>
      )}
    </div>
  )
}

export default LinkedListAnimation
