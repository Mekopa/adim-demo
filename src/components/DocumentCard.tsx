// src/components/DocumentCard.tsx

import React from 'react';
import { FormTemplate } from '../types/workflow';
import { FileText, Scale } from 'lucide-react'; // Import specific icons

interface DocumentCardProps {
  template: FormTemplate['template'];
  onClick: () => void;
}

const DocumentCard: React.FC<DocumentCardProps> = ({ template, onClick }) => {
  // Function to render the icon based on the icon name
  const renderIcon = () => {
    switch (template.icon) {
      case 'Scales':
        return <Scale className="w-6 h-6" />;
      default:
        return <FileText className="w-6 h-6" />;
    }
  };

  return (
    <div
      className="border rounded-lg p-4 cursor-pointer hover:shadow-lg"
      onClick={onClick}
    >
      <div className="flex items-center space-x-2">
        <div className="text-2xl">{renderIcon()}</div>
        <h2 className="text-lg font-semibold">{template.title}</h2>
      </div>
      <p className="mt-2 text-gray-600">{template.description}</p>
    </div>
  );
};

export default DocumentCard;