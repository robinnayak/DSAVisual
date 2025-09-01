# 🚶‍♂️ Queue - First In, First Out (FIFO)

**Difficulty:** 🟢 Easy  
**Prerequisites:** Basic programming concepts, arrays  
**Time to Learn:** 35-45 minutes

---

## 🎯 What You'll Learn

By the end of this guide, you'll understand:
- What queues are and how they work
- FIFO principle and its applications
- Core queue operations and implementations
- Different types of queues
- When to use queues in problem-solving

---

## 📚 What is a Queue?

A **queue** is a **linear data structure** that follows the **FIFO (First In, First Out)** principle. Elements are added at one end (**rear/back**) and removed from the other end (**front**).

### Key Characteristics:
- **FIFO ordering** - first element added is the first to be removed
- **Two access points** - front (for removal) and rear (for insertion)
- **Dynamic size** - can grow/shrink during runtime
- **Fair processing** - maintains order of arrival

---

## 🌟 Real-World Analogy

Think of a **line at a coffee shop** ☕:

```
Front                                    Rear
  ↓                                        ↓
[👤] [👤] [👤] [👤] [👤] ← [New Customer]
 ↑                           ↑
Gets served                Joins line
(Dequeue)                  (Enqueue)
```

- **People join** at the back of the line (enqueue)
- **First person** in line gets served first (dequeue)
- **Fair system** - no cutting in line!
- **Order preserved** - arrival order = service order

✅ **FIFO in Action:** First customer to arrive is the first to be served!

---

## 🏗️ Queue Structure & Implementation

### Array-Based Implementation (Python)

```python
class ArrayQueue:
    def __init__(self, capacity=10):
        self.capacity = capacity
        self.queue = [None] * capacity
        self.front = 0     # Index of front element
        self.rear = -1     # Index of rear element
        self.size = 0      # Current number of elements
    
    def is_empty(self):
        """Check if queue is empty"""
        return self.size == 0
    
    def is_full(self):
        """Check if queue is full"""
        return self.size == self.capacity
    
    def get_size(self):
        """Get number of elements"""
        return self.size
    
    def enqueue(self, item):
        """Add element to rear of queue"""
        if self.is_full():
            raise OverflowError("Queue is full")
        
        self.rear = (self.rear + 1) % self.capacity  # Circular increment
        self.queue[self.rear] = item
        self.size += 1
        return item
    
    def dequeue(self):
        """Remove and return front element"""
        if self.is_empty():
            raise IndexError("Queue is empty")
        
        item = self.queue[self.front]
        self.queue[self.front] = None  # Optional cleanup
        self.front = (self.front + 1) % self.capacity  # Circular increment
        self.size -= 1
        return item
    
    def peek_front(self):
        """View front element without removing"""
        if self.is_empty():
            raise IndexError("Queue is empty")
        
        return self.queue[self.front]
    
    def peek_rear(self):
        """View rear element without removing"""
        if self.is_empty():
            raise IndexError("Queue is empty")
        
        return self.queue[self.rear]
    
    def display(self):
        """Print queue contents"""
        if self.is_empty():
            print("Queue is empty")
            return
        
        print("Queue (front to rear):")
        elements = []
        for i in range(self.size):
            index = (self.front + i) % self.capacity
            elements.append(str(self.queue[index]))
        print(" ← ".join(elements))
```

### Dynamic List Implementation (Python)

```python
class ListQueue:
    def __init__(self):
        self.queue = []  # Use Python list as underlying structure
    
    def is_empty(self):
        """Check if queue is empty"""
        return len(self.queue) == 0
    
    def get_size(self):
        """Get number of elements"""
        return len(self.queue)
    
    def enqueue(self, item):
        """Add element to rear of queue"""
        self.queue.append(item)
        return item
    
    def dequeue(self):
        """Remove and return front element"""
        if self.is_empty():
            raise IndexError("Queue is empty")
        
        return self.queue.pop(0)  # Remove from front (O(n) operation)
    
    def peek_front(self):
        """View front element without removing"""
        if self.is_empty():
            raise IndexError("Queue is empty")
        
        return self.queue[0]
    
    def peek_rear(self):
        """View rear element without removing"""
        if self.is_empty():
            raise IndexError("Queue is empty")
        
        return self.queue[-1]
    
    def display(self):
        """Print queue contents"""
        if self.is_empty():
            print("Queue is empty")
            return
        
        print("Queue (front to rear):")
        print(" ← ".join(map(str, self.queue)))
```

### Linked List Implementation

```python
class QueueNode:
    def __init__(self, data):
        self.data = data
        self.next = None

class LinkedQueue:
    def __init__(self):
        self.front = None  # Points to front node
        self.rear = None   # Points to rear node
        self.size = 0
    
    def is_empty(self):
        """Check if queue is empty"""
        return self.front is None
    
    def get_size(self):
        """Get number of elements"""
        return self.size
    
    def enqueue(self, item):
        """Add element to rear of queue"""
        new_node = QueueNode(item)
        
        if self.is_empty():
            self.front = self.rear = new_node
        else:
            self.rear.next = new_node
            self.rear = new_node
        
        self.size += 1
        return item
    
    def dequeue(self):
        """Remove and return front element"""
        if self.is_empty():
            raise IndexError("Queue is empty")
        
        item = self.front.data
        self.front = self.front.next
        
        if self.front is None:  # Queue became empty
            self.rear = None
        
        self.size -= 1
        return item
    
    def peek_front(self):
        """View front element without removing"""
        if self.is_empty():
            raise IndexError("Queue is empty")
        
        return self.front.data
    
    def peek_rear(self):
        """View rear element without removing"""
        if self.is_empty():
            raise IndexError("Queue is empty")
        
        return self.rear.data
    
    def display(self):
        """Print queue contents"""
        if self.is_empty():
            print("Queue is empty")
            return
        
        print("Queue (front to rear):")
        current = self.front
        elements = []
        while current:
            elements.append(str(current.data))
            current = current.next
        print(" ← ".join(elements))
```

---

## ⚡ Core Operations

### 1. 📥 **Enqueue Operation**

Add an element to the rear of the queue.

```python
def enqueue_demo():
    queue = ListQueue()
    
    # Enqueue elements
    queue.enqueue(10)  # Queue: [10]
    queue.enqueue(20)  # Queue: [10, 20]
    queue.enqueue(30)  # Queue: [10, 20, 30]
    
    print(f"Queue size: {queue.get_size()}")  # Output: 3
    queue.display()  # Output: 10 ← 20 ← 30
    
    # Visual representation:
    # Front                    Rear
    #   ↓                        ↓
    # [10] → [20] → [30] → (Next customer)

enqueue_demo()
```

**⏱️ Time Complexity:** `O(1)` - Constant time  
**💾 Space Complexity:** `O(1)`

---

### 2. 📤 **Dequeue Operation**

Remove and return the front element from the queue.

```python
def dequeue_demo():
    queue = ListQueue()
    queue.enqueue(10)
    queue.enqueue(20)
    queue.enqueue(30)
    
    # Dequeue elements
    first_element = queue.dequeue()  # Returns 10
    print(f"Dequeued: {first_element}")  # Output: 10
    
    second_element = queue.dequeue()  # Returns 20
    print(f"Dequeued: {second_element}")  # Output: 20
    
    print(f"Remaining queue size: {queue.get_size()}")  # Output: 1
    queue.display()  # Shows only [30]

dequeue_demo()
```

**⏱️ Time Complexity:** 
- Array/Linked List: `O(1)` - Constant time
- Python List: `O(n)` - Linear time (due to shifting)

**💾 Space Complexity:** `O(1)`

---

### 3. 👀 **Peek Operations**

View elements without removing them.

```python
def peek_demo():
    queue = ListQueue()
    queue.enqueue(10)
    queue.enqueue(20)
    queue.enqueue(30)
    
    # Peek at front and rear
    front_element = queue.peek_front()  # Returns 10
    rear_element = queue.peek_rear()    # Returns 30
    
    print(f"Front element: {front_element}")  # Output: 10
    print(f"Rear element: {rear_element}")    # Output: 30
    
    print(f"Queue size unchanged: {queue.get_size()}")  # Output: 3
    queue.display()  # Still shows [10, 20, 30]

peek_demo()
```

**⏱️ Time Complexity:** `O(1)` - Constant time  
**💾 Space Complexity:** `O(1)`

---

### 4. ❓ **Helper Operations**

```python
def helper_operations_demo():
    queue = ListQueue()
    
    # Check if empty
    print(f"Is empty: {queue.is_empty()}")  # Output: True
    
    # Add some elements
    queue.enqueue(10)
    queue.enqueue(20)
    
    # Check size
    print(f"Size: {queue.get_size()}")  # Output: 2
    
    # Check if empty again
    print(f"Is empty: {queue.is_empty()}")  # Output: False
    
    # Clear queue
    while not queue.is_empty():
        queue.dequeue()
    
    print(f"After clearing - Is empty: {queue.is_empty()}")  # Output: True

helper_operations_demo()
```

---

## 📊 Time Complexity Summary

| Operation | Array Implementation | List Implementation | Linked List Implementation |
|-----------|---------------------|--------------------|-----------------------------|
| **Enqueue** | O(1) | O(1)* | O(1) |
| **Dequeue** | O(1) | O(n) | O(1) |
| **Peek Front** | O(1) | O(1) | O(1) |
| **Peek Rear** | O(1) | O(1) | O(1) |
| **IsEmpty** | O(1) | O(1) | O(1) |
| **Size** | O(1) | O(1) | O(1) |

> *Amortized O(1) for dynamic arrays; O(n) for dequeue with Python lists due to shifting

**💾 Space Complexity:** O(n) where n is the number of elements

---

## 🔄 Types of Queues

### 1. **Simple Queue** (What we've covered)
```
Front                    Rear
  ↓                        ↓
[A] → [B] → [C] → [D] → (Insert here)
```

### 2. **Circular Queue**
```python
class CircularQueue:
    def __init__(self, capacity):
        self.capacity = capacity
        self.queue = [None] * capacity
        self.front = 0
        self.rear = 0
        self.size = 0
    
    def enqueue(self, item):
        if self.size == self.capacity:
            raise OverflowError("Queue is full")
        
        self.queue[self.rear] = item
        self.rear = (self.rear + 1) % self.capacity
        self.size += 1
    
    def dequeue(self):
        if self.size == 0:
            raise IndexError("Queue is empty")
        
        item = self.queue[self.front]
        self.front = (self.front + 1) % self.capacity
        self.size -= 1
        return item
```

### 3. **Double-Ended Queue (Deque)**
```python
from collections import deque

# Built-in deque supports operations at both ends
dq = deque()

# Add to front/rear
dq.appendleft(1)    # Add to front
dq.append(2)        # Add to rear

# Remove from front/rear
dq.popleft()        # Remove from front
dq.pop()            # Remove from rear
```

### 4. **Priority Queue**
```python
import heapq

class PriorityQueue:
    def __init__(self):
        self.heap = []
    
    def enqueue(self, item, priority):
        heapq.heappush(self.heap, (priority, item))
    
    def dequeue(self):
        if self.heap:
            return heapq.heappop(self.heap)[1]
        raise IndexError("Queue is empty")
```

---

## 🎯 Real-World Applications

### 1. **Task Scheduling**
```python
class TaskScheduler:
    def __init__(self):
        self.task_queue = LinkedQueue()
    
    def add_task(self, task):
        """Add task to queue"""
        self.task_queue.enqueue(task)
        print(f"Task '{task}' added to queue")
    
    def process_next_task(self):
        """Process next task in queue"""
        if not self.task_queue.is_empty():
            task = self.task_queue.dequeue()
            print(f"Processing task: '{task}'")
            return task
        print("No tasks to process")
        return None
    
# Usage
scheduler = TaskScheduler()
scheduler.add_task("Send email")
scheduler.add_task("Generate report")
scheduler.add_task("Backup database")

scheduler.process_next_task()  # Processes "Send email" first
```

### 2. **Breadth-First Search (BFS)**
```python
def bfs_traversal(graph, start):
    """BFS using queue"""
    visited = set()
    queue = LinkedQueue()
    
    queue.enqueue(start)
    visited.add(start)
    
    while not queue.is_empty():
        current = queue.dequeue()
        print(current, end=" ")
        
        for neighbor in graph[current]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.enqueue(neighbor)

# Example graph
graph = {
    'A': ['B', 'C'],
    'B': ['D', 'E'],
    'C': ['F'],
    'D': [],
    'E': ['F'],
    'F': []
}

bfs_traversal(graph, 'A')  # Output: A B C D E F
```

### 3. **Buffer for Data Streams**
```python
class StreamBuffer:
    def __init__(self, max_size=100):
        self.buffer = LinkedQueue()
        self.max_size = max_size
    
    def add_data(self, data):
        """Add data to buffer"""
        if self.buffer.get_size() >= self.max_size:
            # Remove oldest data when buffer is full
            self.buffer.dequeue()
        
        self.buffer.enqueue(data)
    
    def process_batch(self, batch_size=10):
        """Process batch of data"""
        batch = []
        for _ in range(min(batch_size, self.buffer.get_size())):
            batch.append(self.buffer.dequeue())
        return batch

# Usage
buffer = StreamBuffer(max_size=5)
for i in range(10):
    buffer.add_data(f"data_{i}")

print(buffer.process_batch(3))  # Processes oldest 3 items
```

### 4. **Print Queue Management**
```python
class PrintJob:
    def __init__(self, doc_name, pages, priority=1):
        self.doc_name = doc_name
        self.pages = pages
        self.priority = priority
    
    def __str__(self):
        return f"Job: {self.doc_name} ({self.pages} pages)"

class PrintQueue:
    def __init__(self):
        self.queue = LinkedQueue()
    
    def submit_job(self, job):
        """Submit print job"""
        self.queue.enqueue(job)
        print(f"Submitted: {job}")
    
    def process_job(self):
        """Process next print job"""
        if not self.queue.is_empty():
            job = self.queue.dequeue()
            print(f"Printing: {job}")
            return job
        print("No jobs in queue")
        return None

# Usage
printer = PrintQueue()
printer.submit_job(PrintJob("Report.pdf", 10))
printer.submit_job(PrintJob("Invoice.pdf", 2))
printer.process_job()  # Prints "Report.pdf" first
```

---

## ✅ Advantages of Queues

| Advantage | Description |
|-----------|-------------|
| 🎯 **Fair Processing** | First-come, first-served principle |
| 🚀 **Efficient Operations** | O(1) enqueue and dequeue (proper implementation) |
| 📊 **Ordered Processing** | Maintains insertion order |
| 🔧 **Versatile** | Useful for scheduling, buffering, BFS |
| 💡 **Simple Implementation** | Easy to understand and implement |

---

## ❌ Disadvantages of Queues

| Disadvantage | Description |
|--------------|-------------|
| 🚫 **Limited Access** | Can only access front and rear elements |
| 📏 **No Random Access** | Cannot access middle elements directly |
| 🔍 **No Search** | Cannot search efficiently |
| 📊 **No Iteration** | Cannot traverse without dequeuing |

---

## 🎯 When to Use Queues

### ✅ **Perfect for:**
- **Task scheduling** and job processing
- **Breadth-first search** algorithms
- **Data buffering** and streaming
- **Print job management**
- **Process scheduling** in operating systems
- **Handling requests** in web servers

### ❌ **Avoid when:**
- **Random access** to elements needed
- **LIFO behavior** is required (use stack instead)
- **Priority-based processing** needed (use priority queue)
- **Frequent search** operations required

---

## 💡 Common Patterns & Interview Questions

### 1. **Implement Queue using Stacks**
```python
class QueueUsingStacks:
    def __init__(self):
        self.stack1 = []  # For enqueue
        self.stack2 = []  # For dequeue
    
    def enqueue(self, item):
        self.stack1.append(item)
    
    def dequeue(self):
        if not self.stack2:
            while self.stack1:
                self.stack2.append(self.stack1.pop())
        
        if not self.stack2:
            raise IndexError("Queue is empty")
        
        return self.stack2.pop()
```

### 2. **Sliding Window Maximum** (LeetCode Hard)
```python
from collections import deque

def maxSlidingWindow(nums, k):
    """Find maximum in each sliding window"""
    dq = deque()  # Store indices
    result = []
    
    for i, num in enumerate(nums):
        # Remove indices outside window
        while dq and dq[0] <= i - k:
            dq.popleft()
        
        # Remove indices with smaller values
        while dq and nums[dq[-1]] <= num:
            dq.pop()
        
        dq.append(i)
        
        # Add maximum to result
        if i >= k - 1:
            result.append(nums[dq[0]])
    
    return result
```

### 3. **First Non-Repeating Character in Stream**
```python
def firstNonRepeating(stream):
    """Find first non-repeating character in stream"""
    char_count = {}
    queue = LinkedQueue()
    result = []
    
    for char in stream:
        char_count[char] = char_count.get(char, 0) + 1
        queue.enqueue(char)
        
        # Remove repeating characters from front
        while not queue.is_empty() and char_count[queue.peek_front()] > 1:
            queue.dequeue()
        
        # Add result
        if queue.is_empty():
            result.append('#')  # No non-repeating character
        else:
            result.append(queue.peek_front())
    
    return result

# Example: "ABCCAB" → ['A', 'A', 'A', 'B', 'B', '#']
```

---

## 🧪 Practice Problems

### Beginner
1. **Implement queue** using arrays and linked lists
2. **Reverse first K elements** of queue
3. **Check if queue is palindrome**
4. **Generate binary numbers** using queue

### Intermediate
1. **Implement stack using queues**
2. **First negative integer** in sliding window
3. **Circular queue implementation**
4. **Queue using two stacks**

### Advanced
1. **Sliding window maximum**
2. **LRU Cache using queue**
3. **Design hit counter**
4. **Moving average from data stream**

---

## 🎯 Key Takeaways

> **Queues are perfect for FIFO scenarios** and are essential for BFS algorithms, task scheduling, and fair resource allocation.

### Remember:
1. **FIFO principle** - first in, first out
2. **Two access points** - front for removal, rear for insertion
3. **Fair processing** - maintains order of arrival
4. **O(1) operations** with proper implementation
5. **Essential for BFS** and level-order traversals

---

## 🚀 Next Steps

1. **Master basic operations** until they become intuitive
2. **Practice BFS algorithms** using queues
3. **Learn circular queues** for efficient memory usage
4. **Understand priority queues** for advanced scheduling
5. **Explore deque** for double-ended operations

---

## 📖 Additional Resources

- **Visualization:** VisuAlgo Queue, Algorithm Visualizer
- **Practice:** LeetCode Queue problems, HackerRank
- **Theory:** "Introduction to Algorithms" by CLRS
- **Applications:** Operating systems, networking, game development

Remember: **Think FIFO!** When you see problems involving fair processing, scheduling, or level-by-level traversal, consider using a queue. 🎯
