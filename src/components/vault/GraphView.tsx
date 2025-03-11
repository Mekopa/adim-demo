// src/components/vault/GraphView.tsx
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { GraphVisualization } from './GraphVisualization';
import { InfoPanel } from './InfoPanel';
import { useDocumentGraph } from '../../hooks/useDocumentGraph';
import { useDocumentItems } from '../../hooks/useDocumentItems';
import { Folder, VaultFile } from '../../types/vault';
import { GraphNode, GraphLink } from '../../types/graph';
import { Users, Building, BookOpen, Scale, Calendar, MapPin, FileText } from 'lucide-react';

interface GraphViewProps {
  onClose: () => void;
  currentPath: string[];
  folders: Folder[];
  files: VaultFile[];
  selectedDocumentId?: string;
  selectedItems?: Set<string>;
  onNavigateToFolder?: (folderId: string) => void;
}

// Define entity types and filter options
const ENTITY_FILTER_OPTIONS = [
  { id: 'document', label: 'Documents', icon: <FileText size={14} /> },
  { id: 'person', label: 'People', icon: <Users size={14} /> },
  { id: 'organization', label: 'Organizations', icon: <Building size={14} /> },
  { id: 'case', label: 'Legal Cases', icon: <BookOpen size={14} /> },
  { id: 'court', label: 'Courts', icon: <Scale size={14} /> },
  { id: 'datetime', label: 'Dates', icon: <Calendar size={14} /> },
  { id: 'location', label: 'Locations', icon: <MapPin size={14} /> },
  { id: 'concept', label: 'Concepts', icon: <BookOpen size={14} /> },
];

export default function GraphView({
  onClose,
  currentPath,
  folders,
  files,
  selectedDocumentId,
  selectedItems = new Set(),
  onNavigateToFolder,
}: GraphViewProps) {
  // State
  const [filters, setFilters] = useState<string[]>([]);
  const [documentFilter, setDocumentFilter] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [showProperties, setShowProperties] = useState(false);

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<any>(null);

  // Hooks
  const { graphData, loading, error, fetchDocumentGraph, fetchEntityGraph, fetchFolderGraph } = useDocumentGraph();

  // Get hierarchical document items for the enhanced filter panel
  const { documentItems } = useDocumentItems({
    folders,
    files,
    selectedDocumentIds: documentFilter,
    currentPath
  });

  // Update dimensions on container resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Fetch data based on selected document or current folder
  useEffect(() => {
    if (selectedDocumentId) {
      fetchDocumentGraph(selectedDocumentId);
      setDocumentFilter(new Set([selectedDocumentId]));
    } else {
      let folderId: string | null = null;
      if (currentPath.length > 0) {
        folderId = currentPath[currentPath.length - 1];
      }
      fetchFolderGraph(folderId);
      setDocumentFilter(new Set());
    }
    setSelectedNode(null);
  }, [selectedDocumentId, currentPath, fetchDocumentGraph, fetchFolderGraph]);

  useEffect(() => {
    if (selectedDocumentId) {
      setDocumentFilter(new Set([selectedDocumentId]));
    } else if (selectedItems.size > 0) {
      setDocumentFilter(new Set(selectedItems));
    }
  }, [selectedDocumentId, selectedItems]);

  // Filter graph data based on entity type and document filters
  const filteredGraphData = useMemo(() => {
    if (filters.length === 0 && documentFilter.size === 0) {
      return { nodes: graphData.nodes, links: graphData.links };
    }
    
    const nodes = [...graphData.nodes];
    const links = [...graphData.links];
    
    if (filters.length > 0) {
      nodes.forEach((node, index) => {
        if (!node.sourceDocument && !filters.includes(node.type)) {
          nodes[index] = { ...node, hidden: true };
        }
      });
    }
    
    if (documentFilter.size > 0) {
      const connectedEntityIds = new Set<string>();
      links.forEach(link => {
        const source = typeof link.source === 'string' ? link.source : link.source.id;
        const target = typeof link.target === 'string' ? link.target : link.target.id;
        const sourceNode = nodes.find(n => n.id === source);
        const targetNode = nodes.find(n => n.id === target);
        if (sourceNode?.sourceDocument && documentFilter.has(source)) {
          connectedEntityIds.add(target);
        } else if (targetNode?.sourceDocument && documentFilter.has(target)) {
          connectedEntityIds.add(source);
        }
      });
      
      nodes.forEach((node, index) => {
        if (!node.sourceDocument && !connectedEntityIds.has(node.id)) {
          nodes[index] = { ...node, hidden: true };
        } else if (node.sourceDocument && !documentFilter.has(node.id)) {
          nodes[index] = { ...node, hidden: true };
        }
      });
    }
    
    links.forEach((link, index) => {
      const source = typeof link.source === 'string' ? link.source : link.source.id;
      const target = typeof link.target === 'string' ? link.target : link.target.id;
      const sourceNode = nodes.find(n => n.id === source);
      const targetNode = nodes.find(n => n.id === target);
      if (sourceNode?.hidden || targetNode?.hidden) {
        links[index] = { ...link, hidden: true };
      }
    });
    
    return { nodes, links };
  }, [graphData, filters, documentFilter]);

  const visibleGraphData = useMemo(() => {
    const visibleNodes = filteredGraphData.nodes.filter((node: GraphNode) => !node.hidden);
    const nodeIds = new Set(visibleNodes.map((node: GraphNode) => node.id));
    return {
      nodes: visibleNodes,
      links: filteredGraphData.links.filter(link => {
        const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
        const targetId = typeof link.target === 'object' ? link.target.id : link.target;
        return !link.hidden && nodeIds.has(sourceId) && nodeIds.has(targetId);
      }),
    };
  }, [filteredGraphData]);

  // Compute connected entities for the selected node
  const connectedEntities = useMemo(() => {
    if (!selectedNode) return [];
    
    return visibleGraphData.links
      .filter(link => {
        const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
        const targetId = typeof link.target === 'object' ? link.target.id : link.target;
        return sourceId === selectedNode.id || targetId === selectedNode.id;
      })
      .map(link => {
        const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
        const targetId = typeof link.target === 'object' ? link.target.id : link.target;
        const connectedNodeId = sourceId === selectedNode.id ? targetId : sourceId;
        const connectedNode = visibleGraphData.nodes.find((n: GraphNode) => n.id === connectedNodeId);
        if (!connectedNode) return null;
        return { connectedNode, link };
      })
      .filter(Boolean);
  }, [selectedNode, visibleGraphData]);

  // Handlers
  const handleSearch = useCallback(() => {
    if (!searchQuery.trim()) return;
    fetchEntityGraph(searchQuery);
  }, [searchQuery, fetchEntityGraph]);

  const handleNodeClick = useCallback((node: GraphNode) => {
    setSelectedNode(node);
    
    if (node.sourceDocument) {
      const newFilter = new Set(documentFilter);
      if (documentFilter.has(node.id)) {
        newFilter.delete(node.id);
      } else {
        newFilter.add(node.id);
      }
      setDocumentFilter(newFilter);
    }
  }, [documentFilter]);

  const handleBackgroundClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  const toggleFilter = useCallback((filterId: string) => {
    setFilters(prev => prev.includes(filterId) ? prev.filter(f => f !== filterId) : [...prev, filterId]);
  }, []);

  const clearDocumentFilter = useCallback(() => {
    setDocumentFilter(new Set());
  }, []);

  const toggleDocumentFilter = useCallback((docId: string) => {
    setDocumentFilter(prev => {
      const newFilter = new Set(prev);
      if (newFilter.has(docId)) {
        newFilter.delete(docId);
      } else {
        newFilter.add(docId);
      }
      return newFilter;
    });
  }, []);

  // Utility functions for InfoPanel
  const getNodeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'person': return <Users size={14} />;
      case 'organization': return <Building size={14} />;
      case 'location': return <MapPin size={14} />;
      case 'datetime': return <Calendar size={14} />;
      case 'concept': return <BookOpen size={14} />;
      case 'case': return <BookOpen size={14} />;
      case 'court': return <Scale size={14} />;
      default: return <FileText size={14} />;
    }
  };

  const formatMetadata = (key: string, value: any): string => {
    if (key === 'created_at' || key === 'updated_at' || key.includes('date')) {
      try {
        return new Date(value).toLocaleString();
      } catch (e) {
        return String(value);
      }
    }
    if (typeof value === 'object') {
      try {
        return JSON.stringify(value);
      } catch (e) {
        return '[Complex object]';
      }
    }
    return String(value);
  };

  return (
    <div className="fixed inset-0 bg-background/90 backdrop-blur-md z-50">
      <div className="absolute inset-0 overflow-hidden">
        {/* Main visualization area with everything inside it */}
        <div className="w-full h-full relative" ref={containerRef}>
          <GraphVisualization
            graphData={visibleGraphData}
            dimensions={dimensions}
            loading={loading}
            error={error}
            selectedNode={selectedNode}
            documentFilter={documentFilter}
            documentItems={documentItems}
            filters={filters}
            filterOptions={ENTITY_FILTER_OPTIONS}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            handleSearch={handleSearch}
            handleNodeClick={handleNodeClick}
            handleBackgroundClick={handleBackgroundClick}
            toggleFilter={toggleFilter}
            clearDocumentFilter={clearDocumentFilter}
            toggleDocumentFilter={toggleDocumentFilter}
            onClose={onClose}
            graphRef={graphRef}
          />
          
          {/* InfoPanel - Positioned absolutely */}
          {selectedNode && (
            <div 
              className="info-panel-container" 
              style={{
                position: 'absolute',
                right: '16px',
                top: '16px',
                bottom: '16px',
                width: '320px',
                backgroundColor: 'rgba(31, 41, 55, 0.7)', // bg-gray-800 with opacity
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(75, 85, 99, 0.4)', // border-gray-700/40
                borderRadius: '12px',
                zIndex: 100,
                overflow: 'hidden',
                display: 'block',
                visibility: 'visible',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)'
              }}
            >
              <InfoPanel
                selectedNode={selectedNode}
                showProperties={showProperties}
                setShowProperties={setShowProperties}
                documentFilter={documentFilter}
                toggleDocumentFilter={toggleDocumentFilter}
                connectedEntities={connectedEntities}
                handleNodeClick={handleNodeClick}
                getNodeIcon={getNodeIcon}
                formatMetadata={formatMetadata}
                onClose={() => setSelectedNode(null)}
                graphRef={graphRef}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}