import React from 'react';
import { Grid, List, Download, Upload, FolderPlus, CircleEllipsis, Share2,  Trash2, Mail } from 'lucide-react';

interface ActionBarProps {
  onUpload: () => void;
  onCreateFolder: () => void;
}

export default function ActionBar({ onUpload, onCreateFolder }: ActionBarProps) {
  return (
    <div className="flex items-center justify-between h-16 px-4 text-text">
      {/* Left section */}
      <div className="flex items-center gap-4">
        <button className="p-2 rounded hover:bg-[#2c2c2e] transition-colors">
          <Grid className="w-5 h-5" />
        </button>
        <button className="p-2 rounded hover:bg-[#2c2c2e] transition-colors">
          <List className="w-5 h-5" />
        </button>
      </div>

      {/* Center section */}
      <div className="flex items-center gap-1">
        <button
          onClick={onUpload}
          className="p-2 rounded-xl hover:bg-[#2c2c2e] transition-colors"
        >
          <Upload className="w-5 h-5" />
        </button>
        <button
          onClick={onCreateFolder}
          className="p-2 rounded-xl hover:bg-[#2c2c2e] transition-colors"
        >
          <FolderPlus className="w-5 h-5" />
        </button>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-1">
      <button className="p-2 rounded-xl hover:bg-[#2c2c2e] transition-colors">
          <Download className="w-5 h-5" />
      </button>
      <button className="p-2 rounded-xl hover:bg-[#2c2c2e] transition-colors">
          <Trash2 className="w-5 h-5" />
      </button>
      <button className="p-2 rounded-xl hover:bg-[#2c2c2e] transition-colors">
          <Share2 className="w-5 h-5" />
      </button>
      <button className="p-2 rounded-xl hover:bg-[#2c2c2e] transition-colors">
          <Mail className="w-5 h-5" />
      </button>
      <button className="p-2 rounded-xl hover:bg-[#2c2c2e] transition-colors">
          <CircleEllipsis className="w-5 h-5" />
      </button>
      </div>
    </div>
  );
}