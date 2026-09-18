"use client";

import { useState, useRef, useEffect } from "react";
import { ArrowIcon } from "./ArrowIcon";

interface InteractiveListItemProps {
  title: string;
  href?: string;
  defaultHovered?: boolean;
}

export function InteractiveListItem({
  title,
  href = "#",
  defaultHovered = false,
}: InteractiveListItemProps) {
  const [isHovered, setIsHovered] = useState(defaultHovered);
  const [wasHovered, setWasHovered] = useState(defaultHovered);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsHovered(true);
    setWasHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    timeoutRef.current = setTimeout(() => {
      setWasHovered(false);
    }, 200);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <a
      href={href}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`group relative flex w-full items-center justify-between overflow-hidden cursor-pointer select-none no-underline transition-[height] duration-300 ease-out ${
        isHovered ? "h-[60px]" : "h-[22px]"
      }`}
    >
      {/* Grey fill bar moving from left to right */}
      <div
        className={`absolute inset-0 bg-[#f2f2f2] origin-left transition-transform duration-300 ease-out ${
          isHovered ? "scale-x-100" : "scale-x-0"
        }`}
      />

      {/* Item label */}
      <span
        className={`relative z-10 font-mono text-[14px] text-[#111111] transition-all duration-300 ease-out ${
          isHovered
            ? "pl-[16px] font-medium uppercase"
            : "pl-0 font-normal normal-case"
        }`}
      >
        {title}
      </span>

      {/* Arrow button flickering in / out */}
      <div className="relative z-10 shrink-0">
        {isHovered ? (
          <div className="animate-flicker-in">
            <ArrowIcon />
          </div>
        ) : wasHovered ? (
          <div className="animate-flicker-out">
            <ArrowIcon />
          </div>
        ) : null}
      </div>
    </a>
  );
}
