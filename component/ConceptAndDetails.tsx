"use client";

import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css"; // or any other theme

interface Props {
  slug: string;
}

const ConceptsAndDetails: React.FC<Props> = ({ slug }) => {
  const [content, setContent] = useState<string>("");

  useEffect(() => {
    const loadMarkdown = async () => {
      try {
        const res = await fetch(`/topics/${slug}.md`);
        if (!res.ok) throw new Error("File not found");
        const text = await res.text();
        setContent(text);
      } catch {
        setContent("⚠️ Could not load topic content.");
      }
    };

    loadMarkdown();
  }, [slug]);

  return (
    <div className="flex justify-center px-4 mt-14">
      <div className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl dark:prose-invert max-w-4xl prose-pre:bg-gray-100 prose-code:bg-gray-100 sm:px-7 lg:px-10 xl:px-14 py-4 rounded-lg shadow-md">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default ConceptsAndDetails;
