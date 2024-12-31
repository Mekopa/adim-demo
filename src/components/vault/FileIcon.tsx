import React from 'react';
import { FileText, Image, File, FileSpreadsheet } from 'lucide-react';
import { getFileTypeConfig } from '../../utils/fileTypeUtils';

interface FileIconProps {
  type: string;
  className?: string;
}

const IconComponents = {
  FileText,
  FileImage: Image, // Using Image instead of FileImage
  File,
  FilePdf: FileText, // Using FileText for PDF files
  FileSpreadsheet,
  FileCode: FileText, // Using FileText for code files
  FileArchive: File, // Using File for archives
};

export function FileIcon({ type, className = '' }: FileIconProps) {
  const config = getFileTypeConfig(type);
  const IconComponent = IconComponents[config.icon];
  
  return <IconComponent className={`${className} ${config.color}`} />;
}

export function getFileIconColor(type: string) {
  return getFileTypeConfig(type);
}