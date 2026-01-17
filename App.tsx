
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AppState, WindowType, LayoutNode, CommandBarMode } from './types';
import { LEVELS, LEVEL_GROUPS, TERMINAL_COLORS } from './constants';
import LayoutRenderer from './components/LayoutRenderer';
import { Terminal, Shield, Circle, Layers, CheckCircle, ChevronRight, Keyboard, Info, RotateCcw, List, X, Copy, Clock, Hash } from 'lucide-react';

const createPane = (id: string): LayoutNode => ({ type: 'pane', id });

const findPaneById = (node: LayoutNode, id: string): LayoutNode | null => {
  if (node.type === 'pane' && node.id === id) return node;
  if (node.children) {
    return findPaneById(node.children[0], id) || findPaneById(node.children[1], id);
  }
  return null;
};

const getFlatPanes = (node: LayoutNode): string[] => {
  if (node.type === 'pane') return [node.id!];
  return [...getFlatPanes(node.children![0]), ...getFlatPanes(node.children![1])];
};

const rotateLayoutPanes = (node: LayoutNode, shiftedIds: string[], indexRef: { val: number }): LayoutNode => {
  if (node.type === 'pane') {
    return { ...node, id: shiftedIds[indexRef.val++] };
  }
  return {
    ...node,
    children: [
      rotateLayoutPanes(node.children![0], shiftedIds, indexRef),
      rotateLayoutPanes(node.children![1], shiftedIds, indexRef)
    ] as [LayoutNode, LayoutNode]
  };
};

const removePaneFromLayout = (node: LayoutNode, targetId: string): LayoutNode | null => {
  if (node.type === 'pane') {
    return node.id === targetId ? null : node;
  }
  if (node.children) {
    const left = removePaneFromLayout(node.children[0], targetId);
    const right = removePaneFromLayout(node.children[1], targetId);

    if (left === null) return right;
    if (right === null) return left;

    return { ...node, children: [left, right] };
  }
  return node;
};

const findTargetPaneId = (root: LayoutNode, currentId: string, direction: string): string | undefined => {
  const findPath = (node: LayoutNode, target: string, path: LayoutNode[] = []): LayoutNode[] | null => {
    if (node.type === 'pane') return node.id === target ? [...path, node] : null;
    const left = findPath(node.children![0], target, [...path, node]);
    if (left) return left;
    return findPath(node.children![1], target, [...path, node]);
  };

  const path = findPath(root, currentId);
  if (!path) return undefined;

  for (let i = path.length - 2; i >= 0; i--) {
    const node = path[i];
    const isVertical = node.direction === 'vertical'; // Side-by-side
    const isHorizontal = node.direction === 'horizontal'; // Top-Bottom
    const childIndex = node.children![0] === path[i + 1] ? 0 : 1;

    let movePossible = false;
    if (direction === 'ArrowLeft' && isVertical && childIndex === 1) movePossible = true;
    if (direction === 'ArrowRight' && isVertical && childIndex === 0) movePossible = true;
    if (direction === 'ArrowUp' && isHorizontal && childIndex === 1) movePossible = true;
    if (direction === 'ArrowDown' && isHorizontal && childIndex === 0) movePossible = true;

    if (movePossible) {
      let targetBranch = node.children![childIndex === 0 ? 1 : 0];
      while (targetBranch.type === 'split') {
        if (direction === 'ArrowLeft' || direction === 'ArrowUp') {
            targetBranch = targetBranch.children![1];
        } else {
            targetBranch = targetBranch.children![0];
        }
      }
      return targetBranch.id;
    }
  }
  return undefined;
};

const getInitialStateForLevel = (levelIndex: number) => {
  const level = LEVELS.find(l => l.id === levelIndex) || LEVELS[0];
  const paneId = `pane-${levelIndex}-${Date.now()}`;
  
  const initialState = level.initialState ? {
    windows: JSON.parse(JSON.stringify(level.initialState.windows)),
    activeWindowIndex: level.initialState.activeWindowIndex,
  } : {
    windows: [{
      id: `win-${levelIndex}`,
      name: 'bash',
      layout: createPane(paneId),
      activePaneId: paneId
    }],
    activeWindowIndex: 0
  };

  return {
    ...initialState,
    paneContents: level.initialState?.paneContents || { [paneId]: ['Welcome to tmux practice session...', 'Waiting for command...'] }
  };
};

const KeyCap: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="inline-flex items-center justify-center px-2 py-1 min-w-[1.6rem] bg-[#1e293b] border border-[#475569] border-b-4 rounded-lg text-[10px] text-white font-mono font-bold shadow-md mx-1 align-middle transition-all">
    {children}
  </span>
);

const introSubtitle = "Escape the cursor. Embrace the terminal.";
const introBody = [
  "You are entering the Dojo of TMUX.",
  "Here, your mouse is useless. Your trackpad is a burden.",
  "Learn the shortcuts. Master the windows. Command the screen.",
  "The prefix is your life: Ctrl + b is the key to everything."
];

const App: React.FC = () => {
  const [state, setState] = useState<AppState & { isPendingSuccess: boolean; isIntroOpen: boolean }>({
    windows: [],
    activeWindowIndex: 0,
    prefixActive: false,
    isConfirming: false,
    confirmationTarget: 'none',
    isZoomed: false,
    activeClockPaneIds: [],
    isListingSessions: false,
    selectedWindowListIndex: 0,
    isCopyMode: false,
    isDetached: false,
    isRenamingWindow: false,
    renameBuffer: '',
    isShowingIndices: false,
    commandBarMode: 'none',
    currentLevel: 0,
    actionProgressIndex: 0,
    completedLevels: [],
    inputHistory: [],
    feedback: null,
    isPendingSuccess: false,
    isIntroOpen: true,
  });

  const [lastKeyPressed, setLastKeyPressed] = useState<string>("");
  const [showTOC, setShowTOC] = useState(false);
  const [paneContents, setPaneContents] = useState<Record<string, string[]>>({});
  
  const lastDKeyTime = useRef<number>(0);
  const indicesTimerRef = useRef<number | null>(null);

  const level = LEVELS.find(l => l.id === state.currentLevel) || LEVELS[0];
  const activeWindow = state.windows[state.activeWindowIndex];

  const resetLevel = useCallback(() => {
    const newState = getInitialStateForLevel(state.currentLevel);
    setPaneContents(newState.paneContents);
    if (indicesTimerRef.current) window.clearTimeout(indicesTimerRef.current);
    setState(prev => ({
      ...prev,
      ...newState,
      actionProgressIndex: 0,
      feedback: null,
      isPendingSuccess: false,
      prefixActive: false,
      commandBarMode: 'none' as CommandBarMode,
      isConfirming: false,
      confirmationTarget: 'none' as 'none',
      isZoomed: false,
      activeClockPaneIds: [],
      isListingSessions: false,
      selectedWindowListIndex: 0,
      isCopyMode: false,
      isDetached: false,
      isRenamingWindow: false,
      renameBuffer: '',
      isShowingIndices: false,
    }));
  }, [state.currentLevel]);

  const triggerSuccess = useCallback((lvlId: number, lvlTitle: string) => {
    setState(prev => ({ ...prev, isPendingSuccess: true }));
    const delay = 800;
    setTimeout(() => {
      setState(prev => ({
        ...prev,
        completedLevels: Array.from(new Set([...prev.completedLevels, prev.currentLevel])),
        feedback: { message: `Completed: ${lvlTitle}`, type: 'success' }
      }));
    }, delay);
  }, []);

  const handleAction = useCallback((action: string) => {
    if (state.isIntroOpen || state.isPendingSuccess) return;

    setState(prev => {
      let next = { ...prev };
      const currentLevelDef = LEVELS.find(l => l.id === prev.currentLevel);
      if (!currentLevelDef || currentLevelDef.id === 0) return prev;

      let correctActionForLvl = false;
      const expectedAction = currentLevelDef.requiredActions[prev.actionProgressIndex];

      // Main Window logic depends on having an active window
      const activeWin = next.windows[next.activeWindowIndex];
      const curPaneId = activeWin?.activePaneId;

      // Window List Navigation
      if (prev.isListingSessions) {
        if (action === 'ArrowUp') {
          next.selectedWindowListIndex = (prev.selectedWindowListIndex - 1 + prev.windows.length) % prev.windows.length;
          return next;
        } else if (action === 'ArrowDown') {
          next.selectedWindowListIndex = (prev.selectedWindowListIndex + 1) % prev.windows.length;
          return next;
        } else if (action === 'Enter') {
          next.activeWindowIndex = prev.selectedWindowListIndex;
          next.isListingSessions = false;
          next.commandBarMode = 'none';
          
          if (expectedAction === 'Enter' || expectedAction === 'w') {
            next.actionProgressIndex += 1;
            if (next.actionProgressIndex >= currentLevelDef.requiredActions.length) {
              triggerSuccess(currentLevelDef.id, currentLevelDef.title);
            }
          }
          return next;
        } else if (action === 'Escape' || action === 'q') {
          next.isListingSessions = false;
          next.commandBarMode = 'none';
          return next;
        }
        return next;
      }

      // 1. Clock Management (Dismissal)
      if (curPaneId && prev.activeClockPaneIds.includes(curPaneId)) {
        if (action === 'Escape') {
          next.activeClockPaneIds = prev.activeClockPaneIds.filter(id => id !== curPaneId);
          if (expectedAction === 'Escape') {
            next.actionProgressIndex += 1;
            if (next.actionProgressIndex >= currentLevelDef.requiredActions.length) {
              triggerSuccess(currentLevelDef.id, currentLevelDef.title);
            }
          }
          return next;
        }
        if (action !== 'prefix' && !prev.prefixActive) return next;
      }

      // 2. Index Management (Flash Pane Numbers)
      if (prev.isShowingIndices) {
        if (/^[0-9]$/.test(action)) {
          const winIdx = next.activeWindowIndex;
          const flat = getFlatPanes(next.windows[winIdx].layout);
          const jumpIdx = parseInt(action);
          if (jumpIdx < flat.length) {
            next.windows[winIdx] = { ...next.windows[winIdx], activePaneId: flat[jumpIdx] };
          }
          next.isShowingIndices = false;
          if (indicesTimerRef.current) window.clearTimeout(indicesTimerRef.current);
          
          if (action === expectedAction) {
             next.actionProgressIndex += 1;
             if (next.actionProgressIndex >= currentLevelDef.requiredActions.length) {
               triggerSuccess(currentLevelDef.id, currentLevelDef.title);
             }
          } else {
             next.actionProgressIndex = 0;
          }
          return next;
        }
        
        if (action !== 'prefix' && !prev.prefixActive) {
            next.isShowingIndices = false;
            if (indicesTimerRef.current) window.clearTimeout(indicesTimerRef.current);
        }
      }

      // 3. Confirmation Logic
      if (prev.isConfirming) {
        if (action === 'y') {
          if (prev.confirmationTarget === 'pane') {
            const winIdx = next.activeWindowIndex;
            const win = { ...next.windows[winIdx] };
            const newLayout = removePaneFromLayout(win.layout, win.activePaneId);
            if (newLayout) {
              win.layout = newLayout;
              const findAnyPane = (node: LayoutNode): string => node.type === 'pane' ? node.id! : findAnyPane(node.children![0]);
              win.activePaneId = findAnyPane(newLayout);
              next.windows[winIdx] = win;
            }
          } else if (prev.confirmationTarget === 'window') {
            if (next.windows.length > 1) {
              next.windows.splice(next.activeWindowIndex, 1);
              next.activeWindowIndex = Math.max(0, next.activeWindowIndex - 1);
            }
          }
          next.isConfirming = false;
          next.confirmationTarget = 'none';
          next.commandBarMode = 'none';
          if (action === expectedAction) {
             next.actionProgressIndex += 1;
             if (next.actionProgressIndex >= currentLevelDef.requiredActions.length) {
               triggerSuccess(currentLevelDef.id, currentLevelDef.title);
             }
          } else {
             next.actionProgressIndex = 0;
          }
          return next;
        } else if (action === 'n' || action === 'Escape') {
          next.isConfirming = false;
          next.confirmationTarget = 'none';
          next.commandBarMode = 'none';
          next.actionProgressIndex = 0;
          return next;
        }
      }

      // 4. Renaming Logic
      if (prev.isRenamingWindow) {
        if (action === 'Enter') {
          const winIdx = next.activeWindowIndex;
          const finalName = next.renameBuffer || 'bash';
          next.windows[winIdx] = { ...next.windows[winIdx], name: finalName };
          next.isRenamingWindow = false;
          next.commandBarMode = 'none';
          
          if (expectedAction === 'Enter') {
             next.actionProgressIndex += 1;
             if (next.actionProgressIndex >= currentLevelDef.requiredActions.length) {
               triggerSuccess(currentLevelDef.id, currentLevelDef.title);
             }
          } else {
             next.actionProgressIndex = 0;
          }
          return next;
        } else if (action === 'Backspace') {
          next.renameBuffer = next.renameBuffer.slice(0, -1);
          return next;
        } else if (action === 'Escape') {
          next.isRenamingWindow = false;
          next.commandBarMode = 'none';
          next.renameBuffer = '';
          return next;
        } else if (action.length === 1) {
          next.renameBuffer += action;
          return next;
        }
      }

      // 5. Global Reset (d + d)
      if (action.toLowerCase() === 'd') {
        const now = Date.now();
        if (now - lastDKeyTime.current < 400) {
          lastDKeyTime.current = 0;
          resetLevel();
          if (expectedAction === 'd') {
             // In level 5 we explicitly test for d d
          }
          return prev; 
        }
        lastDKeyTime.current = now;
      }

      // 6. Main Tmux Logic
      setLastKeyPressed(action);
      next.windows = prev.windows.map(w => ({ ...w }));
      const currentActiveWin = next.windows[next.activeWindowIndex];

      if (action === 'prefix') {
        next.prefixActive = true;
        if (expectedAction === 'prefix') {
          next.actionProgressIndex += 1;
          correctActionForLvl = true;
        } else {
          next.actionProgressIndex = 1; 
        }
      } else if (prev.prefixActive) {
        next.prefixActive = false;
        if (action === expectedAction) correctActionForLvl = true;

        if (action === '%') {
          const newPaneId = `p-${Date.now()}`;
          const splitNode = (node: LayoutNode, targetId: string): LayoutNode => {
            if (node.type === 'pane' && node.id === targetId) {
              return { type: 'split', direction: 'vertical', children: [{ type: 'pane', id: node.id }, { type: 'pane', id: newPaneId }] };
            }
            if (node.type === 'split' && node.children) {
              return { ...node, children: [splitNode(node.children[0], targetId), splitNode(node.children[1], targetId)] as [LayoutNode, LayoutNode] };
            }
            return node;
          };
          currentActiveWin.layout = splitNode(currentActiveWin.layout, currentActiveWin.activePaneId);
          currentActiveWin.activePaneId = newPaneId;
        } else if (action === '"') {
          const newPaneId = `p-${Date.now()}`;
          const splitNode = (node: LayoutNode, targetId: string): LayoutNode => {
            if (node.type === 'pane' && node.id === targetId) {
              return { type: 'split', direction: 'horizontal', children: [{ type: 'pane', id: node.id }, { type: 'pane', id: newPaneId }] };
            }
            if (node.type === 'split' && node.children) {
              return { ...node, children: [splitNode(node.children[0], targetId), splitNode(node.children[1], targetId)] as [LayoutNode, LayoutNode] };
            }
            return node;
          };
          currentActiveWin.layout = splitNode(currentActiveWin.layout, currentActiveWin.activePaneId);
          currentActiveWin.activePaneId = newPaneId;
        } else if (action.startsWith('Arrow')) {
          const nextId = findTargetPaneId(currentActiveWin.layout, currentActiveWin.activePaneId, action);
          if (nextId) currentActiveWin.activePaneId = nextId;
        } else if (action === 'z') {
          next.isZoomed = !next.isZoomed;
        } else if (action === 't') {
          if (!next.activeClockPaneIds.includes(currentActiveWin.activePaneId)) {
            next.activeClockPaneIds = [...next.activeClockPaneIds, currentActiveWin.activePaneId];
          }
        } else if (action === 'q') {
          next.isShowingIndices = true;
          if (indicesTimerRef.current) window.clearTimeout(indicesTimerRef.current);
          indicesTimerRef.current = window.setTimeout(() => {
            setState(s => ({ ...s, isShowingIndices: false }));
          }, 3000);
        } else if (action === 'c') {
          const newWinId = `win-${Date.now()}`;
          const newPaneId = `p-${Date.now()}`;
          next.windows.push({ id: newWinId, name: 'bash', layout: createPane(newPaneId), activePaneId: newPaneId });
          next.activeWindowIndex = next.windows.length - 1;
        } else if (action === 'n') {
          next.activeWindowIndex = (next.activeWindowIndex + 1) % next.windows.length;
        } else if (action === 'p') {
          next.activeWindowIndex = (next.activeWindowIndex - 1 + next.windows.length) % next.windows.length;
        } else if (/^[0-9]$/.test(action)) {
          const jumpIdx = parseInt(action);
          if (jumpIdx < next.windows.length) {
            next.activeWindowIndex = jumpIdx;
          }
        } else if (action === 'x') {
          next.isConfirming = true;
          next.confirmationTarget = 'pane';
          next.commandBarMode = 'command';
        } else if (action === '&') {
          next.isConfirming = true;
          next.confirmationTarget = 'window';
          next.commandBarMode = 'command';
        } else if (action === ',') {
          next.isRenamingWindow = true;
          next.renameBuffer = '';
          next.commandBarMode = 'rename-window';
        } else if (action === 'w') {
          next.isListingSessions = true;
          next.selectedWindowListIndex = next.activeWindowIndex;
          next.commandBarMode = 'list-windows';
        } else if (action === 'Control+o') {
          const flatIds = getFlatPanes(currentActiveWin.layout);
          if (flatIds.length > 1) {
            const rotatedIds = [flatIds[flatIds.length - 1], ...flatIds.slice(0, flatIds.length - 1)];
            const oldIndex = flatIds.indexOf(currentActiveWin.activePaneId);
            const newActiveId = rotatedIds[oldIndex];
            currentActiveWin.layout = rotateLayoutPanes(currentActiveWin.layout, rotatedIds, { val: 0 });
            currentActiveWin.activePaneId = newActiveId;
          }
        } else if (action === '{' || action === '}') {
          const flatIds = getFlatPanes(currentActiveWin.layout);
          const currentIdx = flatIds.indexOf(currentActiveWin.activePaneId);
          if (flatIds.length > 1) {
            let swapIdx = action === '{' ? currentIdx - 1 : currentIdx + 1;
            if (swapIdx < 0) swapIdx = flatIds.length - 1;
            if (swapIdx >= flatIds.length) swapIdx = 0;
            const newIds = [...flatIds];
            [newIds[currentIdx], newIds[swapIdx]] = [newIds[swapIdx], newIds[currentIdx]];
            currentActiveWin.layout = rotateLayoutPanes(currentActiveWin.layout, newIds, { val: 0 });
            currentActiveWin.activePaneId = flatIds[currentIdx]; 
          }
        } else if (action === 'o') {
          const flat = getFlatPanes(currentActiveWin.layout);
          const idx = flat.indexOf(currentActiveWin.activePaneId);
          currentActiveWin.activePaneId = flat[(idx + 1) % flat.length];
        } else if (action === ' ' || action === 'Spacebar') {
          const toggle = (node: LayoutNode): LayoutNode => {
            if (node.type === 'split') {
              return { ...node, direction: node.direction === 'vertical' ? 'horizontal' : 'vertical' };
            }
            return node;
          };
          currentActiveWin.layout = toggle(currentActiveWin.layout);
        }

        if (correctActionForLvl) {
          next.actionProgressIndex += 1;
        } else {
          next.actionProgressIndex = 0;
        }
      } else {
        if (action === expectedAction) {
           next.actionProgressIndex += 1;
           correctActionForLvl = true;
        } else {
           next.actionProgressIndex = 0;
        }
      }

      if (correctActionForLvl && next.actionProgressIndex >= currentLevelDef.requiredActions.length) {
        triggerSuccess(currentLevelDef.id, currentLevelDef.title);
      }

      return next;
    });
  }, [state.isIntroOpen, state.isPendingSuccess, triggerSuccess, resetLevel]);

  const advanceLevel = useCallback(() => {
    setState(prev => {
      const currentIndex = LEVELS.findIndex(l => l.id === prev.currentLevel);
      const nextIdx = (currentIndex !== -1 && currentIndex < LEVELS.length - 1) ? LEVELS[currentIndex + 1].id : LEVELS[0].id;
      const newState = getInitialStateForLevel(nextIdx);
      setPaneContents(newState.paneContents);
      if (indicesTimerRef.current) window.clearTimeout(indicesTimerRef.current);
      return {
        ...prev,
        ...newState,
        currentLevel: nextIdx,
        actionProgressIndex: 0,
        feedback: null,
        isPendingSuccess: false,
        prefixActive: false,
        isZoomed: false,
        activeClockPaneIds: [],
        isShowingIndices: false,
        isIntroOpen: false,
        isConfirming: false,
        confirmationTarget: 'none' as 'none',
        commandBarMode: 'none' as CommandBarMode,
        isListingSessions: false,
        selectedWindowListIndex: 0,
        isRenamingWindow: false,
        renameBuffer: '',
      };
    });
  }, []);

  const goToLevel = useCallback((idx: number) => {
    const newState = getInitialStateForLevel(idx);
    setPaneContents(newState.paneContents);
    if (indicesTimerRef.current) window.clearTimeout(indicesTimerRef.current);
    setState(prev => ({
      ...prev,
      ...newState,
      currentLevel: idx,
      actionProgressIndex: 0,
      feedback: null,
      isPendingSuccess: false,
      prefixActive: false,
      isZoomed: false,
      activeClockPaneIds: [],
      isShowingIndices: false,
      isIntroOpen: false,
      isConfirming: false,
      confirmationTarget: 'none' as 'none',
      commandBarMode: 'none' as CommandBarMode,
      isListingSessions: false,
      selectedWindowListIndex: 0,
      isRenamingWindow: false,
      renameBuffer: '',
    }));
    setShowTOC(false);
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (state.isIntroOpen || state.feedback?.type === 'success') {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          advanceLevel();
        }
        return;
      }
      
      const key = e.key;
      
      // Prefix Handling
      if (e.ctrlKey && key === 'b') {
        e.preventDefault();
        handleAction('prefix');
        return;
      }

      // Rotate Panes (Control+o) Handling
      if (state.prefixActive && e.ctrlKey && key === 'o') {
        e.preventDefault();
        handleAction('Control+o');
        return;
      }

      if (['Shift', 'Control', 'Alt', 'Meta'].includes(key)) return;

      const activeWin = state.windows[state.activeWindowIndex];
      const curPaneId = activeWin?.activePaneId;
      const hasClock = curPaneId && state.activeClockPaneIds.includes(curPaneId);

      if (state.prefixActive || hasClock || state.isShowingIndices || state.isConfirming || state.isRenamingWindow || state.isListingSessions) {
        e.preventDefault();
      }
      
      handleAction(key);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [state, handleAction, advanceLevel]);

  useEffect(() => {
    return () => {
      if (indicesTimerRef.current) window.clearTimeout(indicesTimerRef.current);
    }
  }, []);

  const renderTaskText = (text: string) => {
    if (typeof text !== 'string') return text;
    const parts = text.split(/(<strong>|<\/strong>|\[[^\]]+\])/g);
    let isBold = false;
    
    return parts.map((part, i) => {
      if (!part) return null;
      if (part === '<strong>') { isBold = true; return null; }
      if (part === '</strong>') { isBold = false; return null; }
      
      const keyMatch = part.match(/^\[(.+)\]$/);
      if (keyMatch) return <KeyCap key={i}>{keyMatch[1]}</KeyCap>;
      
      return <span key={i} className={`${isBold ? 'font-black text-white' : ''}`}>{part}</span>;
    });
  };

  const renderMultiLine = (text: string) => {
    if (!text) return null;
    return text.split(/\n/).map((sentence, idx) => (
      <div key={idx} className="mb-2 last:mb-0 leading-relaxed">{renderTaskText(sentence)}</div>
    ));
  };

  return (
    <div className="flex flex-col h-screen w-full bg-[#0f172a] text-[#f8fafc] overflow-hidden select-none font-sans">
      <header className="py-2 flex items-center justify-between px-8 border-b border-[#1e293b] bg-[#1e293b]/50 backdrop-blur-md z-20">
        <div className="flex items-center gap-4 flex-shrink-0">
          <div className="p-2 bg-[#7aa2f7] rounded-lg shadow-lg cursor-pointer transition-transform hover:scale-110" onClick={() => setShowTOC(true)}>
            <Terminal size={20} className="text-[#1a1b26]" />
          </div>
          <div>
            <h1 className="font-bold tracking-tight text-lg leading-none uppercase">TMUX DOJO</h1>
            <p className="text-[9px] text-slate-400 uppercase tracking-widest font-semibold mt-1">Dojo V6.3</p>
          </div>
        </div>
        
        <div className="flex-1 flex justify-center">
            <div className="text-[10px] text-slate-500 uppercase tracking-[0.3em] font-black">Practice Session: {level.title}</div>
        </div>

        <button onClick={() => setShowTOC(true)} className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 flex items-center gap-2 flex-shrink-0 group">
          <List size={20} className="group-hover:text-[#7aa2f7] transition-colors" />
          <span className="text-xs font-bold uppercase tracking-widest">All Levels ({LEVELS.length})</span>
        </button>
      </header>

      <main className="flex-1 flex overflow-hidden">
        <aside className="w-12 border-r border-[#1e293b] bg-[#0f172a] flex flex-col items-center py-6 overflow-y-auto no-scrollbar gap-8 flex-shrink-0 px-0.5">
            {LEVEL_GROUPS.map(group => {
                const groupLevels = LEVELS.filter(l => l.id >= group.range[0] && l.id <= group.range[1]);
                if (groupLevels.length === 0) return null;

                return (
                    <div key={group.id} className="flex flex-col items-center gap-4 w-full">
                        <span className="text-[6px] uppercase tracking-tighter text-slate-500 font-black text-center w-full">
                            {group.title}
                        </span>
                        <div className="flex flex-col gap-1.5">
                            {groupLevels.map((l) => {
                                const idx = l.id;
                                return (
                                    <button 
                                        key={l.id} 
                                        onClick={() => goToLevel(idx)} 
                                        className={`w-9 h-9 rounded-full border-2 transition-all text-[10px] font-black 
                                            ${state.currentLevel === idx 
                                            ? 'bg-[#7aa2f7] text-[#1a1b26] border-white scale-110' 
                                            : state.completedLevels.includes(idx) 
                                                ? 'bg-[#9ece6a] text-[#1a1b26] border-transparent' 
                                                : 'bg-[#1e293b] text-slate-400 border-slate-700 hover:border-slate-500 hover:text-white'
                                            }`}
                                    >
                                        {idx}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </aside>

        <aside className="w-[420px] border-r border-[#1e293b] p-8 flex flex-col gap-6 overflow-y-auto bg-[#0f172a] flex-shrink-0">
          {state.currentLevel === -1 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center opacity-40 italic text-slate-500">
               Select a level from the sidebar or press space.
            </div>
          ) : (
            <>
              <section className="space-y-4">
                <h2 className="text-2xl font-black text-white leading-tight flex items-start gap-3">
                  <Circle size={22} className="text-[#7aa2f7] flex-shrink-0 mt-1.5" />
                  <span>Level {level.id}: {level.title}</span>
                </h2>
                <div className="text-slate-300 text-lg leading-relaxed font-medium">{renderMultiLine(level.description)}</div>
              </section>

              <section className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 space-y-4 shadow-inner">
                <div className="flex items-center gap-2 text-rose-500 font-black text-[10px] uppercase tracking-widest">
                  <Shield size={16} /><span>The Task</span>
                </div>
                <div className="text-xl font-bold text-slate-100 leading-tight">
                  {Array.isArray(level.objective) ? (
                    <div className="space-y-3">{level.objective.map((line, idx) => <div key={idx}>{renderTaskText(line)}</div>)}</div>
                  ) : renderTaskText(level.objective)}
                </div>
                {level.requiredActions.length > 0 && (
                  <div className="flex gap-1 mt-4">
                    {level.requiredActions.map((_, idx) => (
                      <div key={idx} className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${idx < (state.isPendingSuccess ? level.requiredActions.length : state.actionProgressIndex) ? 'bg-[#9ece6a]' : 'bg-slate-800'}`} />
                    ))}
                  </div>
                )}
              </section>

              <section className="mt-auto bg-slate-800/20 p-5 rounded-2xl border border-slate-800/50 space-y-3">
                <div className="flex items-center gap-2 text-slate-500 font-bold text-[10px] uppercase tracking-widest">
                  <Info size={14} /><span>Dojo Hint</span>
                </div>
                <div className="text-[13px] text-slate-400 font-mono italic leading-relaxed">{renderMultiLine(level.hint)}</div>
              </section>
            </>
          )}
        </aside>

        <section className="flex-1 relative flex flex-col p-8 bg-[#1a1b26]">
          <div className={`flex-1 bg-black rounded-xl border-2 overflow-hidden flex flex-col relative transition-all duration-300 ${state.isPendingSuccess ? 'border-[#9ece6a] scale-[0.995]' : 'border-[#24283b]'}`}>
            <div className="h-10 bg-[#24283b] border-b border-[#414868] flex items-center px-6 justify-between flex-shrink-0">
              <div className="flex gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#f7768e]/70" /><div className="w-2.5 h-2.5 rounded-full bg-[#e0af68]/70" /><div className="w-2.5 h-2.5 rounded-full bg-[#9ece6a]/70" />
              </div>
              <div className="text-[10px] font-mono text-slate-500 flex items-center gap-2 uppercase tracking-widest">
                <Layers size={12} /> tmux:{activeWindow?.id || 'null'}
              </div>
            </div>

            <div className="flex-1 flex overflow-hidden relative">
              {state.windows.length > 0 ? (
                <>
                  <LayoutRenderer 
                    node={state.isZoomed ? { type: 'pane', id: activeWindow.activePaneId } : activeWindow.layout}
                    activePaneId={activeWindow.activePaneId}
                    paneContents={paneContents}
                    showIndices={state.isShowingIndices}
                    activeClockPaneIds={state.activeClockPaneIds}
                  />

                  {state.isListingSessions && (
                    <div className="absolute inset-0 z-[120] flex items-center justify-center p-8 animate-in fade-in duration-150">
                      <div className="bg-[#1a1b26] border border-[#414868] w-full max-w-lg flex flex-col shadow-[0_20px_50px_rgba(0,0,0,0.8)] font-mono text-sm">
                        <div className="bg-[#414868] px-4 py-1 flex items-center justify-between text-[#7aa2f7] font-bold">
                           <span className="text-xs tracking-tight">(0) tmux</span>
                           <span className="text-[10px] opacity-60">UP/DOWN/ENTER</span>
                        </div>
                        <div className="flex-1 overflow-y-auto max-h-[60vh] py-1">
                           {state.windows.map((w, i) => (
                             <div 
                               key={i} 
                               className={`px-4 py-1 flex items-center justify-between transition-colors duration-75
                                 ${i === state.selectedWindowListIndex 
                                   ? 'bg-[#7aa2f7] text-[#1a1b26]' 
                                   : 'text-[#a9b1d6] hover:bg-[#24283b]'
                                 }`}
                             >
                               <div className="flex items-center gap-2">
                                 <span className="opacity-40">{i}:</span>
                                 <span className="font-bold">{w.name}</span>
                                 <span className="text-[10px] opacity-50 italic">({getFlatPanes(w.layout).length} panes)</span>
                               </div>
                               <div className="flex items-center gap-3">
                                 {i === state.activeWindowIndex && <span className="text-[10px] font-black">*</span>}
                                 {i === state.selectedWindowListIndex && <span className="text-[10px] font-black">&lt;--</span>}
                               </div>
                             </div>
                           ))}
                        </div>
                        <div className="border-t border-[#414868] px-4 py-1 text-[10px] text-[#414868] font-bold uppercase tracking-widest flex justify-between">
                            <span>{state.windows.length} entries</span>
                            <span>'q' or 'Esc' to exit</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[70]">
                      <button onClick={resetLevel} className="text-white transition-all flex items-center gap-2 text-[11px] font-black uppercase bg-[#ef4444] px-6 py-2 rounded-full border border-white/20 hover:bg-[#dc2626] hover:scale-110 active:scale-95 shadow-md backdrop-blur-sm">
                        <RotateCcw size={14} /> Reset Level [d + d]
                      </button>
                  </div>

                  {state.isConfirming && (
                    <div className="absolute bottom-0 left-0 right-0 h-8 bg-[#e0af68] text-[#1a1b26] flex items-center px-4 font-mono font-bold text-xs z-50 animate-in slide-in-from-bottom duration-150">
                      <span>kill-{state.confirmationTarget}? (y/n)</span>
                    </div>
                  )}

                  {state.isRenamingWindow && (
                    <div className="absolute bottom-0 left-0 right-0 h-8 bg-[#7aa2f7] text-[#1a1b26] flex items-center px-4 font-mono font-bold text-xs z-50 animate-in slide-in-from-bottom duration-150">
                      <div className="flex items-center gap-2 w-full">
                        <span className="flex-shrink-0">rename-window:</span>
                        <div className="flex-1 bg-[#1a1b26]/30 px-2 flex items-center overflow-hidden h-full">
                          <span className="whitespace-pre">{state.renameBuffer}</span>
                          <span className="w-1.5 h-4 bg-[#1a1b26] ml-0.5 animate-pulse"></span>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center bg-[#0f172a] text-slate-700 font-mono italic">[terminal standby]</div>
              )}

              {state.feedback && (
                <div className="absolute inset-0 bg-black/80 z-[100] flex items-center justify-center animate-in fade-in duration-300 p-8">
                  <div className="text-center w-full flex flex-col items-center">
                    <CheckCircle size={100} className="text-[#9ece6a]" />
                    <h3 className="text-7xl font-black text-white italic tracking-tighter uppercase mt-6 drop-shadow-xl">LEVEL COMPLETE</h3>
                    <div className="flex flex-col items-center mt-4">
                        <div className="text-[#9ece6a] font-mono text-2xl font-black flex items-center justify-center gap-4 py-2">
                          <ChevronRight size={38} /><span>Next Level Ready</span>
                        </div>
                        <div className="text-xs text-slate-300 font-black uppercase tracking-[0.4em] opacity-80 mt-2">Press SPACE or ENTER to advance</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className={`h-8 flex items-center px-3 text-[10px] font-mono font-bold uppercase transition-colors duration-200 ${TERMINAL_COLORS.statusBar} flex-shrink-0`}>
              <div className="flex items-center gap-2 mr-6 flex-shrink-0"><span className="bg-[#7aa2f7] text-black px-2 py-0.5 rounded-sm shadow-md font-black">[0]</span></div>
              <div className="flex-1 flex items-center gap-2 overflow-hidden">
                {state.windows.map((w, idx) => (
                  <span key={idx} className={`px-4 py-1 rounded-sm transition-all whitespace-nowrap ${state.activeWindowIndex === idx ? 'bg-[#9ece6a] text-black font-black' : 'text-slate-400'}`}>
                    {idx}:{w.name}{state.activeWindowIndex === idx ? '*' : ''}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-6 flex-shrink-0">
                <div className="flex items-center gap-2 text-[#e0af68]">
                   <Keyboard size={14} />
                   <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-700 min-w-[50px] text-center uppercase text-[#7aa2f7]">
                    {lastKeyPressed === " " ? "SPC" : lastKeyPressed === "Enter" ? "ENT" : lastKeyPressed === "prefix" ? "CTRL+B" : lastKeyPressed || '---'}
                   </span>
                </div>
                {state.prefixActive && <span className="bg-[#f7768e] text-white px-3 py-0.5 rounded font-black animate-pulse">PREFIX</span>}
              </div>
            </div>

            {state.isIntroOpen && (
              <div className="absolute inset-0 bg-black/95 backdrop-blur-3xl z-50 flex items-center justify-center animate-in fade-in zoom-in duration-300 p-8">
                <div className="text-center space-y-8 max-w-4xl w-full">
                  <div className="inline-flex items-center justify-center p-8 bg-[#7aa2f7] rounded-full"><Terminal size={80} className="text-[#1a1b26]" /></div>
                  <div className="space-y-2">
                    <h3 className="text-6xl font-black text-white italic tracking-tighter uppercase">MASTER THE TMUX</h3>
                    <p className="text-[#7aa2f7] text-xl font-bold tracking-widest uppercase">{introSubtitle}</p>
                    <div className="mt-8 space-y-2">{introBody.map((line, i) => <p key={i} className="text-slate-400 text-lg font-mono italic leading-relaxed">{line}</p>)}</div>
                  </div>
                  <div className="flex flex-col items-center gap-5 pt-8">
                    <div className="px-12 py-6 bg-[#1e293b] border-2 border-[#7aa2f7] rounded-full text-sm text-white font-black uppercase tracking-[0.4em] shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer" onClick={advanceLevel}>Press SPACE or ENTER to start</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      {showTOC && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-12 animate-in fade-in">
          <div className="bg-[#1a1b26] border-2 border-[#24283b] w-full max-w-5xl max-h-[90vh] rounded-3xl overflow-hidden flex flex-col shadow-2xl">
            <div className="p-6 border-b border-[#24283b] flex items-center justify-between bg-slate-900/50 flex-shrink-0">
              <div className="flex items-center gap-4">
                <List size={28} className="text-[#7aa2f7]" />
                <div>
                  <h2 className="text-2xl font-black uppercase tracking-tighter">Command Manual</h2>
                  <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">Select a level to begin training</p>
                </div>
              </div>
              <button onClick={() => setShowTOC(false)} className="p-2 hover:bg-slate-800 rounded-full transition-colors"><X size={24} /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto bg-slate-900/20 p-8">
              <div className="grid grid-cols-1 gap-12">
                {LEVEL_GROUPS.map(group => {
                   const groupLevels = LEVELS.filter(l => l.id >= group.range[0] && l.id <= group.range[1]);
                   if (groupLevels.length === 0) return null;
                   return (
                    <div key={group.id} className="space-y-4">
                        <div className="flex items-center gap-4 border-b border-[#334155] pb-2">
                          <span className="bg-[#7aa2f7] text-[#1a1b26] px-3 py-1 rounded-full text-xs font-black uppercase">Section {group.id}</span>
                          <h3 className="text-xl font-black text-white uppercase tracking-tighter">{group.title}</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {groupLevels.map((l) => (
                          <div 
                              key={l.id} 
                              onClick={() => goToLevel(l.id)} 
                              className="group flex items-center gap-4 p-4 rounded-xl border border-slate-800 bg-[#1e293b]/30 hover:bg-[#7aa2f7]/10 hover:border-[#7aa2f7]/50 transition-all cursor-pointer"
                          >
                              <span className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full bg-slate-800 text-[#7aa2f7] font-black text-xs border border-slate-700 group-hover:bg-[#7aa2f7] group-hover:text-black transition-colors">{l.id}</span>
                              <div className="flex-1 overflow-hidden">
                                <p className="text-sm font-bold text-white group-hover:text-[#7aa2f7] transition-colors truncate uppercase">{l.title}</p>
                              </div>
                              {state.completedLevels.includes(l.id) && <CheckCircle size={20} className="text-[#9ece6a] flex-shrink-0" />}
                          </div>
                        ))}
                        </div>
                    </div>
                   );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="h-10 border-t border-[#1e293b] px-8 bg-[#0f172a] flex items-center justify-between text-[9px] text-slate-500 font-mono flex-shrink-0 z-20">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#9ece6a]" />
            <span className="font-bold uppercase tracking-widest opacity-60">MASTER LINK: STABLE</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="uppercase font-bold tracking-widest opacity-40">Active Buffer:</span>
          <span className="text-[#7aa2f7] font-black">{lastKeyPressed === " " ? "SPC" : lastKeyPressed === "Enter" ? "ENT" : lastKeyPressed === "prefix" ? "CTRL+B" : lastKeyPressed || 'WAITING'}</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
