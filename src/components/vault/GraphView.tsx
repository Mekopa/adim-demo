// src/components/vault/GraphView.tsx
import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { 
  X, Filter, Search, File, FileText, Image as ImageIcon, Folder as FolderIcon, 
  Download, ExternalLink, Info, ChevronDown, ChevronRight, ChevronUp, FileCode, 
  FileSpreadsheet, Users, Building, Hash, Scale, BookOpen
} from 'lucide-react';
import { Folder, VaultFile } from '../../types/vault';
import { useDocumentGraph } from '../../hooks/useDocumentGraph';

// Define node types
const NODE_TYPES = {
  // Structure nodes
  FOLDER: 'folder',
  FILE: 'file',
  
  // File type nodes
  PDF: 'pdf',
  DOCUMENT: 'document',
  SPREADSHEET: 'spreadsheet',
  IMAGE: 'image',
  CODE: 'code',
  
  // Content nodes
  SECTION: 'section',
  PARAGRAPH: 'paragraph',
  DEFINITION: 'definition',
  CLAUSE: 'clause',
  
  // Entity nodes from Neo4j
  PERSON: 'person',
  ORGANIZATION: 'organization',
  DATE: 'date',
  LOCATION: 'location',
  TERM: 'term',
  CASE: 'case',
  COURT: 'court',
  JUDGE: 'judge',
  STATUTE: 'statute',
  PARTY: 'party',
  ENTITY: 'entity'
};

// Relationship types between nodes
const RELATIONSHIP_TYPES = {
  // Structural relationships
  CONTAINS: 'contains',
  PART_OF: 'part_of',
  SAME_FOLDER: 'same_folder',
  
  // Neo4j relationships
  REFERENCES: 'references',
  MENTIONS: 'mentions',
  RELATED_TO: 'related_to',
  CITES: 'cites',
  HEARD_IN: 'heard_in',
  AFFILIATED_WITH: 'affiliated_with'
};

// Visual styling constants
const NODE_COLORS = {
  // Structure colors
  [NODE_TYPES.FOLDER]: '#4b6bfb',
  [NODE_TYPES.FILE]: '#64748b',
  
  // File type colors
  [NODE_TYPES.PDF]: '#e11d48',
  [NODE_TYPES.DOCUMENT]: '#2563eb',
  [NODE_TYPES.SPREADSHEET]: '#16a34a',
  [NODE_TYPES.IMAGE]: '#10b981',
  [NODE_TYPES.CODE]: '#8b5cf6',
  
  // Content colors
  [NODE_TYPES.SECTION]: '#f59e0b',
  [NODE_TYPES.PARAGRAPH]: '#a16207',
  [NODE_TYPES.DEFINITION]: '#0891b2',
  [NODE_TYPES.CLAUSE]: '#db2777',
  
  // Entity colors
  [NODE_TYPES.PERSON]: '#f97316',
  [NODE_TYPES.ORGANIZATION]: '#ec4899',
  [NODE_TYPES.DATE]: '#64748b',
  [NODE_TYPES.LOCATION]: '#06b6d4',
  [NODE_TYPES.TERM]: '#6366f1',
  [NODE_TYPES.CASE]: '#f59e0b',
  [NODE_TYPES.COURT]: '#0891b2',
  [NODE_TYPES.JUDGE]: '#8b5cf6',
  [NODE_TYPES.STATUTE]: '#2563eb',
  [NODE_TYPES.PARTY]: '#16a34a',
  [NODE_TYPES.ENTITY]: '#8b5cf6'
};

// Node size by type
const NODE_SIZES = {
  [NODE_TYPES.FOLDER]: 16,
  [NODE_TYPES.FILE]: 12,
  [NODE_TYPES.PDF]: 12,
  [NODE_TYPES.DOCUMENT]: 12,
  [NODE_TYPES.SPREADSHEET]: 12,
  [NODE_TYPES.IMAGE]: 12,
  [NODE_TYPES.CODE]: 12,
  [NODE_TYPES.SECTION]: 8,
  [NODE_TYPES.PARAGRAPH]: 7,
  [NODE_TYPES.DEFINITION]: 7,
  [NODE_TYPES.CLAUSE]: 7,
  [NODE_TYPES.PERSON]: 6,
  [NODE_TYPES.ORGANIZATION]: 6,
  [NODE_TYPES.DATE]: 5,
  [NODE_TYPES.LOCATION]: 5,
  [NODE_TYPES.TERM]: 5,
  [NODE_TYPES.CASE]: 8,
  [NODE_TYPES.COURT]: 7,
  [NODE_TYPES.JUDGE]: 7,
  [NODE_TYPES.STATUTE]: 7,
  [NODE_TYPES.PARTY]: 6,
  [NODE_TYPES.ENTITY]: 6
};

// Interfaces for typed data
interface GraphNode {
  id: string;
  name: string;
  type: string;
  subType?: string;
  parentId?: string;
  color?: string;
  size?: number;
  expanded?: boolean;
  hidden?: boolean;
  clusterId?: string;
  level: number; // 0=folder, 1=file, 2=section, 3=paragraph/content
  metadata?: {
    createdAt?: string;
    updatedAt?: string;
    size?: number;
    content?: string;
    preview?: string;
    [key: string]: any;
  };
  x?: number;
  y?: number;
}

interface GraphLink {
  source: string | any;
  target: string | any;
  type: string;
  strength?: number;
  color?: string;
  dashed?: boolean;
  hidden?: boolean;
  metadata?: {
    description?: string;
    similarity?: number;
    [key: string]: any;
  };
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

interface GraphViewProps {
  onClose: () => void;
  currentPath: string[];
  folders: Folder[];
  files: VaultFile[];
  selectedDocumentId?: string; // Added selectedDocumentId prop
}

export default function GraphView({ 
  onClose, 
  currentPath, 
  folders, 
  files,
  selectedDocumentId 
}: GraphViewProps) {
  // Local state variables
  const [filters, setFilters] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [showInfoPanel, setShowInfoPanel] = useState(false);
  
  // References for container and graph
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<any>(null);

  // Use the document graph hook to fetch real Neo4j data
  const { 
    graphData, 
    loading, 
    error, 
    currentFolderId,
    fetchDocumentGraph,
    fetchEntityGraph,
    fetchFolderGraph,
    clearGraphData
  } = useDocumentGraph();

  // Update dimensions when container size changes
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const newDimensions = {
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight
        };
        setDimensions(newDimensions);
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Fetch data based on selection and current folder
  useEffect(() => {
    if (selectedDocumentId) {
      // If a document is selected, load its graph
      fetchDocumentGraph(selectedDocumentId);
    } else {
      // Get current folder ID from path
      let folderContext = '';
      
      if (currentPath.length > 0) {
        const currentFolderId = currentPath[currentPath.length - 1];
        folderContext = currentFolderId;
      }
      
      // Load folder-scoped graph data
      fetchFolderGraph(folderContext);
    }

    // Clear selection when data source changes
    setSelectedNode(null);
    setExpandedNodes(new Set());
  }, [selectedDocumentId, currentPath, fetchDocumentGraph, fetchFolderGraph]);

  // Context-aware filter options
  const filterOptions = useMemo(() => [
    { id: 'documents', label: 'Documents', icon: <FileText size={14} /> },
    { id: 'folders', label: 'Folders', icon: <FolderIcon size={14} /> },
    { id: 'people', label: 'People', icon: <Users size={14} /> },
    { id: 'organizations', label: 'Organizations', icon: <Building size={14} /> },
    { id: 'cases', label: 'Legal Cases', icon: <BookOpen size={14} /> },
    { id: 'statutes', label: 'Statutes', icon: <Scale size={14} /> },
    { id: 'entities', label: 'Other Entities', icon: <Hash size={14} /> },
    { id: 'relationships', label: 'All Connections', icon: <ExternalLink size={14} /> }
  ], []);

  // Handle search for entities and documents
  const handleSearch = useCallback(() => {
    if (!searchQuery.trim()) return;
    
    // If search looks like an entity name, search for that entity
    if (searchQuery.length > 2) {
      fetchEntityGraph(searchQuery);
    }
  }, [searchQuery, fetchEntityGraph]);

  // Handle node expansion/collapse
  const toggleNodeExpansion = useCallback((node: GraphNode) => {
    // Update expanded state in expandedNodes Set
    const newExpandedNodes = new Set(expandedNodes);
    
    if (newExpandedNodes.has(node.id)) {
      newExpandedNodes.delete(node.id);
    } else {
      newExpandedNodes.add(node.id);
    }
    
    setExpandedNodes(newExpandedNodes);
    
    // Update node visibility based on expansion state
    const newNodes = [...graphData.nodes];
    const newLinks = [...graphData.links];
    
    // First, get all descendants of this node
    const getDescendants = (nodeId: string) => {
      const directChildren = newNodes.filter(n => n.parentId === nodeId);
      let allDescendants = [...directChildren];
      
      directChildren.forEach(child => {
        allDescendants = [...allDescendants, ...getDescendants(child.id)];
      });
      
      return allDescendants;
    };
    
    const descendants = getDescendants(node.id);
    
    // Update node expanded/hidden state
    const nodeIndex = newNodes.findIndex(n => n.id === node.id);
    if (nodeIndex !== -1) {
      newNodes[nodeIndex] = {
        ...newNodes[nodeIndex],
        expanded: newExpandedNodes.has(node.id)
      };
    }
    
    // Update children hidden state
    const directChildren = newNodes.filter(n => n.parentId === node.id);
    
    directChildren.forEach(child => {
      const childIndex = newNodes.findIndex(n => n.id === child.id);
      if (childIndex !== -1) {
        newNodes[childIndex] = {
          ...newNodes[childIndex],
          hidden: !newExpandedNodes.has(node.id)
        };
      }
    });
    
    // If collapsing, hide all descendants
    if (!newExpandedNodes.has(node.id)) {
      descendants.forEach(desc => {
        const descIndex = newNodes.findIndex(n => n.id === desc.id);
        if (descIndex !== -1) {
          newNodes[descIndex] = {
            ...newNodes[descIndex],
            hidden: true
          };
        }
        
        // Also collapse any expanded descendants
        if (newExpandedNodes.has(desc.id)) {
          newExpandedNodes.delete(desc.id);
        }
      });
    }
    
    // Update links visibility
    newLinks.forEach((link, index) => {
      const source = typeof link.source === 'string' ? link.source : link.source.id;
      const target = typeof link.target === 'string' ? link.target : link.target.id;
      
      // Hide links to hidden nodes
      const sourceNode = newNodes.find(n => n.id === source);
      const targetNode = newNodes.find(n => n.id === target);
      
      if (sourceNode && targetNode) {
        newLinks[index] = {
          ...newLinks[index],
          hidden: sourceNode.hidden || targetNode.hidden
        };
      }
    });
    
    // Update graph data
    const updatedGraphData = {
      ...graphData,
      nodes: newNodes,
      links: newLinks
    };
    
    // Here we'd update the graph data state
    // But since we're using the hook's data, we just need to modify the local state
    // that controls visibility
  }, [graphData, expandedNodes]);

  // Handle node click
  const handleNodeClick = useCallback((node: GraphNode) => {
    setSelectedNode(node);
    setShowInfoPanel(true);
    
    // If this node has children, toggle expansion
    const hasChildren = graphData.nodes.some(n => n.parentId === node.id);
    
    if (hasChildren) {
      toggleNodeExpansion(node);
    }
  }, [graphData.nodes, toggleNodeExpansion]);

  // Handle background click
  const handleBackgroundClick = useCallback(() => {
    setSelectedNode(null);
    setShowInfoPanel(false);
  }, []);

  // Toggle filter
  const toggleFilter = useCallback((filterId: string) => {
    setFilters(prev => 
      prev.includes(filterId) 
        ? prev.filter(f => f !== filterId)
        : [...prev, filterId]
    );
  }, []);

  // Filter graph data based on selected filters
  const filteredGraphData = useMemo(() => {
    if (filters.length === 0) return graphData;
    
    // Create a copy of the graph data
    const filteredNodes = [...graphData.nodes];
    const filteredLinks = [...graphData.links];
    
    // Apply filters
    const showDocuments = filters.includes('documents');
    const showFolders = filters.includes('folders');
    const showPeople = filters.includes('people');
    const showOrgs = filters.includes('organizations');
    const showCases = filters.includes('cases');
    const showStatutes = filters.includes('statutes');
    const showEntities = filters.includes('entities');
    const showRelationships = filters.includes('relationships');
    
    // Hide nodes based on filters
    filteredNodes.forEach((node, index) => {
      let shouldHide = false;
      
      if (node.type === 'folder' && !showFolders) {
        shouldHide = true;
      } else if (['file', 'pdf', 'document', 'spreadsheet', 'image', 'code'].includes(node.type) && !showDocuments) {
        shouldHide = true;
      } else if (node.type === 'person' && !showPeople && !showEntities) {
        shouldHide = true;
      } else if (node.type === 'organization' && !showOrgs && !showEntities) {
        shouldHide = true;
      } else if (node.type === 'case' && !showCases && !showEntities) {
        shouldHide = true;
      } else if (node.type === 'statute' && !showStatutes && !showEntities) {
        shouldHide = true;
      } else if (['court', 'judge', 'party', 'entity', 'term', 'date', 'location'].includes(node.type) && !showEntities) {
        shouldHide = true;
      }
      
      filteredNodes[index] = {
        ...filteredNodes[index],
        hidden: shouldHide || node.hidden
      };
    });
    
    // Hide links based on filters and connected nodes
    filteredLinks.forEach((link, index) => {
      const source = typeof link.source === 'string' ? link.source : link.source.id;
      const target = typeof link.target === 'string' ? link.target : link.target.id;
      
      const sourceNode = filteredNodes.find(n => n.id === source);
      const targetNode = filteredNodes.find(n => n.id === target);
      
      let shouldHide = false;
      
      if (sourceNode?.hidden || targetNode?.hidden) {
        shouldHide = true;
      } else if (!showRelationships && ![
        'contains', 'part_of', 'same_folder'
      ].includes(link.type)) {
        shouldHide = true;
      }
      
      filteredLinks[index] = {
        ...filteredLinks[index],
        hidden: shouldHide || link.hidden
      };
    });
    
    return {
      nodes: filteredNodes,
      links: filteredLinks,
      clusters: graphData.clusters
    };
  }, [graphData, filters]);

  // Prepare visible data for rendering (exclude hidden nodes/links)
  const visibleGraphData = useMemo(() => {
    return {
      nodes: filteredGraphData.nodes.filter(node => !node.hidden),
      links: filteredGraphData.links.filter(link => !link.hidden),
      clusters: filteredGraphData.clusters
    };
  }, [filteredGraphData]);

  // Header with context information
  const renderHeader = () => {
    // Get current folder name
    let contextInfo = null;
    
    if (selectedDocumentId) {
      const selectedFile = files.find(f => f.id === selectedDocumentId);
      contextInfo = (
        <p className="text-sm text-gray-400">
          Document: {selectedFile?.name || 'Unknown document'}
        </p>
      );
    } else if (currentPath.length > 0) {
      const currentFolderId = currentPath[currentPath.length - 1];
      const currentFolder = folders.find(f => f.id === currentFolderId);
      contextInfo = (
        <p className="text-sm text-gray-400">
          Folder: {currentFolder?.name || 'Unknown folder'}
        </p>
      );
    }
    
    return (
      <div className="flex items-center justify-between p-4 border-b border-gray-700/50 bg-gray-900/50">
        <div className="flex items-center gap-2">
          <FileText className="w-6 h-6 text-primary" />
          <div>
            <h2 className="text-xl font-semibold text-text">Document Graph</h2>
            {contextInfo}
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-gray-400 hover:text-white" />
        </button>
      </div>
    );
  };

  // Format metadata for display
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
      <div className="absolute inset-4 bg-gray-900 rounded-xl shadow-xl flex flex-col overflow-hidden border border-gray-700/50">
        {/* Header */}
        {renderHeader()}

        {/* Search Bar */}
        <div className="flex items-center p-2 gap-2 border-b border-gray-700/50">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search for entities or documents..."
            className="bg-transparent border-none outline-none text-sm text-gray-300 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button 
            className="text-xs bg-gray-700 hover:bg-gray-600 text-white px-2 py-1 rounded"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>

        {/* Filters */}
        <div className="border-b border-gray-700/50 p-3 bg-gray-800/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <span className="text-sm font-medium text-gray-300">Show:</span>
            <div className="flex flex-wrap gap-2">
              {filterOptions.map(filter => (
                <button
                  key={filter.id}
                  onClick={() => toggleFilter(filter.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-full transition-colors ${
                    filters.includes(filter.id)
                      ? 'bg-primary text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {filter.icon}
                  <span>{filter.label}</span>
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center">
            <span className="text-sm text-gray-400 mr-2">Tip: Click on nodes to explore relationships</span>
          </div>
        </div>

        {/* Main content area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Graph visualization */}
          <div ref={containerRef} className="flex-1 relative">
            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : error ? (
              <div className="absolute inset-0 flex items-center justify-center flex-col p-8">
                <div className="text-red-500 text-lg mb-2">Error loading graph data</div>
                <div className="text-gray-400 text-center">{error}</div>
              </div>
            ) : dimensions.width > 0 && dimensions.height > 0 && visibleGraphData.nodes.length > 0 ? (
              <ForceGraph2D
                ref={graphRef}
                graphData={visibleGraphData}
                nodeLabel={(node: GraphNode) => {
                  let label = `${node.name}`;
                  
                  // Add type info
                  if (node.level === 1) { // File
                    label += `\nType: ${node.type.toUpperCase()}`;
                  } else if (node.level >= 2) { // Content
                    label += `\nType: ${node.type}`;
                  }
                  
                  // Add additional info
                  if (node.metadata) {
                    if (node.metadata.description) {
                      label += `\n${node.metadata.description}`;
                    }
                  }
                  
                  return label;
                }}
                nodeColor={(node: GraphNode) => node.color || '#999'}
                nodeVal={(node: GraphNode) => node.size || 5}
                linkColor={(link: GraphLink) => link.color || '#999'}
                linkDirectional={true}
                linkCurvature={0.25}
                linkDirectionalArrowLength={4}
                linkDirectionalArrowRelPos={0.8}
                linkDirectionalParticles={3}
                linkDirectionalParticleWidth={2}
                linkWidth={(link: GraphLink) => link.dashed ? 1 : 1.5}
                linkLineDash={(link: GraphLink) => link.dashed ? [5, 5] : null}
                onNodeClick={handleNodeClick}
                onBackgroundClick={handleBackgroundClick}
                backgroundColor="#0f172a"
                width={dimensions.width}
                height={dimensions.height}
                cooldownTime={3000}
                d3AlphaDecay={0.02}
                d3VelocityDecay={0.3}
                nodeCanvasObject={(node: GraphNode, ctx, globalScale) => {
                  if (!node.x || !node.y) return;
                  
                  const size = (node.size || 5) / globalScale;
                  const isExpanded = expandedNodes.has(node.id);
                  const hasChildren = filteredGraphData.nodes.some(n => n.parentId === node.id && !n.hidden);
                  
                  // Check if node is selected
                  const isSelected = selectedNode && selectedNode.id === node.id;
                  
                  // Draw expansion indicator for nodes with children
                  if (hasChildren) {
                    // Draw expansion icon (+ or -)
                    ctx.fillStyle = isExpanded ? '#ef4444' : '#10b981';
                    ctx.beginPath();
                    ctx.arc(node.x - size - 4, node.y, size / 3, 0, 2 * Math.PI);
                    ctx.fill();
                    
                    // Draw + or - symbol
                    ctx.fillStyle = '#fff';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.font = `bold ${size / 2}px Sans-Serif`;
                    ctx.fillText(
                      isExpanded ? '-' : '+',
                      node.x - size - 4,
                      node.y
                    );
                  }
                  
                  // Draw node based on type
                  if (node.type === 'folder') {
                    // Folder node (show as a folder shape)
                    const folderWidth = size * 2;
                    const folderHeight = size * 1.6;
                    const tabHeight = folderHeight * 0.25;
                    
                    // Draw folder shape
                    ctx.fillStyle = node.color || '#4b6bfb';
                    ctx.beginPath();
                    // Tab
                    ctx.moveTo(node.x - folderWidth / 2, node.y - folderHeight / 2);
                    ctx.lineTo(node.x - folderWidth / 4, node.y - folderHeight / 2);
                    ctx.lineTo(node.x - folderWidth / 4, node.y - folderHeight / 2 + tabHeight);
                    ctx.lineTo(node.x + folderWidth / 2, node.y - folderHeight / 2 + tabHeight);
                    ctx.lineTo(node.x + folderWidth / 2, node.y + folderHeight / 2);
                    ctx.lineTo(node.x - folderWidth / 2, node.y + folderHeight / 2);
                    ctx.closePath();
                    ctx.fill();
                    
                    // Draw border if selected
                    if (isSelected) {
                      ctx.strokeStyle = '#fff';
                      ctx.lineWidth = 2 / globalScale;
                      ctx.stroke();
                    }
                  } else if (node.level === 1 || ['file', 'pdf', 'document', 'spreadsheet', 'image', 'code'].includes(node.type)) {
                    // File nodes
                    const fileWidth = size * 1.6;
                    const fileHeight = size * 2;
                    const cornerSize = fileHeight * 0.2;
                    
                    ctx.fillStyle = node.color || '#64748b';
                    ctx.beginPath();
                    ctx.moveTo(node.x - fileWidth / 2, node.y - fileHeight / 2);
                    ctx.lineTo(node.x + fileWidth / 2 - cornerSize, node.y - fileHeight / 2);
                    ctx.lineTo(node.x + fileWidth / 2, node.y - fileHeight / 2 + cornerSize);
                    ctx.lineTo(node.x + fileWidth / 2, node.y + fileHeight / 2);
                    ctx.lineTo(node.x - fileWidth / 2, node.y + fileHeight / 2);
                    ctx.closePath();
                    ctx.fill();
                    
                    // Draw corner fold
                    ctx.beginPath();
                    ctx.moveTo(node.x + fileWidth / 2 - cornerSize, node.y - fileHeight / 2);
                    ctx.lineTo(node.x + fileWidth / 2 - cornerSize, node.y - fileHeight / 2 + cornerSize);
                    ctx.lineTo(node.x + fileWidth / 2, node.y - fileHeight / 2 + cornerSize);
                    ctx.closePath();
                    ctx.fillStyle = '#fff';
                    ctx.fill();
                    
                    // Draw border if selected
                    if (isSelected) {
                      ctx.strokeStyle = '#fff';
                      ctx.lineWidth = 2 / globalScale;
                      ctx.stroke();
                    }
                    
                    // Draw file type indicator
                    ctx.fillStyle = '#fff';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.font = `bold ${size / 1.2}px Sans-Serif`;
                    
                    // Get file type abbreviation
                    let typeAbbr = '';
                    if (node.type === 'pdf') typeAbbr = 'PDF';
                    else if (node.type === 'document') typeAbbr = 'DOC';
                    else if (node.type === 'spreadsheet') typeAbbr = 'XLS';
                    else if (node.type === 'image') typeAbbr = 'IMG';
                    else if (node.type === 'code') typeAbbr = 'CODE';
                    else typeAbbr = 'DOC';
                    
                    ctx.fillText(
                      typeAbbr,
                      node.x,
                      node.y
                    );
                  } else {
                    // Entity and other nodes (draw as circles)
                    ctx.beginPath();
                    ctx.arc(node.x, node.y, size, 0, 2 * Math.PI);
                    ctx.fillStyle = node.color || '#64748b';
                    ctx.fill();
                    
                    // Draw border if selected
                    if (isSelected) {
                      ctx.strokeStyle = '#fff';
                      ctx.lineWidth = 2 / globalScale;
                      ctx.stroke();
                    }
                    
                    // Draw type indicator
                    ctx.fillStyle = '#fff';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.font = `${size / 1.2}px Sans-Serif`;
                    
                    // Get entity type abbreviation
                    let typeChar = '';
                    if (node.type === 'person') typeChar = 'P';
                    else if (node.type === 'organization') typeChar = 'O';
                    else if (node.type === 'date') typeChar = 'D';
                    else if (node.type === 'location') typeChar = 'L';
                    else if (node.type === 'term') typeChar = 'T';
                    else if (node.type === 'case') typeChar = 'C';
                    else if (node.type === 'court') typeChar = 'CT';
                    else if (node.type === 'judge') typeChar = 'J';
                    else if (node.type === 'statute') typeChar = 'S';
                    else if (node.type === 'party') typeChar = 'PT';
                    else typeChar = 'E';
                    
                    ctx.fillText(
                      typeChar,
                      node.x,
                      node.y
                    );
                  }
                  
                  // Draw label for all nodes
                  const label = node.name.length > 20 
                    ? node.name.substring(0, 20) + '...' 
                    : node.name;
                  
                  const fontSize = node.level === 0 ? 14 / globalScale :
                                  node.level === 1 ? 12 / globalScale :
                                  10 / globalScale;
                  
                  ctx.font = `${fontSize}px Sans-Serif`;
                  const textWidth = ctx.measureText(label).width;
                  
                  // Background for text
                  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
                  ctx.fillRect(
                    node.x - textWidth / 2 - 4,
                    node.y + size + 2,
                    textWidth + 8,
                    fontSize + 4
                  );
                  
                  // Text
                  ctx.textAlign = 'center';
                  ctx.textBaseline = 'middle';
                  ctx.fillStyle = isSelected ? '#fff' : 'rgba(255, 255, 255, 0.9)';
                  ctx.fillText(
                    label,
                    node.x,
                    node.y + size + fontSize / 2 + 4
                  );
                }}
                onRenderFramePre={(ctx) => {
                  // Draw clusters
                  Object.values(filteredGraphData.clusters).forEach(cluster => {
                    // Get visible nodes in this cluster
                    const clusterNodes = visibleGraphData.nodes.filter(n => n.clusterId === cluster.id);
                    if (!clusterNodes.length) return;
                    
                    // Calculate the bounding box
                    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
                    
                    clusterNodes.forEach(node => {
                      if (!node.x || !node.y) return;
                      minX = Math.min(minX, node.x);
                      minY = Math.min(minY, node.y);
                      maxX = Math.max(maxX, node.x);
                      maxY = Math.max(maxY, node.y);
                    });
                    
                    // Skip if we couldn't compute a valid bounding box
                    if (minX === Infinity || maxX === -Infinity) return;
                    
                    // Add padding
                    const padding = 40;
                    minX -= padding;
                    minY -= padding;
                    maxX += padding;
                    maxY += padding;
                    
                    // Draw folder boundary (rounded rectangle)
                    const radius = 20;
                    ctx.beginPath();
                    ctx.moveTo(minX + radius, minY);
                    ctx.lineTo(maxX - radius, minY);
                    ctx.quadraticCurveTo(maxX, minY, maxX, minY + radius);
                    ctx.lineTo(maxX, maxY - radius);
                    ctx.quadraticCurveTo(maxX, maxY, maxX - radius, maxY);
                    ctx.lineTo(minX + radius, maxY);
                    ctx.quadraticCurveTo(minX, maxY, minX, maxY - radius);
                    ctx.lineTo(minX, minY + radius);
                    ctx.quadraticCurveTo(minX, minY, minX + radius, minY);
                    ctx.closePath();
                    
                    // Fill with translucent color
                    ctx.fillStyle = `${cluster.color}20`;
                    ctx.fill();
                    
                    // Draw border
                    ctx.strokeStyle = cluster.color;
                    ctx.lineWidth = 1.5;
                    ctx.stroke();
                    
                    // Draw folder name 
                    const fontSize = 16;
                    ctx.font = `bold ${fontSize}px Sans-Serif`;
                    const textWidth = ctx.measureText(cluster.name).width;
                    
                    // Background for folder name
                    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
                    ctx.fillRect(
                      (minX + maxX) / 2 - textWidth / 2 - 8,
                      minY - fontSize - 8,
                      textWidth + 16,
                      fontSize + 10
                    );
                    
                    // Folder name text
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillStyle = '#fff';
                    ctx.fillText(
                      cluster.name,
                      (minX + maxX) / 2,
                      minY - fontSize / 2 - 3
                    );
                  });
                }}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center flex-col p-8">
                <div className="text-gray-400 text-center mb-4">No graph data available.</div>
                {!selectedDocumentId && currentPath.length === 0 && (
                  <div className="text-gray-400 text-center">
                    Select a document to view its graph or navigate to a folder to view folder content.
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Information panel */}
          {showInfoPanel && selectedNode && (
            <div className="w-80 bg-gray-800 border-l border-gray-700/50 overflow-y-auto flex flex-col">
              <div className="p-4 border-b border-gray-700/50 bg-gray-900/50 flex items-center justify-between">
                <h3 className="font-semibold text-white">Node Details</h3>
                <button
                  onClick={() => setShowInfoPanel(false)}
                  className="p-1 hover:bg-gray-700 rounded-md"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>
              
              <div className="p-4 border-b border-gray-700/50">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: selectedNode.color }}>
                    {selectedNode.type === 'folder' ? (
                      <FolderIcon className="w-4 h-4 text-white" />
                    ) : selectedNode.type === 'pdf' ? (
                      <FileText className="w-4 h-4 text-white" />
                    ) : selectedNode.type === 'document' ? (
                      <File className="w-4 h-4 text-white" />
                    ) : selectedNode.type === 'spreadsheet' ? (
                      <FileSpreadsheet className="w-4 h-4 text-white" />
                    ) : (
                      <Info className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium text-white">{selectedNode.name}</h4>
                    <p className="text-sm text-gray-400">{selectedNode.type}</p>
                  </div>
                </div>
                
                {/* Node properties */}
                {selectedNode.metadata && Object.keys(selectedNode.metadata).length > 0 && (
                  <div className="mt-2 space-y-2">
                    {Object.entries(selectedNode.metadata)
                      .filter(([key]) => 
                        !['original_labels', 'preview', 'content', 'metadata_json'].includes(key) && 
                        selectedNode.metadata[key] !== null && 
                        selectedNode.metadata[key] !== undefined
                      )
                      .map(([key, value]) => (
                        <div key={key} className="flex justify-between text-sm">
                          <span className="text-gray-400 capitalize">{key.replace(/_/g, ' ')}:</span>
                          <span className="text-gray-300 text-right max-w-[180px] truncate">
                            {formatMetadata(key, value)}
                          </span>
                        </div>
                      ))
                    }
                  </div>
                )}
              </div>
              
              {/* Related nodes */}
              <div className="p-4 flex-1 overflow-y-auto">
                <h4 className="text-sm font-medium text-gray-300 mb-2">Related Items</h4>
                
                <div className="space-y-2">
                  {/* Parent node */}
                  {selectedNode.parentId && (
                    <div className="p-2 bg-gray-900/50 rounded-md">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full flex items-center justify-center bg-gray-700">
                            <ChevronUp className="w-3 h-3 text-gray-300" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-300">
                              {graphData.nodes.find(n => n.id === selectedNode.parentId)?.name || 'Parent'}
                            </p>
                            <p className="text-xs text-gray-500">Parent</p>
                          </div>
                        </div>
                        <button 
                          className="text-xs bg-gray-700 hover:bg-gray-600 text-white px-2 py-1 rounded"
                          onClick={() => {
                            const parentNode = graphData.nodes.find(n => n.id === selectedNode.parentId);
                            if (parentNode) handleNodeClick(parentNode);
                          }}
                        >
                          View
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {/* Child nodes */}
                  {graphData.nodes
                    .filter(n => n.parentId === selectedNode.id)
                    .map(childNode => (
                      <div key={childNode.id} className="p-2 bg-gray-900/50 rounded-md">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: childNode.color }}>
                              <ChevronDown className="w-3 h-3 text-white" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-300">{childNode.name}</p>
                              <p className="text-xs text-gray-500">{childNode.type}</p>
                            </div>
                          </div>
                          <button 
                            className="text-xs bg-gray-700 hover:bg-gray-600 text-white px-2 py-1 rounded"
                            onClick={() => handleNodeClick(childNode)}
                          >
                            View
                          </button>
                        </div>
                      </div>
                    ))}
                  
                  {/* Connected nodes via links */}
                  {graphData.links
                    .filter(link => {
                      const source = typeof link.source === 'string' ? link.source : link.source.id;
                      const target = typeof link.target === 'string' ? link.target : link.target.id;
                      return (source === selectedNode.id || target === selectedNode.id) && 
                             source !== selectedNode.parentId && 
                             target !== selectedNode.parentId;
                    })
                    .map((link, index) => {
                      const source = typeof link.source === 'string' ? link.source : link.source.id;
                      const target = typeof link.target === 'string' ? link.target : link.target.id;
                      const connectedNodeId = source === selectedNode.id ? target : source;
                      const connectedNode = graphData.nodes.find(n => n.id === connectedNodeId);
                      
                      if (!connectedNode) return null;
                      
                      return (
                        <div key={`${source}-${target}-${index}`} className="p-2 bg-gray-900/50 rounded-md">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: connectedNode.color }}>
                                <ExternalLink className="w-3 h-3 text-white" />
                              </div>
                              <div>
                                <p className="text-sm text-gray-300">{connectedNode.name}</p>
                                <p className="text-xs text-gray-500">
                                  {link.type.replace('_', ' ')} • {connectedNode.type}
                                </p>
                              </div>
                            </div>
                            <button 
                              className="text-xs bg-gray-700 hover:bg-gray-600 text-white px-2 py-1 rounded"
                              onClick={() => handleNodeClick(connectedNode)}
                            >
                              View
                            </button>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}