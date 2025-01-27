import React, { useState, useEffect } from 'react';
import ChatInput from '../components/chat/ChatInput';
import EmptyState from '../components/chat/EmptyState';
import ChatMessage from '../components/chat/ChatMessage';
import { ChatMessage as ChatMessageType, UploadedFile } from '../types';
import { sendChatMessage } from '../services/assistant';
import { useAuth } from '../contexts/AuthContext';

export default function AssistantPage() {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [loading, setLoading] = useState(false);

  const [sessionId, setSessionId] = useState<string | null>(null);
  const { token } = useAuth();

  useEffect(() => {
    const savedSession = localStorage.getItem('assistantSession');
    if (savedSession) {
      const { sessionId, messages } = JSON.parse(savedSession);
      setSessionId(sessionId);
      setMessages(messages);
    }
  }, []);

  const saveSession = (sessionId: string, messages: ChatMessageType[]) => {
    localStorage.setItem('assistantSession', JSON.stringify({
      sessionId,
      messages
    }));
  };

  const handleStartChat = async (query: string, files: UploadedFile[]) => {
    setLoading(true);
    const userMessage: ChatMessageType = {
      id: Date.now().toString(),
      type: 'user',
      content: query,
      timestamp: new Date(),
      files,
    };

    setMessages([userMessage]);

    try {
      const response = await sendChatMessage(query, sessionId);
      const assistantMessage: ChatMessageType = {
        id: crypto.randomUUID(),
        type: 'assistant',
        content: response.response_message,
        timestamp: new Date(),
      };

      setSessionId(response.session_id);
      setMessages([userMessage, assistantMessage]);
      saveSession(response.session_id, [userMessage, assistantMessage]);
    } catch (error) {
      const errorMessage: ChatMessageType = {
        id: crypto.randomUUID(),
        type: 'assistant',
        content: error instanceof Error ? error.message : 'An unexpected error occurred',
        timestamp: new Date(),
        isError: true,
      };
      setMessages([userMessage, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (message: string) => {
    if (!message.trim()) return;

    setLoading(true);
    const userMessage: ChatMessageType = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);

    try {
      const response = await sendChatMessage(message, sessionId);
      const assistantMessage: ChatMessageType = {
        id: crypto.randomUUID(),
        type: 'assistant',
        content: response.response_message,
        timestamp: new Date(),
      };

      setSessionId(response.session_id);
      setMessages(prev => [...prev, assistantMessage]);
      saveSession(response.session_id, [...messages, userMessage, assistantMessage]);
    } catch (error) {
      const errorMessage: ChatMessageType = {
        id: crypto.randomUUID(),
        type: 'assistant',
        content: error instanceof Error ? error.message : 'An unexpected error occurred',
        timestamp: new Date(),
        isError: true,
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col">
      {messages.length === 0 ? (
        <div className="flex-1">
          <EmptyState onStartChat={handleStartChat} />
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto px-4 py-6">
            <div className="max-w-3xl mx-auto space-y-6">
              {messages.map(message => (
                <ChatMessage key={message.id} message={message} />
              ))}
            </div>
          </div>
          <div className="  ">
            <div className="max-w-3xl mx-auto">
              <ChatInput onSend={handleSend} loading={loading} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
