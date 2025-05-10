import React from 'react';

const dsaTopics = [
  {
    title: 'Arrays & Strings',
    questions: [
      { name: 'Two Sum', difficulty: 'Easy', url: 'two-sum' },
      { name: 'Best Time to Buy and Sell Stock', difficulty: 'Easy', url: 'best-time-to-buy-and-sell-stock' },
      { name: 'Product of Array Except Self', difficulty: 'Medium', url: 'product-of-array-except-self' },
      { name: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', url: 'longest-substring-without-repeating-characters' },
      { name: 'Trapping Rain Water', difficulty: 'Hard', url: 'trapping-rain-water' },
    ],
  },
  {
    title: 'Linked Lists',
    questions: [
      { name: 'Reverse Linked List', difficulty: 'Easy', url: 'reverse-linked-list' },
      { name: 'Merge Two Sorted Lists', difficulty: 'Easy', url: 'merge-two-sorted-lists' },
      { name: 'Add Two Numbers', difficulty: 'Medium', url: 'add-two-numbers' },
      { name: 'Linked List Cycle II', difficulty: 'Medium', url: 'linked-list-cycle-ii' },
      { name: 'Copy List with Random Pointer', difficulty: 'Hard', url: 'copy-list-with-random-pointer' },
    ],
  },
  {
    title: 'Stacks & Queues',
    questions: [
      { name: 'Valid Parentheses', difficulty: 'Easy', url: 'valid-parentheses' },
      { name: 'Min Stack', difficulty: 'Easy', url: 'min-stack' },
      { name: 'Implement Queue using Stacks', difficulty: 'Medium', url: 'implement-queue-using-stacks' },
      { name: 'Daily Temperatures', difficulty: 'Medium', url: 'daily-temperatures' },
      { name: 'Largest Rectangle in Histogram', difficulty: 'Hard', url: 'largest-rectangle-in-histogram' },
    ],
  },
  {
    title: 'Trees',
    questions: [
      { name: 'Invert Binary Tree', difficulty: 'Easy', url: 'invert-binary-tree' },
      { name: 'Maximum Depth of Binary Tree', difficulty: 'Easy', url: 'maximum-depth-of-binary-tree' },
      { name: 'Binary Tree Level Order Traversal', difficulty: 'Medium', url: 'binary-tree-level-order-traversal' },
      { name: 'Validate Binary Search Tree', difficulty: 'Medium', url: 'validate-binary-search-tree' },
      { name: 'Serialize and Deserialize Binary Tree', difficulty: 'Hard', url: 'serialize-and-deserialize-binary-tree' },
    ],
  },
  {
    title: 'Graphs',
    questions: [
      { name: 'Number of Islands', difficulty: 'Easy', url: 'number-of-islands' },
      { name: 'Flood Fill', difficulty: 'Easy', url: 'flood-fill' },
      { name: 'Course Schedule', difficulty: 'Medium', url: 'course-schedule' },
      { name: 'Pacific Atlantic Water Flow', difficulty: 'Medium', url: 'pacific-atlantic-water-flow' },
      { name: 'Alien Dictionary', difficulty: 'Hard', url: 'alien-dictionary' },
    ],
  },
  {
    title: 'Dynamic Programming',
    questions: [
      { name: 'Climbing Stairs', difficulty: 'Easy', url: 'climbing-stairs' },
      { name: 'House Robber', difficulty: 'Easy', url: 'house-robber' },
      { name: 'Coin Change', difficulty: 'Medium', url: 'coin-change' },
      { name: 'Longest Palindromic Substring', difficulty: 'Medium', url: 'longest-palindromic-substring' },
      { name: 'Regular Expression Matching', difficulty: 'Hard', url: 'regular-expression-matching' },
    ],
  },
  {
    title: 'Backtracking',
    questions: [
      { name: 'Subsets', difficulty: 'Easy', url: 'subsets' },
      { name: 'Combination Sum', difficulty: 'Easy', url: 'combination-sum' },
      { name: 'Permutations', difficulty: 'Medium', url: 'permutations' },
      { name: 'Word Search', difficulty: 'Medium', url: 'word-search' },
      { name: 'N-Queens', difficulty: 'Hard', url: 'n-queens' },
    ],
  },
  {
    title: 'Greedy',
    questions: [
      { name: 'Assign Cookies', difficulty: 'Easy', url: 'assign-cookies' },
      { name: 'Lemonade Change', difficulty: 'Easy', url: 'lemonade-change' },
      { name: 'Jump Game', difficulty: 'Medium', url: 'jump-game' },
      { name: 'Partition Labels', difficulty: 'Medium', url: 'partition-labels' },
      { name: 'Minimum Number of Refueling Stops', difficulty: 'Hard', url: 'minimum-number-of-refueling-stops' },
    ],
  }
];

const Topic = () => {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-8 text-blue-700">FAANG DSA Topics & LeetCode Questions</h1>
      {dsaTopics.map((topic, index) => (
        <div key={index} className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">{topic.title}</h2>
          <ul className="list-disc pl-6 space-y-1">
            {topic.questions.map((q, i) => (
              <li key={i}>
                <a
                  href={`https://leetcode.com/problems/${q.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline font-medium"
                >
                  {q.name}
                </a>
                <span
                  className={`ml-2 text-sm px-2 py-0.5 rounded-full ${
                    q.difficulty === 'Easy'
                      ? 'bg-green-100 text-green-800'
                      : q.difficulty === 'Medium'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {q.difficulty}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default Topic;
