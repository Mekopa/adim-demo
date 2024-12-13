import React, { useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import { DivorceFormData } from '../types';
import AddAssetModal from '../components/AddAssetModal';

export default function AssetInformation() {
  const [showAddAsset, setShowAddAsset] = useState(false);
  const { watch, control } = useFormContext<DivorceFormData>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'assets',
  });

  const spouse1Name = watch('spouse1Name');
  const spouse2Name = watch('spouse2Name');

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium text-text">Asset Information</h2>
      
      <div className="space-y-4">
        {fields.map((field, index) => (
          <div key={field.id} className="flex items-start gap-4 p-4 bg-background rounded-lg border border-border">
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-text">{field.name}</span>
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="p-1 text-text-secondary hover:text-error hover:bg-error/10 rounded-full"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="text-sm text-text-secondary">
                <p>Desired Owner: {field.desiredOwner === 'spouse1' ? spouse1Name || 'Spouse 1' : spouse2Name || 'Spouse 2'}</p>
                {field.reason && (
                  <p className="mt-1">Reason: {field.reason}</p>
                )}
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={() => setShowAddAsset(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Asset
        </button>
      </div>

      <AddAssetModal
        isOpen={showAddAsset}
        onClose={() => setShowAddAsset(false)}
        onAdd={(data) => {
          append(data);
          setShowAddAsset(false);
        }}
        spouse1Name={spouse1Name}
        spouse2Name={spouse2Name}
      />
    </div>
  );
}