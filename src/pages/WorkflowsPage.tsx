import React, { useState } from 'react';
import { FileText, Plus, Copy, FileKey } from 'lucide-react';
import { templates } from '../data/templates';
import { DocumentTemplate, DocumentFormData } from '../types';
import DocumentCard from '../components/DocumentCard';
import DocumentForm from '../components/DocumentForm';
import DocumentPreview from '../components/DocumentPreview';
import ActionCard from '../components/ActionCard';

export default function WorkflowsPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null);
  const [loading, setLoading] = useState(false);
  const [generatedDocument, setGeneratedDocument] = useState<string | null>(null);

  const handleSubmit = async (formData: DocumentFormData) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock response - in production, this would come from your API
      const mockDocument = `# ${selectedTemplate?.title}

## Agreement Details

This agreement is made between ${formData.partyA || formData.provider || formData.grantor} and ${formData.partyB || formData.client || formData.attorney}.

${formData.purpose || formData.services || formData.powers}

## Terms and Conditions

1. This agreement is effective as of ${new Date().toLocaleDateString()}.
2. All parties agree to maintain confidentiality of the information shared.
3. This agreement is binding for ${formData.duration || '2 years'}.

## Signatures

- Party A: _________________
- Party B: _________________

Date: ${new Date().toLocaleDateString()}`;

      setGeneratedDocument(mockDocument);
    } catch (error) {
      console.error('Error generating document:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <ActionCard
          title="blabla"
          description="Create, manage, and automate your legal document workflows"
          icon={FileText}
          actions={[
            {
              label: 'Create Template',
              icon: Plus,
              onClick: () => console.log('Create template clicked'),
            },
            {
              label: 'Import Template',
              icon: Copy,
              onClick: () => console.log('Import template clicked'),
            },
            {
              label: 'Manage Access',
              icon: FileKey,
              onClick: () => console.log('Manage access clicked'),
            },
          ]}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <DocumentCard
            key={template.id}
            template={template}
            onClick={() => setSelectedTemplate(template)}
          />
        ))}
      </div>

      {selectedTemplate && !loading && !generatedDocument && (
        <DocumentForm
          template={selectedTemplate}
          onSubmit={handleSubmit}
          onClose={() => setSelectedTemplate(null)}
        />
      )}

      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-8 flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Generating your document...</p>
          </div>
        </div>
      )}

      {generatedDocument && (
        <DocumentPreview
          content={generatedDocument}
          onClose={() => {
            setGeneratedDocument(null);
            setSelectedTemplate(null);
          }}
        />
      )}
    </div>
  );
}