import React from "react";

const folders = [
  {
    name: "components/",
    description: "Reusable UI components like buttons, cards, topic lists, etc.",
    exampleFile: "DSATopicCard.tsx",
    exampleCode: [
      `const DSATopicCard = ({ title, questions }) => (
  <div>
    <h2>{title}</h2>
    <ul>
      {questions.map(q => (
        <li key={q.name}>{q.name}</li>
      ))}
    </ul>
  </div>
);`,
    ],
  },
  {
    name: "lib/data/",
    description: "Static data like arrays of questions or mock data.",
    exampleFile: "dsaTopics.ts",
    exampleCode: [
      `export const dsaTopics = [
  { title: 'Arrays', questions: [{ name: 'Two Sum', difficulty: 'Easy' }] },
];`,
    ],
  },
  {
    name: "hooks/",
    description: "Custom React hooks for logic reuse across components.",
    exampleFile: "useFetchProblems.ts",
    exampleCode: [
      `export const useFetchProblems = (topic) => {
  const [data, setData] = useState([]);
  useEffect(() => {
    fetch('/api/problems?topic=' + topic)
      .then(res => res.json())
      .then(setData);
  }, [topic]);
  return data;
};`,
    ],
  },
  {
    name: "utils/",
    description: "Utility functions (e.g., shuffle, debounce, formatting).",
    exampleFile: "shuffleArray.ts",
    exampleCode: [
      `export const shuffleArray = (arr) => {
  return [...arr].sort(() => Math.random() - 0.5);
};`,
      `export const capitalize = (str: string): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};`,
      `export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};`,
      `export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};`,
    ],
  },
  {
    name: "contexts/",
    description: "React context providers for global state.",
    exampleFile: "AuthContext.tsx",
    exampleCode: [
      `const AuthContext = createContext(null);
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};`,
    ],
  },
  {
    name: "constants/",
    description: "App-wide constants like route paths or config.",
    exampleFile: "routes.ts",
    exampleCode: `export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
};`,
  },
  {
    name: "types/",
    description: "TypeScript types or interfaces for consistent typing.",
    exampleFile: "dsa.ts",
    exampleCode: [
      `export type DSAQuestion = {
  name: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
};`,
    ],
  },
  {
    name: "styles/",
    description: "Global CSS or Tailwind config files.",
    exampleFile: "globals.css",
    exampleCode: `body {
  margin: 0;
  font-family: sans-serif;
}`,
  },
  {
    name: "assets/",
    description: "Static files like images, icons, logos, etc.",
    exampleFile: "logo.svg",
    exampleCode: [`<svg><text x="0" y="20">DSA App</text></svg>`],
  },
  {
    name: "pages/ or app/",
    description: "Next.js routing entry points for pages.",
    exampleFile: "index.tsx",
    exampleCode: [
      `import DSATopicCard from '../components/DSATopicCard';
import { dsaTopics } from '../lib/data/dsaTopics';

export default function Home() {
  return dsaTopics.map((topic) => (
    <DSATopicCard key={topic.title} {...topic} />
  ));
}`,
    ],
  },
];

const FolderStructure = () => {
  return (
    <div className="px-4 py-10 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold text-center text-blue-700 mb-6">
        📁 Folder Structure Guide with Examples
      </h1>
      <p className="text-center text-gray-600 mb-10">
        A beginner-friendly overview of typical folders in a modern React/Next.js project.
      </p>

      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
        {folders.map((folder, index) => (
          <div
            key={index}
            className="bg-white border shadow-md rounded-xl p-6 hover:shadow-lg transition"
          >
            <h2 className="text-lg font-semibold text-blue-600 mb-1">
              {folder.name}
            </h2>
            <p className="text-gray-700 mb-2">{folder.description}</p>
            <p className="text-sm text-gray-500 mb-2">
              <strong>Example File:</strong> {folder.exampleFile}
            </p>
            {Array.isArray(folder.exampleCode) ? (
              folder.exampleCode.map((example, idx) => (
                <pre
                  key={idx}
                  className="bg-gray-100 text-sm p-3 rounded mb-2 overflow-auto"
                >
                  <code>{example}</code>
                </pre>
              ))
            ) : (
              <pre className="bg-gray-100 text-sm p-3 rounded overflow-auto">
                <code>{folder.exampleCode}</code>
              </pre>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FolderStructure;
