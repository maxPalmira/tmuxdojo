
import React, { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../supabase';
import { storageService } from '../services/storageService';
import { TERMINAL_COLORS, MEDAL_DATA } from '../constants';
import { X, WifiOff } from 'lucide-react';

export const HtopLeaderboard: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    
    if (!isSupabaseConfigured || !supabase) {
      const local = storageService.getLocal();
      const uniqueLevels = Object.keys(local.completionCounts).length;
      const totalCompletions = Object.values(local.completionCounts).reduce((a, b) => a + b, 0);
      const mastery = uniqueLevels * 500;
      const memory = (totalCompletions - uniqueLevels) * 10;

      setData([{
        username: 'Guest (Local)',
        mastery,
        memory,
        total: mastery + memory,
        medals: local.medals
      }]);
      setLoading(false);
      return;
    }

    try {
      const { data: progress } = await supabase.from('progress').select('user_id, level_id, completion_count');
      const { data: profiles } = await supabase.from('profiles').select('id, username, medals');

      if (!progress || !profiles) return;

      const userStats = profiles.map(profile => {
        const userProgress = progress.filter(p => p.user_id === profile.id);
        const uniqueLevels = userProgress.length;
        const totalCompletions = userProgress.reduce((acc, p) => acc + p.completion_count, 0);
        const mastery = uniqueLevels * 500;
        const memory = (totalCompletions - uniqueLevels) * 10;
        return {
          username: profile.username,
          mastery,
          memory,
          total: mastery + memory,
          medals: profile.medals || []
        };
      });

      setData(userStats.sort((a, b) => b.total - a.total));
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 z-[500] bg-black text-[#a9b1d6] font-mono flex flex-col p-1 border-2 border-[#7aa2f7]">
      {/* Ninjaboard Header */}
      <div className="flex items-center justify-between p-4 border-b border-[#414868] bg-[#1a1b26] flex-shrink-0">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-black text-[#7aa2f7] uppercase tracking-[0.2em] italic">Tmux Dojo Ninjaboard</h2>
          {!isSupabaseConfigured && (
            <div className="text-rose-400 flex items-center gap-1 uppercase font-bold text-[10px]">
              <WifiOff size={12}/> Offline Buffer
            </div>
          )}
        </div>
        <button 
          onClick={onClose} 
          className="p-2 hover:bg-[#414868] rounded transition-colors text-[#7aa2f7]"
          title="Quit View (ESC)"
        >
          <X size={24} />
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto no-scrollbar py-2">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#414868] text-white text-[11px] uppercase font-black">
              <th className="px-6 py-2">Rank</th>
              <th className="px-6 py-2">Ninja Username</th>
              <th className="px-6 py-2 text-right">Mastery Pts</th>
              <th className="px-6 py-2 text-right">Memory Pts</th>
              <th className="px-6 py-2 text-right">Total Score</th>
              <th className="px-6 py-2">Medal Vault</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {loading ? (
              <tr><td colSpan={6} className="p-20 text-center animate-pulse text-[#7aa2f7] uppercase font-bold tracking-widest">Accessing Ninja Records...</td></tr>
            ) : data.map((user, i) => (
              <tr key={user.username} className={`transition-colors ${i % 2 === 0 ? 'bg-[#1a1b26]' : 'bg-[#1e2233]'} hover:bg-[#24283b]`}>
                <td className="px-6 py-1.5 text-green-400 font-bold">{i + 1}</td>
                <td className="px-6 py-1.5 text-white font-bold">{user.username}</td>
                <td className="px-6 py-1.5 text-right text-blue-400">{user.mastery}</td>
                <td className="px-6 py-1.5 text-right text-cyan-400">{user.memory}</td>
                <td className="px-6 py-1.5 text-right text-yellow-400 font-black">{user.total}</td>
                <td className="px-6 py-1.5 space-x-2">
                  {user.medals.map((m: string) => (
                    <span 
                      key={m} 
                      className="inline-block cursor-help" 
                      title={`${MEDAL_DATA[m]?.name}: ${MEDAL_DATA[m]?.desc}`}
                    >
                      {MEDAL_DATA[m]?.emoji || '🎖️'}
                    </span>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Simplified Footer Tip */}
      <div className="p-2 text-center text-[9px] uppercase tracking-widest text-[#414868] font-bold border-t border-[#414868]">
        Press ESC to exit Ninjaboard View
      </div>
    </div>
  );
};
