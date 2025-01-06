// ActionBar.tsx
import React, { useRef } from 'react';
import {
  Grid,
  List,
  DownloadCloud,
  UploadCloud,
  FolderPlus,
  CircleEllipsis,
  Share2,
  Trash2,
  Mail
} from 'lucide-react';
import { VaultFile, Folder } from '../../types/vault';

interface ActionBarProps {
  onUpload: (files: File[]) => void;
  onCreateFolder: () => void;
  items: (Folder | VaultFile)[];
  selectedItems: Set<string>;

  /** Action Handlers */
  onDownload?: () => void;
  onDelete?: () => void;
  onShare?: () => void;
  onMail?: () => void;
  onMore?: () => void;
}

export default function ActionBar({
  onUpload,
  onCreateFolder,
  items,
  selectedItems,
  onDownload,
  onDelete,
  onShare,
  onMail,
  onMore
}: ActionBarProps) {
  // Convert the selected IDs into actual items
  const selectedArray = Array.from(selectedItems).map(id => items.find(i => i.id === id));

  // Filter out any null/undefined in case an ID didn't match
  const selectedObjects = selectedArray.filter(Boolean) as (Folder | VaultFile)[];

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      onUpload(Array.from(files));
      event.target.value = '';
    }
  };

  const selectionCount = selectedObjects.length;

  // Determine selection type
  const noSelection = selectionCount === 0;

  // Check if any selected item is a folder
  const containsFolder = selectedObjects.some(item => 'documentCount' in item);

  // Check if all selected items are files
  const allFiles = selectedObjects.every(item => !('documentCount' in item));

  /**
   * Button Disable Logic:
   * - No Selection: Disable all right-section buttons.
   * - Single Selection:
   *    - If Folder: Disable Download & Mail.
   *    - If File: Enable all.
   * - Multiple Selection:
   *    - If any Folder is selected: Disable Download & Mail.
   *    - If all are Files: Enable all.
   */
  const disableAll = noSelection;
  const disableDownloadMail = noSelection || containsFolder;

  return (
    <div className="flex items-center justify-between h-16 px-4 text-text">
      {/* Left section */}
      <div className="flex items-center gap-4">
        <button
          className="p-2 rounded hover:bg-[#2c2c2e] transition-colors"
          aria-label="Grid View"
        >
          <Grid className="w-5 h-5 text-primary" />
        </button>
        <button
          className="p-2 rounded hover:bg-[#2c2c2e] transition-colors"
          aria-label="List View"
        >
          <List className="w-5 h-5 text-primary" />
        </button>
      </div>

      {/* Center section */}
      <div className="flex items-center gap-1">
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileChange}
          multiple
          accept=".pdf,.txt,.doc,.docx,.png,.jpg,.jpeg"
        />
        <button
          onClick={handleUploadClick}
          aria-label="Upload"
          className="p-2 rounded-xl hover:bg-[#2c2c2e] transition-colors"
        >
          <UploadCloud className="w-5 h-5 text-primary" />
        </button>
        <button
          onClick={onCreateFolder}
          aria-label="Create Folder"
          className="p-2 rounded-xl hover:bg-[#2c2c2e] transition-colors"
        >
          <FolderPlus className="w-5 h-5 text-primary" />
        </button>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-1">
        {/* Download Button */}
        <button
          onClick={onDownload}
          disabled={disableDownloadMail}
          aria-label="Download"
          className={`p-2 rounded-xl transition-colors ${
            disableDownloadMail
              ? 'text-primary opacity-50 cursor-default'
              : 'text-primary hover:bg-[#2c2c2e] cursor-pointer'
          }`}
        >
          <DownloadCloud className="w-5 h-5" />
        </button>

        {/* Delete Button */}
        <button
          onClick={onDelete}
          disabled={disableAll}
          aria-label="Delete"
          className={`p-2 rounded-xl transition-colors ${
            disableAll
              ? 'text-primary opacity-50 cursor-default'
              : 'text-primary hover:bg-[#2c2c2e] cursor-pointer'
          }`}
        >
          <Trash2 className="w-5 h-5" />
        </button>

        {/* Share Button */}
        <button
          onClick={onShare}
          disabled={disableAll}
          aria-label="Share"
          className={`p-2 rounded-xl transition-colors ${
            disableAll
              ? 'text-primary opacity-50 cursor-default'
              : 'text-primary hover:bg-[#2c2c2e] cursor-pointer'
          }`}
        >
          <Share2 className="w-5 h-5" />
        </button>

        {/* Mail Button */}
        <button
          onClick={onMail}
          disabled={disableDownloadMail}
          aria-label="Mail"
          className={`p-2 rounded-xl transition-colors ${
            disableDownloadMail
              ? 'text-primary opacity-50 cursor-default'
              : 'text-primary hover:bg-[#2c2c2e] cursor-pointer'
          }`}
        >
          <Mail className="w-5 h-5" />
        </button>

        {/* More Options Button */}
        <button
          onClick={onMore}
          disabled={disableAll}
          aria-label="More Options"
          className={`p-2 rounded-xl transition-colors ${
            disableAll
              ? 'text-primary opacity-50 cursor-default'
              : 'text-primary hover:bg-[#2c2c2e] cursor-pointer'
          }`}
        >
          <CircleEllipsis className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
