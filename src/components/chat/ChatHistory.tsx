import React from 'react';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { formatDate } from '../../utils/dateUtils';

interface ChatSession {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  isActive: boolean;
}

interface ChatHistoryProps {
  sessions: ChatSession[];
  onSelectSession: (sessionId: string) => void;
  onBack: () => void;
}

export default function ChatHistory({ sessions, onSelectSession, onBack }: ChatHistoryProps) {
  return (
    <div className="h-full flex flex-col bg-surface">
      <div className="flex items-center gap-3 p-6 border-b border-border">
        <button
          onClick={onBack}
          className="p-2 hover:bg-background rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-text-secondary" />
        </button>
        <h3 className="text-xl font-semibold text-text">Recent Conversations</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-3">
          {sessions.map((session, index) => (
            <button
            key={session.id} // Add a unique key here
            onClick={() => {
              console.log("Button clicked with session id:", session.id);
              onSelectSession(session.id);
            }}
            className="w-full group"
            style={{
              animation: `fadeIn 0.5s ease-out forwards ${index * 100 + 200}ms`,
            }}
          >
              <div className="bg-background p-4 rounded-xl hover:bg-background/80 transition-all duration-200">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-text truncate group-hover:text-primary transition-colors">
                    {session.title}
                  </h4>
                  <span className="text-sm text-text-secondary">
                    {formatDate(session.timestamp)}
                  </span>
                </div>
                <p className="text-sm text-text-secondary truncate">{session.lastMessage}</p>
                <div className="mt-2 flex items-center text-sm text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Continue chat</span>
                  <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}