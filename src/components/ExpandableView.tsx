import React, { useState, useRef, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Maximize2, X, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { cn } from '../lib/utils';

interface ExpandableViewProps {
  children: React.ReactNode;
  className?: string;
  previewMaxHeight?: string;
  type?: 'table' | 'mermaid';
}

export const ExpandableView: React.FC<ExpandableViewProps> = ({
  children,
  className,
  previewMaxHeight = '200px',
  type = 'table'
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const MIN_SCALE = 0.1;
  const MAX_SCALE = 10;
  const SCALE_STEP = 0.1;

  const resetZoom = useCallback(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (type !== 'mermaid') return;
    e.preventDefault();

    const delta = e.deltaY > 0 ? -SCALE_STEP : SCALE_STEP;
    const newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, scale + delta));

    // Zoom towards cursor position
    if (containerRef.current && contentRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      // Calculate new position to keep cursor over same point
      const scaleRatio = newScale / scale;
      const newX = mouseX - (mouseX - position.x) * scaleRatio;
      const newY = mouseY - (mouseY - position.y) * scaleRatio;

      setPosition({ x: newX, y: newY });
    }

    setScale(newScale);
  }, [scale, position, type]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (type !== 'mermaid' || e.button !== 0) return;
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  }, [position, type]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const zoomIn = useCallback(() => {
    setScale(Math.min(MAX_SCALE, scale + SCALE_STEP * 2));
  }, [scale]);

  const zoomOut = useCallback(() => {
    setScale(Math.max(MIN_SCALE, scale - SCALE_STEP * 2));
  }, [scale]);

  // Reset zoom when modal closes
  useEffect(() => {
    if (!isExpanded) {
      resetZoom();
    }
  }, [isExpanded, resetZoom]);

  // Handle mouse events for dragging
  useEffect(() => {
    if (!isDragging) return;

    const handleGlobalMouseMove = (e: MouseEvent) => {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    };

    const handleGlobalMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener('mousemove', handleGlobalMouseMove);
    window.addEventListener('mouseup', handleGlobalMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging, dragStart]);

  return (
    <>
      <div
        className={cn(
          "relative group cursor-pointer border border-[hsl(var(--border))] rounded-sm overflow-hidden bg-[hsl(var(--sidebar))] my-4 break-inside-avoid",
          className
        )}
        onClick={() => setIsExpanded(true)}
      >
        <div
          className={cn(
            "overflow-hidden pointer-events-none relative",
            type === 'mermaid' ? "flex items-center justify-center p-4 bg-white" : ""
          )}
          style={{ maxHeight: previewMaxHeight }}
        >
          {children}
        </div>

        {/* Overlay gradient & button */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[hsl(var(--sidebar))] to-transparent pointer-events-none flex items-end justify-center pb-2">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] px-3 py-1.5 rounded-none text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 shadow-md">
            <Maximize2 className="w-3 h-3" />
            Expand {type === 'mermaid' ? 'Diagram' : 'Table'}
          </div>
        </div>
      </div>

      {isExpanded && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm md-reader">
          <div
            className="relative bg-[hsl(var(--background))] w-full h-[90vh] overflow-hidden rounded-sm shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
            style={{ columnCount: 'initial', columnWidth: 'initial', columnFill: 'initial' }}
          >
            <div className="border-b border-[hsl(var(--border))] p-4 flex justify-between items-center bg-[hsl(var(--sidebar))] z-10 flex-shrink-0">
              <span className="text-xs font-bold uppercase tracking-widest text-[hsl(var(--muted-foreground))]">
                {type === 'mermaid' ? 'Mermaid Diagram' : 'Data Table'}
              </span>

              {/* Zoom controls for mermaid */}
              {type === 'mermaid' && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[hsl(var(--muted-foreground))] mr-2">
                    {Math.round(scale * 100)}%
                  </span>
                  <button
                    className="p-1.5 text-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))] hover:text-[hsl(var(--primary-foreground))] transition-colors border border-[hsl(var(--primary))]"
                    onClick={zoomOut}
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <button
                    className="p-1.5 text-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))] hover:text-[hsl(var(--primary-foreground))] transition-colors border border-[hsl(var(--primary))]"
                    onClick={zoomIn}
                    title="Zoom In"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                  <button
                    className="p-1.5 text-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))] hover:text-[hsl(var(--primary-foreground))] transition-colors border border-[hsl(var(--primary))]"
                    onClick={resetZoom}
                    title="Reset"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <div className="w-px h-4 bg-[hsl(var(--border))] mx-1" />
                  <button
                    className="p-1.5 text-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))] hover:text-[hsl(var(--primary-foreground))] transition-colors border border-[hsl(var(--primary))]"
                    onClick={() => setIsExpanded(false)}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {type !== 'mermaid' && (
                <button
                  className="p-1.5 text-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))] hover:text-[hsl(var(--primary-foreground))] transition-colors border border-[hsl(var(--primary))]"
                  onClick={() => setIsExpanded(false)}
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div
              ref={containerRef}
              className={cn(
                "w-full overflow-hidden flex-1",
                type === 'mermaid' ? "bg-white relative" : "overflow-auto p-8"
              )}
              onWheel={handleWheel}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              style={type === 'mermaid' ? { cursor: isDragging ? 'grabbing' : 'grab' } : undefined}
            >
              {type === 'mermaid' ? (
                <div
                  ref={contentRef}
                  className="flex items-center justify-center min-w-full min-h-full"
                  style={{
                    transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                    transformOrigin: '0 0',
                    transition: isDragging ? 'none' : 'transform 0.1s ease-out'
                  }}
                >
                  <div className="p-8">
                    {children}
                  </div>
                </div>
              ) : (
                <div className="p-8">
                  {children}
                </div>
              )}
            </div>

            {/* Help text for mermaid */}
            {type === 'mermaid' && (
              <div className="absolute bottom-4 left-4 text-xs text-gray-400 bg-white/80 px-2 py-1 rounded">
                Scroll to zoom • Drag to pan
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </>
  );
};
