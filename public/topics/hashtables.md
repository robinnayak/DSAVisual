# 📚 Hash Tables

**Difficulty:** Medium to Hard

---

## Concepts

### What is a Hash Table?
- A **Hash Table** is a **data structure** that stores data in **key-value pairs**.
- It uses a **hash function** to compute an **index** into an array where the value will be stored.

**Core idea:**  
🔹 Instead of searching all elements, **jump directly** to where the data should be!

---

## Real-World Analogy

Imagine a **library** 📚:
- Books (**values**) are organized based on their **ISBN numbers** (**keys**).
- The ISBN number is processed (hashed) to quickly find the **shelf** (array index) where the book is placed.

✅ No need to search the entire library — just use the code and find it fast!

---

## Key Terms

| Term            | Description                                                         |
|-----------------|---------------------------------------------------------------------|
| Key             | Unique identifier for a value (e.g., ISBN number).                  |
| Value           | Data associated with a key (e.g., the book details).                |
| Hash Function   | A function that maps a key to an index.                             |
| Bucket          | A slot (or linked list) that holds data at each index.              |
| Collision       | When two keys hash to the same index.                               |

---

## Hash Table Structure

```python
class HashTable:
    def __init__(self, size):
        self.size = size
        self.table = [None] * size
```

---

## Hash Function Example

A simple (not ideal) hash function:

```python
def hash_function(self, key):
    return hash(key) % self.size
```
- Takes any key and converts it into a valid **array index**.
- Good hash functions minimize **collisions**.

---

## Basic Operations

### 1. Insert (Put)

Insert a key-value pair.

```python
def insert(self, key, value):
    index = self.hash_function(key)
    
    if self.table[index] is None:
        self.table[index] = []
    
    # Handle duplicate key
    for pair in self.table[index]:
        if pair[0] == key:
            pair[1] = value
            return

    self.table[index].append([key, value])
```
**Time Complexity:**  
- Average Case: `O(1)`
- Worst Case (many collisions): `O(n)`

---

### 2. Search (Get)

Retrieve a value by key.

```python
def get(self, key):
    index = self.hash_function(key)
    
    if self.table[index] is not None:
        for pair in self.table[index]:
            if pair[0] == key:
                return pair[1]
    return None
```
**Time Complexity:** `O(1)` average, `O(n)` worst

---

### 3. Delete

Remove a key-value pair.

```python
def delete(self, key):
    index = self.hash_function(key)

    if self.table[index] is not None:
        for i, pair in enumerate(self.table[index]):
            if pair[0] == key:
                self.table[index].pop(i)
                return
```
**Time Complexity:** `O(1)` average, `O(n)` worst

---

## Full HashTable Class (Python)

```python
class HashTable:
    def __init__(self, size):
        self.size = size
        self.table = [None] * size

    def hash_function(self, key):
        return hash(key) % self.size

    def insert(self, key, value):
        index = self.hash_function(key)
        
        if self.table[index] is None:
            self.table[index] = []
        
        for pair in self.table[index]:
            if pair[0] == key:
                pair[1] = value
                return
        
        self.table[index].append([key, value])

    def get(self, key):
        index = self.hash_function(key)
        
        if self.table[index] is not None:
            for pair in self.table[index]:
                if pair[0] == key:
                    return pair[1]
        return None

    def delete(self, key):
        index = self.hash_function(key)

        if self.table[index] is not None:
            for i, pair in enumerate(self.table[index]):
                if pair[0] == key:
                    self.table[index].pop(i)
                    return

    def display(self):
        for i in range(self.size):
            print(f"{i}: {self.table[i]}")
        
# Example Usage
ht = HashTable(10)
ht.insert("apple", 100)
ht.insert("banana", 200)
ht.display()
print(ht.get("apple"))   # 100
ht.delete("apple")
ht.display()
```

---

## Time Complexities (Summary)

| Operation     | Best Case | Average Case | Worst Case |
|---------------|-----------|--------------|------------|
| Insert        | O(1)      | O(1)         | O(n)       |
| Search        | O(1)      | O(1)         | O(n)       |
| Delete        | O(1)      | O(1)         | O(n)       |

---

## Collision Handling Techniques

1. **Chaining** (used above):
   - Each bucket holds a list of elements.
   - Colliding elements are stored in the list.

2. **Open Addressing**:
   - Find another empty spot based on a probing sequence (linear, quadratic, double hashing).

---

## Advantages of Hash Tables

✅ **Very Fast Access:** Near `O(1)` average time for inserts, deletes, and lookups.  
✅ **Flexible Keys:** Can use strings, numbers, objects, etc.  
✅ **Efficient for Large Datasets:** Especially for quick lookups.

---

## Disadvantages of Hash Tables

❌ **Collisions:** Poorly designed hash functions can cause lots of collisions.  
❌ **Memory Overhead:** Empty slots or chains consume space.  
❌ **Not Ordered:** Elements are not stored in a sorted order.

---

## Applications of Hash Tables

📌 **Databases:** Indexing tables.  
📌 **Caches:** Fast data retrieval.  
📌 **Sets and Maps:** Implemented internally using hash tables.  
📌 **Symbol Tables:** In compilers and interpreters.  
📌 **Routing Tables:** In networks.

---

## Quick Visualization 📈

```
Index    Contents
 0    → None
 1    → [("banana", 200)]
 2    → None
 3    → [("apple", 100)]
 4    → None
...
```

- Hash function maps keys (`"banana"`, `"apple"`) to indices `1`, `3`.
- Values are stored inside small buckets (lists).

---

# Conclusion

- Hash tables offer **extremely efficient** key-value storage.
- Careful design of the **hash function** and **collision handling** is essential.
- Mastery of hash tables is crucial for **coding interviews**, **high-performance systems**, and **real-world projects**.

---

# ✅ Bonus Tip

👉 In problems asking for **fast lookups**, **duplicate detection**, **frequency counts**, or **unique elements**,  
🔵 **always think about Hash Tables first!**

---

# 📚 End of Hash Tables Guide 📚✨
