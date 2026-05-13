import React, { useState, useEffect, useRef } from 'react';
import { Settings2, Upload, AlignLeft, AlignJustify, Moon, Sun, Type, Columns, SplitSquareVertical, ArrowLeftRight, FileText, ChevronLeft, ChevronRight, Menu, X, PanelLeftClose, PanelLeft } from 'lucide-react';
import { MarkdownViewer } from './components/MarkdownViewer';
import { defaultMarkdown } from './lib/defaultMarkdown';
import { cn } from './lib/utils';

export default function App() {
  const [content, setContent] = useState(defaultMarkdown);
  const [columns, setColumns] = useState(3);
  const [gap, setGap] = useState(32); // px
  const [fontSize, setFontSize] = useState(14); // px
  const [lineHeight, setLineHeight] = useState(1.6);
  const [fontFamily, setFontFamily] = useState<'sans' | 'serif' | 'mono'>('sans');
  const [textAlign, setTextAlign] = useState<'left' | 'justify'>('left');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Handle horizontal scrolling and pagination
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      // Convert vertical scroll to horizontal scroll when holding shift is not available
      // and user is clearly trying to scroll the page.
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        container.scrollLeft += e.deltaY;
        e.preventDefault();
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, []);

  const handleNextPage = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const pageScroll = container.clientWidth + gap;
      container.scrollBy({ left: pageScroll, behavior: 'smooth' });
    }
  };

  const handlePrevPage = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const pageScroll = container.clientWidth + gap;
      container.scrollBy({ left: -pageScroll, behavior: 'smooth' });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result;
      if (typeof result === 'string') {
        setContent(result);
      }
    };
    reader.readAsText(file);
    
    // reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[hsl(var(--background))]">
      {/* Sidebar Controls */}
      <aside 
        className={cn(
          "flex-shrink-0 border-r border-[hsl(var(--border))] bg-[hsl(var(--sidebar))] transition-all duration-300 flex flex-col font-sans",
          isSidebarOpen ? "w-80" : "w-0 overflow-hidden border-none"
        )}
      >
        <div className="p-6 pb-2 min-w-[320px]">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[hsl(var(--muted-foreground))] mb-6 block">
            Settings
          </span>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-8 min-w-[320px] text-sm">
          {/* File Input */}
          <div className="space-y-3">
            <div className="flex gap-2">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center flex-1 gap-2 border border-[hsl(var(--primary))] text-[hsl(var(--primary))] rounded-none px-4 py-2 text-[10px] uppercase tracking-widest font-bold hover:bg-[hsl(var(--primary))] hover:text-[hsl(var(--primary-foreground))] transition-colors"
              >
                <Upload className="w-4 h-4" />
                Import File
              </button>
              <input 
                type="file" 
                accept=".md,.txt" 
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden" 
              />
            </div>
            <textarea 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="或者在这里粘贴 Markdown 代码..."
              className="w-full h-32 rounded-none border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-2 text-xs focus:outline-none focus:border-[hsl(var(--primary))] focus:ring-1 focus:ring-[hsl(var(--primary))] font-mono resize-none"
            />
          </div>

          {/* Layout Configurations */}
          <div className="space-y-6 pt-4 border-t border-[hsl(var(--border))]">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[hsl(var(--muted-foreground))] mb-4 block">Layout</span>
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider flex items-center justify-between">
                <span className="flex items-center gap-2">Columns</span>
                <span className="text-[hsl(var(--primary))] font-serif italic text-sm">0{columns}</span>
              </label>
              <input 
                type="range" min="1" max="5" step="1" 
                value={columns} onChange={(e) => setColumns(Number(e.target.value))}
                className="w-full h-1 bg-[hsl(var(--border))] rounded-none appearance-none cursor-pointer accent-[hsl(var(--primary))]"
              />
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider flex items-center justify-between">
                <span className="flex items-center gap-2">Gap</span>
                <span className="text-[hsl(var(--primary))] font-serif italic text-sm">{gap}px</span>
              </label>
              <input 
                type="range" min="16" max="96" step="4" 
                value={gap} onChange={(e) => setGap(Number(e.target.value))}
                className="w-full h-1 bg-[hsl(var(--border))] rounded-none appearance-none cursor-pointer accent-[hsl(var(--primary))]"
              />
            </div>
          </div>

          {/* Typography Configurations */}
          <div className="space-y-6 pt-6 border-t border-[hsl(var(--border))]">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[hsl(var(--muted-foreground))] mb-4 block">Typography</span>
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">Font Family</label>
              <div className="flex border border-[hsl(var(--primary))] p-0.5 max-w-full">
                {['sans', 'serif', 'mono'].map(f => (
                  <button
                    key={f}
                    onClick={() => setFontFamily(f as any)}
                    className={cn(
                      "flex-1 px-3 py-1 text-[10px] font-bold uppercase tracking-widest transition-colors",
                      fontFamily === f ? "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]" : "hover:bg-[hsl(var(--border))] text-[hsl(var(--primary))]"
                    )}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider flex items-center justify-between">
                <span>Font Size</span>
                <span className="text-[hsl(var(--primary))] font-serif italic text-sm">{fontSize}px</span>
              </label>
              <input 
                type="range" min="12" max="24" step="1" 
                value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))}
                className="w-full h-1 bg-[hsl(var(--border))] rounded-none appearance-none cursor-pointer accent-[hsl(var(--primary))]"
              />
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider flex items-center justify-between">
                <span className="flex items-center gap-2">Line Height</span>
                <span className="text-[hsl(var(--primary))] font-serif italic text-sm">{lineHeight}</span>
              </label>
              <input 
                type="range" min="1.2" max="2.5" step="0.1" 
                value={lineHeight} onChange={(e) => setLineHeight(Number(e.target.value))}
                className="w-full h-1 bg-[hsl(var(--border))] rounded-none appearance-none cursor-pointer accent-[hsl(var(--primary))]"
              />
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">Alignment</label>
              <div className="flex border border-[hsl(var(--primary))] p-0.5">
                <button
                  onClick={() => setTextAlign('left')}
                  className={cn(
                    "flex-1 px-3 py-1 flex items-center justify-center transition-colors",
                    textAlign === 'left' ? "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]" : "hover:bg-[hsl(var(--border))] text-[hsl(var(--primary))]"
                  )}
                >
                  <AlignLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setTextAlign('justify')}
                  className={cn(
                    "flex-1 px-3 py-1 flex items-center justify-center transition-colors",
                    textAlign === 'justify' ? "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]" : "hover:bg-[hsl(var(--border))] text-[hsl(var(--primary))]"
                  )}
                >
                  <AlignJustify className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-[hsl(var(--border))] min-w-[320px] bg-[hsl(var(--sidebar))]">
          <button 
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className="flex items-center justify-center w-full gap-2 border border-[hsl(var(--primary))] text-[hsl(var(--primary))] bg-transparent px-4 py-2 text-[10px] uppercase font-bold tracking-widest hover:bg-[hsl(var(--primary))] hover:text-[hsl(var(--primary-foreground))] transition-colors"
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <header className="h-10 border-b border-[hsl(var(--border))] flex items-center px-5 bg-[hsl(var(--sidebar))] z-10 flex-shrink-0 justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-[hsl(var(--foreground))] hover:text-[hsl(var(--muted-foreground))] transition-colors focus:outline-none"
              title={isSidebarOpen ? 'Hide Menu' : 'Show Menu'}
            >
              {isSidebarOpen ? <PanelLeftClose size={18} /> : <PanelLeft size={18} />}
            </button>
            <div className="text-lg font-serif italic font-bold tracking-tight text-[hsl(var(--foreground))]">Chronicle.</div>
          </div>
          <div className="flex items-center gap-4">
            {/* Header right side content can go here if needed in the future */}
          </div>
        </header>

        <div className="flex-1 w-full bg-[hsl(var(--background))] overflow-hidden relative flex flex-col">
          <div className="flex-1 w-full p-4 sm:p-6 md:p-8 overflow-hidden">
            <div 
              ref={scrollContainerRef}
              className="w-full h-full overflow-x-auto overflow-y-hidden hide-scrollbar"
              style={{ containerType: 'size' }}
            >
              <MarkdownViewer 
                content={content} 
                theme={theme}
                className="h-full"
                style={{
                  columnWidth: `calc((100cqw - ${(columns - 1) * gap}px) / ${columns})`,
                  columnGap: `${gap}px`,
                  columnFill: 'auto',
                  fontSize: `${fontSize}px`,
                  lineHeight: lineHeight,
                  fontFamily: `var(--font-${fontFamily})`,
                  textAlign: textAlign,
                }}
              />
            </div>
          </div>
          
          {/* Footer Status Bar with Pagination */}
          <footer className="px-8 py-3 border-t border-[hsl(var(--border))] flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-[hsl(var(--muted-foreground))] bg-[hsl(var(--sidebar))] z-10 flex-shrink-0">
            <div className="flex gap-6 items-center">
              <span>Words: {content.split(/\s+/).filter(Boolean).length}</span>
              <div className="flex items-center gap-1 border-l border-[hsl(var(--border))] pl-6">
                <button 
                  onClick={handlePrevPage}
                  className="px-3 py-1.5 flex items-center gap-1 hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--border))] transition-colors"
                >
                  <ChevronLeft className="w-3 h-3" /> Prev Page
                </button>
                <button 
                  onClick={handleNextPage}
                  className="px-3 py-1.5 flex items-center gap-1 hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--border))] transition-colors"
                >
                  Next Page <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
            <div className="flex gap-4 items-center">
              <span className="text-[hsl(var(--foreground))]">Markdown Rendered</span>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}

