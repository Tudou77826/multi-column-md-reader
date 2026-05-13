import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

export const MermaidRenderer: React.FC<{ chart: string, theme?: 'light' | 'dark' }> = ({ chart, theme = 'light' }) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string>('');

  useEffect(() => {
    let isMounted = true;
    const renderChart = async () => {
      try {
        if (elementRef.current) {
          mermaid.initialize({
            startOnLoad: false,
            theme: theme === 'dark' ? 'dark' : 'base',
            themeVariables: {
              fontFamily: 'var(--font-sans)',
            }
          });
          const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
          
          // Create a temporary container in the body to ensure correct measurements
          // We must render OUTSIDE the multi-column layout because CSS multi-column 
          // breaks getBoundingClientRect() which mermaid/dagre relies on.
          const container = document.createElement('div');
          
          // Use absolute positioning far off-screen to guarantee elements have layout
          // but don't cause scrolling or visual flashes.
          container.style.position = 'absolute';
          container.style.top = '-10000px';
          container.style.left = '-10000px';
          container.style.width = '1024px'; 
          // Crucial: leave height auto so mermaid can measure actual heights
          container.style.visibility = 'visible';
          
          document.body.appendChild(container);
          
          try {
            const { svg } = await mermaid.render(id, chart.trim(), container);
            if (isMounted) {
              setSvgContent(svg);
            }
          } finally {
            if (document.body.contains(container)) {
              document.body.removeChild(container);
            }
          }
        }
      } catch (error) {
        console.error("Mermaid parsing failed", error);
        if (isMounted) {
          setSvgContent(`<div class="text-[hsl(var(--foreground))] font-mono text-xs p-4 border border-[hsl(var(--border))]">Error parsing Mermaid diagram</div>`);
        }
      }
    };
    
    // Add a tiny delay to ensure React commits to DOM before we start measuring
    const timeoutId = setTimeout(renderChart, 50);
    return () => { 
      isMounted = false; 
      clearTimeout(timeoutId);
    };
  }, [chart, theme]);

  return (
    <div 
      ref={elementRef}
      className="flex justify-center w-full"
      dangerouslySetInnerHTML={{ __html: svgContent }} 
    />
  );
};

