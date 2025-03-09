// src/components/vault/InfoPanel.tsx
import React from 'react';
import { X, Search, ChevronDown, ChevronUp } from 'lucide-react';
import { GraphNode } from '../../types/graph';

interface InfoPanelProps {
  selectedNode: GraphNode;
  showProperties: boolean;
  setShowProperties: (show: boolean) => void;
  documentFilter: Set<string>;
  toggleDocumentFilter: (docId: string) => void;
  connectedEntities: { connectedNode: GraphNode; link: any }[];
  handleNodeClick: (node: GraphNode) => void;
  getNodeIcon: (type: string) => React.ReactNode;
  formatMetadata: (key: string, value: any) => string;
  onClose: () => void;
  graphRef: React.RefObject<any>;
}

export const InfoPanel: React.FC<InfoPanelProps> = ({
  selectedNode,
  showProperties,
  setShowProperties,
  documentFilter,
  toggleDocumentFilter,
  connectedEntities,
  handleNodeClick,
  getNodeIcon,
  formatMetadata,
  onClose,
  graphRef,
}) => {
  console.log("InfoPanel rendering with node:", selectedNode?.name);
  console.log("Connected entities:", connectedEntities?.length);
  
  // Safety check - if somehow selectedNode is null, don't render
  if (!selectedNode) {
    console.warn("InfoPanel received a null selectedNode");
    return null;
  }

  return (
    <div className="flex flex-col h-full w-full">
      {/* Panel header */}
      <div className="p-4 border-b border-gray-700/50 bg-gray-900/50 flex items-center justify-between">
        <h3 className="font-semibold text-white">Entity Details</h3>
        <button onClick={onClose} className="p-1 hover:bg-gray-700 rounded-md">
          <X className="w-4 h-4 text-gray-400" />
        </button>
      </div>
      {/* Entity header */}
      <div className="p-4 border-b border-gray-700/50 bg-gray-800/70">
        <div className="flex items-center gap-3 mb-3">
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center" 
            style={{ backgroundColor: selectedNode.color }}
          >
            {getNodeIcon(selectedNode.type)}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-white text-lg truncate" title={selectedNode.name}>
              {selectedNode.name}
            </h4>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 px-2 py-0.5 rounded-full bg-gray-700/50 capitalize">
                {selectedNode.type}
              </span>
              {selectedNode.sourceDocument && (
                <span className="text-xs text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-900/30">
                  Document
                </span>
              )}
            </div>
          </div>
        </div>
        {selectedNode.metadata?.description && (
          <div className="mt-2 text-sm text-gray-300 bg-gray-700/30 p-2 rounded-md">
            {selectedNode.metadata.description}
          </div>
        )}
        <div className="flex gap-2 mt-3">
          {selectedNode.sourceDocument && (
            <>
              <button
                className={`flex-1 py-1.5 px-2 rounded text-xs ${
                  documentFilter.has(selectedNode.id)
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                }`}
                onClick={() => toggleDocumentFilter(selectedNode.id)}
              >
                {documentFilter.has(selectedNode.id) ? 'Remove Filter' : 'Add to Filter'}
              </button>
              <button
                className="flex items-center gap-1 py-1.5 px-2 rounded text-xs bg-gray-700 text-gray-200 hover:bg-gray-600"
              >
                <Search size={12} />
                <span>View</span>
              </button>
            </>
          )}
          <button
            className="flex items-center gap-1 py-1.5 px-2 rounded text-xs bg-blue-600 text-white hover:bg-blue-500"
            onClick={() => {
              // Check if graphRef exists and has current value
              if (graphRef?.current && selectedNode?.x && selectedNode?.y) {
                graphRef.current.centerAt(selectedNode.x, selectedNode.y, 1000);
                graphRef.current.zoom(2.5, 1000);
              }
            }}
          >
            <Search size={12} />
            <span>Focus</span>
          </button>
        </div>
      </div>
      {/* Properties accordion */}
      <div className="border-b border-gray-700/50">
        <div 
          className="p-3 flex items-center justify-between cursor-pointer hover:bg-gray-700/30"
          onClick={() => setShowProperties(!showProperties)}
        >
          <h4 className="text-sm font-medium text-gray-300">Properties</h4>
          {showProperties ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
        </div>
        {showProperties && (
          <div className="px-3 pb-3">
            <div className="bg-gray-900/40 rounded-md p-2 max-h-40 overflow-y-auto">
              {selectedNode.metadata && Object.keys(selectedNode.metadata).length > 0 ? (
                Object.entries(selectedNode.metadata)
                  .filter(([key]) => 
                    !['name', 'type', 'source_document', 'original_labels', 'preview', 'content', 'metadata_json'].includes(key) &&
                    selectedNode.metadata[key] !== null &&
                    selectedNode.metadata[key] !== undefined
                  )
                  .map(([key, value]) => (
                    <div key={key} className="flex justify-between text-sm py-1 border-b border-gray-700/30 last:border-0">
                      <span className="text-gray-400 capitalize">{key.replace(/_/g, ' ')}</span>
                      <span className="text-gray-300 text-right max-w-[160px] truncate">
                        {formatMetadata(key, value)}
                      </span>
                    </div>
                  ))
              ) : (
                <div className="text-center text-gray-400 text-sm py-2">No additional properties</div>
              )}
            </div>
          </div>
        )}
      </div>
      {/* Connected entities */}
      <div className="flex-1 overflow-y-auto p-3">
        <h4 className="text-sm font-medium text-gray-300 mb-2">Connected Entities</h4>
        <div className="space-y-2">
          {connectedEntities && connectedEntities.length > 0 ? (
            connectedEntities.map(({ connectedNode, link }, index) => (
              <div key={`${connectedNode.id}-${index}`} className="p-2 bg-gray-900/50 rounded-md hover:bg-gray-800/60 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: connectedNode.color }}>
                      {getNodeIcon(connectedNode.type)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm text-gray-300 truncate" title={connectedNode.name}>
                        {connectedNode.name}
                      </p>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-500 capitalize">
                          {typeof link.type === 'string' ? link.type.replace(/_/g, ' ') : ''}
                        </span>
                        <span className="text-gray-600">•</span>
                        <span className="text-xs text-gray-500 capitalize">{connectedNode.type}</span>
                      </div>
                    </div>
                  </div>
                  <button 
                    className="text-xs bg-gray-700 hover:bg-gray-600 text-white px-2 py-1 rounded ml-2 flex-shrink-0"
                    onClick={() => handleNodeClick(connectedNode)}
                  >
                    View
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-sm text-gray-400 text-center py-4">
              No visible connections for this entity.
              <br />
              Try adjusting your filters to see more relationships.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};