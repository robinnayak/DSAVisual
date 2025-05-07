# 📚 Stack

**Difficulty:** Easy to Medium

---

## Concepts

### What is a Stack?
- A **Stack** is a **linear data structure** that follows the **LIFO** principle:
  - **Last In, First Out**  
- The last element **pushed** (added) into the stack is the first one to be **popped** (removed).

---

## Real-World Analogy

Think of a **stack of plates** 🍽️:
- You add plates one on top of the other (push).
- You remove the topmost plate first (pop).
- You cannot remove a plate from the middle without disturbing the ones above.

✅ Simple and highly efficient for managing data.

---

## Stack Operations

| Operation     | Description                                  |
|---------------|----------------------------------------------|
| Push          | Add an element on the top.                  |
| Pop           | Remove the top element.                     |
| Peek / Top    | View the top element without removing it.   |
| isEmpty       | Check if the stack is empty.                |
| Size          | Get the number of elements.                 |

---

## Stack Structure (Using Python List)

```python
class Stack:
    def __init__(self):
        self.stack = []
```

---

## Basic Operations

### 1. Push

Add an element at the top.

```python
def push(self, value):
    self.stack.append(value)
```
**Time Complexity:** `O(1)`

---

### 2. Pop

Remove and return the top element.

```python
def pop(self):
    if self.is_empty():
        return None
    return self.stack.pop()
```
**Time Complexity:** `O(1)`

---

### 3. Peek (Top)

Return the top element **without removing** it.

```python
def peek(self):
    if self.is_empty():
        return None
    return self.stack[-1]
```
**Time Complexity:** `O(1)`

---

### 4. isEmpty

Check if the stack has no elements.

```python
def is_empty(self):
    return len(self.stack) == 0
```
**Time Complexity:** `O(1)`

---

### 5. Size

Return the number of elements in the stack.

```python
def size(self):
    return len(self.stack)
```
**Time Complexity:** `O(1)`

---

## Full Stack Class (Python)

```python
class Stack:
    def __init__(self):
        self.stack = []

    def push(self, value):
        self.stack.append(value)

    def pop(self):
        if self.is_empty():
            return None
        return self.stack.pop()

    def peek(self):
        if self.is_empty():
            return None
        return self.stack[-1]

    def is_empty(self):
        return len(self.stack) == 0

    def size(self):
        return len(self.stack)

# Example Usage
s = Stack()
s.push(10)
s.push(20)
s.push(30)
print(s.peek())    # 30
print(s.pop())     # 30
print(s.peek())    # 20
print(s.size())    # 2
```

---

## Time Complexities (Summary)

| Operation     | Time Complexity |
|---------------|-----------------|
| Push          | O(1)             |
| Pop           | O(1)             |
| Peek          | O(1)             |
| isEmpty       | O(1)             |
| Size          | O(1)             |

---

## Advantages of Stacks

✅ **Easy to Implement:** Simple and clean.  
✅ **Efficient:** All operations are `O(1)`.  
✅ **Useful in Recursion:** Function call stacks use stack structure internally.  
✅ **Backtracking Algorithms:** Undo features (e.g., editors, browser history) use stacks.

---

## Disadvantages of Stacks

❌ **Limited Access:** Only the top element is accessible.  
❌ **Fixed Size (in Array Implementation):** In static implementations (like arrays), the maximum size needs to be defined beforehand.

---

## Applications of Stack

📌 **Function call management** (system call stack)  
📌 **Undo mechanisms** in text editors  
📌 **Syntax parsing** (e.g., parentheses matching)  
📌 **Backtracking problems** (mazes, puzzles)  
📌 **Expression evaluation** (postfix, prefix notation)

---

## Quick Visualization 📈

```
Top -> 30
        20
        10
Bottom
```
- **Push:** Add to the top.
- **Pop:** Remove from the top.

---

# Conclusion

- **Stacks** are extremely useful where **order matters** (especially **reverse order**).
- Great for **function call stacks**, **undo features**, **parsing**, and **backtracking** algorithms.
- Mastering stacks is critical before learning:
  - **Recursion deeply**
  - **Queues**
  - **Graphs traversal (DFS uses stacks)**

---

# ✅ Bonus Tip

When stuck with **"reverse order"** type problems (e.g., reverse a string, backtracking, undo operations),  
👉 **Think Stack immediately**!

---

# 🎯 Extra (Small Challenge)

> Implement a **Stack using Linked List** instead of Python’s list!  
It gives better memory flexibility and helps understand pointers deeper. 🚀

---

# 📚 End of Stack Guide 📚✨

---
