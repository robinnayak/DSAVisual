"use client";

import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css"; // Better dark theme support
interface Props {
  slug: string;
}

const ConceptsAndDetails: React.FC<Props> = ({ slug }) => {
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const abortController = new AbortController();
    
    const loadMarkdown = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/topics/${slug}.md`, {
          signal: abortController.signal
        });
        if (!res.ok) throw new Error("File not found");
        const text = await res.text();
        setContent(text);
      } catch {
        if (!abortController.signal.aborted) {
          setContent("⚠️ Could not load topic content.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadMarkdown();
    return () => abortController.abort();
  }, [slug]);

  return (
    <div className="flex justify-center md:px-4 md:mt-14">
      <div className="w-full px-4 md:px-0 max-w-[90vw] md:max-w-2xl lg:max-w-4xl xl:max-w-6xl">
        {loading ? (
          <div className="animate-pulse prose dark:prose-invert">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-full mb-4"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-5/6 mb-4"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
          </div>
        ) : (
          <div className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl dark:prose-invert 
            prose-pre:rounded-xl prose-pre:overflow-x-auto
            prose-headings:font-medium prose-a:text-blue-600 hover:prose-a:text-blue-800
            dark:prose-a:text-blue-400 dark:hover:prose-a:text-blue-300
            prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:before:content-none 
            prose-code:after:content-none prose-pre:bg-gray-100 dark:prose-pre:bg-gray-800
            prose-blockquote:border-l-4 prose-blockquote:border-gray-200 
            dark:prose-blockquote:border-gray-600">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
              components={{
                // Add custom rendering for better mobile experience
                code({ inline, className, children, ...props }: { inline?: boolean; className?: string; children?: React.ReactNode }) {
                  return inline ? (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  ) : (
                    <pre className={className} {...(props as React.HTMLAttributes<HTMLPreElement>)}>
                      <code>{children}</code>
                    </pre>
                  );
                }
                
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConceptsAndDetails;