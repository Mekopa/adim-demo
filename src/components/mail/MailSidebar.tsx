import React from 'react';
import { Mail, Send, Star, Archive, Trash2, File } from 'lucide-react';
import { useMailStore } from '../../stores/mailStore';

const folders = [
  { id: 'inbox', label: 'Pašto dėžutė', icon: Mail },
  { id: 'sent', label: 'Išsiūsti', icon: Send },
  { id: 'starred', label: 'Pžymėti', icon: Star },
  { id: 'archive', label: 'Archyvas', icon: Archive },
  { id: 'trash', label: 'Šiukšlinė', icon: Trash2 },
  { id: 'drafts', label: 'Juodraščiai', icon: File },
];

export default function MailSidebar() {
  const { selectedFolder, setSelectedFolder, getFolderCount } = useMailStore();

  return (
    <div className="w-64 border-r border-border overflow-y-auto">
      <div className="p-4">
        <button className="w-full bg-primary text-white rounded-lg px-4 py-2 flex items-center justify-center gap-2">
          <Mail className="w-4 h-4" />
          <span>Naujas laiškas</span>
        </button>
      </div>

      <nav className="space-y-1 px-2">
        {folders.map((folder) => {
          const count = getFolderCount(folder.id);
          return (
            <button
              key={folder.id}
              onClick={() => setSelectedFolder(folder.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                selectedFolder === folder.id
                  ? 'bg-primary/10 text-primary'
                  : 'text-text-secondary hover:bg-background'
              }`}
            >
              <folder.icon className="w-5 h-5" />
              <span className="flex-1 text-left">{folder.label}</span>
              {count > 0 && (
                <span className="text-sm text-text-secondary">{count}</span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}