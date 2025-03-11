import React, { useState } from 'react';
import { Eye, ArrowLeft, Save } from 'lucide-react';
import FormPreviewModal from './FormPreviewModal';
import { FormConfig } from '../../types/formBuilder';

interface FormBuilderHeaderProps {
  config: FormConfig;
  onSave: () => void;
  onBack: () => void;
}

export default function FormBuilderHeader({ config, onSave, onBack }: FormBuilderHeaderProps) {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-surface rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-text" />
          </button>
          <div>
            <h1 className="text-xl font-semibold text-text">{config.name}</h1>
            {config.description && (
              <p className="text-sm text-text">{config.description}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPreview(true)}
            className="flex items-center gap-2 px-4 py-2 text-text  rounded-lg hover:bg-surface transition-colors"
          >
            <Eye className="w-4 h-4" />
            Preview
          </button>
          <button
            onClick={onSave}
            className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Save className="w-4 h-4" />
            Save
          </button>
        </div>
      </div>

      <FormPreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        config={config}
      />
    </>
  );
}