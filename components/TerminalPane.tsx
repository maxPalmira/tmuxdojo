import React from 'react';
import { TERMINAL_COLORS } from '../constants';

interface TerminalPaneProps {
  id: string;
  isActive: boolean;
  content: string[];
  showIndex?: boolean;
  index?: number;
}

const TerminalPane: React.FC<TerminalPaneProps> = ({ id, isActive, content, showIndex, index }) => {
  return (
    <div 
      className={`flex-1 flex flex-col p-4 border overflow-hidden relative transition-colors duration-200 ${isActive ? 'border-[#7aa2f7]' : 'border-[#24283b]'} ${TERMINAL_COLORS.bg}`}
    >
      <div className="absolute top-1 right-2 text-[10px] opacity-30 mono select-none">
        pane_id: {id.slice(0, 4)}
      </div>

      {showIndex && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <span className="text-[12rem] font-black text-[#7aa2f7]/20 select-none animate-in fade-in duration-300">
            {index}
          </span>
        </div>
      )}

      <div className="flex-1 overflow-y-auto font-mono text-sm space-y-1 z-10">
        {content.map((line, idx) => (
          <div key={idx} className={`${idx === content.length - 1 ? 'animate-pulse' : ''}`}>
            <span className="text-[#9ece6a] mr-2">➜</span>
            <span className={TERMINAL_COLORS.text}>{line}</span>
          </div>
        ))}
        {isActive && (
          <div className="flex items-center">
            <span className="text-[#9ece6a] mr-2">➜</span>
            <span className="w-2 h-4 bg-[#7aa2f7] animate-pulse"></span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TerminalPane;