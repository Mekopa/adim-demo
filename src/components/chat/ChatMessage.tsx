import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ChatMessage as ChatMessageType } from '../../types';
import { Loader2, FileText } from 'lucide-react';

interface ChatMessageProps {
  message: ChatMessageType;
  isLastUser?: boolean;
  isLastAssistant?: boolean;
}

export default function ChatMessage({ message, isLastUser, isLastAssistant }: ChatMessageProps) {
  const isUser = message.type === 'user';

  // Container styling for proper scrolling and layout
  const containerStyle = {
    ...(isLastAssistant || (message.isLoading && message.type === 'assistant') ? { minHeight: 'calc(-330px + 100dvh)' } : {}),
    ...(isLastUser && { scrollMarginTop: '100px' }),
  };

  // Custom renderer for code blocks to enable syntax highlighting
  const renderers = {
    code({ node, inline, className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || '');
      if (!inline && match) {
        return (
          <SyntaxHighlighter
            style={tomorrow}
            language={match[1]}
            PreTag="div"
            className={isUser ? "text-white/90" : "text-text"}
            {...props}
          >
            {String(children).replace(/\n$/, '')}
          </SyntaxHighlighter>
        );
      }
      return (
        <code className={`${className || ''} ${isUser ? "text-white/90" : "text-text"}`} {...props}>
          {children}
        </code>
      );
    },
  };

  // Loading state from the new UI
  if (message.isLoading) {
    return (
      <div className="flex justify-start" style={containerStyle}>
        <div className="max-w-[80%] rounded-lg p-4 text-text">
          <div className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-primary" />
            <span className="text-text-secondary">Thinking...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`} style={containerStyle}>
      <div
        className={`max-w-[80%] rounded-lg p-4 ${
          isUser 
            ? 'bg-primary text-white' 
            : message.isError 
              ? 'bg-red-100 text-red-800' 
              : 'text-text'
        }`}
      >
        {/* Render the message content as Markdown with appropriate styling */}
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkMath]}
          rehypePlugins={[rehypeKatex]}
          components={renderers}
          className={`prose prose-sm ${
            isUser 
              ? 'text-white prose-headings:text-white prose-a:text-white/90 prose-strong:text-white' 
              : 'text-text'
          }`}
        >
          {message.content}
        </ReactMarkdown>

        {/* Render attached files */}
        {message.files && message.files.length > 0 && (
          <div className="mt-2 grid gap-2">
            {message.files.map(file => (
              <div 
                key={file.id} 
                className={`flex items-center text-sm ${isUser ? 'text-white/80' : 'text-blue-500'}`}
              >
                <FileText className="w-4 h-4 mr-1" />
                {file.name}
              </div>
            ))}
          </div>
        )}

        {/* Customer information */}
        {message.customer && (
          <div className={`mt-2 text-sm ${isUser ? 'text-white/80' : 'text-text-secondary'}`}>
            Customer: {message.customer}
          </div>
        )}
      </div>
    </div>
  );
}