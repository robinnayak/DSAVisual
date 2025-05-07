# 📚 Circular Linked List (CLL)

**Difficulty:** Medium+

---

## Concepts

### What is a Circular Linked List?
- A **Circular Linked List** is a variation of a linked list where:
  - The **last node** points **back to the first node** (instead of `None`).
- There is **no starting or ending point** — you can keep looping around!

---

## Real-World Analogy

Imagine a **merry-go-round** 🎠:
- You keep moving from one horse (node) to the next.
- After the last horse, you're back to the first horse.
- **No real end** — it's a **continuous loop**!

✅ Circular linked lists are used where you need **continuous cycling**.

---

## Types of Circular Linked Lists

| Type                    | Description |
|--------------------------|-------------|
| Singly Circular Linked List | Each node has only a `next` pointer, last node points to the head. |
| Doubly Circular Linked List | Each node has both `next` and `prev` pointers, circular in both directions. |

(We'll focus on **Singly Circular Linked List** for now.)

---

## Node Structure

```python
class Node:
    def __init__(self, value):
        self.value = value
        self.next = None
```

---

## Circular Linked List Structure

```python
class CircularLinkedList:
    def __init__(self):
        self.head = None
```

---

## Basic Operations

### 1. Traversal

Loop through nodes **until you return to the head**.

```python
def traverse(self):
    if not self.head:
        return

    current = self.head
    while True:
        print(current.value, end=" -> ")
        current = current.next
        if current == self.head:
            break
    print("(Back to Head)")
```
**Time Complexity:** `O(n)`

---

### 2. Insertion at Head

Insert a new node at the **beginning**, fix the last node’s `next`.

```python
def insert_at_head(self, value):
    new_node = Node(value)
    if not self.head:
        self.head = new_node
        new_node.next = new_node  # Points to itself
        return

    # Find last node
    current = self.head
    while current.next != self.head:
        current = current.next

    current.next = new_node
    new_node.next = self.head
    self.head = new_node
```
**Time Complexity:** `O(n)`

---

### 3. Insertion at Tail

Insert a node just before the head (i.e., at the end).

```python
def insert_at_tail(self, value):
    new_node = Node(value)
    if not self.head:
        self.head = new_node
        new_node.next = new_node
        return

    current = self.head
    while current.next != self.head:
        current = current.next

    current.next = new_node
    new_node.next = self.head
```
**Time Complexity:** `O(n)`

---

### 4. Deletion by Value

Delete the node with a specific value.

```python
def delete_by_value(self, value):
    if not self.head:
        return

    current = self.head
    prev = None

    while True:
        if current.value == value:
            if prev:
                prev.next = current.next
            else:
                # Deleting head node
                if current.next == self.head:
                    self.head = None  # Only one node
                    return
                else:
                    # Find last node
                    last = self.head
                    while last.next != self.head:
                        last = last.next
                    self.head = current.next
                    last.next = self.head
            return

        prev = current
        current = current.next

        if current == self.head:
            break
```
**Time Complexity:** `O(n)`

---

## Full Circular Linked List Class (Python)

```python
class Node:
    def __init__(self, value):
        self.value = value
        self.next = None

class CircularLinkedList:
    def __init__(self):
        self.head = None

    def traverse(self):
        if not self.head:
            return

        current = self.head
        while True:
            print(current.value, end=" -> ")
            current = current.next
            if current == self.head:
                break
        print("(Back to Head)")

    def insert_at_head(self, value):
        new_node = Node(value)
        if not self.head:
            self.head = new_node
            new_node.next = new_node
            return

        current = self.head
        while current.next != self.head:
            current = current.next

        current.next = new_node
        new_node.next = self.head
        self.head = new_node

    def insert_at_tail(self, value):
        new_node = Node(value)
        if not self.head:
            self.head = new_node
            new_node.next = new_node
            return

        current = self.head
        while current.next != self.head:
            current = current.next

        current.next = new_node
        new_node.next = self.head

    def delete_by_value(self, value):
        if not self.head:
            return

        current = self.head
        prev = None

        while True:
            if current.value == value:
                if prev:
                    prev.next = current.next
                else:
                    if current.next == self.head:
                        self.head = None
                        return
                    else:
                        last = self.head
                        while last.next != self.head:
                            last = last.next
                        self.head = current.next
                        last.next = self.head
                return

            prev = current
            current = current.next

            if current == self.head:
                break

# Example usage
cll = CircularLinkedList()
cll.insert_at_tail(1)
cll.insert_at_tail(2)
cll.insert_at_tail(3)
cll.traverse()    # 1 -> 2 -> 3 -> (Back to Head)
cll.insert_at_head(0)
cll.traverse()    # 0 -> 1 -> 2 -> 3 -> (Back to Head)
cll.delete_by_value(2)
cll.traverse()    # 0 -> 1 -> 3 -> (Back to Head)
```

---

## Time Complexities (Summary)

| Operation              | Time Complexity |
|-------------------------|-----------------|
| Traversal               | O(n)            |
| Insertion at Head       | O(n)            |
| Insertion at Tail       | O(n)            |
| Deletion by Value       | O(n)            |

---

## Advantages of Circular Linked Lists

✅ **Continuous Traversal:** No need to restart — you can keep going around.  
✅ **Good for Round-Robin Scheduling:** Like CPU task scheduling.  
✅ **Efficient Looping:** Natural for applications needing cycling.

---

## Disadvantages of Circular Linked Lists

❌ **No Natural End:** Must manually stop traversal (else infinite loop).  
❌ **More Complex Insert/Delete:** Need to handle pointers carefully.  
❌ **Harder to Debug:** Compared to singly/doubly linked lists.

---

## Quick Visualization 📈

```
[0] -> [1] -> [3] -+
 ^                 |
 |                 |
 +-----------------+
```

- After the last node, you're **back to the head node**!

---

# Conclusion

- **Circular Linked Lists** are ideal when your app needs **endless looping behavior**.
- Be very careful with **traversal** — always check when you return to the head node!
- Important in **OS scheduling**, **multiplayer games**, and **network token passing** algorithms.

---

# ✅ Summary Table

| Feature                  | Circular Linked List |
|---------------------------|----------------------|
| Last Node Points To       | Head                 |
| Insert/Delete Complexity  | O(n)                 |
| Traversal                 | Infinite (needs manual stop) |
| Memory per Node           | Same as singly linked list |

---

# 🎯 Bonus Tip

**Always add "if current == head" checks** during traversal or deletion to prevent **infinite loops**!

---

# End of Circular Linked List Guide 📚✨

---
