import React, { useState } from 'react';
import { FolderOpen} from 'lucide-react';
import Modal from '../shared/Modal';
import FileUploadArea from './FileUploadArea';
import { UploadedFile } from '../../types';

interface EmptyStateProps {
  onStartChat: (query: string, files: UploadedFile[], customer?: string) => void;
}

export default function EmptyState({ onStartChat }: EmptyStateProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [query, setQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showVaultModal, setShowVaultModal] = useState(false);
  const [selectedCustomer] = useState<string | undefined>();

  const handleSubmit = () => {
    if (!query.trim()) {
      setError('Please enter a question');
      return;
    }
    setError(null);
    onStartChat(query, files, selectedCustomer);
  };

  const handleQueryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuery(e.target.value);
    if (error) {
      setError(null);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-8">
      <div className="rounded-xl shadow-sm p-8 max-w-2xl w-full">


        <div className="space-y-6">
          <FileUploadArea files={files} onFilesChange={setFiles} />

          <div className="flex gap-4">
            <button
              onClick={() => setShowVaultModal(true)}
              className="flex-1 flex items-center justify-center gap-2 p-4  border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FolderOpen className="w-5 h-5 text-gray-600" />
              <span className="text-gray-600 font-medium">Select from Vault</span>
            </button>
          </div>

          <div className="space-y-2">
            <textarea
              value={query}
              onChange={handleQueryChange}
              placeholder="Enter your query about the documents..."
              className={`w-full resize-none rounded-lg border p-3 min-h-[80px] ${
                error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
              } focus:ring-2 focus:border-transparent`}
              rows={3}
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="flex justify-end">
              <button
                onClick={handleSubmit}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!query.trim()}
              >
                Ask Question
              </button>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={showVaultModal}
        onClose={() => setShowVaultModal(false)}
        title="Select from Vault"
      >
        <div className="space-y-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search documents..."
              className="w-full p-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <FolderOpen className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
          </div>
          <div className="text-center text-gray-500 py-8">
            No documents found in your vault
          </div>
        </div>
      </Modal>
    </div>
  );
}