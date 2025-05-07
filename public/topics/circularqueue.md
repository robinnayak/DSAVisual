# 📚 Circular Queue

**Difficulty:** Medium

---

## Concepts

### What is a Circular Queue?
- A **Circular Queue** is a **linear data structure** that treats the **queue as circular** instead of linear.
- The **last position** connects back to the **first position** to form a **circle**.
- It **avoids memory wastage** that occurs in a simple queue when elements are dequeued.

---

## Real-World Analogy

Imagine a **circular race track** 🏎️:
- Cars keep moving around in circles.
- If the track is full, new cars must wait.
- As soon as one car leaves, a new car can enter the freed spot.

✅ Efficient use of space without shifting elements!

---

## Circular Queue Operations

| Operation     | Description                                               |
|---------------|------------------------------------------------------------|
| Enqueue       | Add an element at the rear (considering wrap-around).       |
| Dequeue       | Remove the element from the front (considering wrap-around).|
| Peek / Front  | View the front element without removing it.                 |
| isEmpty       | Check if the queue is empty.                                |
| isFull        | Check if the queue is full.                                 |

---

## Key Properties

- `front` → Index pointing to the first element.
- `rear` → Index pointing to the last element.
- **Wrap Around**: When rear (or front) reaches the end, it goes back to index `0`.

---

## Circular Queue Structure

```python
class CircularQueue:
    def __init__(self, size):
        self.size = size
        self.queue = [None] * size
        self.front = -1
        self.rear = -1
```

---

## Basic Operations

### 1. isEmpty

Check if the queue is empty.

```python
def is_empty(self):
    return self.front == -1
```
**Time Complexity:** `O(1)`

---

### 2. isFull

Check if the queue is full.

```python
def is_full(self):
    return (self.rear + 1) % self.size == self.front
```
**Time Complexity:** `O(1)`

---

### 3. Enqueue

Add an element, considering circular behavior.

```python
def enqueue(self, value):
    if self.is_full():
        print("Queue is Full!")
        return

    if self.is_empty():
        self.front = 0

    self.rear = (self.rear + 1) % self.size
    self.queue[self.rear] = value
```
**Time Complexity:** `O(1)`

---

### 4. Dequeue

Remove an element from the front.

```python
def dequeue(self):
    if self.is_empty():
        print("Queue is Empty!")
        return None

    removed_value = self.queue[self.front]
    if self.front == self.rear:  # Only one element left
        self.front = -1
        self.rear = -1
    else:
        self.front = (self.front + 1) % self.size

    return removed_value
```
**Time Complexity:** `O(1)`

---

### 5. Peek (Front)

View the front element.

```python
def peek(self):
    if self.is_empty():
        return None
    return self.queue[self.front]
```
**Time Complexity:** `O(1)`

---

## Full Circular Queue Class (Python)

```python
class CircularQueue:
    def __init__(self, size):
        self.size = size
        self.queue = [None] * size
        self.front = -1
        self.rear = -1

    def is_empty(self):
        return self.front == -1

    def is_full(self):
        return (self.rear + 1) % self.size == self.front

    def enqueue(self, value):
        if self.is_full():
            print("Queue is Full!")
            return

        if self.is_empty():
            self.front = 0

        self.rear = (self.rear + 1) % self.size
        self.queue[self.rear] = value

    def dequeue(self):
        if self.is_empty():
            print("Queue is Empty!")
            return None

        removed_value = self.queue[self.front]

        if self.front == self.rear:  # Only one element
            self.front = -1
            self.rear = -1
        else:
            self.front = (self.front + 1) % self.size

        return removed_value

    def peek(self):
        if self.is_empty():
            return None
        return self.queue[self.front]

    def display(self):
        if self.is_empty():
            print("Queue is Empty!")
            return

        print("Queue elements:", end=" ")
        i = self.front
        while True:
            print(self.queue[i], end=" ")
            if i == self.rear:
                break
            i = (i + 1) % self.size
        print()
        
# Example Usage
cq = CircularQueue(5)
cq.enqueue(10)
cq.enqueue(20)
cq.enqueue(30)
cq.enqueue(40)
cq.display()     # 10 20 30 40
cq.dequeue()
cq.dequeue()
cq.display()     # 30 40
cq.enqueue(50)
cq.enqueue(60)
cq.enqueue(70)   # fills the queue
cq.display()     # 30 40 50 60 70
```

---

## Time Complexities (Summary)

| Operation     | Time Complexity |
|---------------|-----------------|
| Enqueue       | O(1)             |
| Dequeue       | O(1)             |
| Peek          | O(1)             |
| isEmpty       | O(1)             |
| isFull        | O(1)             |

---

## Advantages of Circular Queue

✅ **Efficient Memory Usage:** No wastage of space after dequeuing.  
✅ **Constant Time Operations:** All operations are O(1).  
✅ **Perfect for Fixed Size Buffers:** Like network data packets, CPU scheduling.

---

## Disadvantages of Circular Queue

❌ **Fixed Size:** Needs pre-defined size; cannot grow dynamically.  
❌ **Complex Management:** Slightly tricky pointer updates compared to a simple queue.

---

## Applications of Circular Queue

📌 **Memory Buffers (e.g., streaming video/audio)**  
📌 **CPU Scheduling Algorithms**  
📌 **Traffic System Management**  
📌 **Real-Time Systems where limited resources are re-used**

---

## Quick Visualization 📈

```
[70] [20] [30] [40] [50]  (size 5)
  ↑                   ↑
 front               rear
```

After wrapping around, enqueue operations continue from index `0`.

---

# Conclusion

- **Circular Queue** maximizes memory efficiency by wrapping around.
- Best for **fixed-size scenarios** where constant addition and removal happen.
- Proper understanding helps in **buffer management** and **real-time systems**.

---

# ✅ Bonus Tip

👉 If the question mentions:
- **Limited memory**
- **Repeating cycle**
- **Buffer or ring**

🔵 **Think about Circular Queue immediately!**

---

# 📚 End of Circular Queue Guide 📚✨

