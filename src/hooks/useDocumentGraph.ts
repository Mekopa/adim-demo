// src/hooks/useDocumentGraph.ts
import { useState, useCallback } from 'react';
import axiosInstance from '../api/axiosInstance';

// Define types for Neo4j response
interface Neo4jNode {
  id: string;
  labels: string[];
  properties: Record<string, any>;
}

interface Neo4jRelationship {
  id: string;
  type: string;
  start_node: string;
  end_node: string;
  properties: Record<string, any>;
}

interface Neo4jResponse {
  nodes: Neo4jNode[];
  relationships: Neo4jRelationship[];
}

// Define types for graph data
interface GraphNode {
  id: string;
  name: string;
  type: string;
  parentId?: string;
  color?: string;
  size?: number;
  expanded?: boolean;
  hidden?: boolean;
  clusterId?: string;
  level: number; 
  metadata?: Record<string, any>;
  x?: number;
  y?: number;
}

interface GraphLink {
  source: string;
  target: string;
  type: string;
  strength?: number;
  color?: string;
  dashed?: boolean;
  hidden?: boolean;
  metadata?: Record<string, any>;
}

interface GraphCluster {
  id: string;
  name: string;
  color: string;
  nodes: string[];
}

interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
  clusters: Record<string, GraphCluster>;
}

export function useDocumentGraph() {
  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], links: [], clusters: {} });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);

  // Fetch document graph data for a specific document
  const fetchDocumentGraph = useCallback(async (documentId: string, depth: number = 2) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axiosInstance.get<Neo4jResponse>(`/api/cloud/documents/${documentId}/graph/?depth=${depth}`);
      
      // Transform the API response into the format expected by ForceGraph2D
      const transformedData = transformGraphData(response.data);
      setGraphData(transformedData);
    } catch (err) {
      console.error('Error fetching document graph:', err);
      setError('Failed to load document graph');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch entity graph data
  const fetchEntityGraph = useCallback(async (entityName: string, entityType?: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams();
      params.append('name', entityName);
      if (entityType) params.append('type', entityType);
      
      const response = await axiosInstance.get<Neo4jResponse>(`/cloud/entities/graph/?${params}`);
      const transformedData = transformGraphData(response.data);
      setGraphData(transformedData);
    } catch (err) {
      console.error('Error fetching entity graph:', err);
      setError('Failed to load entity graph');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch folder graph data - updated to use the new endpoint
  const fetchFolderGraph = useCallback(async (folderPath: string, depth: number = 2) => {
    setLoading(true);
    setError(null);
    
    try {
      // Store current folder ID for context
      setCurrentFolderId(folderPath);
      
      const params = new URLSearchParams();
      params.append('folder_path', folderPath);
      params.append('depth', depth.toString());
      
      const response = await axiosInstance.get<Neo4jResponse>(`/cloud/folders/graph/?${params}`);
      const transformedData = transformGraphData(response.data);
      setGraphData(transformedData);
    } catch (err) {
      console.error('Error fetching folder graph:', err);
      setError('Failed to load folder graph');
    } finally {
      setLoading(false);
    }
  }, []);

  // Transform Neo4j response to graph visualization data
  const transformGraphData = (apiData: Neo4jResponse): GraphData => {
    const { nodes: apiNodes, relationships: apiRelationships } = apiData;
    
    // Map node types from Neo4j labels to visualization types
    const NODE_TYPE_MAPPING: Record<string, string> = {
      Document: 'file',
      Folder: 'folder',
      Person: 'person',
      Organization: 'organization',
      Case: 'case',
      Court: 'court',
      Judge: 'judge',
      Statute: 'statute',
      Party: 'party',
      Concept: 'term',
      Entity: 'entity',
      DateTime: 'date',
      Location: 'location'
    };
    
    // Map relationships from Neo4j to visualization types
    const RELATIONSHIP_TYPE_MAPPING: Record<string, string> = {
      CONTAINS: 'contains',
      MENTIONS: 'mentions',
      REFERENCES: 'references',
      RELATED_TO: 'related_to',
      CITES: 'references',
      HEARD_IN: 'related_to',
      PRESIDED_BY: 'related_to',
      APPLIES: 'related_to',
      HAS_PARTY: 'related_to',
      AFFILIATED_WITH: 'affiliated_with',
      SAME_FOLDER: 'same_folder'
    };
    
    // Transform nodes
    const nodes: GraphNode[] = apiNodes.map(node => {
      // Determine node type from labels
      const nodeLabels = Array.isArray(node.labels) ? node.labels : [node.labels];
      const nodeLabel = nodeLabels[0];
      const nodeType = NODE_TYPE_MAPPING[nodeLabel] || 'entity';
      
      // Determine file type based on extension if it's a document
      let fileType = nodeType;
      if (nodeType === 'file' && node.properties.file_extension) {
        const ext = node.properties.file_extension.toLowerCase();
        if (ext === 'pdf') fileType = 'pdf';
        else if (['doc', 'docx', 'txt'].includes(ext)) fileType = 'document';
        else if (['xls', 'xlsx', 'csv'].includes(ext)) fileType = 'spreadsheet';
        else if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) fileType = 'image';
        else if (['js', 'py', 'java', 'c', 'cpp'].includes(ext)) fileType = 'code';
      }
      
      // Determine node level based on type
      let level = 3; // Default for entities
      if (nodeLabel === 'Folder') level = 0;
      else if (nodeLabel === 'Document') level = 1;
      else if (['Section', 'Paragraph'].includes(nodeLabel)) level = 2;
      
      return {
        id: node.id,
        name: node.properties.name || 'Unnamed',
        type: fileType,
        level,
        color: getNodeColor(fileType),
        size: getNodeSize(fileType),
        expanded: level < 2, // Only folders and files start expanded
        hidden: level > 2,   // Entity nodes start hidden
        metadata: node.properties,
        clusterId: node.properties.folder_path // Group by folder
      };
    });
    
    // Transform relationships
    const links: GraphLink[] = apiRelationships.map(rel => {
      const relType = RELATIONSHIP_TYPE_MAPPING[rel.type] || rel.type.toLowerCase();
      
      return {
        source: rel.start_node,
        target: rel.end_node,
        type: relType,
        color: '#64748b',
        dashed: ['references', 'similar_to', 'related_to', 'mentions'].includes(relType),
        hidden: false,
        metadata: rel.properties
      };
    });
    
    // Build clusters based on folder structure
    const clusters: Record<string, GraphCluster> = {};
    const documentsByFolder: Record<string, string[]> = {};
    
    // First pass: Group documents by folder
    nodes.forEach(node => {
      if (node.type === 'file' && node.metadata?.folder_path) {
        const folderPath = node.metadata.folder_path;
        if (!documentsByFolder[folderPath]) {
          documentsByFolder[folderPath] = [];
        }
        documentsByFolder[folderPath].push(node.id);
      }
    });
    
    // Second pass: Create clusters for folders
    Object.entries(documentsByFolder).forEach(([folderPath, docIds]) => {
      clusters[folderPath] = {
        id: folderPath,
        name: `Folder ${folderPath}`, // You might want a better name
        color: getNodeColor('folder'),
        nodes: docIds
      };
    });
    
    return {
      nodes,
      links,
      clusters
    };
  };
  
  // Helper function to get color for node type
  const getNodeColor = (type: string): string => {
    // Node type colors
    const NODE_COLORS: Record<string, string> = {
      folder: '#4b6bfb',
      file: '#64748b',
      pdf: '#e11d48',
      document: '#2563eb',
      spreadsheet: '#16a34a',
      image: '#10b981',
      code: '#8b5cf6',
      section: '#f59e0b',
      paragraph: '#a16207',
      definition: '#0891b2',
      clause: '#db2777',
      person: '#f97316',
      organization: '#ec4899',
      date: '#64748b',
      location: '#06b6d4',
      term: '#6366f1',
      case: '#f59e0b',
      court: '#0891b2',
      judge: '#8b5cf6',
      statute: '#2563eb',
      party: '#16a34a',
      entity: '#8b5cf6'
    };
    
    return NODE_COLORS[type] || '#64748b';
  };
  
  // Helper function to get size for node type
  const getNodeSize = (type: string, importance: number = 1): number => {
    // Node type sizes
    const NODE_SIZES: Record<string, number> = {
      folder: 16,
      file: 12,
      pdf: 12,
      document: 12,
      spreadsheet: 12,
      image: 12,
      code: 12,
      section: 8,
      paragraph: 7,
      definition: 7,
      clause: 7,
      person: 6,
      organization: 6,
      date: 5,
      location: 5,
      term: 5,
      case: 8,
      court: 7,
      judge: 7,
      statute: 7,
      party: 6,
      entity: 6
    };
    
    return (NODE_SIZES[type] || 5) * importance;
  };

  // Clear graph data
  const clearGraphData = useCallback(() => {
    setGraphData({ nodes: [], links: [], clusters: {} });
  }, []);

  return {
    graphData,
    loading,
    error,
    currentFolderId,
    fetchDocumentGraph,
    fetchEntityGraph,
    fetchFolderGraph,
    clearGraphData
  };
}