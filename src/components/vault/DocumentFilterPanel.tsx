// src/components/vault/DocumentFilterPanel.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Folder, 
  File, 
  FileText, 
  FileSpreadsheet, 
  FileImage, 
  FileCode, 
  FilePlus2, 
  Search, 
  ChevronDown, 
  ChevronUp 
} from 'lucide-react';

interface DocumentItem {
  id: string;
  name: string;
  selected: boolean;
  type: 'file' | 'folder';
  fileType?: string; // pdf, excel, image, etc.
  children?: DocumentItem[]; // For folders
}

interface DocumentFilterPanelProps {
  documentItems: DocumentItem[];
  documentFilterSize: number;
  clearDocumentFilter: () => void;
  toggleDocumentFilter: (docId: string) => void;
}

export const DocumentFilterPanel: React.FC<DocumentFilterPanelProps> = ({
  documentItems,
  documentFilterSize,
  clearDocumentFilter,
  toggleDocumentFilter,
}) => {
  const [searchActive, setSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

  // Reset search when closing
  useEffect(() => {
    if (!searchActive) {
      setSearchQuery('');
    }
  }, [searchActive]);

  // Function to get appropriate icon based on file type
  const getFileIcon = (item: DocumentItem) => {
    if (item.type === 'folder') {
      return <Folder size={16} className="text-yellow-400" />;
    }

    // For files, determine icon based on file extension
    const fileName = item.name.toLowerCase();
    
    if (fileName.endsWith('.pdf')) {
      return <FileText size={16} className="text-red-400" />;
    } else if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls') || fileName.endsWith('.csv')) {
      return <FileSpreadsheet size={16} className="text-green-400" />;
    } else if (fileName.endsWith('.jpg') || fileName.endsWith('.png') || fileName.endsWith('.gif')) {
      return <FileImage size={16} className="text-blue-400" />;
    } else if (fileName.endsWith('.js') || fileName.endsWith('.ts') || fileName.endsWith('.py') || fileName.endsWith('.html')) {
      return <FileCode size={16} className="text-purple-400" />;
    } else if (fileName.endsWith('.doc') || fileName.endsWith('.docx')) {
      return <FileText size={16} className="text-blue-500" />;
    } else {
      return <File size={16} className="text-gray-400" />;
    }
  };

  // Toggle folder expansion
  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(folderId)) {
        newSet.delete(folderId);
      } else {
        newSet.add(folderId);
      }
      return newSet;
    });
  };

  // Filter documents based on search query
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) {
      return documentItems;
    }

    const query = searchQuery.toLowerCase();
    
    // Helper function to search recursively through items
    const searchItems = (items: DocumentItem[]): DocumentItem[] => {
      return items.filter(item => {
        const nameMatch = item.name.toLowerCase().includes(query);
        
        // For folders, also check children
        if (item.type === 'folder' && item.children) {
          const matchingChildren = searchItems(item.children);
          
          // If any children match, include this folder
          if (matchingChildren.length > 0) {
            // Create a new item with only matching children
            return true;
          }
        }
        
        return nameMatch;
      });
    };
    
    return searchItems(documentItems);
  }, [searchQuery, documentItems]);

  // Recursive function to render document items
  const renderItems = (items: DocumentItem[], level = 0) => {
    return items.map(item => (
      <React.Fragment key={item.id}>
        <div 
          className={`flex items-center py-1.5 ${level > 0 ? `pl-${level * 4}` : ''}`}
          style={{ paddingLeft: level > 0 ? `${level * 12}px` : '0' }}
        >
          {item.type === 'folder' && item.children && (
            <button 
              onClick={() => toggleFolder(item.id)}
              className="mr-1 text-gray-400 hover:text-gray-200 p-0.5"
            >
              {expandedFolders.has(item.id) ? 
                <ChevronDown size={14} /> : 
                <ChevronUp size={14} className="rotate-180" />
              }
            </button>
          )}
          
          {item.type === 'folder' && !item.children && (
            <span className="w-5" /> // Spacer for empty folders
          )}
          
          <div className="flex items-center flex-1 min-w-0">
            <span className="mr-2">{getFileIcon(item)}</span>
            <input
              type="checkbox"
              id={`doc-${item.id}`}
              checked={item.selected}
              onChange={() => toggleDocumentFilter(item.id)}
              className="mr-2 h-3.5 w-3.5"
            />
            <label 
              htmlFor={`doc-${item.id}`}
              className="text-sm text-gray-300 truncate cursor-pointer hover:text-white"
              title={item.name}
            >
              {item.name}
            </label>
          </div>
        </div>
        
        {/* Render children if it's an expanded folder */}
        {item.type === 'folder' && item.children && expandedFolders.has(item.id) && (
          <div className="ml-2 border-l border-gray-700/40">
            {renderItems(item.children, level + 1)}
          </div>
        )}
      </React.Fragment>
    ));
  };

  if (documentItems.length === 0) return null;
  
  return (
    <div className="border-t border-gray-700/30 p-3 bg-gray-800/40 backdrop-blur-sm rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <FilePlus2 size={16} className="text-gray-400 mr-2" />
          <h3 className="text-sm font-medium text-gray-300">Files & Folders</h3>
        </div>
        
        <div className="flex items-center">
          {documentFilterSize > 0 && (
            <button
              onClick={clearDocumentFilter}
              className="text-xs text-gray-400 hover:text-white mr-2"
            >
              Clear
            </button>
          )}
          
          <button 
            onClick={() => setSearchActive(!searchActive)}
            className="p-1 hover:bg-gray-700/40 rounded-full transition-colors"
          >
            <Search size={14} className="text-gray-400 hover:text-white" />
          </button>
        </div>
      </div>
      
      {/* Search input */}
      {searchActive && (
        <div className="mb-2 flex bg-gray-700/20 rounded-lg overflow-hidden">
          <input
            type="text"
            placeholder="Search files & folders..."
            className="bg-transparent border-none outline-none text-xs text-gray-200 w-full px-3 py-1.5"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
        </div>
      )}
      
      {/* Documents list */}
      <div className="max-h-56 overflow-y-auto pr-1 pt-1">
        {filteredItems.length > 0 ? (
          renderItems(filteredItems)
        ) : (
          <div className="text-center text-gray-400 text-sm py-2">
            No matching documents found
          </div>
        )}
      </div>
    </div>
  );
};