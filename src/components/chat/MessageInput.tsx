import React, { useRef, useState, useEffect } from 'react';
import { History, Send } from 'lucide-react';

interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onShowHistory: () => void;
  error: string | null;
  autoFocus?: boolean;
  showHistoryButton?: boolean;
}

export default function MessageInput({ 
  value, 
  onChange, 
  onSubmit, 
  onShowHistory,
  error,
  autoFocus,
  showHistoryButton = true
}: MessageInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    setIsTyping(value.length > 0);
  }, [value]);

  // Auto-focus the textarea
  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [autoFocus]);

  // Auto-adjust textarea height
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const newHeight = Math.min(textarea.scrollHeight, 400); // Max 10 lines (40px per line)
      textarea.style.height = `${newHeight}px`;
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onSubmit();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Handle global keypress for typing
  useEffect(() => {
    const handleGlobalKeyPress = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }
      
      if (e.ctrlKey || e.altKey || e.metaKey) {
        return;
      }

      if (textareaRef.current && e.key.length === 1) {
        textareaRef.current.focus();
      }
    };

    window.addEventListener('keypress', handleGlobalKeyPress);
    return () => window.removeEventListener('keypress', handleGlobalKeyPress);
  }, []);

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative flex items-start gap-3 p-4">
        {/* History Button */}
        <div className={`transition-all duration-300 ease-in-out transform ${
          isTyping || !showHistoryButton
            ? 'opacity-0 scale-90 w-0 -ml-2' 
            : 'opacity-100 scale-100 w-auto'
        }`}>
          <button
            type="button"
            onClick={onShowHistory}
            className="p-1 text-text-secondary hover:bg-background rounded-lg transition-colors flex-shrink-0"
            aria-label="View history"
          >
            <History className="w-6 h-6" />
          </button>
        </div>

        {/* Input Field */}
        <div className="relative flex-1">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="w-full resize-none bg-transparent focus:outline-none focus:ring-0 border-0 p-0 pr-12 text-text placeholder-text-secondary"
            style={{ 
              minHeight: '24px',
              maxHeight: '400px'
            }}
          />
          
          {/* Send Button */}
          {value.trim() && (
            <button
              type="submit"
              className="absolute right-0 bottom-0 p-2 text-primary hover:text-primary-hover transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <p className="px-4 pb-4 text-sm text-error">{error}</p>
      )}
    </form>
  );
}