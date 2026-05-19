import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Flame } from 'lucide-react';

const StreakCounter = ({ refreshTrigger }) => {
  const [streak, setStreak] = useState(0);
  const { apiUrl, token } = useContext(AuthContext);

  useEffect(() => {
    const fetchStreak = async () => {
      try {
        const res = await fetch(`${apiUrl}/stats/streak`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setStreak(data.streak);
        }
      } catch (err) {
        console.error('Failed to fetch streak', err);
      }
    };
    fetchStreak();
  }, [apiUrl, token, refreshTrigger]);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex items-center justify-between shadow-lg">
      <div>
        <h3 className="text-zinc-400 text-sm font-medium uppercase tracking-wider mb-1">Current Streak</h3>
        <p className="text-3xl font-bold text-white">{streak} Days</p>
      </div>
      <div className={`p-4 rounded-full ${streak > 0 ? 'bg-orange-500/20 text-orange-500 animate-pulse' : 'bg-zinc-800 text-zinc-500'}`}>
        <Flame size={32} />
      </div>
    </div>
  );
};

export default StreakCounter;
