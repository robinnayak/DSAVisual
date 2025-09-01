# 📚 Stack - Last In, First Out (LIFO)

**Difficulty:** 🟢 Easy  
**Prerequisites:** Basic programming concepts, arrays  
**Time to Learn:** 30-40 minutes

---

## 🎯 What You'll Learn

By the end of this guide, you'll understand:
- What stacks are and how they work
- LIFO principle and its applications
- Core stack operations and implementations
- Real-world use cases and applications
- When to use stacks in problem-solving

---

## 📚 What is a Stack?

A **stack** is a **linear data structure** that follows the **LIFO (Last In, First Out)** principle. Elements are added and removed from the **same end**, called the **top** of the stack.

### Key Characteristics:
- **LIFO ordering** - last element added is the first to be removed
- **Single access point** - elements are accessed only from the top
- **Dynamic size** - can grow/shrink during runtime
- **Simple operations** - mainly push, pop, and peek

---

## 🌟 Real-World Analogy

Think of a **stack of plates** 🍽️:

```
    ┌─────────────┐  ← Top (most recent)
    │   Plate 4   │  ← Last plate added
    ├─────────────┤
    │   Plate 3   │
    ├─────────────┤
    │   Plate 2   │
    ├─────────────┤
    │   Plate 1   │  ← First plate added
    └─────────────┘  ← Bottom
```

- **Adding a plate** = Push operation (place on top)
- **Removing a plate** = Pop operation (take from top)
- **Looking at top plate** = Peek operation (without removing)
- You can **only access the top plate** - can't grab one from the middle!

✅ **LIFO in Action:** The last plate you put on top is the first one you'll take off!

---

## 🏗️ Stack Structure & Implementation

### Array-Based Implementation (Python)

```python
class ArrayStack:
    def __init__(self, capacity=10):
        self.capacity = capacity
        self.stack = [None] * capacity
        self.top = -1  # Index of top element (-1 means empty)
    
    def is_empty(self):
        """Check if stack is empty"""
        return self.top == -1
    
    def is_full(self):
        """Check if stack is full"""
        return self.top == self.capacity - 1
    
    def size(self):
        """Get number of elements"""
        return self.top + 1
    
    def push(self, item):
        """Add element to top of stack"""
        if self.is_full():
            raise OverflowError("Stack is full")
        
        self.top += 1
        self.stack[self.top] = item
        return item
    
    def pop(self):
        """Remove and return top element"""
        if self.is_empty():
            raise IndexError("Stack is empty")
        
        item = self.stack[self.top]
        self.stack[self.top] = None  # Optional cleanup
        self.top -= 1
        return item
    
    def peek(self):
        """View top element without removing"""
        if self.is_empty():
            raise IndexError("Stack is empty")
        
        return self.stack[self.top]
    
    def display(self):
        """Print stack contents"""
        if self.is_empty():
            print("Stack is empty")
            return
        
        print("Stack (top to bottom):")
        for i in range(self.top, -1, -1):
            print(f"│ {self.stack[i]} │")
        print("└───┘")
```

### Dynamic List Implementation (Python)

```python
class ListStack:
    def __init__(self):
        self.stack = []  # Use Python list as underlying structure
    
    def is_empty(self):
        """Check if stack is empty"""
        return len(self.stack) == 0
    
    def size(self):
        """Get number of elements"""
        return len(self.stack)
    
    def push(self, item):
        """Add element to top of stack"""
        self.stack.append(item)
        return item
    
    def pop(self):
        """Remove and return top element"""
        if self.is_empty():
            raise IndexError("Stack is empty")
        
        return self.stack.pop()
    
    def peek(self):
        """View top element without removing"""
        if self.is_empty():
            raise IndexError("Stack is empty")
        
        return self.stack[-1]
    
    def display(self):
        """Print stack contents"""
        if self.is_empty():
            print("Stack is empty")
            return
        
        print("Stack (top to bottom):")
        for i in range(len(self.stack) - 1, -1, -1):
            print(f"│ {self.stack[i]} │")
        print("└───┘")
```

### Linked List Implementation

```python
class StackNode:
    def __init__(self, data):
        self.data = data
        self.next = None

class LinkedStack:
    def __init__(self):
        self.top = None  # Points to top node
        self._size = 0
    
    def is_empty(self):
        """Check if stack is empty"""
        return self.top is None
    
    def size(self):
        """Get number of elements"""
        return self._size
    
    def push(self, item):
        """Add element to top of stack"""
        new_node = StackNode(item)
        new_node.next = self.top
        self.top = new_node
        self._size += 1
        return item
    
    def pop(self):
        """Remove and return top element"""
        if self.is_empty():
            raise IndexError("Stack is empty")
        
        item = self.top.data
        self.top = self.top.next
        self._size -= 1
        return item
    
    def peek(self):
        """View top element without removing"""
        if self.is_empty():
            raise IndexError("Stack is empty")
        
        return self.top.data
```

---

## ⚡ Core Operations

### 1. 📥 **Push Operation**

Add an element to the top of the stack.

```python
def push_demo():
    stack = ListStack()
    
    # Push elements
    stack.push(10)  # Stack: [10]
    stack.push(20)  # Stack: [10, 20]
    stack.push(30)  # Stack: [10, 20, 30]
    
    print(f"Stack size: {stack.size()}")  # Output: 3
    stack.display()
    
    # Visual representation:
    # ┌─────┐
    # │  30 │ ← Top (most recent)
    # ├─────┤
    # │  20 │
    # ├─────┤
    # │  10 │ ← Bottom (oldest)
    # └─────┘

push_demo()
```

**⏱️ Time Complexity:** `O(1)` - Constant time  
**💾 Space Complexity:** `O(1)`

---

### 2. 📤 **Pop Operation**

Remove and return the top element from the stack.

```python
def pop_demo():
    stack = ListStack()
    stack.push(10)
    stack.push(20)
    stack.push(30)
    
    # Pop elements
    top_element = stack.pop()  # Returns 30
    print(f"Popped: {top_element}")  # Output: 30
    
    second_element = stack.pop()  # Returns 20
    print(f"Popped: {second_element}")  # Output: 20
    
    print(f"Remaining stack size: {stack.size()}")  # Output: 1
    stack.display()  # Shows only [10]

pop_demo()
```

**⏱️ Time Complexity:** `O(1)` - Constant time  
**💾 Space Complexity:** `O(1)`

---

### 3. 👀 **Peek/Top Operation**

View the top element without removing it.

```python
def peek_demo():
    stack = ListStack()
    stack.push(10)
    stack.push(20)
    stack.push(30)
    
    # Peek at top element
    top_element = stack.peek()  # Returns 30
    print(f"Top element: {top_element}")  # Output: 30
    
    print(f"Stack size unchanged: {stack.size()}")  # Output: 3
    stack.display()  # Still shows [10, 20, 30]

peek_demo()
```

**⏱️ Time Complexity:** `O(1)` - Constant time  
**💾 Space Complexity:** `O(1)`

---

### 4. ❓ **Helper Operations**

```python
def helper_operations_demo():
    stack = ListStack()
    
    # Check if empty
    print(f"Is empty: {stack.is_empty()}")  # Output: True
    
    # Add some elements
    stack.push(10)
    stack.push(20)
    
    # Check size
    print(f"Size: {stack.size()}")  # Output: 2
    
    # Check if empty again
    print(f"Is empty: {stack.is_empty()}")  # Output: False
    
    # Clear stack
    while not stack.is_empty():
        stack.pop()
    
    print(f"After clearing - Is empty: {stack.is_empty()}")  # Output: True

helper_operations_demo()
```

---

## 📊 Time Complexity Summary

| Operation | Array Implementation | List Implementation | Linked List Implementation |
|-----------|---------------------|--------------------|-----------------------------|
| **Push** | O(1) | O(1)* | O(1) |
| **Pop** | O(1) | O(1) | O(1) |
| **Peek/Top** | O(1) | O(1) | O(1) |
| **IsEmpty** | O(1) | O(1) | O(1) |
| **Size** | O(1) | O(1) | O(1) |

> *Amortized O(1) for dynamic arrays due to occasional resizing

**💾 Space Complexity:** O(n) where n is the number of elements

---

## 🎯 Real-World Applications

### 1. **Function Call Management**
```python
def factorial(n):
    """Recursion uses stack for function calls"""
    if n <= 1:
        return 1
    return n * factorial(n - 1)

# Call stack visualization:
# factorial(3)
# ├── factorial(2)
# │   ├── factorial(1)  ← Returns 1
# │   └── Returns 2 * 1 = 2
# └── Returns 3 * 2 = 6
```

### 2. **Undo Functionality**
```python
class TextEditor:
    def __init__(self):
        self.text = ""
        self.history = ListStack()
    
    def type_text(self, new_text):
        """Add text and save to history"""
        self.history.push(self.text)  # Save current state
        self.text += new_text
    
    def undo(self):
        """Undo last action"""
        if not self.history.is_empty():
            self.text = self.history.pop()
    
# Usage
editor = TextEditor()
editor.type_text("Hello ")     # text: "Hello "
editor.type_text("World!")     # text: "Hello World!"
editor.undo()                  # text: "Hello "
editor.undo()                  # text: ""
```

### 3. **Expression Evaluation**
```python
def evaluate_postfix(expression):
    """Evaluate postfix notation using stack"""
    stack = ListStack()
    
    for token in expression.split():
        if token.isdigit():
            stack.push(int(token))
        else:
            # Operator
            b = stack.pop()
            a = stack.pop()
            
            if token == '+':
                stack.push(a + b)
            elif token == '-':
                stack.push(a - b)
            elif token == '*':
                stack.push(a * b)
            elif token == '/':
                stack.push(a // b)
    
    return stack.pop()

# Example: "3 4 + 2 *" = (3 + 4) * 2 = 14
result = evaluate_postfix("3 4 + 2 *")
print(result)  # Output: 14
```

### 4. **Balanced Parentheses Checking**
```python
def is_balanced(expression):
    """Check if parentheses are balanced"""
    stack = ListStack()
    pairs = {'(': ')', '[': ']', '{': '}'}
    
    for char in expression:
        if char in pairs:  # Opening bracket
            stack.push(char)
        elif char in pairs.values():  # Closing bracket
            if stack.is_empty():
                return False
            
            if pairs[stack.pop()] != char:
                return False
    
    return stack.is_empty()

# Test cases
print(is_balanced("()[]{}"))        # True
print(is_balanced("([{}])"))        # True
print(is_balanced("([)]"))          # False
print(is_balanced("((()"))          # False
```

---

## ✅ Advantages of Stacks

| Advantage | Description |
|-----------|-------------|
| 🚀 **Fast Operations** | All operations are O(1) |
| 💡 **Simple Implementation** | Easy to understand and implement |
| 💾 **Memory Efficient** | Only stores what's needed |
| 🔧 **Versatile** | Useful for many algorithms |
| 🎯 **Natural LIFO** | Perfect for undo, recursion, parsing |

---

## ❌ Disadvantages of Stacks

| Disadvantage | Description |
|--------------|-------------|
| 🚫 **Limited Access** | Can only access top element |
| 📏 **No Random Access** | Cannot access middle elements |
| 🔍 **No Search** | Cannot search efficiently |
| 📊 **No Iteration** | Cannot traverse without popping |

---

## 🎯 When to Use Stacks

### ✅ **Perfect for:**
- **Function call management** (recursion)
- **Undo operations** in applications
- **Expression evaluation** and parsing
- **Backtracking algorithms**
- **Browser history** management
- **Balanced parentheses** checking

### ❌ **Avoid when:**
- **Random access** to elements needed
- **Search operations** are frequent
- **FIFO behavior** is required (use queue instead)
- **Multiple access points** needed

---

## 💡 Common Patterns & Interview Questions

### 1. **Valid Parentheses** (LeetCode Easy)
```python
def isValid(s):
    """Check if string has valid parentheses"""
    stack = []
    mapping = {')': '(', '}': '{', ']': '['}
    
    for char in s:
        if char in mapping:
            if not stack or stack.pop() != mapping[char]:
                return False
        else:
            stack.append(char)
    
    return not stack
```

### 2. **Min Stack** (LeetCode Medium)
```python
class MinStack:
    """Stack that supports getMin() in O(1)"""
    
    def __init__(self):
        self.stack = []
        self.min_stack = []
    
    def push(self, val):
        self.stack.append(val)
        if not self.min_stack or val <= self.min_stack[-1]:
            self.min_stack.append(val)
    
    def pop(self):
        if self.stack:
            val = self.stack.pop()
            if val == self.min_stack[-1]:
                self.min_stack.pop()
    
    def top(self):
        return self.stack[-1] if self.stack else None
    
    def getMin(self):
        return self.min_stack[-1] if self.min_stack else None
```

### 3. **Daily Temperatures** (LeetCode Medium)
```python
def dailyTemperatures(temperatures):
    """Find days until warmer temperature"""
    result = [0] * len(temperatures)
    stack = []  # Store indices
    
    for i, temp in enumerate(temperatures):
        while stack and temperatures[stack[-1]] < temp:
            prev_index = stack.pop()
            result[prev_index] = i - prev_index
        stack.append(i)
    
    return result

# Example: [73,74,75,71,69,72,76,73] → [1,1,4,2,1,1,0,0]
```

---

## 🧪 Practice Problems

### Beginner
1. **Implement stack** using arrays and linked lists
2. **Reverse a string** using stack
3. **Check balanced parentheses**
4. **Convert infix to postfix**

### Intermediate
1. **Evaluate postfix expression**
2. **Next greater element**
3. **Min stack implementation**
4. **Valid parentheses variations**

### Advanced
1. **Largest rectangle in histogram**
2. **Maximal rectangle**
3. **Trap rainwater using stack**
4. **Expression tree construction**

---

## 🎯 Key Takeaways

> **Stacks are perfect for LIFO scenarios** and form the foundation for understanding recursion, parsing, and backtracking algorithms.

### Remember:
1. **LIFO principle** - last in, first out
2. **O(1) operations** make stacks very efficient
3. **Single access point** limits flexibility but ensures predictable behavior
4. **Perfect for recursion** and undo functionality
5. **Essential for parsing** and expression evaluation

---

## 🚀 Next Steps

1. **Master basic operations** until they become intuitive
2. **Practice parentheses problems** - they're very common
3. **Learn expression evaluation** algorithms
4. **Understand recursion** relationship with stacks
5. **Explore advanced stack problems** on coding platforms

---

## 📖 Additional Resources

- **Visualization:** VisuAlgo Stack, Algorithm Visualizer
- **Practice:** LeetCode Stack problems, HackerRank
- **Theory:** "Introduction to Algorithms" by CLRS
- **Applications:** Compiler design, operating systems

Remember: **Think LIFO!** When you see problems involving undo, recursion, or parsing, consider using a stack. 🎯
