
import React from 'react';
import { LayoutNode } from '../types';
import TerminalPane from './TerminalPane';

interface LayoutRendererProps {
  node: LayoutNode;
  activePaneId: string;
  paneContents: Record<string, string[]>;
}

const LayoutRenderer: React.FC<LayoutRendererProps> = ({ node, activePaneId, paneContents }) => {
  if (node.type === 'pane') {
    return (
      <TerminalPane 
        id={node.id!} 
        isActive={node.id === activePaneId} 
        content={paneContents[node.id!] || ['Welcome to tmux practice session...', 'Waiting for command...']}
      />
    );
  }

  const isVertical = node.direction === 'vertical';

  return (
    <div className={`flex flex-1 ${isVertical ? 'flex-row' : 'flex-col'} w-full h-full`}>
      <LayoutRenderer 
        node={node.children![0]} 
        activePaneId={activePaneId} 
        paneContents={paneContents}
      />
      <div className={`${isVertical ? 'w-[2px] h-full' : 'h-[2px] w-full'} bg-[#24283b]`} />
      <LayoutRenderer 
        node={node.children![1]} 
        activePaneId={activePaneId} 
        paneContents={paneContents}
      />
    </div>
  );
};

export default LayoutRenderer;
