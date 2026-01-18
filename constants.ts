
import { Level } from './types';

export const PREFIX_KEY = 'b';
export const TERMINAL_COLORS = {
  bg: 'bg-[#1a1b26]',
  text: 'text-[#a9b1d6]',
  accent: 'text-[#7aa2f7]',
  success: 'text-[#9ece6a]',
  warning: 'text-[#e0af68]',
  error: 'text-[#f7768e]',
  statusBar: 'bg-[#414868]',
  activeWindow: 'bg-[#7aa2f7] text-[#1a1b26]',
};

export const LEVEL_DATA: { id: number; title: string; levels: Level[] }[] = [
  {
    id: 0,
    title: "Entry",
    levels: [
      {
        id: 0,
        title: "Dojo Entry",
        description: "Welcome, initiate.\nThis dojo will burn tmux into your muscle memory.\nNo mouse.\nOnly keyboard.",
        objective: "Press [Space] to begin.",
        requiredActions: [],
        hint: "Focus the terminal and press [Space]."
      },
      {
        id: 1,
        title: "The Prefix",
        description: "Your lifeblood is the Prefix. [Ctrl + b].\nPractice activating it.",
        objective: "1. Prefix [Ctrl + b]",
        requiredActions: ['prefix'],
        hint: "Hold Ctrl and tap b. Look for the 'PREFIX' indicator in the status bar."
      }
    ]
  },
  {
    id: 1,
    title: "The Splits",
    levels: [
      {
        id: 2,
        title: "Vertical Cut",
        description: "Divide the screen vertically.",
        objective: ["1. Prefix [Ctrl + b]", "2. Vertical split [%]"],
        requiredActions: ['prefix', '%'],
        hint: "Hold [Ctrl], press [b], then release and press [%]."
      },
      {
        id: 3,
        title: "Horizontal Cut",
        description: "Divide the screen horizontally.",
        objective: ["1. Prefix [Ctrl + b]", "2. Horizontal split [\"]"],
        requiredActions: ['prefix', '"'],
        hint: "Prefix then [Shift] + ['] for [\"]"
      },
      {
        id: 4,
        title: "The Cross",
        description: "Create a 2x2 grid by splitting both ways.",
        objective: ["1. Vertical split [%]", "2. Horizontal split [\"]"],
        requiredActions: ['prefix', '%', 'prefix', '"'],
        hint: "Prefix each command individually."
      },
      {
        id: 5,
        title: "Kill Pane",
        description: "Close current pane with [x]. Confirm with [y].",
        objective: ["1. Vertical split [%]", "2. Kill pane [x]", "3. Confirm [y]"],
        requiredActions: ['prefix', '%', 'prefix', 'x', 'y'],
        hint: "Prefix, x, then y to confirm."
      },
      {
        id: 6,
        title: "Triple Column",
        description: "Create three columns using two vertical splits.",
        objective: ["1. Vertical split [%]", "2. Vertical split [%]"],
        requiredActions: ['prefix', '%', 'prefix', '%'],
        hint: "Splits divide the *active* pane."
      },
      {
        id: 7,
        title: "Double Row",
        description: "Create a stack of three rows.",
        objective: ["1. Horizontal split [\"]", "2. Horizontal split [\"]"],
        requiredActions: ['prefix', '"', 'prefix', '"'],
        hint: "Creates a stack of 3 rows."
      },
      {
        id: 8,
        title: "Split Symmetry",
        description: "Horizontal split, move up, then horizontal split again.",
        objective: ["1. Horizontal split [\"]", "2. Move up [ArrowUp]", "3. Horizontal split [\"]"],
        requiredActions: ['prefix', '"', 'prefix', 'ArrowUp', 'prefix', '"'],
        hint: "Move focus to the top pane before splitting it."
      },
      {
        id: 9,
        title: "Combo Breaker",
        description: "Split vertical, move left, split horizontal.",
        objective: ["1. Vertical split [%]", "2. Move left [ArrowLeft]", "3. Horizontal split [\"]"],
        requiredActions: ['prefix', '%', 'prefix', 'ArrowLeft', 'prefix', '"'],
        hint: "Focus management is vital."
      },
      {
        id: 10,
        title: "The Grid Master",
        description: "Vertical, Horizontal, move right, Horizontal.",
        objective: ["1. Vertical split [%]", "2. Horizontal split [\"]", "3. Move right [ArrowRight]", "4. Horizontal split [\"]"],
        requiredActions: ['prefix', '%', 'prefix', '"', 'prefix', 'ArrowRight', 'prefix', '"'],
        hint: "Divide both sides of a vertical split."
      },
      {
        id: 11,
        title: "Cleanup Flow",
        description: "Split vertical, move left, then kill that pane.",
        objective: ["1. Vertical split [%]", "2. Move left [ArrowLeft]", "3. Kill pane [x]", "4. Confirm [y]"],
        requiredActions: ['prefix', '%', 'prefix', 'ArrowLeft', 'prefix', 'x', 'y'],
        hint: "Practice splitting and cleaning up side panes."
      }
    ]
  },
  {
    id: 2,
    title: "Navigation",
    levels: [
      {
        id: 12,
        title: "Move Left",
        description: "Move focus between panes.",
        objective: ["1. Vertical split [%]", "2. Move left [ArrowLeft]"],
        requiredActions: ['prefix', '%', 'prefix', 'ArrowLeft'],
        hint: "Prefix then arrow key."
      },
      {
        id: 13,
        title: "Move Up",
        description: "Move focus up.",
        objective: ["1. Horizontal split [\"]", "2. Move up [ArrowUp]"],
        requiredActions: ['prefix', '"', 'prefix', 'ArrowUp'],
        hint: "Navigation works in all 4 directions."
      },
      {
        id: 14,
        title: "The Circle",
        description: "Cycle through panes with [o].",
        objective: ["1. Vertical split [%]", "2. Next pane [o]"],
        requiredActions: ['prefix', '%', 'prefix', 'o'],
        hint: "o is a handy shortcut for small numbers of panes."
      },
      {
        id: 15,
        title: "The Rectangle",
        description: "Navigate a 2x2 grid.",
        objective: ["1. Vertical split [%]", "2. Horizontal split [\"]", "3. Move left [ArrowLeft]", "4. Move up [ArrowUp]"],
        requiredActions: ['prefix', '%', 'prefix', '"', 'prefix', 'ArrowLeft', 'prefix', 'ArrowUp'],
        hint: "Use arrows to hop around."
      },
      {
        id: 16,
        title: "Creation Order",
        description: "Cycle through panes multiple times.",
        objective: ["1. Vertical split [%]", "2. Horizontal split [\"]", "3. Next pane [o]", "4. Next pane [o]", "5. Next pane [o]"],
        requiredActions: ['prefix', '%', 'prefix', '"', 'prefix', 'o', 'prefix', 'o', 'prefix', 'o'],
        hint: "Cycle order follows creation."
      },
      {
        id: 17,
        title: "Up and Out",
        description: "Horizontal, move up, vertical, move left.",
        objective: ["1. Horizontal split [\"]", "2. Move up [ArrowUp]", "3. Vertical split [%]", "4. Move left [ArrowLeft]"],
        requiredActions: ['prefix', '"', 'prefix', 'ArrowUp', 'prefix', '%', 'prefix', 'ArrowLeft'],
        hint: "Climb then split."
      },
      {
        id: 18,
        title: "Zig Zag",
        description: "Vertical, horizontal, move left, move up, move right.",
        objective: ["1. Vertical split [%]", "2. Horizontal split [\"]", "3. Move left [ArrowLeft]", "4. Move up [ArrowUp]", "5. Move right [ArrowRight]"],
        requiredActions: ['prefix', '%', 'prefix', '"', 'prefix', 'ArrowLeft', 'prefix', 'ArrowUp', 'prefix', 'ArrowRight'],
        hint: "Maintain spatial awareness."
      },
      {
        id: 19,
        title: "Corner Jump",
        description: "Create a grid and jump to the top-left.",
        objective: ["1. Vertical split [%]", "2. Horizontal split [\"]", "3. Move up [ArrowUp]", "4. Move left [ArrowLeft]"],
        requiredActions: ['prefix', '%', 'prefix', '"', 'prefix', 'ArrowUp', 'prefix', 'ArrowLeft'],
        hint: "Splitting moves focus. Navigate back to home."
      },
      {
        id: 20,
        title: "Back and Forth",
        description: "Split, move away, move back.",
        objective: ["1. Vertical split [%]", "2. Move left [ArrowLeft]", "3. Move right [ArrowRight]"],
        requiredActions: ['prefix', '%', 'prefix', 'ArrowLeft', 'prefix', 'ArrowRight'],
        hint: "Focus stays on the last moved pane."
      },
      {
        id: 21,
        title: "Split Cycle",
        description: "Split, cycle, split, cycle.",
        objective: ["1. Vertical split [%]", "2. Next pane [o]", "3. Horizontal split [\"]", "4. Next pane [o]"],
        requiredActions: ['prefix', '%', 'prefix', 'o', 'prefix', '"', 'prefix', 'o'],
        hint: "Mixing creation and cycle."
      }
    ]
  },
  {
    id: 3,
    title: "Utilities",
    levels: [
      {
        id: 22,
        title: "Zoom",
        description: "Maximize a pane to full screen.",
        objective: ["1. Vertical split [%]", "2. Zoom [z]"],
        requiredActions: ['prefix', '%', 'prefix', 'z'],
        hint: "Toggles full screen."
      },
      {
        id: 23,
        title: "Show Clock",
        description: "Show a digital clock in the current pane.",
        objective: ["1. Prefix [Ctrl + b]", "2. Show clock [t]", "3. Hide clock [Esc]"],
        requiredActions: ['prefix', 't', 'Escape'],
        hint: "Only [Esc] works to hide the clock while focused."
      },
      {
        id: 24,
        title: "Identify",
        description: "Flash pane numbers briefly.",
        objective: ["1. Vertical split [%]", "2. Flash pane numbers [q]"],
        requiredActions: ['prefix', '%', 'prefix', 'q'],
        hint: "Numbers match creation order."
      },
      {
        id: 25,
        title: "Zoom & Check",
        description: "Zoom a pane, check time, then unzoom.",
        objective: ["1. Vertical split [%]", "2. Zoom [z]", "3. Show clock [t]", "4. Zoom [z]"],
        requiredActions: ['prefix', '%', 'prefix', 'z', 'prefix', 't', 'prefix', 'z'],
        hint: "Zooming again returns to grid view."
      },
      {
        id: 26,
        title: "Multi-Clock",
        description: "Show clocks in two different panes.",
        objective: ["1. Vertical split [%]", "2. Show clock [t]", "3. Move left [ArrowLeft]", "4. Show clock [t]"],
        requiredActions: ['prefix', '%', 'prefix', 't', 'prefix', 'ArrowLeft', 'prefix', 't'],
        hint: "Clocks are pane-specific."
      },
      {
        id: 27,
        title: "Identify Move",
        description: "Flash indices then move focus to the second pane.",
        objective: ["1. Vertical split [%]", "2. Move left [ArrowLeft]", "3. Flash pane numbers [q]", "4. Move right [ArrowRight]"],
        requiredActions: ['prefix', '%', 'prefix', 'ArrowLeft', 'prefix', 'q', 'prefix', 'ArrowRight'],
        hint: "Move left first so you can move right into the second pane."
      },
      {
        id: 28,
        title: "Triple Utility",
        description: "Clock, Zoom, then Flash numbers.",
        objective: ["1. Show clock [t]", "2. Zoom [z]", "3. Flash pane numbers [q]"],
        requiredActions: ['prefix', 't', 'prefix', 'z', 'prefix', 'q'],
        hint: "Execute in sequence."
      },
      {
        id: 29,
        title: "Utility Loop",
        description: "Show clock, hide clock, zoom, then unzoom.",
        objective: ["1. Show clock [t]", "2. Hide clock [Esc]", "3. Zoom [z]", "4. Unzoom [z]"],
        requiredActions: ['prefix', 't', 'Escape', 'prefix', 'z', 'prefix', 'z'],
        hint: "Practice rapid utility usage."
      },
      {
        id: 30,
        title: "Zoom Navigation",
        description: "Zoom, unzoom, then move focus.",
        objective: ["1. Vertical split [%]", "2. Zoom [z]", "3. Unzoom [z]", "4. Move left [ArrowLeft]"],
        requiredActions: ['prefix', '%', 'prefix', 'z', 'prefix', 'z', 'prefix', 'ArrowLeft'],
        hint: "You can't move focus easily while zoomed."
      },
      {
        id: 31,
        title: "Utility Master",
        description: "Clocks in multiple panes with navigation.",
        objective: ["1. Vertical split [%]", "2. Show clock [t]", "3. Move left [ArrowLeft]", "4. Flash pane numbers [q]", "5. Show clock [t]"],
        requiredActions: ['prefix', '%', 'prefix', 't', 'prefix', 'ArrowLeft', 'prefix', 'q', 'prefix', 't'],
        hint: "The clocks persist until dismissed."
      }
    ]
  },
  {
    id: 4,
    title: "Windows",
    levels: [
      {
        id: 32,
        title: "New Window",
        description: "Create a new window tab.",
        objective: ["1. Prefix [Ctrl + b]", "2. New window [c]"],
        requiredActions: ['prefix', 'c'],
        hint: "c for create."
      },
      {
        id: 33,
        title: "Previous Window",
        description: "Cycle to the previous window tab.",
        objective: ["1. New window [c]", "2. Previous window [p]"],
        requiredActions: ['prefix', 'c', 'prefix', 'p'],
        hint: "p for previous."
      },
      {
        id: 34,
        title: "Next Window",
        description: "Cycle to the next window tab.",
        objective: ["1. New window [c]", "2. Previous window [p]", "3. Next window [n]"],
        requiredActions: ['prefix', 'c', 'prefix', 'p', 'prefix', 'n'],
        hint: "n for next."
      },
      {
        id: 35,
        title: "Kill Window",
        description: "Kill entire window tab.",
        objective: ["1. New window [c]", "2. Kill window [&]", "3. Confirm [y]"],
        requiredActions: ['prefix', 'c', 'prefix', '&', 'y'],
        hint: "Closes current tab."
      },
      {
        id: 36,
        title: "Jump to 0",
        description: "Jump to window index 0.",
        objective: ["1. New window [c]", "2. Jump to 0 [0]"],
        requiredActions: ['prefix', 'c', 'prefix', '0'],
        hint: "Direct index jumping."
      },
      {
        id: 37,
        title: "Tab Stacking",
        description: "Manage multiple windows.",
        objective: ["1. New window [c]", "2. New window [c]", "3. Jump to 0 [0]"],
        requiredActions: ['prefix', 'c', 'prefix', 'c', 'prefix', '0'],
        hint: "Windows are indexed 0, 1, 2..."
      },
      {
        id: 38,
        title: "Window Sweep",
        description: "Create, move, then kill.",
        objective: ["1. New window [c]", "2. Next window [n]", "3. Kill window [&]", "4. Confirm [y]"],
        requiredActions: ['prefix', 'c', 'prefix', 'n', 'prefix', '&', 'y'],
        hint: "Tab management flow."
      },
      {
        id: 39,
        title: "Jump Sequence",
        description: "Fast switching between windows.",
        objective: ["1. New window [c]", "2. Jump to 0 [0]", "3. Jump to 1 [1]"],
        requiredActions: ['prefix', 'c', 'prefix', '0', 'prefix', '1'],
        hint: "Fast switching."
      },
      {
        id: 40,
        title: "Window List",
        description: "Open window list and select current.",
        objective: ["1. New window [c]", "2. List windows [w]", "3. Select [Enter]"],
        requiredActions: ['prefix', 'c', 'prefix', 'w', 'Enter'],
        hint: "w opens a visual menu."
      },
      {
        id: 41,
        title: "Target Window 0",
        description: "Open window list and select window 0.",
        objective: ["1. New window [c]", "2. List windows [w]", "3. Move up [ArrowUp]", "4. Select [Enter]"],
        requiredActions: ['prefix', 'c', 'prefix', 'w', 'ArrowUp', 'Enter'],
        hint: "Focus window 0 in the list before hitting Enter."
      }
    ]
  },
  {
    id: 5,
    title: "Pro Windows",
    levels: [
      {
        id: 42,
        title: "Rename Window",
        description: "Name your active window tab.",
        objective: ["1. Rename window [,]", "2. Type 'logs' + [Enter]"],
        requiredActions: ['prefix', ',', 'Enter'],
        hint: "Name exactly 'logs'."
      },
      {
        id: 43,
        title: "Split Windows",
        description: "Split panes in a new window.",
        objective: ["1. New window [c]", "2. Vertical split [%]"],
        requiredActions: ['prefix', 'c', 'prefix', '%'],
        hint: "Each window has its own layout."
      },
      {
        id: 44,
        title: "Rename & Move",
        description: "Identify then switch.",
        objective: ["1. Rename window [,]", "2. Type 'srv' + [Enter]", "3. New window [c]"],
        requiredActions: ['prefix', ',', 'Enter', 'prefix', 'c'],
        hint: "Identify your tasks."
      },
      {
        id: 45,
        title: "Window Lifecycle",
        description: "The full window management cycle.",
        objective: ["1. New window [c]", "2. Rename window [,]", "3. Type 'tmp' + [Enter]", "4. Kill window [&]", "5. Confirm [y]"],
        requiredActions: ['prefix', 'c', 'prefix', ',', 'Enter', 'prefix', '&', 'y'],
        hint: "The full cycle."
      },
      {
        id: 46,
        title: "Cross Tab Split",
        description: "Jump back to index 0 and split it.",
        objective: ["1. New window [c]", "2. Jump to 0 [0]", "3. Vertical split [%]"],
        requiredActions: ['prefix', 'c', 'prefix', '0', 'prefix', '%'],
        hint: "Manage multiple contexts."
      },
      {
        id: 47,
        title: "List & Rename",
        description: "Use the list to jump then rename.",
        objective: ["1. New window [c]", "2. List windows [w]", "3. Move up [ArrowUp]", "4. Select [Enter]", "5. Rename window [,]"],
        requiredActions: ['prefix', 'c', 'prefix', 'w', 'ArrowUp', 'Enter', 'prefix', ','],
        hint: "Navigate then modify."
      },
      {
        id: 48,
        title: "Triple Tab Rename",
        description: "Rename window 1 then jump back to rename window 0.",
        objective: ["1. New window [c]", "2. Rename window [,]", "3. Type 'b' + [Enter]", "4. Jump to 0 [0]", "5. Rename window [,]", "6. Type 'a' + [Enter]"],
        requiredActions: ['prefix', 'c', 'prefix', ',', 'Enter', 'prefix', '0', 'prefix', ',', 'Enter'],
        hint: "Complex organization."
      },
      {
        id: 49,
        title: "Kill Cycle",
        description: "Kill window then create a new one.",
        objective: ["1. New window [c]", "2. Kill window [&]", "3. Confirm [y]", "4. New window [c]"],
        requiredActions: ['prefix', 'c', 'prefix', '&', 'y', 'prefix', 'c'],
        hint: "Fast re-creation."
      },
      {
        id: 50,
        title: "Tab Grid",
        description: "Create a 2x2 grid in a new window tab.",
        objective: ["1. New window [c]", "2. Vertical split [%]", "3. Horizontal split [\"]", "4. Move left [ArrowLeft]", "5. Horizontal split [\"]"],
        requiredActions: ['prefix', 'c', 'prefix', '%', 'prefix', '"', 'prefix', 'ArrowLeft', 'prefix', '"'],
        hint: "Complex layout in sub-window."
      },
      {
        id: 51,
        title: "Context Swap",
        description: "Rename window 0 and window 1.",
        objective: ["1. Rename window [,]", "2. Type 'dev' + [Enter]", "3. New window [c]", "4. Rename window [,]", "5. Type 'ops' + [Enter]"],
        requiredActions: ['prefix', ',', 'Enter', 'prefix', 'c', 'prefix', ',', 'Enter'],
        hint: "Tag your workspaces."
      }
    ]
  },
  {
    id: 6,
    title: "Advanced Panes",
    levels: [
      {
        id: 52,
        title: "Rotate Panes",
        description: "Cycle pane content clockwise.",
        objective: ["1. Vertical split [%]", "2. Horizontal split [\"]", "3. Rotate panes [Ctrl + o]"],
        requiredActions: ['prefix', '%', 'prefix', '"', 'prefix', 'Control+o'],
        hint: "Ctrl + o moves content clockwise."
      },
      {
        id: 53,
        title: "Move Pane Left",
        description: "Swap the active pane to the left.",
        objective: ["1. Vertical split [%]", "2. Move pane left [{]"],
        requiredActions: ['prefix', '%', 'prefix', '{'],
        hint: "Shift + [."
      },
      {
        id: 54,
        title: "Move Pane Right",
        description: "Swap the active pane to the right.",
        objective: ["1. Vertical split [%]", "2. Move pane right [}]"],
        requiredActions: ['prefix', '%', 'prefix', '}'],
        hint: "Shift + ]."
      },
      {
        id: 55,
        title: "Toggle Layout",
        description: "Cycle built-in layouts.",
        objective: ["1. Vertical split [%]", "2. Horizontal split [\"]", "3. Toggle layout [Space]"],
        requiredActions: ['prefix', '%', 'prefix', '"', 'prefix', ' '],
        hint: "Let tmux arrange panes."
      },
      {
        id: 56,
        title: "Rotate Focus",
        description: "Rotate content then change focus.",
        objective: ["1. Vertical split [%]", "2. Horizontal split [\"]", "3. Rotate panes [Ctrl+o]", "4. Next pane [o]"],
        requiredActions: ['prefix', '%', 'prefix', '"', 'prefix', 'Control+o', 'prefix', 'o'],
        hint: "Positions change, focus stays."
      },
      {
        id: 57,
        title: "Swap & Split",
        description: "Swap left then split the new active pane.",
        objective: ["1. Vertical split [%]", "2. Move pane left [{]", "3. Vertical split [%]"],
        requiredActions: ['prefix', '%', 'prefix', '{', 'prefix', '%'],
        hint: "Content moves, you follow."
      },
      {
        id: 58,
        title: "Double Rotate",
        description: "Cycle content two steps clockwise.",
        objective: ["1. Vertical split [%]", "2. Horizontal split [\"]", "3. Rotate panes [Ctrl+o]", "4. Rotate panes [Ctrl+o]"],
        requiredActions: ['prefix', '%', 'prefix', '"', 'prefix', 'Control+o', 'prefix', 'Control+o'],
        hint: "Clockwise cycle."
      },
      {
        id: 59,
        title: "Layout Bingo",
        description: "Cycle layouts multiple times.",
        objective: ["1. Vertical split [%]", "2. Vertical split [%]", "3. Toggle layout [Space]", "4. Toggle layout [Space]"],
        requiredActions: ['prefix', '%', 'prefix', '%', 'prefix', ' ', 'prefix', ' '],
        hint: "See all modes."
      },
      {
        id: 60,
        title: "Rotate Cleanup",
        description: "Rotate then kill.",
        objective: ["1. Vertical split [%]", "2. Rotate panes [Ctrl+o]", "3. Kill pane [x]", "4. Confirm [y]"],
        requiredActions: ['prefix', '%', 'prefix', 'Control+o', 'prefix', 'x', 'y'],
        hint: "Shift then destroy."
      },
      {
        id: 61,
        title: "Advanced Loop",
        description: "Swap and rotate sequence.",
        objective: ["1. Vertical split [%]", "2. Move pane left [{]", "3. Move pane right [}]", "4. Rotate panes [Ctrl+o]"],
        requiredActions: ['prefix', '%', 'prefix', '{', 'prefix', '}', 'prefix', 'Control+o'],
        hint: "Pane juggling."
      }
    ]
  },
  {
    id: 7,
    title: "Index Jumps",
    levels: [
      {
        id: 62,
        title: "Quick Jump",
        description: "Use the index jump shortcut.",
        objective: ["1. Vertical split [%]", "2. Flash pane numbers [q]", "3. Jump to pane [0]"],
        requiredActions: ['prefix', '%', 'prefix', 'q', '0'],
        hint: "Must be fast."
      },
      {
        id: 63,
        title: "Jump to 1",
        description: "Jump directly to pane index 1.",
        objective: ["1. Vertical split [%]", "2. Flash pane numbers [q]", "3. Jump to pane [1]"],
        requiredActions: ['prefix', '%', 'prefix', 'q', '1'],
        hint: "Indices flash briefly."
      },
      {
        id: 64,
        title: "Jump & Zoom",
        description: "Jump index then maximize.",
        objective: ["1. Vertical split [%]", "2. Flash pane numbers [q]", "3. Jump to pane [1]", "4. Zoom [z]"],
        requiredActions: ['prefix', '%', 'prefix', 'q', '1', 'prefix', 'z'],
        hint: "Teleport then focus."
      },
      {
        id: 65,
        title: "Jump & Split",
        description: "Jump to 1 then split horizontal.",
        objective: ["1. Vertical split [%]", "2. Flash pane numbers [q]", "3. Jump to pane [1]", "4. Horizontal split [\"]"],
        requiredActions: ['prefix', '%', 'prefix', 'q', '1', 'prefix', '"'],
        hint: "Jump and expand."
      },
      {
        id: 66,
        title: "The Final Jump",
        description: "Jump to pane 2 in a 3-pane layout.",
        objective: ["1. Vertical split [%]", "2. Vertical split [%]", "3. Flash pane numbers [q]", "4. Jump to pane [2]"],
        requiredActions: ['prefix', '%', 'prefix', '%', 'prefix', 'q', '2'],
        hint: "Indices are 0, 1, 2."
      },
      {
        id: 67,
        title: "Dojo Mastery",
        description: "Demonstrate complete mastery of the flow.",
        objective: ["1. New window [c]", "2. Vertical split [%]", "3. Rename window [,] + 'end' + [Enter]", "4. Show clock [t]"],
        requiredActions: ['prefix', 'c', 'prefix', '%', 'prefix', ',', 'Enter', 'prefix', 't'],
        hint: "You are the Tmux Master."
      }
    ]
  }
];

export const LEVELS = LEVEL_DATA.flatMap(group => group.levels);

export const LEVEL_GROUPS = LEVEL_DATA.map(group => {
  const ids = group.levels.map(l => l.id);
  if (ids.length === 0) return null;
  return {
    id: group.id,
    title: group.title,
    range: [Math.min(...ids), Math.max(...ids)]
  };
}).filter(Boolean) as {id: number, title: string, range: [number, number]}[];
