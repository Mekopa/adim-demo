import React from 'react';
import { ChatMessage as ChatMessageType } from '../../types';
import { User, Bot } from 'lucide-react';

interface ChatMessageProps {
  message: ChatMessageType;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.type === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] rounded-lg p-4 ${
          isUser ? 'bg-surface text-text' : ' text-text'
        }`}
      >
        <div className="flex items-center gap-2 mb-2">
          {isUser ? (
            <User className="w-5 h-5" />
          ) : (
            <Bot className="w-5 h-5" />
          )}
          <span className="font-medium">
            {isUser ? 'You' : 'Assistant'}
          </span>

        </div>
        
        <p className="whitespace-pre-wrap">{message.content}</p>

        {message.customer && (
          <div className={`mt-2 text-sm ${isUser ? 'text-blue-100' : 'text-gray-600'}`}>
            Customer: {message.customer}
          </div>
        )}
      </div>
    </div>
  );
}