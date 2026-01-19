
import { supabase, isSupabaseConfigured } from '../supabase';

const LOCAL_STORAGE_KEY = 'tmux_dojo_progress';

export type LocalData = {
  completionCounts: Record<number, number>;
  medals: string[];
  stats: {
    totalClocks: number;
    totalFlashes: number;
    totalWindows: number;
  };
};

export const storageService = {
  getLocal(): LocalData {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    return data ? JSON.parse(data) : { completionCounts: {}, medals: [], stats: { totalClocks: 0, totalFlashes: 0, totalWindows: 0 } };
  },

  setLocal(data: LocalData) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
  },

  async syncToCloud(userId: string, data: LocalData) {
    if (!isSupabaseConfigured || !supabase) return;
    try {
      await supabase.from('profiles').update({
        medals: data.medals,
      }).eq('id', userId);

      const progressEntries = Object.entries(data.completionCounts).map(([levelId, count]) => ({
        user_id: userId,
        level_id: parseInt(levelId),
        completion_count: count
      }));

      if (progressEntries.length > 0) {
        await supabase.from('progress').upsert(progressEntries, { onConflict: 'user_id,level_id' });
      }
    } catch (e) {
      console.error("Cloud sync failed", e);
    }
  },

  async fetchAndMerge(userId: string): Promise<LocalData> {
    const local = this.getLocal();
    if (!isSupabaseConfigured || !supabase) return local;
    
    try {
      const { data: cloudProgress } = await supabase.from('progress').select('level_id, completion_count').eq('user_id', userId);
      const { data: cloudProfile } = await supabase.from('profiles').select('medals').eq('id', userId).single();

      const mergedCounts = { ...local.completionCounts };
      cloudProgress?.forEach(p => {
        mergedCounts[p.level_id] = Math.max(mergedCounts[p.level_id] || 0, p.completion_count);
      });

      const mergedMedals = Array.from(new Set([...local.medals, ...(cloudProfile?.medals || [])]));

      const merged = { ...local, completionCounts: mergedCounts, medals: mergedMedals };
      this.setLocal(merged);
      return merged;
    } catch (e) {
      console.error("Merge failed", e);
      return local;
    }
  }
};
