import React from 'react';
import FlowBuilder from '../components/flowBuilder/FlowBuilder';
import { useParams } from 'react-router-dom';

export default function FlowBuilderPage() {
  const { formId } = useParams();
  
  return (
    <div className="h-screen">
      <FlowBuilder formId={formId} />
    </div>
  );
}