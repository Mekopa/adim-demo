interface FileTypeConfig {
  color: string;
  bgColor: string;
  icon: keyof typeof import('../components/vault/FileIcon').IconComponents;
}

export function getFileTypeConfig(type: string): FileTypeConfig {
  // Document types
  if (type.includes('pdf')) {
    return { color: 'text-red-500', bgColor: 'bg-red-500/10', icon: 'FilePdf' };
  }
  if (type.includes('word') || type.includes('document')) {
    return { color: 'text-blue-500', bgColor: 'bg-blue-500/10', icon: 'FileText' };
  }
  if (type.includes('text/plain')) {
    return { color: 'text-purple-500', bgColor: 'bg-purple-500/10', icon: 'FileText' };
  }

  // Spreadsheet types
  if (type.includes('sheet') || type.includes('excel') || type.includes('csv')) {
    return { color: 'text-emerald-500', bgColor: 'bg-emerald-500/10', icon: 'FileSpreadsheet' };
  }

  // Image types
  if (type.startsWith('image/')) {
    return { color: 'text-pink-500', bgColor: 'bg-pink-500/10', icon: 'FileImage' };
  }

  // Code files
  if (type.includes('javascript') || type.includes('typescript') || type.includes('json')) {
    return { color: 'text-yellow-500', bgColor: 'bg-yellow-500/10', icon: 'FileCode' };
  }

  // Archive files
  if (type.includes('zip') || type.includes('rar') || type.includes('tar')) {
    return { color: 'text-orange-500', bgColor: 'bg-orange-500/10', icon: 'FileArchive' };
  }

  // Default
  return { color: 'text-gray-500', bgColor: 'bg-gray-500/10', icon: 'File' };
}