import React, { useState, useEffect, useRef } from 'react';
import { Pin, PlusCircle } from 'lucide-react';
import ChatInput from '../components/chat/ChatInput';
import EmptyState from '../components/chat/EmptyState';
import ChatMessage from '../components/chat/ChatMessage';
import { ChatMessage as ChatMessageType, UploadedFile } from '../types';
import { sendChatMessage } from '../services/assistant';
import { useAuth } from '../contexts/AuthContext';

interface ChatSession {
  id: string;
  sessionId: string; // Backend session ID
  title: string;
  lastMessage: string;
  timestamp: Date;
  messages: ChatMessageType[];
  isActive: boolean;
  selectedFiles?: UploadedFile[];
  searchVault?: boolean;
}

// Add this session debugger component
const SessionDebugger = ({ sessions, activeId, pinnedId }) => {
  return (
    <div style={{
      position: 'fixed',
      bottom: 10,
      right: 10,
      background: '#f0f0f0',
      padding: 10,
      border: '1px solid #ccc',
      zIndex: 9999,
      fontSize: 12
    }}>
      <div>Sessions: {sessions.length}</div>
      <div>Active: {activeId}</div>
      <div>Pinned: {pinnedId}</div>
      <button onClick={() => console.log('Sessions:', sessions)}>
        Log Sessions
      </button>
    </div>
  );
};

export default function AssistantPage() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [pinnedSessionId, setPinnedSessionId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const { token } = useAuth();
  
  // Flag to track initial load
  const initialLoadRef = useRef(false);

  // CRITICAL FIX: Load sessions only once at component mount
  useEffect(() => {
    console.log('LOADING SESSIONS FROM STORAGE - INITIAL MOUNT');
    const loadSessions = () => {
      try {
        const savedSessionsJson = localStorage.getItem('chatSessions');
        const savedPinnedId = localStorage.getItem('pinnedChatSession');
        
        if (savedSessionsJson) {
          const savedSessions = JSON.parse(savedSessionsJson);
          console.log('Found sessions in localStorage:', savedSessions.length);
          
          if (Array.isArray(savedSessions) && savedSessions.length > 0) {
            // Process each session to ensure proper types
            const processedSessions = savedSessions.map(session => ({
              ...session,
              timestamp: new Date(session.timestamp),
              messages: Array.isArray(session.messages) ? 
                session.messages.map(msg => ({
                  ...msg,
                  timestamp: new Date(msg.timestamp)
                })) : [],
              selectedFiles: session.selectedFiles || [],
              searchVault: Boolean(session.searchVault)
            }));
            
            setSessions(processedSessions);
            console.log('Sessions loaded:', processedSessions.length);
            
            // Set pinned and active session if available
            if (savedPinnedId && processedSessions.some(s => s.id === savedPinnedId)) {
              console.log('Setting pinned session active:', savedPinnedId);
              setPinnedSessionId(savedPinnedId);
              setActiveSessionId(savedPinnedId);
            }
          }
        } else {
          console.log('No saved sessions found');
        }
      } catch (error) {
        console.error('Error loading sessions:', error);
      }
      
      // Mark initial load complete
      initialLoadRef.current = true;
    };
    
    loadSessions();
  }, []); // Empty dependency array ensures this runs ONCE only
  
  // CRITICAL FIX: Single localStorage save effect with debounce
  useEffect(() => {
    // Don't save during initial load to avoid overwriting with empty state
    if (!initialLoadRef.current) return;
    
    console.log('Sessions changed, saving to localStorage...');
    
    // Debounce save to avoid performance issues with frequent updates
    const saveTimeout = setTimeout(() => {
      try {
        if (sessions.length > 0) {
          // Create serializable versions of the sessions
          const serializableSessions = sessions.map(session => ({
            ...session,
            timestamp: session.timestamp.toISOString(),
            messages: session.messages.map(msg => ({
              ...msg,
              timestamp: msg.timestamp.toISOString()
            }))
          }));
          
          localStorage.setItem('chatSessions', JSON.stringify(serializableSessions));
          console.log('Saved', sessions.length, 'sessions to localStorage');
        } else {
          localStorage.removeItem('chatSessions');
          console.log('No sessions to save, removed from localStorage');
        }
      } catch (error) {
        console.error('Error saving sessions:', error);
      }
    }, 300); // 300ms debounce
    
    return () => clearTimeout(saveTimeout);
  }, [sessions]);
  
  // Separate effect for pinned session
  useEffect(() => {
    // Don't save during initial load
    if (!initialLoadRef.current) return;
    
    console.log('Pinned session changed:', pinnedSessionId);
    if (pinnedSessionId) {
      localStorage.setItem('pinnedChatSession', pinnedSessionId);
    } else {
      localStorage.removeItem('pinnedChatSession');
    }
  }, [pinnedSessionId]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [sessions]);

  const activeSession = sessions.find((s) => s.id === activeSessionId);
  const messages = activeSession?.messages || [];

  // Calculate the indices of the last user and assistant messages
  const lastUserIndex = messages.map((m) => m.type).lastIndexOf('user');
  const lastAssistantIndex = messages.map((m) => m.type).lastIndexOf('assistant');
  
  // FIXED: Proper session switching
  const switchToSession = (sessionId) => {
    console.log('Switching to session:', sessionId);
    
    // Mark this session as active, others as inactive
    setSessions(prev => 
      prev.map(session => ({
        ...session,
        isActive: session.id === sessionId
      }))
    );
    
    // Set the active session ID
    setActiveSessionId(sessionId);
  };

  const handleStartChat = async (query: string, files: UploadedFile[], searchVault?: boolean) => {
    console.log('Starting new chat with:', {
      query,
      files: files.length > 0 ? `${files.length} files` : 'no files',
      searchVault
    });
    
    // Create a unique ID for the client-side session
    const clientSessionId = `new-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Mark all existing sessions as inactive
    setSessions(prev => prev.map(s => ({ ...s, isActive: false })));
    
    setLoading(true);
    
    const userMessage: ChatMessageType = {
      id: Date.now().toString(),
      type: 'user',
      content: query,
      timestamp: new Date(),
      files,
    };

    const loadingMessage: ChatMessageType = {
      id: 'loading',
      type: 'assistant',
      content: '',
      timestamp: new Date(),
      isLoading: true,
    };

    // Create initial session with user message and loading state
    const initialSession: ChatSession = {
      id: clientSessionId,
      sessionId: '', // Will be updated after API response
      title: query.slice(0, 50) + (query.length > 50 ? '...' : ''),
      lastMessage: query,
      timestamp: new Date(),
      messages: [userMessage, loadingMessage],
      isActive: true,
      selectedFiles: files,
      searchVault: searchVault || false
    };

    // Add the new session to state and set it as active
    setSessions(prev => [initialSession, ...prev]);
    setActiveSessionId(clientSessionId);

    try {
      // Make the API call with our context
      const response = await sendChatMessage(query, null, {
        selectedFiles: files,
        searchVault: searchVault || false
      });
      
      console.log('Got response with session ID:', response.session_id);
      
      const assistantMessage: ChatMessageType = {
        id: Date.now() + Math.random().toString(36).substr(2, 9),
        type: 'assistant',
        content: response.response,
        timestamp: new Date(),
      };

      // Update session with backend sessionId and assistant response
      setSessions(prev =>
        prev.map(session =>
          session.id === clientSessionId
            ? {
                ...session,
                sessionId: response.session_id, // Store the backend session ID
                lastMessage: response.response,
                messages: [userMessage, assistantMessage],
                selectedFiles: files,
                searchVault: searchVault || false
              }
            : session
        )
      );
    } catch (error) {
      console.error('Error in chat:', error);
      // Error handling...
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (message: string) => {
    if (!message.trim() || !activeSessionId) return;
    setLoading(true);
  
    // Get the active session
    const currentSession = sessions.find(s => s.id === activeSessionId);
    if (!currentSession) {
      console.error('No active session found!');
      setLoading(false);
      return;
    }
  
    const userMessage: ChatMessageType = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date(),
    };
  
    const loadingMessage: ChatMessageType = {
      id: 'loading',
      type: 'assistant',
      content: '',
      timestamp: new Date(),
      isLoading: true,
    };
  
    // Update UI state immediately
    setSessions(prev =>
      prev.map(session =>
        session.id === activeSessionId
          ? {
              ...session,
              messages: [...session.messages, userMessage, loadingMessage],
              lastMessage: message,
              timestamp: new Date(),
            }
          : session
      )
    );
  
    try {
      // Get context from the session
      const selectedFiles = currentSession.selectedFiles || [];
      const searchVault = currentSession.searchVault || false;
      
      // Log what we're sending to the backend
      console.log('Continuing chat with backend session ID:', currentSession.sessionId);
      
      const response = await sendChatMessage(message, currentSession.sessionId || null, {
        selectedFiles,
        searchVault
      });
      
      console.log('Got response with session ID:', response.session_id);
      
      const assistantMessage: ChatMessageType = {
        id: Date.now() + Math.random().toString(36).substr(2, 9),
        type: 'assistant',
        content: response.response,
        timestamp: new Date(),
      };
  
      // Update session with response
      setSessions(prev =>
        prev.map(session =>
          session.id === activeSessionId
            ? {
                ...session,
                sessionId: response.session_id,
                messages: [...session.messages.slice(0, -1), assistantMessage],
                lastMessage: response.response,
                timestamp: new Date(),
              }
            : session
        )
      );
    } catch (error) {
      console.error('Error in chat:', error);
      // Error handling...
    } finally {
      setLoading(false);
    }
  };

  // FIXED: Create a proper new chat function
  const handleNewChat = () => {
    console.log('Creating new chat');
    // Unpin if there's a pinned session
    if (pinnedSessionId) {
      setPinnedSessionId(null);
    }
    
    // Mark all sessions as inactive
    setSessions(prev => prev.map(s => ({ ...s, isActive: false })));
    
    // Clear active session to show the EmptyState
    setActiveSessionId(null);
  };

  // FIXED: Proper pin functionality
  const togglePinSession = () => {
    if (!activeSessionId) return;
    
    if (pinnedSessionId === activeSessionId) {
      console.log('Unpinning session:', activeSessionId);
      setPinnedSessionId(null);
    } else {
      console.log('Pinning session:', activeSessionId);
      setPinnedSessionId(activeSessionId);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      <div className="relative flex-1 overflow-hidden">
        <div className={`absolute inset-0 ${!activeSessionId ? 'block' : 'hidden'}`}>
          <EmptyState
            onStartChat={handleStartChat}
            sessions={sessions}
            onSelectSession={(id) => {
              console.log('Session selected from history:', id);
              switchToSession(id);
            }}
          />
        </div>

        <div className={`absolute inset-0 ${activeSessionId ? 'block' : 'hidden'}`}>
          <div className="h-full flex flex-col ">
            {/*  Header */}
            {activeSession && (
              <div className="flex items-center justify-between px-6 py-4">
                <h2 className="text-lg font-semibold text-text truncate">
                  {activeSession.title}
                  {/* Optional: Add session debugging details */}
                  {process.env.NODE_ENV !== 'production' && (
                    <span style={{ fontSize: '10px', opacity: 0.5 }}>
                      (ID: {activeSession.id.substring(0, 8)}, 
                      Backend: {activeSession.sessionId ? activeSession.sessionId.substring(0, 8) : 'none'})
                    </span>
                  )}
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleNewChat}
                    className="p-2 text-text-secondary hover:bg-background rounded-lg transition-colors"
                    title="New chat"
                  >
                    <PlusCircle className="w-5 h-5" />
                  </button>
                  <button
                    onClick={togglePinSession}
                    className={`p-2 rounded-lg transition-colors ${
                      pinnedSessionId === activeSessionId
                        ? 'text-primary bg-primary/10'
                        : 'text-text-secondary hover:bg-background'
                    }`}
                    title={pinnedSessionId === activeSessionId ? 'Unpin chat' : 'Pin chat'}
                  >
                    <Pin className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            <div ref={messagesContainerRef} className="flex-1 overflow-y-auto px-4 py-6">
              <div className="max-w-3xl mx-auto space-y-6">
                {messages.map((message, index) => (
                  <div key={message.id}>
                    <ChatMessage
                      message={message}
                      isLastUser={index === lastUserIndex}
                      isLastAssistant={!message.isLoading && index === lastAssistantIndex}
                    />
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>

            <div className="">
              <div className="max-w-3xl mx-auto">
                <ChatInput onSend={handleSend} onNewChat={handleNewChat} loading={loading} />
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
}