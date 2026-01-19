# Tmux Dojo: Level Management & Creation Rules

This document outlines the standard rules and logical constraints for adding or modifying levels in the `constants.ts` file. Adhering to these ensures a consistent, bug-free, and high-quality user experience.

## 1. Action Naming Conventions
All task objectives must use explicit and consistent terminology. Never use shorthand like "vertical" or "left" alone.

*   **Splits**:
    *   `%` -> "Vertical split [%]"
    *   `"` -> "Horizontal split [\"]"
*   **Navigation**:
    *   `ArrowLeft` -> "Move left [ArrowLeft]"
    *   `ArrowRight` -> "Move right [ArrowRight]"
    *   `ArrowUp` -> "Move up [ArrowUp]"
    *   `ArrowDown` -> "Move down [ArrowDown]"
    *   `o` -> "Next pane [o]"
*   **Utilities**:
    *   `z` -> "Toggle zoom [z]"
    *   `t` -> "Show clock [t]"
    *   `q` -> "Flash pane numbers [q]"
*   **Windows**:
    *   `c` -> "New window [c]"
    *   `n` -> "Next window [n]"
    *   `p` -> "Previous window [p]"
    *   `&` -> "Kill window [&]"
    *   `,` -> "Rename window [,]"

## 2. Logical Flow & Spatial Consistency
Before requiring a navigation action, the level must ensure the target destination actually exists in the current layout.

*   **Move Left/Right**: Only valid if the current pane is part of a **vertical** split and the target index is occupied.
*   **Move Up/Down**: Only valid if the current pane is part of a **horizontal** split.
*   **Zoom Isolation**: Note that moving focus between panes while a pane is **Zoomed** is generally blocked or unpredictable in tmux. Avoid requiring navigation while `isZoomed` is true unless the task is to unzoom first.
*   **Split Focus**: Remember that after a split command (`%` or `"`), tmux automatically moves focus to the **newly created** pane.
    *   *Example*: If you split vertically, you are now in the right pane. To split the left side, you **must** "Move left" first.

## 3. Structural Integrity
Each level in the `LEVEL_DATA` array must be a valid `Level` object.

*   **Required Actions Sync**: The `requiredActions` array must match the key sequence exactly.
    *   A single task line in `objective` might require multiple actions (e.g., "1. Vertical split [%]" requires `['prefix', '%']`).
*   **Group Focus**: Each level group should introduce strictly 1 or 2 related commands.
    *   *The Splits*: Vertical and Horizontal only.
    *   *Navigation*: Arrows and cycling only.
*   **Level IDs**: Maintain a strict incrementing integer sequence for `id`.

## 4. Visual Feedback & Hints
*   **Descriptions**: Use the `description` field for flavor text and context.
*   **Hints**: Use the `hint` field for technical details (e.g., "Shift + 7 for &").
*   **Initial State**: If a level requires a complex starting layout, define it in `initialState`. Otherwise, the app defaults to a single window with one pane.

## 5. Termination & Success
*   The last action in the `requiredActions` array triggers the "LEVEL COMPLETE" screen.
*   If a task involves typing (like renaming), ensure the `requiredActions` includes `Enter` to finalize the buffer.
*   Confirmation prompts (like `x` or `&`) must be followed by `y` in the `requiredActions` array.