import React from 'react';
import { Upload, X, File, ArrowLeft } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { UploadedFile } from '../../types';

interface FileUploaderProps {
  onUpload: (files: UploadedFile[]) => void;
  onBack: () => void;
}

export default function FileUploader({ onUpload, onBack }: FileUploaderProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      const newFiles = acceptedFiles.map(file => ({
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file)
      }));
      onUpload(newFiles);
    },
    maxSize: 10485760, // 10MB
  });

  return (
    <div className="h-full flex flex-col bg-surface">
      <div className="flex items-center gap-3 p-6 border-b border-border">
        <button
          onClick={onBack}
          className="p-2 hover:bg-background rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-text-secondary" />
        </button>
        <h3 className="text-xl font-semibold text-text">Upload Files</h3>
      </div>
      <div className="flex-1 p-6 flex items-center justify-center">
        <div
          {...getRootProps()}
          className={`w-full max-w-xl border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
            isDragActive 
              ? 'border-primary bg-primary/5 scale-105' 
              : 'border-border hover:border-primary hover:bg-primary/5'
          }`}
        >
          <input {...getInputProps()} />
          <div className={`transition-transform duration-300 ${isDragActive ? 'scale-110' : 'scale-100'}`}>
            <div className="mx-auto w-16 h-16 mb-4 rounded-xl bg-surface flex items-center justify-center">
              <Upload className="w-8 h-8 text-primary" />
            </div>
            <h4 className="text-lg font-medium text-text mb-2">
              {isDragActive ? 'Drop files here' : 'Upload your files'}
            </h4>
            <p className="text-text-secondary">
              {isDragActive 
                ? 'Release to upload your files' 
                : 'Drag & drop files here, or click to select'}
            </p>
            <p className="text-sm text-text-secondary mt-2">
              Maximum file size: 10MB
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}