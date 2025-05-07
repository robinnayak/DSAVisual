# 📚 Queue

**Difficulty:** Easy to Medium

---

## Concepts

### What is a Queue?
- A **Queue** is a **linear data structure** that follows the **FIFO** principle:
  - **First In, First Out**  
- The element that is **added first** is the one **removed first**.

---

## Real-World Analogy

Think of a **queue at a ticket counter** 🎟️:
- People stand in line.
- The person who comes first gets served first.
- New people join at the end of the line.

✅ Simple, organized, and fair!

---

## Queue Operations

| Operation     | Description                                     |
|---------------|-------------------------------------------------|
| Enqueue       | Add an element at the rear (end).               |
| Dequeue       | Remove the element from the front.              |
| Peek / Front  | View the front element without removing it.     |
| isEmpty       | Check if the queue is empty.                    |
| Size          | Get the number of elements in the queue.        |

---

## Queue Structure (Using Python List)

```python
class Queue:
    def __init__(self):
        self.queue = []
```

---

## Basic Operations

### 1. Enqueue

Add an element at the end.

```python
def enqueue(self, value):
    self.queue.append(value)
```
**Time Complexity:** `O(1)`

---

### 2. Dequeue

Remove and return the element from the front.

```python
def dequeue(self):
    if self.is_empty():
        return None
    return self.queue.pop(0)
```
**Time Complexity:** `O(n)` (because popping at index 0 shifts elements)

✅ *Tip:* To improve to `O(1)`, use `collections.deque`.

---

### 3. Peek (Front)

Return the front element **without removing** it.

```python
def peek(self):
    if self.is_empty():
        return None
    return self.queue[0]
```
**Time Complexity:** `O(1)`

---

### 4. isEmpty

Check if the queue has no elements.

```python
def is_empty(self):
    return len(self.queue) == 0
```
**Time Complexity:** `O(1)`

---

### 5. Size

Return the number of elements in the queue.

```python
def size(self):
    return len(self.queue)
```
**Time Complexity:** `O(1)`

---

## Full Queue Class (Python)

```python
class Queue:
    def __init__(self):
        self.queue = []

    def enqueue(self, value):
        self.queue.append(value)

    def dequeue(self):
        if self.is_empty():
            return None
        return self.queue.pop(0)

    def peek(self):
        if self.is_empty():
            return None
        return self.queue[0]

    def is_empty(self):
        return len(self.queue) == 0

    def size(self):
        return len(self.queue)

# Example Usage
q = Queue()
q.enqueue(10)
q.enqueue(20)
q.enqueue(30)
print(q.peek())    # 10
print(q.dequeue()) # 10
print(q.peek())    # 20
print(q.size())    # 2
```

---

## Time Complexities (Summary)

| Operation     | Time Complexity (list) | Time Complexity (deque) |
|---------------|-------------------------|--------------------------|
| Enqueue       | O(1)                     | O(1)                     |
| Dequeue       | O(n)                     | O(1)                     |
| Peek          | O(1)                     | O(1)                     |
| isEmpty       | O(1)                     | O(1)                     |
| Size          | O(1)                     | O(1)                     |

---

## Advantages of Queues

✅ **Organized Processing:** Maintains the order of arrival.  
✅ **Useful in Real Systems:** Queues model real-world processes very well.  
✅ **Efficient with deque:** `collections.deque` provides efficient O(1) insertion and deletion.

---

## Disadvantages of Queues

❌ **Slow Dequeue with Lists:** Removing from the front of a list is O(n).  
❌ **Limited Random Access:** Cannot directly access middle elements (must dequeue).

---

## Applications of Queue

📌 **CPU Task Scheduling**  
📌 **Printer Queue**  
📌 **Customer Service Call Center**  
📌 **Breadth-First Search (BFS)** in Trees and Graphs  
📌 **IO Buffers, Data Streaming**

---

## Quick Visualization 📈

```
Front -> 10 -> 20 -> 30 -> Rear
```
- **Enqueue:** Add to rear.
- **Dequeue:** Remove from front.

---

# 📚 Collections.deque (Recommended)

```python
from collections import deque

q = deque()
q.append(10)     # Enqueue
q.append(20)
q.append(30)
print(q[0])      # Peek: 10
q.popleft()      # Dequeue
print(q[0])      # Peek after dequeue: 20
```
✅ Here, both enqueue and dequeue are `O(1)`!

---

# Conclusion

- **Queues** are perfect when **order matters** — **first come, first served**.
- Ideal for:
  - **Task scheduling**
  - **Process management**
  - **Graph Traversal (BFS)**

---
# ✅ Bonus Tip

If the question involves:
- **Order of processing**
- **Service center scenarios**
- **Level-order traversals**

👉 **Immediately think about Queues!**

---

# 🎯 Extra (Small Challenge)

> Implement a **Queue using Linked List** instead of Python’s list!  
It gives better understanding of dynamic memory management. 🚀

---

# 📚 End of Queue Guide 📚✨

---

