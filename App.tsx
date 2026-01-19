
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AppState, WindowType, LayoutNode, CommandBarMode, UserProfile } from './types';
import { LEVELS, LEVEL_GROUPS, TERMINAL_COLORS, MEDAL_DATA } from './constants';
import LayoutRenderer from './components/LayoutRenderer';
import { supabase, isSupabaseConfigured } from './supabase';
import { storageService } from './services/storageService';
import { HtopLeaderboard } from './components/HtopLeaderboard';
import { Terminal, Shield, Circle, Layers, CheckCircle, ChevronRight, Keyboard, Info, RotateCcw, List, X, Clock, Trophy, LogIn, User as UserIcon } from 'lucide-react';

const createPane = (id: string): LayoutNode => ({ type: 'pane', id });

// Helper to render text with styled keyboard keys [Key]
const renderStyledText = (text: string) => {
  const parts = text.split(/(\[.*?\])/g);
  return parts.map((part, i) => {
    if (part.startsWith('[') && part.endsWith(']')) {
      return (
        <span key={i} className="inline-flex items-center justify-center bg-slate-200 text-slate-900 px-1.5 py-0.5 rounded border-b-2 border-slate-400 font-mono text-[11px] mx-0.5 font-black uppercase leading-none transform translate-y-[-1px]">
          {part.slice(1, -1)}
        </span>
      );
    }
    return part;
  });
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
    const isVertical = node.direction === 'vertical';
    const isHorizontal = node.direction === 'horizontal';
    const childIndex = node.children![0] === path[i + 1] ? 0 : 1;
    let movePossible = false;
    if (direction === 'ArrowLeft' && isVertical && childIndex === 1) movePossible = true;
    if (direction === 'ArrowRight' && isVertical && childIndex === 0) movePossible = true;
    if (direction === 'ArrowUp' && isHorizontal && childIndex === 1) movePossible = true;
    if (direction === 'ArrowDown' && isHorizontal && childIndex === 0) movePossible = true;
    if (movePossible) {
      let targetBranch = node.children![childIndex === 0 ? 1 : 0];
      while (targetBranch.type === 'split') {
        targetBranch = (direction === 'ArrowLeft' || direction === 'ArrowUp') ? targetBranch.children![1] : targetBranch.children![0];
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
    windows: [{ id: `win-${levelIndex}`, name: 'bash', layout: createPane(paneId), activePaneId: paneId }],
    activeWindowIndex: 0
  };
  return {
    ...initialState,
    paneContents: level.initialState?.paneContents || { [paneId]: ['Welcome to tmux practice session...', 'Waiting for command...'] }
  };
};

const App: React.FC = () => {
  const [state, setState] = useState<AppState & { isPendingSuccess: boolean; isIntroOpen: boolean; isDirty: boolean; newMedalsInLevel: string[] }>({
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
    completionCounts: {},
    inputHistory: [],
    feedback: null,
    isPendingSuccess: false,
    isIntroOpen: true,
    isDirty: false,
    user: null,
    profile: null,
    stats: { sessionSplits: 0, totalClocks: 0, totalFlashes: 0, totalWindows: 0, zeroResetStreak: 0 },
    medalsEarned: [],
    newMedalsInLevel: [],
    isLeaderboardOpen: false,
    isProfileOpen: false,
  });

  const [lastKeyPressed, setLastKeyPressed] = useState<string>("");
  const [showTOC, setShowTOC] = useState(false);
  const [paneContents, setPaneContents] = useState<Record<string, string[]>>({});
  
  const lastDKeyTime = useRef<number>(0);
  const indicesTimerRef = useRef<number | null>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Auto-scroll sidebar to center current level
  useEffect(() => {
    if (sidebarRef.current) {
      const activeButton = sidebarRef.current.querySelector(`[data-level-id="${state.currentLevel}"]`);
      if (activeButton) {
        const containerHeight = sidebarRef.current.clientHeight;
        const buttonTop = (activeButton as HTMLElement).offsetTop;
        const buttonHeight = (activeButton as HTMLElement).clientHeight;
        
        const scrollTo = buttonTop - (containerHeight / 2) + (buttonHeight / 2);
        sidebarRef.current.scrollTo({
          top: scrollTo,
          behavior: 'smooth'
        });
      }
    }
  }, [state.currentLevel]);

  useEffect(() => {
    const local = storageService.getLocal();
    setState(s => ({ 
      ...s, 
      completionCounts: local.completionCounts, 
      completedLevels: Object.keys(local.completionCounts).map(Number),
      medalsEarned: local.medals,
      stats: { ...s.stats, totalClocks: local.stats.totalClocks, totalFlashes: local.stats.totalFlashes, totalWindows: local.stats.totalWindows }
    }));

    if (isSupabaseConfigured && supabase) {
      supabase.auth.getSession().then(async ({ data: { session } }) => {
        if (session) {
          const merged = await storageService.fetchAndMerge(session.user.id);
          setState(s => ({ 
            ...s, 
            user: session.user, 
            completionCounts: merged.completionCounts,
            completedLevels: Object.keys(merged.completionCounts).map(Number),
            medalsEarned: merged.medals
          }));
        }
      });

      supabase.auth.onAuthStateChange(async (_event, session) => {
        if (session) {
          const merged = await storageService.fetchAndMerge(session.user.id);
          setState(s => ({ 
            ...s, 
            user: session.user, 
            completionCounts: merged.completionCounts,
            completedLevels: Object.keys(merged.completionCounts).map(Number),
            medalsEarned: merged.medals
          }));
        } else {
          setState(s => ({ ...s, user: null, profile: null }));
        }
      });
    }
  }, []);

  const level = LEVELS.find(l => l.id === state.currentLevel) || LEVELS[0];
  const activeWindow = state.windows[state.activeWindowIndex];

  const resetLevel = useCallback(() => {
    const newState = getInitialStateForLevel(state.currentLevel);
    setPaneContents(JSON.parse(JSON.stringify(newState.paneContents)));
    if (indicesTimerRef.current) window.clearTimeout(indicesTimerRef.current);
    setState(prev => ({
      ...prev,
      ...newState,
      actionProgressIndex: 0,
      feedback: null,
      isPendingSuccess: false,
      prefixActive: false,
      commandBarMode: 'none',
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
      isIntroOpen: state.currentLevel === 0,
      isDirty: false,
      newMedalsInLevel: [],
      stats: { ...prev.stats, zeroResetStreak: 0 }
    }));
  }, [state.currentLevel]);

  const triggerSuccess = useCallback((lvlId: number, lvlTitle: string) => {
    setState(prev => {
      const newCounts = { ...prev.completionCounts };
      newCounts[lvlId] = (newCounts[lvlId] || 0) + 1;
      
      const newStreak = prev.stats.zeroResetStreak + 1;
      const newMedals = [...prev.medalsEarned];
      const newlyUnlockedInLvl = [...prev.newMedalsInLevel];

      if (newStreak >= 5 && !newMedals.includes('zero_reset')) {
        newMedals.push('zero_reset');
        newlyUnlockedInLvl.push('zero_reset');
      }
      
      const updatedLocal: any = {
        completionCounts: newCounts,
        medals: newMedals,
        stats: {
          totalClocks: prev.stats.totalClocks,
          totalFlashes: prev.stats.totalFlashes,
          totalWindows: prev.stats.totalWindows
        }
      };
      
      storageService.setLocal(updatedLocal);
      if (prev.user && isSupabaseConfigured) storageService.syncToCloud(prev.user.id, updatedLocal);

      return {
        ...prev,
        isPendingSuccess: true,
        completionCounts: newCounts,
        completedLevels: Array.from(new Set([...prev.completedLevels, lvlId])),
        medalsEarned: newMedals,
        newMedalsInLevel: newlyUnlockedInLvl,
        stats: { ...prev.stats, zeroResetStreak: newStreak }
      };
    });

    setTimeout(() => {
      setState(prev => ({
        ...prev,
        feedback: { message: `Completed: ${lvlTitle}`, type: 'success' }
      }));
    }, 800);
  }, []);

  const handleAction = useCallback((action: string) => {
    if (state.isIntroOpen || state.isPendingSuccess) return;

    setState(prev => {
      let next = { ...prev };

      // CRITICAL: Global Reset Shortcut (d+d) must be at the very top
      if (action.toLowerCase() === 'd') {
        const now = Date.now();
        if (now - lastDKeyTime.current < 400) {
          lastDKeyTime.current = 0;
          setTimeout(resetLevel, 0); // Trigger reset outside state setter
          return prev;
        }
        lastDKeyTime.current = now;
      }

      const currentLevelDef = LEVELS.find(l => l.id === prev.currentLevel);
      if (!currentLevelDef) return prev;
      
      const expectedAction = currentLevelDef.requiredActions[prev.actionProgressIndex];
      const activeWin = next.windows[next.activeWindowIndex];
      const curPaneId = activeWin?.activePaneId;

      const trackMedal = (id: string) => {
        if (!next.medalsEarned.includes(id)) {
          next.medalsEarned = [...next.medalsEarned, id];
          next.newMedalsInLevel = [...next.newMedalsInLevel, id];
        }
      };

      if (prev.prefixActive) {
        if (action === 't') {
           next.stats.totalClocks += 1;
           if (next.stats.totalClocks >= 10) trackMedal('time_lord');
        } else if (action === 'q') {
           next.stats.totalFlashes += 1;
           if (next.stats.totalFlashes >= 15) trackMedal('identity_crisis');
        } else if (action === 'c') {
           next.stats.totalWindows += 1;
           if (next.stats.totalWindows >= 10) trackMedal('window_shopper');
        } else if (action === '%' || action === '"') {
           next.stats.sessionSplits += 1;
           if (next.stats.sessionSplits >= 20) trackMedal('splitter');
        }
      }

      if (prev.isListingSessions) {
        if (action === 'ArrowUp' || action === 'ArrowDown') {
          const dir = action === 'ArrowUp' ? -1 : 1;
          next.selectedWindowListIndex = (prev.selectedWindowListIndex + dir + prev.windows.length) % prev.windows.length;
          if (action === expectedAction) next.actionProgressIndex += 1; else if (expectedAction !== 'Enter' && expectedAction !== 'w') next.actionProgressIndex = 0;
          return next;
        } else if (action === 'Enter') {
          next.activeWindowIndex = prev.selectedWindowListIndex;
          next.isListingSessions = false;
          next.commandBarMode = 'none';
          if ((expectedAction === 'Enter' || expectedAction === 'w')) {
            next.actionProgressIndex += 1;
            if (next.actionProgressIndex >= currentLevelDef.requiredActions.length) triggerSuccess(currentLevelDef.id, currentLevelDef.title);
          } else next.actionProgressIndex = 0;
          return next;
        } else if (action === 'Escape' || action === 'q') {
          next.isListingSessions = false;
          next.commandBarMode = 'none';
          return next;
        }
        return next;
      }

      if (curPaneId && prev.activeClockPaneIds.includes(curPaneId)) {
        if (action === 'Escape') {
          next.activeClockPaneIds = prev.activeClockPaneIds.filter(id => id !== curPaneId);
          if (expectedAction === 'Escape') {
            next.actionProgressIndex += 1;
            if (next.actionProgressIndex >= currentLevelDef.requiredActions.length) triggerSuccess(currentLevelDef.id, currentLevelDef.title);
          }
          return next;
        }
        if (action !== 'prefix' && !prev.prefixActive) return next;
      }

      if (prev.isShowingIndices) {
        if (/^[0-9]$/.test(action)) {
          const winIdx = next.activeWindowIndex;
          const flat = getFlatPanes(next.windows[winIdx].layout);
          const jumpIdx = parseInt(action);
          if (jumpIdx < flat.length) next.windows[winIdx] = { ...next.windows[winIdx], activePaneId: flat[jumpIdx] };
          next.isShowingIndices = false;
          if (indicesTimerRef.current) window.clearTimeout(indicesTimerRef.current);
          if (action === expectedAction) { next.actionProgressIndex += 1; if (next.actionProgressIndex >= currentLevelDef.requiredActions.length) triggerSuccess(currentLevelDef.id, currentLevelDef.title); } else next.actionProgressIndex = 0;
          return next;
        }
        if (action !== 'prefix' && !prev.prefixActive) { next.isShowingIndices = false; if (indicesTimerRef.current) window.clearTimeout(indicesTimerRef.current); }
      }

      if (prev.isConfirming) {
        if (action === 'y') {
          next.isDirty = true;
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
            if (next.windows.length > 1) { next.windows.splice(next.activeWindowIndex, 1); next.activeWindowIndex = Math.max(0, next.activeWindowIndex - 1); }
          }
          next.isConfirming = false; next.confirmationTarget = 'none'; next.commandBarMode = 'none';
          if (action === expectedAction) { next.actionProgressIndex += 1; if (next.actionProgressIndex >= currentLevelDef.requiredActions.length) triggerSuccess(currentLevelDef.id, currentLevelDef.title); } else next.actionProgressIndex = 0;
          return next;
        } else if (action === 'n' || action === 'Escape') { next.isConfirming = false; next.confirmationTarget = 'none'; next.commandBarMode = 'none'; next.actionProgressIndex = 0; return next; }
      }

      if (prev.isRenamingWindow) {
        if (action === 'Enter') {
          next.isDirty = true;
          next.windows[next.activeWindowIndex].name = next.renameBuffer || 'bash';
          next.isRenamingWindow = false; next.commandBarMode = 'none';
          if (expectedAction === 'Enter') { next.actionProgressIndex += 1; if (next.actionProgressIndex >= currentLevelDef.requiredActions.length) triggerSuccess(currentLevelDef.id, currentLevelDef.title); } else next.actionProgressIndex = 0;
          return next;
        } else if (action === 'Backspace') { next.renameBuffer = next.renameBuffer.slice(0, -1); return next; } else if (action === 'Escape') { next.isRenamingWindow = false; next.commandBarMode = 'none'; next.renameBuffer = ''; return next; } else if (action.length === 1) { next.renameBuffer += action; return next; }
      }

      setLastKeyPressed(action);
      next.windows = prev.windows.map(w => ({ ...w }));
      const curWin = next.windows[next.activeWindowIndex];

      if (action === 'prefix') {
        next.prefixActive = true;
        // ONLY increment if the prefix is specifically requested as the next step in the level definition
        if (expectedAction === 'prefix') {
          next.actionProgressIndex += 1;
        }
      } else if (prev.prefixActive) {
        next.prefixActive = false;
        let correct = action === expectedAction;
        if (action === '%') {
          next.isDirty = true;
          const newId = `p-${Date.now()}`;
          const split = (n: LayoutNode, id: string): LayoutNode => {
            if (n.type === 'pane' && n.id === id) return { type: 'split', direction: 'vertical', children: [{ type: 'pane', id: n.id }, { type: 'pane', id: newId }] };
            if (n.type === 'split') return { ...n, children: [split(n.children![0], id), split(n.children![1], id)] as [LayoutNode, LayoutNode] };
            return n;
          };
          curWin.layout = split(curWin.layout, curWin.activePaneId);
          curWin.activePaneId = newId;
        } else if (action === '"') {
          next.isDirty = true;
          const newId = `p-${Date.now()}`;
          const split = (n: LayoutNode, id: string): LayoutNode => {
            if (n.type === 'pane' && n.id === id) return { type: 'split', direction: 'horizontal', children: [{ type: 'pane', id: n.id }, { type: 'pane', id: newId }] };
            if (n.type === 'split') return { ...n, children: [split(n.children![0], id), split(n.children![1], id)] as [LayoutNode, LayoutNode] };
            return n;
          };
          curWin.layout = split(curWin.layout, curWin.activePaneId);
          curWin.activePaneId = newId;
        } else if (action === 'c') {
          next.isDirty = true;
          const newW = `win-${Date.now()}`, newP = `p-${Date.now()}`;
          next.windows.push({ id: newW, name: 'bash', layout: createPane(newP), activePaneId: newP });
          next.activeWindowIndex = next.windows.length - 1;
        } else if (action === 'Control+o') {
          const flat = getFlatPanes(curWin.layout);
          if (flat.length > 1) {
            const rot = [flat[flat.length - 1], ...flat.slice(0, -1)];
            curWin.layout = rotateLayoutPanes(curWin.layout, rot, { val: 0 });
          }
        } else if (action === '{' || action === '}') {
          const flat = getFlatPanes(curWin.layout);
          const i = flat.indexOf(curWin.activePaneId);
          if (flat.length > 1) {
            let s = action === '{' ? i - 1 : i + 1;
            if (s < 0) s = flat.length - 1; if (s >= flat.length) s = 0;
            const newIds = [...flat]; [newIds[i], newIds[s]] = [newIds[s], newIds[i]];
            curWin.layout = rotateLayoutPanes(curWin.layout, newIds, { val: 0 });
          }
        } else if (action === ' ' || action === 'Spacebar') {
          const toggle = (n: LayoutNode): LayoutNode => n.type === 'split' ? { ...n, direction: n.direction === 'vertical' ? 'horizontal' : 'vertical' } : n;
          curWin.layout = toggle(curWin.layout);
        } else if (action.startsWith('Arrow')) {
          const nid = findTargetPaneId(curWin.layout, curWin.activePaneId, action);
          if (nid) curWin.activePaneId = nid;
        } else if (action === 'z') next.isZoomed = !next.isZoomed;
        else if (action === 't') { if (!next.activeClockPaneIds.includes(curWin.activePaneId)) next.activeClockPaneIds = [...next.activeClockPaneIds, curWin.activePaneId]; }
        else if (action === 'q') {
          next.isShowingIndices = true;
          if (indicesTimerRef.current) window.clearTimeout(indicesTimerRef.current);
          indicesTimerRef.current = window.setTimeout(() => setState(s => ({ ...s, isShowingIndices: false })), 3000);
        } else if (action === 'n') next.activeWindowIndex = (next.activeWindowIndex + 1) % next.windows.length;
        else if (action === 'p') next.activeWindowIndex = (next.activeWindowIndex - 1 + next.windows.length) % next.windows.length;
        else if (/^[0-9]$/.test(action)) { const idx = parseInt(action); if (idx < next.windows.length) next.activeWindowIndex = idx; }
        else if (action === 'x') { next.isConfirming = true; next.confirmationTarget = 'pane'; next.commandBarMode = 'command'; }
        else if (action === '&') { next.isConfirming = true; next.confirmationTarget = 'window'; next.commandBarMode = 'command'; }
        else if (action === ',') { next.isRenamingWindow = true; next.renameBuffer = ''; next.commandBarMode = 'rename-window'; }
        else if (action === 'w') { next.isListingSessions = true; next.selectedWindowListIndex = next.activeWindowIndex; next.commandBarMode = 'list-windows'; }
        else if (action === 'o') { const flat = getFlatPanes(curWin.layout); const i = flat.indexOf(curWin.activePaneId); curWin.activePaneId = flat[(i + 1) % flat.length]; }

        if (correct) next.actionProgressIndex += 1; else next.actionProgressIndex = 0;
      } else {
        if (action === expectedAction) next.actionProgressIndex += 1; else next.actionProgressIndex = 0;
      }
      if (next.actionProgressIndex >= currentLevelDef.requiredActions.length) triggerSuccess(currentLevelDef.id, currentLevelDef.title);
      return next;
    });
  }, [state, triggerSuccess, resetLevel]);

  const advanceLevel = useCallback(() => {
    setState(prev => {
      const idx = LEVELS.findIndex(l => l.id === prev.currentLevel);
      const nid = (idx !== -1 && idx < LEVELS.length - 1) ? LEVELS[idx + 1].id : LEVELS[0].id;
      const ns = getInitialStateForLevel(nid);
      setPaneContents(JSON.parse(JSON.stringify(ns.paneContents)));
      if (indicesTimerRef.current) window.clearTimeout(indicesTimerRef.current);
      return { ...prev, ...ns, currentLevel: nid, actionProgressIndex: 0, feedback: null, isPendingSuccess: false, prefixActive: false, isZoomed: false, activeClockPaneIds: [], isShowingIndices: false, isIntroOpen: nid === 0, isConfirming: false, confirmationTarget: 'none', commandBarMode: 'none', isListingSessions: false, selectedWindowListIndex: 0, isRenamingWindow: false, renameBuffer: '', isDirty: false, newMedalsInLevel: [] };
    });
  }, []);

  const goToLevel = useCallback((idx: number) => {
    const ns = getInitialStateForLevel(idx);
    setPaneContents(JSON.parse(JSON.stringify(ns.paneContents)));
    setState(prev => ({ ...prev, ...ns, currentLevel: idx, actionProgressIndex: 0, feedback: null, isPendingSuccess: false, prefixActive: false, isZoomed: false, activeClockPaneIds: [], isShowingIndices: false, isIntroOpen: idx === 0, isConfirming: false, confirmationTarget: 'none', commandBarMode: 'none', isListingSessions: false, selectedWindowListIndex: 0, isRenamingWindow: false, renameBuffer: '', isDirty: false, newMedalsInLevel: [] }));
    setShowTOC(false);
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      // Prioritize closing popups with ESC
      if (e.key === 'Escape') { 
        if (state.isLeaderboardOpen) { e.preventDefault(); setState(s => ({ ...s, isLeaderboardOpen: false })); return; }
        if (showTOC) { e.preventDefault(); setShowTOC(false); return; }
        if (state.isProfileOpen) { e.preventDefault(); setState(s => ({ ...s, isProfileOpen: false })); return; }
      }

      if (state.isIntroOpen || state.feedback?.type === 'success') { 
        if (e.key === ' ' || e.key === 'Enter') { 
          e.preventDefault(); 
          advanceLevel(); 
        } 
        return; 
      }
      
      const key = e.key;
      if (e.ctrlKey && key === 'b') { e.preventDefault(); handleAction('prefix'); return; }
      if (state.prefixActive && e.ctrlKey && key === 'o') { e.preventDefault(); handleAction('Control+o'); return; }
      if (['Shift', 'Control', 'Alt', 'Meta'].includes(key)) return;
      
      const activeWin = state.windows[state.activeWindowIndex];
      const hasClock = activeWin?.activePaneId && state.activeClockPaneIds.includes(activeWin.activePaneId);
      
      if (state.prefixActive || hasClock || state.isShowingIndices || state.isConfirming || state.isRenamingWindow || state.isListingSessions) {
        if (key !== 'F12' && key !== 'F5') e.preventDefault();
      }
      
      handleAction(key);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [state, handleAction, advanceLevel, showTOC]);

  const handleAuth = async () => {
    if (state.user) {
      setState(s => ({ ...s, isProfileOpen: true }));
    } else if (isSupabaseConfigured && supabase) {
      await supabase.auth.signInWithOAuth({ provider: 'google' });
    } else {
      setState(s => ({ ...s, feedback: { message: "Supabase not configured for Cloud Sync.", type: 'info' } }));
    }
  };

  const masteryPoints = state.completedLevels.length * 500;
  const memoryPoints = Object.values(state.completionCounts).reduce((acc, count) => acc + (Math.max(0, count - 1) * 10), 0);
  const totalPoints = masteryPoints + memoryPoints;

  return (
    <div className="flex flex-col h-screen w-full bg-[#0f172a] text-[#f8fafc] overflow-hidden select-none font-sans">
      <header className="py-2 flex items-center justify-between px-8 border-b border-[#1e293b] bg-[#1e293b]/50 backdrop-blur-md z-20">
        <div className="flex items-center gap-4 flex-shrink-0">
          <div className="p-2 bg-[#7aa2f7] rounded-lg shadow-lg cursor-pointer transition-transform hover:scale-110" onClick={() => setShowTOC(true)}>
            <Terminal size={20} className="text-[#1a1b26]" />
          </div>
          <div>
            <h1 className="font-bold tracking-tight text-lg leading-none uppercase">TMUX DOJO</h1>
            <p className="text-[9px] text-slate-400 uppercase tracking-widest font-semibold mt-1">Dojo V7.0</p>
          </div>
        </div>
        
        <div className="flex-1 flex justify-center items-center">
            <div className="text-[12px] text-slate-400 uppercase tracking-[0.3em] font-black">Level {level.id}: {level.title}</div>
        </div>

        <div className="flex items-center gap-6">
          <button 
            onClick={() => setState(s => ({ ...s, isLeaderboardOpen: true }))}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1e293b] border border-slate-700 hover:border-[#7aa2f7] transition-all group"
          >
            <Trophy size={14} className="text-yellow-500 group-hover:scale-110 transition-transform" />
            <div className="flex flex-col items-start leading-none">
              <span className="text-[10px] font-black uppercase text-[#7aa2f7]">{totalPoints} PTS</span>
              <span className="text-[8px] text-slate-500 uppercase font-black" style={{ letterSpacing: '2px' }}>Ninjaboard</span>
            </div>
          </button>

          <button onClick={() => setShowTOC(true)} className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 flex items-center gap-2 flex-shrink-0 group">
            <List size={20} className="group-hover:text-[#7aa2f7]" />
            <span className="text-xs font-bold uppercase tracking-widest">Levels</span>
          </button>
          
          <button onClick={handleAuth} className="flex items-center gap-3 px-3 py-1.5 bg-[#1e293b] rounded-xl border border-slate-700 hover:border-[#7aa2f7] transition-all">
            {state.user?.user_metadata?.avatar_url ? (
              <img src={state.user.user_metadata.avatar_url} className="w-6 h-6 rounded-full border border-[#7aa2f7]" alt="Avatar" />
            ) : (
              <UserIcon size={18} className="text-[#7aa2f7]" />
            )}
            <span className="text-xs font-black uppercase tracking-widest">
              {state.user ? state.user.email.split('@')[0] : 'Join Dojo'}
            </span>
          </button>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        <aside 
          ref={sidebarRef}
          className="w-12 border-r border-[#1e293b] bg-[#0f172a] flex flex-col items-center py-6 overflow-y-auto no-scrollbar gap-8 flex-shrink-0 px-0.5"
        >
            {LEVEL_GROUPS.map(group => {
                const groupLevels = LEVELS.filter(l => l.id >= group.range[0] && l.id <= group.range[1]);
                return (
                    <div key={group.id} className="flex flex-col items-center gap-4 w-full">
                        <span className="text-[6px] uppercase tracking-tighter text-slate-500 font-black text-center w-full">{group.title}</span>
                        <div className="flex flex-col gap-1.5">
                            {groupLevels.map((l) => (
                                <button 
                                  key={l.id} 
                                  data-level-id={l.id}
                                  onClick={() => goToLevel(l.id)} 
                                  className={`w-9 h-9 rounded-full border-2 transition-all text-[10px] font-black ${state.currentLevel === l.id ? 'bg-[#7aa2f7] text-[#1a1b26] border-white scale-110' : state.completedLevels.includes(l.id) ? 'bg-[#9ece6a] text-[#1a1b26] border-transparent' : 'bg-[#1e293b] text-slate-400 border-slate-700 hover:border-slate-500'}`}
                                >
                                  {l.id}
                                </button>
                            ))}
                        </div>
                    </div>
                );
            })}
        </aside>

        <aside className="w-[420px] border-r border-[#1e293b] p-8 flex flex-col gap-6 overflow-y-auto bg-[#0f172a] flex-shrink-0">
            <section className="space-y-4">
              <h2 className="text-2xl font-black text-white leading-tight flex items-start gap-3">
                <Circle size={22} className="text-[#7aa2f7] flex-shrink-0 mt-1.5" />
                <span>Level {level.id}: {level.title}</span>
              </h2>
              <div className="text-slate-300 text-lg leading-relaxed font-medium whitespace-pre-line">
                {renderStyledText(level.description)}
              </div>
            </section>
            <section className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 space-y-4 shadow-inner">
              <div className="flex items-center gap-2 text-rose-500 font-black text-[10px] uppercase tracking-widest"><Shield size={16} /><span>The Task</span></div>
              <div className="text-xl font-bold text-slate-100 leading-tight">
                {Array.isArray(level.objective) ? (
                  <div className="space-y-3">
                    {level.objective.map((line, idx) => <div key={idx}>{renderStyledText(line)}</div>)}
                  </div>
                ) : renderStyledText(level.objective)}
              </div>
              <div className="flex gap-1 mt-4">
                {level.requiredActions.map((_, idx) => (<div key={idx} className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${idx < (state.isPendingSuccess ? level.requiredActions.length : state.actionProgressIndex) ? 'bg-[#9ece6a]' : 'bg-slate-800'}`} />))}
              </div>
            </section>
            <section className="mt-auto bg-slate-800/20 p-5 rounded-2xl border border-slate-800/50 space-y-3">
              <div className="flex items-center gap-2 text-slate-500 font-bold text-[10px] uppercase tracking-widest"><Info size={14} /><span>Dojo Hint</span></div>
              <div className="text-[13px] text-slate-400 font-mono italic leading-relaxed">
                {renderStyledText(level.hint)}
              </div>
            </section>
        </aside>

        <section className="flex-1 relative flex flex-col p-8 bg-[#1a1b26]">
          <div className={`flex-1 bg-black rounded-xl border-2 overflow-hidden flex flex-col relative transition-all duration-300 ${state.isPendingSuccess ? 'border-[#9ece6a] scale-[0.995]' : 'border-[#24283b]'}`}>
            <div className="h-10 bg-[#24283b] border-b border-[#414868] flex items-center px-6 justify-between flex-shrink-0">
              <div className="flex gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#f7768e]/70" /><div className="w-2.5 h-2.5 rounded-full bg-[#e0af68]/70" /><div className="w-2.5 h-2.5 rounded-full bg-[#9ece6a]/70" />
              </div>
              <div className="text-[10px] font-mono text-slate-500 flex items-center gap-2 uppercase tracking-widest"><Layers size={12} /> tmux:{activeWindow?.id || 'null'}</div>
            </div>

            <div className="flex-1 flex overflow-hidden relative">
              {activeWindow && (
                <LayoutRenderer 
                  node={state.isZoomed ? { type: 'pane', id: activeWindow.activePaneId } : activeWindow.layout}
                  activePaneId={activeWindow.activePaneId} paneContents={paneContents}
                  showIndices={state.isShowingIndices} activeClockPaneIds={state.activeClockPaneIds}
                />
              )}

              {state.isConfirming && (
                <div className="absolute top-0 left-0 right-0 z-[110] bg-[#f7768e] text-white p-4 text-center font-black uppercase text-sm animate-in slide-in-from-top duration-300 border-b-2 border-white/20 shadow-lg">
                  Kill {state.confirmationTarget}? (y/n)
                </div>
              )}

              {state.isListingSessions && (
                <div className="absolute inset-0 z-[120] flex items-center justify-center p-8 animate-in fade-in duration-150">
                  <div className="bg-[#1a1b26] border border-[#414868] w-full max-w-lg flex flex-col shadow-2xl font-mono text-sm">
                    <div className="bg-[#414868] px-4 py-1 flex items-center justify-between text-[#7aa2f7] font-bold text-xs uppercase"><span>tmux list-windows</span></div>
                    <div className="flex-1 overflow-y-auto max-h-[60vh] py-1">
                       {state.windows.map((w, i) => (
                         <div key={i} className={`px-4 py-1 flex items-center justify-between ${i === state.selectedWindowListIndex ? 'bg-[#7aa2f7] text-[#1a1b26]' : 'text-[#a9b1d6]'}`}>
                           <span>{i}: {w.name} ({getFlatPanes(w.layout).length} panes)</span>
                         </div>
                       ))}
                    </div>
                  </div>
                </div>
              )}
              
              {state.isDirty && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[70]">
                    <button onClick={resetLevel} className="text-white transition-all flex items-center gap-2 text-[11px] font-black uppercase bg-[#ef4444] px-6 py-2 rounded-full border border-white/20 hover:scale-110 shadow-md backdrop-blur-sm"><RotateCcw size={14} /> Reset Level [d + d]</button>
                </div>
              )}

              {state.feedback && (
                <div className="absolute inset-0 bg-black/80 z-[100] flex items-center justify-center animate-in fade-in duration-300 p-8 text-center">
                  <div className="flex flex-col items-center max-w-2xl">
                    <CheckCircle size={100} className="text-[#9ece6a]" />
                    <h3 className="text-7xl font-black text-white italic tracking-tighter uppercase mt-6 drop-shadow-xl">LEVEL COMPLETE</h3>
                    
                    {state.medalsEarned.length > 0 && (
                      <div className="mt-12 space-y-4 w-full flex flex-col items-center">
                        <p className="text-slate-400 font-mono text-sm uppercase tracking-widest">Your Dojo Medals</p>
                        <div className="flex gap-4 justify-center">
                          {state.medalsEarned.map(m => {
                            const isNew = state.newMedalsInLevel.includes(m);
                            return (
                              <div key={m} className="bg-slate-800 p-3 rounded-xl flex flex-col items-center border border-slate-700 transition-all hover:scale-105 hover:border-[#7aa2f7] group relative cursor-help">
                                <span className="text-4xl">{(MEDAL_DATA as any)[m]?.emoji}</span>
                                <span className="text-[10px] uppercase font-bold text-slate-400 mt-1">{(MEDAL_DATA as any)[m]?.name}</span>
                                
                                {isNew && (
                                  <span className="absolute -top-2 -right-2 bg-[#9ece6a] text-black text-[8px] font-black px-1.5 py-0.5 rounded-full animate-bounce shadow-lg border border-black/20">NEW</span>
                                )}

                                <div className="absolute -top-[100px] left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all bg-black text-[#7aa2f7] text-[10px] p-3 rounded border border-[#7aa2f7] w-[180px] pointer-events-none font-mono shadow-2xl z-[1000] text-center">
                                  <div className="font-black mb-1">{(MEDAL_DATA as any)[m]?.name}</div>
                                  {(MEDAL_DATA as any)[m]?.desc}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    <div className="flex flex-col items-center mt-12">
                        <div className="text-[#9ece6a] font-mono text-2xl font-black flex items-center justify-center gap-4 py-2"><ChevronRight size={38} /><span>Next Level Ready</span></div>
                        <div className="text-xs text-slate-300 font-black uppercase tracking-[0.4em] opacity-80 mt-2">Press SPACE or ENTER to advance</div>
                    </div>
                  </div>
                </div>
              )}

              {state.isLeaderboardOpen && (
                <div className="absolute inset-0 z-[200] animate-in fade-in zoom-in duration-200">
                  <HtopLeaderboard onClose={() => setState(s => ({ ...s, isLeaderboardOpen: false }))} />
                </div>
              )}

              {showTOC && (
                <div className="absolute inset-0 z-[300] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
                  <div className="bg-[#1a1b26] border-2 border-[#24283b] w-full max-w-lg max-h-full rounded-2xl overflow-hidden flex flex-col shadow-2xl">
                    <div className="p-4 border-b border-[#24283b] flex items-center justify-between bg-slate-900/50 flex-shrink-0">
                      <div className="flex items-center gap-2">
                        <List size={18} className="text-[#7aa2f7]" />
                        <h2 className="text-lg font-black uppercase tracking-tighter">All Levels</h2>
                      </div>
                      <button onClick={() => setShowTOC(false)} className="p-1 hover:bg-slate-800 rounded-full transition-colors"><X size={20} /></button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                      {LEVEL_GROUPS.map(group => (
                        <div key={group.id} className="space-y-2 mb-6">
                          <h3 className="text-sm font-black text-[#7aa2f7] border-b border-slate-800 pb-1 uppercase">{group.title}</h3>
                          <div className="flex flex-col gap-1">
                            {LEVELS.filter(l => l.id >= group.range[0] && l.id <= group.range[1]).map(l => (
                              <div key={l.id} onClick={() => goToLevel(l.id)} className={`flex items-center gap-3 p-2 rounded-lg border transition-all ${state.currentLevel === l.id ? 'border-[#7aa2f7] bg-[#7aa2f7]/10' : 'border-slate-800 bg-[#1e293b]/30 hover:border-[#7aa2f7]'} cursor-pointer`}>
                                <span className={`w-6 h-6 flex-shrink-0 flex items-center justify-center rounded-full font-black text-[10px] ${state.completedLevels.includes(l.id) ? 'bg-[#9ece6a] text-black' : 'bg-slate-800 text-[#7aa2f7]'}`}>{l.id}</span>
                                <span className="font-bold text-white uppercase text-xs truncate flex-1">{l.title}</span>
                                {state.completedLevels.includes(l.id) && <CheckCircle size={14} className="text-[#9ece6a] flex-shrink-0" />}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

             {state.isIntroOpen && (
              <div className="absolute inset-0 bg-black/95 backdrop-blur-3xl z-[200] flex items-center justify-center animate-in fade-in zoom-in duration-300 p-8">
                <div className="text-center space-y-8 max-w-4xl w-full">
                  <div className="inline-flex items-center justify-center p-8 bg-[#7aa2f7] rounded-full"><Terminal size={60} className="text-[#1a1b26]" /></div>
                  <div className="space-y-2">
                    <h3 className="text-6xl font-black text-white italic tracking-tighter uppercase">MASTER THE TMUX</h3>
                    <p className="text-[#7aa2f7] text-xl font-bold tracking-widest uppercase mb-12">Escape the cursor. Embrace the terminal.</p>
                    <div className="space-y-1.5 pt-6 font-serif italic text-slate-400 text-[20px] leading-tight" >
                    You are entering the Dojo of TMUX. <br/>

Here, your mouse is useless. <br/>

Your trackpad is a burden. <br/>

Learn the shortcuts. <br/>

Command the grid. <br/>

Rule the panels.<br/>

Control the screen.<br/>

Bend reality.<br/>

[Ctrl + B] is where it starts.
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-5 pt-12">
                    <div className="px-12 py-6 bg-[#1e293b] border-2 border-[#7aa2f7] rounded-full text-sm text-white font-black uppercase tracking-[0.4em] shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer" onClick={advanceLevel}>Press SPACE or ENTER to start</div>
                  </div>
                </div>
              </div>
            )}
            </div>

            <div className={`h-8 flex items-center px-3 text-[10px] font-mono font-bold uppercase transition-colors duration-200 ${TERMINAL_COLORS.statusBar} flex-shrink-0`}>
              <div className="flex-1 flex items-center gap-2 overflow-hidden">
                {state.windows.map((w, idx) => (
                  <span key={idx} className={`px-4 py-1 rounded-sm transition-all whitespace-nowrap ${state.activeWindowIndex === idx ? 'bg-[#9ece6a] text-black font-black' : 'text-slate-400'}`}>{idx}:{w.name}{state.activeWindowIndex === idx ? '*' : ''}</span>
                ))}
              </div>
              <div className="flex items-center gap-6 flex-shrink-0">
                <div className="flex items-center gap-2 text-[#e0af68]"><Keyboard size={14} /><span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-700 min-w-[50px] text-center text-[#7aa2f7]">{lastKeyPressed || '---'}</span></div>
                {state.prefixActive && <span className="bg-[#f7768e] text-white px-3 py-0.5 rounded font-black animate-pulse">PREFIX</span>}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default App;
