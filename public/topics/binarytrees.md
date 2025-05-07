# 🌳 Binary Trees

**Difficulty:** Medium

---

## Concepts

### What is a Binary Tree?
- A **Binary Tree** is a **hierarchical** data structure.
- Every **node** has:
  - **At most 2 children**: Left Child and Right Child.
  
It’s called "binary" because each node can branch into two.

---

## Real-World Analogy

Think of a **family tree** 👪:
- Each person (node) can have up to two direct children (left and right).
- Relationships are hierarchical — **parent → child**.

---

## Node Structure

```python
class Node:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None
```

---

## Binary Tree Structure

```python
class BinaryTree:
    def __init__(self):
        self.root = None
```

---

## Basic Operations

### 1. Insertion (Manual for simplicity)

```python
def insert_left(self, current_node, value):
    if current_node.left is None:
        current_node.left = Node(value)
    else:
        new_node = Node(value)
        new_node.left = current_node.left
        current_node.left = new_node

def insert_right(self, current_node, value):
    if current_node.right is None:
        current_node.right = Node(value)
    else:
        new_node = Node(value)
        new_node.right = current_node.right
        current_node.right = new_node
```
(Usually automated during BST, heap building — here it's manual.)

---

### 2. Traversals

#### a) Preorder Traversal (Root → Left → Right)

```python
def preorder(self, node):
    if node:
        print(node.value, end=" ")
        self.preorder(node.left)
        self.preorder(node.right)
```
🔹 **Use Case:** Copying a tree.

---

#### b) Inorder Traversal (Left → Root → Right)

```python
def inorder(self, node):
    if node:
        self.inorder(node.left)
        print(node.value, end=" ")
        self.inorder(node.right)
```
🔹 **Use Case:** Getting sorted data in Binary Search Trees.

---

#### c) Postorder Traversal (Left → Right → Root)

```python
def postorder(self, node):
    if node:
        self.postorder(node.left)
        self.postorder(node.right)
        print(node.value, end=" ")
```
🔹 **Use Case:** Deleting a tree safely.

---

#### d) Level Order Traversal (Breadth First)

```python
from collections import deque

def level_order(self):
    if not self.root:
        return
    queue = deque([self.root])
    while queue:
        current = queue.popleft()
        print(current.value, end=" ")
        if current.left:
            queue.append(current.left)
        if current.right:
            queue.append(current.right)
```
🔹 **Use Case:** Finding minimum depth, BFS problems.

---

## Full Binary Tree Class (Python)

```python
class Node:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None

class BinaryTree:
    def __init__(self):
        self.root = None

    def insert_left(self, current_node, value):
        if current_node.left is None:
            current_node.left = Node(value)
        else:
            new_node = Node(value)
            new_node.left = current_node.left
            current_node.left = new_node

    def insert_right(self, current_node, value):
        if current_node.right is None:
            current_node.right = Node(value)
        else:
            new_node = Node(value)
            new_node.right = current_node.right
            current_node.right = new_node

    def preorder(self, node):
        if node:
            print(node.value, end=" ")
            self.preorder(node.left)
            self.preorder(node.right)

    def inorder(self, node):
        if node:
            self.inorder(node.left)
            print(node.value, end=" ")
            self.inorder(node.right)

    def postorder(self, node):
        if node:
            self.postorder(node.left)
            self.postorder(node.right)
            print(node.value, end=" ")

    def level_order(self):
        from collections import deque
        if not self.root:
            return
        queue = deque([self.root])
        while queue:
            current = queue.popleft()
            print(current.value, end=" ")
            if current.left:
                queue.append(current.left)
            if current.right:
                queue.append(current.right)

# Example Usage
bt = BinaryTree()
bt.root = Node(1)
bt.root.left = Node(2)
bt.root.right = Node(3)
bt.root.left.left = Node(4)
bt.root.left.right = Node(5)

print("Inorder:")
bt.inorder(bt.root)  # 4 2 5 1 3
```

---

## Time Complexities (Summary)

| Operation                | Time Complexity |
|---------------------------|-----------------|
| Insertion (Manual)        | O(1) (for direct link) |
| Traversals (Pre, In, Post, Level Order) | O(n) |

Where `n = number of nodes`.

---

## Types of Binary Trees

| Type               | Description                                    |
|--------------------|------------------------------------------------|
| Full Binary Tree   | Every node has 0 or 2 children.               |
| Perfect Binary Tree| All interior nodes have 2 children and all leaves are at same level. |
| Complete Binary Tree| All levels filled except possibly last level, filled left to right. |
| Balanced Binary Tree| Height difference between left and right is at most 1 for all nodes. |
| Degenerate (Skewed) Tree | Tree looks like a linked list (worst case). |

---

## Advantages of Binary Trees

✅ **Hierarchical structure** represents many real-world scenarios.  
✅ **Efficient operations** like searching (especially with Binary Search Trees).  
✅ **Traversal flexibility** (preorder, inorder, postorder, level-order).  
✅ **Foundations** for heaps, expression parsing, databases.

---

## Disadvantages of Binary Trees

❌ **Unbalanced trees** can degenerate into linked lists (O(n) search).  
❌ **Difficult insertion rules** for some trees (AVL, Red-Black).  
❌ **Requires careful memory management** (recursive traversal can cause stack overflow).

---

## Applications of Binary Trees

📌 **Hierarchical storage:** Folder systems, family trees.  
📌 **Expression evaluation:** Syntax trees in compilers.  
📌 **Routing algorithms:** Network paths.  
📌 **Binary Search Trees (BSTs):** Fast lookup.  
📌 **Heaps:** Priority queues, heap sort.

---

## Quick Visualization 📈

```
        1
       / \
      2   3
     / \
    4   5
```

- **Root:** 1
- **Left Subtree:** 2 → 4, 5
- **Right Subtree:** 3

---

# Conclusion

- Binary Trees are a **fundamental** data structure to master.
- They form the basis for **heaps**, **search trees**, **syntax trees**, and **network structures**.
- Understand **traversals**, **types**, and **balancing** to move toward more advanced trees like **AVL**, **Red-Black**, and **Segment Trees**.

---

# ✅ Pro Tip

👉 Whenever you hear "**hierarchical relationship**" or "**structured recursion**,"  
🔵 **Think Binary Trees first!**

---

# 📚 End of Binary Trees Guide 📚✨

