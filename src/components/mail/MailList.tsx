import React from 'react';
import { useMailStore } from '../../stores/mailStore';
import { formatDate } from '../../utils/dateUtils';

export default function MailList() {
  const { getFilteredMails, selectedMail, setSelectedMail } = useMailStore();
  const mails = getFilteredMails();

  return (
    <div className="h-full border-r border-border overflow-y-auto">
      {mails.map((mail) => (
        <button
          key={mail.id}
          onClick={() => setSelectedMail(mail.id)}
          className={`w-full p-4 border-b border-border flex flex-col gap-2 transition-colors ${
            selectedMail?.id === mail.id
              ? 'bg-primary/5'
              : 'hover:bg-background'
          } ${!mail.isRead ? 'font-medium' : ''}`}
        >
          <div className="flex items-center justify-between">
            <span className="text-text truncate max-w-[70%]">{mail.from.name}</span>
            <span className="text-sm text-text-secondary flex-shrink-0">
              {formatDate(new Date(mail.date))}
            </span>
          </div>
          <h3 className="text-left text-text truncate">
            {mail.subject}
          </h3>
          <p className="text-sm text-text-secondary truncate">{mail.preview}</p>
        </button>
      ))}
    </div>
  );
}