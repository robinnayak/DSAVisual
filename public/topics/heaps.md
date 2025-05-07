# ⛰️ Heap (Min-Heap & Max-Heap)

**Difficulty:** Medium

---

## Concepts

### What is a Heap?
- A **Heap** is a **special tree-based** data structure that satisfies the **Heap Property**:
  - **Max-Heap** ➔ Parent node is **greater than or equal** to its children.
  - **Min-Heap** ➔ Parent node is **less than or equal** to its children.

- A heap is **always a complete binary tree** — all levels are filled except possibly the last, which is filled **left to right**.

---

## Real-World Analogy

Think of a **heap** like a **pyramid of VIPs** 🏛️:
- In a **Max-Heap**, the **most important VIP (highest priority)** stands at the top.
- In a **Min-Heap**, the **least important VIP (lowest cost)** stands at the top.

---

## Heap Structure

We usually represent a heap **using an array** (NOT using node classes):

- **Parent Index:** `i`
- **Left Child Index:** `2i + 1`
- **Right Child Index:** `2i + 2`

Example array:

```text
[10, 5, 3, 2, 4]
```
Heap structure:

```
      10
     /  \
    5    3
   / \
  2   4
```

---

## Types of Heaps

| Type      | Parent-Child Relationship    |
|-----------|-------------------------------|
| Max-Heap  | Parent ≥ Child                 |
| Min-Heap  | Parent ≤ Child                 |

---

## Basic Operations

| Operation        | Time Complexity |
|------------------|-----------------|
| Insertion        | O(log n)         |
| Deletion (root)  | O(log n)         |
| Peek (top/root)  | O(1)             |
| Heapify (build)  | O(n)             |

---

## Key Heap Functions

### 1. Insertion

- Add the new element at the end.
- "Bubble up" to restore heap property.

```python
def insert(heap, value):
    heap.append(value)
    i = len(heap) - 1
    while i > 0:
        parent = (i - 1) // 2
        if heap[parent] < heap[i]:  # Max-Heap condition
            heap[parent], heap[i] = heap[i], heap[parent]
            i = parent
        else:
            break
```

---

### 2. Deletion (Remove Root)

- Remove the root (topmost element).
- Move the last element to the root.
- "Bubble down" to restore heap property.

```python
def delete_root(heap):
    if len(heap) == 0:
        return

    last_element = heap.pop()
    if len(heap) == 0:
        return

    heap[0] = last_element
    i = 0

    while True:
        left = 2 * i + 1
        right = 2 * i + 2
        largest = i

        if left < len(heap) and heap[left] > heap[largest]:
            largest = left
        if right < len(heap) and heap[right] > heap[largest]:
            largest = right

        if largest != i:
            heap[i], heap[largest] = heap[largest], heap[i]
            i = largest
        else:
            break
```

---

### 3. Heapify (Build Heap from Array)

```python
def heapify(heap, n, i):
    largest = i
    left = 2 * i + 1
    right = 2 * i + 2

    if left < n and heap[left] > heap[largest]:
        largest = left

    if right < n and heap[right] > heap[largest]:
        largest = right

    if largest != i:
        heap[i], heap[largest] = heap[largest], heap[i]
        heapify(heap, n, largest)

def build_heap(arr):
    n = len(arr)
    for i in range(n // 2 - 1, -1, -1):
        heapify(arr, n, i)
```

---

## Full Heap Example (Max-Heap)

```python
# Max-Heap implementation
class MaxHeap:
    def __init__(self):
        self.heap = []

    def insert(self, value):
        self.heap.append(value)
        i = len(self.heap) - 1
        while i > 0:
            parent = (i - 1) // 2
            if self.heap[parent] < self.heap[i]:
                self.heap[parent], self.heap[i] = self.heap[i], self.heap[parent]
                i = parent
            else:
                break

    def delete_root(self):
        if len(self.heap) == 0:
            return

        last_element = self.heap.pop()
        if len(self.heap) == 0:
            return

        self.heap[0] = last_element
        i = 0

        while True:
            left = 2 * i + 1
            right = 2 * i + 2
            largest = i

            if left < len(self.heap) and self.heap[left] > self.heap[largest]:
                largest = left
            if right < len(self.heap) and self.heap[right] > self.heap[largest]:
                largest = right

            if largest != i:
                self.heap[i], self.heap[largest] = self.heap[largest], self.heap[i]
                i = largest
            else:
                break

    def peek(self):
        if self.heap:
            return self.heap[0]
        return None

    def display(self):
        print(self.heap)

# Example usage
h = MaxHeap()
h.insert(10)
h.insert(20)
h.insert(5)
h.insert(15)
h.display()  # [20, 15, 5, 10]
h.delete_root()
h.display()  # [15, 10, 5]
```

---

## Time Complexities (Summary)

| Operation       | Time Complexity |
|-----------------|-----------------|
| Insertion       | O(log n)         |
| Deletion (root) | O(log n)         |
| Peek (top)      | O(1)             |
| Build Heap      | O(n)             |

---

## Advantages of Heaps

✅ **Fast access to maximum/minimum element.**  
✅ **Efficient insertion and deletion.**  
✅ **Memory efficient** because they are stored as arrays.

---

## Disadvantages of Heaps

❌ **Searching an arbitrary element is slow** (O(n)).  
❌ **Not efficient for ordered traversal** (compared to BSTs).

---

## Applications of Heaps

📌 **Priority Queues:** Always fetch the highest priority task.  
📌 **Heap Sort:** Sorting an array in O(n log n) time.  
📌 **Graph Algorithms:** Like Dijkstra’s shortest path (priority queue).  
📌 **Job Scheduling:** CPU job queues.

---

## Quick Visualization 📈

Heap (Max-Heap) for array [20, 15, 5, 10]:

```
      20
     /  \
   15    5
   / 
 10
```

---

# Conclusion

- Heaps are **perfect** for managing **dynamic priority lists** efficiently.
- **Max-Heaps** → Largest element always on top.
- **Min-Heaps** → Smallest element always on top.
- **Mastering heaps** is critical for solving advanced problems like **Priority Queues, Scheduling, Graphs**!

---

# ✅ Pro Tip

👉 Whenever a problem needs "quick access to min/max elements" with dynamic insertions and deletions ➔ **THINK HEAP** first! 🏔️

---

# 📚 End of Heap Guide 📚✨
