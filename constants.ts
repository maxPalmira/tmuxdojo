
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
        title: "Double Split",
        description: "Vertical then Horizontal.",
        objective: ["1. Vertical split [%]", "2. Horizontal split [\"]"],
        requiredActions: ['prefix', '%', 'prefix', '"'],
        hint: "Each split divides the currently active pane."
      },
      {
        id: 5,
        title: "The Cross",
        description: "Horizontal then Vertical.",
        objective: ["1. Horizontal split [\"]", "2. Vertical split [%]"],
        requiredActions: ['prefix', '"', 'prefix', '%'],
        hint: "The second split happens in the bottom pane."
      },
      {
        id: 6,
        title: "Triple Column",
        description: "Three columns using only vertical splits.",
        objective: ["1. Vertical split [%]", "2. Vertical split [%]"],
        requiredActions: ['prefix', '%', 'prefix', '%'],
        hint: "Creates three vertical stripes."
      },
      {
        id: 7,
        title: "Stack O' Three",
        description: "Three rows using only horizontal splits.",
        objective: ["1. Horizontal split [\"]", "2. Horizontal split [\"]"],
        requiredActions: ['prefix', '"', 'prefix', '"'],
        hint: "Creates three horizontal rows."
      },
      {
        id: 8,
        title: "Quad Column",
        description: "Divide into four columns.",
        objective: ["1. Vertical split [%]", "2. Vertical split [%]", "3. Vertical split [%]"],
        requiredActions: ['prefix', '%', 'prefix', '%', 'prefix', '%'],
        hint: "Keep splitting vertically."
      },
      {
        id: 9,
        title: "Quad Row",
        description: "Divide into four rows.",
        objective: ["1. Horizontal split [\"]", "2. Horizontal split [\"]", "3. Horizontal split [\"]"],
        requiredActions: ['prefix', '"', 'prefix', '"', 'prefix', '"'],
        hint: "Keep splitting horizontally."
      },
      {
        id: 10,
        title: "Mixed Cascade",
        description: "A series of alternating splits.",
        objective: ["1. Vertical split [%]", "2. Horizontal split [\"]", "3. Vertical split [%]"],
        requiredActions: ['prefix', '%', 'prefix', '"', 'prefix', '%'],
        hint: "Each new pane becomes the focus for the next split."
      },
      {
        id: 11,
        title: "Grid Core",
        description: "Horizontal, Vertical, Horizontal.",
        objective: ["1. Horizontal split [\"]", "2. Vertical split [%]", "3. Horizontal split [\"]"],
        requiredActions: ['prefix', '"', 'prefix', '%', 'prefix', '"'],
        hint: "Final split is in the bottom-right corner."
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
        description: "Move focus between vertical panes.",
        objective: ["1. Vertical split [%]", "2. Move left [ArrowLeft]"],
        requiredActions: ['prefix', '%', 'prefix', 'ArrowLeft'],
        hint: "Focus starts in the right pane after splitting."
      },
      {
        id: 13,
        title: "Move Up",
        description: "Move focus between horizontal panes.",
        objective: ["1. Horizontal split [\"]", "2. Move up [ArrowUp]"],
        requiredActions: ['prefix', '"', 'prefix', 'ArrowUp'],
        hint: "Focus starts in the bottom pane after splitting."
      },
      {
        id: 14,
        title: "The Circle",
        description: "Cycle focus with [o].",
        objective: ["1. Vertical split [%]", "2. Next pane [o]"],
        requiredActions: ['prefix', '%', 'prefix', 'o'],
        hint: "o cycles through all available panes."
      },
      {
        id: 15,
        title: "Back and Forth",
        description: "Navigate a vertical split.",
        objective: ["1. Vertical split [%]", "2. Horizontal split [\"]", "3. Move left [ArrowLeft]", "4. Move right [ArrowRight]"],
        requiredActions: ['prefix', '%', 'prefix', '"', 'prefix', 'ArrowLeft', 'prefix', 'ArrowRight'],
        hint: "Return focus to the right-side panes."
      },
      {
        id: 16,
        title: "Full Cycle",
        description: "Cycle through all panes.",
        objective: ["1. Vertical split [%]", "2. Horizontal split [\"]", "3. Next pane [o]", "4. Next pane [o]", "5. Next pane [o]"],
        requiredActions: ['prefix', '%', 'prefix', '"', 'prefix', 'o', 'prefix', 'o', 'prefix', 'o'],
        hint: "Cycling eventually returns you to the start."
      },
      {
        id: 17,
        title: "High Climb",
        description: "Navigate a vertical stack.",
        objective: ["1. Horizontal split [\"]", "2. Horizontal split [\"]", "3. Move up [ArrowUp]", "4. Move up [ArrowUp]"],
        requiredActions: ['prefix', '"', 'prefix', '"', 'prefix', 'ArrowUp', 'prefix', 'ArrowUp'],
        hint: "Climb from bottom to top."
      },
      {
        id: 18,
        title: "Box Walk",
        description: "Navigate between columns.",
        objective: ["1. Vertical split [%]", "2. Move left [ArrowLeft]", "3. Horizontal split [\"]", "4. Move right [ArrowRight]"],
        requiredActions: ['prefix', '%', 'prefix', 'ArrowLeft', 'prefix', '"', 'prefix', 'ArrowRight'],
        hint: "Move from bottom-left to full-right."
      },
      {
        id: 19,
        title: "Top Corner",
        description: "Navigate to the top-left.",
        objective: ["1. Horizontal split [\"]", "2. Vertical split [%]", "3. Move up [ArrowUp]", "4. Move left [ArrowLeft]"],
        requiredActions: ['prefix', '"', 'prefix', '%', 'prefix', 'ArrowUp', 'prefix', 'ArrowLeft'],
        hint: "Jump across the layout boundaries."
      },
      {
        id: 20,
        title: "Cross Jump",
        description: "Navigate complex quadrants.",
        objective: ["1. Vertical split [%]", "2. Horizontal split [\"]", "3. Move left [ArrowLeft]", "4. Horizontal split [\"]", "5. Move up [ArrowUp]"],
        requiredActions: ['prefix', '%', 'prefix', '"', 'prefix', 'ArrowLeft', 'prefix', '"', 'prefix', 'ArrowUp'],
        hint: "Split the left side then climb."
      },
      {
        id: 21,
        title: "Deep Dive",
        description: "Navigate into a split and back out.",
        objective: ["1. Horizontal split [\"]", "2. Move up [ArrowUp]", "3. Vertical split [%]", "4. Move down [ArrowDown]"],
        requiredActions: ['prefix', '"', 'prefix', 'ArrowUp', 'prefix', '%', 'prefix', 'ArrowDown'],
        hint: "Move from top-right to bottom."
      }
    ]
  },
  {
    id: 3,
    title: "Utilities",
    levels: [
      {
        id: 22,
        title: "Toggle zoom",
        description: "Maximize a pane to full screen.",
        objective: ["1. Vertical split [%]", "2. Toggle zoom [z]"],
        requiredActions: ['prefix', '%', 'prefix', 'z'],
        hint: "z toggles full screen."
      },
      {
        id: 23,
        title: "Show Clock",
        description: "Display a digital clock.",
        objective: ["1. Prefix [Ctrl + b]", "2. Show clock [t]", "3. Hide clock [Esc]"],
        requiredActions: ['prefix', 't', 'Escape'],
        hint: "Only Escape dismisses the clock UI."
      },
      {
        id: 24,
        title: "Identify",
        description: "Flash pane numbers briefly.",
        objective: ["1. Vertical split [%]", "2. Flash pane numbers [q]"],
        requiredActions: ['prefix', '%', 'prefix', 'q'],
        hint: "Numbers show creation order."
      },
      {
        id: 25,
        title: "Zoom & Check",
        description: "Zoom, check time, then zoom to unzoom.",
        objective: ["1. Vertical split [%]", "2. Toggle zoom [z]", "3. Show clock [t]", "4. Toggle zoom [z]"],
        requiredActions: ['prefix', '%', 'prefix', 'z', 'prefix', 't', 'prefix', 'z'],
        hint: "Zoom is a toggle."
      },
      {
        id: 26,
        title: "Multi-Clock",
        description: "Clocks in different panes.",
        objective: ["1. Vertical split [%]", "2. Show clock [t]", "3. Move left [ArrowLeft]", "4. Show clock [t]"],
        requiredActions: ['prefix', '%', 'prefix', 't', 'prefix', 'ArrowLeft', 'prefix', 't'],
        hint: "Clocks remain until dismissed per pane."
      },
      {
        id: 27,
        title: "Identify Move",
        description: "Flash numbers then move right.",
        objective: ["1. Vertical split [%]", "2. Move left [ArrowLeft]", "3. Flash pane numbers [q]", "4. Move right [ArrowRight]"],
        requiredActions: ['prefix', '%', 'prefix', 'ArrowLeft', 'prefix', 'q', 'prefix', 'ArrowRight'],
        hint: "Index 0 is left, Index 1 is right."
      },
      {
        id: 28,
        title: "Zoom Navigation",
        description: "Zoom, unzoom, then move.",
        objective: ["1. Vertical split [%]", "2. Toggle zoom [z]", "3. Toggle zoom [z]", "4. Move left [ArrowLeft]"],
        requiredActions: ['prefix', '%', 'prefix', 'z', 'prefix', 'z', 'prefix', 'ArrowLeft'],
        hint: "Unzoom is just another Toggle zoom [z] command."
      },
      {
        id: 29,
        title: "Utility Flow",
        description: "Clock, Hide, Zoom, Unzoom.",
        objective: ["1. Show clock [t]", "2. Hide clock [Esc]", "3. Toggle zoom [z]", "4. Toggle zoom [z]"],
        requiredActions: ['prefix', 't', 'Escape', 'prefix', 'z', 'prefix', 'z'],
        hint: "Speedrun utility keys."
      },
      {
        id: 30,
        title: "Identify Jump",
        description: "Flash indices and cycle.",
        objective: ["1. Vertical split [%]", "2. Horizontal split [\"]", "3. Flash pane numbers [q]", "4. Next pane [o]"],
        requiredActions: ['prefix', '%', 'prefix', '"', 'prefix', 'q', 'prefix', 'o'],
        hint: "Visualize then move."
      },
      {
        id: 31,
        title: "Big Picture",
        description: "Zoom a specific side.",
        objective: ["1. Vertical split [%]", "2. Move left [ArrowLeft]", "3. Toggle zoom [z]"],
        requiredActions: ['prefix', '%', 'prefix', 'ArrowLeft', 'prefix', 'z'],
        hint: "Zoom focus follows active pane."
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
        hint: "c is for create."
      },
      {
        id: 33,
        title: "Previous Window",
        description: "Cycle to the previous tab.",
        objective: ["1. New window [c]", "2. Previous window [p]"],
        requiredActions: ['prefix', 'c', 'prefix', 'p'],
        hint: "p is for previous."
      },
      {
        id: 34,
        title: "Next Window",
        description: "Cycle to the next tab.",
        objective: ["1. New window [c]", "2. Previous window [p]", "3. Next window [n]"],
        requiredActions: ['prefix', 'c', 'prefix', 'p', 'prefix', 'n'],
        hint: "n is for next."
      },
      {
        id: 35,
        title: "Jump to 0",
        description: "Jump using window index digits.",
        objective: ["1. New window [c]", "2. Jump to 0 [0]"],
        requiredActions: ['prefix', 'c', 'prefix', '0'],
        hint: "Prefix then a number jumps to that tab."
      },
      {
        id: 36,
        title: "Jump to 1",
        description: "Jump back after switching.",
        objective: ["1. New window [c]", "2. Previous window [p]", "3. Jump to 1 [1]"],
        requiredActions: ['prefix', 'c', 'prefix', 'p', 'prefix', '1'],
        hint: "Direct jumping is faster than cycling."
      },
      {
        id: 37,
        title: "Kill Window",
        description: "Destroy a window tab.",
        objective: ["1. New window [c]", "2. Kill window [&]", "3. Confirm [y]"],
        requiredActions: ['prefix', 'c', 'prefix', '&', 'y'],
        hint: "Shift + 7 for &."
      },
      {
        id: 38,
        title: "Window Stacking",
        description: "Create three windows.",
        objective: ["1. New window [c]", "2. New window [c]", "3. Jump to 0 [0]"],
        requiredActions: ['prefix', 'c', 'prefix', 'c', 'prefix', '0'],
        hint: "Keep track of your indices."
      },
      {
        id: 39,
        title: "Fast Switching",
        description: "Cycle and Jump combo.",
        objective: ["1. New window [c]", "2. Next window [n]", "3. Jump to 0 [0]"],
        requiredActions: ['prefix', 'c', 'prefix', 'n', 'prefix', '0'],
        hint: "Switching flow."
      },
      {
        id: 40,
        title: "Window List",
        description: "Open window list and select current.",
        objective: ["1. New window [c]", "2. List windows [w]", "3. Select [Enter]"],
        requiredActions: ['prefix', 'c', 'prefix', 'w', 'Enter'],
        hint: "w opens a visual picker."
      },
      {
        id: 41,
        title: "The Strategic Selector",
        description: "Renaming tabs makes list navigation powerful. Find your lost home.",
        objective: ["1. New window [c]", "2. Rename window [,] + 'dev' + [Enter]", "3. New window [c]", "4. List windows [w]", "5. Select window 'dev' [Enter]"],
        requiredActions: ['prefix', 'c', 'prefix', ',', 'Enter', 'prefix', 'c', 'prefix', 'w', 'Enter'],
        hint: "Rename your first new window to 'dev', create another, then select 'dev' in the list."
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
        description: "Name your active tab.",
        objective: ["1. Rename window [,]", "2. Type 'logs' + [Enter]"],
        requiredActions: ['prefix', ',', 'Enter'],
        hint: "Type the name exactly and hit Enter."
      },
      {
        id: 43,
        title: "Split Windows",
        description: "Panes within a new window.",
        objective: ["1. New window [c]", "2. Vertical split [%]"],
        requiredActions: ['prefix', 'c', 'prefix', '%'],
        hint: "Each window has its own layout state."
      },
      {
        id: 44,
        title: "The Context Sweep",
        description: "Create, rename, next.",
        objective: ["1. New window [c]", "2. Rename window [,]", "3. Next window [n]"],
        requiredActions: ['prefix', 'c', 'prefix', ',', 'Enter', 'prefix', 'n'],
        hint: "Organize as you go."
      },
      {
        id: 45,
        title: "Window Lifecycle",
        description: "Create, Rename, then Kill.",
        objective: ["1. New window [c]", "2. Rename window [,]", "3. Type 'tmp' + [Enter]", "4. Kill window [&]", "5. Confirm [y]"],
        requiredActions: ['prefix', 'c', 'prefix', ',', 'Enter', 'prefix', '&', 'y'],
        hint: "Manage ephemeral tabs."
      },
      {
        id: 46,
        title: "Jump Rename",
        description: "Jump to 0 then rename.",
        objective: ["1. New window [c]", "2. Jump to 0 [0]", "3. Rename window [,]"],
        requiredActions: ['prefix', 'c', 'prefix', '0', 'prefix', ','],
        hint: "Jump and modify."
      },
      {
        id: 47,
        title: "List Select Rename",
        description: "Select 0 from list then rename.",
        objective: ["1. New window [c]", "2. List windows [w]", "3. Move up [ArrowUp]", "4. Select [Enter]", "5. Rename window [,]"],
        requiredActions: ['prefix', 'c', 'prefix', 'w', 'ArrowUp', 'Enter', 'prefix', ','],
        hint: "Pick and rename."
      },
      {
        id: 48,
        title: "Triple Tab Move",
        description: "Move through 3 named tabs.",
        objective: ["1. New [c]", "2. New [c]", "3. Previous [p]", "4. Previous [p]"],
        requiredActions: ['prefix', 'c', 'prefix', 'c', 'prefix', 'p', 'prefix', 'p'],
        hint: "Cycle backwards."
      },
      {
        id: 49,
        title: "Fast Cleanup",
        description: "Kill, cycle, kill.",
        objective: ["1. New [c]", "2. Kill [&]", "3. Confirm [y]", "4. Kill [&]", "5. Confirm [y]"],
        requiredActions: ['prefix', 'c', 'prefix', '&', 'y', 'prefix', '&', 'y'],
        hint: "Quick session clearing."
      },
      {
        id: 50,
        title: "The Work Context",
        description: "Split and Zoom in a new window.",
        objective: ["1. New [c]", "2. Vertical split [%]", "3. Toggle zoom [z]"],
        requiredActions: ['prefix', 'c', 'prefix', '%', 'prefix', 'z'],
        hint: "Focus in your new tab."
      },
      {
        id: 51,
        title: "Naming Speed",
        description: "Rename window 0 to 'dev', rename 1 to 'ops'.",
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
        hint: "Ctrl + o shifts content clockwise."
      },
      {
        id: 53,
        title: "Move Pane Left",
        description: "Swap current pane to the left.",
        objective: ["1. Vertical split [%]", "2. Move pane left [{]"],
        requiredActions: ['prefix', '%', 'prefix', '{'],
        hint: "Shift + [ for {."
      },
      {
        id: 54,
        title: "Move Pane Right",
        description: "Swap current pane to the right.",
        objective: ["1. Vertical split [%]", "2. Move pane right [}]"],
        requiredActions: ['prefix', '%', 'prefix', '}'],
        hint: "Shift + ] for }."
      },
      {
        id: 55,
        title: "Toggle Layout",
        description: "Cycle built-in layouts.",
        objective: ["1. Vertical split [%]", "2. Horizontal split [\"]", "3. Toggle layout [Space]"],
        requiredActions: ['prefix', '%', 'prefix', '"', 'prefix', ' '],
        hint: "Spacebar cycles preset grid layouts."
      },
      {
        id: 56,
        title: "Rotate Focus",
        description: "Rotate content then cycle focus.",
        objective: ["1. Vertical split [%]", "2. Horizontal split [\"]", "3. Rotate panes [Ctrl+o]", "4. Next pane [o]"],
        requiredActions: ['prefix', '%', 'prefix', '"', 'prefix', 'Control+o', 'prefix', 'o'],
        hint: "Rotate changes positions, not focus."
      },
      {
        id: 57,
        title: "Swap & Split",
        description: "Move pane then divide it.",
        objective: ["1. Vertical split [%]", "2. Move pane left [{]", "3. Vertical split [%]"],
        requiredActions: ['prefix', '%', 'prefix', '{', 'prefix', '%'],
        hint: "Move your workspace."
      },
      {
        id: 58,
        title: "Double Rotate",
        description: "Two-step rotation.",
        objective: ["1. Vertical split [%]", "2. Horizontal split [\"]", "3. Rotate panes [Ctrl+o]", "4. Rotate panes [Ctrl+o]"],
        requiredActions: ['prefix', '%', 'prefix', '"', 'prefix', 'Control+o', 'prefix', 'Control+o'],
        hint: "Cycle all content."
      },
      {
        id: 59,
        title: "Layout Bingo",
        description: "Check different grid styles.",
        objective: ["1. Vertical split [%]", "2. Vertical split [%]", "3. Toggle layout [Space]", "4. Toggle layout [Space]"],
        requiredActions: ['prefix', '%', 'prefix', '%', 'prefix', ' ', 'prefix', ' '],
        hint: "Tmux finds the best fit."
      },
      {
        id: 60,
        title: "Rotate Cleanup",
        description: "Rotate then kill the result.",
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
        hint: "Pane juggling mastery."
      }
    ]
  },
  {
    id: 7,
    title: "Index Jumps",
    levels: [
      {
        id: 62,
        title: "Quick Jump 0",
        description: "Identify and jump to 0.",
        objective: ["1. Vertical split [%]", "2. Flash pane numbers [q]", "3. Jump to pane [0]"],
        requiredActions: ['prefix', '%', 'prefix', 'q', '0'],
        hint: "Prefix, q, then digit."
      },
      {
        id: 63,
        title: "Home Base Jump",
        description: "Teleport from the far side back to 0 in a triple layout.",
        objective: ["1. Vertical split [%]", "2. Vertical split [%]", "3. Flash numbers [q]", "4. Jump to pane [0]"],
        requiredActions: ['prefix', '%', 'prefix', '%', 'prefix', 'q', '0'],
        hint: "Jump across two vertical boundaries to the first pane."
      },
      {
        id: 64,
        title: "Jump & Focus",
        description: "Teleport then maximize workspace.",
        objective: ["1. Vertical split [%]", "2. Flash numbers [q]", "3. Jump to pane [0]", "4. Toggle zoom [z]"],
        requiredActions: ['prefix', '%', 'prefix', 'q', '0', 'prefix', 'z'],
        hint: "Move from 1 to 0 and immediately zoom."
      },
      {
        id: 65,
        title: "Remote Division",
        description: "Teleport focus specifically to divide a remote pane.",
        objective: ["1. Vertical split [%]", "2. Vertical split [%]", "3. Move left [ArrowLeft]", "4. Move left [ArrowLeft]", "5. Flash numbers [q]", "6. Jump to pane [1]", "7. Horizontal split [\"]"],
        requiredActions: ['prefix', '%', 'prefix', '%', 'prefix', 'ArrowLeft', 'prefix', 'ArrowLeft', 'prefix', 'q', '1', 'prefix', '"'],
        hint: "Jump from the start (0) into the middle (1) then split it."
      },
      {
        id: 66,
        title: "Diagonal Teleport",
        description: "Navigate a complex 2x2 grid by ID jump.",
        objective: ["1. Vertical split [%]", "2. Horizontal split [\"]", "3. Move left [ArrowLeft]", "4. Horizontal split [\"]", "5. Flash numbers [q]", "6. Jump to pane [2]"],
        requiredActions: ['prefix', '%', 'prefix', '"', 'prefix', 'ArrowLeft', 'prefix', '"', 'prefix', 'q', '2'],
        hint: "Jump from the bottom-left (3) to the bottom-right (2)."
      },
      {
        id: 67,
        title: "Dojo Mastery",
        description: "The ultimate Tmux flow.",
        objective: ["1. New window [c]", "2. Vertical split [%]", "3. Rename window [,] + 'end' + [Enter]", "4. Show clock [t]"],
        requiredActions: ['prefix', 'c', 'prefix', '%', 'prefix', ',', 'Enter', 'prefix', 't'],
        hint: "You have mastered the Dojo."
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
