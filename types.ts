
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
  commandsCovered?: string[];
  hint: string;
  initialState?: {
    windows: WindowType[];
    activeWindowIndex: number;
    paneContents?: Record<string, string[]>;
  };
}

export type CommandBarMode = 'none' | 'command' | 'rename-window' | 'find-window' | 'move-window' | 'rename-session' | 'list-windows';

export type UserProfile = {
  id: string;
  username: string;
  avatar_url?: string;
  medals: string[];
  joined_at: string;
};

export type GlobalStats = {
  rank: number;
  username: string;
  masteryPoints: number;
  memoryPoints: number;
  medals: string[];
};

export type AppState = {
  windows: WindowType[];
  activeWindowIndex: number;
  prefixActive: boolean;
  isConfirming: boolean;
  confirmationTarget: 'pane' | 'window' | 'none';
  isZoomed: boolean;
  activeClockPaneIds: string[];
  isListingSessions: boolean;
  selectedWindowListIndex: number;
  isCopyMode: boolean;
  isDetached: boolean;
  isRenamingWindow: boolean;
  renameBuffer: string;
  isShowingIndices: boolean;
  commandBarMode: CommandBarMode;
  currentLevel: number;
  actionProgressIndex: number;
  completedLevels: number[]; // List of level IDs completed at least once
  completionCounts: Record<number, number>; // ID -> total completions
  inputHistory: string[];
  feedback: {
    message: string;
    type: 'success' | 'error' | 'info';
  } | null;
  // New expansion states
  user: any | null;
  profile: UserProfile | null;
  stats: {
    sessionSplits: number;
    totalClocks: number;
    totalFlashes: number;
    totalWindows: number;
    zeroResetStreak: number;
  };
  medalsEarned: string[];
  isLeaderboardOpen: boolean;
  isProfileOpen: boolean;
};
