"use client";

import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import LoadingSpinner from "./LoadingSpinner";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Clock, ArrowUp } from "lucide-react";
import "highlight.js/styles/atom-one-dark.css";

interface Props {
  slug: string;
}

const ConceptsAndDetails: React.FC<Props> = ({ slug }) => {
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [readingTime, setReadingTime] = useState(0);

  useEffect(() => {
    const abortController = new AbortController();
    
    const loadMarkdown = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/topics/${slug}.md`, {
          signal: abortController.signal
        });
        if (!res.ok) {
          throw new Error(`Failed to load content: ${res.status}`);
        }
        const text = await res.text();
        setContent(text);
        
        // Calculate reading time (average 200 words per minute)
        const words = text.split(/\s+/).length;
        const time = Math.ceil(words / 200);
        setReadingTime(time);
      } catch (err) {
        if (!abortController.signal.aborted) {
          setError(err instanceof Error ? err.message : "Failed to load content");
          setContent("");
        }
      } finally {
        if (!abortController.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadMarkdown();
    return () => abortController.abort();
  }, [slug]);

  // Scroll to top functionality
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const formatTitle = (slug: string) => {
    return slug
      .split(/[-_]/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <LoadingSpinner text="Loading topic details..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-8 bg-white rounded-2xl shadow-xl border border-red-100 max-w-md"
        >
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-2xl font-bold text-red-600 mb-2">Content Unavailable</h3>
          <p className="text-red-500 mb-4">{error}</p>
          <p className="text-gray-600 leading-relaxed">
            The detailed explanation for this topic is not available yet. 
            Check back later or try another topic.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-16 z-10"
      >
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl text-white">
                <BookOpen size={24} />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  {formatTitle(slug)}
                </h1>
                <p className="text-gray-600 mt-1">Comprehensive Guide & Implementation</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Clock size={16} />
              <span>{readingTime} min read</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Content Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="max-w-4xl mx-auto px-6 py-8"
      >
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Content Header */}
          <div className="bg-gradient-to-r from-blue-500/5 to-purple-500/5 px-8 py-6 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Theory & Implementation</h2>
                <p className="text-gray-600 text-sm">Deep dive into concepts, examples, and code</p>
              </div>
            </div>
          </div>

          {/* Markdown Content */}
          <div className="px-8 py-8">
            <article className="prose prose-lg max-w-none
              prose-headings:text-gray-900 prose-headings:font-semibold prose-headings:tracking-tight
              prose-h1:text-3xl prose-h1:mb-8 prose-h1:pb-4 prose-h1:border-b prose-h1:border-gray-200
              prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:text-blue-900
              prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4 prose-h3:text-purple-900
              prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-6
              prose-a:text-blue-600 prose-a:no-underline hover:prose-a:text-blue-800 hover:prose-a:underline
              prose-strong:text-gray-900 prose-strong:font-semibold
              prose-em:text-gray-800 prose-em:italic
              prose-ul:my-6 prose-li:my-2 prose-li:text-gray-700
              prose-ol:my-6 prose-ol:text-gray-700
              prose-blockquote:border-l-4 prose-blockquote:border-blue-200 prose-blockquote:bg-blue-50/50 
              prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-lg prose-blockquote:my-6
              prose-blockquote:text-blue-900 prose-blockquote:font-medium
              prose-code:text-purple-600 prose-code:bg-purple-50 prose-code:px-2 prose-code:py-1 
              prose-code:rounded prose-code:font-mono prose-code:text-sm prose-code:before:content-none 
              prose-code:after:content-none
              prose-pre:bg-gray-900 prose-pre:rounded-xl prose-pre:p-6 prose-pre:overflow-x-auto 
              prose-pre:shadow-lg prose-pre:border prose-pre:border-gray-200
              prose-table:border-collapse prose-table:my-8
              prose-th:bg-gray-50 prose-th:p-4 prose-th:text-left prose-th:font-semibold prose-th:border
              prose-td:p-4 prose-td:border prose-td:text-gray-700
              prose-img:rounded-lg prose-img:shadow-md prose-img:mx-auto
              prose-hr:border-gray-200 prose-hr:my-12
            ">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
                components={{
                  code({ inline, className, children, ...props }: { 
                    inline?: boolean; 
                    className?: string; 
                    children?: React.ReactNode 
                  }) {
                    if (inline) {
                      return (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      );
                    }
                    
                    // Block code with enhanced styling
                    return (
                      <div className="relative group">
                        <pre className={className} {...(props as React.HTMLAttributes<HTMLPreElement>)}>
                          <code>{children}</code>
                        </pre>
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="bg-black/20 text-white text-xs px-2 py-1 rounded">
                            Code Block
                          </div>
                        </div>
                      </div>
                    );
                  },
                  
                  // Enhanced blockquote styling
                  blockquote({ children, ...props }) {
                    return (
                      <blockquote {...props} className="not-prose relative">
                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-blue-400 p-6 rounded-r-xl my-6 shadow-sm">
                          <div className="absolute top-2 left-2 text-blue-400 opacity-50">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M14,17H17L19,13V7H13V13H16M6,17H9L11,13V7H5V13H8L6,17Z" />
                            </svg>
                          </div>
                          <div className="text-blue-900 font-medium leading-relaxed pl-4">
                            {children}
                          </div>
                        </div>
                      </blockquote>
                    );
                  },
                  
                  // Enhanced heading with anchor links
                  h2({ children, ...props }) {
                    const id = typeof children === 'string' 
                      ? children.toLowerCase().replace(/\s+/g, '-') 
                      : '';
                    return (
                      <h2 id={id} {...props} className="group flex items-center">
                        <span className="text-2xl font-semibold text-blue-900 mt-12 mb-6">
                          {children}
                        </span>
                        <a href={`#${id}`} className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-blue-400 hover:text-blue-600">#</span>
                        </a>
                      </h2>
                    );
                  }
                }}
              >
                {content}
              </ReactMarkdown>
            </article>
          </div>

          {/* Content Footer */}
          <div className="bg-gray-50/50 px-8 py-6 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                <span>📖 Topic: </span>
                <span className="font-medium text-gray-900">{formatTitle(slug)}</span>
              </div>
              <div className="text-sm text-gray-500">
                Happy learning! 🚀
              </div>
            </div>
          </div>
        </div>

        {/* Additional Learning Resources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 grid md:grid-cols-2 gap-6"
        >
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <span className="text-2xl mr-2">💡</span>
              Practice Tips
            </h3>
            <ul className="text-gray-700 space-y-2 text-sm">
              <li>• Start with the basic implementation</li>
              <li>• Trace through examples step by step</li>
              <li>• Practice with different input sizes</li>
              <li>• Understand time and space complexity</li>
            </ul>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <span className="text-2xl mr-2">🎯</span>
              Next Steps
            </h3>
            <ul className="text-gray-700 space-y-2 text-sm">
              <li>• Implement variations of the algorithm</li>
              <li>• Solve related LeetCode problems</li>
              <li>• Compare with other approaches</li>
              <li>• Build real-world applications</li>
            </ul>
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-shadow z-50"
          >
            <ArrowUp size={20} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ConceptsAndDetails;