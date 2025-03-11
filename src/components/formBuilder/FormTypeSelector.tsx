import React from 'react';
import { SplitSquareVertical, LayoutDashboard } from 'lucide-react';
import { FormType } from '../../types/formBuilder';

interface FormTypeSelectorProps {
  onSelect: (type: FormType) => void;
}

export default function FormTypeSelector({ onSelect }: FormTypeSelectorProps) {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h2 className="text-2xl font-semibold text-gray-900 mb-8 text-center">Choose Form Layout</h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        <button
          onClick={() => onSelect('multi-step')}
          className="group p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all text-left"
        >
          <div className="flex items-center justify-center w-12 h-12 bg-blue-50 rounded-lg mb-4 group-hover:bg-blue-100 transition-colors">
            <SplitSquareVertical className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Multi-Step Form</h3>
          <p className="text-gray-500 text-sm">
            Break down complex forms into manageable steps. Ideal for guided user experiences.
          </p>
        </button>

        <button
          onClick={() => onSelect('single-view')}
          className="group p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all text-left"
        >
          <div className="flex items-center justify-center w-12 h-12 bg-green-50 rounded-lg mb-4 group-hover:bg-green-100 transition-colors">
            <LayoutDashboard className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Single View Form</h3>
          <p className="text-gray-500 text-sm">
            Display all form fields on a single page. Perfect for simpler workflows.
          </p>
        </button>
      </div>
    </div>
  );
}