import React, { JSX, useState } from 'react'
import { motion } from 'framer-motion'

const HeapsAnimation = () => {
  const [heap, setHeap] = useState<number[]>([])
  const [inputValue, setInputValue] = useState('')
  const [heapType, setHeapType] = useState<'max' | 'min'>('max') // Toggle between Max and Min Heap
  const [pythonCode, setPythonCode] = useState('')

  // Helper functions for Max Heap and Min Heap operations
  // Calculate the parent index of a given node
  const parent = (i: number): number => Math.floor((i - 1) / 2)
  const leftChild = (i: number): number => 2 * i + 1
  const rightChild = (i: number): number => 2 * i + 2

  const compare = (a: number, b: number): boolean => {
    return heapType === 'max' ? a > b : a < b
  }


// Heapify up (Max or Min Heap)
const heapifyUp = (index: number): void => {
  let currentIndex = index
  while (
    currentIndex > 0 &&
    compare(heap[currentIndex], heap[Math.floor((currentIndex - 1) / 2)])
  ) {
    const parentIndex: number = parent(currentIndex)
    const updatedHeap = [...heap]
    ;[updatedHeap[parentIndex], updatedHeap[currentIndex]] = [updatedHeap[currentIndex], updatedHeap[parentIndex]]
    setHeap(updatedHeap)
    currentIndex = parentIndex
  }
}

  
  // Heapify down (Max or Min Heap)
  const heapifyDown = (index: number): void => {
    const currentIndex = index
    const left = leftChild(currentIndex)
    const right = rightChild(currentIndex)

    let extreme = currentIndex
    if (left < heap.length && compare(heap[left], heap[extreme])) {
      extreme = left
    }
    if (right < heap.length && compare(heap[right], heap[extreme])) {
      extreme = right
    }

    if (extreme !== currentIndex) {
      [heap[currentIndex], heap[extreme]] = [heap[extreme], heap[currentIndex]]
      heapifyDown(extreme)
    }
  }

  // Insert into the heap
  const insert = (value: number): void => {
    heap.push(value)
    heapifyUp(heap.length - 1)
    setHeap([...heap])
  }

  // Delete the root (Max or Min value)
  const deleteRoot = (): void => {
    if (heap.length === 0) return
    heap[0] = heap[heap.length - 1]
    heap.pop()
    heapifyDown(0)
    setHeap([...heap])
  }

  // Python code for Max/Min Heap operations
  const handleInsert = () => {
    if (!inputValue) return
    const numericValue = parseInt(inputValue)
    if (isNaN(numericValue)) return
    insert(numericValue)
    setInputValue('')
    
    setPythonCode(
`# Insert into ${heapType === 'max' ? 'Max' : 'Min'} Heap
def heapifyUp(heap, i):
    while i > 0 and heap[parent(i)] ${heapType === 'max' ? '<' : '>'} heap[i]:
        heap[parent(i)], heap[i] = heap[i], heap[parent(i)]
        i = parent(i)

def insert(heap, value):
    heap.append(value)
    heapifyUp(heap, len(heap) - 1)`
    )
  }

  const handleDelete = () => {
    deleteRoot()
    setPythonCode(
`# Delete root from ${heapType === 'max' ? 'Max' : 'Min'} Heap
def heapifyDown(heap, i):
    left = leftChild(i)
    right = rightChild(i)
    extreme = i
    if left < len(heap) and heap[left] ${heapType === 'max' ? '<' : '>'} heap[extreme]:
        extreme = left
    if right < len(heap) and heap[right] ${heapType === 'max' ? '<' : '>'} heap[extreme]:
        extreme = right
    if extreme != i:
        heap[i], heap[extreme] = heap[extreme], heap[i]
        heapifyDown(heap, extreme)

def deleteRoot(heap):
    if len(heap) > 0:
        heap[0] = heap[-1]
        heap.pop()
        heapifyDown(heap, 0)`
    )
  }

  // Render heap tree
  const renderHeap = (index: number, depth: number): JSX.Element | null => {
    if (index >= heap.length) return null

    const left = leftChild(index)
    const right = rightChild(index)

    return (
      <div className="flex flex-col items-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white border-2 border-blue-500 rounded-full w-14 h-14 flex items-center justify-center text-lg font-semibold shadow-lg"
        >
          {heap[index]}
        </motion.div>

        {(left < heap.length || right < heap.length) && (
          <div className="flex justify-between w-full mt-2">
            <div className="flex-1 flex justify-end pr-2">
              {renderHeap(left, depth + 1)}
            </div>
            <div className="flex-1 flex justify-start pl-2">
              {renderHeap(right, depth + 1)}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
      <h1 className="text-4xl font-bold text-indigo-700 mb-6">{heapType === 'max' ? 'Max' : 'Min'} Heap Visualizer 🌳</h1>

      {/* Heap Type Selector */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setHeapType('max')}
          className={`px-4 py-2 rounded-md shadow ${heapType === 'max' ? 'bg-indigo-600' : 'bg-indigo-500'} text-white transition`}
        >
          Max Heap
        </button>
        <button
          onClick={() => setHeapType('min')}
          className={`px-4 py-2 rounded-md shadow ${heapType === 'min' ? 'bg-indigo-600' : 'bg-indigo-500'} text-white transition`}
        >
          Min Heap
        </button>
      </div>

      {/* Insert */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          placeholder="Insert value"
          className="border px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
        />
        <button
          onClick={handleInsert}
          className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md shadow transition"
        >
          Insert
        </button>
      </div>

      {/* Delete Root */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={handleDelete}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md shadow transition"
        >
          Delete Root
        </button>
      </div>

      {/* Heap rendering */}
      <div className="flex justify-center overflow-auto mb-10 min-w-full">
        {heap.length > 0 ? renderHeap(0, 0) : (
          <div className="text-gray-400 italic">No elements in the heap. Insert to build your {heapType === 'max' ? 'Max' : 'Min'} Heap!</div>
        )}
      </div>

      {/* Python Code */}
      {pythonCode && (
        <div className="w-full max-w-2xl bg-gray-900 text-green-400 rounded-lg p-4 overflow-x-auto shadow-md">
          <h2 className="text-xl font-bold mb-2 text-white">Python Code</h2>
          <pre className="whitespace-pre-wrap">{pythonCode}</pre>
        </div>
      )}
    </div>
  )
}

export default HeapsAnimation
