"use client";
// export const runtime = "edge";

import { animationComponents } from "@/component/animations";
// import LinkedListStep from "@/component/codeflowstep/LinkedListStep";
import ConceptsAndDetails from "@/component/ConceptAndDetails";
import ErrorBoundary from "@/component/ErrorBoundary";
import { useParams } from "next/navigation";
import Link from "next/link";
import React from "react";

const TopicPage = () => {
  const params = useParams();
  const slug = params.slug as string;
  const AnimationComponent = animationComponents[slug];

  if (!AnimationComponent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-700 mb-4">Animation Not Found</h1>
          <p className="text-gray-500 mb-4">The animation for &quot;{slug}&quot; is not available yet.</p>
          <Link href="/" className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      {/* Animated visualization */}
      <div className="">
        <AnimationComponent />
        {/* Only show LinkedListStep for linked list topics
        {(slug === "linkedlist" || slug === "doublylinkedlist" || slug === "circularlinkedlist") && (
          <LinkedListStep />
        )} */}
        <ConceptsAndDetails slug={slug} />
      </div>
    </ErrorBoundary>
  );
};

export default TopicPage;
