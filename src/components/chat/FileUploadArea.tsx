import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, FileText, Image, File } from 'lucide-react';
import { UploadedFile } from '../../types';

interface FileUploadAreaProps {
  files: UploadedFile[];
  onFilesChange: (files: UploadedFile[]) => void;
}

export default function FileUploadArea({ files, onFilesChange }: FileUploadAreaProps) {
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setError(null);
    const newFiles: UploadedFile[] = acceptedFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file)
    }));
    onFilesChange([...files, ...newFiles]);
  }, [files, onFilesChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize: 10485760, // 10MB
    onDropRejected: () => setError('File too large. Maximum size is 10MB.')
  });

  const removeFile = (id: string) => {
    onFilesChange(files.filter(file => file.id !== id));
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return Image;
    if (type.includes('pdf')) return FileText;
    return File;
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`w-full border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-border hover:border-blue-500 hover:bg-surface'}`}
      >
        <input {...getInputProps()} />
        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-600">
          {isDragActive ? 'Drop files here' : 'Drag & drop files here, or click to select'}
        </p>
        <p className="text-sm text-gray-500 mt-1">Maximum file size: 10MB</p>
      </div>

      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}

      {files.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {files.map(file => {
            const FileIcon = getFileIcon(file.type);
            return (
              <div key={file.id} className="flex items-center p-3 bg-surface rounded-lg">
                <FileIcon className="w-5 h-5 text-text mr-2" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text truncate">{file.name}</p>
                  <p className="text-xs text-text-secondary">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                <button
                  onClick={() => removeFile(file.id)}
                  className="p-1 hover:bg-background rounded-full ml-2"
                >
                  <X className="w-4 h-4 text-text" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}