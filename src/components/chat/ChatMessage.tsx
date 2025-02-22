import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';       // GitHub-flavored markdown support
import remarkMath from 'remark-math';     // Math expression support
import rehypeKatex from 'rehype-katex';    // Render math with KaTeX

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

import { ChatMessage as ChatMessageType } from '../../types';
// Make sure to import your File icon/component if available
// import File from '../icons/File';

interface ChatMessageProps {
  message: ChatMessageType;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.type === 'user';

  // Custom renderer for code blocks to enable syntax highlighting with text color "text-text"
  const renderers = {
    code({ node, inline, className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || '');
      if (!inline && match) {
        return (
          <SyntaxHighlighter
            style={tomorrow}
            language={match[1]}
            PreTag="div"
            className="text-text"
            {...props}
          >
            {String(children).replace(/\n$/, '')}
          </SyntaxHighlighter>
        );
      }
      return (
        <code className={`${className || ''} text-text`} {...props}>
          {children}
        </code>
      );
    },
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] rounded-lg p-4 ${
          isUser ? 'bg-surface' : message.isError ? 'bg-red-100' : 'bg-background'
        }`}
      >
        {/* Render the message content as Markdown with the text-text color */}
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkMath]}
          rehypePlugins={[rehypeKatex]}
          components={renderers}
          className="prose prose-sm text-text"  // Added text-text here
        >
          {message.content}
        </ReactMarkdown>

        {message.files && message.files.length > 0 && (
          <div className="mt-2 grid gap-2">
            {message.files.map(file => (
              <div key={file.id} className="flex items-center text-sm text-blue-500">
                {/* Replace <File /> with your actual file icon component if available */}
                <File className="w-4 h-4 mr-1" />
                {file.name}
              </div>
            ))}
          </div>
        )}

        {message.customer && (
          <div className={`mt-2 text-sm ${isUser ? 'text-blue-100' : 'text-gray-600'}`}>
            Customer: {message.customer}
          </div>
        )}
      </div>
    </div>
  );
}