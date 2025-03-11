import React, { useState, useCallback } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
} from 'reactflow';
import 'reactflow/dist/style.css';

import FlowToolbar from './FlowToolbar';
import FormNode from './nodes/FormNode';
import ProcessNode from './nodes/ProcessNode';
import OutputNode from './nodes/OutputNode';

const nodeTypes = {
  formNode: FormNode,
  processNode: ProcessNode,
  outputNode: OutputNode,
};

interface FlowBuilderProps {
  formId?: string;
}

export default function FlowBuilder({ formId }: FlowBuilderProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Initialize with form node if formId exists
  React.useEffect(() => {
    if (formId) {
      const formData = localStorage.getItem(`form_${formId}`);
      if (formData) {
        const initialNode: Node = {
          id: 'form-1',
          type: 'formNode',
          position: { x: 100, y: 100 },
          data: { formId, formData: JSON.parse(formData) },
        };
        setNodes([initialNode]);
      }
    }
  }, [formId]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const handleAddNode = (type: string) => {
    const newNode: Node = {
      id: `${type}-${Date.now()}`,
      type: `${type}Node`,
      position: { x: 200, y: 200 },
      data: { label: `New ${type}` },
    };
    setNodes((nds) => [...nds, newNode]);
  };
  const proOptions = { hideAttribution: true };

  return (
    <div className="h-full">
      
      <div className="h-[calc(100%-64px)]">
        <FlowToolbar onAddNode={handleAddNode} />
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          proOptions={proOptions}
          fitView
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
}