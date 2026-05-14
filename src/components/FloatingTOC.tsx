import React, { useState, useRef, useEffect } from 'react';
import { List, X } from 'lucide-react';
import { Heading } from '../lib/toc';
import { cn } from '../lib/utils';

interface FloatingTOCProps {
  headings: Heading[];
  activeId?: string;
  onHeadingClick: (id: string) => void;
}

export const FloatingTOC: React.FC<FloatingTOCProps> = ({
  headings,
  activeId,
  onHeadingClick
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 24, y: 24 }); // distance from right and bottom
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0, posX: 0, posY: 0 });
  const hasDraggedRef = useRef(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = dragStartRef.current.x - e.clientX;
      const deltaY = dragStartRef.current.y - e.clientY;

      // Check if actually dragging (moved more than 5px)
      if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
        hasDraggedRef.current = true;
      }

      const newX = Math.max(0, Math.min(window.innerWidth - 50, dragStartRef.current.posX + deltaX));
      const newY = Math.max(0, Math.min(window.innerHeight - 50, dragStartRef.current.posY + deltaY));

      setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      posX: position.x,
      posY: position.y
    };
    hasDraggedRef.current = false;
    setIsDragging(true);
  };

  const handleClick = () => {
    // Only toggle if not dragging
    if (!hasDraggedRef.current) {
      setIsOpen(!isOpen);
    }
  };

  if (headings.length === 0) {
    return null;
  }

  return (
    <div
      className="fixed z-50"
      style={{ right: position.x, bottom: position.y }}
    >
      {/* Toggle Button */}
      <button
        ref={buttonRef}
        onMouseDown={handleMouseDown}
        onClick={handleClick}
        className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200",
          "border border-[hsl(var(--border))] bg-[hsl(var(--sidebar))]",
          "hover:border-[hsl(var(--primary))] hover:text-[hsl(var(--primary))]",
          "shadow-sm hover:shadow-md",
          isDragging && "cursor-grabbing",
          isOpen && !isDragging && "border-[hsl(var(--primary))] text-[hsl(var(--primary))]"
        )}
        title="Drag to move, click to toggle"
      >
        {isOpen ? <X size={18} /> : <List size={18} />}
      </button>

      {/* TOC Panel */}
      {isOpen && (
        <div
          className={cn(
            "absolute w-64 max-h-[60vh] overflow-y-auto",
            "border border-[hsl(var(--border))] bg-[hsl(var(--sidebar))]/95 backdrop-blur-sm",
            "shadow-lg rounded-none p-4",
            // Position panel based on button location
            // position.y is distance from bottom: small = near top, large = near bottom
            position.y > 300 ? "top-14" : "bottom-14",
            // position.x is distance from right: large = near left, small = near right
            position.x > 150 ? "left-0" : "right-0"
          )}
        >
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[hsl(var(--muted-foreground))] mb-3 block">
            Contents
          </span>
          <nav className="space-y-1">
            {headings.map((heading) => (
              <button
                key={heading.id}
                onClick={() => {
                  onHeadingClick(heading.id);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full text-left text-xs transition-colors py-1 px-2 rounded-none",
                  "hover:bg-[hsl(var(--border))] hover:text-[hsl(var(--foreground))]",
                  activeId === heading.id
                    ? "text-[hsl(var(--primary))] font-semibold"
                    : "text-[hsl(var(--muted-foreground))]",
                  heading.level === 1 ? "font-bold pl-2" : "",
                  heading.level === 2 ? "pl-4" : "",
                  heading.level === 3 ? "pl-6" : "",
                  heading.level === 4 ? "pl-8" : "",
                  heading.level >= 5 ? "pl-10" : ""
                )}
              >
                {heading.text}
              </button>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
};