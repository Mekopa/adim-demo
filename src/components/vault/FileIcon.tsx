import React from 'react';
import { FileText, Image, File } from 'lucide-react';

interface FileIconProps {
  type: string;
  className?: string;
}

export function FileIcon({ type, className }: FileIconProps) {
  if (type.startsWith('image/')) {
    return <Image className={className} />;
  }
  if (type.includes('pdf') || type.includes('text')) {
    return <FileText className={className} />;
  }
  return <File className={className} />;
}