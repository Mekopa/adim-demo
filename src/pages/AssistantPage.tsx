import React, { useState } from 'react';
import ChatInput from '../components/chat/ChatInput';
import EmptyState from '../components/chat/EmptyState';
import ChatMessage from '../components/chat/ChatMessage';
import { ChatMessage as ChatMessageType, UploadedFile } from '../types';

export default function AssistantPage() {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [loading, setLoading] = useState(false);

  const handleStartChat = async (query: string, files: UploadedFile[], customer?: string) => {
    setLoading(true);
    const initialMessage: ChatMessageType = {
      id: Date.now().toString(),
      type: 'user',
      content: query,
      timestamp: new Date(),
      files,
      customer
    };

    setMessages([initialMessage]);

    // Simulate API response delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const assistantMessage: ChatMessageType = {
      id: (Date.now() + 1).toString(),
      type: 'assistant',
      content: "I will help you analyze those documents. What specific information are you looking for?",
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, assistantMessage]);
    setLoading(false);
  };

  const handleSend = async (message: string) => {
    if (!message.trim()) return;

    setLoading(true);
    const newMessage: ChatMessageType = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);

    // Simulate API response delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const assistantMessage: ChatMessageType = {
      id: (Date.now() + 1).toString(),
      type: 'assistant',
      content: "I am analyzing your request. How else can I help you?",
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, assistantMessage]);
    setLoading(false);
  };

  return (
    <div className="h-screen flex flex-col">
      {messages.length === 0 ? (
        <div className="flex-1">
          <EmptyState onStartChat={handleStartChat} />
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto px-4 py-6 bg-gray-50">
            <div className="max-w-3xl mx-auto space-y-6">
              {messages.map(message => (
                <ChatMessage key={message.id} message={message} />
              ))}
            </div>
          </div>
          <div className="border-t border-gray-200 bg-white">
            <div className="max-w-3xl mx-auto">
              <ChatInput onSend={handleSend} loading={loading} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}