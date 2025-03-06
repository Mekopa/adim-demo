import { useState } from 'react';
import { UploadedFile } from '../types';

type FileOption = 'search' | 'select' | 'upload' | null;
type ViewState = 'initial' | 'selecting' | 'uploading' | 'selected';

export function useFileSelection() {
  const [selectedOption, setSelectedOption] = useState<FileOption>(null);
  const [viewState, setViewState] = useState<ViewState>('initial');
  const [selectedFiles, setSelectedFiles] = useState<UploadedFile[]>([]);
  const [selectedFileIds, setSelectedFileIds] = useState<Set<string>>(new Set());

  const handleOptionSelect = (option: FileOption) => {
    setSelectedOption(option);
    // Don't clear selected files when reopening selector
    if (option !== 'select') {
      setSelectedFiles([]);
      setSelectedFileIds(new Set());
    }
    switch (option) {
      case 'select':
        setViewState('selecting');
        break;
      case 'upload':
        setViewState('uploading');
        break;
      case 'search':
        setViewState('selected');
        break;
      default:
        setViewState('initial');
    }
  };

  const handleAddFiles = (files: UploadedFile[]) => {
    // Replace all files when coming from file selector
    if (selectedOption === 'select') {
      setSelectedFiles(files);
      setSelectedFileIds(new Set(files.map(f => f.id)));
    } else {
      // Merge new files with existing ones for other sources
      const existingIds = new Set(selectedFiles.map(f => f.id));
      const newFiles = files.filter(f => !existingIds.has(f.id));
      setSelectedFiles(prev => [...prev, ...newFiles]);
      setSelectedFileIds(new Set([...selectedFileIds, ...newFiles.map(f => f.id)]));
    }
    setViewState('selected');
  };

  const handleRemoveFile = (fileId: string) => {
    setSelectedFiles(prev => prev.filter(f => f.id !== fileId));
    setSelectedFileIds(prev => {
      const newIds = new Set(prev);
      newIds.delete(fileId);
      return newIds;
    });
    
    // Reset to initial state if no files are left
    if (selectedFiles.length <= 1) {
      setSelectedOption(null);
      setViewState('initial');
    }
  };

  const handleBack = () => {
    // If we have selected files, go to selected state
    if (selectedFiles.length > 0) {
      setViewState('selected');
    } else {
      // If no files are selected, go to initial state
      setViewState('initial');
      setSelectedOption(null);
    }
  };

  const handleClose = () => {
    // Clear everything and go back to initial state
    setSelectedFiles([]);
    setSelectedFileIds(new Set());
    setSelectedOption(null);
    setViewState('initial');
  };

  const reopenFileSelector = () => {
    // Allow reopening if files were selected using the select option
    if (selectedOption === 'select') {
      setViewState('selecting');
    }
  };

  const deselectAll = () => {
    // Reset all state to initial
    setSelectedFiles([]);
    setSelectedFileIds(new Set());
    setSelectedOption(null);
    setViewState('initial');
  };

  return {
    selectedOption,
    viewState,
    selectedFiles,
    selectedFileIds,
    handleOptionSelect,
    handleAddFiles,
    handleRemoveFile,
    handleBack,
    handleClose,
    reopenFileSelector,
    deselectAll
  };
}