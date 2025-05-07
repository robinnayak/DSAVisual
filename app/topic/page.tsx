import React from 'react';
// export const runtime = "edge";

const dsaTopics = [
  {
    title: 'Arrays & Strings',
    questions: [
      { name: 'Two Sum', difficulty: 'Easy' },
      { name: 'Best Time to Buy and Sell Stock', difficulty: 'Easy' },
      { name: 'Product of Array Except Self', difficulty: 'Medium' },
      { name: 'Longest Substring Without Repeating Characters', difficulty: 'Medium' },
      { name: 'Trapping Rain Water', difficulty: 'Hard' },
    ],
  },
  {
    title: 'Linked Lists',
    questions: [
      { name: 'Reverse Linked List', difficulty: 'Easy' },
      { name: 'Merge Two Sorted Lists', difficulty: 'Easy' },
      { name: 'Add Two Numbers', difficulty: 'Medium' },
      { name: 'Linked List Cycle II', difficulty: 'Medium' },
      { name: 'Copy List with Random Pointer', difficulty: 'Hard' },
    ],
  },
  {
    title: 'Stacks & Queues',
    questions: [
      { name: 'Valid Parentheses', difficulty: 'Easy' },
      { name: 'Min Stack', difficulty: 'Easy' },
      { name: 'Implement Queue using Stacks', difficulty: 'Medium' },
      { name: 'Daily Temperatures', difficulty: 'Medium' },
      { name: 'Largest Rectangle in Histogram', difficulty: 'Hard' },
    ],
  },
  {
    title: 'Trees',
    questions: [
      { name: 'Invert Binary Tree', difficulty: 'Easy' },
      { name: 'Maximum Depth of Binary Tree', difficulty: 'Easy' },
      { name: 'Binary Tree Level Order Traversal', difficulty: 'Medium' },
      { name: 'Validate Binary Search Tree', difficulty: 'Medium' },
      { name: 'Serialize and Deserialize Binary Tree', difficulty: 'Hard' },
    ],
  },
  {
    title: 'Graphs',
    questions: [
      { name: 'Number of Islands', difficulty: 'Easy' },
      { name: 'Flood Fill', difficulty: 'Easy' },
      { name: 'Course Schedule', difficulty: 'Medium' },
      { name: 'Pacific Atlantic Water Flow', difficulty: 'Medium' },
      { name: 'Alien Dictionary', difficulty: 'Hard' },
    ],
  },
  {
    title: 'Dynamic Programming',
    questions: [
      { name: 'Climbing Stairs', difficulty: 'Easy' },
      { name: 'House Robber', difficulty: 'Easy' },
      { name: 'Coin Change', difficulty: 'Medium' },
      { name: 'Longest Palindromic Substring', difficulty: 'Medium' },
      { name: 'Regular Expression Matching', difficulty: 'Hard' },
    ],
  },
  {
    title: 'Backtracking',
    questions: [
      { name: 'Subsets', difficulty: 'Easy' },
      { name: 'Combination Sum', difficulty: 'Easy' },
      { name: 'Permutations', difficulty: 'Medium' },
      { name: 'Word Search', difficulty: 'Medium' },
      { name: 'N-Queens', difficulty: 'Hard' },
    ],
  },
  {
    title: 'Greedy',
    questions: [
      { name: 'Assign Cookies', difficulty: 'Easy' },
      { name: 'Lemonade Change', difficulty: 'Easy' },
      { name: 'Jump Game', difficulty: 'Medium' },
      { name: 'Partition Labels', difficulty: 'Medium' },
      { name: 'Minimum Number of Refueling Stops', difficulty: 'Hard' },
    ],
  }
];

const Topic = () => {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-8 text-blue-700">DSA Topics with LeetCode Questions</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {dsaTopics.map((topic, index) => (
          <div key={index} className="bg-white shadow-md rounded-2xl p-4 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">{topic.title}</h2>
            <ul className="text-gray-700 space-y-1">
              {topic.questions.map((q, i) => (
                <li key={i}>
                  <span className="font-medium">{q.name}</span>
                  <span className={`ml-2 text-sm px-2 py-0.5 rounded-full ${
                    q.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                    q.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {q.difficulty}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Topic;
