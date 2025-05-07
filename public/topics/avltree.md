# 🌳 AVL Tree (Adelson-Velsky and Landis Tree)

**Difficulty:** Hard

---

## Concepts

### What is an AVL Tree?
- An **AVL Tree** is a **self-balancing binary search tree (BST)**.
- After every insertion or deletion, it ensures that the **balance factor** is **-1, 0, or +1** at every node.
- If not, it **performs rotations** to rebalance itself.

### Balance Factor
- **Balance Factor (BF)** = `Height(Left Subtree) - Height(Right Subtree)`
- Valid BF values are `-1, 0, 1`.

---

## Real-World Analogy

Think of **AVL Trees** like a **tightrope walker** 🎪:
- If the walker (tree) leans too much left or right (imbalance), **adjustments** (rotations) are made to bring them back to center for balance.

---

## Node Structure

```python
class Node:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None
        self.height = 1  # New node is initially at height 1
```

---

## AVL Tree Structure

```python
class AVLTree:
    def __init__(self):
        self.root = None
```

---

## Basic Operations

### 1. Get Height

```python
def get_height(self, node):
    if not node:
        return 0
    return node.height
```

---

### 2. Get Balance Factor

```python
def get_balance(self, node):
    if not node:
        return 0
    return self.get_height(node.left) - self.get_height(node.right)
```

---

### 3. Rotations

#### a) Right Rotation (for left-heavy)

```python
def right_rotate(self, z):
    y = z.left
    T3 = y.right

    # Perform rotation
    y.right = z
    z.left = T3

    # Update heights
    z.height = 1 + max(self.get_height(z.left), self.get_height(z.right))
    y.height = 1 + max(self.get_height(y.left), self.get_height(y.right))

    # Return new root
    return y
```

---

#### b) Left Rotation (for right-heavy)

```python
def left_rotate(self, z):
    y = z.right
    T2 = y.left

    # Perform rotation
    y.left = z
    z.right = T2

    # Update heights
    z.height = 1 + max(self.get_height(z.left), self.get_height(z.right))
    y.height = 1 + max(self.get_height(y.left), self.get_height(y.right))

    # Return new root
    return y
```

---

### 4. Insertion

```python
def insert(self, node, key):
    # 1. Perform normal BST insertion
    if not node:
        return Node(key)
    elif key < node.value:
        node.left = self.insert(node.left, key)
    else:
        node.right = self.insert(node.right, key)

    # 2. Update height
    node.height = 1 + max(self.get_height(node.left), self.get_height(node.right))

    # 3. Get balance factor
    balance = self.get_balance(node)

    # 4. Balance the tree
    # Case 1 - Left Left
    if balance > 1 and key < node.left.value:
        return self.right_rotate(node)

    # Case 2 - Right Right
    if balance < -1 and key > node.right.value:
        return self.left_rotate(node)

    # Case 3 - Left Right
    if balance > 1 and key > node.left.value:
        node.left = self.left_rotate(node.left)
        return self.right_rotate(node)

    # Case 4 - Right Left
    if balance < -1 and key < node.right.value:
        node.right = self.right_rotate(node.right)
        return self.left_rotate(node)

    return node
```

---

### 5. Preorder Traversal

```python
def preorder(self, node):
    if not node:
        return
    print(node.value, end=" ")
    self.preorder(node.left)
    self.preorder(node.right)
```

---

## Full AVL Tree Class (Python)

```python
class Node:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None
        self.height = 1

class AVLTree:
    def __init__(self):
        self.root = None

    def get_height(self, node):
        if not node:
            return 0
        return node.height

    def get_balance(self, node):
        if not node:
            return 0
        return self.get_height(node.left) - self.get_height(node.right)

    def right_rotate(self, z):
        y = z.left
        T3 = y.right

        y.right = z
        z.left = T3

        z.height = 1 + max(self.get_height(z.left), self.get_height(z.right))
        y.height = 1 + max(self.get_height(y.left), self.get_height(y.right))

        return y

    def left_rotate(self, z):
        y = z.right
        T2 = y.left

        y.left = z
        z.right = T2

        z.height = 1 + max(self.get_height(z.left), self.get_height(z.right))
        y.height = 1 + max(self.get_height(y.left), self.get_height(y.right))

        return y

    def insert(self, node, key):
        if not node:
            return Node(key)
        elif key < node.value:
            node.left = self.insert(node.left, key)
        else:
            node.right = self.insert(node.right, key)

        node.height = 1 + max(self.get_height(node.left), self.get_height(node.right))

        balance = self.get_balance(node)

        # Balance the tree
        if balance > 1 and key < node.left.value:
            return self.right_rotate(node)
        if balance < -1 and key > node.right.value:
            return self.left_rotate(node)
        if balance > 1 and key > node.left.value:
            node.left = self.left_rotate(node.left)
            return self.right_rotate(node)
        if balance < -1 and key < node.right.value:
            node.right = self.right_rotate(node.right)
            return self.left_rotate(node)

        return node

    def preorder(self, node):
        if not node:
            return
        print(node.value, end=" ")
        self.preorder(node.left)
        self.preorder(node.right)

# Example Usage
avl = AVLTree()
avl.root = avl.insert(avl.root, 10)
avl.root = avl.insert(avl.root, 20)
avl.root = avl.insert(avl.root, 30)
avl.root = avl.insert(avl.root, 40)
avl.root = avl.insert(avl.root, 50)
avl.root = avl.insert(avl.root, 25)

print("Preorder Traversal:")
avl.preorder(avl.root)  # Output will be balanced
```

---

## Time Complexities (Summary)

| Operation          | Time Complexity |
|---------------------|-----------------|
| Insertion           | O(log n)         |
| Deletion (not covered yet) | O(log n)   |
| Search              | O(log n)         |

AVL Trees maintain `O(log n)` height, ensuring efficient operations.

---

## Advantages of AVL Trees

✅ **Always balanced** → Search is always fast.  
✅ **Guaranteed O(log n) operations** for insertion, deletion, and search.  
✅ **Foundation for databases and file indexing systems.**

---

## Disadvantages of AVL Trees

❌ **Rotations overhead:** Insertion and deletion are slower compared to simple BSTs because of rotations.  
❌ **Complexity:** Implementation is more difficult than standard BST.

---

## Applications of AVL Trees

📌 **Databases:** To maintain sorted data dynamically.  
📌 **Memory Management:** OS allocates resources using AVL Trees.  
📌 **File Systems:** Indexing large files efficiently.  
📌 **Network Routing Algorithms:** Quick lookups for optimal paths.

---

## Quick Visualization 📈

After inserting 10, 20, 30:

```
    20
   /  \
 10    30
```

Perfectly balanced after rotations! ✨

---

# Conclusion

- AVL Trees **auto-balance** themselves, preventing the worst-case O(n) performance of regular BSTs.
- They are **crucial** in situations where fast retrieval **and** frequent updates happen.
- Learning AVL Trees gives you the **foundational skills** to move onto advanced structures like **Red-Black Trees** and **B-Trees**.

---

# ✅ Pro Tip

👉 If a **binary search tree must stay balanced at all times** ➔ **Think AVL Trees first!**

---

# 📚 End of AVL Tree Guide 📚✨

