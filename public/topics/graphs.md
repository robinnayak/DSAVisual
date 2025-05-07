# 🕸️ Graphs: Full Guide

**Difficulty:** High

---

## Concepts

### What is a Graph?
- A **graph** is a collection of **nodes** (or vertices) and **edges** that connect these nodes.
- Graphs can be:
  - **Directed** (edges have a direction)
  - **Undirected** (edges don’t have a direction)

### Terminology
- **Vertex (Node):** A point or a node in the graph.
- **Edge:** A connection between two vertices.
- **Adjacency:** If two nodes are connected by an edge, they are **adjacent**.
- **Degree of a Vertex:** The number of edges connected to the vertex.
- **Path:** A sequence of edges that connect a series of vertices.
- **Cycle:** A path that starts and ends at the same vertex.

---

## Types of Graphs

1. **Undirected Graph**
   - Edges have **no direction**.
   - Example: Facebook friends — if you’re friends with someone, they’re friends with you too.

2. **Directed Graph (Digraph)**
   - Edges have a **direction**.
   - Example: Twitter follows — if A follows B, it doesn't mean B follows A.

3. **Weighted Graph**
   - Each edge has a **weight** or **cost** associated with it.
   - Example: Road networks where edges represent roads and weights represent distances.

4. **Unweighted Graph**
   - All edges are treated equally (no weights).

5. **Cyclic vs Acyclic Graph**
   - **Cyclic**: Contains at least one cycle.
   - **Acyclic**: No cycles (e.g., Tree is a special type of acyclic graph).

6. **Connected vs Disconnected Graph**
   - **Connected**: There is a path between every pair of vertices.
   - **Disconnected**: Not all vertices are reachable from others.

---

## Real-World Analogy

Think of a **graph** like a **city map** 🌍:
- **Vertices** are the **cities**.
- **Edges** are the **roads** between cities.
- A **directed graph** is like one-way streets; a **weighted graph** is like roads with different lengths (distances).

---

## Graph Representation

Graphs can be represented in two primary ways:

### 1. **Adjacency Matrix**

- A **2D array** of size `n x n` where each cell at `(i, j)` represents whether there’s an edge between vertex `i` and vertex `j`.
- **Space Complexity**: `O(n^2)`

```python
# Example of an adjacency matrix
graph_matrix = [
    [0, 1, 0, 1],  # Node 0
    [1, 0, 1, 0],  # Node 1
    [0, 1, 0, 1],  # Node 2
    [1, 0, 1, 0]   # Node 3
]
```

### 2. **Adjacency List**

- A **list of lists** where each list contains all adjacent vertices for a given vertex.
- **Space Complexity**: `O(n + e)` where `n` is the number of vertices and `e` is the number of edges.

```python
# Example of an adjacency list
graph_list = {
    0: [1, 3],
    1: [0, 2],
    2: [1, 3],
    3: [0, 2]
}
```

---

## Graph Traversal Algorithms

Traversal is the process of visiting each vertex in the graph.

### 1. **Breadth-First Search (BFS)**

- **BFS** explores all the **neighbors** of a node before moving on to their children.
- It uses a **queue** and is used to find the **shortest path** in unweighted graphs.

#### BFS Pseudocode:
1. Start with the **source vertex**.
2. Visit all its adjacent vertices.
3. Move to the **next level** and repeat until all vertices are visited.

#### BFS Algorithm

```python
from collections import deque

def bfs(graph, start):
    visited = set()
    queue = deque([start])
    
    while queue:
        vertex = queue.popleft()
        if vertex not in visited:
            print(vertex, end=" -> ")
            visited.add(vertex)
            queue.extend(neighbor for neighbor in graph[vertex] if neighbor not in visited)

# Example usage
bfs(graph_list, 0)  # Output: 0 -> 1 -> 3 -> 2
```

**Time Complexity**: `O(n + e)`  
**Space Complexity**: `O(n)`  

---

### 2. **Depth-First Search (DFS)**

- **DFS** explores as far as possible along each branch before backtracking.
- It can be implemented using either **recursion** or a **stack**.

#### DFS Algorithm (Recursive)

```python
def dfs(graph, vertex, visited=None):
    if visited is None:
        visited = set()
    
    print(vertex, end=" -> ")
    visited.add(vertex)
    
    for neighbor in graph[vertex]:
        if neighbor not in visited:
            dfs(graph, neighbor, visited)

# Example usage
dfs(graph_list, 0)  # Output: 0 -> 1 -> 2 -> 3
```

**Time Complexity**: `O(n + e)`  
**Space Complexity**: `O(n)` (due to recursion stack)

---

## Graph Shortest Path Algorithms

1. **Dijkstra's Algorithm** (for **weighted graphs**)
2. **Bellman-Ford Algorithm** (handles negative weights)
3. **Floyd-Warshall Algorithm** (for all pairs of shortest paths)

---

## Graph Cycle Detection

### 1. **Cycle Detection in Directed Graphs (DFS)**

- Use DFS and track **recursion stack** to detect cycles in directed graphs.

```python
def detect_cycle(graph, vertex, visited, recursion_stack):
    visited[vertex] = True
    recursion_stack[vertex] = True
    
    for neighbor in graph[vertex]:
        if not visited[neighbor] and detect_cycle(graph, neighbor, visited, recursion_stack):
            return True
        elif recursion_stack[neighbor]:
            return True
    
    recursion_stack[vertex] = False
    return False

# Example usage
graph_with_cycle = {0: [1], 1: [2], 2: [0]}
visited = [False] * 3
rec_stack = [False] * 3
print(detect_cycle(graph_with_cycle, 0, visited, rec_stack))  # Output: True (cycle detected)
```

**Time Complexity**: `O(n + e)`  
**Space Complexity**: `O(n)`  

---

## Graph Algorithms Summary

| Algorithm                   | Type                | Time Complexity    | Space Complexity   |
|-----------------------------|---------------------|--------------------|--------------------|
| **BFS**                      | Traversal           | `O(n + e)`         | `O(n)`             |
| **DFS**                      | Traversal           | `O(n + e)`         | `O(n)`             |
| **Dijkstra**                 | Shortest Path       | `O(n^2)` / `O(e + n log n)` | `O(n)`             |
| **Bellman-Ford**             | Shortest Path       | `O(n * e)`         | `O(n)`             |
| **Floyd-Warshall**           | All-Pairs Shortest Path | `O(n^3)`      | `O(n^2)`           |

---

## Advantages of Graphs

✅ **Modeling Complex Relationships**: Great for **networked** data (e.g., social networks, routing).  
✅ **Versatile Structure**: Can represent many real-world problems like maps, dependencies, etc.  
✅ **Efficient for Pathfinding**: With algorithms like Dijkstra’s or BFS.

---

## Disadvantages of Graphs

❌ **Complexity**: Graph algorithms can be more **complex** than other data structures.  
❌ **Memory Usage**: Graphs, especially sparse ones, can be memory-intensive depending on representation.

---

## Applications of Graphs

📌 **Social Networks**: Nodes represent users, edges represent connections.  
📌 **Web Crawling**: Graph of web pages, edges represent hyperlinks.  
📌 **Routing Algorithms**: Finding the shortest path in a network (e.g., GPS).  
📌 **Recommendation Systems**: Graphs used in collaborative filtering (e.g., movie recommendations).  
📌 **Scheduling & Task Dependencies**: Representing tasks and their dependencies.

---

## Quick Visualization 📈

```
    0
   / \
  1   3
   \ / \
    2   4
```
The above graph can be represented as:

```python
graph = {
    0: [1, 3],
    1: [0, 2],
    2: [1],
    3: [0, 4],
    4: [3]
}
```

---

# Conclusion

- **Graphs** are essential for solving complex, **network-like** problems (social networks, routing, dependencies).
- Understanding different types of graphs and traversal algorithms is fundamental.
- **Graph algorithms** like **DFS, BFS, Dijkstra’s**, and **Floyd-Warshall** are key to solving real-world problems.

---

# 📚 End of Graphs Guide 📚✨
