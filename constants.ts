
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
        commandsCovered: [],
        hint: "Focus the terminal and press [Space]."
      },
      {
        id: 1,
        title: "The Prefix",
        description: "Your lifeblood is the Prefix. [Ctrl + b].\nPractice activating it.",
        objective: "1. Prefix [Ctrl + b]",
        requiredActions: ['prefix'],
        commandsCovered: ['Ctrl+b'],
        hint: "Hold Ctrl and tap b. Look for the 'PREFIX' indicator in the status bar."
      },
      {
        id: 2,
        title: "Prefix Refresh",
        description: "Prefix commands must be re-armed for every action.\nPractice arming it twice.",
        objective: ["1. Prefix [Ctrl + b]", "2. Prefix [Ctrl + b]"],
        requiredActions: ['prefix', 'prefix'],
        commandsCovered: ['Ctrl+b'],
        hint: "Prefix, wait a beat, Prefix again."
      },
      {
        id: 3,
        title: "The Layout Space",
        description: "The [Space] key cycles through layouts after a prefix.",
        objective: ["1. Prefix [Ctrl + b]", "2. Toggle Layout [Space]"],
        requiredActions: ['prefix', ' '],
        commandsCovered: ['Ctrl+b Space'],
        hint: "Prefix then Spacebar."
      },
      {
        id: 4,
        title: "Utility Entry",
        description: "Open the clock to see the time.",
        objective: ["1. Prefix [Ctrl + b]", "2. Clock [t]"],
        requiredActions: ['prefix', 't'],
        commandsCovered: ['Ctrl+b t'],
        hint: "Prefix then 't' for time."
      },
      {
        id: 5,
        title: "Dojo Reset",
        description: "To reset any level quickly, tap [d] twice in rapid succession.",
        objective: ["1. Tap [d]", "2. Tap [d]"],
        requiredActions: ['d', 'd'],
        commandsCovered: ['d d'],
        hint: "Rapid double-tap 'd'. This is a Dojo special command, not native tmux."
      }
    ]
  },
  {
    id: 1,
    title: "The Splits",
    levels: [
      {
        id: 6,
        title: "Vertical Cut",
        description: "Divide the screen vertically.",
        objective: ["1. Prefix [Ctrl + b]", "2. Split Vertically [%]"],
        requiredActions: ['prefix', '%'],
        commandsCovered: ['Ctrl+b %'],
        hint: "Hold [Ctrl], press [b], then release and press [%]."
      },
      {
        id: 7,
        title: "Horizontal Cut",
        description: "Divide the screen horizontally.",
        objective: ["1. Prefix [Ctrl + b]", "2. Split Horizontally [\"]"],
        requiredActions: ['prefix', '"'],
        commandsCovered: ['Ctrl+b "'],
        hint: "Prefix then [Shift] + ['] for [\"]"
      },
      {
        id: 8,
        title: "The Cross",
        description: "Create a 2x2 grid.",
        objective: ["1. Split Vertically [%]", "2. Split Horizontally [\"]"],
        requiredActions: ['prefix', '%', 'prefix', '"'],
        commandsCovered: ['Ctrl+b %', 'Ctrl+b "'],
        hint: "Prefix each command individually."
      },
      {
        id: 9,
        title: "Kill Pane",
        description: "Close current pane with [x]. Confirm with [y].",
        objective: ["1. Split Vertically [%]", "2. Kill Pane [x]", "3. Confirm [y]"],
        requiredActions: ['prefix', '%', 'prefix', 'x', 'y'],
        commandsCovered: ['Ctrl+b x'],
        hint: "Prefix, x, then y to confirm. Pane closure is permanent."
      },
      {
        id: 10,
        title: "Deep Split",
        description: "Make three vertical stripes.",
        objective: ["1. Split Vertically [%]", "2. Split Vertically [%]"],
        requiredActions: ['prefix', '%', 'prefix', '%'],
        commandsCovered: ['Ctrl+b %'],
        hint: "Splits always divide the *active* pane."
      },
      {
        id: 11,
        title: "Split Symmetry",
        description: "Horizontal split, move down, then horizontal again.",
        objective: ["1. Split Horizontally [\"]", "2. Move Down [ArrowDown]", "3. Split Horizontally [\"]"],
        requiredActions: ['prefix', '"', 'prefix', 'ArrowDown', 'prefix', '"'],
        commandsCovered: ['Ctrl+b "', 'Ctrl+b Arrows'],
        hint: "Remember to re-prefix for navigation too."
      },
      {
        id: 12,
        title: "The Tower",
        description: "Stack three horizontal panes.",
        objective: ["1. Split Horizontally [\"]", "2. Split Horizontally [\"]"],
        requiredActions: ['prefix', '"', 'prefix', '"'],
        commandsCovered: ['Ctrl+b "'],
        hint: "Divides current row."
      },
      {
        id: 13,
        title: "Cleanup Combo",
        description: "Create a split then kill it immediately.",
        objective: ["1. Split Vertically [%]", "2. Kill Pane [x]", "3. Confirm [y]"],
        requiredActions: ['prefix', '%', 'prefix', 'x', 'y'],
        commandsCovered: ['Ctrl+b %', 'Ctrl+b x'],
        hint: "Fast re-prefixing is key."
      },
      {
        id: 14,
        title: "Quad Cut",
        description: "2x2 via 3 splits.",
        objective: ["1. Split Horizontally [\"]", "2. Split Vertically [%]", "3. Move Up [ArrowUp]", "4. Split Vertically [%]"],
        requiredActions: ['prefix', '"', 'prefix', '%', 'prefix', 'ArrowUp', 'prefix', '%'],
        commandsCovered: ['Ctrl+b %', 'Ctrl+b "', 'Ctrl+b Arrows'],
        hint: "Split the top row, move down, split the bottom."
      }
    ]
  },
  {
    id: 2,
    title: "Navigation",
    levels: [
      {
        id: 15,
        title: "Step Left",
        description: "Navigate between panes.",
        objective: ["1. Split Vertically [%]", "2. Move Left [ArrowLeft]"],
        requiredActions: ['prefix', '%', 'prefix', 'ArrowLeft'],
        commandsCovered: ['Ctrl+b Arrows'],
        hint: "Arrows are the standard way to hop."
      },
      {
        id: 16,
        title: "The Circle",
        description: "Navigate a grid.",
        objective: [
          "1. Split Vertically [%]", 
          "2. Split Horizontally [\"]", 
          "3. Move Left [ArrowLeft]",
          "4. Move Right [ArrowRight]"
        ],
        requiredActions: ['prefix', '%', 'prefix', '"', 'prefix', 'ArrowLeft', 'prefix', 'ArrowRight'],
        commandsCovered: ['Ctrl+b Arrows'],
        hint: "Arrows follow physical layout."
      },
      {
        id: 17,
        title: "Next Pane",
        description: "Cycle through panes with [o].",
        objective: ["1. Split Vertically [%]", "2. Next Pane [o]"],
        requiredActions: ['prefix', '%', 'prefix', 'o'],
        commandsCovered: ['Ctrl+b o'],
        hint: "o cycles in creation order."
      },
      {
        id: 18,
        title: "Cycle Loop",
        description: "Create 3 panes and cycle twice.",
        objective: ["1. Split Vertically [%]", "2. Split Horizontally [\"]", "3. Cycle [o]", "4. Cycle [o]"],
        requiredActions: ['prefix', '%', 'prefix', '"', 'prefix', 'o', 'prefix', 'o'],
        commandsCovered: ['Ctrl+b o'],
        hint: "o is faster than arrows for many panes."
      },
      {
        id: 19,
        title: "Up and Out",
        description: "Split horizontal, move up, then right.",
        objective: ["1. Split Horizontally [\"]", "2. Move Up [ArrowUp]", "3. Split Vertically [%]", "4. Move Right [ArrowRight]"],
        requiredActions: ['prefix', '"', 'prefix', 'ArrowUp', 'prefix', '%', 'prefix', 'ArrowRight'],
        commandsCovered: ['Ctrl+b Arrows', 'Ctrl+b %'],
        hint: "Complex movement through the tree."
      },
      {
        id: 20,
        title: "Snake Path",
        description: "Navigate a vertical stack using up and down.",
        objective: ["1. Split Horizontally [\"]", "2. Split Horizontally [\"]", "3. Move Up [ArrowUp]", "4. Move Up [ArrowUp]"],
        requiredActions: ['prefix', '"', 'prefix', '"', 'prefix', 'ArrowUp', 'prefix', 'ArrowUp'],
        commandsCovered: ['Ctrl+b Arrows'],
        hint: "Climb the tower."
      },
      {
        id: 21,
        title: "Focus Shift",
        description: "Split, move away, move back.",
        objective: ["1. Split Vertically [%]", "2. Move Left [ArrowLeft]", "3. Move Right [ArrowRight]"],
        requiredActions: ['prefix', '%', 'prefix', 'ArrowLeft', 'prefix', 'ArrowRight'],
        commandsCovered: ['Ctrl+b Arrows'],
        hint: "Maintain spatial awareness."
      }
    ]
  },
  {
    id: 3,
    title: "Utilities",
    levels: [
      {
        id: 22,
        title: "Zoom State",
        description: "Maximize a pane.",
        objective: ["1. Split Vertically [%]", "2. Zoom Pane [z]"],
        requiredActions: ['prefix', '%', 'prefix', 'z'],
        commandsCovered: ['Ctrl+b z'],
        hint: "z to zoom, z to unzoom."
      },
      {
        id: 23,
        title: "Time Check",
        description: "Digital clock in pane. Any key exits clock mode.",
        objective: [
          "1. Split Vertically [%]",
          "2. Show Clock [t]", 
          "3. Hide Clock [Esc]"
        ],
        requiredActions: ['prefix', '%', 'prefix', 't', 'Escape'],
        commandsCovered: ['Ctrl+b t', 'Escape'],
        hint: "Escape is the safest way to leave utilities."
      },
      {
        id: 24,
        title: "Identify",
        description: "Flash pane indices with [q].",
        objective: [
          "1. Split Vertically [%]", 
          "2. Split Horizontally [\"]", 
          "3. Flash Pane Numbers [q]"
        ],
        requiredActions: ['prefix', '%', 'prefix', '"', 'prefix', 'q'],
        commandsCovered: ['Ctrl+b q'],
        hint: "Useful when you have too many panes."
      },
      {
        id: 25,
        title: "Zoom & Check",
        description: "Zoom a pane then show the clock.",
        objective: ["1. Split Vertically [%]", "2. Zoom [z]", "3. Clock [t]", "4. Hide [Esc]"],
        requiredActions: ['prefix', '%', 'prefix', 'z', 'prefix', 't', 'Escape'],
        commandsCovered: ['Ctrl+b z', 'Ctrl+b t'],
        hint: "Zoom doesn't block utilities."
      },
      {
        id: 26,
        title: "Multi-Clock",
        description: "Show clocks in two different panes.",
        objective: ["1. Split Vertically [%]", "2. Clock [t]", "3. Move Right [ArrowRight]", "4. Clock [t]"],
        requiredActions: ['prefix', '%', 'prefix', 't', 'prefix', 'ArrowRight', 'prefix', 't'],
        commandsCovered: ['Ctrl+b t'],
        hint: "Clocks stay visible until dismissed manually."
      },
      {
        id: 27,
        title: "Identify Move",
        description: "Flash indices then navigate to pane 1.",
        objective: ["1. Split Vertically [%]", "2. Flash [q]", "3. Move Right [ArrowRight]"],
        requiredActions: ['prefix', '%', 'prefix', 'q', 'prefix', 'ArrowRight'],
        commandsCovered: ['Ctrl+b q', 'Ctrl+b Arrows'],
        hint: "Observe the numbers, then move."
      },
      {
        id: 28,
        title: "Big Picture",
        description: "Split, split, zoom.",
        objective: ["1. Split Vertically [%]", "2. Split Horizontally [\"]", "3. Zoom [z]"],
        requiredActions: ['prefix', '%', 'prefix', '"', 'prefix', 'z'],
        commandsCovered: ['Ctrl+b z'],
        hint: "Focus on one part of the grid."
      },
      {
        id: 29,
        title: "Utility Loop",
        description: "Clock, hide, zoom, unzoom.",
        objective: ["1. Clock [t]", "2. Hide [Esc]", "3. Zoom [z]", "4. Unzoom [z]"],
        requiredActions: ['prefix', 't', 'Escape', 'prefix', 'z', 'prefix', 'z'],
        commandsCovered: ['Ctrl+b t', 'Ctrl+b z'],
        hint: "Speedrun utility keys."
      }
    ]
  },
  {
    id: 4,
    title: "Windows",
    levels: [
      {
        id: 30,
        title: "New Window",
        description: "Create a new window tab with [c].",
        objective: ["1. New Window [c]"],
        requiredActions: ['prefix', 'c'],
        commandsCovered: ['Ctrl+b c'],
        hint: "Check the status bar for a new tab."
      },
      {
        id: 31,
        title: "Cycling",
        description: "Move between tabs with [n] and [p].",
        objective: [
          "1. New Window [c]",
          "2. Previous Window [p]",
          "3. Next Window [n]"
        ],
        requiredActions: ['prefix', 'c', 'prefix', 'p', 'prefix', 'n'],
        commandsCovered: ['Ctrl+b n', 'Ctrl+b p'],
        hint: "n for next, p for previous."
      },
      {
        id: 32,
        title: "Kill Window",
        description: "Kill whole window with [&]. Confirm with [y].",
        objective: [
          "1. New Window [c]",
          "2. Kill Window [&]",
          "3. Confirm [y]"
        ],
        requiredActions: ['prefix', 'c', 'prefix', '&', 'y'],
        commandsCovered: ['Ctrl+b &'],
        hint: "Closes the entire tab and all its panes."
      },
      {
        id: 33,
        title: "Direct Jump 0",
        description: "Jump to window 0 with [0].",
        objective: ["1. New Window [c]", "2. Jump to 0 [0]"],
        requiredActions: ['prefix', 'c', 'prefix', '0'],
        commandsCovered: ['Ctrl+b <digit>'],
        hint: "Prefix then the index number."
      },
      {
        id: 34,
        title: "Direct Jump 1",
        description: "Jump to window 1 with [1].",
        objective: ["1. New Window [c]", "2. Previous [p]", "3. Jump to 1 [1]"],
        requiredActions: ['prefix', 'c', 'prefix', 'p', 'prefix', '1'],
        commandsCovered: ['Ctrl+b <digit>'],
        hint: "Prefix then '1'."
      },
      {
        id: 35,
        title: "Tab Management",
        description: "Three windows, cycle backwards.",
        objective: ["1. New Window [c]", "2. New Window [c]", "3. Previous [p]", "4. Previous [p]"],
        requiredActions: ['prefix', 'c', 'prefix', 'c', 'prefix', 'p', 'prefix', 'p'],
        commandsCovered: ['Ctrl+b c', 'Ctrl+b p'],
        hint: "Navigate your tab stack."
      },
      {
        id: 36,
        title: "Window Cleanup",
        description: "Create two, kill one.",
        objective: ["1. New Window [c]", "2. Kill Window [&]", "3. Confirm [y]"],
        requiredActions: ['prefix', 'c', 'prefix', '&', 'y'],
        commandsCovered: ['Ctrl+b &'],
        hint: "Keep your session tidy."
      },
      {
        id: 37,
        title: "Fast Switching",
        description: "n, n, p, n.",
        objective: ["1. New Window [c]", "2. New Window [c]", "3. Next [n]", "4. Previous [p]", "5. Next [n]"],
        requiredActions: ['prefix', 'c', 'prefix', 'c', 'prefix', 'n', 'prefix', 'p', 'prefix', 'n'],
        commandsCovered: ['Ctrl+b n', 'Ctrl+b p'],
        hint: "Cycle through your open tasks."
      }
    ]
  },
  {
    id: 5,
    title: "Pro Windows",
    levels: [
      {
        id: 38,
        title: "Advanced Utilities",
        description: "Window 1 split and clock.",
        objective: [
          "1. New Window [c]",
          "2. Split Vertically [%]",
          "3. Show Clock [t]"
        ],
        requiredActions: ['prefix', 'c', 'prefix', '%', 'prefix', 't'],
        commandsCovered: ['Ctrl+b %', 'Ctrl+b t'],
        hint: "Clock mode is window and pane-specific."
      },
      {
        id: 39,
        title: "Rename Window",
        description: "Use [,] to rename. Type 'logs' and Enter.",
        objective: [
          "1. Rename Window [,]",
          "2. Type 'logs' and hit [Enter]"
        ],
        requiredActions: ['prefix', ',', 'Enter'],
        commandsCovered: ['Ctrl+b ,'],
        hint: "Type the name exactly and press Enter."
      },
      {
        id: 40,
        title: "List Windows",
        description: "Visual picker with [w]. Select current.",
        objective: ["1. List Windows [w]", "2. Select [Enter]"],
        requiredActions: ['prefix', 'w', 'Enter'],
        commandsCovered: ['Ctrl+b w'],
        hint: "Focus the list and press Enter."
      },
      {
        id: 41,
        title: "List & Select",
        description: "Navigate window list.",
        objective: ["1. New Window [c]", "2. List [w]", "3. Down [ArrowDown]", "4. Select [Enter]"],
        requiredActions: ['prefix', 'c', 'prefix', 'w', 'ArrowDown', 'Enter'],
        commandsCovered: ['Ctrl+b w'],
        hint: "Use arrows in the window list."
      },
      {
        id: 42,
        title: "Rename Jump",
        description: "Rename window, create new, jump back.",
        objective: ["1. Rename [,]", "2. Type 'logs' + [Enter]", "3. New [c]", "4. Jump 0 [0]"],
        requiredActions: ['prefix', ',', 'Enter', 'prefix', 'c', 'prefix', '0'],
        commandsCovered: ['Ctrl+b ,', 'Ctrl+b c', 'Ctrl+b 0'],
        hint: "Combine tab management with naming."
      },
      {
        id: 43,
        title: "List Kill",
        description: "List then kill.",
        objective: ["1. New Window [c]", "2. List [w]", "3. Select [Enter]", "4. Kill [&]", "5. Confirm [y]"],
        requiredActions: ['prefix', 'c', 'prefix', 'w', 'Enter', 'prefix', '&', 'y'],
        commandsCovered: ['Ctrl+b w', 'Ctrl+b &'],
        hint: "Find it, then destroy it."
      },
      {
        id: 44,
        title: "Naming Speed",
        description: "Rename to 'srv', then 'dev'.",
        objective: ["1. Rename [,]", "2. Type 'srv' + [Enter]", "3. Rename [,]", "4. Type 'dev' + [Enter]"],
        requiredActions: ['prefix', ',', 'Enter', 'prefix', ',', 'Enter'],
        commandsCovered: ['Ctrl+b ,'],
        hint: "Renaming works anytime."
      },
      {
        id: 45,
        title: "Window Sweep",
        description: "Create, rename, kill.",
        objective: ["1. New [c]", "2. Rename [,]", "3. Type 'temp' + [Enter]", "4. Kill [&]", "5. Confirm [y]"],
        requiredActions: ['prefix', 'c', 'prefix', ',', 'Enter', 'prefix', '&', 'y'],
        commandsCovered: ['Ctrl+b c', 'Ctrl+b ,', 'Ctrl+b &'],
        hint: "Pro tab lifecycle."
      }
    ]
  },
  {
    id: 6,
    title: "Advanced Panes",
    levels: [
      {
        id: 46,
        title: "Rotate Panes",
        description: "Shift all panes clockwise with [Ctrl + o].",
        objective: [
          "1. Split Vertically [%]",
          "2. Split Horizontally [\"]",
          "3. Rotate Panes [Ctrl + o]"
        ],
        requiredActions: ['prefix', '%', 'prefix', '"', 'prefix', 'Control+o'],
        commandsCovered: ['Ctrl+b Ctrl+o'],
        hint: "Must keep Ctrl held for 'o' after the prefix."
      },
      {
        id: 47,
        title: "Move Panes",
        description: "Swap current pane left or right with [{] and [}].",
        objective: [
          "1. Split Vertically [%]",
          "2. Move Pane Left [{]"
        ],
        requiredActions: ['prefix', '%', 'prefix', '{'],
        commandsCovered: ['Ctrl+b {'],
        hint: "Shift + [ for {"
      },
      {
        id: 48,
        title: "Toggle Layout",
        description: "Cycle layouts with [Space].",
        objective: [
          "1. Split Vertically [%]",
          "2. Split Horizontally [\"]",
          "3. Toggle [Space]"
        ],
        requiredActions: ['prefix', '%', 'prefix', '"', 'prefix', ' '],
        commandsCovered: ['Ctrl+b Space'],
        hint: "Tmux auto-arranges panes for you."
      },
      {
        id: 49,
        title: "Rotate Focus",
        description: "Rotate and then change focus.",
        objective: ["1. Split Vertically [%]", "2. Split Horizontally [\"]", "3. Rotate [Ctrl+o]", "4. Cycle Focus [o]"],
        requiredActions: ['prefix', '%', 'prefix', '"', 'prefix', 'Control+o', 'prefix', 'o'],
        commandsCovered: ['Ctrl+b Ctrl+o', 'Ctrl+b o'],
        hint: "Rotate doesn't move focus."
      },
      {
        id: 50,
        title: "Swap & Split",
        description: "Swap left then split the new active.",
        objective: ["1. Split Vertically [%]", "2. Swap [{]", "3. Split Horizontally [\"]"],
        requiredActions: ['prefix', '%', 'prefix', '{', 'prefix', '"'],
        commandsCovered: ['Ctrl+b {', 'Ctrl+b "'],
        hint: "Moving content moves your workspace."
      },
      {
        id: 51,
        title: "Layout Bingo",
        description: "Three splits and toggle layout twice.",
        objective: ["1. Split [%]", "2. Split [%]", "3. Toggle [Space]", "4. Toggle [Space]"],
        requiredActions: ['prefix', '%', 'prefix', '%', 'prefix', ' ', 'prefix', ' '],
        commandsCovered: ['Ctrl+b Space'],
        hint: "See the different grid styles."
      },
      {
        id: 52,
        title: "Spiral Swap",
        description: "Rotate then swap right.",
        objective: ["1. Split [%]", "2. Split [\"]", "3. Rotate [Ctrl+o]", "4. Swap [}]"],
        requiredActions: ['prefix', '%', 'prefix', '"', 'prefix', 'Control+o', 'prefix', '}'],
        commandsCovered: ['Ctrl+b Ctrl+o', 'Ctrl+b }'],
        hint: "Control your pane positions."
      },
      {
        id: 53,
        title: "Pane Transpose",
        description: "Horizontal to vertical via rotate.",
        objective: ["1. Split [%]", "2. Split [\"]", "3. Toggle [Space]", "4. Rotate [Ctrl+o]"],
        requiredActions: ['prefix', '%', 'prefix', '"', 'prefix', ' ', 'prefix', 'Control+o'],
        commandsCovered: ['Ctrl+b Space', 'Ctrl+b Ctrl+o'],
        hint: "Rearrange everything."
      }
    ]
  },
  {
    id: 7,
    title: "Index Jumps",
    levels: [
      {
        id: 54,
        title: "Quick Jump",
        description: "Flash numbers [q], then press digit to jump.",
        objective: [
          "1. Split Vertically [%]", 
          "2. Split Horizontally [\"]", 
          "3. Flash [q]",
          "4. Jump 0 [0]"
        ],
        requiredActions: ['prefix', '%', 'prefix', '"', 'prefix', 'q', '0'],
        commandsCovered: ['Ctrl+b q <digit>'],
        hint: "Must be fast after 'q'."
      },
      {
        id: 55,
        title: "Jump & Zoom",
        description: "Jump to 1 and zoom.",
        objective: ["1. Split [%]", "2. Flash [q]", "3. Jump 1 [1]", "4. Zoom [z]"],
        requiredActions: ['prefix', '%', 'prefix', 'q', '1', 'prefix', 'z'],
        commandsCovered: ['Ctrl+b q', 'Ctrl+b z'],
        hint: "Navigate then maximize."
      },
      {
        id: 56,
        title: "Jump & Split",
        description: "Jump back to 0 and split.",
        objective: ["1. Split [%]", "2. Flash [q]", "3. Jump 1 [1]", "4. Flash [q]", "5. Jump 0 [0]", "6. Split [\"]"],
        requiredActions: ['prefix', '%', 'prefix', 'q', '1', 'prefix', 'q', '0', 'prefix', '"'],
        commandsCovered: ['Ctrl+b q', 'Ctrl+b "'],
        hint: "Teleport around your workspace."
      },
      {
        id: 57,
        title: "Multi Jump",
        description: "Jump 1, Jump 0, Jump 1.",
        objective: ["1. Split [%]", "2. Jump 1 [1]", "3. Jump 0 [0]", "4. Jump 1 [1]"],
        requiredActions: ['prefix', '%', 'prefix', 'q', '1', 'prefix', 'q', '0', 'prefix', 'q', '1'],
        commandsCovered: ['Ctrl+b q'],
        hint: "Flash indices for every jump."
      },
      {
        id: 58,
        title: "Jump & Kill",
        description: "Jump to 1 and kill it.",
        objective: ["1. Split [%]", "2. Jump 1 [1]", "3. Kill [x]", "4. Confirm [y]"],
        requiredActions: ['prefix', '%', 'prefix', 'q', '1', 'prefix', 'x', 'y'],
        commandsCovered: ['Ctrl+b q', 'Ctrl+b x'],
        hint: "Teleport and destroy."
      },
      {
        id: 59,
        title: "Dojo Master",
        description: "Final Challenge: New Window, Split, Rename, Clock.",
        objective: ["1. New [c]", "2. Split [%]", "3. Rename [,]", "4. Type 'final' + [Enter]", "5. Clock [t]"],
        requiredActions: ['prefix', 'c', 'prefix', '%', 'prefix', ',', 'Enter', 'prefix', 't'],
        commandsCovered: ['Ctrl+b combo'],
        hint: "You have mastered the Dojo. One last flow."
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
