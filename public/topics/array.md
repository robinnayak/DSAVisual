
# 📚 Array

**Difficulty:** Easy

---

## Concepts

### What is an Array?
- An **array** is a **collection of elements** (values), stored **contiguously** in memory.
- Each element is identified by an **index** (starting from 0).
- All elements are of the **same data type** (in strongly typed languages like C, C++).

---

## Real-World Analogy

Imagine a **row of mailboxes** 📬:
- Each mailbox (array slot) has an address (index).
- You can quickly find any letter (element) if you know the address.

✅ Accessing is fast because you can **jump directly** to any mailbox without checking the previous ones!

---

## Array Structure

```python
# Example: Python array (using list for simplicity)

arr = [10, 20, 30, 40, 50]

# Accessing
print(arr[0])  # 10

# Modifying
arr[2] = 35    # arr becomes [10, 20, 35, 40, 50]
```

**In low-level languages like C:**
```c
int arr[5] = {10, 20, 30, 40, 50};
printf("%d", arr[0]); // prints 10
```

---

## Basic Operations

### 1. Traversal

Visit each element one-by-one.

```python
for item in arr:
    print(item)
```
**Time Complexity:** `O(n)`

---

### 2. Insertion

Add an element at a specific position (but note: in simple arrays, size is fixed).

```python
arr.insert(2, 25)  # Insert 25 at index 2
# arr becomes [10, 20, 25, 35, 40, 50]
```
**Time Complexity:** `O(n)`  
*(Elements after index must be shifted.)*

---

### 3. Deletion

Remove an element by value or index.

```python
arr.remove(35)  # Removes first occurrence of 35
# OR
del arr[1]      # Deletes element at index 1
```
**Time Complexity:** `O(n)`  
*(Because shifting happens after deletion.)*

---

### 4. Search

Find an element in the array.

```python
if 40 in arr:
    print("Found!")
```
**Time Complexity:** `O(n)` (Linear Search)

If array is **sorted**, we can use **Binary Search**:
- **Time Complexity:** `O(log n)`

---

## Full Example

```python
arr = [10, 20, 30, 40, 50]

# Traversal
for x in arr:
    print(x)

# Insert 25 at index 2
arr.insert(2, 25)

# Delete value 40
arr.remove(40)

# Search for 50
if 50 in arr:
    print("50 is present")
else:
    print("50 not found")

# Final Array
print(arr)  # [10, 20, 25, 30, 50]
```

---

## Time Complexities (Summary)

| Operation            | Time Complexity |
|----------------------|-----------------|
| Traversal            | O(n)            |
| Access (Get element) | O(1)            |
| Insertion at End     | O(1) (if space) |
| Insertion at Middle  | O(n)            |
| Deletion at End      | O(1)            |
| Deletion at Middle   | O(n)            |
| Search (Linear)      | O(n)            |
| Search (Binary - sorted array) | O(log n) |

---

## Advantages of Arrays

✅ **Fast Access:** Direct access using the index.  
✅ **Memory Locality:** Elements are stored contiguously; fast cache access.  
✅ **Easy Traversal:** Simple and straightforward.

---

## Disadvantages of Arrays

❌ **Fixed Size:** Once declared, size cannot be changed (static arrays).  
❌ **Expensive Insertion/Deletion:** Shifting elements takes time (`O(n)`).  
❌ **Wasted Memory:** If size is overestimated, unused space is wasted.

---

## Quick Visualization 📈

```
Index:    0    1    2    3    4
Array:   [10,  20,  30,  40,  50]
```

Accessing `arr[3]` → instantly gets `40`!

---

# Conclusion

- Arrays are **perfect** for situations where:
  - You know the **size** in advance.
  - You need **fast access** to elements.
- If you need frequent insertions/deletions, **linked lists** might be better.
- **Mastering Arrays** is essential for building more advanced data structures like **Stacks**, **Queues**, **Heaps**, and **Hash Tables**.

---

# 🚀 Pro Tip

- Learn **dynamic arrays** (like Python's list or C++'s `vector`) — they auto-resize!
- Practice problems on **insertion, deletion, searching** to become fluent.

---

# ✅ Summary Table

| Feature        | Array |
|----------------|-------|
| Access         | O(1)  |
| Insert/Delete  | O(n)  |
| Search         | O(n) or O(log n) |
| Memory         | Contiguous |

---
