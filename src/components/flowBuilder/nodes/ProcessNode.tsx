import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { Cog } from 'lucide-react';

function ProcessNode({ data }: { data: any }) {
  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 min-w-[200px]">
      <div className="flex items-center gap-3 mb-2">
        <Cog className="w-5 h-5 text-purple-500" />
        <h3 className="font-medium">Process</h3>
      </div>
      <p className="text-sm text-gray-500">
        {data.label || 'Process Data'}
      </p>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </div>
  );
}

export default memo(ProcessNode);