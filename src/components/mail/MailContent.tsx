import React from 'react';
import { Reply, Forward, Trash2, Archive, Star } from 'lucide-react';
import { useMailStore } from '../../stores/mailStore';
import { formatDateTime } from '../../utils/dateUtils';

export default function MailContent() {
  const { selectedMail, toggleStar } = useMailStore();

  if (!selectedMail) return null;

  return (
    <div className="flex-1 min-w-[400px] flex flex-col overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h2 className="text-xl font-semibold text-text truncate mr-4">{selectedMail.subject}</h2>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button className="p-2 text-text-secondary hover:bg-background rounded-lg">
            <Reply className="w-5 h-5" />
          </button>
          <button className="p-2 text-text-secondary hover:bg-background rounded-lg">
            <Forward className="w-5 h-5" />
          </button>
          <button className="p-2 text-text-secondary hover:bg-background rounded-lg">
            <Archive className="w-5 h-5" />
          </button>
          <button className="p-2 text-text-secondary hover:bg-background rounded-lg">
            <Trash2 className="w-5 h-5" />
          </button>
          <button 
            onClick={() => toggleStar(selectedMail.id)}
            className={`p-2 rounded-lg ${
              selectedMail.isStarred 
                ? 'text-yellow-500 hover:bg-yellow-50' 
                : 'text-text-secondary hover:bg-background'
            }`}
          >
            <Star className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <span className="text-primary font-medium">
              {selectedMail.from.name.charAt(0)}
            </span>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-medium text-text truncate">{selectedMail.from.name}</span>
              <span className="text-sm text-text truncate">
                &lt;{selectedMail.from.email}&gt;
              </span>
            </div>
            <div className="text-sm text-text-secondary">
              {formatDateTime(new Date(selectedMail.date))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="prose prose-sm text-text max-w-none">
          {selectedMail.content.split('\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </div>
    </div>
  );
}