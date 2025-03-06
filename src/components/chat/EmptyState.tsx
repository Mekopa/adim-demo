import React, { useState, useRef, useEffect } from 'react';
import { Search, FolderOpen, Upload } from 'lucide-react';
import { UploadedFile } from '../../types';
import { useFileSelection } from '../../hooks/useFileSelection';
import FileUploader from './FileUploader';
import FileSelector from './FileSelector';
import ChatHistory from './ChatHistory';
import MessageInput from './MessageInput';
import SelectedFiles from './SelectedFiles';

interface ChatSession {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  isActive: boolean;
}

interface EmptyStateProps {
  // Fixed the type from customer?: string to searchVault?: boolean
  onStartChat: (query: string, files: UploadedFile[], searchVault?: boolean) => void;
  sessions: ChatSession[];
  onSelectSession: (sessionId: string) => void;
}

export default function EmptyState({ onStartChat, sessions, onSelectSession }: EmptyStateProps) {
  const [query, setQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [showTitle, setShowTitle] = useState(true);
  const [showActions, setShowActions] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    selectedOption,
    viewState,
    selectedFiles,
    selectedFileIds,
    handleOptionSelect,
    handleAddFiles,
    handleRemoveFile,
    handleBack,
    handleClose,
    reopenFileSelector,
    deselectAll
  } = useFileSelection();

  useEffect(() => {
    setHasAnimated(true);
  }, []);

  useEffect(() => {
    // Hide title and actions when user starts interacting
    if (selectedOption || query.length > 0 || showHistory) {
      setShowTitle(false);
      if (!selectedOption) {
        setShowActions(false);
      }
    } else {
      setShowActions(true);
      setShowTitle(true);
    }
  }, [selectedOption, query, showHistory]);

  const handleSubmit = () => {
    if (!query.trim()) {
      setError('Please enter a question');
      return;
    }
    setError(null);
    
    // Log what we're submitting for debugging
    console.log('Submitting query with:', {
      query,
      selectedFiles: selectedFiles.length > 0 ? `${selectedFiles.length} files` : 'no files',
      isSearchVault: selectedOption === 'search',
      selectedOption
    });
    
    // Pass the boolean directly to the onStartChat function
    onStartChat(query, selectedFiles, selectedOption === 'search');
  };

  const handleQueryChange = (value: string) => {
    setQuery(value);
    setError(null);
    // Show/hide actions based on whether there's text
    if (!selectedOption) {
      setShowActions(value.length === 0);
    }
  };

  const handleViewTransition = (action: () => void) => {
    setIsTransitioning(true);
    action();
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsTransitioning(false);
      });
    });
  };

  const handleShowHistory = () => handleViewTransition(() => setShowHistory(true));
  const handleHideHistory = () => handleViewTransition(() => setShowHistory(false));
  const handleOptionSelectWithTransition = (option: 'search' | 'select' | 'upload' | null) => {
    handleViewTransition(() => handleOptionSelect(option));
  };
  const handleBackWithTransition = () => handleViewTransition(handleBack);

  const fileActions = [
    { id: 'search' as const, icon: Search, label: 'Search Vault' },
    { id: 'select' as const, icon: FolderOpen, label: 'Select from Vault' },
    { id: 'upload' as const, icon: Upload, label: 'Upload Document' },
  ];

  const showMainContent = viewState === 'initial' || viewState === 'selected';

  return (
    <div className="relative flex items-center justify-center h-full">
      <div 
        ref={containerRef}
        className={`relative rounded-xl shadow-sm overflow-hidden transition-all duration-300 ease-out ${
          showHistory ? 'h-[600px]' : 'h-[600px]'
        } ${
          viewState === 'selecting' 
            ? 'w-[1000px] max-w-[90vw]' 
            : 'w-[800px] max-w-[90vw]'
        }`}
      >
        {/* Empty State View */}
        <div 
          className={`absolute inset-0 flex flex-col transition-all duration-300 ease-out transform ${
            showHistory 
              ? 'scale-95 opacity-0 pointer-events-none' 
              : 'scale-100 opacity-100'
          }`}
        >
          {/* Main Content Area */}
          <div 
            className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-300 ease-out ${
              showMainContent && !isTransitioning
                ? 'opacity-100 scale-100'
                : 'opacity-0 scale-95 pointer-events-none'
            }`}
          >
            <div className="w-full max-w-3xl px-4 sm:px-8 flex flex-col items-center sm:gap-10">
              {/* Title */}
              <div className={`text-center transition-all duration-300 ${
                showTitle 
                  ? 'opacity-100 transform translate-y-0' 
                  : 'opacity-0 transform -translate-y-4 pointer-events-none h-0'
              }`}>
                <h2 className="text-3xl sm:text-4xl font-bold text-text">How can I help you today?</h2>
              </div>

              {/* Selected Files and Message Input Container */}
              <div className="w-full bg-surface rounded-2xl overflow-hidden shadow-lg">
                {/* Selected Files */}
                {(selectedFiles.length > 0 || selectedOption === 'search') && (
                  <div className="p-4 sm:p-6 border-b border-border">
                    <SelectedFiles
                      files={selectedFiles}
                      isSearching={selectedOption === 'search'}
                      onRemoveFile={handleRemoveFile}
                      onBack={handleClose}
                      onReopen={reopenFileSelector}
                      onDeselectAll={deselectAll}
                      selectedOption={selectedOption}
                    />
                  </div>
                )}

                {/* Message Input */}
                <MessageInput
                  value={query}
                  onChange={handleQueryChange}
                  onSubmit={handleSubmit}
                  onShowHistory={handleShowHistory}
                  error={error}
                  autoFocus
                  showHistoryButton={!selectedOption && query.length === 0}
                />

                {/* File Options */}
                {viewState === 'initial' && showActions && (
                  <div className="p-4 sm:p-6 border-t border-border">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {fileActions.map((action, index) => (
                        <button
                          key={action.label}
                          onClick={() => handleOptionSelectWithTransition(action.id)}
                          className={`flex items-center gap-3 p-4 bg-background rounded-xl hover:bg-background/80 transition-all duration-200 group ${
                            !hasAnimated ? 'opacity-0' : 'opacity-100'
                          }`}
                          style={!hasAnimated ? {
                            animation: `fadeIn 0.3s ease-out forwards ${index * 50}ms`
                          } : undefined}
                        >
                          <div className="p-2 bg-surface rounded-lg group-hover:bg-primary/10 transition-colors">
                            <action.icon className="w-5 h-5 text-text-secondary group-hover:text-primary transition-colors" />
                          </div>
                          <span className="text-sm font-medium text-text group-hover:text-text transition-colors">
                            {action.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* File Selection View */}
          <div 
            className={`absolute inset-0 transition-all duration-300 ease-out transform ${
              viewState === 'selecting' && !isTransitioning
                ? 'translate-x-0 opacity-100 scale-100'
                : 'translate-x-full opacity-0 scale-95 pointer-events-none'
            }`}
          >
            <FileSelector
              onSelect={handleAddFiles}
              onBack={handleBackWithTransition}
              initialSelectedFiles={selectedFiles}
              selectedFileIds={selectedFileIds}
            />
          </div>

          {/* File Upload View */}
          <div 
            className={`absolute inset-0 transition-all duration-300 ease-out transform ${
              viewState === 'uploading' && !isTransitioning
                ? 'translate-x-0 opacity-100 scale-100'
                : 'translate-x-full opacity-0 scale-95 pointer-events-none'
            }`}
          >
            <FileUploader
              onUpload={handleAddFiles}
              onBack={handleBackWithTransition}
            />
          </div>
        </div>

        {/* History View */}
        <div 
          className={`absolute inset-0 transition-all duration-300 ease-out transform ${
            showHistory && !isTransitioning
              ? 'scale-100 opacity-100' 
              : 'scale-105 opacity-0 pointer-events-none'
          }`}
        >
          <ChatHistory
            sessions={sessions}
            onSelectSession={onSelectSession}
            onBack={handleHideHistory}
          />
        </div>
      </div>
    </div>
  );
}