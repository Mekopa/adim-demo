export interface DocumentTemplate {
  id: string;
  title: string;
  description: string;
  icon: string;
  questions: Question[];
}

export interface Question {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'date';
  options?: string[];
  required?: boolean;
}

export interface DocumentFormData {
  [key: string]: string;
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  files?: UploadedFile[];
  isLoading?: boolean;
  customer?: string;
  isError?: boolean;
}

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}