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
  // Safety check - if somehow selectedNode is null, don't render
  if (!selectedNode) {
    return null;
  }

  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      {/* Panel header */}
      <div className="p-4 border-b border-gray-600/30 bg-gray-800/30 backdrop-blur-md flex items-center justify-between">
        <h3 className="font-semibold text-white text-lg">Entity Details</h3>
        <button 
          onClick={onClose} 
          className="p-1.5 hover:bg-gray-700/50 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-gray-300 hover:text-white" />
        </button>
      </div>
      
      {/* Entity header */}
      <div className="p-4 border-b border-gray-600/30 bg-gray-700/20">
        <div className="flex items-center gap-3 mb-3">
          <div 
            className="w-12 h-12 rounded-full flex items-center justify-center" 
            style={{ backgroundColor: selectedNode.color }}
          >
            {React.cloneElement(getNodeIcon(selectedNode.type) as React.ReactElement, { size: 20 })}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-white text-xl truncate" title={selectedNode.name}>
              {selectedNode.name}
            </h4>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-gray-300 px-2 py-0.5 rounded-full bg-gray-700/50 capitalize">
                {selectedNode.type}
              </span>
              {selectedNode.sourceDocument && (
                <span className="text-xs text-emerald-300 px-2 py-0.5 rounded-full bg-emerald-800/30">
                  Document
                </span>
              )}
            </div>
          </div>
        </div>
        
        {selectedNode.metadata?.description && (
          <div className="mt-3 text-sm text-gray-200 bg-gray-700/30 p-3 rounded-lg">
            {selectedNode.metadata.description}
          </div>
        )}
        
        <div className="flex gap-2 mt-4">
          {selectedNode.sourceDocument && (
            <>
              <button
                className={`flex-1 py-2 px-3 rounded-lg text-sm transition-colors ${
                  documentFilter.has(selectedNode.id)
                    ? 'bg-green-600/80 hover:bg-green-500/80 text-white'
                    : 'bg-gray-700/60 text-gray-200 hover:bg-gray-600/60'
                }`}
                onClick={() => toggleDocumentFilter(selectedNode.id)}
              >
                {documentFilter.has(selectedNode.id) ? 'Remove Filter' : 'Add to Filter'}
              </button>
            </>
          )}
          <button
            className="flex items-center gap-1.5 py-2 px-3 rounded-lg text-sm bg-blue-600/70 hover:bg-blue-500/70 text-white transition-colors"
            onClick={() => {
              // Check if graphRef exists and has current value
              if (graphRef?.current && selectedNode?.x && selectedNode?.y) {
                graphRef.current.centerAt(selectedNode.x, selectedNode.y, 1000);
                graphRef.current.zoom(2.5, 1000);
              }
            }}
          >
            <Search size={16} />
            <span>Focus</span>
          </button>
        </div>
      </div>
      
      {/* Properties accordion */}
      <div className="border-b border-gray-600/30">
        <div 
          className="p-3 flex items-center justify-between cursor-pointer hover:bg-gray-700/30 transition-colors"
          onClick={() => setShowProperties(!showProperties)}
        >
          <h4 className="text-sm font-medium text-gray-200">Properties</h4>
          {showProperties ? 
            <ChevronUp size={18} className="text-gray-400" /> : 
            <ChevronDown size={18} className="text-gray-400" />
          }
        </div>
        
        {showProperties && (
          <div className="px-3 pb-3">
            <div className="bg-gray-800/40 backdrop-blur-sm rounded-lg p-3 max-h-48 overflow-y-auto">
              {selectedNode.metadata && Object.keys(selectedNode.metadata).length > 0 ? (
                Object.entries(selectedNode.metadata)
                  .filter(([key]) => 
                    !['name', 'type', 'source_document', 'original_labels', 'preview', 'content', 'metadata_json'].includes(key) &&
                    selectedNode.metadata[key] !== null &&
                    selectedNode.metadata[key] !== undefined
                  )
                  .map(([key, value]) => (
                    <div key={key} className="flex justify-between text-sm py-2 border-b border-gray-700/30 last:border-0">
                      <span className="text-gray-300 capitalize">{key.replace(/_/g, ' ')}</span>
                      <span className="text-gray-200 text-right max-w-[180px] truncate font-medium">
                        {formatMetadata(key, value)}
                      </span>
                    </div>
                  ))
              ) : (
                <div className="text-center text-gray-400 text-sm py-4">No additional properties</div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Connected entities */}
      <div className="flex-1 overflow-y-auto p-3 bg-gray-800/10">
        <h4 className="text-sm font-medium text-gray-200 mb-3">Connected Entities</h4>
        
        <div className="space-y-2.5">
          {connectedEntities && connectedEntities.length > 0 ? (
            connectedEntities.map(({ connectedNode, link }, index) => (
              <div key={`${connectedNode.id}-${index}`} className="p-3 bg-gray-800/30 backdrop-blur-sm rounded-lg hover:bg-gray-700/30 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" 
                      style={{ backgroundColor: connectedNode.color }}
                    >
                      {getNodeIcon(connectedNode.type)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm text-gray-200 truncate font-medium" title={connectedNode.name}>
                        {connectedNode.name}
                      </p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-xs text-gray-400 capitalize">
                          {typeof link.type === 'string' ? link.type.replace(/_/g, ' ') : ''}
                        </span>
                        <span className="text-gray-500">•</span>
                        <span className="text-xs text-gray-400 capitalize">{connectedNode.type}</span>
                      </div>
                    </div>
                  </div>
                  <button 
                    className="text-xs bg-gray-700/60 hover:bg-gray-600/60 text-gray-200 px-2.5 py-1.5 rounded-lg ml-2 flex-shrink-0"
                    onClick={() => handleNodeClick(connectedNode)}
                  >
                    View
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-sm text-gray-400 text-center py-6 bg-gray-800/20 rounded-lg">
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