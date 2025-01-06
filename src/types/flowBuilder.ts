import { Node, Edge } from 'reactflow';

export interface FlowData {
  nodes: Node[];
  edges: Edge[];
}

export interface NodeData {
  label: string;
  type: string;
  config?: Record<string, any>;
}