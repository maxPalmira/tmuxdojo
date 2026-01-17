
import React from 'react';
import { LayoutNode } from '../types';
import TerminalPane from './TerminalPane';

interface LayoutRendererProps {
  node: LayoutNode;
  activePaneId: string;
  paneContents: Record<string, string[]>;
  showIndices?: boolean;
  startIndex?: number;
  activeClockPaneIds?: string[];
}

const countPanes = (node: LayoutNode): number => {
  if (node.type === 'pane') return 1;
  return countPanes(node.children![0]) + countPanes(node.children![1]);
};

const LayoutRenderer: React.FC<LayoutRendererProps> = ({ 
  node, 
  activePaneId, 
  paneContents, 
  showIndices = false, 
  startIndex = 0,
  activeClockPaneIds = []
}) => {
  if (node.type === 'pane') {
    return (
      <div className="flex-1 relative flex">
        <TerminalPane 
          id={node.id!} 
          isActive={node.id === activePaneId} 
          content={paneContents[node.id!] || ['Welcome to tmux practice session...', 'Waiting for command...']}
          showIndex={showIndices}
          index={startIndex}
          isClockVisible={activeClockPaneIds.includes(node.id!)}
        />
      </div>
    );
  }

  const isVertical = node.direction === 'vertical';
  const leftPaneCount = countPanes(node.children![0]);

  return (
    <div className={`flex flex-1 ${isVertical ? 'flex-row' : 'flex-col'} w-full h-full`}>
      <LayoutRenderer 
        node={node.children![0]} 
        activePaneId={activePaneId} 
        paneContents={paneContents}
        showIndices={showIndices}
        startIndex={startIndex}
        activeClockPaneIds={activeClockPaneIds}
      />
      <div className={`${isVertical ? 'w-[2px] h-full' : 'h-[2px] w-full'} bg-[#24283b]`} />
      <LayoutRenderer 
        node={node.children![1]} 
        activePaneId={activePaneId} 
        paneContents={paneContents}
        showIndices={showIndices}
        startIndex={startIndex + leftPaneCount}
        activeClockPaneIds={activeClockPaneIds}
      />
    </div>
  );
};

export default LayoutRenderer;
