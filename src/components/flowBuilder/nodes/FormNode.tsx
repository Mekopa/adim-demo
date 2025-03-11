import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { FileText } from 'lucide-react';

function FormNode({ data }: { data: any }) {
  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 min-w-[200px]">
      <div className="flex items-center gap-3 mb-2">
        <FileText className="w-5 h-5 text-blue-500" />
        <h3 className="font-medium">Form Input</h3>
      </div>
      <p className="text-sm text-gray-500">
        {data.formData?.name || 'Form Data'}
      </p>
      <Handle type="source" position={Position.Right} />
    </div>
  );
}

export default memo(FormNode);