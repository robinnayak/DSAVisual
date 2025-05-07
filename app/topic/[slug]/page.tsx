"use client";
// export const runtime = "edge";

import { animationComponents } from "@/component/animations";
import LinkedListFlow from "@/component/codeflow/LinkedListFlow";
import ConceptsAndDetails from "@/component/ConceptAndDetails";
import { useParams } from "next/navigation";
import React from "react";

const TopicPage = () => {
  const params = useParams();
  const slug = params.slug as string;
  const AnimationComponent = animationComponents[slug];

  // console.log("slug", slug);
  // console.log("AnimationComponent", AnimationComponent);
  if (!AnimationComponent) {
    return <div>Animation not found</div>;
  }

  return (
    <>
      {/* Animated visualization */}
      <div className="">
        <AnimationComponent />
        <LinkedListFlow />
        <ConceptsAndDetails slug={slug} />
      </div>
    </>
  );
};

export default TopicPage;
