# Tmux Dojo: Technical Specification & Implementation Roadmap

This document defines the architectural requirements, scoring logic, and implementation phases for the Tmux Dojo expansion.

## 1. Technical Architecture & Data Syncing
- **Local Priority**: `localStorage` is the primary source of truth. All completions and medal triggers are written to local storage immediately.
- **Sync Behavior**: 
    - **Success Action**: After a local write, if logged in, the app attempts a background update to Supabase.
    - **Failure Action**: If Supabase is unreachable, the app waits silently for the *next* successful completion to retry syncing the entire local state.
- **Leaderboard Fetching**: Opening the leaderboard triggers a fresh `READ` from Supabase to ensure real-time rankings. This is a read-only operation.
- **Conflict Resolution**: `max(local_count, cloud_count)` is used to resolve discrepancies between devices.

## 2. Authentication & Profiles
- **Provider**: Supabase Auth with Google and GitHub OAuth providers.
- **Username**: Defaults to the prefix of the user's email. The UI will expand to accommodate long usernames.
- **UI Entry**: "Log In" (Guest) or "Profile" (Authenticated) button in the header. Authenticated state shows the user's avatar if available.
- **Profiles**: 
    - Public: Username, Rank, Total Points.
    - Private (Modal): Joined date, Medal list with specific emojis.

## 3. Scoring Engine
- **Mastery Points**: 500 pts for the *first* time a level is completed.
- **Memory Points**: 10 pts for every *subsequent* completion (No cap).
- **Total Score**: `(unique_levels * 500) + ((total_completions - unique_levels) * 10)`.

## 4. Achievement System (Medals)
One-time unlocks per account. Represented by Emojis.
1. **The Splitter** 🪓: Perform 20 split actions (vertical or horizontal) in one session (Tab lifetime). Actions count even if the resulting panes are deleted.
2. **Time Lord** 🕒: Open the clock [t] 10 times total (cumulative).
3. **Identity Crisis** 🆔: Flash pane numbers [q] 15 times total (cumulative). Flashing once counts as one action regardless of pane count.
4. **Window Shopper** 🪟: Create 10 windows [c] total (cumulative).
5. **Zero Reset** 🎯: Complete 5 levels **in a row** without ever using the `d+d` reset shortcut. The streak only resets if `d+d` is used *within* a level.

## 5. UI/UX: The HTOP Leaderboard
A full-screen overlay styled after the `htop` terminal utility.
- **Header**: High-contrast bars using `TERMINAL_COLORS` showing global saturation.
- **Main Table**: Columns for `RANK`, `USER`, `MASTER_PTS`, `MEMORY_PTS`, and `MEDALS` (emojis).
- **Footer**: Labels-only command bar (e.g., `F5 REFRESH`, `ESC CLOSE`). Purely for keyboard navigation guidance.

---

## 6. Implementation Task List

### Phase 1: Infrastructure & Data
1.  **Supabase SQL Setup**: Create `profiles` and `progress` tables with RLS policies.
2.  **Supabase Client**: Initialize `supabase.ts` with OAuth config.
3.  **Storage Service**: Implement `syncLocalToCloud()` and dual-write hooks.

### Phase 2: State & Scoring logic
4.  **State Expansion**: Update `AppState` to include cumulative stats (`totalFlashes`, `totalClocks`, etc.) and the `zeroResetStreak`.
5.  **Achievement Engine**: Middleware to check medal conditions on every action and store unlocks in `localStorage`.
6.  **Scoring Utility**: Function to calculate mastery/memory points for the Leaderboard.

### Phase 3: Visuals & Social
7.  **Header Update**: Integrate Auth/Profile buttons with Avatar support.
8.  **HTOP Leaderboard**: Build the full-screen terminal-style table component.
9.  **Profile Modal**: Detailed view for account statistics and medals.
10. **Success Screen Update**: Add medal animations and "Completion X" counts.

---

## 7. SQL Schema
```sql
-- Profiles table for user metadata
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  medals JSONB DEFAULT '[]'::jsonb,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Progress table for level tracking
CREATE TABLE progress (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  level_id INTEGER NOT NULL,
  completion_count INTEGER DEFAULT 1,
  UNIQUE(user_id, level_id)
);
```
