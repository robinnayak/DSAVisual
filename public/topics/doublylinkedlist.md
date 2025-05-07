
# 📚 Doubly Linked List (DLL)

**Difficulty:** Medium+

---

## Concepts

### What is a Doubly Linked List?
- A **Doubly Linked List** is a linked list where **each node** contains:
  - A **value/data**.
  - A **pointer to the next node**.
  - A **pointer to the previous node**.

---

## Real-World Analogy

Imagine a **two-way train track** 🚂:
- Each station (node) knows where the **next** station is.
- Each station also knows where the **previous** station is.
- You can move **forwards** or **backwards** easily!

✅ Doubly linked lists allow **bi-directional traversal**!

---

## Node Structure

```python
class Node:
    def __init__(self, value):
        self.value = value
        self.prev = None
        self.next = None
```

Each node has:
- `value`
- `prev` → previous node
- `next` → next node

---

## Doubly Linked List Structure

```python
class DoublyLinkedList:
    def __init__(self):
        self.head = None
        self.tail = None
```
- `head` points to the **first node**.
- `tail` points to the **last node** (important for fast insertions at the end).

---

## Basic Operations

### 1. Traversal (Forward)

Move from **head** to **tail**.

```python
def traverse_forward(self):
    current = self.head
    while current:
        print(current.value, end=" <-> ")
        current = current.next
    print("None")
```
**Time Complexity:** `O(n)`

---

### 2. Traversal (Backward)

Move from **tail** to **head**.

```python
def traverse_backward(self):
    current = self.tail
    while current:
        print(current.value, end=" <-> ")
        current = current.prev
    print("None")
```
**Time Complexity:** `O(n)`

---

### 3. Insertion at Head

Insert a node at the beginning.

```python
def insert_at_head(self, value):
    new_node = Node(value)
    if not self.head:
        self.head = self.tail = new_node
        return
    new_node.next = self.head
    self.head.prev = new_node
    self.head = new_node
```
**Time Complexity:** `O(1)`

---

### 4. Insertion at Tail

Insert a node at the end.

```python
def insert_at_tail(self, value):
    new_node = Node(value)
    if not self.tail:
        self.head = self.tail = new_node
        return
    self.tail.next = new_node
    new_node.prev = self.tail
    self.tail = new_node
```
**Time Complexity:** `O(1)`

---

### 5. Deletion by Value

Delete the first node matching a value.

```python
def delete_by_value(self, value):
    current = self.head
    while current:
        if current.value == value:
            if current.prev:
                current.prev.next = current.next
            else:
                self.head = current.next  # Deleted head

            if current.next:
                current.next.prev = current.prev
            else:
                self.tail = current.prev  # Deleted tail

            return
        current = current.next
```
**Time Complexity:** `O(n)`

---

## Full Doubly Linked List Class (Python)

```python
class Node:
    def __init__(self, value):
        self.value = value
        self.prev = None
        self.next = None

class DoublyLinkedList:
    def __init__(self):
        self.head = None
        self.tail = None

    def traverse_forward(self):
        current = self.head
        while current:
            print(current.value, end=" <-> ")
            current = current.next
        print("None")

    def traverse_backward(self):
        current = self.tail
        while current:
            print(current.value, end=" <-> ")
            current = current.prev
        print("None")

    def insert_at_head(self, value):
        new_node = Node(value)
        if not self.head:
            self.head = self.tail = new_node
            return
        new_node.next = self.head
        self.head.prev = new_node
        self.head = new_node

    def insert_at_tail(self, value):
        new_node = Node(value)
        if not self.tail:
            self.head = self.tail = new_node
            return
        self.tail.next = new_node
        new_node.prev = self.tail
        self.tail = new_node

    def delete_by_value(self, value):
        current = self.head
        while current:
            if current.value == value:
                if current.prev:
                    current.prev.next = current.next
                else:
                    self.head = current.next

                if current.next:
                    current.next.prev = current.prev
                else:
                    self.tail = current.prev

                return
            current = current.next

# Example usage
dll = DoublyLinkedList()
dll.insert_at_head(3)
dll.insert_at_head(2)
dll.insert_at_head(1)
dll.traverse_forward()   # 1 <-> 2 <-> 3 <-> None
dll.insert_at_tail(4)
dll.traverse_forward()   # 1 <-> 2 <-> 3 <-> 4 <-> None
dll.traverse_backward()  # 4 <-> 3 <-> 2 <-> 1 <-> None
dll.delete_by_value(2)
dll.traverse_forward()   # 1 <-> 3 <-> 4 <-> None
```

---

## Time Complexities (Summary)

| Operation              | Time Complexity |
|-------------------------|-----------------|
| Traversal (forward/backward) | O(n)       |
| Insertion at Head       | O(1)            |
| Insertion at Tail       | O(1)            |
| Deletion by Value       | O(n)            |

---

## Advantages of Doubly Linked Lists

✅ **Bi-directional Traversal:** Easy to move forward or backward.  
✅ **Efficient Deletions:** Given a node, can delete it without full traversal.  
✅ **Flexible Insertions/Deletions** at both ends.

---

## Disadvantages of Doubly Linked Lists

❌ **Extra Memory Usage:** Each node requires extra space for `prev` pointer.  
❌ **Complex Implementation:** More pointer handling (more bugs if not careful).  
❌ **Slightly Slower Operations:** Extra updates during insertion/deletion.

---

## Quick Visualization 📈

```
None <- [1] <-> [2] <-> [3] <-> [4] -> None
```

- Each node points **both ways**!

---

# Conclusion

- **Doubly Linked Lists** are a powerful improvement over singly linked lists when **two-way movement** is needed.
- They offer **more flexibility**, but at the cost of **more memory and complexity**.
- Must-know if you plan to master **advanced data structures** like **Deques**, **LRU Cache**, or **Tree navigation**!

---

# 🚀 Pro Tip

- Always carefully update both `prev` and `next` when inserting or deleting nodes!
- **Visualize** the node links on paper when debugging doubly linked list problems. It really helps! ✍️

---

# ✅ Summary Table

| Feature             | Doubly Linked List |
|---------------------|--------------------|
| Traversal Direction | Forward and Backward |
| Insert/Delete at Ends | O(1) |
| Insert/Delete at Middle | O(n) |
| Memory per Node     | More (because of two pointers) |

---

# End of Doubly Linked List Guide 📚✨

---
