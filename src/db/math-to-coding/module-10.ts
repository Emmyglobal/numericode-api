import type { M2cModuleData } from './types'

// Module 10 — Graphs, Trees & Data Structures Foundations
// Module objectives: model and traverse hierarchical and networked data.

export const module10: M2cModuleData = {
  title: 'Module 10 — Graphs, Trees & Data Structures Foundations',
  lessons: [
    {
      title: 'Trees: Terminology, Binary Trees, Traversals',
      duration: 30,
      content: `## Learning Objectives\n- Identify tree terms (root, leaf, depth, height).\n- Distinguish binary trees.\n- Perform pre-order, in-order, and post-order traversals.\n\n## Tree Terminology\n- **Root:** top node.\n- **Parent/Child:** edges connect nodes.\n- **Leaf:** node with no children.\n- **Depth/Height:** levels from root to node / node to deepest descendant.\n\n## Binary Trees
Each node has at most two children (left and right).\n\n## Traversals
- **Pre-order:** visit node, then left, then right.\n- **In-order:** visit left, then node, then right.\n- **Post-order:** visit left, then right, then node.\n\n## Key Takeaways
- A leaf node has no children.
- Binary trees have at most 2 children per node.
- In-order traversal: left, node, right.`,
      quiz: {
        title: 'Quiz 10.1 — Trees',
        description: 'Three questions on tree terminology and traversals.',
        timeLimit: 15,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          { questionText: 'A node with no children is called?', questionType: 'fill_blank', correctAnswer: 'A leaf' },
          { questionText: 'Max children per node in a binary tree?', questionType: 'fill_blank', correctAnswer: 'Two' },
          { questionText: 'In-order traversal visits left subtree, then node, then right subtree.', questionType: 'true_false', correctAnswer: 'true' },
        ],
      },
    },
    {
      title: 'Graphs: Terminology, Directed/Undirected, Weighted',
      duration: 35,
      content: `## Learning Objectives\n- Distinguish directed and undirected graphs.\n- Recognize weighted vs unweighted edges.\n\n## Graph Terminology\n- **Vertices/Nodes:** the points.\n- **Edges:** connections between vertices.\n\n## Types of Graphs
- **Undirected:** edges go both ways (friendship).\n- **Directed:** edges have direction (Twitter follow).\n- **Weighted:** edges have costs (road distances).\n\n## Key Takeaways
- A tree is a special type of graph (no cycles, connected).
- An edge from A to B does not imply B to A in a directed graph.`,
      quiz: {
        title: 'Quiz 10.2 — Graph Terminology',
        description: 'Three questions on graph types.',
        timeLimit: 15,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          { questionText: 'The two basic components of a graph?', questionType: 'fill_blank', correctAnswer: 'Vertices and edges' },
          { questionText: 'In a directed graph, does A→B imply B→A?', questionType: 'true_false', correctAnswer: 'false' },
          { questionText: 'A tree is a special type of graph.', questionType: 'true_false', correctAnswer: 'true' },
        ],
      },
    },
    {
      title: 'Graph Representations: Adjacency List vs Matrix',
      duration: 40,
      content: `## Learning Objectives\n- Convert between adjacency matrix and list.\n- Choose representation based on density.\n\n## Adjacency Matrix
A 2D grid where cell [i][j] is 1 if there's an edge from i to j. Space: O(n^2).\n\n## Adjacency List
Each node has a list of its neighbors. Space: O(n + m) where m is the number of edges.\n\n## When to Use Each
- **Dense graphs** (many edges): use adjacency matrix.\n- **Sparse graphs** (few edges): use adjacency list.\n\n## Key Takeaways
- Adjacency matrix is O(n^2) space.
- Adjacency lists are more space-efficient for sparse graphs.
- Adjacency matrices allow O(1) edge existence checks.`,
      quiz: {
        title: 'Quiz 10.3 — Graph Representations',
        description: 'Three questions on adjacency matrix vs list.',
        timeLimit: 15,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          { questionText: 'Which representation is more space-efficient for sparse graphs?', questionType: 'fill_blank', correctAnswer: 'Adjacency list' },
          { questionText: 'Space complexity of adjacency matrix for n vertices?', questionType: 'fill_blank', correctAnswer: 'O(n^2)' },
          { questionText: 'Adjacency matrices allow O(1) edge existence checks.', questionType: 'true_false', correctAnswer: 'true' },
        ],
      },
    },
    {
      title: 'Graph Traversal: BFS & DFS',
      duration: 35,
      content: `## Learning Objectives\n- Implement BFS and DFS.\n- Know when to use each.\n\n## Breadth-First Search (BFS)
Explores level by level using a **queue**. Finds shortest path in unweighted graphs.\n\n## Depth-First Search (DFS)
Goes deep first using a **stack** (or recursion). Good for exploring all paths.\n\n## Key Takeaways
- BFS uses a queue.
- DFS uses a stack or recursion.
- BFS finds shortest path in unweighted graphs.`,
      quiz: {
        title: 'Quiz 10.4 — Graph Traversal',
        description: 'Three questions on BFS and DFS.',
        timeLimit: 15,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          { questionText: 'BFS typically uses a queue.', questionType: 'fill_blank', correctAnswer: 'queue' },
          { questionText: 'DFS typically uses a stack.', questionType: 'fill_blank', correctAnswer: 'stack' },
          { questionText: 'BFS finds shortest path in unweighted graphs.', questionType: 'true_false', correctAnswer: 'true' },
        ],
      },
    },
    {
      title: 'Real-World Graph Problems: Shortest Path',
      duration: 40,
      content: `## Learning Objectives\n- Understand why BFS is insufficient for weighted graphs.\n- Grasp Dijkstra's algorithm core idea.\n\n## Why Not BFS for Weighted Graphs
BFS assumes all edges have equal cost. If edges have different weights, BFS may find a path that is shorter in hops but not in total cost.\n\n## Dijkstra's Algorithm
Always expand the nearest unvisited node next, updating shortest known distances. Works for non-negative weights only.\n\n## Key Takeaways
- BFS does not correctly find shortest paths in weighted graphs.
- Dijkstra always expands the nearest unvisited node.
- Dijkstra does not work with negative edge weights.`,
      quiz: {
        title: 'Quiz 10.5 — Shortest Path',
        description: 'Three questions on Dijkstra and weighted graphs.',
        timeLimit: 15,
        passingScore: 70,
        maxAttempts: 3,
        questions: [
          { questionText: 'Plain BFS correctly finds shortest paths in weighted graphs.', questionType: 'true_false', correctAnswer: 'false' },
          { questionText: 'Dijkstra always expands the nearest unvisited node next.', questionType: 'true_false', correctAnswer: 'true' },
          { questionText: 'Dijkstra works correctly with negative edge weights.', questionType: 'true_false', correctAnswer: 'false' },
        ],
      },
    },
  ],
  assignment: {
    title: 'Module 10 Assignment — Graph Explorer',
    description: 'Build a tool that represents a social network as a graph (adjacency list), implements BFS for shortest hop-count, and implements DFS to list all reachable nodes from a starting point.',
    dueDate: '2026-12-27T23:59:59Z',
    totalMarks: 20,
    passingScore: 10,
    assignmentType: 'mixed',
    questions: [
      { id: 'm10a1', type: 'theory', title: 'BFS data structure?', marks: 5 },
      { id: 'm10a2', type: 'theory', title: 'DFS data structure?', marks: 5 },
      { id: 'm10a3', type: 'theory', title: 'Which traversal finds shortest path in unweighted graphs?', marks: 5 },
      { id: 'm10a4', type: 'file', title: 'Submit your Graph Explorer implementation.', marks: 5 },
    ],
  },
}
