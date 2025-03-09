// src/components/vault/GraphVisualization.tsx
import React, { useRef, useEffect } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { GraphNode, GraphLink } from '../../types/graph';
import { EntityTypeFilters } from './EntityTypeFilters';
import { DocumentFilterPanel } from './DocumentFilterPanel';

interface GraphVisualizationProps {
  graphData: { nodes: GraphNode[]; links: GraphLink[]; };
  dimensions: { width: number; height: number; };
  loading: boolean;
  error: string | null;
  selectedNode: GraphNode | null;
  documentFilter: Set<string>;
  documentFilterOptions: { id: string; name: string; selected: boolean }[];
  filters: string[];
  filterOptions: { id: string; label: string; icon: React.ReactNode }[];
  handleNodeClick: (node: GraphNode) => void;
  handleBackgroundClick: () => void;
  toggleFilter: (filterId: string) => void;
  clearDocumentFilter: () => void;
  toggleDocumentFilter: (docId: string) => void;
  graphRef?: React.RefObject<any>;
}

export const GraphVisualization: React.FC<GraphVisualizationProps> = ({
  graphData,
  dimensions,
  loading,
  error,
  selectedNode,
  documentFilter,
  documentFilterOptions,
  filters,
  filterOptions,
  handleNodeClick,
  handleBackgroundClick,
  toggleFilter,
  clearDocumentFilter,
  toggleDocumentFilter,
  graphRef,
}) => {
  const localGraphRef = useRef<any>(null);
  const effectiveRef = graphRef || localGraphRef;

  useEffect(() => {
    if (effectiveRef.current && graphData.nodes.length > 0 && !loading) {
      if (effectiveRef.current.d3ReheatSimulation) {
        effectiveRef.current.d3ReheatSimulation();
      }
      setTimeout(() => {
        if (effectiveRef.current && effectiveRef.current.zoomToFit) {
          effectiveRef.current.zoomToFit(300, 20);
        }
      }, 1000);
    }
  }, [graphData.nodes.length, loading, effectiveRef]);

  // Custom node rendering logic
  const nodeCanvasObject = (node: GraphNode, ctx: CanvasRenderingContext2D, globalScale: number) => {
    if (!node.x || !node.y) return;
    
    const size = (node.size || 8) / globalScale;
    const isSelected = selectedNode && selectedNode.id === node.id;
    const isSourceDoc = node.sourceDocument;
    const isFilteredDoc = isSourceDoc && documentFilter.has(node.id);

    if (isSourceDoc) {
      const docSize = size * 1.2;
      ctx.fillStyle = isFilteredDoc ? '#16a34a' : (node.color || '#64748b');
      ctx.fillRect(node.x - docSize / 2, node.y - docSize / 2, docSize, docSize);
      ctx.beginPath();
      ctx.moveTo(node.x + docSize / 2 - docSize * 0.3, node.y - docSize / 2);
      ctx.lineTo(node.x + docSize / 2, node.y - docSize / 2 + docSize * 0.3);
      ctx.lineTo(node.x + docSize / 2, node.y - docSize / 2);
      ctx.closePath();
      ctx.fillStyle = '#fff';
      ctx.fill();
      if (isSelected) {
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2 / globalScale;
        ctx.strokeRect(node.x - docSize / 2, node.y - docSize / 2, docSize, docSize);
      }
    } else {
      ctx.beginPath();
      ctx.arc(node.x, node.y, size, 0, 2 * Math.PI);
      ctx.fillStyle = node.color || '#8b5cf6';
      ctx.fill();
      if (isSelected) {
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2 / globalScale;
        ctx.stroke();
      }
      ctx.fillStyle = '#fff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = `${size / 1.2}px Sans-Serif`;
      let typeChar = '';
      switch (node.type.toLowerCase()) {
        case 'person': typeChar = 'P'; break;
        case 'organization': typeChar = 'O'; break;
        case 'datetime': typeChar = 'D'; break;
        case 'location': typeChar = 'L'; break;
        case 'concept': typeChar = 'C'; break;
        case 'case': typeChar = 'CA'; break;
        case 'court': typeChar = 'CT'; break;
        case 'judge': typeChar = 'J'; break;
        case 'statute': typeChar = 'S'; break;
        case 'party': typeChar = 'PT'; break;
        default: typeChar = 'E';
      }
      ctx.fillText(typeChar, node.x, node.y);
    }
    
    // Draw label for all nodes
    const label = node.name.length > 20 ? node.name.substring(0, 20) + '...' : node.name;
    const fontSize = isSourceDoc ? 14 / globalScale : 12 / globalScale;
    ctx.font = `${fontSize}px Sans-Serif`;
    const textWidth = ctx.measureText(label).width;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(node.x - textWidth / 2 - 4, node.y + size + 2, textWidth + 8, fontSize + 4);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = isSelected ? '#fff' : 'rgba(255, 255, 255, 0.9)';
    ctx.fillText(label, node.x, node.y + size + fontSize / 2 + 4);
  };

  // Custom link rendering logic
  const linkCanvasObject = (link: GraphLink, ctx: CanvasRenderingContext2D, globalScale: number) => {
    if (!link.source || !link.target) return;
    
    const sourceNode = typeof link.source === 'object' ? link.source : {};
    const targetNode = typeof link.target === 'object' ? link.target : {};
    
    if (!sourceNode.x || !sourceNode.y || !targetNode.x || !targetNode.y) return;
    
    const sourceX = sourceNode.x;
    const sourceY = sourceNode.y;
    const targetX = targetNode.x;
    const targetY = targetNode.y;
    
    ctx.beginPath();
    ctx.moveTo(sourceX, sourceY);
    ctx.lineTo(targetX, targetY);
    ctx.strokeStyle = link.color || '#999';
    ctx.lineWidth = (link.dashed ? 1 : 1.5) / globalScale;
    
    if (link.dashed) {
      ctx.setLineDash([5 / globalScale, 5 / globalScale]);
    } else {
      ctx.setLineDash([]);
    }
    
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Draw arrow
    const arrowLength = 4 / globalScale;
    const dx = targetX - sourceX;
    const dy = targetY - sourceY;
    const angle = Math.atan2(dy, dx);
    const arrowPosX = sourceX + dx * 0.8;
    const arrowPosY = sourceY + dy * 0.8;
    
    ctx.beginPath();
    ctx.moveTo(arrowPosX, arrowPosY);
    ctx.lineTo(
      arrowPosX - arrowLength * Math.cos(angle - Math.PI / 6),
      arrowPosY - arrowLength * Math.sin(angle - Math.PI / 6)
    );
    ctx.lineTo(
      arrowPosX - arrowLength * Math.cos(angle + Math.PI / 6),
      arrowPosY - arrowLength * Math.sin(angle + Math.PI / 6)
    );
    ctx.closePath();
    ctx.fillStyle = link.color || '#999';
    ctx.fill();
    
    // Draw link type label if zoomed in enough
    if (globalScale > 1.2) {
      const midX = (sourceX + targetX) / 2;
      const midY = (sourceY + targetY) / 2 - 8 / globalScale;
      const label = link.type || '';
      ctx.font = `${10 / globalScale}px Sans-Serif`;
      const textWidth = ctx.measureText(label).width;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(midX - textWidth / 2 - 2 / globalScale, midY - 6 / globalScale, textWidth + 4 / globalScale, 12 / globalScale);
      ctx.fillStyle = '#fff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(label, midX, midY);
    }
  };

  return (
    <div className="flex-1 relative">
      {loading ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="absolute inset-0 flex items-center justify-center flex-col p-8">
          <div className="text-red-500 text-lg mb-2">Error loading graph data</div>
          <div className="text-gray-400 text-center">{error}</div>
        </div>
      ) : dimensions.width > 0 && dimensions.height > 0 && graphData.nodes.length > 0 ? (
        <>
          {/* Filter controls - positioned as overlays */}
          <div className="absolute top-4 left-4 z-10">
            <div className="bg-gray-800/90 backdrop-blur-sm rounded-lg border border-gray-700/50 shadow-lg w-64 max-h-[calc(100vh-300px)] overflow-auto">
              <div className="p-3 border-b border-gray-700/50">
                <h3 className="font-medium text-gray-300">Filters</h3>
              </div>
              <div className="p-2">
                <EntityTypeFilters
                  filterOptions={filterOptions}
                  filters={filters}
                  toggleFilter={toggleFilter}
                />
              </div>
              <div className="p-2 pt-0">
                <DocumentFilterPanel
                  documentFilterOptions={documentFilterOptions}
                  documentFilterSize={documentFilter.size}
                  clearDocumentFilter={clearDocumentFilter}
                  toggleDocumentFilter={toggleDocumentFilter}
                />
              </div>
            </div>
          </div>

          <ForceGraph2D
            ref={effectiveRef}
            graphData={graphData}
            nodeId="id"
            linkSource="source"
            linkTarget="target"
            backgroundColor="#0f172a"
            width={dimensions.width}
            height={dimensions.height}
            onNodeClick={handleNodeClick}
            onBackgroundClick={handleBackgroundClick}
            nodeCanvasObject={nodeCanvasObject}
            linkCanvasObject={linkCanvasObject}
            cooldownTime={2000}
            d3AlphaDecay={0.015}
            d3VelocityDecay={0.25}
            warmupTicks={100}
            centerAt={[0, 0]}
            minZoom={0.5}
            maxZoom={8}
            d3Force={(d3Force, nodes, links) => {
              // Create a center force
              d3Force('center', () => {
                return { x: 0, y: 0, strength: 0.15 };
              });
              
              // Adjust link distance
              d3Force('link')
                .id(d => d.id)
                .distance(() => 40);
              
              // Adjust charge force
              d3Force('charge')
                .strength(-50);
              
              // Add collision detection
              d3Force('collide', () => 20);
            }}
            onEngineStop={() => {
              if (effectiveRef.current) {
                setTimeout(() => {
                  effectiveRef.current.zoomToFit(300, 20);
                }, 500);
              }
            }}
          />
        </>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center flex-col p-8">
          <div className="text-gray-400 text-center mb-4">No entity data available.</div>
          <div className="text-gray-400 text-center">
            {loading ? 'Loading...' : error ? `Error: ${error}` : 'No data found to display.'}
          </div>
        </div>
      )}
    </div>
  );
};