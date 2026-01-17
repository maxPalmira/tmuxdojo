import React, { useState, useEffect, useCallback } from 'react';
import { AppState, WindowType, LayoutNode, CommandBarMode } from './types';
import { LEVELS, TERMINAL_COLORS } from './constants';
import LayoutRenderer from './components/LayoutRenderer';
import { Terminal, Shield, Circle, Layers, CheckCircle, ChevronRight, Keyboard, Info, RotateCcw, List, X } from 'lucide-react';

const createPane = (id: string): LayoutNode => ({ type: 'pane', id });

const findAnyPaneId = (node: LayoutNode): string | undefined => {
  if (node.type === 'pane') return node.id;
  if (node.children) return findAnyPaneId(node.children[0]) || findAnyPaneId(node.children[1]);
  return undefined;
};

const removePaneFromLayout = (node: LayoutNode, targetId: string): LayoutNode => {
  if (node.type === 'split' && node.children) {
    const [c1, c2] = node.children;
    if (c1.type === 'pane' && c1.id === targetId) return c2;
    if (c2.type === 'pane' && c2.id === targetId) return c1;

    const newC1 = removePaneFromLayout(c1, targetId);
    if (newC1 !== c1) return { ...node, children: [newC1, c2] };

    const newC2 = removePaneFromLayout(c2, targetId);
    if (newC2 !== c2) return { ...node, children: [c1, newC2] };
  }
  return node;
};

const getInitialStateForLevel = (levelIndex: number) => {
  const level = LEVELS[levelIndex];
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
    paneContents: level.initialState?.paneContents || { [paneId]: ['tmux training session initialized...', 'Ready for input.'] }
  };
};

const App: React.FC = () => {
  const [state, setState] = useState<AppState & { isPendingSuccess: boolean }>({
    windows: [
      {
        id: 'win-1',
        name: 'bash',
        layout: createPane('pane-1'),
        activePaneId: 'pane-1'
      }
    ],
    activeWindowIndex: 0,
    prefixActive: false,
    isConfirming: false,
    isZoomed: false,
    isShowingClock: false,
    isListingSessions: false,
    isCopyMode: false,
    isDetached: false,
    isRenamingWindow: false,
    isShowingIndices: false,
    commandBarMode: 'none',
    currentLevel: 0,
    actionProgressIndex: 0,
    completedLevels: [],
    inputHistory: [],
    feedback: null,
    isPendingSuccess: false,
  });

  const [lastKeyPressed, setLastKeyPressed] = useState<string>("");
  const [showTOC, setShowTOC] = useState(false);
  const [paneContents, setPaneContents] = useState<Record<string, string[]>>({
    'pane-1': ['tmux training session initialized...', 'Ready for input.']
  });

  const level = LEVELS[state.currentLevel];

  const triggerSuccess = useCallback((lvlId: number, lvlTitle: string) => {
    setState(prev => ({ ...prev, isPendingSuccess: true }));
    const delay = lvlId === 23 ? 3000 : lvlId === 31 ? 2000 : 800;
    setTimeout(() => {
      setState(prev => ({
        ...prev,
        completedLevels: Array.from(new Set([...prev.completedLevels, prev.currentLevel])),
        feedback: { message: `Completed: ${lvlTitle}`, type: 'success' }
      }));
    }, delay);
  }, []);

  const handleAction = useCallback((action: string) => {
    setLastKeyPressed(action);

    setState(prev => {
      const currentLevelDef = LEVELS[prev.currentLevel];
      const expectedAction = currentLevelDef.requiredActions[prev.actionProgressIndex];
      let nextState = { ...prev };
      let correctAction = false;
      let shouldCheckSuccess = false;

      // Ensure windows is a fresh array of fresh objects for safety
      nextState.windows = prev.windows.map(w => ({ ...w }));

      // 1. Confirmation Intercept
      if (prev.isConfirming) {
        nextState.isConfirming = false;
        if (action === 'y') {
          if (expectedAction === 'y') {
            correctAction = true;
            const activeWinIdx = nextState.activeWindowIndex;
            const activeWin = nextState.windows[activeWinIdx];
            
            if (currentLevelDef.id === 27) {
              // Kill Window simulation
              nextState.windows.splice(activeWinIdx, 1);
              nextState.activeWindowIndex = Math.max(0, activeWinIdx - 1);
            } else {
              // Kill Pane simulation
              const oldPaneId = activeWin.activePaneId;
              const newLayout = removePaneFromLayout(activeWin.layout, oldPaneId);
              activeWin.layout = newLayout;
              activeWin.activePaneId = findAnyPaneId(newLayout) || 'none';
            }
          }
        }
        
        if (correctAction) {
          nextState.actionProgressIndex += 1;
          shouldCheckSuccess = true;
        } else {
          nextState.actionProgressIndex = 0;
        }
        
        if (shouldCheckSuccess && nextState.actionProgressIndex >= currentLevelDef.requiredActions.length) {
          triggerSuccess(currentLevelDef.id, currentLevelDef.title);
        }
        return nextState;
      }

      // 2. Overlays Intercept
      if (prev.isShowingClock || prev.isListingSessions || prev.isCopyMode || prev.isShowingIndices || prev.commandBarMode !== 'none') {
        if (action === 'q' || action === 'Escape' || action === 'Enter') {
          nextState.isShowingClock = false;
          nextState.isListingSessions = false;
          nextState.isCopyMode = false;
          nextState.isShowingIndices = false;
          nextState.commandBarMode = 'none';
          return nextState;
        }
      }

      if (prev.isDetached) {
        nextState.isDetached = false;
        return nextState;
      }

      // 3. Command Logic
      if (action === 'prefix') {
        nextState.prefixActive = true;
        if (expectedAction === 'prefix') {
          nextState.actionProgressIndex += 1;
        } else {
          nextState.actionProgressIndex = 1;
        }
        
        // Fix for levels that only require a prefix or if prefix is the last step
        if (nextState.actionProgressIndex >= currentLevelDef.requiredActions.length) {
          triggerSuccess(currentLevelDef.id, currentLevelDef.title);
        }
        return nextState;
      } else if (prev.prefixActive) {
        nextState.prefixActive = false;
        if (action === expectedAction) correctAction = true;

        const activeWin = nextState.windows[nextState.activeWindowIndex];

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
          activeWin.layout = splitNode(activeWin.layout, activeWin.activePaneId);
          activeWin.activePaneId = newPaneId;
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
          activeWin.layout = splitNode(activeWin.layout, activeWin.activePaneId);
          activeWin.activePaneId = newPaneId;
        } else if (action === 'c') {
          const newWinId = `win-${Date.now()}`;
          const newPaneId = `p-${Date.now()}`;
          nextState.windows.push({ id: newWinId, name: 'bash', layout: createPane(newPaneId), activePaneId: newPaneId });
          nextState.activeWindowIndex = nextState.windows.length - 1;
        } else if (action === 'n') {
          nextState.activeWindowIndex = (nextState.activeWindowIndex + 1) % nextState.windows.length;
        } else if (action === 'p') {
          nextState.activeWindowIndex = (nextState.activeWindowIndex - 1 + nextState.windows.length) % nextState.windows.length;
        } else if (action === 'z') {
          nextState.isZoomed = !nextState.isZoomed;
        } else if (action === 't') {
          nextState.isShowingClock = true;
        } else if (action === 's') {
          nextState.isListingSessions = true;
        } else if (action === '[') {
          nextState.isCopyMode = true;
        } else if (action === 'd') {
          nextState.isDetached = true;
        } else if (action === ',') {
          nextState.commandBarMode = 'rename-window';
        } else if (action === 'f') {
          nextState.commandBarMode = 'find-window';
        } else if (action === '.') {
          nextState.commandBarMode = 'move-window';
        } else if (action === 'w') {
          nextState.commandBarMode = 'list-windows';
        } else if (action === '$') {
          nextState.commandBarMode = 'rename-session';
        } else if (action === 'q') {
          nextState.isShowingIndices = true;
        } else if (action === 'x' || action === '&') {
          nextState.isConfirming = true;
        } else if (action === ':') {
          nextState.commandBarMode = 'command';
        } else if (action.startsWith('Arrow')) {
          const findTarget = (node: LayoutNode, targetId: string): string | undefined => {
            if (node.type === 'split' && node.children) {
              const [c1, c2] = node.children;
              if (action === 'ArrowRight' || action === 'ArrowDown') return c2.type === 'pane' ? c2.id : findTarget(c2, targetId);
              if (action === 'ArrowLeft' || action === 'ArrowUp') return c1.type === 'pane' ? c1.id : findTarget(c1, targetId);
            }
            return undefined;
          };
          const nextId = findTarget(activeWin.layout, activeWin.activePaneId);
          if (nextId) activeWin.activePaneId = nextId;
        }

        if (correctAction) {
          nextState.actionProgressIndex += 1;
          shouldCheckSuccess = true;
        } else {
          nextState.actionProgressIndex = 0;
        }
      } else {
        nextState.actionProgressIndex = 0;
      }

      if (shouldCheckSuccess && nextState.actionProgressIndex >= currentLevelDef.requiredActions.length) {
        triggerSuccess(currentLevelDef.id, currentLevelDef.title);
      }

      return nextState;
    });
  }, [triggerSuccess]);

  const advanceLevel = useCallback(() => {
    setState(prev => {
      const nextIdx = Math.min(prev.currentLevel + 1, LEVELS.length - 1);
      const newState = getInitialStateForLevel(nextIdx);
      setPaneContents(newState.paneContents);
      return {
        ...prev,
        ...newState,
        currentLevel: nextIdx,
        actionProgressIndex: 0,
        feedback: null,
        isPendingSuccess: false,
        prefixActive: false,
        commandBarMode: 'none',
        isConfirming: false,
        isZoomed: false,
        isShowingClock: false,
        isListingSessions: false,
        isCopyMode: false,
        isDetached: false,
        isRenamingWindow: false,
        isShowingIndices: false,
      };
    });
  }, []);

  const resetLevel = useCallback(() => {
    const newState = getInitialStateForLevel(state.currentLevel);
    setPaneContents(newState.paneContents);
    setState(prev => ({
      ...prev,
      ...newState,
      actionProgressIndex: 0,
      feedback: null,
      isPendingSuccess: false,
      prefixActive: false,
      commandBarMode: 'none',
      isConfirming: false,
      isZoomed: false,
      isShowingClock: false,
      isListingSessions: false,
      isCopyMode: false,
      isDetached: false,
      isRenamingWindow: false,
      isShowingIndices: false,
    }));
  }, [state.currentLevel]);

  const goToLevel = useCallback((idx: number) => {
    const newState = getInitialStateForLevel(idx);
    setPaneContents(newState.paneContents);
    setState(prev => ({
      ...prev,
      ...newState,
      currentLevel: idx,
      actionProgressIndex: 0,
      feedback: null,
      isPendingSuccess: false,
      prefixActive: false,
      commandBarMode: 'none',
      isConfirming: false,
      isZoomed: false,
      isShowingClock: false,
      isListingSessions: false,
      isCopyMode: false,
      isDetached: false,
      isRenamingWindow: false,
      isShowingIndices: false,
    }));
    setShowTOC(false);
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (state.feedback?.type === 'success') {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          advanceLevel();
        }
        return;
      }
      
      if (['Shift', 'Control', 'Alt', 'Meta'].includes(e.key)) return;
      
      const key = e.key;
      if (e.ctrlKey && key === 'b') {
        e.preventDefault();
        handleAction('prefix');
        return;
      }

      if (state.prefixActive || state.isConfirming || state.commandBarMode !== 'none' || state.isDetached || state.isShowingClock || state.isListingSessions || state.isCopyMode || state.isShowingIndices) {
        e.preventDefault();
      }
      
      handleAction(key);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [state, handleAction, advanceLevel]);

  const renderTaskText = (text: string) => {
    const parts = text.split(/(\b(?:[A-Z0-9!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~])\b)/);
    return parts.map((part, i) => {
      const isCmd = (part.length === 1 && !/\w/.test(part)) || (part.length === 1 && /[A-Z0-9]/.test(part));
      return isCmd ? <b key={i} className="text-[#7aa2f7] font-black">{part}</b> : part;
    });
  };

  return (
    <div className="flex flex-col h-screen w-full bg-[#0f172a] text-[#f8fafc] overflow-hidden select-none font-sans">
      <header className="py-1 flex items-center justify-between px-8 border-b border-[#1e293b] bg-[#1e293b]/50 backdrop-blur-md">
        <div className="flex items-center gap-4 flex-shrink-0">
          <div className="p-2 bg-[#7aa2f7] rounded-lg shadow-lg cursor-pointer transition-transform hover:scale-110" onClick={() => setShowTOC(true)}>
            <Terminal size={20} className="text-[#1a1b26]" />
          </div>
          <div>
            <h1 className="font-bold tracking-tight text-lg leading-none">TMUX MASTER</h1>
            <p className="text-[9px] text-slate-400 uppercase tracking-widest font-semibold mt-1">Dojo v3.7</p>
          </div>
        </div>
        
        <div className="flex-1 flex flex-col items-center px-4 gap-1 min-w-[700px]">
          <div className="flex gap-2 flex-wrap justify-center w-full">
            {LEVELS.slice(0, 20).map((l, i) => (
              <button key={l.id} onClick={() => goToLevel(i)} className={`w-7 h-7 rounded-full border transition-all text-[10px] font-black ${state.currentLevel === i ? 'bg-[#7aa2f7] text-[#1a1b26] border-white scale-110 ring-2 ring-[#7aa2f7]/50' : state.completedLevels.includes(i) ? 'bg-[#9ece6a] text-[#1a1b26] border-transparent' : 'bg-[#334155] text-slate-400 border-transparent hover:bg-slate-700'}`}>{l.id}</button>
            ))}
          </div>
          <div className="flex gap-2 flex-wrap justify-center w-full">
            {LEVELS.slice(20).map((l, i) => {
              const idx = i + 20;
              return <button key={l.id} onClick={() => goToLevel(idx)} className={`w-7 h-7 rounded-full border transition-all text-[10px] font-black ${state.currentLevel === idx ? 'bg-[#7aa2f7] text-[#1a1b26] border-white scale-110 ring-2 ring-[#7aa2f7]/50' : state.completedLevels.includes(idx) ? 'bg-[#9ece6a] text-[#1a1b26] border-transparent' : 'bg-[#334155] text-slate-400 border-transparent hover:bg-slate-700'}`}>{l.id}</button>;
            })}
          </div>
        </div>

        <button onClick={() => setShowTOC(true)} className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 flex items-center gap-2 flex-shrink-0 group">
          <List size={20} className="group-hover:text-[#7aa2f7] transition-colors" />
          <span className="text-xs font-bold uppercase tracking-widest">All Levels</span>
        </button>
      </header>

      <main className="flex-1 flex overflow-hidden">
        <aside className="w-[420px] border-r border-[#1e293b] p-8 flex flex-col gap-6 overflow-y-auto bg-[#0f172a]">
          <section className="space-y-4">
            <h2 className="text-2xl font-black text-white leading-tight flex items-start gap-3">
              <Circle size={22} className="text-[#7aa2f7] flex-shrink-0 mt-1.5" />
              <span>Level {level.id}: {level.title}</span>
            </h2>
            <div className="text-slate-400 text-lg leading-relaxed italic border-l-2 border-slate-800 pl-4">
              {renderTaskText(level.description)}
            </div>
          </section>

          <section className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 space-y-4 shadow-inner">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-rose-500 font-black text-xs uppercase tracking-widest">
                <Shield size={16} />
                <span>The Task</span>
              </div>
              <button onClick={resetLevel} className="text-slate-500 hover:text-white transition-colors flex items-center gap-1 text-[10px] font-bold uppercase bg-slate-800/50 px-3 py-1 rounded-full border border-slate-700 hover:scale-105 active:scale-95"><RotateCcw size={12} /> Reset Level</button>
            </div>
            <div className="text-xl font-bold text-slate-100 leading-tight">
              {Array.isArray(level.objective) ? (
                <div className="space-y-3">
                  {level.objective.map((line, idx) => (
                    <div key={idx} className="flex gap-2"><span className="text-rose-500/50">•</span><span>{renderTaskText(line)}</span></div>
                  ))}
                </div>
              ) : (
                renderTaskText(level.objective)
              )}
            </div>
            {level.requiredActions.length > 1 && (
              <div className="flex gap-1 mt-4">
                {level.requiredActions.map((_, idx) => (
                  <div key={idx} className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${idx < state.actionProgressIndex ? 'bg-[#9ece6a]' : 'bg-slate-800'}`} />
                ))}
              </div>
            )}
          </section>

          <section className="mt-auto bg-slate-800/20 p-5 rounded-2xl border border-slate-800/50 space-y-2">
            <div className="flex items-center gap-2 text-slate-500 font-bold text-[10px] uppercase tracking-widest">
              <Info size={14} />
              <span>Dojo Hint</span>
            </div>
            <p className="text-xs text-slate-400 font-mono italic leading-relaxed">{level.hint}</p>
          </section>
        </aside>

        <section className="flex-1 relative flex flex-col p-8 bg-[#1a1b26]">
          <div className={`flex-1 bg-black rounded-xl border-2 shadow-[0_0_100px_rgba(0,0,0,0.7)] overflow-hidden flex flex-col relative transition-all duration-300 ${state.isPendingSuccess ? 'border-[#9ece6a] ring-8 ring-[#9ece6a]/10 scale-[0.995]' : 'border-[#24283b]'}`}>
            <div className="h-10 bg-[#24283b] border-b border-[#414868] flex items-center px-6 justify-between">
              <div className="flex gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#f7768e]/70" /><div className="w-2.5 h-2.5 rounded-full bg-[#e0af68]/70" /><div className="w-2.5 h-2.5 rounded-full bg-[#9ece6a]/70" />
              </div>
              <div className="text-[10px] font-mono text-slate-500 flex items-center gap-2 uppercase tracking-widest">
                <Layers size={12} /> tmux:{state.windows[state.activeWindowIndex]?.id || 'null'}
              </div>
            </div>

            <div className="flex-1 flex overflow-hidden relative">
              {state.windows.length > 0 ? (
                <LayoutRenderer 
                  node={state.isZoomed ? { type: 'pane', id: state.windows[state.activeWindowIndex].activePaneId } : state.windows[state.activeWindowIndex].layout}
                  activePaneId={state.windows[state.activeWindowIndex].activePaneId}
                  paneContents={paneContents}
                  showIndices={state.isShowingIndices}
                />
              ) : (
                <div className="flex-1 flex items-center justify-center bg-[#0f172a] text-slate-700 font-mono">[no windows open]</div>
              )}

              {state.isShowingClock && (
                <div className="absolute inset-0 bg-[#1a1b26] flex items-center justify-center z-10 text-[#7aa2f7] font-mono animate-in fade-in">
                  <div className="text-9xl font-black">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}</div>
                  <div className="absolute bottom-10 text-xs uppercase tracking-widest opacity-50">Press 'q' or 'Esc' to exit</div>
                </div>
              )}
              {state.isListingSessions && (
                <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-10 animate-in fade-in p-20">
                  <div className="bg-[#24283b] border border-[#7aa2f7] w-full max-w-lg p-6 rounded-lg font-mono">
                    <div className="text-[#7aa2f7] mb-4 border-b border-[#7aa2f7]/30 pb-2">tmux (2) sessions</div>
                    <div className="bg-[#7aa2f7] text-black px-2 flex justify-between"><span>0: DOJO* (1 windows) (attached)</span> <CheckCircle size={12}/></div>
                    <div className="text-slate-400 px-2 mt-1">1: BACKUP (3 windows)</div>
                    <div className="mt-10 text-[10px] text-slate-500 uppercase tracking-widest">Use arrows to select, enter to switch, q to quit</div>
                  </div>
                </div>
              )}
              {state.isCopyMode && (
                <div className="absolute top-0 right-0 bg-[#e0af68] text-black px-4 py-1 text-xs font-bold animate-in slide-in-from-right font-mono">[0/15] - Copy Mode</div>
              )}
              {state.isDetached && (
                <div className="absolute inset-0 bg-[#0f172a] flex flex-col items-center justify-center z-20 text-center space-y-4">
                  <div className="text-2xl font-mono text-[#9ece6a] font-bold uppercase">[detached (from session DOJO)]</div>
                  <div className="text-sm text-slate-500 animate-pulse uppercase tracking-widest font-black">Press any key to re-attach...</div>
                </div>
              )}
              {(state.commandBarMode !== 'none' || state.isConfirming) && (
                <div className="absolute bottom-0 left-0 right-0 h-10 bg-[#e0af68] text-black flex items-center px-4 animate-in slide-in-from-bottom-1 font-mono font-bold text-sm z-30">
                  {state.isConfirming ? (
                    <span>kill-{level.id === 27 ? 'window' : 'pane'}? (y/n)</span>
                  ) : (
                    <>
                      {state.commandBarMode === 'command' && <span className="mr-2">:</span>}
                      {state.commandBarMode === 'rename-window' && <span className="mr-2">(rename-window)</span>}
                      {state.commandBarMode === 'find-window' && <span className="mr-2">(find-window)</span>}
                      {state.commandBarMode === 'move-window' && <span className="mr-2">(move-window)</span>}
                      {state.commandBarMode === 'rename-session' && <span className="mr-2">(rename-session)</span>}
                      {state.commandBarMode === 'list-windows' && <span className="mr-2">(list-windows)</span>}
                    </>
                  )}
                  <div className="w-2.5 h-6 bg-black animate-pulse ml-2"></div>
                </div>
              )}
            </div>

            <div className={`h-8 flex items-center px-3 text-[10px] font-mono font-bold uppercase transition-colors duration-200 ${TERMINAL_COLORS.statusBar}`}>
              <div className="flex items-center gap-2 mr-6 flex-shrink-0"><span className="bg-[#7aa2f7] text-black px-2 py-0.5 rounded-sm shadow-md font-black">[0]</span></div>
              <div className="flex-1 flex items-center gap-2 overflow-hidden">
                {state.windows.map((w, idx) => (
                  <span key={idx} className={`px-4 py-1 rounded-sm transition-all whitespace-nowrap ${state.activeWindowIndex === idx ? 'bg-[#9ece6a] text-black shadow-lg font-black' : 'text-slate-400'}`}>
                    {idx}:{w.name}{state.activeWindowIndex === idx ? '*' : ''}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-6 flex-shrink-0">
                <div className="flex items-center gap-2 text-[#e0af68]">
                   <Keyboard size={14} />
                   <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-700 min-w-[50px] text-center shadow-inner uppercase text-[#7aa2f7]">
                    {lastKeyPressed === " " ? "SPC" : lastKeyPressed === "Enter" ? "ENT" : lastKeyPressed === "prefix" ? "CTRL+B" : lastKeyPressed || '---'}
                   </span>
                </div>
                {state.prefixActive && <span className="bg-[#f7768e] text-white px-3 py-0.5 rounded shadow-lg ring-2 ring-[#f7768e]/30 font-black animate-pulse">PREFIX</span>}
                {state.isZoomed && <span className="text-[#7aa2f7] border border-[#7aa2f7] px-2 rounded font-black text-[8px]">ZOOMED</span>}
              </div>
            </div>

            {state.feedback && (
              <div className="absolute inset-0 bg-black/95 backdrop-blur-3xl z-40 flex items-center justify-center animate-in fade-in zoom-in duration-300 p-8">
                <div className="text-center space-y-8 max-w-2xl w-full">
                  <div className="inline-flex items-center justify-center p-8 bg-[#9ece6a] rounded-full shadow-[0_0_80px_rgba(158,206,106,0.3)]"><CheckCircle size={80} className="text-[#1a1b26]" /></div>
                  <h3 className="text-6xl font-black text-white italic tracking-tighter drop-shadow-2xl">LEVEL COMPLETE</h3>
                  <div className="flex flex-col items-center gap-5">
                    <div className="w-full max-w-xl text-[#9ece6a] font-mono text-xl font-black bg-slate-900/80 px-8 py-4 rounded-2xl border border-[#9ece6a]/30 shadow-2xl overflow-hidden whitespace-nowrap">
                      <div className="flex items-center justify-center gap-4"><ChevronRight size={32} /><span className="truncate">Next Level Ready</span></div>
                    </div>
                    <div className="px-10 py-5 bg-[#1e293b] border-2 border-[#334155] rounded-full text-sm text-white font-black uppercase tracking-[0.4em] shadow-2xl hover:scale-105 active:scale-95 transition-transform cursor-pointer" onClick={advanceLevel}>Press SPACE or ENTER to advance</div>
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
            
            <div className="flex-1 overflow-y-auto bg-slate-900/20">
              <table className="w-full text-left border-collapse table-fixed">
                <thead className="sticky top-0 bg-[#1a1b26] shadow-md z-10 text-[9px] font-black uppercase tracking-widest text-slate-500 border-b border-slate-800">
                  <tr>
                    <th className="px-6 py-3 w-20 text-center">Level</th>
                    <th className="px-6 py-3 w-1/2">Training Name</th>
                    <th className="px-6 py-3">Shortcuts</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/30">
                  {LEVELS.map((l, i) => (
                    <tr key={l.id} onClick={() => goToLevel(i)} className="group cursor-pointer hover:bg-[#7aa2f7]/5 transition-colors">
                      <td className="px-6 py-2 font-mono text-[#7aa2f7] font-black text-center text-xs">{l.id}</td>
                      <td className="px-6 py-2">
                        <div className="font-bold text-sm text-white group-hover:text-[#7aa2f7] transition-colors truncate">
                          {l.title}
                          {state.completedLevels.includes(i) && <CheckCircle size={14} className="inline ml-2 text-[#9ece6a]" />}
                        </div>
                      </td>
                      <td className="px-6 py-2">
                        <div className="flex flex-wrap gap-1">
                          {l.commandsCovered.map((cmd, idx) => (
                            <kbd key={idx} className="px-1.5 py-0.5 bg-black border border-slate-800 rounded text-[9px] text-[#9ece6a] font-mono font-black">{cmd}</kbd>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      <footer className="h-10 border-t border-[#1e293b] px-8 bg-[#0f172a] flex items-center justify-between text-[9px] text-slate-500 font-mono flex-shrink-0">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#9ece6a] shadow-[0_0_8px_rgba(158,206,106,0.6)]" />
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
