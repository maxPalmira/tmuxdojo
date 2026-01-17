import { Level, LayoutNode } from './types';

const createPane = (id: string): LayoutNode => ({ type: 'pane', id });

export const PREFIX_KEY = 'b'; // Ctrl + b
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

export const LEVELS: Level[] = [
  {
    id: 1,
    title: "Split Vertically",
    description: "Welcome to the Dojo! In tmux, all commands start with a **Prefix** (master key). The default is **Ctrl+b**. This 'arms' the terminal. Once armed, pressing **%** creates a vertical split.",
    objective: "Activate the Prefix (Ctrl+b), then press % to split vertically.",
    requiredActions: ['prefix', '%'],
    commandsCovered: ['Ctrl+b %'],
    hint: "Hold 'Control' and press 'b', then press Shift+5 (%)"
  },
  {
    id: 2,
    title: "The Triple Split",
    description: "You can keep splitting panes as long as there is room.",
    objective: "Split the current pane vertically twice.",
    requiredActions: ['prefix', '%', 'prefix', '%'],
    commandsCovered: ['Ctrl+b %'],
    hint: "Ctrl+b, %, Ctrl+b, %."
  },
  {
    id: 3,
    title: "Split Horizontally",
    description: "Horizontal splits are great for log monitoring. Use \".",
    objective: "Prefix then \" to split horizontally.",
    requiredActions: ['prefix', '"'],
    commandsCovered: ['Ctrl+b "'],
    hint: "Ctrl+b, then Shift+'."
  },
  {
    id: 4,
    title: "The Stacked Row",
    description: "Stacking horizontal panes helps watch multiple outputs.",
    objective: "Split the current pane horizontally twice.",
    requiredActions: ['prefix', '"', 'prefix', '"'],
    commandsCovered: ['Ctrl+b "'],
    hint: "Ctrl+b, \", Ctrl+b, \"."
  },
  {
    id: 5,
    title: "The Quadrant",
    description: "Ultimate control over terminal real estate.",
    objective: "Split vertically, then split horizontally.",
    requiredActions: ['prefix', '%', 'prefix', '"'],
    commandsCovered: ['Ctrl+b %', 'Ctrl+b "'],
    hint: "Ctrl+b, %, then Ctrl+b, \"."
  },
  {
    id: 6,
    title: "Basic Navigation",
    description: "Prefix + Arrow Keys to move focus instantly between panes.",
    objective: "Move to the right pane.",
    requiredActions: ['prefix', 'ArrowRight'],
    commandsCovered: ['Ctrl+b Arrows'],
    hint: "Ctrl+b, then Right Arrow.",
    initialState: {
      activeWindowIndex: 0,
      windows: [{
        id: 'win-7', name: 'bash', activePaneId: 'p1',
        layout: {
          type: 'split', direction: 'vertical',
          children: [{ type: 'pane', id: 'p1' }, { type: 'pane', id: 'p2' }]
        }
      }]
    }
  },
  {
    id: 7,
    title: "The Circle Path",
    description: "Mastering navigation means reaching any pane instantly without looking.",
    objective: "Move Right, then Move Left.",
    requiredActions: ['prefix', 'ArrowRight', 'prefix', 'ArrowLeft'],
    commandsCovered: ['Ctrl+b Arrows'],
    hint: "Ctrl+b, Right, Ctrl+b, Left.",
    initialState: {
      activeWindowIndex: 0,
      windows: [{
        id: 'win-8', name: 'bash', activePaneId: 'p1',
        layout: {
          type: 'split', direction: 'vertical',
          children: [
            { type: 'pane', id: 'p1' },
            { 
              type: 'split', direction: 'horizontal',
              children: [{ type: 'pane', id: 'p2' }, { type: 'pane', id: 'p3' }]
            }
          ]
        }
      }]
    }
  },
  {
    id: 8,
    title: "The New Frontier",
    description: "Windows are like browser tabs. c creates a fresh window.",
    objective: "Create a new window using c.",
    requiredActions: ['prefix', 'c'],
    commandsCovered: ['Ctrl+b c'],
    hint: "Ctrl+b, then 'c'."
  },
  {
    id: 9,
    title: "Expansion Pack",
    description: "Organize your projects into different windows for better focus.",
    objective: "Create two new windows in a row.",
    requiredActions: ['prefix', 'c', 'prefix', 'c'],
    commandsCovered: ['Ctrl+b c'],
    hint: "Ctrl+b, c, Ctrl+b, c."
  },
  {
    id: 10,
    title: "Window Backtrack",
    description: "p takes you to the Previous window in your list.",
    objective: "Go to the previous window using p.",
    requiredActions: ['prefix', 'p'],
    commandsCovered: ['Ctrl+b p'],
    hint: "Ctrl+b, then 'p'.",
    initialState: {
      activeWindowIndex: 1,
      windows: [
        { id: 'w1', name: 'logs', layout: { type: 'pane', id: 'lp1' }, activePaneId: 'lp1' },
        { id: 'w2', name: 'editor', layout: { type: 'pane', id: 'ep1' }, activePaneId: 'ep1' }
      ]
    }
  },
  {
    id: 11,
    title: "The Jumper",
    description: "Rapidly cycle through windows to check background status.",
    objective: "Go to Previous window twice.",
    requiredActions: ['prefix', 'p', 'prefix', 'p'],
    commandsCovered: ['Ctrl+b p'],
    hint: "Ctrl+b, p, Ctrl+b, p.",
    initialState: {
      activeWindowIndex: 2,
      windows: [
        { id: 'w1', name: 'shell-1', layout: { type: 'pane', id: 'p1' }, activePaneId: 'p1' },
        { id: 'w2', name: 'shell-2', layout: { type: 'pane', id: 'p2' }, activePaneId: 'p2' },
        { id: 'w3', name: 'shell-3', layout: { type: 'pane', id: 'p3' }, activePaneId: 'p3' }
      ]
    }
  },
  {
    id: 12,
    title: "Remote Work",
    description: "Open a new window and split it immediately to start a sub-task.",
    objective: "New window, then split it vertically.",
    requiredActions: ['prefix', 'c', 'prefix', '%'],
    commandsCovered: ['Ctrl+b c', 'Ctrl+b %'],
    hint: "Ctrl+b, c, then Ctrl+b, %."
  },
  {
    id: 13,
    title: "Termination",
    description: "When finished with a pane, x initiates a kill confirmation.",
    objective: "Kill current pane with x and confirm with y.",
    requiredActions: ['prefix', 'x', 'y'],
    commandsCovered: ['Ctrl+b x', 'y'],
    hint: "Ctrl+b, x, then 'y'.",
    initialState: {
      activeWindowIndex: 0,
      windows: [{
        id: 'w14', name: 'bash', activePaneId: 'kp2',
        layout: {
          type: 'split', direction: 'vertical',
          children: [{ type: 'pane', id: 'kp1' }, { type: 'pane', id: 'kp2' }]
        }
      }]
    }
  },
  {
    id: 14,
    title: "Mass Cleanup",
    description: "Close multiple panes efficiently to tidy up your workspace.",
    objective: "Kill pane twice (x,y,x,y).",
    requiredActions: ['prefix', 'x', 'y', 'prefix', 'x', 'y'],
    commandsCovered: ['Ctrl+b x', 'y'],
    hint: "Repeat the kill sequence twice.",
    initialState: {
      activeWindowIndex: 0,
      windows: [{
        id: 'w15', name: 'bash', activePaneId: 'kp3',
        layout: {
          type: 'split', direction: 'vertical',
          children: [
            { type: 'pane', id: 'kp1' },
            { 
              type: 'split', direction: 'horizontal',
              children: [{ type: 'pane', id: 'kp2' }, { type: 'pane', id: 'kp3' }]
            }
          ]
        }
      }]
    }
  },
  {
    id: 15,
    title: "The Command Deck",
    description: "The : key opens the command prompt at the bottom of the screen.",
    objective: "Open command mode using :.",
    requiredActions: ['prefix', ':'],
    commandsCovered: ['Ctrl+b :'],
    hint: "Ctrl+b, then ':'."
  },
  {
    id: 16,
    title: "Command Discipline",
    description: "Entering command mode for session management and configuration.",
    objective: "Open command mode twice.",
    requiredActions: ['prefix', ':', 'prefix', ':'],
    commandsCovered: ['Ctrl+b :'],
    hint: "Ctrl+b, :, then do it again."
  },
  {
    id: 17,
    title: "The Multi-Tool",
    description: "Navigate, modify, and clean your terminal environment in one flow.",
    objective: [
      "1. Split Vertically (%)",
      "2. Move Left (ArrowLeft)",
      "3. Split Horizontally (\")",
      "4. Kill Pane (x)",
      "5. Confirm (y)"
    ],
    requiredActions: ['prefix', '%', 'prefix', 'ArrowLeft', 'prefix', '"', 'prefix', 'x', 'y'],
    commandsCovered: ['Ctrl+b %', 'Ctrl+b "', 'Ctrl+b Arrows', 'Ctrl+b x', 'y'],
    hint: "Carefully follow the numbered sequence."
  },
  {
    id: 18,
    title: "The Window Weaver",
    description: "Coordinate across multiple windows and panes effortlessly.",
    objective: [
      "1. New Window (c)",
      "2. Split Vertically (%)",
      "3. Previous Window (p)",
      "4. Split Horizontally (\")"
    ],
    requiredActions: ['prefix', 'c', 'prefix', '%', 'prefix', 'p', 'prefix', '"'],
    commandsCovered: ['Ctrl+b c', 'Ctrl+b %', 'Ctrl+b p', 'Ctrl+b "'],
    hint: "Switch windows and split immediately."
  },
  {
    id: 19,
    title: "Project Setup Boss",
    description: "Setup logs, dev, and database console in record time.",
    objective: [
      "1. Split Vertically (%)",
      "2. Move Right (ArrowRight)",
      "3. Split Horizontally (\")",
      "4. New Window (c)",
      "5. Split Vertically (%)"
    ],
    requiredActions: ['prefix', '%', 'prefix', 'ArrowRight', 'prefix', '"', 'prefix', 'c', 'prefix', '%'],
    commandsCovered: ['Ctrl+b %', 'Ctrl+b "', 'Ctrl+b Arrows', 'Ctrl+b c'],
    hint: "Go fast! Muscle memory is forming."
  },
  {
    id: 20,
    title: "Focus: Zoom Mode",
    description: "z toggles zoom for the current pane, maximizing it to fill the whole window.",
    objective: "Prefix then z to toggle zoom.",
    requiredActions: ['prefix', 'z'],
    commandsCovered: ['Ctrl+b z'],
    hint: "Ctrl+b, then 'z'.",
    initialState: {
      activeWindowIndex: 0,
      windows: [{
        id: 'w21', name: 'dev', activePaneId: 'p1',
        layout: {
          type: 'split', direction: 'vertical',
          children: [{ type: 'pane', id: 'p1' }, { type: 'pane', id: 'p2' }]
        }
      }]
    }
  },
  {
    id: 21,
    title: "The Next Window",
    description: "n switches to the next window. Faster than jumping by index manually.",
    objective: "Prefix then n to go to next window.",
    requiredActions: ['prefix', 'n'],
    commandsCovered: ['Ctrl+b n'],
    hint: "Ctrl+b, then 'n'.",
    initialState: {
      activeWindowIndex: 0,
      windows: [
        { id: 'w1', name: 'shell', layout: { type: 'pane', id: 'p1' }, activePaneId: 'p1' },
        { id: 'w2', name: 'logs', layout: { type: 'pane', id: 'p2' }, activePaneId: 'p2' }
      ]
    }
  },
  {
    id: 22,
    title: "Detaching Session",
    description: "d detaches the current session. Tmux keeps it running in the background.",
    objective: "Prefix then d to detach.",
    requiredActions: ['prefix', 'd'],
    commandsCovered: ['Ctrl+b d'],
    hint: "Ctrl+b, then 'd'."
  },
  {
    id: 23,
    title: "Enter Copy Mode",
    description: "[ enters copy mode, allowing you to scroll back through history.",
    objective: "Prefix then [ to enter copy mode.",
    requiredActions: ['prefix', '['],
    commandsCovered: ['Ctrl+b ['],
    hint: "Ctrl+b, then '['.",
    initialState: {
      activeWindowIndex: 0,
      windows: [{ id: 'w24', name: 'bash', layout: createPane('p24'), activePaneId: 'p24' }],
      paneContents: { 'p24': ['Line 1: Log initialization...', 'Line 2: Server started on port 3000', 'Line 3: Database connected', 'Line 4: Incoming request GET /', 'Line 5: 200 OK', 'Line 6: Incoming request POST /login', 'Line 7: Auth successful', 'Line 8: User session created', 'Line 9: Cache miss for key: user_data', 'Line 10: DB Query took 45ms', 'Line 11: Rendered dashboard in 12ms', 'Line 12: Connection closed by remote', 'Line 13: Memory usage: 154MB', 'Line 14: CPU usage: 5%', 'Line 15: Waiting for input...'] }
    }
  },
  {
    id: 24,
    title: "Rename Window",
    description: ", lets you rename the current window for better organization.",
    objective: "Prefix then , to rename window.",
    requiredActions: ['prefix', ','],
    commandsCovered: ['Ctrl+b ,'],
    hint: "Ctrl+b, then ','."
  },
  {
    id: 25,
    title: "Show Clock",
    description: "t shows a large digital clock in the center of your active pane.",
    objective: "Prefix then t to show clock.",
    requiredActions: ['prefix', 't'],
    commandsCovered: ['Ctrl+b t'],
    hint: "Ctrl+b, then 't'."
  },
  {
    id: 26,
    title: "Identify Panes",
    description: "q briefly displays pane index numbers over each pane for reference.",
    objective: "Prefix then q to show indices.",
    requiredActions: ['prefix', 'q'],
    commandsCovered: ['Ctrl+b q'],
    hint: "Ctrl+b, then 'q'.",
    initialState: {
      activeWindowIndex: 0,
      windows: [{
        id: 'w27', name: 'bash', activePaneId: 'p1',
        layout: {
          type: 'split', direction: 'vertical',
          children: [{ type: 'pane', id: 'p1' }, { type: 'pane', id: 'p2' }]
        }
      }]
    }
  },
  {
    id: 27,
    title: "Kill Window",
    description: "& kills the current window and all its panes entirely.",
    objective: "Prefix then & and confirm with y.",
    requiredActions: ['prefix', '&', 'y'],
    commandsCovered: ['Ctrl+b &', 'y'],
    hint: "Ctrl+b, then Shift+7 (&)."
  },
  {
    id: 28,
    title: "Rotate Panes",
    description: "o cycles the focus to the next pane in the current window layout.",
    objective: "Prefix then o to rotate focus.",
    requiredActions: ['prefix', 'o'],
    commandsCovered: ['Ctrl+b o'],
    hint: "Ctrl+b, then 'o'.",
    initialState: {
      activeWindowIndex: 0,
      windows: [{
        id: 'w29', name: 'bash', activePaneId: 'p1',
        layout: {
          type: 'split', direction: 'vertical',
          children: [{ type: 'pane', id: 'p1' }, { type: 'pane', id: 'p2' }]
        }
      }]
    }
  },
  {
    id: 29,
    title: "Cycle Layouts",
    description: "Space cycles through preset pane layouts like tiled or stacked.",
    objective: "Prefix then Space to cycle layout.",
    requiredActions: ['prefix', ' '],
    commandsCovered: ['Ctrl+b Space'],
    hint: "Ctrl+b, then Spacebar.",
    initialState: {
      activeWindowIndex: 0,
      windows: [{
        id: 'w30', name: 'dev', activePaneId: 'p1',
        layout: {
          type: 'split', direction: 'vertical',
          children: [{ type: 'pane', id: 'p1' }, { type: 'pane', id: 'p2' }]
        }
      }]
    }
  },
  {
    id: 30,
    title: "Swap Panes",
    description: "{ and } swap the current pane with the previous or next one.",
    objective: "Prefix then { to swap pane.",
    requiredActions: ['prefix', '{'],
    commandsCovered: ['Ctrl+b {'],
    hint: "Ctrl+b, then Shift+[ ({).",
    initialState: {
      activeWindowIndex: 0,
      windows: [{
        id: 'w31', name: 'bash', activePaneId: 'p1',
        layout: {
          type: 'split', direction: 'vertical',
          children: [{ type: 'pane', id: 'p1' }, { type: 'pane', id: 'p2' }]
        }
      }]
    }
  },
  {
    id: 31,
    title: "New Session Intro",
    description: "Sessions are top-level containers. You can create one with :new.",
    objective: "Prefix then : to enter command mode.",
    requiredActions: ['prefix', ':'],
    commandsCovered: ['Ctrl+b :'],
    hint: "Prepare to learn session management."
  },
  {
    id: 32,
    title: "List Sessions",
    description: "s shows an interactive list of all active tmux sessions.",
    objective: "Prefix then s to list sessions.",
    requiredActions: ['prefix', 's'],
    commandsCovered: ['Ctrl+b s'],
    hint: "Ctrl+b, then 's'."
  },
  {
    id: 33,
    title: "Find Window",
    description: "f allows you to search for windows by name or content.",
    objective: "Prefix then f to find window.",
    requiredActions: ['prefix', 'f'],
    commandsCovered: ['Ctrl+b f'],
    hint: "Ctrl+b, then 'f'."
  },
  {
    id: 34,
    title: "Move Window",
    description: ". allows you to move the current window to a different index.",
    objective: "Prefix then . to move window.",
    requiredActions: ['prefix', '.'],
    commandsCovered: ['Ctrl+b .'],
    hint: "Ctrl+b, then '.'"
  },
  {
    id: 35,
    title: "Show Active Windows",
    description: "w shows an interactive list of all windows in the session.",
    objective: "Prefix then w to list windows.",
    requiredActions: ['prefix', 'w'],
    commandsCovered: ['Ctrl+b w'],
    hint: "Ctrl+b, then 'w'."
  },
  {
    id: 36,
    title: "Rename Session",
    description: "$ allows you to rename the current session.",
    objective: "Prefix then $ to rename session.",
    requiredActions: ['prefix', '$'],
    commandsCovered: ['Ctrl+b $'],
    hint: "Ctrl+b, then Shift+4 ($)."
  },
  {
    id: 37,
    title: "Switch Last Session",
    description: "L switches back to the most recently active session.",
    objective: "Prefix then L to switch session.",
    requiredActions: ['prefix', 'L'],
    commandsCovered: ['Ctrl+b L'],
    hint: "Ctrl+b, then Shift+L.",
    initialState: {
      activeWindowIndex: 0,
      windows: [{
        id: 'w38', name: 'main', activePaneId: 'p1',
        layout: {
          type: 'split', direction: 'vertical',
          children: [{ type: 'pane', id: 'p1' }, { type: 'pane', id: 'p2' }]
        }
      }]
    }
  },
  {
    id: 38,
    title: "Advanced Combo A",
    description: "Combine zooming and window navigation.",
    objective: [
      "1. Toggle Zoom (z)",
      "2. Create New Window (c)",
      "3. Go to Previous Window (p)",
      "4. Toggle Zoom again (z)"
    ],
    requiredActions: ['prefix', 'z', 'prefix', 'c', 'prefix', 'p', 'prefix', 'z'],
    commandsCovered: ['Ctrl+b z', 'Ctrl+b c', 'Ctrl+b p'],
    hint: "Zoom, New, Back, Unzoom.",
    initialState: {
      activeWindowIndex: 0,
      windows: [{
        id: 'w39', name: 'main', activePaneId: 'p1',
        layout: {
          type: 'split', direction: 'vertical',
          children: [{ type: 'pane', id: 'p1' }, { type: 'pane', id: 'p2' }]
        }
      }]
    }
  },
  {
    id: 39,
    title: "Advanced Combo B",
    description: "Organizing workspace dynamically with renames and splits.",
    objective: [
      "1. Rename Window (,)",
      "2. Split Vertically (%)",
      "3. Open Command Mode (:)",
      "4. Split Horizontally (\")"
    ],
    requiredActions: ['prefix', ',', 'prefix', '%', 'prefix', ':', 'prefix', '"'],
    commandsCovered: ['Ctrl+b ,', 'Ctrl+b %', 'Ctrl+b :', 'Ctrl+b "'],
    hint: "Rename, V-Split, Command, H-Split."
  },
  {
    id: 40,
    title: "Ultimate Tmux Grandmaster",
    description: "You have conquered all 40 levels of the Dojo.",
    objective: "Final Prefix activation.",
    requiredActions: ['prefix'],
    commandsCovered: ['All'],
    hint: "One last Ctrl+b."
  }
];