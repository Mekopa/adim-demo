import React, { useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import { DivorceFormData } from '../types';
import AddChildModal from '../components/AddChildModal';

export default function ChildrenInformation() {
  const [showAddChild, setShowAddChild] = useState(false);
  const { register, watch, control, formState: { errors } } = useFormContext<DivorceFormData>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'children',
  });

  const hasChildren = watch('hasChildren');
  const spouse1Name = watch('spouse1Name');
  const spouse2Name = watch('spouse2Name');

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium text-text">Children Information</h2>
      
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="hasChildren"
            {...register('hasChildren')}
            className="rounded border-input-border text-primary focus:ring-primary"
          />
          <label htmlFor="hasChildren" className="text-sm font-medium text-text">
            Do you have children?
          </label>
        </div>

        {hasChildren && (
          <div className="space-y-4">
            <div className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-start gap-4 p-4 bg-background rounded-lg border border-border">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-text">Child {index + 1}</span>
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="p-1 text-text-secondary hover:text-error hover:bg-error/10 rounded-full"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="text-sm text-text-secondary">
                      <p>Age: {field.age}</p>
                      <p>Custody: {field.custodialParent === 'spouse1' ? spouse1Name || 'Spouse 1' : spouse2Name || 'Spouse 2'}</p>
                      {field.custodyReason && (
                        <p className="mt-1">Reason: {field.custodyReason}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={() => setShowAddChild(true)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Child
              </button>
            </div>
          </div>
        )}
      </div>

      <AddChildModal
        isOpen={showAddChild}
        onClose={() => setShowAddChild(false)}
        onAdd={(data) => {
          append(data);
          setShowAddChild(false);
        }}
        spouse1Name={spouse1Name}
        spouse2Name={spouse2Name}
      />
    </div>
  );
}