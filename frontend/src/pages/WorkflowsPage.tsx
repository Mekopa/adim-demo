import React, { useState } from 'react';
import { forms } from '../forms/index.ts';
import { DocumentFormData, FormTemplate } from '../types/workflow.ts';
import DocumentCard from '../components/DocumentCard.tsx';
import DocumentForm from '../components/DocumentForm.tsx';
import DocumentPreview from '../components/DocumentPreview.tsx';

export default function WorkflowsPage() {
  const [selectedForm, setSelectedForm] = useState<FormTemplate | null>(null);
  const [loading, setLoading] = useState(false);
  const [generatedDocument, setGeneratedDocument] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: DocumentFormData) => {
    if (!selectedForm) {
      setError('No form selected.');
      return;
    } 

    setLoading(true);
    setError(null);

    try {
      // Dynamically import the form's prompt builder
      const { buildPrompt } = await import(`../forms/${selectedForm.id}/promptBuilder`);

      const prompt = buildPrompt(formData);

      const response = await fetch(selectedForm.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_input: prompt }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setGeneratedDocument(data.document);
    } catch (error) {
      console.error('Error generating document:', error);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen ">

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Error Message Display */}
        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline"> {error}</span>
            <span
              className="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer"
              onClick={() => setError(null)}
            >
              <svg
                className="fill-current h-6 w-6 text-red-500"
                role="button"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <title>Close</title>
                <path d="M14.348 5.652a1 1 0 00-1.414 0L10 8.586 7.066 5.652A1 1 0 105.652 7.066L8.586 10l-2.934 2.934a1 1 0 101.414 1.414L10 11.414l2.934 2.934a1 1 0 001.414-1.414L11.414 10l2.934-2.934a1 1 0 000-1.414z" />
              </svg>
            </span>
          </div>
        )}

        {/* Template Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {forms.map((form) => (
            <DocumentCard
              key={form.id}
              template={form.template}
              onClick={() => setSelectedForm(form)}
            />
          ))}
        </div>

        {/* Document Form in Modal */}
        {selectedForm && !loading && !generatedDocument && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-surface rounded-xl p-8 w-full max-w-3xl h-full overflow-y-auto relative">
              <button
                onClick={() => setSelectedForm(null)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <DocumentForm
                template={selectedForm.template}
                onSubmit={handleSubmit}
                onClose={() => setSelectedForm(null)}
              />
            </div>
          </div>
        )}

        {/* Loading Indicator */}
        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-surface rounded-xl p-8 flex flex-col items-center">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-text">Generating your document...</p>
            </div>
          </div>
        )}

        {/* Document Preview in Modal */}
        {generatedDocument && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-8 w-full max-w-3xl h-full overflow-y-auto relative">
              <button
                onClick={() => {
                  setGeneratedDocument(null);
                  setSelectedForm(null);
                }}
                className="absolute top-4 right-4 text-text hover:text-gray-700"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <DocumentPreview content={generatedDocument} onClose={() => {}} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}