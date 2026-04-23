"use client";

import { useEffect, useState } from "react";

export function Typewriter({
  lines,
  className = "",
  lineClassName = "",
  goldDot = false,
  speed = 60,
  lineDelay = 300,
}: {
  lines: string[];
  className?: string;
  lineClassName?: string;
  goldDot?: boolean;
  speed?: number;
  lineDelay?: number;
}) {
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    if (currentLine >= lines.length) {
      // Done typing - blink cursor then hide
      const blinkTimeout = setTimeout(() => setShowCursor(false), 2000);
      
return () => clearTimeout(blinkTimeout);
    }

    const line = lines[currentLine];

    if (currentChar < line.length) {
      const timeout = setTimeout(() => {
        setDisplayedLines((prev) => {
          const updated = [...prev];
          updated[currentLine] = line.slice(0, currentChar + 1);
          
return updated;
        });
        setCurrentChar((c) => c + 1);
      }, speed);
      
return () => clearTimeout(timeout);
    } else {
      // Line complete - move to next after delay
      const timeout = setTimeout(() => {
        setCurrentLine((l) => l + 1);
        setCurrentChar(0);
        setDisplayedLines((prev) => [...prev, ""]);
      }, lineDelay);
      
return () => clearTimeout(timeout);
    }
  }, [currentLine, currentChar, lines, speed, lineDelay]);

  // Initialize first line
  useEffect(() => {
    setDisplayedLines([""]);
  }, []);

  // Cursor blink
  const [cursorVisible, setCursorVisible] = useState(true);
  useEffect(() => {
    if (!showCursor) return;
    const interval = setInterval(() => setCursorVisible((v) => !v), 530);
    
return () => clearInterval(interval);
  }, [showCursor]);

  return (
    <div className={className}>
      {displayedLines.map((text, i) => (
        <span key={i} className={`block ${lineClassName}`}>
          {text}
          {goldDot && i === lines.length - 1 && currentLine >= lines.length && (
            <span style={{ color: "var(--gold)", textShadow: "0 0 60px oklch(0.75 0.12 85 / 0.3), 0 0 120px oklch(0.75 0.12 85 / 0.1)" }}>.</span>
          )}
          {i === currentLine && showCursor && (
            <span
              className="inline-block w-[0.06em] translate-y-[0.05em] align-baseline"
              style={{
                height: "0.85em",
                background: "var(--gold)",
                opacity: cursorVisible ? 1 : 0,
                transition: "opacity 0.1s",
                marginLeft: "0.04em",
              }}
            />
          )}
        </span>
      ))}
    </div>
  );
}
