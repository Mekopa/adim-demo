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
          isUser ? 'bg-surface' : message.isError ? 'bg-red-100' : 'bg-background'
        }`}
      >
        <div className="flex items-center gap-2 mb-2">
          {isUser ? (
            <User className="w-5 h-5" />
          ) : (
            <Bot className={`w-5 h-5 ${message.isError ? 'text-red-500' : ''}`} />
          )}
          <span className={`font-medium ${message.isError ? 'text-red-600' : ''}`}>
            {isUser ? 'You' : message.isError ? 'Error' : 'Assistant'}
          </span>

        </div>
        
        <p className={`whitespace-pre-wrap ${message.isError ? 'text-red-600' : ''}`}>
          {message.content}
        </p>
        {message.files && message.files.length > 0 && (
          <div className="mt-2 grid gap-2">
            {message.files.map(file => (
              <div key={file.id} className="flex items-center text-sm text-blue-500">
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
