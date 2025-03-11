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
  source_document?: string;
  source_documents?: string[];
  folder_path?: string;
  context?: {
    folder_path?: string;
    empty?: boolean;
  };
}

// Define types for graph data
interface GraphNode {
  id: string;
  name: string;
  type: string;
  sourceDocument?: boolean;
  color?: string;
  size?: number;
  expanded?: boolean;
  hidden?: boolean;
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

interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
  sourceDocuments: string[];
  folderPath?: string;
}

export function useDocumentGraph() {
  const [graphData, setGraphData] = useState<GraphData>({ 
    nodes: [], 
    links: [], 
    sourceDocuments: [],
    folderPath: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);

  // Fetch document graph data for a specific document
  const fetchDocumentGraph = useCallback(async (documentId: string, depth: number = 2) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log(`Fetching document graph for ID: ${documentId}`);
      const response = await axiosInstance.get<Neo4jResponse>(
        `/cloud/documents/${documentId}/graph/?depth=${depth}`
      );
      
      console.log('Raw API response:', response.data);
      console.log('API nodes count:', response.data.nodes?.length || 0);
      console.log('API relationships count:', response.data.relationships?.length || 0);
      
      // Transform the API response to focus on entities
      const transformedData = transformEntityGraph(response.data);
      console.log('Transformed nodes count:', transformedData.nodes.length);
      console.log('Transformed links count:', transformedData.links.length);
      
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
      
      console.log(`Fetching entity graph for: ${entityName}`);
      const response = await axiosInstance.get<Neo4jResponse>(
        `/cloud/entities/graph/?${params}`
      );
      
      console.log('Entity graph API response:', response.data);
      
      // Transform the API response
      const transformedData = transformEntityGraph(response.data);
      setGraphData(transformedData);
    } catch (err) {
      console.error('Error fetching entity graph:', err);
      setError('Failed to load entity graph');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch folder graph data with improved error handling
  // Update the fetchFolderGraph function in useDocumentGraph.ts
  // In useDocumentGraph.ts - update the fetchFolderGraph function

  const fetchFolderGraph = useCallback(async (folderId: string | null) => {
    setLoading(true);
    setError(null);
    
    try {
      // Store current folder path for context
      setCurrentFolderId(folderId);
      
      const params = new URLSearchParams();
      // Send folder_id as a string (empty string if null)
      params.append('folder_path', folderId || '');
      params.append('depth', '2');
      
      const requestUrl = `/cloud/folders/graph/?${params}`;
      console.log(`[DEBUG] Fetching folder graph - url: ${requestUrl}`);
      console.log(`[DEBUG] Folder UUID: "${folderId}" (${typeof folderId})`);
      
      try {
        // First try with a timeout to catch potential hanging requests
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
        
        const response = await axiosInstance.get<Neo4jResponse>(
          requestUrl,
          { signal: controller.signal }
        );
        
        clearTimeout(timeoutId);
        
        // Rest of the function remains the same...
        console.log('[DEBUG] Folder graph API response received');
        // Process the response...
        
        // Transform the API response
        console.log('[DEBUG] Beginning data transformation');
        const transformedData = transformEntityGraph(response.data);
        console.log('[DEBUG] Transformed data:', transformedData);
        
        setGraphData(transformedData);
        console.log('[DEBUG] Graph data updated successfully');
        
      } catch (requestErr: any) {
        if (requestErr.name === 'AbortError') {
          console.error('[DEBUG] Request timeout or aborted');
          throw new Error('Request timeout - the server took too long to respond');
        }
        throw requestErr;
      }
    } catch (err: any) {
      console.error('[DEBUG] Error fetching folder graph:', err);
      console.error('[DEBUG] Error type:', err instanceof Error ? err.constructor.name : typeof err);
      console.error('[DEBUG] Error message:', err instanceof Error ? err.message : String(err));
      if (err instanceof Error && err.stack) {
        console.error('[DEBUG] Stack trace:', err.stack);
      }
      
      setError(err instanceof Error ? err.message : 'Failed to load folder graph');
      
      // Set empty graph data on error
      setGraphData({ 
        nodes: [], 
        links: [], 
        sourceDocuments: [],
        folderPath: (folderId || '') 
      });
    } finally {
      setLoading(false);
    }
  }, []);

  

  // Transform Neo4j response to entity-focused graph visualization data
  // Replace the transformEntityGraph function in useDocumentGraph.ts with this version

const transformEntityGraph = (apiData: Neo4jResponse): GraphData => {
  console.log('Transforming entity-focused graph data');
  const { nodes: apiNodes = [], relationships: apiRelationships = [] } = apiData;
  
  // Track source documents
  const sourceDocuments: string[] = [];
  if (apiData.source_document) {
    sourceDocuments.push(apiData.source_document);
  }
  if (apiData.source_documents && apiData.source_documents.length > 0) {
    sourceDocuments.push(...apiData.source_documents);
  }
  
  // Filter to only include document nodes when they are source documents
  const nonDocumentNodes = apiNodes.filter(node => 
    !node.labels.includes('Document') || 
    node.properties.source_document === true ||
    sourceDocuments.includes(node.id)
  );
  
  // Node colors by entity type
  const NODE_COLORS: Record<string, string> = {
    Document: '#64748b',
    Person: '#f97316',
    Organization: '#ec4899',
    DateTime: '#64748b',
    Location: '#06b6d4',
    Concept: '#6366f1',
    Entity: '#8b5cf6',
    Case: '#f59e0b',
    Court: '#0891b2',
    Judge: '#8b5cf6',
    Statute: '#2563eb',
    Party: '#16a34a'
  };
  
  // Node sizes by entity type
  const NODE_SIZES: Record<string, number> = {
    Document: 12,
    Person: 10,
    Organization: 10,
    DateTime: 6,
    Location: 8,
    Concept: 8,
    Entity: 7,
    Case: 11,
    Court: 10,
    Judge: 9,
    Statute: 9,
    Party: 8
  };
  
  // Transform nodes to focus on entities
    const nodes: GraphNode[] = nonDocumentNodes.map(node => {
      // Determine primary entity type - use first label that's not Document or Entity
      let entityType = node.labels.find(label => 
        label !== 'Document' && label !== 'Entity'
      ) || node.labels[0];
      
      // Special case for documents - mark as source documents
      const isSourceDocument = 
        node.labels.includes('Document') && 
        (node.properties.source_document === true || sourceDocuments.includes(node.id));
      
      // Determine node level based on type
      let level = 2; // Default for entities
      if (node.labels.includes('Document')) {
        level = 1; // Documents are level 1
      }
      
      // Get node name from properties
      const name = node.properties.name || 
                  node.properties.case_number || 
                  node.properties.citation ||
                  'Unnamed';
      
      // Determine color based on entity type
      const color = NODE_COLORS[entityType] || '#8b5cf6';
      
      // Determine size based on entity type
      const size = NODE_SIZES[entityType] || 8;
      
      return {
        id: node.id,
        name,
        type: entityType.toLowerCase(),
        sourceDocument: isSourceDocument,
        color,
        size,
        level,
        expanded: true,
        hidden: false,
        metadata: node.properties
      };
    });
    
    // Create a node map for lookup by ID
    const nodeMap = nodes.reduce((map, node) => {
      map[node.id] = node;
      return map;
    }, {} as Record<string, GraphNode>);
    
    // Transform relationships to connect entities
    const links: GraphLink[] = [];
    
    for (const rel of apiRelationships) {
      const sourceNode = nodeMap[rel.start_node];
      const targetNode = nodeMap[rel.end_node];
      
      // Only add links if both nodes exist
      if (sourceNode && targetNode) {
        // Determine if this is a Document-Entity relationship
        const isDocumentRelation = 
          sourceNode.sourceDocument || targetNode.sourceDocument;
        
        // Choose colors and styles based on relationship type
        let color = '#64748b';
        let dashed = false;
        
        switch (rel.type) {
          case 'MENTIONS':
            color = '#6366f1';
            dashed = true;
            break;
          case 'CONTAINS':
            color = '#0ea5e9';
            break;
          case 'RELATED_TO':
            color = '#8b5cf6';
            dashed = true;
            break;
          case 'CITES':
            color = '#f59e0b';
            break;
          case 'REFERENCES':
            color = '#10b981';
            dashed = true;
            break;
          default:
            color = '#64748b';
        }
        
        links.push({
          source: sourceNode.id,  // Use ID string instead of node object
          target: targetNode.id,  // Use ID string instead of node object
          type: rel.type.toLowerCase(),
          color,
          dashed,
          strength: isDocumentRelation ? 0.5 : 1,
          hidden: false,
          metadata: rel.properties
        });
        
      }
    }
    
    return {
      nodes,
      links,
      sourceDocuments,
      folderPath: apiData.folder_path || ''
    };
  };
    
  // Clear graph data
  const clearGraphData = useCallback(() => {
    setGraphData({ 
      nodes: [], 
      links: [], 
      sourceDocuments: [],
      folderPath: '' 
    });
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