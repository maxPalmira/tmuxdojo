
export type PaneType = {
  id: string;
  content: string[];
  isActive: boolean;
};

export type LayoutNode = {
  type: 'pane' | 'split';
  id?: string; // Only for panes
  direction?: 'horizontal' | 'vertical';
  children?: [LayoutNode, LayoutNode];
};

export type WindowType = {
  id: string;
  name: string;
  layout: LayoutNode;
  activePaneId: string;
};

export interface Level {
  id: number;
  title: string;
  description: string;
  objective: string | string[];
  requiredActions: string[];
  commandsCovered: string[];
  hint: string;
  initialState?: {
    windows: WindowType[];
    activeWindowIndex: number;
    paneContents?: Record<string, string[]>;
  };
}

export type CommandBarMode = 'none' | 'command' | 'rename-window' | 'find-window' | 'move-window' | 'rename-session' | 'list-windows';

export type AppState = {
  windows: WindowType[];
  activeWindowIndex: number;
  prefixActive: boolean;
  isConfirming: boolean;
  isZoomed: boolean;
  isShowingClock: boolean;
  isListingSessions: boolean;
  isCopyMode: boolean;
  isDetached: boolean;
  isRenamingWindow: boolean;
  isShowingIndices: boolean;
  commandBarMode: CommandBarMode;
  currentLevel: number;
  actionProgressIndex: number;
  completedLevels: number[];
  inputHistory: string[];
  feedback: {
    message: string;
    type: 'success' | 'error' | 'info';
  } | null;
};
