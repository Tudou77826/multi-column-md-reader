import React from 'react';
import ReactMarkdown, { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { cn } from '../lib/utils';
import { ExpandableView } from './ExpandableView';
import { MermaidRenderer } from './MermaidRenderer';

interface MarkdownViewerProps {
  content: string;
  theme: 'light' | 'dark';
  className?: string;
  style?: React.CSSProperties;
}

export const MarkdownViewer: React.FC<MarkdownViewerProps> = ({ content, theme, className, style }) => {
  const components: Components = {
    code(props) {
      const { children, className, node, ...rest } = props;
      const match = /language-(\w+)/.exec(className || '');
      const language = match ? match[1] : '';

      if (language === 'mermaid') {
        return (
          <ExpandableView type="mermaid" previewMaxHeight="240px">
            <MermaidRenderer chart={String(children)} theme={theme} />
          </ExpandableView>
        );
      }

      return match ? (
        <SyntaxHighlighter
          {...(rest as any)}
          PreTag="div"
          children={String(children).replace(/\n$/, '')}
          language={language}
          style={vscDarkPlus}
        />
      ) : (
        <code {...rest} className={className}>
          {children}
        </code>
      );
    },
    table(props) {
      const { node, ...rest } = props;
      return (
        <ExpandableView type="table" previewMaxHeight="200px">
          {/* We wrap it in a div that is full width but allows the table to expand safely */}
          <div className="w-full">
            <table {...rest} className="w-full border-collapse" />
          </div>
        </ExpandableView>
      );
    }
  };

  return (
    <div className={cn("md-reader overflow-visible", className)} style={style}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content || '*No content provided.*'}
      </ReactMarkdown>
    </div>
  );
};

