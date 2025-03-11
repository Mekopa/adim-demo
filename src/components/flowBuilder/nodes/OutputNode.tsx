import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { FileOutput } from 'lucide-react';

function OutputNode({ data }: { data: any }) {
  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 min-w-[200px]">
      <div className="flex items-center gap-3 mb-2">
        <FileOutput className="w-5 h-5 text-green-500" />
        <h3 className="font-medium">Output</h3>
      </div>
      <p className="text-sm text-gray-500">
        {data.label || 'Generate Output'}
      </p>
      <Handle type="target" position={Position.Left} />
    </div>
  );
}

export default memo(OutputNode);