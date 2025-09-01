import React, { JSX, useState } from 'react'
import { motion } from 'framer-motion'

interface AVLNode {
  value: number
  left: AVLNode | null
  right: AVLNode | null
  height: number
}

const AVLTree = () => {
  const [tree, setTree] = useState<AVLNode | null>(null)
  const [inputValue, setInputValue] = useState('')
  const [searchValue, setSearchValue] = useState('')
  const [deleteValue, setDeleteValue] = useState('')
  const [foundNode, setFoundNode] = useState<AVLNode | null>(null)
  const [pythonCode, setPythonCode] = useState('')

  // Utility functions for height and balance factor
  const height = (node: AVLNode | null): number => (node ? node.height : 0)

  const balanceFactor = (node: AVLNode | null): number => {
    if (!node) return 0
    return height(node.left) - height(node.right)
  }
  
  const updateHeight = (node: AVLNode): void => {
    node.height = Math.max(height(node.left), height(node.right)) + 1
  }

  // Right rotate
  const rightRotate = (y: AVLNode): AVLNode => {
    const x = y.left
    y.left = x?.right || null
    x!.right = y
    updateHeight(y)
    updateHeight(x!)
    return x!
  }

  // Left rotate
  const leftRotate = (x: AVLNode): AVLNode => {
    const y = x.right
    x.right = y?.left || null
    y!.left = x
    updateHeight(x)
    updateHeight(y!)
    return y!
  }

  // Balancing the node
  const balance = (node: AVLNode): AVLNode => {
    const bf = balanceFactor(node)

    if (bf > 1) {
      // Left heavy: Check left subtree
      if (balanceFactor(node.left) < 0) {
        node.left = leftRotate(node.left!)
      }
      return rightRotate(node)
    }
    if (bf < -1) {
      // Right heavy: Check right subtree
      if (balanceFactor(node.right) > 0) {
        node.right = rightRotate(node.right!)
      }
      return leftRotate(node)
    }
    return node
  }

  // Insertion
  const insert = (node: AVLNode | null, value: number): AVLNode => {
    if (!node) return { value, left: null, right: null, height: 1 }

    if (value < node.value) {
      node.left = insert(node.left, value)
    } else if (value > node.value) {
      node.right = insert(node.right, value)
    } else {
      return node
    }

    updateHeight(node)
    return balance(node)
  }

  const handleInsert = () => {
    if (!inputValue) return
    const numericValue = parseInt(inputValue)
    if (isNaN(numericValue)) return
    const newRoot = insert(tree, numericValue)
    setTree(newRoot)
    setInputValue('')
    
    setPythonCode(
`# Insert into AVL Tree
class Node:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None
        self.height = 1

def insert(root, value):
    if root is None:
        return Node(value)
    if value < root.value:
        root.left = insert(root.left, value)
    else:
        root.right = insert(root.right, value)
    updateHeight(root)
    return balance(root)`
    )
  }

  // Search in AVL Tree
  const search = (root: AVLNode | null, value: number): AVLNode | null => {
    if (!root || root.value === value) return root
    if (value < root.value) return search(root.left, value)
    return search(root.right, value)
  }

  const handleSearch = () => {
    if (!searchValue) return
    const numericValue = parseInt(searchValue)
    if (isNaN(numericValue)) return
    const result = search(tree, numericValue)
    setFoundNode(result)
    setSearchValue('')
    
    setPythonCode(
`# Search in AVL Tree
def search(root, value):
    if root is None or root.value == value:
        return root
    if value < root.value:
        return search(root.left, value)
    return search(root.right, value)`
    )
  }

  // Find minimum value node
  const findMin = (root: AVLNode): AVLNode => {
    while (root.left) {
      root = root.left
    }
    return root
  }

  // Delete from AVL Tree
  const deleteNode = (root: AVLNode | null, value: number): AVLNode | null => {
    if (!root) return root

    if (value < root.value) {
      root.left = deleteNode(root.left, value)
    } else if (value > root.value) {
      root.right = deleteNode(root.right, value)
    } else {
      if (!root.left) return root.right
      if (!root.right) return root.left

      const minRight = findMin(root.right)
      root.value = minRight.value
      root.right = deleteNode(root.right, minRight.value)
    }

    updateHeight(root)
    return balance(root)
  }

  const handleDelete = () => {
    if (!deleteValue) return
    const numericValue = parseInt(deleteValue)
    if (isNaN(numericValue)) return
    const newRoot = deleteNode(tree, numericValue)
    setTree(newRoot ? { ...newRoot } : null)
    setDeleteValue('')
    setFoundNode(null)

    setPythonCode(
`# Delete from AVL Tree
def deleteNode(root, value):
    if root is None:
        return root
    if value < root.value:
        root.left = deleteNode(root.left, value)
    elif value > root.value:
        root.right = deleteNode(root.right, value)
    else:
        if root.left is None:
            return root.right
        elif root.right is None:
            return root.left
        minRight = findMin(root.right)
        root.value = minRight.value
        root.right = deleteNode(root.right, minRight.value)
    updateHeight(root)
    return balance(root)`
    )
  }

  // Render tree
  const renderTree = (node: AVLNode | null): JSX.Element | null => {
    if (!node) return null

    return (
      <div className="flex flex-col items-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          transition={{ duration: 0.3 }}
          className={`bg-white border-2 ${foundNode === node ? 'border-green-500' : 'border-blue-500'} rounded-full w-14 h-14 flex items-center justify-center text-lg font-semibold shadow-lg`}
        >
          {node.value}
        </motion.div>

        {(node.left || node.right) && (
          <div className="flex justify-between w-full mt-2">
            <div className="flex-1 flex justify-end pr-2">
              {renderTree(node.left)}
            </div>
            <div className="flex-1 flex justify-start pl-2">
              {renderTree(node.right)}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
      <h1 className="text-4xl font-bold text-indigo-700 mb-6">AVL Tree Visualizer 🌳</h1>

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

      {/* Search */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={searchValue}
          onChange={e => setSearchValue(e.target.value)}
          placeholder="Search value"
          className="border px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-300"
        />
        <button
          onClick={handleSearch}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md shadow transition"
        >
          Search
        </button>
      </div>

      {/* Delete */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={deleteValue}
          onChange={e => setDeleteValue(e.target.value)}
          placeholder="Delete value"
          className="border px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-300"
        />
        <button
          onClick={handleDelete}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md shadow transition"
        >
          Delete
        </button>
      </div>

      {/* Tree rendering */}
      <div className="flex justify-center overflow-auto mb-10 min-w-full">
        {tree ? renderTree(tree) : (
          <div className="text-gray-400 italic">No nodes yet. Insert to build your AVL tree!</div>
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

export default AVLTree
