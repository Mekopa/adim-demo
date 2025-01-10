import React from 'react';
import MailSidebar from '../components/mail/MailSidebar';
import MailList from '../components/mail/MailList';
import MailContent from '../components/mail/MailContent';
import ResizeHandle from '../components/mail/ResizeHandle';
import { useMailStore } from '../stores/mailStore';
import { useResizable } from '../hooks/useResizable';

export default function MailboxPage() {
  const { selectedMail } = useMailStore();
  
  const {
    width: listWidth,
    handleMouseDown: handleListResize,
    isResizing: isListResizing,
  } = useResizable({
    minWidth: 280,
    maxWidth: 480,
    defaultWidth: 320,
  });

  return (
    <div className="flex h-screen bg-background">
      <MailSidebar />
      <div className="flex-1 flex overflow-hidden">
        <div 
          className="h-full"
          style={{ width: listWidth }}
        >
          <MailList />
        </div>
        <ResizeHandle onMouseDown={handleListResize} />
        <div className={`flex-1 ${isListResizing ? 'select-none' : ''}`}>
          {selectedMail ? (
            <MailContent />
          ) : (
            <div className="h-full flex items-center justify-center text-text-secondary">
              Select a message to read
            </div>
          )}
        </div>
      </div>
    </div>
  );
}